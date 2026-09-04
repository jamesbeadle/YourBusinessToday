# Knowledge-base chatbots

A chatbot is a named front door onto a knowledge base that its owner hands to people who should be able to *ask* the knowledge but never *open* it — a construction manager's site crew, a firm's field engineers. The owner funds it from their own credits and decides, at each top-up, how much of that money each member may spend. When the pool is empty the bot goes quiet until the next top-up.

Decisions taken with James on 2026-09-03: allowances reset at every top-up (each top-up is a fresh period); the bot answers from every domain brain linked to the knowledge base, automatically; a question costs the pool the same as a brain question (10 credits); sign-in stays Google/Microsoft only.

## 1. User stories

**Owner** (the knowledge-base owner)

1. As a knowledge-base owner, I want to create a named chatbot on my knowledge base, so my people can ask it questions without seeing the knowledge base itself.
2. As an owner, I want to invite members by email, so only the people I name can use the bot.
3. As an owner, I want to top the bot up from my credits and confirm each member's allowance for that top-up, so I control what each person can spend.
4. As an owner, I want to see the bot's remaining pool and what each member has spent this period, so I know when to top up and who is using it.
5. As an owner, I want to remove a member or pause the bot, so I can stop spend immediately.

**Member** (the invited worker)

6. As an invitee, I want to open the invite link, sign in (creating my account if I have none) and land straight on the bot, so joining takes one step.
7. As a member, I want to ask the bot questions and get answers drawn from the knowledge base, so I can get on with my work.
8. As a member, I want to see how much allowance I have left and be told plainly when I — or the bot — have run out, so a silent bot never looks broken.
9. As a member, I want to find my bots again from my workspace, so the invite email isn't the only way back in.

**Unanswered questions** (added 2026-09-04)

10. As an owner, I want to see the questions my bot could not answer, so I know what my people need that the knowledge base lacks.
11. As an owner, I want to answer such a question once and have the bot learn it — or dismiss it when it doesn't belong in the knowledge base — so the next person who asks gets the answer from the bot.
12. As a member, when the bot cannot answer, I want to be told plainly and know the question has been passed on, so I am not left guessing.

## 2. Views

**Chatbots panel** — a new `chatbots` section on the knowledge-base rail (owner only), sitting after Sharing. Lists this knowledge base's bots as cards (name, pool remaining, member count, paused badge) with a one-field "New chatbot" form. Each card links to the bot's manage page. Serves stories 1 and 4 (at a glance).

**Bot manage page** `/chatbots/[chatbotId]/manage` — owner only. Header: name (editable), pool remaining, pause/resume. Members table: email, status (invited / joined), allowance this period, spent this period, remove action; below it an "Invite by email" form. Top-up form: credits to add, then a per-member allowance column pre-filled from the current allowances, and a confirm button whose label reads "Top up 500 credits". Over-allocation is permitted and shown ("Allowances total 800 of a 500-credit pool") rather than blocked. Top-up history list underneath. Serves stories 2, 3, 4, 5. On phones the members table becomes a card list, as ProjectTable does.

An **Unanswered questions** section sits directly under the header: one card per open question — the member's words, the one-line "Needs: …" the bot said it was missing, who asked and how many times — with an **Answer** button that opens a textarea and a "Teach the bot · 50 credits" submit, and a **Dismiss** button. A collapsed "Taught N answers recently" list sits below. The knowledge-base panel's bot cards carry an "N unanswered" badge so the owner knows to look. Serves stories 10 and 11.

**Bot chat page** `/chatbots/[chatbotId]` — the member's whole world. Header: bot name and an allowance pill ("120 of 200 credits left"). Chat feed of the member's conversation with the bot, composer at the bottom. Three quiet states replace the composer: "Your allowance for this period is used up — ask <owner> for more", "This bot is out of credits — its owner needs to top it up", "This bot is paused". Signed-out visitors are sent to sign-in with the bot as the destination. Signed-in non-members see a plain "You're not a member of this bot". Serves stories 6, 7, 8. When the knowledge base cannot answer, the bot says so in the reply and tells the member the question has been passed to whoever looks after the knowledge base (story 12).

