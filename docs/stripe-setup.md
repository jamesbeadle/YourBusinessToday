# Stripe Setup Guide

How to replace the placeholder checkout with live Stripe payments, and the unit economics
that make the credit model profitable.

## Where the placeholder lives

One server action and one SQL function:

- `src/routes/account/credits/+page.server.ts` — the `buy` action currently calls the
  `purchase_credit_pack` RPC directly, which credits the ledger immediately.
- `purchase_credit_pack` in Postgres — inserts the purchase with a fake
  `cs_test_placeholder_…` checkout session id and status `placeholder_paid`.

Everything else (packs, ledger, balance, purchase history) is already real and does not
change when Stripe goes live.

## Going live, step by step

1. **Create the Stripe account** at dashboard.stripe.com — a UK Stripe account, GBP as the
   default currency. Complete business verification early; payouts are blocked until done.
2. **Create one Product per credit pack** (Starter, Growth, Scale) with a one-off Price
   matching `credit_packs` in Postgres: 900p, 3900p, 7900p. Put the pack id (`starter`,
   `growth`, `scale`) in each Price's metadata so the webhook can map back.
3. **Install the SDK**: `npm install stripe`.
4. **Add the real keys to `.env`** (and your host's environment): `STRIPE_SECRET_KEY`
   (starts `sk_live_` / `sk_test_`) and `STRIPE_WEBHOOK_SECRET` (from step 6).
5. **Swap the `buy` action for Checkout**: create a `stripe.checkout.sessions.create` call
   with the pack's Price, `mode: 'payment'`, `client_reference_id` set to the user id, and
   success/cancel URLs back to `/account/credits`. Redirect the browser to `session.url`.
   The action stops calling `purchase_credit_pack`.
6. **Add the webhook endpoint** `src/routes/api/stripe-webhook/+server.ts`: verify the
   signature with `STRIPE_WEBHOOK_SECRET`, handle `checkout.session.completed`, and call a
   new `complete_stripe_purchase(user_id, pack_id, checkout_session_id)` SQL function —
   same body as today's `purchase_credit_pack`, but keyed on the real session id and
   idempotent (ignore a session id it has already processed). Credits must only ever be
   granted from the webhook, never from the success redirect.
7. **Test locally** with the Stripe CLI: `stripe listen --forward-to
   localhost:5173/api/stripe-webhook`, then pay with card `4242 4242 4242 4242`.
8. **Flip to live keys** once test-mode purchases credit the ledger correctly.

## Unit economics — why 1 credit = 10 replies is profitable

Cost side, per agent reply (Claude Sonnet, current API pricing ~$3/M input, $15/M output):

| Assumption | Tokens | Cost |
| --- | --- | --- |
| System prompt + map model + conversation in | ~4,000 | ~$0.012 |
| Reply + full map model out | ~1,500 | ~$0.023 |
| **Total per reply** | | **~$0.035 (~3p)** |

Revenue side, per reply, at 10 replies per credit:

| Pack | Price | Per credit | Per reply | Margin per reply |
| --- | --- | --- | --- | --- |
| Starter (10) | £9.00 | 90.0p | 9.0p | ~6p (67%) |
| Growth (50) | £39.00 | 78.0p | 7.8p | ~4.8p (62%) |
| Scale (120) | £79.00 | 65.8p | 6.6p | ~3.6p (55%) |

Stripe fees (1.5% + 20p UK cards) cost 34p on a Starter pack — about 3.7% of revenue.
Welcome credits give away 30 free replies (~£1 of API cost) per signup.

The margin's biggest sensitivity is conversation length: the whole transcript is resent
each reply, so input cost grows with long conversations. If margins tighten, cap the
resent history (last ~30 turns plus the map model, which already summarises the rest)
before raising prices.

## Watch items before launch

Move `agent_messages` pruning/archival onto a schedule if conversations get very long;
add a Stripe customer id column to `profiles` when you want saved cards; and remove the
`demo@ybt.dev` seeded account before real marketing traffic arrives.
