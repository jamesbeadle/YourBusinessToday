# The Builder — Architecture

How an accepted feature request becomes a pull request, and a merged pull request becomes
a message to the client saying it is live — with no repository pulled by hand, no prompt
retyped, and one human decision kept in the loop: the schema.

This is the piece that turns YBT from a register of what clients want into the thing that
delivers it. It adds one actor and almost no domain. The client's words already live on
the request; the work already lives on the task; the code's home already lives on the
project (`repository_url`, `environment_url`). What is missing is a worker that reads
those and acts, and a handful of columns that say where it got to.

## The actors

- **Staff** — us. Reviews the ask, writes the brief, sizes it, presses the button, and is
  the only one who ever applies a migration.
- **Client contact** — raised the request; reads the thread; learns when it is live.
- **The Builder** — a Claude Code [routine](https://code.claude.com/docs/en/routines): a
  saved prompt, the client repositories, and the YBT connector, run as an autonomous cloud
  session on Anthropic's infrastructure. There are three, one per licence, and the size
  of the task decides which one is called. Each acts through the YBT connector as the
  staff member who connected it, so to the domain a build is staff work.

Nothing here needs a machine of ours to be on. The routine clones the repository itself,
works on a `claude/` branch, opens the pull request, and the pipeline in the repository
does the rest.

## The stories

| As | I want | So that |
| --- | --- | --- |
| Staff | to rewrite the brief before anything builds, with the client's words left untouched on the request | the Builder works from words I have checked, and the client can still see exactly what they asked for |
| Staff | the size I give a task to choose which licence builds it | hard work goes to the strongest model without me routing by hand |
| Staff | accepting a request and sending it to build to be one act | promotion and dispatch are not two screens |
| Staff | to see on the task where the build is — queued, building, in review, live, failed — with the pull request and the run | I never open GitHub to find out |
| Staff | to be the only one who applies a schema change, while everything else ships itself when checks pass | a client never loses data to an unreviewed migration; code can be rolled back, data cannot |
| Staff | one list of builds waiting on me | the migration reviews are never lost among the rest |
| Staff | to send a failed build again after fixing the brief | a bad first attempt costs one edit, not a new task |
| Client contact | to be told in my own request's thread when it is live, with the address | I stop asking |
| The Builder | the brief, the acceptance criteria, where the code lives and where it runs, in one call | the run starts with everything and asks for nothing |
| The Builder | to say what it did — the pull request, whether it touched the schema, or why it failed — in one call | the outcome lands on the task without a human copying links |

Everything below is demanded by exactly these stories.

## The views

No new pages. Every story lands on a view that already exists.

- `/requests/[requestId]` — the Promote button becomes **Accept and build**. Above it: the
  brief, a textarea prefilled from the story (role, want, benefit) and the body, which
  staff edit freely; and the story-point picker (1 2 3 5 8 13 21). The client's words
  above the form are unchanged and stay so. Pressing the button creates the task, stores
  the brief, and dispatches it; the row then links to the task as it does today.
- `/projects/[projectId]/tasks/[taskId]` — gains a **Build** panel: the status pill, the
  tier the size implies, the brief (editable while not building), the pull request link,
  the run link, the environment link once live, and one button that reads **Send to
  build** or **Build again** depending on state. When the Builder reports a schema change
  the panel says so and names the label GitHub is waiting for.
- `/projects/[projectId]` — each backlog row gains the build status pill beside the task
  status pill. Internal projects with no `repository_url` show nothing; there is nothing
  to build against.
- `/tasks` — gains a **Waiting on me** filter: builds in review that carry a migration.
- `/portal/requests/[requestId]` — the status line reads **Live** with the environment
  link once the task is live. A contact sees only that; never the pull request.
- `/clients/[clientId]` — the ledger gains two kinds: build dispatched, build live.

## Site map

Unchanged from [client-lifecycle-architecture.md](./client-lifecycle-architecture.md).
`/requests/[requestId]` remains the hinge, and now it is also the launch point: the only
place a client's words become work *and* the work starts. `/tasks?waiting=me` is a filter
on an existing view, not a page.

## The flow

```
client raises request ──▶ staff: brief + size ──▶ Accept and build
                                                      │
                                    YBT fires the tier's routine with the task id
                                                      │
                          Builder: claim_build ──▶ clone, branch, implement, checks, push
                                                      │
                                      pull request opened, auto-merge armed
                                                      │
                             ┌────────────────────────┴────────────────────────┐
                    no migration files                              migration files touched
                             │                                                 │
                    checks pass ──▶ merges                    migration-gate check fails ──▶
                             │                                staff review the SQL, apply it,
                             │                                label migration-reviewed ──▶ merges
                             └────────────────────────┬────────────────────────┘
                                                      │
                                Vercel deploys main; GitHub webhook ──▶ YBT
                                                      │
                          task live; the client's thread says so, with the address
```

## The entities

**Task** — `public.tasks`, extended. Gains:

- `build_brief` — staff's words for the Builder. Starts as the story and body; edited
  freely. Distinct from `details`, which is the task's own description, and from the
  request's `body`, which is the client's and is never edited.
- `build_status` — `not_sent`, `queued`, `building`, `in_review`, `live`, `failed`.
  `not_sent` is the default and the state of every existing task.
- `pull_request_url`, `build_session_url` — where the code is and where the run is. The
  session URL comes back from the fire call, so it is known the moment the task is
  dispatched.
- `has_migration` — reported by the Builder; true when the pull request changes files in
  the repository's migrations folder. Shown so staff know a review is waiting; enforced
  in GitHub regardless (below).

No `tier` column: the tier is the story points. 1 to 3 is easy, 5 to 8 is medium, 13 and
21 are hard, and `builderTierFor(storyPoints)` is the single place that says so. No
`builds` table: a task is built at most once at a time, and what happened on earlier
attempts is written to `task_comments` by the Builder, which is where staff already read a
task's history.

**Project** — unchanged. `repository_url` and `environment_url` are the two facts the
Builder needs and both exist. A task on a project with no `repository_url` cannot be sent
to build, and the button does not appear.

**FeatureRequest** — unchanged. Live is read through the task, as delivery already is.

**ClientEvent** — `kind` gains `build_dispatched` and `build_live`.

**The three routines** — not rows. Each licence's routine has a fire URL and a bearer
token, and both live in the environment: `BUILDER_EASY_ROUTINE_URL`,
`BUILDER_EASY_ROUTINE_TOKEN`, and the same for `MEDIUM` and `HARD`. Tokens are secrets and
never enter the repository. If a fourth tier ever exists it is a fourth pair and one more
line in `builderTierFor`, not a table.

## Access

Staff do everything through `is_project_manager()` as today. The Builder acts through
the YBT connector on each licence's claude.ai account, and all three accounts connect it
signed in as the same staff member, so `claim_build` and `report_build` are staff-audience
actions and need no new standing. A client contact's policies are not touched: the build
columns live on `tasks`, which contacts cannot read, and the portal shows them only the
word Live.

The fire call carries the task id and nothing else. Routines deliver fire text wrapped as
untrusted data, so the routine's prompt names the payload explicitly and treats it as an
identifier to look up, never as instructions. The brief the Builder acts on comes back
from `claim_build` over the connector — staff's reviewed words, from our database — not
from the wire.

## Commands and queries

| Command | Story it serves |
| --- | --- |
| `reviseBuildBrief` | rewrite the brief before anything builds |
| `sendTaskToBuild` | accept-and-build, and build again |
| `claimBuild` | the Builder starts with everything |
| `reportBuild` | the Builder says what it did |
| `markBuildLive` | the merged pull request reaches the task and the client |

| Query | Story it serves |
| --- | --- |
| `getBuildsWaitingOnMe` | the migration reviews, in one list |

`sendTaskToBuild` runs its gates first: staff; the task's project has a `repository_url`;
the brief is not empty; `build_status` is `not_sent`, `failed` or `in_review` with no
open pull request. It sets `queued`, POSTs the task id to the tier's routine, stores the
returned session URL, and records `build_dispatched`. A fire that fails leaves the task
`not_sent` with the failure in a task comment, so nothing is silently stuck in `queued`.

`claimBuild` moves `queued` to `building` and answers with the brief, the acceptance
criteria, the repository, the environment, the branch name to use
(`claude/task-<id>-<slug>`), and the migration rule. It refuses a task that is not
`queued`, so a routine fired twice does not build twice.

`reportBuild` takes the pull request URL, `has_migration`, an outcome of `in_review` or
`failed`, and a note. The note becomes a task comment; the rest lands on the columns.

`markBuildLive` is called by the GitHub webhook at `/api/github-webhook` — `pull_request`
closed and merged, head branch `claude/task-<id>` — verified by the webhook secret. It
sets `live`, posts to the client's thread through the existing `commentOnFeatureRequest`
("This is live at <environment_url>."), and records `build_live`. Nothing here reasons;
it is a state change keyed on a branch name.

The MCP server gains `claim_build` and `report_build` in a new `builderActions.ts`, both
staff, and `send_task_to_build` and `revise_build_brief` beside the existing task actions,
so all of this is also reachable from staff's own Claude.

## The Builder's doctrine

The routine's saved prompt is three sentences: it is the YBT Builder; the routine-fire
payload names a task id; call `claim_build` with it, then `load_skill` `builder` and follow
it. The doctrine itself is a YBT skill, so changing how builds work is an edit on the site,
not an edit on three accounts.

The skill, in order: clone is done for you — the routine attaches every client
repository, so `cd` into the one `claim_build` named. Create the branch it named. Read the
repository's own `CLAUDE.md` and follow it over anything here. Implement to the acceptance
criteria and nothing beyond them. Run the repository's checks and fix what fails. Commit
in small steps with messages that say why. Push, open the pull request with the brief as
its body, and arm auto-merge (`gh pr merge --auto --squash`). Call `report_build`. If you
needed a schema change, write the migration file in the repository's migrations folder,
never run it, and report `has_migration` true. Never touch `.env` or anything named like
a key. If the criteria cannot be met, stop and report `failed` with the reason rather
than guessing.

## The migration gate

The rule that data is never put at risk by an unreviewed schema change is enforced by
GitHub, not by trusting the model to follow the doctrine. Each client repository carries:

- Branch protection on `main` requiring two checks: the repository's own `ci` (build,
  typecheck, tests) and `migration-gate`.