**Your chatbots** — a section on `/knowledge-base` beside "Shared with you", listing bots the viewer is a member of. Serves story 9.

**Invite email** — one CTA, "Open <bot name>", linking to the chat page.

## 3. Site map

```
/knowledge-base                       ── "Your chatbots" section → /chatbots/[id]
  /knowledge-base/[knowledgeBaseId]   ── rail: chatbots → panel → /chatbots/[id]/manage
/chatbots/[chatbotId]                 ── member chat (signed-out → /account/sign-in?next=…)
/chatbots/[chatbotId]/manage          ── owner: members, top-ups, settings; back-link to the KB
```

Sign-in learns a `next` destination: the sign-in page passes `?next=` through to the OAuth `redirectTo`, and `/auth/callback` already honours it. That is the whole of story 6 — an invitee who has never signed up clicks the email, signs in with Google or Microsoft, `handle_new_user` creates the profile, the callback lands them on the bot, and the bot page claims their membership by email.

## 4. Entities

Everything below is demanded by a column, a field or a state in the views above.

| Table | Columns | Demanded by |
|---|---|---|
| `chatbots` | `id`, `knowledge_base_id → knowledge_bases`, `owner_id`, `name`, `pool_credits int`, `is_paused bool`, `created_at`, `updated_at` | card, manage header, chat header |
| `chatbot_members` | `id`, `chatbot_id`, `owner_id`, `invited_email`, `member_id → auth.users null`, `allowance_credits int`, `spent_credits int`, `joined_at null`, `created_at`; unique `(chatbot_id, lower(invited_email))` | members table, allowance pill |
| `chatbot_top_ups` | `id`, `chatbot_id`, `owner_id`, `credits int`, `created_at` | top-up history |
| `chatbot_conversations` | `id`, `chatbot_id`, `member_id`, `created_at`, `last_message_at` | chat feed |
| `chatbot_messages` | `id`, `conversation_id`, `speaker` check `('member','bot')`, `body`, `cited_page_keys text[]`, `created_at` | chat feed |
| `chatbot_knowledge_gaps` | `id`, `chatbot_id`, `member_id → auth.users null`, `question`, `missing_knowledge`, `status` check `('open','answered','dismissed')`, `times_asked int`, `answer null`, `source_id → brain_sources null`, `asked_at`, `last_asked_at`, `resolved_at null` | unanswered questions section, card badge |

`pool_credits` and `spent_credits` are stored rather than derived because every question decrements both under one row lock; the top-up history and the owner's credit ledger (reason `chatbot_top_up`) remain the audit trail. A membership is one row from invitation onward: `member_id` null means invited, set means joined. There is no separate invite table and no accept step — the owner named the email, the link is the acceptance.

Conversations get their own tables because `brain_conversations.brain_id` points at one domain brain and a bot spans several. RLS: owners manage their bots, members, top-ups; a member reads their own membership row and their own conversations and messages. `is_chatbot_member(chatbot uuid)` and `is_chatbot_owner(chatbot uuid)` are the security-definer helpers; every insert policy also checks the parent row (a bot on the caller's knowledge base, a member or top-up on the caller's bot), because the ask endpoint reads brain content with the service client and RLS on the parent is the only thing standing between a stranger and someone else's knowledge base. Routes keyed by bot id use a `uuid` param matcher so malformed ids 404 instead of raising in Postgres.

The bot's brains are *not* stored: they are `kb_brains where category = 'domain' and domain_brain_id is not null` for the knowledge base, read at ask time. Instance brains (item collections) are out of scope for the first cut.

## 5. Commands and queries

