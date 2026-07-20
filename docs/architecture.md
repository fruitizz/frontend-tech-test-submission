# Architecture Analysis (Issue #5)

Analysis-only snapshot of the current codebase before feature work. No application behavior is defined here as implemented unless it already exists in source.

## 1. High-level architecture

```
Browser
  └─ Vite + React 19 (src/main.tsx)
       ├─ MSW worker start (src/__mocks/browser.ts)  →  intercepts /api/*
       └─ <App />
            ├─ react-router-dom BrowserRouter
            ├─ <Header />   (logo + search TextField stub)
            └─ <Routes>
                 └─ "/" → <Content />  (empty section)

Data / API layer (intended, mostly empty):
  src/api/index.tsx          → empty; natural place for fetch helpers
  src/types.ts               → Character, Reaction
  src/__mocks/{data,index}   → fixtures + MSW handlers
  public/images/*            → character images served statically
```

**Stack:** React, TypeScript (strict), Vite, SCSS modules, Yarn 3, LumX (`@lumx/react`, `@lumx/core`, `@lumx/icons`), MSW 2, React Router 7.

**Bootstrap:** `enableMocking()` dynamically imports the MSW worker, starts it with `onUnhandledRequest: 'bypass'`, then mounts `<App />` under `React.StrictMode`.

## 2. Component hierarchy

```
App
├── Header
│   ├── FlexBox (LumX)
│   │   ├── Thumbnail (logo)
│   │   └── TextField (search; onChange no-op)
│   └── Header.module.scss
└── Routes
    └── Route "/" → Content
        └── <section> (empty padding wrapper)
```

There are no result cards, pagination, reaction, loading, or error components yet.

## 3. Route hierarchy

| Path | Element | Notes |
|------|---------|--------|
| `/`  | `Content` | Only registered route |

`BrowserRouter` wraps the tree. Header sits outside `<Routes>`, so it is shared. No nested routes, query-string routing, or search dialog routes exist today.

## 4. Search flow (current vs intended)

**Current**

1. Header renders LumX `TextField` with `label="Search"` and `icon={mdiMagnify}`.
2. `onChange={() => {}}` — input does not update state or call the API.
3. No submit / Enter handler, and no keyboard-shortcut search dialog in the current UI.

**Intended (README + MSW contract)**

1. User types a name and submits (Enter).
2. Client calls `GET /api/characters?name=<query>&page=1&limit=4`.
3. MSW filters characters whose `name` **includes** the query (case-insensitive).
4. UI shows up to 4 results with image, name, description, species, birth year, affiliations.

**Gap / risk:** README says names that **start with** the query; MSW uses **includes**. Prefer aligning client UX to the mock API as-is (do not change MSW unless a later issue requires it).

## 5. Pagination flow (current vs intended)

**Current:** no pagination UI or page state.

**MSW contract (when both `page` and `limit` are provided):**

- Response shape: `{ results, total, page, limit, next, previous }`.
- `next` / `previous` are URL strings or `null`.
- If either `page` or `limit` is missing, MSW returns the full filtered list in one response (`limit: filteredData.length`).

**Intended client flow:** keep `page` in local state (reset to `1` on new search); request with `limit=4`; render LumX pagination (or equivalent) from `total` / `page`; navigate via page change → refetch.

## 6. Reactions flow (current vs intended)

**Current:** no client fetch or display.

**MSW:** `GET /api/reactions` → `{ reactions: Reaction[] }`.

**Types:** `Reaction { id, content, characterId, deleted }`.

**Intended:** fetch reactions once (or with results), filter `deleted === false`, group by `characterId`, attach to each displayed character (emoji/`content` list).

**Data notes:** fixture has duplicate `id` values for some reactions; some characters have no reactions; some characters lack `imageUrl`.

## 7. MSW architecture

| File | Role |
|------|------|
| `src/__mocks/browser.ts` | `setupWorker(...handlers)` |
| `src/__mocks/index.ts` | Handlers: `GET /api/characters`, `GET /api/reactions` |
| `src/__mocks/data.ts` | `allCharacters` (30), `allReactions` |
| `public/mockServiceWorker.js` | MSW service worker asset (`package.json` `msw.workerDirectory`) |

Characters endpoint supports optional `name`, and pagination only when **both** `page` and `limit` are set. No POST/PATCH for reactions; read-only mock.

## 8. Current state management

- No Redux, Context, React Query, or URL search-param state.
- No `useState` / `useEffect` in app components today.
- Search field is uncontrolled from React’s perspective (no-op `onChange`).
- Possible implementation approaches include lifting state into `App`, managing it within `Content`, or introducing a dedicated container component. The final approach should minimize component coupling while remaining consistent with the existing architecture.

## 9. Existing reusable components / extension points

| Asset | Reuse |
|-------|--------|
| `App` | Router shell; good place to hold shared search/results state or providers |
| `Header` | Extend search wiring; keep LumX `TextField` |
| `Content` | Natural home for results list + pagination |
| `src/api/index.tsx` | Empty — implement `getCharacters` / `getReactions` here |
| `src/types.ts` | Extend with API response types (`CharactersResponse`, etc.) |
| LumX | Prefer `FlexBox`, `Thumbnail`, `TextField`, plus Pagination / Chip / ProgressTracker as needed from `@lumx/react` |
| SCSS modules | Follow `Header.module.scss` pattern |
| `design.png` | Visual reference for layout |

No shared result-card or pagination component exists yet. New reusable components should follow the existing project organization and remain consistent with current naming and styling conventions.

## 10. Technical risks

1. **Node engine mismatch (pre-existing):** `engines.node` is `20.11.1`; locked Vite 7 needs `20.19+` or `22.12+` (Issue #2 territory).
2. **Empty API layer:** all networking still to be written; easy to scatter `fetch` in components if `src/api` is skipped.
3. **Search semantics mismatch:** README “starts with” vs MSW `includes`.
4. **Keyboard shortcuts:** AGENT.md previously assumed a ⌘K / Ctrl+K search dialog that does not exist in the repository; that rule was corrected to apply only if shortcuts are introduced or modified.
5. **Optional character fields:** missing `imageUrl` / `description` / `species` / `birthYear` need graceful UI.
6. **Reaction duplicates / deleted flags:** group carefully; always exclude `deleted: true`.
7. **Pagination contract:** omitting `page` or `limit` returns full list — client must always send both with `limit=4`.
8. **No tests / no loading-error UI yet:** edge cases (empty search results, network failure) are easy to miss.
9. **tsconfig `types`:** lists `jest`, `gapi`, `google.picker` unused by this app — noise only unless `@types` packages are missing.
10. **Working tree noise:** untracked `dist/` and modified lockfile/package.json from prior chores — keep feature diffs clean.

## 11. Implementation backlog

Proposed GitHub issues derived from this analysis. Scope and acceptance criteria for each should be written when the issue is opened.

| Issue | Title |
|-------|--------|
| #6 | Implement typed API layer |
| #7 | Implement search workflow |
| #8 | Implement result cards |
| #9 | Implement reactions |
| #10 | Implement pagination |
| #11 | Improve loading, empty and error states |
| #12 | Accessibility polish |
| #13 | Testing & validation |

**Out of scope for this backlog unless a dedicated issue is opened:** new state libraries, MSW/fixture changes, Node engine fix, redesign.

## Completion

Issue #5 deliverable: this document. Stop here; wait for manual approval before feature implementation.
