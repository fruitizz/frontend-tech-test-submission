# AGENT.md — AI Engineering Rules

Instructions for AI coding assistants working in this repository.

## Repository purpose

This is a LumApps frontend technical test: a React + TypeScript + Vite application using a local MSW mock API. The challenge requires character search, paginated results with four items per page, reactions, and visual coherence with the provided mockup.

Stack in use: React, TypeScript, Vite, SCSS, Yarn, LumX (`@lumx/react`, `@lumx/core`, `@lumx/icons`), MSW, React Router. Prefer these over new frameworks or libraries.

## Engineering principles

- Prefer the smallest implementation that satisfies the open issue.
- Preserve existing architecture, file layout, and patterns.
- Prefer incremental refactoring over rewrites.
- Use existing libraries before introducing new ones.
- Keep TypeScript strict; do not weaken compiler options to silence errors.
- Avoid unnecessary abstractions, indirection, and speculative “future-proofing.”
- Favor clarity and maintainability over cleverness.
- Do not upgrade, add, or remove dependencies without explicit human approval.

## Repository-specific rules

- Preserve the existing LumX Design System; build with LumX primitives and tokens already in the project.
- Do not replace UI components unless necessary to meet the issue’s acceptance criteria.
- Keep keyboard shortcuts working: ⌘K / Ctrl+K must continue to open the search dialog (and related focus behavior must remain intact).
- Prioritize accessibility in every UI change; do not trade a11y for visual convenience.
- Extend existing modules before introducing parallel structures.
- Preserve mock API behavior (`src/__mocks`) unless the current issue explicitly requires changes.

## Working process

1. Work on exactly one GitHub issue at a time.
2. Read the issue fully (objective, scope, non-goals, acceptance criteria).
3. Inspect relevant code and explain the planned changes before editing any files.
4. Implement only what the issue requires.
5. Run validation before and after changes (see Validation requirements).
6. Summarize what changed, how to verify it, and any remaining risks.
7. Stop. Wait for manual approval. Do not start the next issue automatically.

## Scope control

- Stay within the issue’s stated scope and non-goals.
- Never change behavior outside the current issue.
- Do not implement challenge features, refactors, CI, docs, or tooling unless the issue asks for them.
- Do not “drive-by” fix unrelated bugs or style issues.
- Do not install or configure extra agent tooling unless explicitly requested.
- If scope is unclear or blocked, stop and ask; do not guess expansively.

## Validation requirements

- Before editing: confirm baseline status (git status, relevant scripts, known failures).
- After editing: run the smallest set of checks that prove the change works.
- Use only scripts declared in the current `package.json`, such as `yarn start` and `yarn build`. Do not invent commands or assume scripts exist.
- Install dependencies using the repository’s existing package manager and lockfile without upgrading packages.
- When UI or search is touched, manually confirm ⌘K / Ctrl+K still opens search.
- The documented Node.js `20.11.1` baseline currently fails with the locked Vite version, which requires Node.js `20.19+` or `22.12+`. Treat this as known pre-existing behavior until a dedicated issue changes the repository configuration.
- Do not invent validation scripts or add test runners unless the issue requires it.
- Report command results honestly, including failures and pre-existing breakage.
- Never claim validation passed without having run it.

## Git workflow

- Never create commits unless the human explicitly asks.
- Never push, force-push, amend shared history, or open PRs unless explicitly asked.
- Never update git config.
- Do not create branches unless the issue or human requests it.
- Leave the working tree ready for human review; do not auto-stage unrelated files (e.g. `dist/`).
- One issue → one focused change set; do not bundle multiple issues.

## Coding standards

- Match existing naming, imports, component structure, and SCSS module usage.
- Prefer LumX components and existing utilities over custom UI primitives.
- Keep components focused; colocate styles with existing patterns (`*.module.scss`).
- Type API responses, component props, state, and reusable data structures explicitly; avoid `any` unless unavoidable and justified.
- Handle loading, empty, and error states where user-facing flows need them.
- No commented-out code, dead flags, or leftover debug logs.

## Testing expectations

- There may be no formal unit-test suite yet; do not add Jest/RTL/etc. unless an issue requires it.
- Manually verify the acceptance criteria of the current issue in the running app when UI is involved.
- Prefer targeted checks over broad rewrites “to make testing easier.”
- If tests exist later, run them before and after changes and fix only failures caused by your work.
- Do not alter MSW handlers or fixtures to make tests/pass criteria easier unless the issue requires it.

## UI expectations

- Follow the mockup for layout intent (search, result cards, pagination); pixel-perfect match is not required.
- Keep spacing, typography, and hierarchy coherent with LumX and existing styles.
- Do not replace LumX components with custom markup unless necessary for the issue.
- First deliver working search, results (image, name, description, species/birth year/affiliations), reactions, and pagination.
- Do not redesign the product or add decorative chrome unrelated to the issue.
- Ensure the UI remains usable on desktop and reasonable on smaller widths when touching layout.

## Performance expectations

- Avoid unnecessary re-renders, duplicate network calls, and oversized bundles.
- Keep bundle size impact minimal; justify any new dependency before adding it (approval required).
- Fetch only what the UI needs for the current page/search.
- Do not add caching layers or state libraries unless approved and justified by an issue.
- Keep list rendering simple; virtualize only if an issue demands it and measurement shows need.

## Accessibility expectations

- Prioritize accessibility; treat it as a first-class acceptance concern, not a polish pass.
- Use semantic HTML and label interactive controls (search field, pagination).
- Preserve keyboard access for search submit and dialog/shortcut flows (including ⌘K / Ctrl+K).
- Provide meaningful alternative text for character images when rendering results.
- Do not remove focus styles or break screen-reader structure for visual tweaks.
- Manage focus when opening/closing overlays (e.g. search dialog).

## Stop conditions

Stop immediately and wait for a human when any of the following apply:

- The current issue’s acceptance criteria are met (or blocked with a clear explanation).
- The next step would upgrade dependencies, add new libraries, or change engines without approval.
- The next step would rewrite LumX usage, replace working UI components, or change mock API behavior without issue mandate.
- Validation fails in a way that is unclear or outside the issue’s scope.
- The task would require committing, pushing, or starting another issue.
- Requirements conflict with these rules or with repository ground rules.

After each issue: explain results, do not continue automatically, and wait for manual approval.
