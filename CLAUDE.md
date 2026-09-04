# BaseConfig

Open-source, Payload-CMS-inspired CMS/site builder, built natively for the Cloudflare edge (Workers + D1 + R2 + KV) on the TanStack Start ecosystem — not Next.js.

## Status: reset to design phase 2026-09-04 — reviewing/correcting the design before any new go-ahead

**Renamed from Demoness to BaseConfig on 2026-09-04.** The project was previously built up through Stage 3 of `docs/PLAN.md` (scaffolding, a visual admin shell on static data, `@demoness/fields`, most of `@demoness/d1`) under the old name. That implementation has been **deleted** as part of the rename — see `docs/DISCUSSION.md`'s 2026-09-04 entry for why and what was removed. It is not lost: a full snapshot was committed to git immediately beforehand (commit message starts "checkpoint: snapshot pre-baseconfig-rename state") if any of it is worth resurrecting or referencing later.

What survived the reset: `packages/ui` (shared shadcn components, unchanged), the root docs (`CLAUDE.md`, `docs/DISCUSSION.md`, `docs/PLAN.md`, `LICENSE`), and `www` (renamed from `www`) reduced back to the bare TanStack Start template starter page — no admin shell, no domains, no blocks. `packages/demoness-fields`, `demoness-core`, `demoness-d1`, `demoness-r2`, `demoness-ai` are all gone; nothing under `packages/` exists yet except `ui`. Root `package.json`'s name is now `baseconfig` (no longer the template default `start-monorepo` — that placeholder was already overwritten during the deleted Stage 0 work and stayed corrected through the rename).

**No implementation stage begins without explicit go-ahead, one stage at a time.** `docs/PLAN.md` holds the staged build plan (renamed to match, checkboxes reset to not-started) — read it first when resuming this project. We are currently in a review/design pass to make sure the plan and this file are actually correct before resuming Stage 0 under the new name; nothing should be assumed settled just because it was settled under the old name until it's been re-confirmed here.

## Why this project exists

PayloadCMS's *approach* (config-driven collections/fields that generate both the DB schema and the admin UI, hooks, first-class access control) is the model worth borrowing. But Payload itself is Next.js-based, heavy, and pushes you toward its paid cloud tier — it was never built for Cloudflare Workers/Pages. A prior attempt to hand-roll something similar directly inside `infra` or `seer` got unwieldy and wasn't landing well. This project splits that effort out into its own fully open-source repo, designed for the edge from the start.

## Target

Free-tier-first. The goal: roughly 100 pages, 1000 blog posts, lots of images, and 500 active users should run entirely inside Cloudflare's free plan for an extended stretch before any paid tier is required. Every architecture decision is weighed against this budget — see the reality-check table below.

## Stack

