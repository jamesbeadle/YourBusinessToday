# Lead Generation — Architecture

How we find the companies we want to work for, learn who runs them, and arrive at the
first conversation already knowing what to say.

This is internal staff tooling, an extension of the client register described in
[client-lifecycle-architecture.md](./client-lifecycle-architecture.md). A lead is a client at
the `lead` stage; nothing here creates a second directory. The Prospector
([prospector-architecture.md](./prospector-architecture.md)) is the customer-facing product
that will one day sell the same idea; its compliance rules apply here in full, but its
credits do not — every Claude call in this feature is our own cost.

## User stories

| As | I want | So that |
| --- | --- | --- |
| Staff | to add a lead by typing the company, its website and the first person I know there | prospecting lands in the register we already run |
| Staff | to see the register by stage | leads read separately from the people who pay us |
| Staff | to give Claude a company name or website and get back a drafted profile and the people it found | I do not spend an hour reading their site before the first call |
| Staff | to review that draft and save it as a lead in one go | nothing reaches the register that a person has not looked at |
| Staff | to search Companies House by sector and place and add a result as a lead | we target many companies, not only the ones we already know |
| Staff | a company profile — industry, location, size, a summary, the angles worth opening with — on the client, editable | the context for any approach lives in one place |
| Staff | to record a person's seniority, whether they decide, how warm they are, when I last spoke to them and what happens next | I know who to call and when |
| Staff | labelled links on a person | I reach their public presence without searching again |
| Staff | timestamped notes on a person, with who wrote them | everything we learn is kept |
| Staff | Claude to draft an opening message and a call plan from everything we hold on the company and the person | the approach is tailored, not templated |
| Staff | a lead that arrived through the website form to sit in the same register | enquiries and prospecting are one pipeline |

The last story is served by the public `/contact` form (migration 0045), which inserts a
lead, a contact and an `enquiry_received` event. It should set `lead_source = 'website'`
so the row says where it came from; if it does not, the ledger still says so.

## The views

- `/clients` — gains stage tabs (All, Lead, Prospect, Client, Dormant, Lost), an inline
  Add lead form (company, website, first contact), and two doors: Research a company and
  Search Companies House. Each row now says where a lead came from.
- `/clients/research` — one field: a company name or a URL. We fetch the public site (the
  homepage and an about or team page if one is linked), and Claude fills a forced tool with
  a summary, industry, location, headcount band, the people it found (name, role, evidence
  URL) and suggested opening angles. The draft is shown in an editable form; Save as lead
  writes the client, its people and a `profile_researched` event. Opened from a client's
  page, the same view updates that client instead of creating another.
- `/clients/prospect` — SIC codes and a location, searched against the Companies House
  advanced search; a results table with company, number, incorporation date, address and
  SIC codes, and Add as lead on every row. Without `COMPANIES_HOUSE_API_KEY` the page says
  so and offers nothing else.
- `/clients/[clientId]` — gains a Company profile section (every profile field editable in
  place, Research again beside it) and People become cards: the structured fields, the
  links (add and remove), the notes timeline (add), and Draft approach. The draft — an
  opening message and a call plan — opens for editing and is saved as a note marked as
  drafted. Projects, requests and the ledger are unchanged.

## Site map

```
/clients ──┬──▶ /clients/research ──(save)──▶ /clients/[clientId] ◀──(Research again)──┐
           ├──▶ /clients/prospect ──(add)───▶ /clients/[clientId] ──────────────────────┘
           └──▶ /clients/[clientId]
```

`/clients/[clientId]` is where every lead ends up, however it arrived.

## The entities

**Client** — `public.clients`, extended again. Gains `lead_source` (`staff`, `website`,
`research`, `companies_house`), `company_number`, and the profile the research view drafts
and the client view edits: `industry`, `location`, `headcount_band`, `profile_summary`,
`opening_angles`, `profile_source_url` (the page the profile was drawn from).

**ClientContact** — gains `seniority`, `is_decision_maker`, `warmth` (`cold`, `warm`,
`hot`), `last_contacted_at`, `next_action`, `next_action_due`, and `source_url` (the page
that named a researched person). A researched person rarely comes with an email address,
so the email uniqueness becomes partial: one row per address, any number without one.
Invite is offered only to a contact who has an address.

**ContactLink** — `contact_id`, `label`, `url`. A link a staff member pastes; nothing here
reads LinkedIn.

**ContactNote** — `contact_id`, `author_id`, `kind` (`note`, `approach`), `body`,
`created_at`. An approach draft is a note of kind `approach`, so the timeline shows what
Claude suggested next to what a person later learned.

**ClientEvent** — the ledger learns `lead_added`, `profile_researched`,
`approach_drafted` and `enquiry_received`.

## Commands and queries

| Command | Story it serves |
| --- | --- |
| `addLead` | a company and its first person, typed in |
| `researchCompany` | fetch the site, draft the profile |
| `saveResearchedLead` | the reviewed draft becomes a client and its people |
| `updateCompanyProfile` | the profile fields, edited in place |
| `updateContactProfile` | the structured fields on a person |
| `addContactLink`, `removeContactLink` | the links on a person |
| `addContactNote` | a note, or a saved approach draft |
| `draftApproach` | the opening message and call plan |

| Query | Story it serves |
| --- | --- |
| `getClientList` | the register, now filtered by stage |
| `getPeopleForClient` | each person with their links and notes |
| `searchCompaniesHouse` | the prospecting results |

Every entry point runs `requireStaff` first. Research fetches over plain `fetch` with a ten
second timeout and a size cap, refuses private hosts, and records the URL it read on the
client and on every person it names. Claude is called through `requestAnthropic` on the
site model; no credits move.

## Deliberately not built

Web-search prospecting, the second Scout source, waits until the Companies House door has
been used. Company-level notes do not exist: the profile summary and opening angles are the
company's context, and what we learn talking to people goes on the person. Nothing sends
a message — a draft is a draft.
