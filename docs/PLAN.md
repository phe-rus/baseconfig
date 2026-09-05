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
- [ ] **Sub-stage 1C — document editor view.** Not started, after 1B. Builds the real view at `pages/collections/uid.tsx` (currently `UUIDComponent`, a placeholder) that 1A's loader resolves `/admin/:slug/:id` (and `/admin/globals/:slug`) to.
  - New view: title row (doc title + back-to-list breadcrumb), status row (draft/published badge + Save/Publish buttons, inert placeholders), and the Hero/Layout/SEO/Settings tab strip — per `CLAUDE.md`'s design insight that this is one named `tabs` field, not four separate concerns, client-side tab state within this one view rather than further URL segments — plus Live-Preview/JSON/API view placeholders. Live Preview's real split-view sync mechanism is still an open question (`CLAUDE.md`'s Open questions) — out of scope here, a static two-pane mock is enough for this stage.
  - Hardcoded per-tab content (no real field engine exists yet — Stage 2): Hero → mock title/subtitle; Layout → mock block list; SEO → mock meta fields; Settings → mock slug/parent/tags.
  - Checkpoint: browser-verified — list → row click → editor opens on Hero by default → tab strip switches panels (client-side, no URL change) → back-navigation returns to the list.
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

- [ ] Implement all 22 builders from the field taxonomy (`text`, `textarea`, `richtext`, `number`, `checkbox`, `email`, `date`, `select`, `radio`, `relationship`, `upload`, `group`, `array`, `blocks`, `tabs`, `json`, `code`, `point`, `row`, `collapsible`, `ui`, `join`) in `src/field-types/`, each producing a Payload-shaped plain object (`{ name, type: '...', ...options }`). Note from the prior build, worth re-confirming rather than assuming: Payload's real `row`/`collapsible` configs have **no `name` property**, so those two (and partially `ui`) don't fit a shared base the way the other ~19 do.
- [ ] Every builder attaches a real Zod schema (source of truth for validation, composed recursively for `group`/`array`/`blocks`/`tabs`) and an `admin.component` string (the admin-component mapping — a name like `"TextInput"`/`"BlocksRepeater"`, not wired to an actual component until Stage 5).
- [ ] `AnyField` — the loosely-typed container used wherever a builder holds a heterogeneous list of other fields (array/group/blocks/tabs contents) — will likely need `any`-parameterized `hooks`/`schema` rather than `unknown`, since concrete builders' hook/schema types are contravariant in the field's own value type. Document any such use in-file as a narrow, deliberate exception, not a general shortcut.
- [ ] Unit tests covering a representative sample against real shapes: `text`, `select` (single + hasMany), `relationship` (single + hasMany), `group`, `array`, `blocks` (discriminated by `blockType`), `tabs` (named + unnamed), `row`/`collapsible`'s no-`name` shape.
- [ ] `turbo typecheck lint --filter='@baseconfig/fields'` clean.

**Checkpoint**: wait for go-ahead before Stage 3.

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

- [ ] `defineCollection`/`defineGlobal` accepting `fields`, `access`, `hooks`, `versions` per `CLAUDE.md`.
- [ ] Hook execution pipeline in the confirmed firing order (collection/global/field/root tiers).
- [ ] Request-scoped `context` object, shared across every hook in one operation.
- [ ] Access-control evaluation (`boolean` or `Where` constraint), enforced before every operation unless `overrideAccess`.
- [ ] Typed per-collection CRUD accessor: `core.collections.<slug>.find/findByID/create/update/delete/count`, `core.globals.<slug>.find/update`.
- [ ] `buildConfig({...})` assembling `collections`, `globals`, `plugins`, `db`, `editor`, `secret`, `serverURL`, `cors`, `csrf`, `admin`, `routes`, `hooks`, `upload`, `jobs` per `CLAUDE.md`.
- [ ] Generated REST route handlers (the actual `GET/POST/PATCH/DELETE` logic) built on top of the typed accessor — wired into `www/src/routes/api/$collection/$.ts` and `api/globals/$global.ts` in Stage 5, not this stage.

**Checkpoint**: wait for go-ahead before Stage 5.

---

## Stage 5 — Wire the real engine into the admin shell

**Goal**: Stage 1's static-data views become real, backed by `@baseconfig/core` + `@baseconfig/d1`, through TanStack Query and server functions/routes. The dynamic `$collection`/`$tab`/`$global` routes become genuinely config-driven (no more hardcoded "pages").

- [ ] Write real `collections/pages.config.ts` (and posts/products/media/users) and `globals/headers.config.ts`/`site-settings.config.ts` using `@baseconfig/fields` + `defineCollection`/`defineGlobal`.
- [ ] Replace Stage 1's static view data with real `core.collections.*` calls via TanStack Query.
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
