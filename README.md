# Your Business Today (YBT)

Talk to an AI agent about your business; get back a Workflow Map — every role a line,
every task a station, drawn in the visual language of a transit map.

## Status

Early access. Accounts, credits, the agent, and the live map are all working:

- Sign in with Google, Microsoft, or email + password with verification — 300 welcome
  credits arrive once the email is verified; [docs/auth-setup.md](./docs/auth-setup.md)
  covers the provider configuration.
- Buy credit packs at `/account/credits` — live Stripe Checkout with webhook fulfilment
  when keys are set, a placeholder otherwise; [docs/stripe-setup.md](./docs/stripe-setup.md)
  covers the keys and the unit economics.
- Talk to the agent at `/workspace` — each agent reply costs 10 credits, and the Workflow Map
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
| `STRIPE_SECRET_KEY` | Stripe secret key — optional, placeholder checkout without it |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for `/api/stripe-webhook` |
| `SUPABASE_SECRET_KEY` | Supabase secret key — used only by the Stripe webhook |

## Architecture

The agent roadmap — interviewer, cartographer, surveyor, planner — lives in
[docs/agent-architecture.md](./docs/agent-architecture.md).

## Stack

SvelteKit, Svelte 5, Tailwind CSS 4, TypeScript, Supabase (Auth + Postgres), Claude API.

All code follows the conventions in [CLAUDE.md](./CLAUDE.md).
