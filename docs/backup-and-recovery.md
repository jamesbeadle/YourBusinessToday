# Backup and recovery for a Supabase project

The playbook every Supabase project of ours follows. The question it answers: a script
runs `delete from` without a `where`, a migration drops the wrong column, or the project
itself is deleted — what is the route back, how far back does it reach, and what does it
cost? The project-specific details (which secrets, which buckets) live in each
repository's admin runbook.

## The three layers

| Layer | What it is | How far back | Data lost at worst | Survives the project being deleted | Cost |
| --- | --- | --- | --- | --- | --- |
| 1. Daily backups | Supabase's own snapshot, on every Pro project | 7 days (Pro), 14 (Team) | up to 24 hours | **No** | included |
| 2. Nightly off-site copy | `scripts/backup-supabase.sh` from a GitHub Action: database dump + every Storage file, encrypted | 35 days (any length we choose) | up to 24 hours | **Yes** | pennies (GitHub artifact storage) |
| 3. Point-in-time recovery | Supabase add-on: WAL archived every 2 minutes | 7 / 14 / 28 days | about 2 minutes | **No** | ~$100 / $200 / $400 a month per project, and at least Small compute |

What each layer cannot do, which is why there are three:

- **Layers 1 and 3 restore the whole project, in place.** Everything written after the
  restore point is lost for every user, and the project is down while it runs. They also
  hold no Storage files — only the rows that point at them — and they are deleted with the
  project.
- **Layer 2 is the one that can put back just what was lost.** A dump can hand back one
  table's rows while the live project keeps running, and it sits outside Supabase. It is a
  night old at worst.
- **Layer 3 is the only one that loses minutes rather than a day.** It is also the only
  one that costs real money, and turning it on stops Supabase taking layer 1's daily
  backups (PITR replaces them).

## Which layers a project gets

1. **Every Pro project** has layer 1 already. Nothing to do but know it is there.
2. **Every project holding data someone would miss** gets layer 2: copy
   `scripts/backup-supabase.sh` and `.github/workflows/backup.yml`, set `BACKUP_NAME`, add
   the secrets below. This is the answer to "a delete-all script ran", and it is the only
   layer that survives the project being deleted.
3. **Layer 3 when losing a day of writes is itself unaffordable** — paying customers
   writing throughout the day, where "we restored last night's copy" is a failure they
   would notice. For a project with a handful of accounts and no revenue, $100 a month buys
   little that layer 2 does not. Turn it on in the dashboard: Project Settings → Add-ons →
   Point in Time Recovery, choose 7 days; upgrade compute to Small first if it asks.

## Setting up layer 2

Secrets (repository → Settings → Secrets and variables → Actions):

- `SUPABASE_DB_URL` — Dashboard → Connect → **Session pooler** string. GitHub's runners
  have no IPv6, so the direct `db.<ref>.supabase.co` host will not connect.
- `BACKUP_PASSPHRASE` — a long random passphrase. **Keep a second copy in the password
  manager.** Without it every backup is unreadable; if it lives only in GitHub, losing
  GitHub loses the backups too.
- `SUPABASE_S3_ACCESS_KEY_ID`, `SUPABASE_S3_SECRET_ACCESS_KEY` — Dashboard → Storage →
  S3 Configuration → New access key. Plus the variable `SUPABASE_REGION` (e.g.
  `eu-west-2`) and `PUBLIC_SUPABASE_URL`. A project with no buckets sets `SKIP_STORAGE: true`
  in the workflow instead.

Then Actions → backup → **Run workflow**, and check the run lists the tables and objects
it copied and ends with an artifact. GitHub emails the person who last changed the
workflow when a scheduled run fails.

## Recovering

Download and open a backup (Actions → the run → Artifacts), with a Postgres 17 client:

```sh
unzip <artifact>.zip
gpg --decrypt <name>-<timestamp>.tar.gpg | tar -xf -   # asks for the passphrase
# database.dump, database.contents (what is in it), storage/<bucket>/…
```

**Rows or a table were deleted** — put them back without touching anything else. For a
table `tasks` (repeat per table, parents before children):

```sh
pg_restore --data-only --table=tasks --file=- database.dump \
  | sed 's/^COPY public\.tasks /COPY recovery.tasks /' > tasks-rows.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 \
  -c "create schema recovery; create table recovery.tasks (like public.tasks);" \
  -f tasks-rows.sql \
  -c "insert into public.tasks select * from recovery.tasks on conflict (id) do nothing;" \
  -c "drop schema recovery cascade;"
```

Rows still present are left alone; only the missing ones come back. Files deleted from
Storage come back with `aws s3 cp storage/<bucket>/<path> s3://<bucket>/<path>` against
the Storage endpoint.

**The whole database is wrong** (a bad migration) — restore in place from layer 3 (any
second in the window) or layer 1 (last night): Dashboard → Database → Backups. To look
before you leap, **Restore to new project** clones a backup into a fresh project instead,
and the recipe above then copies rows across from it.

**The project is gone** — create a new project, apply the repository's migrations, then
`pg_restore --data-only --no-owner --schema=public --schema=auth -d "$NEW_DB_URL"
database.dump`, upload `storage/` with `aws s3 sync`, and point the app's environment at
the new project. Rehearse this on a scratch project before it is needed — twice a year,
and write down the date and how long it took in the admin runbook.
