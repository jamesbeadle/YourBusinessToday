# Knowledge Base Dashboard — Architecture

One dashboard per knowledge base. The header says which knowledge base you are in and
lets you switch, the scene shows its brains spinning, a tap flies into a brain and back
out again, and every tool hangs off a small icon set top-right. It works the same on a
phone, with panels as bottom sheets.

This replaces four separate dashboards (knowledge base, expertise brain, experience
brain, process map), each on its own route with its own left rail and its own scene,
where opening a brain was a full page load.

## User stories

| As | I want | So that |
| --- | --- | --- |
| Owner | to land in my most recent knowledge base and switch to another from the header | I am always working inside one, the way a Vercel project is selected |
| Owner or viewer | to see the brains spinning and tap one to fly into it | the brain opens where it lives, not on another page |
| Owner or viewer | to fly back out to the spinning brains | I can move between brains without losing my place |
| Owner | the knowledge base's tools (interview, documents, review, share, chatbots, API, log, settings) top-right | I never leave the scene to use them |
| Owner or viewer | a brain's own tools (interview, ask, model or contents or map, settings) top-right when it is open | each view has exactly the tools it needs |
| Phone user | all of the above, with a tappable list of brains and panels that slide up | the product is usable on site, not only at a desk |
| Anyone | a link to a brain to open that brain directly | deep links and the browser's back button keep working |

## The views

**Header.** On any `/knowledge-base/[id]` route the wordmark is followed by the knowledge
base switcher: the current name with a chevron; the menu lists every knowledge base the
account owns (name, brain count), then "New knowledge base" and "All knowledge bases".
`/knowledge-base` redirects to the most recently updated knowledge base; an account with
none sees the create form.

**Dashboard.** The scene fills the viewport below the header (no footer on these routes).
Top-right: the toolbar — icon buttons for the current tool set. Bottom-centre: the brain
strip — one chip per brain (expertise, experience, process, in the kind's colour) that is
the accessible switcher and, on a phone, the main one. Bottom-left: a back link when a
brain is open.

**Constellation state** (`/knowledge-base/[id]`): the three brains spin; the toolbar shows
the knowledge base tools. Tapping a brain in the scene or the strip flies the camera into
it while the brain's view fades in on top.

**Brain state** (`/knowledge-base/[id]/brains/[brainId]`): the brain's own view — the
expertise constellation, the experience regions, or the process map over its flow scene —
with that brain's tools top-right. "← Knowledge base" (or the strip's current chip, or the
browser back button) fades the view out and flies the camera back.

**Panels.** A tool opens its panel beside the scene: on a wide screen a 380px column that
slides in from the right; on a phone a bottom sheet to about 85% of the height with a
handle, dismissed by dragging down, the scrim or the close button. One panel at a time.

**All knowledge bases** (`/knowledge-base/all`): the register as it is today — every
knowledge base and its brains, invitations, shared brains, your chatbots, the create form.

## Site map

```
/knowledge-base ──▶ /knowledge-base/[id] ◀──▶ /knowledge-base/[id]/brains/[brainId]
      │                     ▲   header switcher ▲
      └──(none yet)──▶ create form              │
/knowledge-base/all ────────┘ (switcher: All knowledge bases)
/workspace/[entityId]/domains/[domainId]   ──307──▶ the brain route when filed in a knowledge base the caller can open
/workspace/[entityId]/workflows/[workflowId] ──307──▶ the brain route when filed in a knowledge base the caller can open
```

`[id]` is a uuid param matcher so `all` is its own route. `[brainId]` is a `kb_brains` id
(expertise or experience) or a `workflows` id (process); the loader resolves which.

## Layout and data

`src/routes/knowledge-base/[knowledgeBaseId=uuid]/+layout.server.ts` loads what the
whole dashboard needs: the knowledge base, ownership, brains, process maps, shares,
chatbots and the workbench (documents, review, API tokens, log for the primary expertise
brain). `+layout.svelte` mounts the scene once and renders the toolbar, the panel and the
strip; child pages render inside it, so the scene survives navigation between the
constellation and a brain — that is what makes the fly-in possible.

The knowledge base page (`+page.server.ts`) keeps the knowledge base actions (archive,
delete, share, remove share, create chatbot). Panels rendered by the layout post to that
page's actions by absolute path, so they work from a brain URL too.