| Story | Command / query | Where it runs |
|---|---|---|
| 1 | `CreateChatbot`, `RenameChatbot`, `SetChatbotPaused`, `DeleteChatbot` | page actions on the KB page and manage page, plain RLS inserts/updates |
| 2 | `InviteChatbotMember` (insert + Resend email, email failure logged not fatal), `RemoveChatbotMember` | manage page actions |
| 3 | `TopUpChatbot(chatbot, credits, allowances)` | RPC `top_up_chatbot(chatbot uuid, credit_amount int, member_allowances jsonb)` — owner lock, `spend_credits_for`-style ledger debit with reason `chatbot_top_up`, `pool_credits += credits`, every member's `spent_credits` reset to 0 and `allowance_credits` set from the confirmed list, history row inserted; all one transaction |
| 4 | `GetChatbotsForKnowledgeBase`, `GetChatbotManageView` | loads |
| 6 | `JoinChatbot(chatbot)` | RPC `join_chatbot(chatbot uuid)` — claims the row whose `lower(invited_email)` matches the caller's profile email; idempotent; raises `not_invited` |
| 7 | `AskChatbot(chatbot, question, conversationId?)` | `POST /api/chatbots/[chatbotId]/ask` — see below |
| 8 | `GetChatbotChatView` | load: bot, membership, conversation, messages |
| 9 | `GetChatbotsForMember` | `/knowledge-base` load |
| 10 | `GetChatbotKnowledgeGaps` (open, plus the last 8 answered) | manage page load; the open count rides on every chatbot summary as an embedded filtered count |
| 11 | `TeachChatbotAnswer(gap, answer)`, `DismissKnowledgeGap(gap)` | manage page actions `?/answerQuestion` and `?/dismissQuestion` (the page module carries `maxDuration 300` because teaching runs the Modeller) |
| 12 | `RecordKnowledgeGap` | inside the ask endpoint, service client, after the turn is recorded |

**The ask endpoint**, mirroring `/api/v1/brains/[brainId]/ask`:

1. `requireUser`, then RPC `spend_for_chatbot_question(chatbot uuid, member uuid, credit_amount int)` through the **service-role client** — the RPC is revoked from `authenticated`, so the server names the member and the price and a browser can neither spend as someone else nor refund at will. It takes `pg_advisory_xact_lock` on the bot, asserts joined membership and not paused, raises `chatbot_out_of_credits` when `pool_credits < 10` (→ 402 with the "owner needs to top up" message) and `allowance_exhausted` when `spent + 10 > allowance` (→ 402 with the "ask your owner" message), then decrements the pool and increments the member's spend. Returns the member's remaining allowance and the pool. No ledger row: the owner paid at top-up. Only after this passes is the member's conversation looked up or created.
2. Because a member has no RLS path to brain content, the answer step uses the service-role client — exactly as the bearer-token API does — and only after step 1 has proved membership. `getChatbotBrains(service, knowledgeBaseId)` loads contexts and page index for each linked domain brain.
3. `askChatbot(service, brains, turns)` is the Hive Mind loop over live brains: one system prompt rendering each brain's model index under a handle (`slugified kb_brain name + 4 hex of id`), page keys `handle/slug`, `readPagesTool` then a forced `chatbotAnswerTool` — the shared answer tool plus an optional `missingKnowledge` string, which the prompt tells the bot to fill with ONE owner-answerable question whenever the pages could not answer, in full or in part (greetings and chit-chat excluded). Page reads group requested keys by handle and call `getBrainPagesBySlugs` per brain. The last 12 messages of the conversation are remembered, as elsewhere.
4. Record the turn in `chatbot_conversations` / `chatbot_messages` (service client, ids supplied explicitly); when `missingKnowledge` is set, `recordKnowledgeGap` inserts an open gap, or counts another ask on an open gap whose question reads the same (lower-cased, whitespace and trailing punctuation ignored). Return `{ conversationId, answerMarkdown, citedPageKeys, allowanceRemaining, poolRemaining }`. On failure `refund_for_chatbot_question(chatbot)` reverses step 1 and the endpoint returns 502 with the usual "credits refunded" line.

