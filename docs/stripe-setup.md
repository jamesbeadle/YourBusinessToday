# Stripe Setup Guide

How the implemented checkout works, the keys it needs, and the unit economics that make
the credit model profitable.

## How checkout works

- `src/routes/account/credits/+page.server.ts` — the `buy` action creates a Stripe
  Checkout session (`createCheckoutSession`) with the pack priced inline from
  `credit_packs`, `client_reference_id` set to the user id, and the pack id in metadata.
  The browser is redirected to Stripe and back to `/account/credits?checkout=…`.
- `src/routes/api/stripe-webhook/+server.ts` — verifies the webhook signature and, on
  `checkout.session.completed`, calls the `complete_stripe_purchase` SQL function through
  the service-role client. The function is idempotent on the checkout session id and only
  executable by the service role. Credits are only ever granted from the webhook, never
  from the success redirect.
- **Fallback**: when `STRIPE_SECRET_KEY` is missing, the `buy` action uses the old
  placeholder RPC (`purchase_credit_pack`) so local development works without Stripe.

## Going live, step by step

1. **Create the Stripe account** at dashboard.stripe.com — a UK Stripe account, GBP as the
   default currency. Complete business verification early; payouts are blocked until done.
2. **Set the keys** in `.env` (and your host's environment): `STRIPE_SECRET_KEY`
   (starts `sk_live_` / `sk_test_`), `STRIPE_WEBHOOK_SECRET` (from step 3), and
   `SUPABASE_SECRET_KEY` (Supabase dashboard → Settings → API keys → secret key), which
   the webhook uses to credit the ledger.
3. **Register the webhook** in the Stripe dashboard: endpoint
   `https://<production-domain>/api/stripe-webhook`, event `checkout.session.completed`.
   Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
4. **Test locally** with the Stripe CLI: `stripe listen --forward-to
   localhost:5173/api/stripe-webhook` (use the CLI's signing secret), then pay with card
   `4242 4242 4242 4242`.
5. **Flip to live keys** once test-mode purchases credit the ledger correctly.

No Stripe Products need to be created — packs are priced inline from the database, so
`credit_packs` stays the single source of truth.

## Unit economics — why 10 credits per reply is profitable

Cost side, per agent reply (Claude Sonnet, current API pricing ~$3/M input, $15/M output):

| Assumption | Tokens | Cost |
| --- | --- | --- |
| System prompt + map model + conversation in | ~4,000 | ~$0.012 |
| Reply + full map model out | ~1,500 | ~$0.023 |
| **Total per reply** | | **~$0.035 (~3p)** |

Revenue side, per reply, at 10 credits per reply:

| Pack | Price | Credits | Per reply | Margin per reply |
| --- | --- | --- | --- | --- |
| Starter (500) | £2.99 | 500 | 6.0p | ~3p (50%) |
| Growth (1,200) | £5.99 | 1,200 | 5.0p | ~2p (40%) |
| Scale (3,000) | £12.99 | 3,000 | 4.3p | ~1.3p (31%) |

Stripe fees (1.5% + 20p UK cards) cost 24.5p on a Starter pack — about 8.2% of revenue.
The fixed 20p is why packs never go below ~£3: at £1.99 the fee share is 11.6%. Welcome
credits give away 30 free replies (~£1 of API cost) per signup.

Two cost reductions are planned before launch, and the Scale pack's thinner margin
assumes at least one lands:

- **Emit map diffs, not the full map** — output is 65% of the cost because the whole map
  model is re-emitted every reply. Diffs cut cost per reply to roughly half.
- **Prompt caching** — the system prompt and transcript are identical prefixes each turn;
  cached input reads cost ~10% of fresh input. Together these take a reply from ~3p to
  ~1p, lifting every margin above 75%.

The margin's biggest sensitivity is conversation length: the whole transcript is resent
each reply, so input cost grows with long conversations. If margins tighten, cap the
resent history (last ~30 turns plus the map model, which already summarises the rest)
before raising prices.

## Watch items before launch

Move `agent_messages` pruning/archival onto a schedule if conversations get very long;
add a Stripe customer id column to `profiles` when you want saved cards; and remove the
`demo@ybt.dev` seeded account before real marketing traffic arrives.
