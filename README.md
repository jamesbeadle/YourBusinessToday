# Your Business Today (YBT)

Talk to an AI agent about your business; get back a Workflow Map — every role a line,
every task a station, drawn in the visual language of a transit map.

## Status

Early access. Accounts, credits, the agent, and the live map are all working:

- Sign up with email and password (Supabase Auth) — three welcome credits included.
- Buy credit packs at `/account/credits` — checkout is a Stripe **placeholder** for now;
  [docs/stripe-setup.md](./docs/stripe-setup.md) covers going live and the unit economics.
- Talk to the agent at `/workspace` — 1 credit buys 10 agent replies, and the Workflow Map
  redraws in real time as you answer. Every reply returns both conversation and structure.
- Share your map read-only by adding someone's email in the workspace; it appears in their
  "Shared with me" once they sign in with that address.
- Admins (`/admin`) can grant promotional credits and restrict accounts. The first admin is
  bootstrapped by email on signup.
- The demo map at `/project` shows a finished map.

The agent uses the Claude API when `ANTHROPIC_API_KEY` is set, and falls back to a scripted
interviewer (without live map updates) when it is not. The agent's interviewing brain lives
in `src/lib/server/agent/agentSystemPrompt.ts` — edit that file to tune how businesses are
scoped.

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
| `STRIPE_SECRET_KEY` | Placeholder until live Stripe Checkout lands |

## Architecture

The agent roadmap — interviewer, cartographer, surveyor, planner — lives in
[docs/agent-architecture.md](./docs/agent-architecture.md).

## Stack

SvelteKit, Svelte 5, Tailwind CSS 4, TypeScript, Supabase (Auth + Postgres), Claude API.

All code follows the conventions in [CLAUDE.md](./CLAUDE.md).
