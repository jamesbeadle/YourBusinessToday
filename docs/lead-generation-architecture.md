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
  page, the same view updates that client instead of creating another. Given only a name,
  a few likely `.co.uk` and `.com` domains are tried before asking for the address — there
  is no web search yet.
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

## People and groups

"Client leads" is one way to look at it. Often the person we are trying to reach is a
director or an owner with several companies, and it is their whole business we want — the
automations run across every company they hold. So a lead can be a person as much as a
company: find them on Companies House, pull in every company they are appointed to, research
each as today, and let them become clients one by one or together under a parent.

### User stories

| As | I want | So that |
| --- | --- | --- |
| Staff | to add a person — a director or owner — as a lead | the relationship, not one company, is what I pursue |
| Staff | to find them on Companies House and pull in every company they are currently appointed to, choosing which to keep | their whole business lands on the register in one go |
| Staff | to see all of a person's companies with their stage and research state in one place | I know what we hold on each and what is still to do |
| Staff | to research any of those companies as today | the profile and the angles exist before the first call |
| Staff | to group companies under a parent, so a group is worked as one client while its companies keep their own projects | the group has one stage and one owner, the companies keep their own systems |
| Staff | to see, on a company, who its people are and what else they own | one company opens the door to the rest |
| Staff | to draft an approach to a person that draws on all their companies | the message speaks to their whole business |
| Staff | from a company found on Companies House, to import its officers as people | the people arrive with the company |

### The views

- `/people` — every person on the register: warmth, decision-maker flag, next action and
  its due date, and a dot per company coloured by stage. Add a person inline (name, email,
  phone, seniority). Find on Companies House: an officer search by name, results with the
  appointment count and a birth month and year to tell namesakes apart; picking one creates
  the person with their officer id and opens their page with the import panel showing.
- `/people/[personId]` — the profile header (name, warmth pill, decision maker, next
  action) with an Edit modal; links; timestamped notes; the companies as cards (name, stage
  pill, researched or not yet, Research linking to the existing research flow, and Group
  under… to an existing parent or a new one); Import their companies, which fetches the
  person's active appointments, offers any not yet on the register as checkboxes with Add
  selected companies as leads and an optional Group them under… field defaulting to
  "{Surname} group"; Draft approach, which reads every company's profile; and the ledger
  of events across all their companies.
- `/clients/[clientId]` — each person links to `/people/[id]` and says "also director of N
  other companies"; a "Part of {parent}" line when the company sits in a group and, on a
  parent, the list of its companies; Import officers from Companies House when a company
  number is known, creating people and affiliations and skipping officers already listed.
- `/clients` — Add a lead gains a Company | Person toggle; Person shows the person fields
  and posts to `/people`. A People link sits beside the two research doors and in the
  Manage menu.
- `/clients/prospect` — every result gains Add with directors beside Add as a lead.

### Site map

```
/people ──┬──▶ /people/[personId] ──┬──▶ /clients/[clientId] ──▶ /people/[personId]
          │        ▲                └──▶ /clients/research?clientId=…
          └──(officer)──┘
/clients ──(Person)──▶ /people/[personId]
/clients/prospect ──(Add with directors)──▶ /clients/[clientId]
```

A person and a company each link to the other; neither is the root.

### The entities

**Person** — `public.people`, new. `name`, `email` (one row per address, any number
without one), `phone`, `companies_house_officer_id` (one row per officer, null when not
from Companies House), and the profile that used to sit on a contact: `seniority`,
`is_decision_maker`, `warmth`, `last_contacted_at`, `next_action`, `next_action_due`,
`source_url`, `lead_source`. A person is one row however many companies they hold.

**ClientContact** — `public.client_contacts` becomes the affiliation of a person with a
company: `person_id`, `client_id`, `role`, `is_primary`, `account_id` and `invited_at`
(portal access stays per company), plus what Companies House says about the appointment:
`officer_role`, `appointed_on`, `resigned_on`, and `affiliation_source` (`staff`,
`companies_house`, `website`). Name, email, phone and the profile fields move to the
person: one person, one row, many affiliations.

**PersonLink**, **PersonNote** — `contact_links` and `contact_notes` renamed to
`person_links` and `person_notes`, keyed by `person_id`. What we learn about a person is
true of them at every company.

**Client** — gains `parent_client_id`. A group is a client whose children are its
companies; there is no separate group table. The parent has its own stage and owner and the
children keep theirs, so a group can be a prospect while one of its companies is already a
client.

**ClientEvent** — the ledger learns `person_added`, `appointments_imported`,
`officers_imported` and `grouped_under`. A person's ledger is the union of their
companies' ledgers, each line naming the company.

Migration `0049_people_and_groups.sql` is additive first: it creates `people`, backfills
one row per distinct email (or per name where there is none) from `client_contacts`,
points every contact at its person, renames the links and notes tables to the person, and
only then drops the moved columns. `client_id_for_account()` is untouched.

### Commands and queries

| Command | Story it serves |
| --- | --- |
| `addPerson` | a person typed in |
| `findOrCreatePersonFromOfficer` | a Companies House officer becomes a person, once |
| `affiliatePersonWithClient` | a person joins a company's people |
| `importAppointmentsAsLeads` | the chosen appointments become leads, optionally grouped |
| `importCompanyOfficers` | a company's officers become its people |
| `groupClientsUnder` | companies under a parent |
| `updatePersonProfile` | the person's own fields |
| `addPersonNote`, `addPersonLink`, `removePersonLink` | what we hold on them |
| `draftApproach` | the opening message and call plan, across their companies |

| Query | Story it serves |
| --- | --- |
| `getPeople` | the people register |
| `getPerson` | one person with their links and notes |
| `getPersonCompanies` | their companies, stage and research state |
| `getPersonEvents` | their ledger across companies |
| `getClientPeople` | a company's people and what else each owns |
| `getGroupParents`, `getClientChildren` | the groups to choose from, and a group's companies |
| `searchOfficers`, `getOfficerAppointments`, `getCompanyOfficers` | Companies House |

Companies House lives in `src/lib/server/companiesHouse/`: the advanced company search
that was already there, `GET /search/officers`, `GET /officers/{id}/appointments` (active
appointments at active companies only) and `GET /company/{number}/officers` (active
only), all on the same key and basic auth. The parsers are tested against fixture JSON;
nothing in the tests touches the network.