The brain page (`brains/[brainId]/+page.server.ts`) resolves the brain and loads its
view: expertise → contexts, page index, page links, conversation, access role; experience →
items, bound domain brains, schema types; process → conversation, latest map, viewers. Each
loader and each kind's actions live in their own module.

The root layout loads the account's knowledge bases (one query) so the header switcher
needs nothing from the dashboard.

## Tools and panels

A tool is `{ key, label, iconPaths, panel }` where `panel` is a snippet. The layout owns
the active tool and the panel chrome; whoever owns a tool registers it with a rank: the
layout registers the knowledge base tools, a brain view registers its own (ranked above,
under an owner key per brain) on mount and removes them on destroy (`dashboardTools`
context). The highest rank is on show, so the toolbar always shows exactly the tools that
apply whichever order the owners mount in.

| State | Owner tools | Viewer tools |
| --- | --- | --- |
| Constellation | interview, documents, review, share, chatbots, API, log, settings | interview, log |
| Expertise brain | interview, ask, model, settings | interview, ask, model |
| Experience brain | interview, ask, contents, settings | interview, ask, contents |
| Process brain | interview, map, share | interview, map |

## Motion

The galaxy offers `focusSlot(id)` (camera flies to the brain, the others dim), `releaseFocus()`,
`pause()`, `resume()`, `hide()` and `show()`. `BrainFlight` (`brainFlight.svelte.ts`) keeps
the galaxy in step with the URL: a brain in the route flies the camera in while the view
fades in over the scene, and once the flight has settled the galaxy pauses its loop and
hides its canvas — there is nothing to see behind the view. Leaving shows and resumes the
galaxy before the release flight, and the view fades out over it. Landing directly on a
brain URL starts focused with no flight. `prefers-reduced-motion` turns flights and fades
into cuts. Durations and easings are named constants in `dashboardMotion.ts`.

Every scene (galaxy, expertise constellation, experience regions, process flow) rests
while the tab is hidden through one `pageVisibility` rune (`restWhilePageHidden`), and the
stage (`createStage.ts`) caps pixel ratio at 1.5 on narrow screens and 2 on wide ones,
asks for the high-performance GPU only on wide screens, and forces context loss on dispose
so flying between brains never exhausts WebGL contexts.

## Phones

The screen-size check is `screen.isWideScreen`, a live media query on the `lg` breakpoint.
The header is exactly `--site-header-height` tall, the switcher name truncates, and `main`
on dashboard routes is the rest of the viewport with no scrolling.

The dashboard has one top row and one bottom stack, so nothing can collide:

- **Top row** (`DashboardTopBar`, 56px): on the left "Add a second brain" in the
  constellation state or the open brain's name and kind (`BrainTitleBand`, truncating); on
  the right the toolbar — 44px icon buttons that scroll sideways with a hidden scrollbar
  when they overflow, capped to 62% of the width on phones so the title keeps its room.
- **Bottom stack** (`BrainStrip`): the chips (44px tall on phones, wrapping to a second
  row) with the "← Knowledge base" link centred beneath them; on wide screens the link
  sits bottom-left instead.
- **Scene HUDs** ("Whole brain / focused" pills, the constellation key, the neuron detail's
  close, the process map's close) sit top-left under the title band at `sceneHudPosition`;
  the top-right belongs to the toolbar alone. Pointer hints (`sceneHintPosition`) only show
  on wide screens.
- **Panels** are bottom sheets to 85% of the height (`DashboardSheet`): the handle drags the
  sheet down and lets go past 120px or with a flick to dismiss, otherwise it snaps back
  (`SheetDrag`); the page behind stops scrolling while a sheet is open; the scrim, the close
  button and Escape still close it.
- **Process map**: the 2D map overlay stays up once the map tool has opened it, whether or
  not the tool's panel (legend and station detail) is open, and closes from its own chip;
  the SVG scales to the width and the overlay scrolls when it is taller than the viewport.
- **Galaxy**: the camera rests further back in portrait so the whole ring fits
  (`kbGalaxyFraming.ts`), labels shrink below 768px and again below 480px, a touch with
  no more than 6px of drift is a tap, and a lifted finger clears the hover.

## Not built

The old four dashboards are removed once the new one covers them. The workspace domain
and workflow routes stay for brains that are not filed, and for shared viewers without
knowledge base access, with their own rail and panels.
