# The MCP Server — Architecture

One endpoint, `/api/mcp`, that lets a person's own Claude do what they could do on the
site — without a browser, an email, or a login prompt in the middle of their work. Who
they are decides what that is: staff work on the business; a client contact reaches only
their own company's projects and requests.

It adds no domain. Every action here is a second face on a command or query the site
already runs. If an action needs something the site does not define, the domain is wrong —
fix it there, not here.

## The stories it serves

| As | I want | So that |
| --- | --- | --- |
| Client contact | to raise a feature request from inside Claude, where I noticed the problem | the ask happens while I still remember the detail |
| Client contact | to list my requests, read a thread and reply | clarification costs one message, not one email chain |
| Client contact | to see which of our projects I can raise requests against | I aim the request at the right one |
| Staff | to triage requests, run projects and tasks, and keep the books from Claude | the admin happens where the thinking happens |
| Anyone | to press Connect in Claude and arrive as myself | there is no token to copy and nothing to paste |

## The shape: four tools, many actions

Claude sees four tools, the same four for everyone:

| Tool | What it does |
| --- | --- |
| `get_current_context` | who the signed-in person is, their standing, and the areas they can reach |
| `list_actions` | every action this person may run, one line each, optionally narrowed to an area |
| `describe_action` | one action in full — its input schema and any doctrine attached to it |
| `perform_action` | run one action by name with its input |

The actions live in `src/lib/server/mcp/actions/`, one file per concern, gathered by area
(`account`, `clients`, `requests`, `projects`, `tasks`, `accounting`) into
`actionRegistry.ts`. Each action names its audience — `everyone`, `contact`, `staff` or
`admin` — and the registry filters by the caller's standing on every lookup, so a contact
cannot list, describe or run a staff action; it does not exist for them. Accounting is
`admin`, matching the site.

This shape keeps the tool list small and stable while the site grows: adding a capability
is adding an action file, never a tool. Tool descriptions are prose the caller's Claude
reads, so they name the domain plainly.

Every action runs against the service-role Supabase client, so row-level security is
not the gate here — the action code is. Contact actions resolve the company from the
token, never from input, and refuse anything that is not theirs.

## The route

```
src/routes/api/mcp/+server.ts               POST — the whole protocol surface
src/lib/server/mcp/readMcpRequest.ts        parse one JSON-RPC message
src/lib/server/mcp/mcpMethods.ts            initialize | ping | tools/list | tools/call
src/lib/server/mcp/mcpProtocol.ts           supported revisions and server identity
src/lib/server/mcp/mcpTools.ts              the four tools
src/lib/server/mcp/actionRegistry.ts        every action, filtered by standing
src/lib/server/mcp/actions/*.ts             one file per concern
src/lib/server/mcp/resolveMcpCaller.ts      the gate
src/lib/server/mcp/toolFailureSentence.ts   database failures as sentences the model can act on
src/lib/server/mcp/requestLimits.ts         the body cap and the daily ceiling
src/lib/server/mcp/mcpErrors.ts             JSON-RPC error codes as named constants
```

Streamable HTTP, JSON responses only — no SSE, no session id, no server-initiated
messages. Nothing here streams or pushes, so the stateless shape is the honest one and it
survives Vercel's serverless model without a session store. Each POST carries one
JSON-RPC message and gets one JSON reply; a notification gets 202 and no body.

A failure inside an action is answered as a tool result with `isError`, in a sentence:
a malformed id says so, a missing referent says so, and only a real fault says "try
again shortly" — a refusal the model can read beats an error it will retry.

## Authentication

Two ways in, both resolved by `resolveMcpCaller`:

**OAuth 2.1** — the way Claude's own connectors work. The server publishes
`/.well-known/oauth-authorization-server` and `/.well-known/oauth-protected-resource/api/mcp`;
an unauthenticated call gets 401 with a `WWW-Authenticate` header pointing at them.
Clients register themselves at `/oauth/register` (RFC 7591), send the person to
`/oauth/authorize` where they sign in as usual and press Connect, and exchange the code at
`/oauth/token` with PKCE (S256, required). Access tokens (`ybt_at_`, one hour) and refresh
tokens (`ybt_rt_`, sixty days) are opaque and SHA-256 hashed at rest, like every secret in
this database. A confidential client's secret is verified at the token endpoint; a public
client is bound by PKCE alone. Codes are single-use by construction — claiming one is a
single conditional update. Only staff and client contacts can approve a connection; an
account that is neither is told so on the authorize page rather than handed a token that
would never work.

The token endpoint is called server-to-server with no `Origin` header, which SvelteKit's
own form-origin check would refuse. That check is therefore off in `svelte.config.js` and
re-implemented in `hooks.server.ts` through `src/lib/server/http/crossSiteFormSubmission.ts`,
which exempts exactly that one path and keeps every other form as protected as it was.

**Client access token** — `ybt_` prefix, minted at `/portal/access` by a contact
themselves, for MCP clients that take a bearer header and nothing else. It can only ever
be a contact, and a restricted account's token stops working the day the account is
restricted.

Tables: `client_api_tokens` (0036), `oauth_clients`, `oauth_authorization_codes`,
`oauth_tokens` (0038).

## Abuse and limits

The caller's Claude is an eager agent. Two limits, both named constants in
`requestLimits.ts`: a body cap on a raised request, so a runaway agent cannot paste a
repository into `want`; and a per-contact daily ceiling on raising requests, above which
the action returns a plain refusal rather than an error. Duplicate suppression is a
courtesy: a request whose title matches an open one of theirs returns the existing
reference and says so.

## Status

Built and deployed. Proved against production: the discovery documents answer, an
unauthenticated call gets 401 with the right header, GET gets 405, registration
validates its input. Proved locally against the production build: the token endpoint
accepts a form-encoded POST with no `Origin`, other forms without one are still refused,
malformed bodies get an OAuth error rather than a crash. Migrations 0036, 0037 and 0038
are applied.

Not yet proved: one whole Connect from Claude — register, approve, exchange, `tools/list`,
`get_current_context` — against the deployed build with these changes in it. That is the
next thing to do after the next deploy, before anyone else is pointed at it.

## Known gaps, in order

- `/oauth/register` is unauthenticated and unrated; anyone can fill `oauth_clients`. Cap it
  per IP or gate it behind an initial access token before the URL is public.
- There is no page where a person sees and revokes their connections; the row-level
  policies in 0038 are ready for one.
- Actions do not validate their input against `inputSchema` before running; a bad id is
  caught by the database and reported honestly, but a read-and-refuse in the action would
  read better. `create_task` in particular accepts a phase or parent from another project.
- Input for `create_invoice`/`add_invoice_line` accepts zero and negative quantities.
- The thread views name no authors; a contact cannot tell their message from ours.
