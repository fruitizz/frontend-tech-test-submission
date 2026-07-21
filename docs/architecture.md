# Architecture

This document describes the application as implemented on `master`. It supersedes the
earlier pre-implementation analysis (issue #5); that snapshot described an almost-empty
codebase before any feature work landed, and no longer matches the shipped app.

## 1. High-level architecture

```
Browser
  └─ Vite + React 19 (src/main.tsx)
       ├─ MSW worker start (src/__mocks/browser.ts)  →  intercepts /api/*
       └─ <App /> → <CharacterSearchPage />
            └─ <AppShell>                     (src/components/AppShell)
                 ├─ react-router-dom BrowserRouter
                 ├─ <SearchCommand />          (src/components/SearchCommand)
                 └─ <Routes> → "/" → <main>    (search results view)

src/api/            transport boundary: fetch + typed errors, no React
src/features/
  character-search/ orchestration: hooks + state derivation for this screen
src/components/     presentational, feature-agnostic UI
src/lib/            small pure helpers shared across the app
src/types.ts        Character / Reaction / API response shapes
```

**Stack:** React 19, TypeScript (strict), Vite 7, SCSS modules, Yarn 3, LumX
(`@lumx/react`, `@lumx/core`, `@lumx/icons`), MSW 2, React Router 7.

**Bootstrap:** `src/main.tsx` dynamically imports and starts the MSW worker
(`onUnhandledRequest: 'bypass'`), then mounts `<App />` under `React.StrictMode`
regardless of whether the worker started successfully (Preview/E2E environments may
block service workers).

## 2. Runtime component composition

```
App
└── CharacterSearchPage                 (src/features/character-search)
     ├── useCharacterSearch()           search + pagination state (hook)
     ├── useCharacterReactions()        per-character reaction state (hook)
     └── AppShell                        (src/components/AppShell — router shell)
          ├── SearchCommand              (src/components/SearchCommand)
          └── <main> → one of:
               ├── EmptyState (idle | empty)
               ├── CharacterCardSkeleton (first load of a fresh search)
               └── CharacterGrid
                    ├── CharacterCard × N (+ StaticChip)
                    └── Pagination
               └── ErrorState (with Retry)
```

`CharacterSearchPage` is the **orchestration boundary**: it owns both hooks and
contains the only `switch` over view state. Every component beneath it —
`SearchCommand`, `CharacterCard`, `CharacterGrid`, `Pagination`, `EmptyState`,
`ErrorState`, `CharacterCardSkeleton` — is **presentational**: it receives data and
callbacks as props and holds no orchestration logic of its own. `AppShell` is a thin
router shell (keeps `BrowserRouter`/`Routes` out of the feature component).

## 3. Search-state ownership

`src/features/character-search/useCharacterSearch.ts` is the single owner of search
and pagination state for the screen. It holds one state value, `SearchViewState`
(`src/features/character-search/search-view-state.ts`):

```ts
type SearchViewState =
  | { status: 'idle' }
  | { status: 'loading'; query: string; page: number; previousResults: SearchResultsData | null }
  | { status: 'success'; query: string; page: number; data: SearchResultsData }
  | { status: 'empty'; query: string; page: number }
  | { status: 'error'; query: string; page: number; error: SearchError };
```

This is a **discriminated union**, not a set of independent booleans
(`isLoading`/`error`/`data`/`hasSearched`, etc.). Each variant carries exactly the data
that is valid for that state: `idle` cannot carry a query, `error` cannot also carry
stale `results`. A pure function, `deriveViewState()`, maps a raw async outcome
(`loading` | `result` | `error`) plus the current query/page into the next
`SearchViewState`; `CharacterSearchPage` renders through one exhaustive
`switch (state.status)`, so an unhandled status is a TypeScript compile error, not a
runtime gap.

Pagination is **not** a separate piece of state — `page` and, on `loading`, an
optional `previousResults` snapshot are carried directly on the `SearchViewState`
value. Paginating keeps the previous page's cards on screen (with an inline spinner)
instead of resetting to a skeleton, while a brand-new search clears `previousResults`
so the skeleton shows immediately.

## 4. Reaction-state ownership

Reactions are modeled **independently of search state** in
`src/features/character-search/reaction-state.ts`:

```ts
type ReactionState =
  | { status: 'loading' }
  | { status: 'success'; reactions: Reaction[] }
  | { status: 'empty' }
  | { status: 'error' };
```

`useCharacterReactions()` fetches the full reactions list once, groups active
(non-deleted) reactions by `characterId` (`src/lib/reactions.ts`), and exposes
`getReactionState(characterId)`. Each `CharacterCard` asks for its own reaction state.
This means a card can render successfully while its reactions are still loading, are
empty, or failed to load — a failure in reaction enrichment never blocks or
invalidates the search results themselves.

## 5. Pagination ownership

`page` lives on `SearchViewState` (see §3); there is no separate pagination store.
`src/lib/pagination.ts` provides pure helpers — `getTotalPages(total, limit)` and
`buildPageItems(current, totalPages)` (windowed page numbers with `'ellipsis'`
markers) — consumed by the presentational `Pagination` component
(`src/components/Pagination`), which renders `null` when there is only one page.
Page size is fixed at `PAGE_SIZE = 4` (`src/features/character-search/search-params.ts`),
matching the acceptance criteria and the MSW contract.

## 6. API transport boundary

`src/api` is intentionally narrow and has no React dependency:

| File | Role |
|---|---|
| `api-client.ts` | `requestJson<T>()` — the only place that calls `fetch`; turns network failures, non-OK responses, and JSON parse failures into a typed `ApiError` |
| `api-errors.ts` | `ApiError` (transport-level: `kind` = `http` \| `network` \| `parse` \| `aborted`) and `SearchError` (feature-facing: `code` = `network_error` \| `invalid_response` \| `request_aborted` \| `unknown_error`), plus `toSearchError()` / `getErrorMessage()` |
| `characters.api.ts` | `getCharacters()` (low-level) and `searchCharacters()` (feature-facing; maps to `SearchError`) |
| `reactions.api.ts` | `getReactions()` (low-level) and `getCharacterReactions()` (feature-facing) |

No component or hook calls `fetch` directly; everything goes through `src/api`. UI code
only ever sees `SearchError`, never raw `fetch`/`Response` details — `getErrorMessage()`
gives a stable, presentable string (and intentionally returns `''` for aborted
requests, since those should never surface as an error to the user).

## 7. Abort / stale-response handling

Two independent mechanisms exist for the two independent state slices:

- **Search** (`src/lib/abortable-request.ts`, used by `useCharacterSearch`):
  `createAbortableRequest()` tracks a generation id and an `AbortController`. Every new
  search or page change calls `.next()`, which aborts the previous in-flight request and
  returns a fresh `{ id, signal }`. When a response resolves, the hook checks
  `isCurrent(requestId)` before calling `setState` — a late response from an aborted or
  superseded request is silently dropped instead of overwriting newer state.
  `handleClearSearch` calls `.invalidate()` to abort and bump the generation without
  starting a new request, so a late response can never resurrect a cleared search.
- **Reactions** (`useCharacterReactions`): a plain `AbortController` is created per
  mount/effect run and aborted on cleanup — reactions are fetched once and don't need
  the generation-counter pattern search does.

Both paths treat `request_aborted` as a non-error: it never reaches `ErrorState` or the
reaction error branch.

## 8. Presentational vs. orchestration boundary

- **Orchestration** — `CharacterSearchPage` and the two hooks
  (`useCharacterSearch`, `useCharacterReactions`) in `src/features/character-search`.
  This is the only place that knows about `src/api`, abort/generation logic, and view-state
  derivation.
- **Presentational** — everything in `src/components`. These components take primitive
  props and callbacks (`onPageChange`, `onRetry`, `onSearch`, `getReactionState`, etc.)
  and render LumX/HTML; they do not fetch data, hold async state, or import `src/api`.
- **Shared pure helpers** — `src/lib` (`pagination.ts`, `reactions.ts`, `search.ts`,
  `display.ts`, `abortable-request.ts`, `invariant.ts`). No React, no fetch; easy to unit
  test in isolation, which is exactly how they're covered (see below).

## 9. Test strategy

- **Unit/component (Vitest, `src/**/*.test.ts`):** targets the parts of the codebase where
  correctness is about pure logic rather than pixels — `src/api` (error mapping, the
  fetch wrapper), `src/lib` (pagination windowing, reaction grouping, search
  normalization, the abortable-request generation counter), and the feature's state
  derivation (`search-view-state.ts`, `reaction-state.ts`, `search-params.ts`). Coverage
  is scoped to exactly these paths in `vitest.config.ts` and gated in CI at
  85% statements / 85% lines / 80% functions / 75% branches.
- **End-to-end (Playwright, `e2e/*.spec.ts`):** exercises the app through the browser
  against the MSW-mocked API — the initial idle state, a successful search, empty
  results, pagination (including "no duplicate requests while loading" and "keeps query
  across pages"), error + retry, clear/reset (including clearing mid-request), the
  ⌘K/Ctrl+K focus shortcut, and accessibility assertions on cards and pagination
  controls. This is the primary protection for user-visible behavior, since it exercises
  real component composition rather than mocking it away.
- **CI (`.github/workflows/ci.yml`):** every PR and push to `master` runs a `Validation`
  job (install → `test:coverage` → `build` → `hanfani check`) and an `E2E` job
  (install → install Chromium → `test:e2e`) in parallel, uploading the coverage and
  Playwright HTML reports as artifacts.

## 10. Architecture evolution

The codebase was built in two deliberate phases, visible directly in the PR history:

1. **Behavior first.** The initial functional implementation (PRs #22–#28) added the
   typed API layer, the search workflow, character rendering, reactions, pagination, and
   loading/empty/error states directly against the acceptance criteria, without an
   upfront feature-folder structure.
2. **Tests and CI, then refactor.** Once the behavior existed, automated tests and CI
   were added first (PR #42) so the existing behavior was protected by a regression
   safety net *before* any structural change. Only then was the code reorganized: a
   narrow API/error boundary was extracted (PR #47), the codebase was regrouped into the
   feature-oriented layout described above (PR #49), and the ad-hoc boolean state
   (`isLoading` / `error` / `data` / derived flags) was replaced with the
   `SearchViewState` / `ReactionState` discriminated unions (PR #51).

None of the refactor PRs were intended to change product behavior — each one's E2E
suite (unchanged selectors and copy) and unit-test count only grew, never shrank, and
every refactor PR re-ran the full existing test suite as its acceptance bar. Where this
document earlier listed "technical risks" for a codebase that didn't yet exist (empty
API layer, no tests, Node engine mismatch), those risks have since been resolved by the
implementation and by this delivery pass (see the README's Reviewer Guide and the
corrected `engines.node` in `package.json`).
