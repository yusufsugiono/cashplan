# CashPlan — AGENTS.md

> Working agreement for AI agents and human contributors.
> Reflects the project as it exists today. Do not invent architecture that does not exist.

---

## 1. Current Architecture (Do Not Override)

- **Client-side SPA** — React 19 + Vite 8. Zero backend, zero API calls, zero server.
- **Persistence** — `window.localStorage` only (via `src/lib/storage.js`). No IndexedDB, no backend DB.
- **State** — Ephemeral `useState` + re-read from `localStorage` on each page navigation. No Context, no Redux, no Zustand.
- **Routing** — React Router DOM 7, flat routes, `BrowserRouter` with `basename="/cashplan"`.
- **Styling** — Tailwind CSS 3 + CSS custom properties for theming. No Tailwind color classes used directly.
- **Language** — JavaScript (JSX). No TypeScript. JSDoc for props/types.
- **Testing** — None. Zero test frameworks in `devDependencies`. Do not add tests without first introducing a framework (`vitest` recommended).

### Layer Constraints

| Layer | May import from | Must NOT import from |
|---|---|---|
| `pages/` | features, layouts, ui, lib, constants | — |
| `features/` | ui, lib, constants, hooks | Other features, pages |
| `layouts/` | ui, lib, constants | Features, pages |
| `components/ui/` | (pure presentational only) | lib, constants, features, pages |
| `lib/` | (zero React/internal deps) | Any internal module |
| `constants/` | (zero internal deps) | Any internal module |
| `hooks/` | lib, constants | Features, pages, layouts, ui |

---

## 2. Coding Rules

### 2.1 Conventions

- **Components**: PascalCase, default export, file named after component.
- **Utilities**: camelCase, named exports, file camelCase.
- **Constants**: UPPER_SNAKE_CASE.
- **Props**: Destructure in function signature, annotate with JSDoc.
- **Comments**: Bahasa Indonesia. JSDoc on all components and exported functions.
- **Formatting**: Prettier enforced — semicolons, single quotes, trailing commas, print width 100, tab 2, LF.

### 2.2 Style

- All colors go through CSS custom properties (`var(--color-*)`). Never use raw Tailwind color classes.
- Use Tailwind utility classes for layout/spacing/typography.
- Do NOT add Tailwind plugins, custom theme extensions, or new CSS files unless necessary.

### 2.3 Data Access

- Always use `loadFromStorage(key)` / `saveToStorage(key, data)` from `src/lib/storage.js`.
- Never access `localStorage` directly except in `storage.js` and the Settings export/import flow (which intentionally reads raw for serialization).
- IDs: `Date.now()` for objects, `Date.now() + Math.random()` for nested items.

### 2.4 Dependencies

- Do NOT add new runtime dependencies without justification. Current set: `react`, `react-dom`, `react-router-dom`, `react-icons`, `sweetalert2`, `tailwindcss`.
- Do NOT add state management libraries, HTTP clients, lodash, or component libraries.
- If adding a dev dependency, prefer well-maintained, minimal-footprint tools.

### 2.5 Prohibited Patterns

- No server-side code, no API routes, no backend of any kind.
- No environment variables, no `.env` files.
- No IndexedDB, no Web SQL, no backend database.
- No nested routes, no route guards, no lazy loading (yet).
- No global CSS resets beyond what exists in `main.css`.

---

## 3. Implementation Workflow

### Step 1: Understand the existing code first
Before making changes, read the relevant files in full. Understand the existing patterns for state management, data flow, and component structure. Do not assume patterns that don't exist.

### Step 2: Follow the existing data flow pattern
1. Page mounts → `loadFromStorage()` or `loadSettings()`
2. Data passed as props → feature components
3. Mutations call `saveToStorage()` directly
4. No reactive cross-page sync — data re-reads on navigation

### Step 3: Make minimal, focused changes
- One concern per edit. Do not refactor unrelated code.
- Prefer editing existing files over creating new ones.
- When adding a feature component, place it in the correct `src/features/<name>/` directory.
- When adding a page, add a route constant in `src/constants/routes.js`, import the page in `App.jsx`, and add the `<Route>`.

### Step 4: Verify
- Run `npm run lint` and `npm run format:check` before considering work complete.
- Run `npm run build` to confirm the project compiles.
- Manual test: open the dev server (`npm run dev`) and exercise the changed paths.
- Do NOT add test files unless a testing framework is already set up.
- Review and update documentation if the implementation introduces:
  - New module/directory → update `docs/module-map.md`
  - New storage key or data flow changes → update `docs/api-map.md`
  - localStorage schema changes → update `docs/database-map.md`
  - New feature/workflow → update `specs/current-system/baseline-spec.md` (actors, workflows, business rules, constraints)
  - New coding rules, dependencies, or architecture changes → update `AGENTS.md`, `CONSTITUTION.md`, `.specify/memory/constitution.md`

### Step 5: Commit (only when asked)
- Use conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`.
- Keep commits atomic — one logical change per commit.

---

## 4. Risk Minimization

| Risk | Mitigation |
|---|---|
| Breaking existing localStorage data shape | Never change existing key schemas without a migration path. Add new fields as optional. |
| Breaking theming system | Always use `var(--color-*)` for colors. Never hardcode color values. |
| Unintended cross-feature coupling | Enforce layer constraints (Section 1). Features must not import from other features. |
| Adding backend/server code | Strictly prohibited. The application is client-only by design. |
| Adding TypeScript | Not currently used. Do not introduce. If the team decides later, it must be a dedicated migration. |
| Over-engineering (adding state lib, ORM, etc.) | If a pattern doesn't exist in the codebase, do not introduce it. Stay minimal. |
| Breaking PWA behavior | Test service worker scope (`/cashplan/`) and manifest after changes. |