- **TanStack Start**, end to end — Router, Query, Store, Form, DB, **AI** (`@tanstack/ai` — see AI section), and the rest of the ecosystem. No Next.js. **General rule: TanStack libraries take priority over any other third-party library whenever one is needed.**
- **Zod** as the schema/validation layer. Most types in the codebase are derived from Zod schemas (`z.infer<>`), not hand-written.
- **Cloudflare Workers** as runtime, **one Worker, one deployment** for both the admin dashboard and the public site (see Routing below) — not split into two Workers.
- **D1** (SQLite) as primary store, single database, no sharding by default. **Drizzle** is the ORM (D1-native, local-first dev via wrangler; Payload's own SQLite/Postgres adapters are themselves Drizzle-based, so the schema-generation approach below is a ported, proven mapping, not a new one).
- **R2** for media/asset storage. No Cloudflare Images (too expensive) — R2 only. Image resize/crop cannot use `sharp` (native Node addon, incompatible with the Workers runtime) — needs a WASM library instead (e.g. `@cf-wasm/photon`).
- **KV** for edge caching/sessions, low-write-frequency by design (see free-tier table).
- **Auth**: BaseConfig runs **its own local `betterAuth()` instance** (same pattern `seer` already runs), configured with a generic OAuth provider pointed at `infra` as the external identity provider. Login/logout/session/refresh are better-auth's own native routes on *this* instance, mounted at BaseConfig's own `/api/auth/*` — not something `@baseconfig/core` generates. BaseConfig must be added to infra's `cachedTrustedClients` (manual — infra disables dynamic client registration). `Users` is a read-mostly profile extension of BaseConfig's own local better-auth user table (populated via OAuth sign-in from infra), not a mirror of infra's own table. See `docs/DISCUSSION.md`'s 2026-08-31 correction entry for the full trail — an earlier pass at this wrongly dropped auth routes entirely.
- **Rich text / visual editing**: no third-party rich-text libraries (TipTap, Slate, Lexical, etc.) — same hard rule as `seer`'s editor. Build on primitive DOM/contentEditable.

## Package structure

Folder name → npm scope, all under `packages/`:

| Folder | Package | Purpose |
|---|---|---|
| `ui/` | `@baseconfig/ui` | shared shadcn primitives (renamed from the template's `@workspace/ui` default on 2026-09-04 to match the rest of the `@baseconfig/*` scope) |
| `baseconfig/` | `@baseconfig/core` | **field-type definitions absorbed in on 2026-09-04** (no more separate `fields` package — see the `@baseconfig/core` section below for why), plus `defineCollection`/`defineGlobal`, access control, hooks, `buildConfig`, DB-schema-generation glue, better-auth's instance construction. **One package, not split into core+admin** — the admin UI lives inside it too, under `src/admin/` (see the `@baseconfig/core` section below), as a sibling to `src/api/`. Not literally UI-free at the package level, but bundle discipline is enforced via subpath structure: a consumer never imports `src/admin/` unless it actually renders the dashboard. |
| `baseconfig-d1/` | `@baseconfig/d1` | Drizzle schema/client for D1, migrations |
| `baseconfig-r2/` | `@baseconfig/r2` | asset upload, key scheme (TBD), serving |
| `baseconfig-ai/` | `@baseconfig/ai` | wraps `@tanstack/ai` — the one unified, switchable AI provider layer |
| `baseconfig-plugin-seo/`, `baseconfig-plugin-nested-docs/`, `baseconfig-plugin-multi-tenant/` | `@baseconfig/plugin-*` | official-Payload-plugin-shaped, Payload-plugin-named (scope swapped) — see AI/Multi-tenancy sections and `docs/DISCUSSION.md` for what each does |

Dependency order: `core` (fields + admin UI included) → (`d1`, `r2`, `ai` as siblings `core` calls into) → `www` consumes everything plus `ui` (which `core`'s own `src/admin/` also depends on). Plugin naming mirrors Payload's official plugins exactly (just the scope), except `plugin-cloud-storage` (not adopted — BaseConfig only ever targets R2, so that logic is baked into `@baseconfig/r2` directly, not a swappable-backend plugin).

## Routing & folder layout

One Worker. `/admin/*` is the dashboard (authenticated, never edge-cached); `/` and everything else is the public site (edge-cached, see Caching below). Both admin and API routes are **dynamic, generated from config at route-match time** — not hand-written per collection.

```
www/
├── collections/          # pages.config.ts, posts.config.ts, products.config.ts, media.config.ts, users.config.ts — outside src/, this is the content model, not app source
├── globals/               # headers.config.ts, site-settings.config.ts
├── src/
│   ├── routes/
│   │   ├── $slug.tsx                     # public: renders any page via its layout blocks
│   │   ├── api/
│   │   │   ├── auth/$.ts                 # betterAuth catch-all, BaseConfig's own instance
│   │   │   ├── $collection/$.ts          # dynamic — every collection's generated REST surface
│   │   │   └── globals/$global.ts        # dynamic — every global's generated REST surface
│   │   └── admin/
│   │       ├── index.tsx                 # Dashboard — genuinely unique, stays static
│   │       ├── site-map.tsx              # genuinely unique, stays static
│   │       ├── $collection/
│   │       │   ├── index.tsx             # generic list view, driven by collection config
│   │       │   └── $id/$tab.tsx          # generic tab view (hero/layout/seo/settings/live-preview/api) — one file for every tab of every collection, driven by the config's `tabs` field
│   │       └── globals/$global.tsx       # generic single-doc edit view, driven by global config
│   ├── domains/           # {name}/{config/{schema.ts,types.ts,config.ts}, hooks/{use-{}.ts}, views/{*.view.tsx}, index.ts} — pages/, media/, dashboard/, site-map/, auth/, ...
│   ├── blocks/             # same internal shape as domains/, one folder per block type — content/, media/, cta/, archive/
│   ├── auth.ts             # BaseConfig's own local betterAuth() instance
│   └── baseconfig.config.ts  # export default buildConfig({...})
└── wrangler.jsonc          # D1/R2/KV bindings, Cron Triggers — doesn't exist yet
```

## Code structure & style conventions

- `type`, never `interface`.
- No `const enum` — Vite/esbuild transpiles files in isolation and can't inline `const enum` correctly. Use a `const`-object-plus-`as const` pattern instead: `const X = {...} as const; type X = (typeof X)[keyof typeof X]`.
- Most types are Zod-derived (`z.infer<typeof schema>`), not hand-written — the Zod schema is the source of truth.
- Types get their own placement, never a flat `types.ts` and never declared inline inside a `.tsx` file (even a component's own props type) — every domain/package keeps a `types/index.ts` folder, sibling to `config/`, `hooks/`, `views/`, matching `infra`'s real `domains/*/types/index.ts` convention exactly (confirmed against `infra/infra/domains/auth/types/index.ts`). A `.tsx` file imports its prop/return types from there instead of declaring `type X = {...}` next to its JSX.
- Components as `const Component = (props: Props) => {...}` arrow functions, never `function` declarations.
- Exports go last in a file — types/consts/hooks/helpers defined above, the export at the bottom, not scattered inline.
- **TanStack Router route files are the one exception to both rules above, decided 2026-09-04.** `export const Route = createFileRoute(...)({ component: RouteComponent })` comes FIRST in the file; the component is a hoisted `function RouteComponent() {...}` declared AFTER it, not an arrow const, and not moved to the bottom — this matches the TanStack Start template's own original `routes/index.tsx` shape, not a new convention invented here. **`RouteComponent` (or `RouteComponents` when the thing being mounted is imported directly from a package, e.g. `@baseconfig/core/admin`'s dashboard export) is the only name a route's `component` value is ever bound to** — no route-file-local wrapper name like `AdminLayout`/`AdminCatchAll`. When the real component already lives elsewhere (e.g. `@baseconfig/core/admin`), the route file imports it under its real exported name and passes it straight to `component:` — no local re-wrapping, no renaming import (`import { X as RouteComponent }`), just `import { RouteComponents } from '@baseconfig/core/admin'` then `component: RouteComponents`.
- A class, if one's ever genuinely needed, gets its own `ClassName/` folder rather than sitting loose among other files.
- **Barrel files (`index.ts` re-exporting sibling modules) use `export * from './path'` only, decided 2026-09-04** — never a named re-export (`export { Thing } from './path'`), even to re-export just one thing. This is specifically about barrels re-exporting *other files*; a file's own locally-defined export (e.g. `export { RouteComponents }` at the bottom of the file that actually defines it) is unaffected — that's a normal export, not a barrel re-export.
- Domain-folder shape (matches `infra`'s existing `domains/` convention): `{purposeful-name}/{config/{schema.ts, config.ts}, types/index.ts, hooks/{use-{}.ts}, views/{component-name.view.tsx}, index.ts}`.
- Admin-UI-only concerns (which admin component renders a field, admin-panel display metadata) never get baked as mandatory structure onto data/consumer-facing shapes — `@baseconfig/fields`' `BaseField.admin` is optional, and the admin app resolves a field's rendered component by looking up `field.type`, not by reading a `component` string every field is forced to carry. See docs/DISCUSSION.md's admin/consumer split entry.
- Icons: `@hugeicons/react` (`HugeiconsIcon`) + `@hugeicons/core-free-icons`, not `lucide-react`, for all first-party BaseConfig code. Exception: `packages/ui`'s vendor-generated shadcn components keep whatever icon library they were scaffolded with (e.g. the `Breadcrumb` component's internal separator) — not worth hand-editing generated files for.
- Linting/formatting: **Biome**, not ESLint/Prettier — one root `biome.json`, no per-package configs needed (Biome is workspace-aware). **`biome.json` replaced wholesale on 2026-09-04** with the user's own standard cross-project config: **tabs, single quotes, no semicolons except where needed (`asNeeded`), no trailing commas**, linter `preset: "none"` with an explicit small rule set instead of `recommended` (a11y rules mostly off, `noExplicitAny`/`noArrayIndexKey` off, `useFilenamingConvention` off), no `useConsistentTypeDefinitions`/`noConstEnum` custom rules, no `packages/ui` override block, no `nursery.useSortedClasses`. The earlier double-quote/2-space/es5-trailing-comma description (and the `type`-not-`interface`/no-`const enum` Biome rules) is superseded — this file's older wording about it is wrong, go by the actual `biome.json` from here on, not this paragraph's history. `tsc --noEmit` per package stays the type-checking tool — Biome doesn't type-check.
- **No comments in code or config, ever** — see the dedicated section below. Dependency versions are exact-pinned, never ranged — see the dedicated section below.

## Admin UI theming — Tailwind/shadcn-aware, not hardcoded

**Decided 2026-09-04**: the admin UI ships with zero hardcoded colors. It reads the same CSS custom properties shadcn's own generated components read (`--background`, `--foreground`, `--primary`, `--primary-foreground`, `--muted`, `--muted-foreground`, `--border`, `--radius`, etc. — the exact token set `packages/ui`'s `globals.css` already defines) and renders through Tailwind utility classes bound to those tokens (`bg-background`, `text-foreground`, `border-border`, ...), never a literal hex/oklch value in component code. Consequence: a consumer who defines their own theme (overriding those CSS variables — their own `globals.css`, a different shadcn base color, dark-mode overrides) gets an admin panel that reflects it automatically; a consumer who defines nothing gets Tailwind's/shadcn's own stock defaults, because that's what the tokens resolve to when nothing overrides them. This is why `@baseconfig/ui` stays the single shared primitive layer the admin is built from — the token contract lives there once, not reinvented per admin screen. Existing static mockups (the published design-canvas artboards) use literal hex for illustration speed; the real admin implementation does not carry that forward — it's built token-first from the start.

## `@baseconfig/core` — consumer-facing surface and bundle discipline

**Decided 2026-09-04, refining the Package structure section above, verified against Payload's real source** (`payloadcms/payload`'s `templates/website` on GitHub — actual file contents fetched and read, not inferred from docs prose):

- **`@baseconfig/fields` merges into `@baseconfig/core`.** Payload has no separate installable "fields" package at all — field types are just part of the core `payload` package's config surface. Splitting it out was an unforced departure from Payload's own boundary. Core now owns: `defineCollection`/`defineGlobal`, the field builders + their Zod schemas, access control, hooks, the CRUD engine, schema-generation glue (calling into `@baseconfig/d1`), and better-auth's instance construction (see the auth bullet below). The Package structure table needs updating to match — not yet done, do that as part of whichever stage actually builds this.
- **Core stays UI-free — no React, no JSX, ever.** A consumer's own `collections/*.config.ts` / `globals/*.config.ts` files are plain `.ts`: field definitions and config, nothing else. This is the whole point of the split: a project that only ever calls the REST API (no admin surface at all) doesn't pay for a single byte of admin-UI code.
- **Corrected 2026-09-04: one package, not two.** The admin UI is NOT a separate npm package — it lives inside `@baseconfig/core` itself, under `src/admin/` (types, `fields/` — one file per field type's admin component, `forms/`, `functions/`, `views/` — `dashboard/` with `asidebar.tsx`/`headers.tsx`, `documents/`), as a sibling to `src/api/` (`auth/`, `storage/`, `index.ts`). Bundle-size discipline is enforced through subpath structure/exports instead of a package boundary: an API-only consumer imports only from `@baseconfig/core`'s `api` subpath and never touches `admin`, so none of the admin/React code enters their bundle even though it's physically in the same package. `@baseconfig/ui` (shared shadcn primitives) is still a separate dependency `src/admin/` pulls in.
- **The consumer's own files stay thin, verified against Payload's actual generated files**, not assumed:
  - Payload's `app/(payload)/admin/[[...segments]]/page.tsx` is 15 lines total: imports `RootPage`/`generatePageMetadata` from `@payloadcms/next/views`, the project's own config, and a generated `importMap`; the page body is one line, `RootPage({ config, params, searchParams, importMap })`. Every real byte of admin rendering logic lives in `@payloadcms/next`/`@payloadcms/ui`, not in the consumer's copy.
  - `app/(payload)/api/[...slug]/route.ts` is the same shape: destructures `REST_GET`/`REST_POST`/`REST_PATCH`/`REST_DELETE`/`REST_PUT`/`REST_OPTIONS` and re-exports each as the Next.js route handler, passing `config`.
  - Both files carry a literal `/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. DO NOT MODIFY IT... */` header — Payload treats them as codegen output the consumer owns on disk but never hand-writes.
  - **BaseConfig's equivalent, adapted to TanStack Start's file-based routing**: `www/src/routes/admin/$.tsx` and `www/src/routes/api/$.tsx` (catch-all routes) as the same kind of thin, near-zero-logic re-export — call into the admin package / core's REST handler factory, passing the consumer's `baseconfig.config.ts`. Exact signatures aren't designed yet; this is the shape, not the API.
  - **`importMap.js`'s purpose, confirmed**: Payload generates a static map of every custom-admin-component import path actually referenced in a project's config, because Next's React Server Components can't resolve a dynamic `import()` from a path computed at runtime — the map has to be a real, statically-analyzable module. **This constraint doesn't automatically carry over**: TanStack Start has no RSC boundary (it's Vite-based, client+SSR React Router, not React Server Components), so Vite's own `import.meta.glob()` may cover the same need (a build-time static registry of admin components, code-split per field type actually used) without a separate codegen step or generated file. Needs real investigation once the admin package is actually built, not assumed either way.
- **Bundle-size discipline is a hard constraint on `@baseconfig/core`, not a nice-to-have**: nothing gets added to core that grows its shipped size unless it's genuinely core's job (config assembly, fields, hooks, access control, the CRUD engine, schema-generation glue, auth). Anything UI-shaped belongs in the separate admin package, exactly so an API-only deployment doesn't pay for it, and so core stays trivially auditable.
- **`@baseconfig/core` owns auth**, decided direction but explicitly deferred: better-auth's instance construction moves inside `@baseconfig/core` (extendable, but following the same collections-structure conventions as everything else) rather than living as a bespoke `www/src/auth.ts` file as `docs/PLAN.md`'s Stage 7 currently describes. Not being built yet.
- **Not yet decided, explicitly open**: the admin package's real name, its exact dependency direction relative to core, and the REST-handler-factory's actual signature. This section describes the shape agreed so far, not a finished design — no code gets written against it without a further explicit go-ahead.

## Dependency versions — exact pins, manually updated

**Decided 2026-09-04**: every `package.json` in the workspace pins exact dependency versions (e.g. `"react": "19.2.8"`), never a range (`^`, `~`) and never `"latest"`. Reasoning: ranges/`latest` mean an unrelated `bun install` can silently pull in a newer version and introduce a regression nobody chose; an exact pin only ever changes when a human deliberately bumps it. Versions get bumped manually, checked against the real npm registry (`npm view <pkg> version`) at the time of the bump — not copied from whatever happens to already be resolved in `node_modules` under an old range, which reflects the old range's ceiling, not the actual current latest.

## No comments in code or config

**Decided 2026-09-04**: source and config files (`.ts`/`.tsx`/`.jsonc`/etc.) carry no comments — not even the "only when the why is non-obvious" carve-out other Claude Code sessions might default to. If something needs explaining, it goes in `CLAUDE.md`/`docs/DISCUSSION.md`, not inline.

## Library packages build with tsdown

**Decided 2026-09-04**: every `@baseconfig/*` library package (`fields`/`core` merged, `d1`, `r2`, `ai`, plugins — everything except `www` itself, which is a Vite app, not a published library) builds with [tsdown](https://tsdown.dev) (the rolldown-based successor to `tsup`) once any of them actually needs a build step. `packages/ui` is a source-only workspace dependency today (consumed directly as TS/TSX via the monorepo, no build step) and stays that way unless that changes. Set up per-package as each package is actually built, not pre-emptively scaffolded before there's code to bundle.

## Caching & rendering model

The platform is edge-cached by default, everywhere. Rendered output is cached at the edge, and normal visitor traffic is served entirely from that cache — no D1 query, no backend/Worker business logic, on the common read path. The cache is **only populated/invalidated when a publisher or editor actually publishes or updates content** — not on a timer, not per-request revalidation. This is the mechanism (not just an aspiration) that keeps the Workers free-tier budget workable at 500 active users, and it's also why `@baseconfig/d1`'s relational (join-table) schema mapping for `blocks`/`array` is a comfortable default rather than a performance risk — D1 is barely touched on the read path at all.

## Field taxonomy (confirmed against Payload's own docs, full list adopted)

- **Data fields** (produce a DB column): `array`, `blocks`, `checkbox` (boolean), `code`, `date`, `email`, `group` (named), `json`, `number`, `point`, `radio`, `relationship` (single or hasMany), `richtext`, `select` (single or hasMany), `tabs` (named), `text`, `textarea`, `upload`.
- **Presentational fields** (admin-layout only, no DB column): `collapsible`, `row`, `tabs` (unnamed), `group` (unnamed), `ui`.
- **Virtual**: `join` (computed two-way relationship, no own column).
- Not real field types, corrected: "tags" is `select({ hasMany: true })`; "slug" is a `text` field plus a custom admin component/hook. Deferred, not needed yet: `currency`, `point`/geo beyond the base type (Products-specific).
- **Design insight**: a page's Hero/Layout/SEO/Settings admin structure is one named `tabs` field on the collection config, not four separate top-level concerns.

## `@baseconfig/d1` schema generation (confirmed against Payload's actual Drizzle source)

- `array` → child table: `_order` (int) + `_parent_id` (FK, cascade delete).
- `blocks` → **one table per block type** (not shared), each with `_order`, `_parentID`, `_path` (nested position); parent has a "many" relation to each.
- `group` → **no separate table** — flattened into prefixed columns on the parent (`groupName_subfieldName`).
- `relationship` (single) → FK column (`{field}_id`) on the parent, `onDelete: set null`. `hasMany` → junction table.
- Naming: `_rels` (relationship junctions), `_v` (versions — storage shape still TBD), `_locales` (deferred with localization).

## Hooks, access control, context (confirmed against Payload's docs, adopted)

- **Collection hooks**, firing order: `beforeOperation` → `beforeValidate` → `beforeChange` → *validation* → `afterChange` → `beforeRead` → `afterRead` → `beforeDelete` → `afterDelete` → `afterOperation`.
- **Global hooks**: same minus delete: `beforeOperation`, `beforeValidate` (update only), `beforeChange`, `afterChange`, `beforeRead`, `afterRead`.
- **Field hooks**: `beforeValidate`, `beforeChange`, `afterChange`, `afterRead`, `beforeDuplicate`.
- **Root**: `afterError`.
- **Auth hooks dropped** (`beforeLogin`/`afterLogin`/etc.) — better-auth on BaseConfig's own local instance owns that lifecycle natively; not a BaseConfig collection-hook concern.
- **Context**: request-scoped `Record<string, unknown>` (extendable via TS declaration merging), created once per operation, shared by every hook — collection/global *and* every field hook — that fires during it. Used for fetch-once/reuse-later across hooks, infinite-loop guards, and passing extra data into an operation without inventing a dummy field.
- **Access control**: functions scoped per-operation (`read`/`create`/`update`/`delete`, collection/global/field level), receive `req` (with `user`) plus `id`/`data`/`siblingData`/`blockData`/`doc` depending on context, return a `boolean` or a `Where` query constraint for row-level filtering.

## CRUD API shape

- **REST**, generated per collection/global: `GET /api/{collection}` (list), `GET /api/{collection}/{id}`, `GET /api/{collection}/count`, `POST /api/{collection}`, `PATCH /api/{collection}` (bulk) / `PATCH /api/{collection}/{id}`, `DELETE /api/{collection}` (bulk) / `DELETE /api/{collection}/{id}`; globals: `GET /api/globals/{global}`, `POST /api/globals/{global}` (update). Only `GET` routes are the wide-open (`cors: '*'`) public surface — mutations always require an authenticated admin session.
- **`where` operators**: `equals`, `not_equals`, `greater_than`, `greater_than_equal`, `less_than`, `less_than_equal`, `like`, `contains`, `in`, `not_in`, `exists`, composed via nestable `and`/`or`.
- **Internal accessor, typed per-collection** (not Payload's flat `collection: 'slug'` string param): `core.collections.pages.find({ where, sort, limit, page, depth })`, `.findByID({ id })`, `.create({ data, user, overrideAccess })`, `.update({ id, data })`, `.delete({ id })`, `.count({ where })`; globals mirror as `core.globals.siteSettings.find()` / `.update({ data })`.
- **CSRF**: kept, independent of better-auth's own session handling (defense in depth).
- **`jobs`**: optional. Config shape ported from Payload (`autoRun: [{ cron, queue, disableScheduling? }]`, `jobsCollectionOverrides`), but dispatch defers to Cloudflare Cron Triggers + Queues rather than Payload's own bin-script/polling mechanism — confirm Queues' free-tier availability before it becomes load-bearing (Cron Triggers themselves are free).

## Live Preview & the map canvas

Editing a Collection/Global item is a Payload-style Live Preview split view — fields on one side, live-rendered result on the other, updating in real time — not a freeform drag-and-drop surface. Live Preview shares the same Hero/Layout/SEO/Settings `tabs` as the plain Edit view; switching tabs keeps the preview visible. JSON view and API view are additional switchable views of the same item. One level above: a freeform, freely-arrangeable **map/overview canvas** (Apple-Freeform-inspired) showing live-preview thumbnails of every page and its connected Collections/Globals — navigation only, not where editing happens. **Not yet designed**: exact "connected structure" visualization and how preview thumbnails stay current (rendered snapshot on save? live iframe? something else) — still open, see `docs/DISCUSSION.md`.

## Drafts & versioning

Payload-style, both optional per Collection/Global (`versions: { drafts, ... }`), matching Payload's own config shape. Storage shape uses the `_v` suffix convention (see schema-generation section) — exact structure still TBD.

## License

**Finalized**: the Pherus Parley License, in `LICENSE` at repo root. Legally MIT (same grant, same notice condition, same AS-IS disclaimer) plus one added trademark clause ("The Flag") protecting the "Pherus"/"BaseConfig" names from implying endorsement of a fork — no patent grant, deliberately closer to MIT than Apache. Closed, no further discussion needed.

## Multi-tenancy

**Decided: a plugin, not core** — `@baseconfig/plugin-multi-tenant`, matching Payload's own precedent (Multi-Tenant ships as a separate official plugin) and multi-tenancy being optional. Enables better-auth's `organization()` plugin on BaseConfig's own local auth instance (independent of infra, which has no organization plugin). When enabled, an Organization behaves more like a tag/attribute on content (akin to an author field) than a hard partition boundary; there's a notion of the currently-active Organization that access rules can reference. A single-tenant install never loads this plugin at all.

## AI

**Decided**: `@baseconfig/ai` is built on `@tanstack/ai` (per the "TanStack libraries take priority" rule), not hand-rolled. Confirmed shape: a `chat()` server route paired with a client `useChat()` hook, AG-UI-compliant streaming, official adapters including Gemini (matches the provider decision below). Workers AI is not in TanStack AI's official adapter list — needs a custom adapter for the Workers AI binding (build task, not a blocker). `@tanstack/ai-mcp` (host-side MCP client) is kept conceptually distinct from a future `@baseconfig/plugin-mcp` (an MCP *server* exposing `core`'s own CRUD as tools to external AI clients) — complementary, different directions.

One unified, switchable AI provider layer — not one integration per feature. Ship with Workers AI (native, no external key) and Gemini's free tier as initial providers, pluggable for more later.

**Feature scope, decided**: writing assistance for pages/posts; page design assistance; nav item generation/management; product management assistance; image improvements (upscaling, cleanup, alt text — exact ops TBD); general automations (not yet enumerated); and schema-level AI (creating a new Collection/Global config, not just filling in content within one).

**Not yet decided**: how each feature hooks into the collection-config/hooks model.

## Open questions (resolve before treating as settled)

- How AI features hook into the collection-config/hooks system.
- Map-canvas mechanics: connected-structure visualization, live-preview-thumbnail freshness strategy.
- R2 key/folder scheme.
- Versions/drafts exact storage shape (`_v` table structure).
- Live Preview's actual communication mechanism (postMessage protocol between the fields side and the rendered-preview side).
- Whether Cloudflare Queues is free-tier available (Cron Triggers are; Queues unconfirmed) — affects the `jobs` free-tier default.

## Cloudflare free-tier reality check (confirmed 2026-08-31, from developers.cloudflare.com)

| Service | Free limit | Read against target |
|---|---|---|
| Workers | 100,000 requests/day, 10ms CPU/request, 50 subrequests/request | **Tightest constraint.** 500 active users can burn 100K req/day on normal browsing alone, and 10ms CPU is thin for SSR. Mandatory: aggressive edge/Cache-API caching so most page views are served from cache without invoking the Worker at all. |
| D1 | 500 MB/database (free), 5M rows read/day, 100K rows written/day | Single database, no sharding. Comfortable at target scale. Paid ($5/mo flat) raises the ceiling to 10 GB if ever actually needed. |
| R2 | 10 GB storage/month free, 1M Class A ops/month, 10M Class B ops/month, egress free | Comfortable for "lots of images" if reasonably optimized; free egress removes the usual CDN cost risk. |
| KV | 100,000 reads/day, 1,000 writes/day (per key: 1/sec), 1 GB storage | Second-tightest. Writes/day is the real cap — session/cache writes must stay low-frequency (long-lived cookie cache, not per-request writes). |

Bottom line: achievable, but only if Workers requests and KV writes are treated as the scarce resources.

## Related repos

- `~/projects/infra` — existing auth/OAuth (better-auth, OAuth2 provider), accounts app, rate-limiting, asset handling. Source of truth to reuse from rather than duplicate — verify against its actual source before assuming its shape (see the auth correction in `docs/DISCUSSION.md`).
- `~/projects/seer` — the existing "no third-party rich-text libs, build on primitive contentEditable" pattern this project follows for its editor, and the existing local `betterAuth()`-wired-to-infra pattern this project's own auth follows.
