# Your Business Today (YBT)

A consultancy that automates a business: we learn how a business really runs, then build
the tools that run it.

## Status

The consultancy runs on this: clients, projects, the client portal, support, the Builder
and the books are all working.

- Sign in with Google, or with an email address and a password — new accounts confirm
  their address by email, and a forgotten password is reset from the sign-in page;
  [docs/auth-setup.md](./docs/auth-setup.md) covers the provider configuration.
- Staff keep the client register at `/clients` — leads from the website land there, and a
  client moves through its lifecycle from lead to live;
  [docs/client-lifecycle-architecture.md](./docs/client-lifecycle-architecture.md) is the design.
- People at `/people` is the directory behind the register: who we know, where they work,
  what we last said to them, and a researched approach when we want to open a conversation;
  [docs/lead-generation-architecture.md](./docs/lead-generation-architecture.md) and
  [docs/prospector-architecture.md](./docs/prospector-architecture.md) cover finding them.
- A project is the shared board. It has goals — high level, measurable — and every goal
  and task carries a conversation. A client's person is added to a project by an admin
  and works on it through their own Claude: they find the goal, find or raise a support
  task, post on it, and read what is new in one call; staff answer where the work is and
  close a support task with a resolution the raiser reads. `/support` lists what is
  waiting on us; [docs/support-conversations-architecture.md](./docs/support-conversations-architecture.md)
  is the design.
- Projects and tasks at `/projects` and `/tasks` are the team's task manager — goals,
  subtasks, assignees and status, for the consultancy's own work as much as the client's.
- Send a task to the Builder — a Claude Code routine per tier that branches, builds, opens
  a pull request and reports back; merged builds mark the task live and say so in its
  conversation. Schema changes wait for a person;
  [docs/builder-architecture.md](./docs/builder-architecture.md) is the design.
- The books are at `/accounting` — ledger accounts, cost centres, journals, invoices and
  expenses, with a profit and loss and a balance sheet.
- Clients reach the portal through their own Claude at `/api/mcp` — OAuth sign-in from the
  Connect button, scoped to the projects they are on;
  [docs/mcp-architecture.md](./docs/mcp-architecture.md) is the design.
- Admins (`/admin`) can set the site model — the Claude model behind every agent reply —
  restrict accounts, and delete accounts. The first admin is bootstrapped by email on signup.

The product this consultancy sells and implements — Knowledge Bases, the brains inside
them, chatbots, the marketplace and the hive mind — lives separately in
[YourBrainToday](https://github.com/jamesbeadle/YourBrainToday).

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
| `ANTHROPIC_API_KEY` | Claude API key — company and person research, and drafted approaches |
| `SUPABASE_SECRET_KEY` | Supabase secret key — used by the MCP server and to read the site model |
| `COMPANIES_HOUSE_API_KEY` | Companies House company and officer search |
| `RESEND_API_KEY` / `EMAIL_FROM` | Resend API key and sender address for transactional email |
| `ENQUIRY_NOTIFICATION_EMAIL` | Where website enquiries from `/contact` are sent |
| `BUILDER_{EASY,MEDIUM,HARD}_ROUTINE_URL` / `_TOKEN` | Fire endpoint and token of the Claude Code routine for each tier |
| `GITHUB_WEBHOOK_SECRET` | Secret on the GitHub webhook that tells a task its build merged |

## Stack

SvelteKit, Svelte 5, Tailwind CSS 4, TypeScript, Supabase (Auth + Postgres), Claude API.

All code follows the conventions in [CLAUDE.md](./CLAUDE.md).