**Teaching** (`teachChatbotAnswer`, 2026-09-04): the owner's answer is rendered as a Q&A note (`renderTeachingNote`) and stored as a `text/plain` source on the knowledge base's primary expertise brain (`storeTeachingNote`, the same signed-upload path the link route uses), the owner pays the document price (`ingestCreditsFor`, 50 credits for a note, reason `chatbot_teach`), and `runSourceIngest` reads it with the Modeller — so the answer lands in the model as concept pages the bot reads from the next question on, shows under Documents, and can be unlearned. On a read failure the source is marked failed and the credits refunded; if the spend fails the note is discarded. The gap is then marked answered with the answer and the source id. Decision (Nigel, 2026-09-04): file as a document rather than writing raw Q&A pages straight into the model.

Pricing moved to the model ladder on 2026-09-03: the reserve is the floor of the member's effective model (member override or the bot's `model_id`) and the answer settles against the pool through `settle_chatbot_question` — see docs/model-pricing.md.

## 6. Files

Migration `migrations/0031_chatbots.sql` (tables, RLS, `is_chatbot_member`, the four RPCs); `migrations/0033_chatbot_knowledge_gaps.sql` (the gaps table, owner-only RLS). Types in `src/lib/data/chatbotTypes.ts`; the price in `creditPricing.ts`. Server modules, one exported function each, under `src/lib/server/chatbots/`: `createChatbot`, `getChatbotsForKnowledgeBase`, `getChatbotManageView`, `getChatbotChatView`, `getChatbotsForMember`, `inviteChatbotMember`, `removeChatbotMember`, `topUpChatbot`, `joinChatbot`, `spendForChatbotQuestion`, `getChatbotBrains`, `renderChatbotIndex`, `readChatbotPages`, `askChatbot`, `recordChatbotTurn`, plus `chatbotInviteEmail` under `email/`. Knowledge gaps: `chatbotAnswerTool`, `parseChatbotAnswer`, `recordKnowledgeGap`, `getChatbotKnowledgeGaps`, `findOpenKnowledgeGap`, `teachChatbotAnswer`, `renderTeachingNote`, `storeTeachingNote`, `markKnowledgeGapAnswered`, `dismissKnowledgeGap`, `requireOwnedChatbot`; the manage route's actions live in `manage/knowledgeGapActions.ts`; components `KnowledgeGapsSection`, `KnowledgeGapCard`, `AnsweredGapsList`, `knowledgeGapAskingLine.ts`. Routes: `src/routes/chatbots/[chatbotId]/{+page.server.ts,+page.svelte}`, `.../manage/{+page.server.ts,+page.svelte}`, `src/routes/api/chatbots/[chatbotId]/ask/+server.ts`. Components under `src/lib/components/chatbots/`: `ChatbotsPanel`, `ChatbotCard`, `NewChatbotForm`, `ChatbotMembersTable`, `ChatbotMemberRow`, `ChatbotMemberCard` (mobile), `InviteMemberForm`, `TopUpForm`, `TopUpHistory`, `ChatbotChat`, `ChatbotAllowancePill`, `ChatbotQuietState`, `YourChatbotsSection`, and `chatbotAsk.ts` on the client. Touched: `kbRail.ts`, `KbPanelContent.svelte`, the KB `+page.server.ts` (bots in the load, create action), `/knowledge-base/+page.server.ts` and its page (Your chatbots), sign-in page and the two `begin*SignIn` helpers (`next`).

## Deliberate gaps

Instance brains are not consulted. Allowances are confirmed only at top-up — there is no mid-period edit (remove-and-reinvite covers the emergency). Members have one conversation per bot; "new conversation" can come later. Nothing streams, as nowhere else does. Deleting a bot forfeits its remaining pool to nobody — a "refund pool to owner" action is a natural follow-up.

Knowledge gaps rely on the bot's own report of what it lacked; nothing re-checks the answer. An answer always goes to the primary expertise brain (the bot reads every brain, so it is found either way). Repeat asks are matched on wording alone, so two phrasings of one question make two gaps. Owners are not emailed about new gaps — the badge on the bot card is the prompt.
