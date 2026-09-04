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
- [ ] **Sub-stage 1A — root dispatch as a real TanStack `loader`, not in-component dispatch.** First pass built 2026-09-05, then corrected same day before being called done (see `docs/DISCUSSION.md`) — reopened, not actually finished. **`www/src/routes/(admin)/admin/$.tsx` stays the one and only admin route file, permanently.** Corrected design, mirroring Payload's real mechanism more precisely (Payload's `renderRoot` is an async function that resolves route data — and can `notFound()`/`redirect()` — *before* any view renders; TanStack Start's `loader`/`beforeLoad` are the direct idiomatic equivalent of that same shape, not a hand-rolled dispatch inside the component body):
  - `packages/baseconfig/src/admin/views/defineHandler.ts` (scaffolded empty, to be filled): exports `defineHandler()`, returning the **whole** route config object — `{ component: RouteComponents, loader }` — so `www/src/routes/(admin)/admin/$.tsx` becomes just `createFileRoute('/(admin)/admin/$')(defineHandler())`. `loader` receives `{ params }`, splits the splat, resolves `{ viewType, routeParams }` (dashboard/list/document), and throws TanStack's real `notFound()` when a slug doesn't match — no hand-rolled `'not-found'` view branch.
  - `RouteComponents` (`views/root.tsx`) reads the already-resolved data via `useLoaderData({ strict: false })` instead of calling `useParams`+dispatching itself — dispatch happens once, in the loader, before render.
  - **Corrected URL scheme, deliberately diverging from Payload's own literal `/collections/`/`/globals/` prefix**: `/admin` (dashboard), `/admin/:slug` (list if it's a collection slug, document if it's a global slug), `/admin/:slug/:id` (document, collection). One flat namespace — a collection and a global can never share a slug, a known, accepted tradeoff of the simplification.
  - `views/types.ts` (flat file, not an `admin/types/` folder — corrected placement): `ViewType` = `'dashboard' | 'list' | 'document'` (drops `'not-found'`, now a thrown `notFound()` instead of a rendered branch), `RouteParams`, `RouteData`.
  - `link.ts` deleted — `Viewmodel` imports `Link` directly from `@tanstack/react-router` (no value in a wrapper file for one re-exported symbol); `views/config/get-route-data.ts` deleted, its logic now lives directly in `defineHandler.ts`'s `loader`.
  - `createServerFn`/server-function ownership in core is a related decision (same "core owns API + navigation" reasoning) but **not part of this sub-stage** — no real data-fetching yet, premature until Stage 5.
  - `beforeLoad` (auth-gate decisions) and `validateSearch` (typed query params) are the right TanStack primitives for later needs (Stage 7 auth; search-param-driven list filters in a future sub-stage) — noted as available, not built now since nothing needs them yet.
  - Checkpoint: browser-verified — `/admin` dashboard, `/admin/pages` resolves to list, `/admin/pages/abc123` resolves to document, `/admin/headers` (a global) resolves to document, `/admin/bogus-slug` triggers a real 404 via `notFound()`, dashboard cards navigate correctly to the new flat URLs.
- [ ] **Sub-stage 1B — collection list view.** Not started, after 1A. Builds the actual list-view component that 1A's loader already routes to.
  - New view (folder TBD, likely `views/collection-list/`, matching the existing flat per-view-folder pattern) — proposed default: a dense table/row-list style (title, status pill, updated date), deliberately distinct from the dashboard's card-grid; open to correction once it's visible.
  - Static placeholder dataset (a handful of fake Pages documents) — good enough to prove the UX, not real per-collection config (that's Stage 2, `@baseconfig/fields`).
  - Row click navigates to `/admin/:slug/:id`. "+ New" button present but inert (no real create flow yet).
  - Checkpoint: browser-verified — dashboard → collection card → list renders static rows → confirm layout/interaction feel right before building the editor on top of it.
- [ ] **Sub-stage 1C — document editor view.** Not started, after 1B. Builds the view 1A's loader resolves `/admin/:slug/:id` (and `/admin/:slug` for globals) to.
  - New view: title row (doc title + back-to-list breadcrumb), status row (draft/published badge + Save/Publish buttons, inert placeholders), and the Hero/Layout/SEO/Settings tab strip — per `CLAUDE.md`'s design insight that this is one named `tabs` field, not four separate concerns, client-side tab state within this one view rather than further URL segments — plus Live-Preview/JSON/API view placeholders. Live Preview's real split-view sync mechanism is still an open question (`CLAUDE.md`'s Open questions) — out of scope here, a static two-pane mock is enough for this stage.
  - Hardcoded per-tab content (no real field engine exists yet — Stage 2): Hero → mock title/subtitle; Layout → mock block list; SEO → mock meta fields; Settings → mock slug/parent/tags.
  - Checkpoint: browser-verified — list → row click → editor opens on Hero by default → tab strip switches panels (client-side, no URL change) → back-navigation returns to the list.
- [ ] Media view — folder chips + file grid, static data. Not started, after 1C.
- [ ] Site-map view — a static rendering of the mocked map-canvas layout is enough for this stage; real freeform drag/zoom is future scope. Not started.
- [ ] Auth view — placeholder stub only. Not started.
- [ ] Visual QA (whole stage): confirm every view actually renders real content in a browser (or via SSR'd HTML assertions if no browser tool is available), not just a 200 status or an error boundary.

**Icon library convention**: `@hugeicons/react` + `@hugeicons/core-free-icons` for all first-party BaseConfig code, not `lucide-react`. Exception: `packages/ui`'s own vendor-generated shadcn components keep whatever icon library they were scaffolded with (not worth hand-editing generated files for) — confirmed 2026-09-05 the real primitive vendor underneath is Base UI (`@base-ui/react`), not Radix.

**Checkpoint**: wait for go-ahead before Stage 2, and **one sub-stage at a time within Stage 1 itself** (1A → checkpoint → 1B → checkpoint → 1C → checkpoint) — same one-stage-at-a-time rule applies at this finer grain now that Stage 1 is this detailed. As of 2026-09-05, 1A is done (see `docs/DISCUSSION.md`) — Sub-stage 1B is next, pending explicit go-ahead.

**Follow-ups surfaced by 1A, not fixed (out of scope, pre-existing, flagged for the user to decide on)**: `packages/ui/src/components/spinner.tsx` fails `tsc --noEmit` (`string | number` not assignable to `number | undefined`) and `packages/baseconfig/src/admin/views/route-root.tsx` needs a type-only import for `PropsWithChildren` (`verbatimModuleSyntax`) — both predate 1A (confirmed via clean `git status` on both files before touching anything), both currently block a clean top-level `turbo typecheck` run (`www`'s typecheck pulls in `route-root.tsx`; `ui`'s own typecheck task gates `core`'s in the turbo graph). Per-package typechecks (`packages/baseconfig`, `www`) were used directly to verify 1A instead.

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
