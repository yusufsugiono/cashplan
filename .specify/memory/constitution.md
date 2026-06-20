# CashPlan — Speckit Constitution

> Speckit-aware subset of the project constitution.
> Derived from CONSTITUTION.md and AGENTS.md.

---

## Core Principles

### I. Client-Only SPA

React 19 + Vite 8. Zero backend, zero API calls, zero server. All code executes in the browser. Persistence is `window.localStorage` only via `src/lib/storage.js`. No IndexedDB, no backend database, no server-side rendering. Routing is flat React Router DOM 7 with `BrowserRouter` and `basename="/cashplan"`.

### II. Feature-First Organization

Modules are grouped by domain under `src/features/<name>/`. Layer constraints are strict:

| Layer | May import from | Must NOT import from |
|---|---|---|
| `pages/` | features, layouts, ui, lib, constants | — |
| `features/` | ui, lib, constants, hooks | Other features, pages |
| `layouts/` | ui, lib, constants | Features, pages |
| `components/ui/` | (pure presentational only) | lib, constants, features, pages |
| `lib/` | (zero React/internal deps) | Any internal module |
| `hooks/` | lib, constants | Features, pages, layouts, ui |

### III. Minimal Dependencies

Runtime dependencies are strictly limited to: `react`, `react-dom`, `react-router-dom`, `react-icons`, `sweetalert2`, `tailwindcss`. No state management libraries, no HTTP clients, no lodash, no component libraries. Do NOT add new runtime deps without justification. TypeScript is not used — do not introduce it. No testing framework is present; do not add tests without first introducing `vitest`.

### IV. Theming via CSS Custom Properties

All colors go through `var(--color-*)` CSS custom properties. Never use raw Tailwind color classes. Three modes: `light`, `dark`, `system`. Applied before React mount via inline `<script>` in `index.html` to prevent flash. Tailwind utility classes are used for layout, spacing, and typography only.

### V. Risk & Safety

Never change existing localStorage key schemas without a migration path — add new fields as optional. Features must NOT import from other features. Always verify with `npm run lint`, `npm run format:check`, `npm run build` before considering work complete. Prohibited: server-side code, environment variables, nested routes, route guards, lazy loading.

---

## Language & Style Constraints

- **Language**: JavaScript (JSX). No TypeScript.
- **Comments**: Bahasa Indonesia. JSDoc on all components and exported functions.
- **Formatting**: Prettier — semicolons, single quotes, trailing commas, print width 100, tab 2, LF.
- **Naming**: PascalCase for components, camelCase for utilities, UPPER_SNAKE_CASE for constants.
- **Data access**: Always through `loadFromStorage(key)` / `saveToStorage(key, data)` from `src/lib/storage.js`. Never access `localStorage` directly except in the Settings export/import flow.

---

## Development Workflow

1. **Understand** existing code before making changes — read relevant files in full.
2. **Follow existing data flow** — Page mounts → `loadFromStorage()` → props → feature components mutate via `saveToStorage()`.
3. **Minimal, focused changes** — One concern per edit. Prefer editing existing files over creating new ones.
4. **Verify** — `npm run lint && npm run format:check && npm run build`. Manual test via `npm run dev`.
5. **Commit** (only when asked) — Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`.

---

## Governance

AGENTS.md is the working agreement for daily development. CONSTITUTION.md is the descriptive reference for architecture and conventions. This Speckit constitution is a subset of both. Amendments require documentation in the relevant file and alignment across all three. The layer constraints and dependency rules are non-negotiable without team discussion.
