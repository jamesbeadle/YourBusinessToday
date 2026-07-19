# The Second Brain — Architecture

How YBT captures what a business knows: every document the company files, read once by a
librarian agent and remembered as a wiki, so any question gets an answer grounded in the
company's own records.

## The product in one sentence

Upload the documents your business files; a librarian agent reads each one and maintains a
wiki — one page per client, supplier, project, or topic — that you can browse like a
knowledge base and question like a colleague.

## The shape: Karpathy's LLM wiki, stored in Supabase

The design follows the three-layer pattern of an incrementally maintained persistent wiki
(karpathy's LLM-wiki gist), with Supabase standing in for the git repository:

- **Raw sources (immutable)** — uploaded files in the private `brain-sources` Storage
  bucket, catalogued in `brain_sources`. The librarian reads them; nothing ever edits them.
- **The wiki (librarian-maintained)** — `brain_pages`, markdown pages written ONLY by the
  librarian agent. Every overwrite snapshots the previous version into
  `brain_page_revisions`, so the wiki has history like a ledger.
- **The schema** — the librarian system prompts (`ingestLibrarianPrompt.ts`,
  `queryLibrarianPrompt.ts`) encode the conventions that make a generic model a
  disciplined wiki maintainer: one page per entity, kebab-case slugs, update-don't-
  duplicate, complete bodies on update, cross-links as `[Title](/brain/slug)`, never
  invent.

Two supporting artefacts complete the pattern, both derived rather than stored where
possible: the **index** (slug + one-line summary per category) is computed from
`brain_pages` on every request — derive what's derivable — and the **log** is
`brain_events`, an append-only record of everything the librarian does, rendered as the
activity panel.

## The operations

**Ingest (50 credits).** Upload goes browser → Supabase Storage via a signed upload URL
(files never pass through the server — Vercel's request-body cap stays irrelevant). The
ingest endpoint then: spends credits → downloads the file → turns it into a Claude content
block (PDFs and images as native document/image blocks; docx text via mammoth; txt and md
read directly) → hands it to the ingest librarian with the current index → applies the
returned page writes (≤8, each a complete body) → records events → marks the source
ingested with a one-line summary. Any failure marks the source failed and refunds the
credits; retry is one click.

**Query (10 credits).** The query librarian gets the index and the question, requests the
page bodies it needs (one read_pages round), and answers with citations. The answer and
its cited slugs are recorded as a `question_answered` event, which is also how the ask
panel shows history — the log is the conversation store, no extra tables.

**Lint** — the periodic health-check that finds contradictions, orphaned pages, and
missing cross-references — is the designed third operation, deliberately deferred.

## Credit metering

| Action | Credits | Reason in credit_ledger |
| --- | --- | --- |
| Document ingest | 50 | `brain_ingest` |
| Failed ingest refund | +50 | `brain_ingest_refund` |
| Question | 10 | `brain_question` |

Spending happens in Postgres (`spend_for_brain_ingest`, `spend_for_brain_question`,
`refund_for_brain_ingest`) with the same locking, restriction, and balance idioms as
`spend_for_agent_reply`. The refund function refuses to refund more ingests than were
spent.

## Why this compounds

Each document makes the wiki denser and every future answer better; each answer shows its
sources, which builds the trust to file more documents. And the wiki is exactly the
corpus the Workforce will need when it starts running tasks — what the business knows,
already structured, already cross-referenced, already owned by the customer.
