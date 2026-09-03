# Model choice and usage-priced questions

Every question on the site runs on a Claude model the asker chose, and is priced so the site
always clears Anthropic's bill with margin. Added 2026-09-03 with James's decisions: a slider
from cheap to expensive over the current Anthropic line-up, reserve-then-settle pricing, a 3×
markup on cost (his floor is "100% on top"), and per-member overrides on chatbots.

## The ladder

`src/lib/data/modelLadder.ts` is the single list, cheapest first: Haiku 4.5 ($1/$5 per MTok),
Sonnet 5 ($2/$10), Opus 5 ($5/$25), Fable 5.1 ($10/$50). Each rung carries a `floorCredits`
(10 / 20 / 50 / 100 — proportional to the input rate) which is both the reserve taken before a
question and the least it can ever cost. Older ids the site setting or an admin pin may still
name (`claude-sonnet-4-5`, `claude-opus-4-8`, `claude-fable-5`…) map to the rung above them;
a dated id matches its rung by prefix; an id nothing recognises prices at the top rung, so a
surprise can never undercharge. `siteModels.ts` (the admin's site-model select) now derives
from the ladder.

## Who chooses

The request's model resolves in this order: admin pin (`user_model_overrides`, 0030) → the
user's own choice (`user_model_preferences`, 0032, RLS user-owned) → the site setting. The
slider lives on `/account` (`ModelChoicePanel` → `ModelSlider`, action `saveModel`); a pinned
user sees a caution and their slider is saved but inert. `getUserModelOverride` reads both
tables so `hooks.server.ts` needed no change.

A chatbot has `chatbots.model_id` (slider on the manage page, action `setModel`) and each
member row has an optional `chatbot_members.model_id` (a "Bot default / Haiku / Sonnet / Opus /
Fable" select, action `setMemberModel`). The member's effective model is the override or the
bot's, and `askChatbot` pins it on the request (`AnthropicRequest.model`) so the member's
question never runs on the calling session's model.

## How a question is priced

`requestAnthropic` records every call it makes — the model asked for and the usage block the
API returns — into the request's AsyncLocalStorage context (`recordMeteredCall` /
`meteredCallsSoFar` in `modelContext.ts`). `creditPricing.ts` turns that into credits:

    bill (pence)   = Σ tokens × rung rate × $→£ (0.74), cache reads at 0.1× input,
                     cache writes at 1.25× input
    owed (credits) = max(rung floor, ceil(bill × costMarkup / creditValuePence))

`creditValuePence` is the cheapest pack's rate (Scale, £12.99 for 3,000 ≈ 0.43p) so the margin
holds whichever pack the buyer used; `costMarkup` is 3. Both are constants at the top of the
pricing section — the only two numbers to tune.

Endpoints follow reserve-then-settle: take the floor for the resolved model before the work
(`spendCredits(reserve, reason)`), answer, then `settleQuestionUsage(supabase, reserve, reason)`
takes whatever `owed − reserve` is positive under `reason + '_usage'` (`brain_question_usage`,
`kb_interview_usage`, `hive_mind_question_usage`, `agent_reply_usage`) through the service-role
RPC `settle_credits_for(payer, amount, reason)`, which has **no balance check** — the balance may
go negative until the next pack. That is deliberate: a settlement that could bounce would make
the floor the real price for anyone who keeps their balance near it. Failure before the answer
refunds the reserve as before. Wired into
`/api/brain/ask`, `/api/face-chat`, `/api/knowledge-base/brain-ask`, `/api/knowledge-base/interview`,
`/api/hive-mind/ask` and `/api/agent-chat`. The last two keep their fixed RPCs (25 with the
specialists' pool; 10 per reply) and top the reserve up to the model floor under the same
reason when the floor is higher; the depth and harvest surcharges stay separate product fees.

Chatbots settle against the pool instead: `settle_chatbot_question(chatbot, member, extra)`
(service-role only, 0032) moves `extra` from the pool onto the member's counter. Neither the
allowance (James allows a member to run over their allocation) nor the pool is re-checked: the
pool may go negative until the owner tops up, and the bot stops answering as soon as it cannot
cover a floor. The ask endpoint returns `creditsCharged` and the settled `allowanceRemaining`.

## Not covered yet

`/api/v1/brains/[id]/ask` (bearer tokens) still charges the fixed 10 credits through
`spend_for_brain_api_question`, so it is pinned to the cheapest rung until it is metered. Ingest, prune and unlearn keep their fixed prices. Usage is metered but not yet stored;
the admin cost-vs-credits view from launch-plan.md can read `meteredCallsSoFar()` into the
event detail when it is built.
