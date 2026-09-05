# Your Business Today (YBT)

A consultancy that automates a business, and the product it runs on: Knowledge Bases that
hold what a business knows, has done, and how it works, so that people and AI can ask them.

## Status

Early access. Accounts, credits, Knowledge Bases, chatbots, the MCP server, the client
portal and the team's own project management are all working:

- Sign in with Google, or with an email address and a password — new accounts confirm
  their address by email and start with zero credits, and a forgotten password is reset
  from the sign-in page; [docs/auth-setup.md](./docs/auth-setup.md) covers the provider
  configuration.
- Buy credit packs at `/account/credits` — live Stripe Checkout with webhook fulfilment
  when keys are set, a placeholder otherwise; [docs/stripe-setup.md](./docs/stripe-setup.md)
  covers the keys and the unit economics.
- Build a Knowledge Base at `/knowledge-base` — three brains per base: expertise (what
  the business knows, as a domain model), experience (what it has done, as case files) and
  process (how it works, as flows of work). Each is built by interview with an agent or by
  uploading the documents the business already files, and every answer is grounded in
  those pages with citations; [docs/domain-brain-architecture.md](./docs/domain-brain-architecture.md)
  and [docs/process-brain-architecture.md](./docs/process-brain-architecture.md) cover the
  design.
- Hand a chatbot to staff at `/chatbots` — the first tool built on a Knowledge Base. A
  manager names a bot on their base, invites members by email, funds it from their own
  credits and sets each member's allowance; members ask, and never open the base itself;
  [docs/chatbot-architecture.md](./docs/chatbot-architecture.md) is the design.
- Connect your own Claude through the MCP server at `/api/mcp` — OAuth sign-in from the
  Connect button, then the same commands and queries the site runs, scoped to who you are;
  the public API under `/api/v1` lets other software ask a brain, read its pages and export
  it; [docs/mcp-architecture.md](./docs/mcp-architecture.md) is the design.
- Clients work in the portal at `/portal` — they raise requests against their projects and
  follow the thread; staff triage them at `/requests`, keep the client register at
  `/clients`, and send accepted requests to the Builder — a Claude Code routine per tier
  that branches, builds, opens a pull request and reports back; merged builds mark the
  task live and tell the client. Schema changes wait for a person;
  [docs/client-lifecycle-architecture.md](./docs/client-lifecycle-architecture.md) and
  [docs/builder-architecture.md](./docs/builder-architecture.md) are the designs.
- Projects and tasks at `/projects` and `/tasks` are the team's internal task manager —
  phases, subtasks, assignees and status, for the consultancy's own work as much as the
  client's.
- Admins (`/admin`) can set the site model — the Claude model behind every agent reply —
  grant promotional credits, restrict accounts, and delete accounts. The first admin is
  bootstrapped by email on signup.

The agents use the Claude API when `ANTHROPIC_API_KEY` is set, and fall back to a scripted
interviewer when it is not.

## Running locally

```bash
npm install
cp .env.example .env   # fill in the values below
npm run dev
```

| Variable | Purpose |
| --- | --- |
| `PUBLIC_SUPABASE_URL` | Supabase project URL |
| `PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable API key |
| `ANTHROPIC_API_KEY` | Claude API key — optional, scripted agent without it |
| `STRIPE_SECRET_KEY` | Stripe secret key — optional, placeholder checkout without it |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for `/api/stripe-webhook` |
| `SUPABASE_SECRET_KEY` | Supabase secret key — used by the Stripe webhook and to read the site model |
| `RESEND_API_KEY` / `EMAIL_FROM` | Resend API key and sender address for transactional email — optional, sending is skipped without them |
| `BUILDER_{EASY,MEDIUM,HARD}_ROUTINE_URL` / `_TOKEN` | Fire endpoint and token of the Claude Code routine for each tier — optional, sending to build refuses politely without them |
| `GITHUB_WEBHOOK_SECRET` | Secret on the GitHub webhook that tells a task its build merged |

## Architecture

The agent roadmap — interviewer, cartographer, surveyor, planner — lives in
[docs/agent-architecture.md](./docs/agent-architecture.md).

## Stack

SvelteKit, Svelte 5, Tailwind CSS 4, TypeScript, Supabase (Auth + Postgres), Claude API.

All code follows the conventions in [CLAUDE.md](./CLAUDE.md).