- A `migration-gate` workflow that passes when no file under the migrations folder
  changed, and otherwise passes only if the pull request carries the label
  `migration-reviewed`.
- Auto-merge enabled at the repository level, so an armed pull request merges the moment
  both checks are green.

So a pull request with no schema change merges and deploys itself. One with a schema
change sits, and shows up in **Waiting on me**. Staff read the SQL, apply it to the live
database first — Supabase SQL editor or `scripts/run-migration.sh`, as today — and only
then add the label. Order matters: the migration is live before the code that needs it.

The workflow file is a template in `docs/builder/migration-gate.yml`, copied into each
client repository once. YBT itself is the first repository to get it, along with a `ci`
workflow it does not yet have: the Builder builds YBT before it builds anyone else's
product.

## What each licence needs, once

On each of the three claude.ai accounts: connect GitHub with access to the client
repositories; connect the YBT connector, signing in as staff; create the routine with the
three-sentence prompt, the client repositories attached, the model that licence is for,
the YBT connector kept and every other connector removed, and an API trigger; copy the
fire URL and token into the environment for that tier. Adding a client repository later
is editing three routines, which is the one place this design repeats itself; it is
accepted because routines belong to accounts and cannot be shared.

## Limits worth knowing

Routines share the account's subscription usage and have a daily run cap per account,
visible at claude.ai/code/routines. A fire beyond the cap is rejected, and
`sendTaskToBuild` reports that on the task like any other fire failure. The `/fire`
endpoint is in research preview behind a dated beta header; the header is a named
constant in one file so a version bump is one line. Routines and cloud sessions need
GitHub; a client on GitLab cannot be built this way until they move.

## Status

Designed, not built. Nothing in this document exists in the code yet.

## Build order

1. Migration 0040: the task columns, the two event kinds.
2. `/requests/[requestId]`: the brief and story points on the promote form; **Accept and
   build**. The Build panel on the task page; the pill on the backlog; the filter on
   `/tasks`; the Live line on the portal.
3. `reviseBuildBrief`, `sendTaskToBuild` and the fire client; `claimBuild`, `reportBuild`
   and their MCP actions; the `builder` skill saved in YBT.
4. `ci` and `migration-gate` workflows in this repository, branch protection, auto-merge.
5. The three routines, one per account; tier URLs and tokens into the environment.
6. `/api/github-webhook` and `markBuildLive`; the webhook installed on this repository.
7. Prove it end to end on YBT: a request from the demo client, accepted, built, merged,
   live, the thread told. Then the first client repository.
