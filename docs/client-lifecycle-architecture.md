# Client Lifecycle — Architecture

How a stranger becomes a contact, a contact becomes a client, a client's systems become
things we manage, and the things those clients ask for become tasks in our backlog.

Staff-only, like `/projects` and `/accounting`. This is the agency's own register of who we
work for — not the Prospector's directory, which is product data belonging to a customer
(see [prospector-architecture.md](./prospector-architecture.md)). Same vocabulary, different
tables, and they must not be conflated.

## What exists today

- `public.clients` — name, contact name, email, address, archived. Written by
  `src/lib/server/accounting/manageClients.ts`, read by every invoice. It is a billing
  address book, not a lifecycle.
- `public.tasks` — already carries `is_user_story`, `story_role`, `story_want`,
  `story_benefit`. A feature request is a user story that arrived from outside.
- `public.profiles` — `is_staff`, `is_admin`. Everyone in the database today is us.
- Sign-in is Google and Microsoft only. The README claims email and password with
  verification; it does not exist. That claim is wrong and is corrected by this work.

There is no notion of a client's people, a client's systems, or anything a client wants.

## User stories

| As | I want | So that |
| --- | --- | --- |
| Staff | to record a company and the person I spoke to, before they buy anything | prospecting has somewhere to land |
| Staff | to move a company through lead → prospect → client → dormant | I can see the pipeline and who is actually paying |
| Staff | to register the systems we manage for a client, each against its GitHub repository | I know what I am on the hook for and where the code lives |
| Staff | to invite a client contact by email address | they can sign in and speak to us without going through my inbox |
| Staff | one queue of everything clients have asked for, newest first | requests are triaged rather than lost |
| Staff | to turn a request into a task in the right project, with the client's words kept | the backlog carries the reason the work exists |
| Staff | to accept or decline a request with a sentence of why | the client is answered either way |
| Client contact | to raise a feature request against a system I use | I can ask for work without writing an email |
| Client contact | to see the requests I have raised and where each one stands | I stop asking for status |
| Client contact | to reply in the thread on my own request | clarification happens once, in one place |
| Client contact | to sign in with an email address and a password | I do not need a Google or Microsoft account to reach the portal |

Everything below is demanded by exactly these stories. Nothing else appears.

## The views

**Staff**

- `/clients` — every company by stage, each row showing its stage, primary contact, system
  count and open request count. Add a company inline; the stage pill moves in place.
- `/clients/[clientId]` — the company: contacts (with an Invite button per contact),
  managed systems, its requests, and the event ledger.
- `/clients/[clientId]/systems/[systemId]` — one system: repository link, environment link,
  and the requests raised against it.
- `/requests` — the triage queue across every client, newest first, filtered by status.
- `/requests/[requestId]` — the client's words verbatim, the thread, the accept/decline
  form, and the Promote to task form. Once promoted, the row links to the task.

**Client portal** — a client contact sees only this, and only their own company's data.

- `/portal` — their systems and their requests.
- `/portal/requests/new` — title, which system, what they want, why.
- `/portal/requests/[requestId]` — status and the thread.

The MCP server is the client's primary surface (see [mcp-architecture.md](./mcp-architecture.md)).
The portal exists because not every contact works through Claude, and because a story with
no view cannot be triaged.

## Site map

```
/clients ──▶ /clients/[clientId] ──▶ /clients/[clientId]/systems/[systemId]
                     │                            │
                     └──────────┬─────────────────┘
                                ▼
/requests ─────────────▶ /requests/[requestId] ──▶ /projects/[projectId]/tasks/[taskId]

/account/sign-in ──▶ /portal ──▶ /portal/requests/[requestId]
                        └──────▶ /portal/requests/new
```

`/requests/[requestId]` is the hinge: it is the only place a client's words become our work.

## The entities

**Client** — `public.clients`, extended rather than replaced. Gains `lifecycle_stage`
(`lead`, `prospect`, `client`, `dormant`, `lost`), `website`, `owner_id` (the staff member
who owns the relationship), and keeps the billing columns invoices already read.

