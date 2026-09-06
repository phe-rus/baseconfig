# BaseConfig — Staged Build Plan

**Read this file first when resuming this project, on any day, in any session, on any AI model.** It is written to be self-contained: don't assume you remember a prior conversation. For the *reasoning* behind any decision referenced here, see `docs/DISCUSSION.md` (dated entries, chronological, corrections are appended not edited away). For the *current-state summary*, see `CLAUDE.md`.

## Rules for working this plan

1. **Do not start a stage without the user's explicit go-ahead for that specific stage.** Writing or updating this plan is not a go-ahead. "Looks good" about the plan is not a go-ahead to start Stage 0.
2. **One stage at a time.** Finishing a stage does not mean starting the next one — stop at the checkpoint and wait.
3. **Mark TODOs `[x]` in this file as they complete**, in place, so the file itself is the source of truth for progress — not memory, not a conversation history.
4. **Before starting any stage**, re-read `CLAUDE.md` and skim recent `docs/DISCUSSION.md` entries — decisions may have evolved since this plan was written (2026-08-31).
5. If a stage's plan turns out to be wrong once you're in it (a decision doesn't survive contact with real code), **stop, surface it, update `docs/DISCUSSION.md` with a new dated correction entry, update this plan's TODOs to match, get go-ahead again** — don't silently improvise past what's written here.
6. Every code-style rule in `CLAUDE.md`'s "Code structure & style conventions" section applies from Stage 0 onward, no exceptions for "just scaffolding."

## Status

Plan originally written 2026-08-31 under the project's old name (Demoness). Stages 0–3 below were actually built under that name, then **deleted on 2026-09-04** as part of renaming the project to BaseConfig and resetting to a design-review pass — see `docs/DISCUSSION.md`'s 2026-09-04 entry and `CLAUDE.md`'s Status section for why. The deleted implementation is preserved in git history (checkpoint commit "checkpoint: snapshot pre-baseconfig-rename state") if anything from it is worth resurrecting.

**No stage has started under the current plan. Awaiting go-ahead for Stage 0, once the design review this reset triggered is done.** Stages 0–3's goals/TODOs below are left unchecked and renamed to `@baseconfig/*` — treat them as the working plan again, not as historical record (the historical record of what was actually built and undone lives in `docs/DISCUSSION.md`, not here).

---

## Stage 0 — Scaffolding & conventions

**Goal**: the folder structure and empty packages exist. Nothing functional. No collections, no admin UI, no engine logic.

- [ ] Create `packages/baseconfig-fields/`, `baseconfig/`, `baseconfig-d1/`, `baseconfig-r2/`, `baseconfig-ai/` — each with `package.json` (`@baseconfig/*` scope), `tsconfig.json`, empty `src/index.ts`. Workspace globs in root `package.json` already cover `packages/*`, no turbo.json change needed.
- [ ] Create `www/collections/` and `www/globals/` (empty except a `README.md` explaining what populates them and when — siblings of `src/`, per `CLAUDE.md`'s Routing & folder layout section). Both already exist as placeholders from the prior build; confirm they still match the current plan before reusing them.
- [ ] Create `www/src/domains/` (empty, populated next in Stage 1) and `www/src/blocks/` (empty except a `README.md` — populated in Stage 6).
- [ ] Create/confirm `www/wrangler.jsonc` with placeholder D1/R2/KV bindings only (`REPLACE_WITH_REAL_*` — no real Cloudflare resources provisioned). Already exists, renamed to `baseconfig`/`baseconfig-dev`/`baseconfig-media-dev` — confirm it's still accurate before building on it.
- [ ] Linting: confirm Biome (`biome.json`, monorepo-wide already in place) covers the new `@baseconfig/*` packages with the same two custom rules used elsewhere (`style.useConsistentTypeDefinitions: "type"`, `suspicious.noConstEnum`), `packages/ui` kept scope-fenced out.
- [ ] `bun install`, confirm workspace symlinks resolve for the new packages, `turbo typecheck` clean.

**Checkpoint**: wait for go-ahead before Stage 1.

---

## Stage 1 — Visual admin shell (static data, no engine)

**Superseded location, corrected 2026-09-05**: this stage's TODOs below still say `www/src/domains/*` — that idea is abandoned. The admin UI lives entirely inside `@baseconfig/core`'s own `src/admin/` (see `CLAUDE.md`'s `@baseconfig/core` section for the real current file tree), not inside the `www` consumer app at all; `www` only ever gets the thin route files that mount it. This stage is also **already partially in progress**, built with per-piece go-ahead outside the normal "start a whole stage" flow — the dashboard-shell item below is done (placeholder data); the rest are not started. Treat the checkboxes below as the real remaining TODO list, re-scoped to `packages/baseconfig/src/admin/`, not as an unstarted stage.

**Goal**: prove the routing structure and the visual/UX layer concretely and cheaply, using **hardcoded/static data** in each view — not the real field engine, not real D1 queries, not real auth — before investing in the generic engine underneath it.

- [x] Admin shell chrome — `packages/baseconfig/src/admin/views/route-root.tsx` (layout, no sidebar) + `views/headers/index.tsx` (sticky topbar: nav icons, breadcrumb, visit-site, avatar), wired live into `www` via `www/src/routes/(admin)/admin/route.tsx`.
- [x] Dashboard — `packages/baseconfig/src/admin/views/config/documents.tsx`, stat-tile row + Collections/Globals card grid, static data. Currently what `RouteComponents` renders unconditionally at `/admin`.
- [x] **Sub-stages 1A + 1B — nested TanStack router (code-based routing) + the real collection list view.** Both built and verified 2026-09-05, through multiple design/naming passes (full trail in `docs/DISCUSSION.md`). `www/src/routes/(admin)/admin/$.tsx` stayed exactly `createFileRoute('/(admin)/admin/$')(defineHandler())` throughout — the one and only admin route file, never touched again after 1A began. **Real, current file layout** (`packages/baseconfig/src/admin/views/`), settled after several direct reorganizations:
  ```
  views/
  ├── root.tsx                            # RouteRoot — chrome wrapper (Headers + children), wraps the whole /admin/* subtree from www's side
  ├── headers/index.tsx                    # Headers — sticky topbar
  ├── route-tree.tsx                       # the nested router's actual route tree: adminRootRoute (component wraps <Outlet/> in the shared `container` article) → dashboardRoute ('/'), globalRoute ('globals/$slug'), collectionRoute ('$slug') → idRoute ('$id'). Each of globalRoute/collectionRoute has its own loader validating the slug against documents/data.ts, throwing notFound() if unmatched.
  ├── defineHandler.tsx                     # defineHandler() — the ONLY exported piece. Builds+mounts the nested router (RouterMount/InnerRouter, both private to this file — no separate admin-router-mount.tsx, deliberately consolidated: "we are now reducing the files... so we dont have lots of files") and returns { component: RouterMount } for www to spread into createFileRoute(...).
  ├── components/view-model.tsx             # Viewmodel — shared dashboard card-grid renderer (cross-page, hence its own components/ folder rather than living under documents/ or pages/)
  ├── documents/data.ts                     # collections/globals static arrays — the folder's sole remaining purpose, kept tiny and eager-safe so route-tree.tsx's loaders can import it directly without pulling in any page component's own code
  └── pages/
      ├── overview.tsx                       # OverviewComponent — the dashboard
      ├── globals.tsx                         # GlobalsComponent — global editor, placeholder (Sub-stage 1C builds the real one)
      └── collections/
          ├── index.tsx                       # CollectionsComponent — collectionRoute's actual component: does both jobs in one file — list-vs-nested-$id dispatch (useChildMatches()/<Outlet/>, no separate collection-view/ folder — "then that goes inside pages its a page") AND the real list-view content, built in 1B
          └── uid.tsx                          # UUIDComponent — document editor, placeholder (Sub-stage 1C builds the real one)
  ```
  - **Naming convention locked in**: every `views/pages/*` component is named `{PageName}Component` (`OverviewComponent`, `GlobalsComponent`, `CollectionsComponent`, `UUIDComponent` — `UUID` stays fully capitalized as an acronym). Single-declaration files export inline (`export const x = ...` / `export function X() {}`) — never `const x = ...; export { x }` at the bottom (refined in `CLAUDE.md`'s exports rule: that convention is about *grouping multiple* declarations' exports, not splitting a file's one and only export into two statements). **General preference confirmed this stage: fewer, more consolidated files over one-thing-per-file splitting** for tightly-coupled implementation details — merge rather than fragment when two pieces are never used apart from each other.
  - **The nested router mechanism** (`defineHandler.tsx`): `createRouter({ routeTree: adminRouteTree, basepath: '/admin', history })` — `createMemoryHistory` server-side (seeded from the current splat, with a **trailing slash** when there's no further path — `/admin/` not `/admin`, since basepath-stripping otherwise leaves an empty string that doesn't match the dashboard's `path: '/'`), `createBrowserHistory` client-side. `router.load()` is awaited via React 19's `use()`, inside a separate `InnerRouter` component wrapped in its own `<Suspense>` by the outer `RouterMount` (a `use()` call needs an *ancestor* boundary — a component can't wrap its own `use()` call in a `<Suspense>` of its own).
  - **`CollectionsComponent`** (`pages/collections/index.tsx`): header row (collection label, looked up from `documents/data.ts` by slug, + inert "+ New" button) and a dense row-list (title, status `Badge`, updated date) — deliberately distinct from the dashboard's card-grid. Static placeholder dataset (5 fake documents), same for every collection slug for now. Reads its own `slug` via `useLoaderData({ strict: false })`, matching how `GlobalsComponent`/`UUIDComponent` read their own route data internally rather than receiving it as a prop from a parent. Row click navigates to `/{slug}/{id}` (nested-router-relative — no `/admin` prefix needed).
  - **Real bugs found only by testing against the actual dev server, not by reasoning about the API alone**:
    1. `use(loadPromise)` with no ancestor `<Suspense>` silently rendered nothing at all, on every route including the dashboard.
    2. The dashboard route specifically rendered empty while every other route worked — root cause was the missing trailing slash described above.
    3. A hand-rolled `React.lazy()` + manual `<Suspense>` around `CollectionsComponent` (an early version of `CollectionView`) crashed during SSR (`Cannot read properties of null (reading 'useContext')`, silently falling back to client-only rendering) — the other three page components all use TanStack's own `lazyRouteComponent()`, which has correct SSR/Suspense wiring built in; switching to it fixed this.
    4. The dashboard's own card links (`Viewmodel`) broke silently (zero `<a>` tags rendered) right after the nested-router rewrite — they still targeted the *outer* app router's `/admin/$` splat route, but `Viewmodel` renders *inside* the nested router now, which has no such route in its own tree. Fixed to use the nested router's own paths directly: `to='/$slug'` (collections) / `to='/globals/$slug'` (globals).
  - **One known, accepted gap, not fixed**: `/admin/bogus-slug` returns real "Not Found" content (TanStack's default fallback — a genuinely working `notFound()` throw) but the outer HTTP status is still 200, not 404 — the nested router's `notFound()` is internal to it and doesn't propagate to the outer file-route's response status. Lower-stakes for an authenticated admin panel than for public content; revisit if it ever matters.
  - Checkpoint passed, verified via `curl` against real SSR output (not assumed): `/admin` → dashboard, `/admin/pages` → the real list (5 rows, correct titles/status/dates/hrefs), `/admin/pages/abc123` → through the nested `$id` child, `/admin/globals/headers` → global view, `/admin/bogus-slug` → notFound content, dashboard card links all correct. `tsdown`'s build output confirmed separate chunk files per view (`overview-*.mjs`, `collections-*.mjs`, `uid-*.mjs`, `globals-*.mjs`, `data-*.mjs`) — real evidence the original code-splitting goal was actually achieved, not just structurally plausible.
- [x] **Sub-stage 1C — document editor view.** Built 2026-09-05, after 1B (collection list). Builds the real view at `pages/collections/uid.tsx` (was `UUIDComponent`, a placeholder) and `pages/globals.tsx` (was `GlobalsComponent`, a placeholder) that 1A's loaders already resolve `/admin/:slug/:id` and `/admin/globals/:slug` to. **Audited against Payload's real Edit-view source before writing this plan** (`gh api` against `payloadcms/payload`'s actual `packages/ui/src/views/Edit/index.tsx`, `elements/DocumentHeader`, `elements/DocumentControls`, `elements/DocumentFields`, `elements/Status`, `views/API` — not docs prose, not assumed), same discipline as 1A/1B/the fields work.

  **Real structure found, and how it maps onto BaseConfig's already-decided design (`CLAUDE.md`)**:
  1. Payload's real `DocumentHeader` (title + a real URL-tab strip: Edit `''` / Versions `/versions` / API `/api`) sits *above* the actual `DefaultEditView`, which separately sets its own page title and renders `DocumentControls` + the field area. **BaseConfig doesn't need an equivalent of `DocumentHeader`'s title/tabs** — our `Headers` component (`admin/views/headers/`) already owns the sticky top breadcrumb/nav for the whole admin, and CLAUDE.md's already-decided divergence keeps Hero/Layout/SEO/Settings as *content* tabs inside the page, not URL segments. Versions/API-as-real-URL-segments stays an explicit open question (CLAUDE.md's Open questions) — **not resolved by this stage**, only mocked as inert secondary controls (see point 4 below).
  2. Payload's real `DocumentControls` bar has two halves: **left** = status meta (a `Status` pill + relative "updated ago" text), **right** = icon buttons (Live Preview toggle, Preview link) + Save/Publish button(s) + a "more actions" popup (duplicate/delete). Confirmed directly from `elements/Status/index.tsx`: **status is a real three-state value — `'draft' | 'published' | 'changed'`** (`'changed'` = published, but with unpublished edits sitting on top), not the two-state `'published' | 'draft'` BaseConfig's placeholder `Document` type currently has. This stage should widen that type and its badge rendering to the real three states (both here and in the collection list's own Status column, `pages/collections/index.tsx`).
  3. **Two independent structural concepts, confirmed from `elements/DocumentFields/index.tsx` — not to conflate**: (a) the Hero/Layout/SEO/Settings tab strip (already-decided, CLAUDE.md's `tabs`-field insight) groups fields *within* the main column; (b) completely separately, Payload gives any field with `admin.position: 'sidebar'` a spot in a **persistent right-hand sidebar column** that stays visible regardless of which tab is active — driven by `fieldIsSidebar()` partitioning `fields` into `mainFields`/`sidebarFields` before rendering, not a tab concept at all. BaseConfig has no real per-field `position` data yet (Stage 2/4), but the **two-column layout itself** (tabbed main content + persistent sidebar) is worth building for real now with mocked sidebar content, so this doesn't need a second layout pass once real fields exist later.
  4. Whether Live Preview / JSON / API become real URL segments (Payload's actual pattern) or stay client-side view state is an explicit open question this stage doesn't resolve (see the callout right below this list) — mocked as an inert secondary toggle row for now.
  5. Payload's real `views/API/index.tsx` is a thin wrapper around a client JSON viewer — nothing structurally interesting to port, just confirms "JSON/API view" is genuinely just a read-only pretty-printed dump of the document's data.

  **Proposed file layout** (new `admin/editor/` folder, sibling to `views/` and `tables/` — same reasoning as this session's `tables/` category-folder restructure: each concern gets its own folder, shared between the collection-doc editor and the global editor rather than duplicated):
  ```
  src/admin/editor/
  ├── index.ts                  # barrel
  ├── controls/
  │   └── index.tsx               # EditorControls — status pill + "updated ago" meta (left) / Save+Publish buttons + inert "more actions" popup (right), inert placeholders, mirrors doc-controls's two-half layout
  ├── tabs/
  │   └── index.tsx                # EditorTabs — Hero/Layout/SEO/Settings client-side tab strip + active panel, per CLAUDE.md's tabs-field insight
  ├── sidebar/
  │   └── index.tsx                 # EditorSidebar — persistent right column, mocked meta block (status/id/created/updated) standing in for real admin.position:'sidebar' fields
  ├── status-badge/
  │   └── index.tsx                  # StatusBadge — draft/published/changed pill (reusable: also swaps into the collection list's existing Status column)
  └── data.ts                          # mock per-tab field content (Hero → title/subtitle; Layout → mock block list; SEO → mock meta fields; Settings → mock slug/parent/tags) + mock sidebar meta, this stage only — no real field engine exists yet (Stage 2)
  ```
  `pages/collections/uid.tsx` (`UUIDComponent`) and `pages/globals.tsx` (`GlobalsComponent`) become thin assemblers of the pieces above (title row, `EditorControls`, then a two-column row: `EditorTabs` + `EditorSidebar`) — matching how `pages/collections/index.tsx` is already a thin assembler of `CollectionTable`, not where the real logic lives.

  **Explicitly NOT resolved by this stage, flagged rather than silently decided**: whether Live Preview / JSON / API become real URL segments (Payload's actual pattern) or stay client-side view state (matching Hero/Layout/SEO/Settings' own pattern) — CLAUDE.md already marks this open. This stage's proposal: render them as a row of inert secondary toggle buttons above the tab strip ("Edit · Live Preview · JSON · API", only "Edit" interactive) so the visual shape exists without committing to either architecture — genuinely revisit once Live Preview's real sync mechanism gets designed.

  - [x] `admin/editor/status-badge/` — `StatusBadge`, three real states (`draft`/`published`/`changed`), swapped into both the editor's `EditorControls` and the collection list's existing Status column (`pages/collections/index.tsx`'s `Document['status']` type widened to match; one mock row set to `'changed'` for realism).
  - [x] `admin/editor/controls/` — `EditorControls`, inert Save/Publish/more-actions placeholders, real status+meta text.
  - [x] `admin/editor/sidebar/` — `EditorSidebar`, mocked meta block. Takes an optional `id` prop so the collection-doc editor shows the real route `id`; globals pass none, correctly hiding the ID row (Payload's own real behavior for globals, confirmed by omission rather than assumed).
  - [x] `admin/editor/tabs/` — `EditorTabs`, Hero/Layout/SEO/Settings, built on `@baseconfig/ui`'s real `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent` (Base UI-backed, uncontrolled `defaultValue='hero'`), client-side, no URL change.
  - [x] `admin/editor/data.ts` — mock per-tab content + mock sidebar meta.
  - [x] `admin/editor/view-switcher/` — `ViewSwitcher`, the inert Edit/Live Preview/JSON/API row (own folder, since it's shared between both editor pages).
  - [x] Wired `pages/collections/uid.tsx` (`UUIDComponent`) and `pages/globals.tsx` (`GlobalsComponent`) to assemble the pieces above; globals variant omits the id-specific sidebar row.
  - [x] Secondary Edit/Live-Preview/JSON/API toggle row, inert except Edit.
  - **Checkpoint passed, SSR-`curl`-verified** (no browser tool available this session, stated plainly rather than claimed as browser-tested): `/admin/pages/{uuid}` renders the real title, `Draft` status, Save/Publish buttons, all four tab labels (Hero/Layout/SEO/Settings), the real route `id` in the sidebar, and all four view-switcher labels — all present in fresh SSR HTML after a clean `bun run dev` restart, zero runtime errors in the dev log. `/admin/globals/headers` renders correctly with `Published` status and no ID row. `/admin/pages` (the list) still renders all 8 rows with correct anchors and now shows a real `Changed` badge. `tsc --noEmit` clean in both `packages/baseconfig` and `www`, a real `tsdown` build succeeded. **Not verified**: the actual tab-click interaction switching panels client-side, and the drag/hover states elsewhere in the admin — genuinely can't be exercised without a browser in this session, flagged rather than assumed working from the SSR check alone.

- [x] **Sub-stage 1C — Design correction.** Built 2026-09-05. Audited against this project's own real, pre-existing design canvas artifact ("Demoness CMS Mockups" — 13 `.dc.html` artboards, read in full via the `Artifact` tool, not assumed) rather than Payload's real product, which is what 1C above had (wrongly) been designed against. Full findings in `docs/DISCUSSION.md`'s dated correction entry — punch list here, roughly in build order, all items done unless noted:
  1. **Remove `admin/editor/sidebar/` entirely.** The real design has no persistent sidebar in the editor — every editor artboard is a single centered column (`max-width` constraint, no second column). Move its content (Status/Created/Updated — "Document Info") into a new section at the *bottom of the Settings tab panel* instead, matching `EditSettings.dc.html` exactly. `pages/collections/uid.tsx`/`pages/globals.tsx` lose their `<EditorSidebar/>` usage; `uid.tsx`'s route `id` moves into that Settings-tab section instead of a sidebar row.
  2. **`StatusBadge` stays for the collection list's Status column** (the real mockup does use a colored pill there) **but is removed from the editor's `EditorControls`** — replace with plain inline text: `Status: **{status}** · saved {relative time}`, matching the real copy exactly, no badge.
  3. **Button copy**: `EditorControls`'s "Save" → **"Save Draft"**. Drop the "more actions" (⋮) dropdown from `EditorControls` — not present in the real design.
  4. **`ViewSwitcher` loses its "JSON" item** — real set is `Edit / Live Preview / API` (three, not four), and its visual treatment switches from a filled/pill toggle row to underline tabs (bottom-border on the active item, transparent otherwise) — same visual pattern needed for point 5.
  5. **`EditorTabs`'s visual language needs to move to underline-style**, not `@baseconfig/ui`'s stock `Tabs`'s default filled `bg-muted` pill list. **Already resolved by checking the component source directly**: `TabsList`'s own `variant='line'` is a real, first-class option (`tabs.tsx`'s `tabsListVariants`) that gives exactly this — transparent background, an `after:` pseudo-element that only opacity-shows as a 2px bottom line on the active trigger. No custom styling needed, just pass `variant='line'` to `TabsList` (both for `EditorTabs`'s Hero/Layout/SEO/Settings row and the `ViewSwitcher`'s Edit/Live Preview/API row — `ViewSwitcher` should likely become a second, smaller real `Tabs` instance using the same variant rather than the hand-rolled `<button>` row it currently is).
  6. **Real per-field UI patterns to build, replacing the flat `Input`/`Textarea` stand-ins**, per tab:
     - **Hero**: title `Input` (keep), a segmented pill selector for a "Type" field (None/High/Medium/Low Impact — a real `select`-like field type, not free text), a mocked rich-text toolbar wrapping the intro-content field (B/I/U/H1/list icons — static, no real editor yet, matches the project's "no third-party rich-text libs" rule and CLAUDE.md's own primitive-contentEditable direction), a media row (thumbnail + filename + "Replace"), and a "Links" repeater section (dashed "Add Link" pill, each link an expandable card: type toggle Internal/Custom, label/URL fields, "open in new tab" checkbox, appearance dropdown).
     - **Layout**: a real block-list UI — first block shown expanded (drag handle, colored type-icon square, name + description, chevron, then block-specific config), the rest collapsed to header rows only, dashed "Add Block" pill above the list. Matches this project's already-planned `blocks` field type (`CLAUDE.md`'s field taxonomy) — good opportunity to also sanity-check the mock data shape against `@baseconfig/fields`' real `blocks()`/`block()` builders once this gets built for real.
     - **SEO**: Meta Title/Description with a live character-count + "Good/…"-style quality chip + a thin progress bar under each, a meta-image row (same pattern as Hero's media row), and a Google-style search-result preview card at the bottom.
     - **Settings**: an Authors list (avatar-initial circles + name/email + remove ×, dashed "Add Author" pill), Slug field with an inline edit-pencil affordance + a small resolved-URL preview line, a Parent dropdown, Tags as removable colored pills + dashed "Add Tag" pill, a hairline divider, then the "Document Info" section absorbed from point 1.
  7. **Add the floating "Ask AI to help write this page…" bar** — centered, sticky to the bottom of the editor viewport, present on every editor sub-view (Hero/Layout/SEO/Settings/Live Preview/API). New small component, inert for this stage (no real AI wiring — that's Stage 10), but the UI chrome should be real: a pill input + a send/submit affordance.
  8. **Collection list revisions** (`CollectionTable`/`pages/collections/index.tsx`), reconciling against `PagesList.dc.html`: table wrapped back in a bordered, rounded card (`overflow-hidden rounded-md border border-border/35`) — this session had removed that border/radius earlier by pattern-matching Payload's own real screenshots specifically, a second instance of the same Payload-as-visual-reference mistake, now corrected; zebra-striping dropped (real design is flat white rows with hairline separators, no alternating background); a real **Author** column added (`Avatar`/`AvatarFallback` initials + name — mock data, two authors reused across rows, no real user system yet); a trailing per-row "more actions" (⋮, `MoreHorizontalFreeIcons`) column added to `CollectionTable` itself (a `moreActionsColumn` display column, `enableHiding: false`, appended after the caller's own columns) — inert for now, real actions come once there's something for them to do.
  9. **Explicitly NOT reverted, flagged as a deliberate, real-time-instructed departure from the archived mockup**: full UUIDs (not `pg_xxxxxx`-style short codes) and the structured multi-field Columns/Filters panels (not the mockup's simple "Filter ⌄" dropdown) — both came from direct, explicit instructions given later than when this mockup was made, and stand as-is.
  10. **Explicitly NOT in scope, and not done**: recoloring anything to the mockup's literal hex palette (`#F5F0E6`/`#DB5A2B`/etc.) or switching fonts to `Inter`/`Sora` — `CLAUDE.md`'s Admin UI theming section already settled this (token-first, zero hardcoded colors); only structure/copy/information-density/interaction-pattern changes were made.
  - **Checkpoint passed, SSR-`curl`-verified after a clean `bun run dev` restart** (no browser tool available this session): `/admin/pages/{uuid}`'s Hero tab (the default-active one) shows "Save Draft"/"Publish" buttons, plain-text `Status: **Draft** · saved 2 min ago` (confirmed correct despite a React hydration-comment split making a naive substring check read false), the Type toggle group, the rich-text-toolbar mock, the Links repeater, and the floating "Ask AI…" bar. `/admin/globals/headers` renders correctly with `Published` status; Base UI's `Tabs` only mounts the active panel into the DOM (same lazy-render behavior already seen with popovers earlier this session), so Layout/SEO/Settings content is legitimately absent from this particular SSR snapshot, not a bug. `/admin/pages` (the list) shows the bordered card, no zebra stripe, real Author names (`Amara N.`/`Jonas T.`), and all 8 row links intact. `tsc --noEmit` clean in both packages, a real `tsdown` build succeeded (88 files). **Not verified**: actual tab-click/toggle-group/collapsible interactions in a real browser — this session has none.

- [ ] Media view — folder chips + file grid, static data. Not started, after 1C.
- [ ] Site-map view — a static rendering of the mocked map-canvas layout is enough for this stage; real freeform drag/zoom is future scope. Not started.
- [ ] Auth view — placeholder stub only. Not started.
- [ ] Visual QA (whole stage): confirm every view actually renders real content in a browser (or via SSR'd HTML assertions if no browser tool is available), not just a 200 status or an error boundary.

**Icon library convention**: `@hugeicons/react` + `@hugeicons/core-free-icons` for all first-party BaseConfig code, not `lucide-react`. Exception: `packages/ui`'s own vendor-generated shadcn components keep whatever icon library they were scaffolded with (not worth hand-editing generated files for) — confirmed 2026-09-05 the real primitive vendor underneath is Base UI (`@base-ui/react`), not Radix.

**Checkpoint**: wait for go-ahead before Stage 2, and **one sub-stage at a time within Stage 1 itself** (1A → checkpoint → 1B → checkpoint → 1C → checkpoint) — same one-stage-at-a-time rule applies at this finer grain now that Stage 1 is this detailed. As of 2026-09-05, 1A is done — Sub-stage 1B (collection list view) is next, pending explicit go-ahead.

**Follow-ups surfaced during Stage 1, not fixed (out of scope, pre-existing, flagged for the user to decide on)**: `packages/ui/src/components/spinner.tsx` fails `tsc --noEmit` (`string | number` not assignable to `number | undefined`) and `packages/baseconfig/src/admin/views/root.tsx` (holds `RouteRoot`, unrelated to 1A's `route-tree.ts`) needs a type-only import for `PropsWithChildren` (`verbatimModuleSyntax`) — both predate this stage's work (confirmed via clean `git status` before touching anything), both currently block a clean top-level `turbo typecheck` run (`www`'s typecheck pulls in that file's source; `ui`'s own typecheck task gates `core`'s in the turbo graph). Per-package typechecks (`packages/baseconfig`, `www`) were used directly to verify instead, throughout Stage 1.

**One accepted gap from 1A, not a bug to silently forget**: `/admin/bogus-slug`-style URLs return HTTP 200 with correct "Not Found" content, not a real 404 status (see 1A's own note above for why) — acceptable for now on an authenticated admin panel, revisit if it ever matters.

---

## Stage 2 — `@baseconfig/fields`

**Goal**: field builder functions exist and produce Payload-shaped config objects.

**Built ahead of schedule, 2026-09-05, per direct instruction (not the normal per-stage go-ahead flow)** — see `CLAUDE.md`'s `@baseconfig/fields and buildConfig` section for the full real structure and `docs/DISCUSSION.md` for the research trail. Real location: `packages/baseconfig/src/fields/` (not `src/field-types/` as originally planned here — corrected to match where the package actually lives, `@baseconfig/fields` merged into core back on 2026-09-04).

- [x] All 23 builders implemented (22 from the original taxonomy + `slug`, confirmed as a genuine distinct Payload field type via real source — see `CLAUDE.md`'s Field taxonomy correction). Confirmed via real Payload source (`packages/payload/src/fields/config/types.ts`, not docs prose) that Payload itself has no builder-function layer to port — these are BaseConfig's own sugar over Payload-shaped plain objects.
- [x] Every builder attaches a real Zod schema (`field.schema`), composed recursively for `group`/`array`/`blocks`/`tabs` — verified both by `tsc` and a real runtime smoke test (constructed sample fields, ran `.schema.safeParse()` against sample data, all passed).
- [x] `AnyField`'s loose typing handled as anticipated (`src/fields/types/index.ts`).
- [ ] **`admin.component` string — dropped from scope, corrected against this file's own already-decided design**: this bullet as originally written contradicts `CLAUDE.md`'s admin/consumer-split entry (`docs/DISCUSSION.md`'s 2026-08-31 entry) — the admin app resolves a field's rendered component by looking up `field.type`, not by reading a mandatory `component` string every field carries. `ui.ts` is still the one legitimate exception (its whole purpose is being a named custom-component slot). Not something to add back without re-deciding that principle first.
- [ ] Unit tests — not yet written (a runtime smoke test substituted for verification this pass, not a real test suite).
- [ ] `turbo typecheck lint --filter='@baseconfig/fields'` — N/A as written, since there's no separate `@baseconfig/fields` package (merged into `@baseconfig/core` back on 2026-09-04); `packages/baseconfig`'s own typecheck is clean.

**Checkpoint**: not formally closed — real code exists and is verified working, but unit tests and a final explicit sign-off haven't happened. Treat as substantially done, not 100% closed, before Stage 3.

---

## Stage 3 — `@baseconfig/d1`

**Goal**: Drizzle schema generation from a list of fields.

- [ ] Implement the mapping confirmed in `CLAUDE.md`'s schema-generation section: `array` → child table (`_order`, `_parent_id`), `blocks` → one table per block type (`_order`, `_parentID`, `_path`), `group` → flattened prefixed columns, `relationship` → FK column or junction table for `hasMany`. `drizzle-orm` D1 driver client, scalar field → column mapping, recursive field-array walker, and a worklist-based schema-build orchestrator (root/array/block tables via a queue, cross-table FKs resolved through a mutable table-registry closure per Drizzle's documented thunk pattern) are the pieces the prior build used — re-verify the approach against Drizzle's current docs rather than assuming it still applies verbatim.
- [ ] `where`-clause operator translation to Drizzle query builders (`equals`, `not_equals`, `greater_than`, `greater_than_equal`, `less_than`, `less_than_equal`, `like`, `contains`, `in`, `not_in`, `exists`, `and`/`or`) — this is the shape access-control functions will return in Stage 4.
- [ ] `src/index.ts` barrel export.
- [ ] Tests: schema-build output shape (root scalar columns, array child table, blocks-per-variant child tables, group flattening, single-relationship FK column, hasMany junction table) and `where`-to-Drizzle translation, checked against real rendered SQL text where practical.
- [ ] Migration tooling (generate + apply against local D1 via wrangler) — known hard part, flagged by the prior build and worth planning for up front this time: `drizzle-kit`'s schema loader only recognizes statically, top-level exported `Table` objects, but a schema built at runtime from a table registry can't satisfy that directly. Likely needs a codegen step (write a literal `.ts` file with one `export const <table> = ...` per built table, the same approach Payload's own Drizzle package uses) driven by real collection/global configs — which don't exist until `@baseconfig/core` (Stage 4). Confirm this is still the right sequencing before committing to it again.

**Checkpoint**: wait for go-ahead before Stage 4.

---

## Stage 4 — `@baseconfig/core`

**Goal**: `defineCollection`/`defineGlobal`, access control, hooks, context, the typed CRUD accessor, `buildConfig`.

- [x] **`buildConfig`/`defineCollection`/`defineGlobal` scaffolded 2026-09-05** (`packages/baseconfig/src/config.ts`), ahead of schedule per direct instruction — **deliberately blank/pass-through**, not the real thing: types match the documented shape (`collections`, `globals`, `plugins`, `db`, `editor`, `secret`, `serverURL`, `admin`, `routes`, `hooks.afterError`, `upload`, `defaultDepth`/`maxDepth`, `indexSortableFields` — `cors`/`csrf`/`jobs` not yet in the type, add when this stage does the real work), but the functions just return their input unchanged — no sanitize, no validation, no access-control wiring. `editor`'s real value is blocked on the unresolved Lexical-vs-hard-rule conflict flagged in `CLAUDE.md`.
- [ ] `defineCollection`/`defineGlobal` accepting `fields`, `access`, `hooks`, `versions` per `CLAUDE.md` — the real, non-pass-through version.
- [ ] Hook execution pipeline in the confirmed firing order (collection/global/field/root tiers).
- [ ] Request-scoped `context` object, shared across every hook in one operation.
- [ ] Access-control evaluation (`boolean` or `Where` constraint), enforced before every operation unless `overrideAccess`.
- [ ] Typed per-collection CRUD accessor: `core.collections.<slug>.find/findByID/create/update/delete/count`, `core.globals.<slug>.find/update`.
- [ ] Generated REST route handlers (the actual `GET/POST/PATCH/DELETE` logic) built on top of the typed accessor — wired into `www/src/routes/api/$collection/$.ts` and `api/globals/$global.ts` in Stage 5, not this stage.

**Checkpoint**: wait for go-ahead before Stage 5.

---

### Sub-stage 4A — real `buildConfig` (schema composition) + the first real collection/global config files

**Built 2026-09-05, on "proceed" using the recommendations already stated in this plan (Option A for types, the already-documented file naming) since neither open question got an explicit answer.** Merges the schema-composition part of Stage 4 above with Stage 5's first bullet (writing the real `collections/*.config.ts`/`globals/*.config.ts` files) into one connected pass — you can't really validate real `buildConfig` behavior without real collection files to run it against, and writing those files against the current pass-through stub gets you nothing type-wise. Everything else in Stage 4 (hooks pipeline, access-control evaluation, the typed CRUD accessor, REST routes) and the rest of Stage 5 (wiring the admin shell to real `@baseconfig/d1` queries) stays out of scope here, unchanged from their existing bullets below.

- [x] `defineCollection`/`defineGlobal` made real (`packages/baseconfig/src/config.ts`): both now generic (`<const T extends CollectionConfig>`) to preserve literal config shape, and both compose a real Zod `.schema` by reducing over `fields`, prepending `id`/`createdAt`/`updatedAt` (globals get `createdAt`/`updatedAt` only, no `id` — matches there being no concept of one for a singleton document).
- [x] **Real bug found and fixed by the runtime smoke test, not just `tsc`**: the first version of the field-composition reducer only kept *named* fields, silently dropping the entire top-level `tabs()` field (unnamed by design — Payload's own real pattern, confirmed from source, and exactly how `pages.config.ts` below uses it) — `pages.schema` came back with only 5 keys (`id`/`title`/`slug`/`createdAt`/`updatedAt`), missing all 11 fields actually inside the four tabs. Fixed: unnamed fields whose own `.schema` is a `ZodObject` now merge their shape flat into the parent instead of being dropped, mirroring the same unnamed-merge logic `tabs()` itself already does one level down. Re-verified after the fix: all 16 real keys present.
- [x] `buildConfig` does real slug-uniqueness validation (throws on a duplicate collection or global slug) — verified via the same smoke test, a real throw with the real duplicate slug in the message.
- [x] Real collection files: `www/config/collections/pages.ts` (title, slug, and one unnamed `tabs` field for Hero/Layout/SEO/Settings, matching the real Payload `Pages` shape confirmed from source — Layout uses a real `blocks()` field with three block types via `block()`; `versions: { drafts: true }` instead of a hand-rolled status field, since drafts/status is a version-system concern, not a field), `users.ts`, `media.ts`. **Settled by the user's own direct hand-edits, not chosen by an earlier pass here**: collection files under `www/config/collections/` drop the `.config` suffix entirely — first written as `pages.config.ts`/`users.config.ts`/`media.config.ts`, then renamed on disk to `pages.ts`/`users.ts`/`media.ts` directly by the user, with `baseconfig.ts`'s imports updated to match (caught and confirmed via a `tsc --noEmit` regression this same session: `users.config.ts` briefly lagged behind the other two mid-edit, producing a real `TS2307` until renamed to `users.ts`). Global files keep `.config` (see next bullet) — asymmetric on purpose.
- [x] Real global files: `www/config/globals/headers.config.ts`, `footer.config.ts` — both use a real `array()` field for nav items.
- [x] `www/config/baseconfig.ts` — `export default buildConfig({ collections: [pages, users, media], globals: [headers, footer] })`. Landed one level differently from either original option: initially written to the already-documented `www/src/baseconfig.config.ts`, then **the user moved everything into a new `www/config/` folder themselves** (`collections/`, `globals/`, and `baseconfig.ts`, no `.config` suffix on that one file since the folder name already says so) — verified this real-time move kept every relative import correct and nothing broke (`tsc`, a real build, and a runtime check all re-confirmed after the move).
- [x] **`baseconfig.type.ts` was not built** — Option A taken (no codegen; `z.infer<typeof config.collections.pages.schema>` computed directly wherever a document type is needed) since it was the stated recommendation and, again, no explicit answer overrode it either way.
- **Known, pre-existing, not fixed in this pass**: `AnyField.schema` is typed as `z.ZodTypeAny` (deliberately loose, per the field types file's own note), so `z.infer<>` on a composed collection schema currently resolves most field values to a wide/`any`-ish type rather than each field's own precise literal type — the runtime validation is fully correct regardless (confirmed: valid documents parse, invalid ones are correctly rejected), but real per-field static type precision would need tightening `AnyField`'s type across all 23 builders, out of scope for this pass.
- Verified: `tsc --noEmit` clean in both `packages/baseconfig` and `www`, a real `tsdown` build succeeded, a real runtime smoke test (built the actual assembled config, parsed a real sample "Home" page document through `pages.schema`, checked schema keys for `pages`/`users`/`headers`, checked the duplicate-slug throw) all passed, and a fresh SSR `curl` against `/admin` after a clean `bun run dev` restart confirmed the admin UI (which depends on the same `@baseconfig/core` package whose `dist/` this pass rebuilt) still renders with zero runtime errors — these new config files aren't wired into any route yet, so this was a dependency-safety check, not a feature check.

**What Payload actually does, verified from real source (`gh api` against `payloadcms/payload`, not docs prose)**:
- A real consumer `payload.config.ts` (`templates/website/src/payload.config.ts`, fetched in full): `buildConfig({ collections: [Pages, Posts, Media, Categories, Users], globals: [Header, Footer], db, editor, secret, plugins, typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') }, ... })` — each collection/global imported from its own file (`collections/Pages/index.ts` etc.), each exporting one `CollectionConfig`/`GlobalConfig` object.
- A real collection file (`collections/Pages/index.ts`, fetched in full): confirms `CLAUDE.md`'s already-documented design insight exactly — Hero/Content(Layout)/SEO are one named `tabs` field (`{ type: 'tabs', tabs: [{ label: 'Hero', fields: [hero] }, { label: 'Content', fields: [...] }, { label: 'SEO', fields: [...] }] }`), not three separate top-level concerns.
- Real type generation (`packages/payload/src/cli/commands/generateTypes.ts`, fetched and read in full — genuinely more involved than assumed): (1) `configToJSONSchema()` converts the *sanitized* config into an intermediate JSON Schema, with a `$defs` entry per collection/global slug and `$ref`s between them for relationship fields (this is Payload's actual mechanism for circular/cross-collection type references) — and, confirmed from `configToJSONSchema.ts` itself, a real **`input` vs `output` schema variant** distinction: `input` (what create/update accept) excludes virtual and `join` fields and computes `required` accounting for conditionally-hidden admin fields, `output` is the full read shape; (2) that JSON Schema is compiled to real TypeScript interfaces via the third-party `json-schema-to-typescript` package; (3) a `declare module 'payload' { export interface GeneratedTypes extends Config {} }` block is appended at the end — this global module augmentation is *how* Payload's own SDK methods (`payload.find({ collection: 'pages' })`) type-check a caller-supplied slug *string* against the right document shape; (4) the result is diffed against the existing output file and only written if changed.

**Why BaseConfig's Zod-based version is a genuine simplification here, not just a different flavor of the same thing**: every `@baseconfig/fields` builder already attaches a real Zod `.schema` (built earlier this session, recursive composition for `group`/`array`/`blocks`/`tabs` already smoke-tested). Zod schemas are *already* TypeScript-aware — `z.infer<typeof schema>` gives the type directly, no compiler pass needed. Payload needs its JSON-Schema-to-TypeScript pipeline because its raw field-config objects aren't independently typed; BaseConfig doesn't have that problem, so the "compile config to TypeScript" step Payload's `generateTypes` exists to do is free here — the only real missing piece is composing a collection's top-level `fields` array into *one* combined schema, which nothing currently does (each field only composes its own children, nothing yet reduces a whole collection).

**What real `buildConfig`/`defineCollection`/`defineGlobal` need to actually do now** (currently pure identity pass-throughs, `packages/baseconfig/src/config.ts`) — scoped tightly to what this pass needs, not the rest of Stage 4:
1. **Collection/global schema composition**: reduce over `fields: AnyField[]` into one combined `z.object({...})`, keying each *named* field's `.schema`; unnamed presentational fields (`row`, `collapsible`, unnamed `tabs`/`group`) merge their children's keys into the *parent* object rather than nesting one level deeper — matches how the field builders already recursively compose, just not yet exposed at the collection level.
2. **Implicit `id`/`createdAt`/`updatedAt` fields**: Payload auto-adds these to every collection even though they're never in the user's own `fields` array (confirmed: a dedicated `getCollectionIDFieldTypes` utility handles `id`; `createdAt`/`updatedAt` are unconditional). BaseConfig's composition needs the same — prepended, not user-declared. **Not yet confirmed either way and worth checking during implementation, not assumed**: whether Payload globals also get `createdAt`/`updatedAt` (no `id` — no concept of one for a singleton document, that part's certain).
3. **`defineCollection`/`defineGlobal`/`buildConfig` need to become properly generic** (`<const T extends CollectionConfig>(config: T): T`, not today's plain non-generic pass-through) so TypeScript preserves each config's literal, specific shape — needed both to Zod-infer the *exact* per-collection schema (not the widened `AnyField[]` union) and for the already-decided typed CRUD accessor (`core.collections.pages.find()`, per `CLAUDE.md`'s CRUD API section) to type-check by slug later.
4. **Slug-uniqueness validation** — a cheap, real runtime check (throw on duplicate slug across collections, separately across globals) `buildConfig` should do even this early; Payload's own sanitize pass does the equivalent implicitly.

**Two real open decisions — surfaced, not silently picked**:

1. **Does `baseconfig.type.ts` need to be a literal generated file at all, or can types stay pure inline `z.infer<>` with no generation step?**
   - **Option A — no codegen, no generated file.** Anywhere a collection's document type is needed, `type PagesDoc = z.infer<typeof baseconfigConfig.collections.pages.schema>` computed directly against the real config object — always in sync by construction, nothing to remember to re-run, no new tooling.
   - **Option B — a real generator, mirroring Payload's generated-file UX.** A small script (genuinely small next to Payload's — no JSON Schema, no `json-schema-to-typescript` dependency needed, since Zod already gives typed schemas) reads the resolved config and writes `export type Pages = z.infer<typeof ...>` lines into a real `baseconfig.type.ts`. Matches the familiar generated-file pattern (a concrete file other code can type-import without pulling in the runtime Zod objects), but is a new build step that can go stale if the diff-and-rewrite discipline Payload's own CLI has isn't replicated.
   - **Recommended, not decided**: Option A first — it's free the moment point 1 above exists. Add Option B's generator later only if something concrete actually needs a standalone type-only file; building it now would be exactly the premature tooling `CLAUDE.md`'s own conventions already argue against.
2. **File names and locations don't match what's already documented — flagging rather than silently reconciling**:
   - Asked for `www/src/baseconfig/baseconfig.ts`. Already-documented shape (`CLAUDE.md`'s Routing & folder layout section, plus the placeholder `www/collections/README.md`/`www/globals/README.md` already sitting in the repo) says `www/src/baseconfig.config.ts` — one file directly under `src/`, no subfolder. Which do you want?
   - Asked for `collections/home.ts`, `about.ts`. Every real Payload collection file is *one file per collection* (confirmed: `collections/Pages/index.ts`), with "Home"/"About" as *documents* inside that one `pages` collection, not separate files — matches `CLAUDE.md`'s own already-documented `collections/pages.config.ts` naming. Did "home.ts"/"about.ts" mean per-page *seed content*, not per-page *collection files* — or is a genuinely different, non-Payload-shaped per-page-file content model actually wanted? This changes the whole modeling approach, not just names, so it's not being guessed either way.
   - `users.ts`/`media.ts` vs. the documented `users.config.ts`/`media.config.ts` — same `.config`-suffix question. **Resolved since, by the user's own direct hand-edits (not an explicit answer to this question at the time)**: collection files drop `.config`, globals keep it — see the note on the "Real collection files" bullet above.
   - Globals — `headers.ts`/`footer.ts` genuinely matches Payload's own real template exactly (`globals: [Header, Footer]`, confirmed from source), an improvement on `CLAUDE.md`'s older placeholder example (`site-settings.config.ts`); recommend updating that example to `headers.config.ts`/`footer.config.ts` once the `.config`-suffix question above is settled.

**Recommended shape, as originally proposed here (superseded by the real, landed shape — see "Landed one level differently" in the `www/config/baseconfig.ts` bullet above and `CLAUDE.md`'s `@baseconfig/core` section)**:
```
www/
├── collections/
│   ├── pages.config.ts       # defineCollection({ slug: 'pages', fields: [...], admin: { useAsTitle: 'title' } }) — Hero/Layout/SEO as one named `tabs` field
│   ├── users.config.ts
│   └── media.config.ts
├── globals/
│   ├── headers.config.ts
│   └── footer.config.ts
└── src/
    └── baseconfig.config.ts   # export default buildConfig({ collections: [pages, users, media], globals: [headers, footer], ... })
```
(`baseconfig.type.ts` only exists if Option B above is chosen.)

**Real, landed shape**:
```
www/config/
├── collections/
│   ├── pages.ts
│   ├── users.ts
│   └── media.ts
├── globals/
│   ├── headers.config.ts
│   └── footer.config.ts
└── baseconfig.ts   # export default buildConfig({ collections: [pages, users, media], globals: [headers, footer] })
```

**Explicitly not in scope for this pass** — stays deferred to Stage 4's remaining bullets / Stage 5, unchanged: real access-control evaluation, hook execution, request-scoped context, the typed CRUD accessor, generated REST routes, wiring the admin shell to real `@baseconfig/d1` queries. Also deferred, confirmed real but not urgent: input-vs-output schema variants (this pass composes one "document/read" schema per collection only); relationship-field cross-collection references needing `z.lazy()` (not needed until a collection file in this pass actually declares one — don't design for it pre-emptively).

**Checkpoint**: wait for go-ahead, and resolution of the two open decisions above, before writing any code.

---

### Sub-stage 4A addendum — 2026-09-05 (later): builder-function layer removed, consumer side matches Payload's plain-object shape exactly

**Explicit instruction**: "in the consumer side i prefer payloadcms approach... instead of text('title', {required:true}), {name:'title', type:'text', required:true} just like in payloadcms, review, paylaodside and improve my side then put blocks inside config/blocks."

- [x] Re-verified against real Payload source (not assumed from the earlier pass's own summary of it): `templates/website/src/collections/Pages/index.ts` and `templates/website/src/blocks/Content/config.ts`, both fetched via `gh api`. Confirms plain object literals everywhere, typed via `Field`/`Block` imported from the `payload` package — no builder-function calls anywhere in either file. Also confirms Payload's real `src/blocks/<Name>/config.ts` per-block-file convention, each block imported by name into the collection that uses it rather than defined inline.
- [x] `packages/baseconfig/src/fields/`'s 23 builder-function files deleted. Replaced with two files: `types/index.ts` (one plain discriminated union `Field`, mirroring Payload's own single-`types.ts` real structure — the per-type-file split no longer had a reason to exist once there's no function per file) and a new `schema.ts` (`composeFieldsShape`/`fieldToZodSchema`, a mutually recursive pair that computes a field's Zod schema from its `type` at collection/global-build time, replacing both the old builder-time `.schema` attachment and the old scattered per-builder unnamed-field-merge logic).
- [x] **Real, generalized fix, not just a reorg**: the original Sub-stage 4A bug (an unnamed `tabs` field silently dropped because the *collection-level* reducer only kept named fields) was fixed at the time only at that one level — `tabs()`/`group()`/`array()`/`row()`/`collapsible()`/`blocks()` each still independently did their own `fields.filter(f => f.name)` when composing their own children, meaning the same class of bug could still happen one level deeper (an unnamed `row` nested inside an `array`'s fields, say). The new single recursive `composeFieldsShape` closes this at every depth, not just the top.
- [x] `Field` (renamed from `AnyField`) is now a real, precise discriminated union — the old `AnyField.schema: z.ZodTypeAny` catch-all property is gone entirely (fields no longer carry a schema of their own), so `fieldToZodSchema`'s `switch (field.type)` is exhaustively checked by `tsc` with no `default` case. This resolves the "known, pre-existing, not fixed in this pass" limitation the original Sub-stage 4A entry flagged below.
- [x] Blocks moved out of `pages.ts` into `www/config/blocks/{content.ts, media.ts, cta.ts}` (flat files — no per-block renderer exists yet, so Payload's folder-per-block would be empty overhead right now), each a plain `Block`-typed object, imported by name into `pages.ts`'s `layout` field — collection file now only has its own real fields, matching "just like payloadcms recommended usage."
- [x] Verified: `tsc --noEmit` clean in both packages (including that all five real `www/config/**` files' plain object literals structurally type-check against `Field`/`Block` — a real check now, a typo'd `type` string is a compile error); a real `tsdown` build succeeded; a runtime smoke test against the actual built `www/config/baseconfig.ts` confirmed `pages`/`users`/`media`/`headers`/`footer` schema key sets are unchanged from pre-refactor, a sample "Home" document (including a `layout` array mixing `content`+`cta` blocks) parses successfully, a missing-required-field document is still correctly rejected, and `buildConfig`'s duplicate-slug throw still fires with the real message.

---

### Sub-stage 4C — `@baseconfig/d1`, `@baseconfig/r2`, and real better-auth wiring — 2026-09-06

**Explicit instruction**: "wire up better auth in the core, dont write the schema that will be autogenerated... align it to collections auth structure and customization, always reference better auth and payloadcms approach and with the api side of things as well... dont create other plugins except those 2 d1 and r2... do this in a single run."

- [x] Researched real source first: Payload's `CollectionConfig.auth?: boolean | IncomingAuthType` and its full auth-config shape (`packages/payload/src/auth/types.ts`), and better-auth's real plugin type, `betterAuth`/`betterAuth/minimal` factories, `@better-auth/drizzle-adapter`, `genericOAuth` plugin, and CLI schema-generation flow (`gh api` against `better-auth/better-auth`, not docs).
- [x] `packages/baseconfig-d1/` created for real — `@baseconfig/d1`, `createD1Client(binding: D1Database, schema?)`, a thin `drizzle-orm/d1` wrapper. Deliberately not the collection-schema-generation engine (separate later work).
- [x] `packages/baseconfig-r2/` created for real — `@baseconfig/r2`, `createR2Client(binding: R2Bucket)` plus the real `StorageAdapter` type (`'local' | 'r2' | 'images'`), now backing `BuildConfigOptions.upload.adapter`.
- [x] `packages/baseconfig/src/auth/` (new `@baseconfig/core/auth` subpath) — `defineAuth({ db, secret, baseURL, basePath?, trustedOrigins?, oauthProvider? })`: `better-auth/minimal` + `@better-auth/drizzle-adapter` (`provider: 'sqlite'`) pointed at a `createD1Client`-built client, `genericOAuth` plugin wired when `oauthProvider` is given (matches the already-documented "generic OAuth pointed at infra" design), `basePath` defaults to better-auth's own real default (`/api/auth`) but is fully overridable.
- [x] `CollectionConfig.auth?: boolean` added — a thin alignment marker ("this collection's docs correspond to better-auth's `user` table"), deliberately much thinner than Payload's own deep `IncomingAuthType`, since better-auth (not `@baseconfig/core`) owns the actual auth-policy surface. Applied to `www/config/collections/users.ts`.
- [x] **Real bug hit and fixed mid-build, not just a clean report**: `defineAuth`'s inferred return type caused a genuine `tsdown`/rolldown DTS-bundling failure (`TS2883`, "inferred type cannot be named... likely not portable") even though `tsc --noEmit` accepted it fine — only caught by actually running the build. Fixed with an explicit `Auth` return-type annotation (better-auth's own exported type) plus an `as Auth` assertion, since the literal fully-parameterized inferred type isn't structurally assignable to the general `Auth` shape.
- [x] Schema deliberately **not** hand-written, per the explicit instruction — better-auth's real `@better-auth/cli generate` command introspects a `betterAuth({...})` config statically (no live DB connection needed) and writes the real Drizzle `schema.ts` for `user`/`session`/`account`/`verification` tables; that's the intended source of `createD1Client`'s optional `schema` argument, not something written by hand here.
- [x] **Real, explicit scope boundary — not built this pass**: `www/src/auth.ts` and `www/src/routes/api/auth/$.ts` (the actual route-mounting files, already named in `CLAUDE.md`'s planned tree). Both need a real `D1Database` binding to construct against, which needs a real D1 database provisioned (`wrangler d1 create`) and declared in `wrangler.jsonc` — currently placeholder-only. Provisioning a Cloudflare resource is a real, external, hard-to-reverse action outside this pass's remit; everything buildable without it is built.
- [x] Verified: `tsc --noEmit` clean across `@baseconfig/d1`, `@baseconfig/r2`, `@baseconfig/core`, `www`; real `tsdown` builds succeeded for all three library packages; a runtime smoke test (`defineAuth()` with a mocked `D1Database`) confirmed the returned instance has a real `.handler`/`.api`; a second smoke-test run with a fake OAuth `discoveryUrl` correctly triggered a real (expected-to-fail) network fetch inside better-auth's own `genericOAuth` plugin init, confirming that plugin registration is genuinely live.

---

## Stage 5 — Wire the real engine into the admin shell

**Goal**: Stage 1's static-data views become real, backed by `@baseconfig/core` + `@baseconfig/d1`, through TanStack Query and server functions/routes. The dynamic `$collection`/`$tab`/`$global` routes become genuinely config-driven (no more hardcoded "pages").

- [x] Write real `collections/pages.ts`/`users.ts`/`media.ts` and `globals/headers.config.ts`/`footer.config.ts` — done in Sub-stage 4A/4B above (not `posts`/`products`/`site-settings` — those were placeholder names from before the real config existed).
- [x] **2026-09-06 — root dashboard + `/admin/:slug` + `/admin/globals/:slug` identity made real, config-driven, per explicit instruction: "now we start wiring things up, to actually be functional, instead of placeholders in root admin... we want to see the collections we have reflected correctly in the collections as well as the globals first start by root page and the collections slug, first."** Real mechanism (full detail in `CLAUDE.md`'s "Real shape today" routing note): `www/src/routes/(admin)/admin/route.tsx` imports the real `www/config/baseconfig.ts` and passes it to `RouteRoot` as a `config` prop; `RouteRoot` wraps the whole admin shell in a new React Context (`AdminConfigProvider`/`useAdminConfig`, `packages/baseconfig/src/admin/views/config-context.tsx`); `defineHandler()`'s inner nested-router (`RouterMount`) reads that same context and re-exposes it as the inner TanStack Router's own `context: { config }` (via `createRootRouteWithContext<AdminRouterContext>()`, `admin/types/index.ts`) so route *loaders* — which can't call React hooks — can validate a `$slug`/`globals/$slug` param against the real `collections`/`globals` arrays and `throw notFound()` for anything not in them. `admin/$.tsx` itself needed zero changes — stays the one-line-forever `createFileRoute(...)(defineHandler())` shape, since it never touches config directly.
  - Dashboard (`OverviewComponent`), the collection list header (`CollectionsComponent`), the globals editor header (`GlobalsComponent`), and the CMS-header breadcrumb (`Headers`) all switched from a hardcoded placeholder module (`admin/views/documents/data.ts`, since deleted — declared fake collections `pages`/`posts`/`media`/`users` and fake globals `headers`/`site-settings`, which didn't even match the real config's actual slugs) to `useAdminConfig()`, reading real `labels.plural`/`label`/`slug` values.
  - **Real bug fixed along the way, not just a data-source swap**: `Viewmodel` (the dashboard's collection/global card grid) fell back to the literal string `'Global'` for any item without a `count` — harmless before since every mock collection item had a fake count, but would have mislabeled every real collection tile as "Global" the moment mock data was removed (real `CollectionConfig` has no notion of a document count without `@baseconfig/d1`). Fixed: the fallback subtitle is now derived from `kind` (`'Global'` for globals, `'Collection'` for a collection with no known count yet), and the per-item "add new" button now gates on `kind === 'collection'` rather than on count presence.
  - **Deliberately not attempted in this pass**: making the collection list's document *rows* (not just the collection's own identity/label) generic per real collection shape. The existing rich table (status badge, author avatar, ID/title/slug/status/author/created/updated columns) is real Page-shaped placeholder data and stays exactly as-is for every collection slug for now — building a correct generic per-field-type row renderer for arbitrary collections (so `/admin/users`/`/admin/media` show their own real fields instead of Page-shaped mock rows) is real Stage 5 work that depends on `@baseconfig/d1` existing to have actual rows to render; fabricating plausible-looking fake per-collection rows now would look like real functioning CRUD when it isn't, and would need rewriting the moment real data arrives anyway.
  - Verified: `tsc --noEmit` clean in both packages, `tsdown` build succeeded, and a real SSR `curl` pass against a running dev server (not assumed) confirmed: `/admin/pages` shows "Pages", `/admin/users` shows "Users", `/admin/media` shows "Media" (previously all four hardcoded collection slugs shared one Page-shaped table+label regardless of which was requested); `/admin/globals/headers` and `/admin/globals/footer` both render with their own real label; the root dashboard's Collections/Globals grid now lists exactly `Pages`/`Users`/`Media` and `Headers`/`Footer` (the old fake `Posts` tile and `Site Settings` tile — which didn't even match a real global slug — are both gone); and the two now-fake slugs `/admin/posts` and `/admin/globals/site-settings` correctly render TanStack Router's "Not Found" boundary instead of silently 200ing with fabricated data, which is what they did before this pass.
- [ ] Replace the collection list's placeholder document rows with real `core.collections.*` calls via TanStack Query, generalized per collection (needs `@baseconfig/d1` to exist first).
- [ ] Implement the generated REST routes for real (`api/$collection/$.ts`, `api/globals/$global.ts`).
- [ ] Admin manifest: the shape `core` hands the generic `$collection`/`$tab` admin views so they render the right fields for the right tab without per-collection hardcoding — **not yet designed in detail, design it as part of this stage** (flagged open in `CLAUDE.md`).

**Checkpoint**: wait for go-ahead before Stage 6.

---

## Stage 6 — Public site rendering

**Goal**: `$slug.tsx` renders a real page by walking its `layout` blocks through `www/src/blocks/*` renderers.

- [ ] Implement one renderer per block type (Content, Media, CTA, Archive) in `src/blocks/*`, shared between the admin's block-field UI and this public renderer.
- [ ] Wire the cache-on-publish model from `CLAUDE.md` (populate/invalidate edge cache only on publish/update, not on a timer).

**Checkpoint**: wait for go-ahead before Stage 7.

---

## Stage 7 — Auth for real

**Goal**: BaseConfig's own local `betterAuth()` instance, OAuth-wired to `infra`.

- [ ] `www/src/auth.ts` — local `betterAuth()` instance per `CLAUDE.md`'s Auth section.
- [ ] Coordinate with `infra`: get BaseConfig added to `cachedTrustedClients` (manual, infra-side — cannot self-register).
- [ ] `www/src/routes/api/auth/$.ts` catch-all, mirroring infra's own pattern.
- [ ] Real login flow replaces Stage 1's placeholder `domains/auth/`.

**Checkpoint**: wait for go-ahead before Stage 8.

---

## Stage 8 — `@baseconfig/r2` for real

**Goal**: Media collection backed by real R2 uploads.

- [ ] Key/folder scheme (open question in `CLAUDE.md` — design it as part of this stage).
- [ ] Upload field wired end-to-end: admin UI → R2 → served asset.

**Checkpoint**: wait for go-ahead before Stage 9.

---

## Stage 9 — First plugins

**Goal**: `@baseconfig/plugin-seo` and `@baseconfig/plugin-nested-docs` — both directly used by the Pages collection already mocked. `@baseconfig/plugin-multi-tenant` comes later, only when multi-tenancy is actually needed by a real deployment.

- [ ] `@baseconfig/plugin-seo`: injects the `seo` tab (metaTitle/metaDescription/metaImage, auto-generate-from-title, char-count state) into target collections.
- [ ] `@baseconfig/plugin-nested-docs`: the Settings tab's Parent field + breadcrumb generation.

**Checkpoint**: wait for go-ahead before Stage 10.

---

## Stage 10 — `@baseconfig/ai`

**Goal**: wraps `@tanstack/ai`, wires the Ask-AI bar for real.

- [ ] `chat()` server route + `useChat()` client hook per `CLAUDE.md`'s AI section.
- [ ] Gemini adapter (official, direct).
- [ ] Custom Workers AI adapter (not officially supported by TanStack AI — build task).
- [ ] Wire to the first feature from the decided scope (writing assistance for pages, most directly tied to what's already built).

**Checkpoint**: wait for go-ahead before Stage 11.

---

## Stage 11 — `jobs` (only if/when something needs scheduling)

**Goal**: Cloudflare Cron Trigger / Queues adapter per `CLAUDE.md`. Optional — skip entirely if nothing in the product actually needs a scheduled/background task yet.

- [ ] Confirm Cloudflare Queues' free-tier availability before committing to it as the default (Cron Triggers are confirmed free).
- [ ] Task/Workflow config shape ported from Payload, dispatch via Cron Triggers (+ Queues if free-tier-viable).

**Checkpoint**: end of currently-planned stages. Re-plan from here based on what's actually needed next.
