# The MCP Server — Architecture

One endpoint that lets a client's own Claude raise, track and discuss feature requests
against the projects we run for them — without a browser, an email, or a login prompt in
the middle of their work.

It adds no domain. Every tool here is a second face on a command or query defined in
[client-lifecycle-architecture.md](./client-lifecycle-architecture.md), which must ship
first. If a tool needs something that document does not define, the domain is wrong — fix
it there, not here.

## The stories it serves

| As | I want | So that |
| --- | --- | --- |
| Client contact | to raise a feature request from inside Claude, where I noticed the problem | the ask happens while I still remember the detail |
| Client contact | to list my requests and their status without opening anything | I stop chasing |
| Client contact | to read and reply to a thread on one of my requests | clarification costs one message, not one email chain |
| Client contact | to see which of our projects I can raise requests against | I aim the request at the right one |

Four stories, five tools. Nothing speculative: no tool exposes a client's invoices, our
backlog, or anyone else's requests, because no story asks for it.

## The tools

| Tool | Maps to | Notes |
| --- | --- | --- |
| `list_my_projects` | `getContactPortal` | id, name and repository of each project belonging to the caller's client |
| `raise_feature_request` | `raiseFeatureRequest` | `projectId`, `title`, `want`, `benefit`; returns the reference |
| `list_my_feature_requests` | `getContactPortal` | id, title, project, status, last activity |
| `get_feature_request` | `getFeatureRequest` | the request, its decision note, and the thread |
| `comment_on_feature_request` | `commentOnFeatureRequest` | one message into the thread |

Tool descriptions are prose the client's Claude reads, so they name the domain plainly:
"Raise a feature request against a project we build for your company." The caller is never
asked for a client id — it is resolved from the token, and passing one is not possible. A
`projectId` that belongs to another client, or to no client at all, is refused by the same
command that serves the portal. A tool that cannot address another company's data cannot
leak it.

Raising a request costs no credits. It is our work queue, not their consumption.

## The route

```
src/routes/api/mcp/+server.ts               POST — the whole protocol surface
src/lib/server/mcp/readMcpRequest.ts        parse and validate one JSON-RPC message
src/lib/server/mcp/mcpMethods.ts            server/discover | initialize | tools/list | tools/call
src/lib/server/mcp/mcpProtocol.ts           supported revisions, server identity, cache hints
src/lib/server/mcp/mcpTools.ts              the registry: name, description, schema, run
src/lib/server/mcp/tools/*.ts               one file per tool, each calling one command or query
src/lib/server/mcp/requestLimits.ts         the body cap and the daily ceiling
src/lib/server/mcp/resolveContactCaller.ts  the gate
src/lib/server/mcp/mcpErrors.ts             JSON-RPC error codes as named constants
```

The current specification revision, `2026-07-28`, drops the `initialize` handshake in favour
of a mandatory `server/discover`, and every result carries `resultType`. Older clients still
send `initialize`, so both are answered and the version is negotiated down to whatever the
caller asked for out of the four revisions we know. Costing nothing to keep, the older
handshake stays until Claude's own clients have moved.

Streamable HTTP, JSON responses only — no SSE, no session id, no server-initiated
messages. Nothing in these five tools streams or pushes, so the stateless shape is the
honest one and it survives Vercel's serverless model without a session store. Each POST
carries one JSON-RPC message and gets one JSON reply.

`tools/list` is generated from the registry, so adding a tool is adding a file, never
editing a switch.

## Authentication

A **client access token** — `ybt_` prefix, SHA-256 hashed at rest, minted at
`/portal/access` by the contact themselves and revocable by them or by staff. This is the
existing `brain_api_tokens` idiom (migration 0023) with a different owner: a
`client_api_tokens` table keyed on `contact_id`. `hashApiToken` in
`src/lib/server/brainApi/brainApiTokens.ts` is the shared concept and moves to a module
both callers import; nothing else is shared, because a brain token and a contact token
authorise different things.

`resolveContactCaller` is the gate on every call: read the bearer header, hash it, find a
live token, load the contact and their client, stamp `last_used_at`. No token, no tools —
`tools/list` itself is authenticated, so an unauthenticated caller learns nothing about the
surface.

**What this buys and what it does not.** A bearer token works today in Claude Code, the
Agent SDK, and any MCP client that sends custom headers. Claude's own custom connectors —
the ones a client adds under Customize → Connectors on claude.ai, Cowork or the desktop app
— authenticate through OAuth; there is no field to paste a token into. So a token gets us a
working server for technical clients immediately, and does not get us the one-click Connect
button a non-technical client expects.

The staged answer, which the shape above already allows: ship the token gate first, then
put OAuth 2.1 in front of the same route. The MCP specification's discovery flow makes this
additive — an unauthenticated request answers `401` with a `WWW-Authenticate` header
pointing at the authorisation server metadata, and the token check gains a second
implementation behind the same `resolveContactCaller` signature. Supabase Auth already
holds the identities, so the authorisation server issues against accounts that exist.
Nothing built in phase one is thrown away.

## Abuse and limits

The client's Claude is an eager agent. Two limits, both named constants:

- a request body cap, so a runaway agent cannot paste a repository into `want`;
- a per-contact daily ceiling on `raise_feature_request`, above which the tool returns a
  plain refusal rather than an error, because a refusal the model can read beats a 429 it
  will retry.

Duplicate suppression is not a limit but a courtesy: if a contact raises a request whose
title matches an open one of theirs, the tool returns the existing reference and says so.

## Status

Built, at `/api/mcp`, with all five tools and `/portal/access` for minting tokens.
Migration 0036 is applied. What has been proved: the route answers, an absent or unknown
token gets 401 with a `WWW-Authenticate` header, GET gets 405, and the whole thing
type-checks and builds. What has not: a single call that reaches the database, because the
only shell available for testing had no network. The first real call is the smoke test.

## Build order

1. `client_api_tokens` migration and `/portal/access` — a contact can mint a token before
   there is anything to point it at.
2. The route, `initialize` and `tools/list` behind the gate — connect it and see the tools
   listed, with nothing callable yet.
3. `list_my_projects` and `list_my_feature_requests` — reads first, so the first live test
   cannot write anything.
4. `raise_feature_request`, then `get_feature_request` and `comment_on_feature_request`.
5. OAuth in front, when a non-technical client needs it.

## Open question

Are these tools for client contacts only, or do we want a server pointed at our own data
later — the backlog, the pipeline, the triage queue? Different audience, different gates,
so they should not share a route. This document covers `/api/mcp` for clients; a staff
server would be a separate document and a separate endpoint.