**ClientContact** — a person at a client: name, email, phone, role, `is_primary`,
`account_id` (null until invited), `invited_at`. The existing `clients.contact_name` and
`clients.email` are backfilled into the primary contact and dropped; `getClients.ts`,
`manageClients.ts`, `ClientFormFields.svelte`, `ClientRow.svelte` and
`InvoiceDocument.svelte` read the primary contact instead — invoices already join by
`client_id`, so nothing about billing changes. One person, one row: a contact's email must
not exist in two places.

**ManagedSystem** — a thing we run for a client: name, description, `repository_url`,
`environment_url`, `is_active`.

**FeatureRequest** — `client_id`, `system_id`, `raised_by_contact_id`, `title`, `body`
(their words, never edited by us), `status` (`new`, `accepted`, `declined`), `decision_note`,
`task_id` (null until promoted), `created_at`. Delivery is not a column: a request is
delivered when its task is done, so it is derived from the task, never stored twice.

**FeatureRequestComment** — `request_id`, `author_account_id`, `body`, `created_at`. Every
comment here is visible to the client; that is what the thread is for. Internal discussion
belongs on the task, which clients cannot see.

**ClientEvent** — the ledger: stage moved, contact invited, system registered, request
raised, request decided, request promoted. Same idiom as `brain_events`.

## Access

Staff see everything through the existing `is_project_manager()` idiom. A client contact
sees rows whose `client_id` matches the client their `account_id` is linked to, and nothing
else — one row-level policy per client table, resolved through `client_contacts.account_id`.
A signed-in account with no contact row is not a client and reaches nothing.

**Inviting a contact.** Staff press Invite on a contact. We create the auth user for that
email address, link `account_id`, and Supabase sends a set-your-password email. The contact
follows the link, sets a password, and lands on `/portal`. The same email-and-password path
serves staff, so `/account/sign-in` gains an email field, a password field, and a Forgot
password link alongside the Google button.

**Microsoft sign-in is removed** — the button, `beginMicrosoftSignIn.ts`, its action, and
`docs/microsoft-login-setup.md`. Existing Microsoft accounts keep their rows; they sign in
by setting a password on the same address.

## Commands and queries

| Command | Story it serves |
| --- | --- |
| `createClient` | record a company |
| `moveClientStage` | move it through the pipeline |
| `addClientContact` | record a person |
| `inviteClientContact` | give that person a way in |
| `registerManagedSystem` | record what we run for them |
| `raiseFeatureRequest` | a client asks for something |
| `commentOnFeatureRequest` | either side clarifies |
| `decideFeatureRequest` | accept or decline, with a reason |
| `promoteFeatureRequestToTask` | the request becomes work |

| Query | Story it serves |
| --- | --- |
| `getClientList` | the pipeline |
| `getClient` | one company and everything hanging off it |
| `getManagedSystem` | one system and its requests |
| `getTriageQueue` | everything clients have asked for |
| `getFeatureRequest` | one request and its thread |
| `getContactPortal` | a contact's own systems and requests |

Each entry point runs its gates first — signed in, staff or the contact who owns the row,
input valid — before any domain logic. `promoteFeatureRequestToTask` calls the existing
`createTask` with `is_user_story` true and the story fields filled from the request: role
from the contact, want from the title, benefit from their stated reason. The task and the
request then reference each other; neither copy of the wording drifts because the task's
`details` links back rather than restating.

## Build order

1. Migration: extend `clients`, add `client_contacts`, backfill the primary contact, add
   `managed_systems`, `feature_requests`, `feature_request_comments`, `client_events`, and
   the policies. Accounting reads move to the primary contact in the same change.
2. Email-and-password sign-in and the invite flow; remove Microsoft.
3. Staff views: `/clients`, `/clients/[clientId]`, `/requests`, `/requests/[requestId]`,
   including promotion to task.
4. The MCP server, which is only a second face on the commands step 3 already built.
5. `/portal`, last — by then every command it needs exists.

## Open question

Which project do promoted requests land in? Simplest answer that needs no new concept: the
client owns a project, so `clients` gains `project_id` and promotion has no choice to make.
Confirm before step 1.
