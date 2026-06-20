# CashPlan — Project Constitution

> This document describes the project's architecture, conventions, and assumptions
> as they exist today. It is a descriptive reference, not a prescriptive mandate.

---

## 1. Architecture Patterns

**Application type:** Client-side SPA (React 19 + Vite 8). No backend server. Zero runtime API calls.

**State & persistence:** All state is ephemeral React `useState`, persisted to `localStorage` via `src/lib/storage.js`. No global state library, no context providers (except React Router). Data is re-read from storage on each page navigation — there is no reactive cross-page synchronization.

**Module organization:** Feature-first under `src/features/<name>/`. Each feature folder contains components scoped to that domain. Cross-cutting concerns live in:

| Directory | Purpose |
|---|---|
| `src/lib/` | Pure JS utility functions (currency, date, storage) |
| `src/constants/` | Static app data (routes, categories) |
| `src/components/ui/` | Generic, reusable UI primitives |
| `src/layouts/` | Structural chrome (AppBar, BottomNav) |
| `src/pages/` | Route-level compositions of features + layouts |
| `src/hooks/` | Custom React hooks (empty placeholder) |

**Routing:** Flat route structure in `App.jsx` using `BrowserRouter` with `basename="/cashplan"`. Routes are string constants in `src/constants/routes.js`. Navigation uses `useNavigate()`; back is `navigate(-1)`; tab navigation uses `replace: true`. No nested routes, no guards.

**Data flow:** Page → reads localStorage on mount → passes down as props → feature components mutate and `saveToStorage()`. Child-to-parent communication via callback props. No context, no reducers, no global stores.

**Theme:** CSS custom properties under `:root` (light) / `[data-theme='dark']` (dark), with a `system` option that defers to `prefers-color-scheme`. Applied before React mount via inline `<script>` in `index.html` to prevent flash.

---

## 2. Coding Conventions

**Language:** JavaScript (JSX). No TypeScript. JSDoc annotations used extensively for component props and function signatures.

**Naming:**

| Kind | Convention | Example |
|---|---|---|
| Components | PascalCase, default export | `SummaryCard.jsx` |
| Functions/variables | camelCase | `formatRupiah` |
| Constants | UPPER_SNAKE_CASE | `EXPENSE_CATEGORIES` |
| Files | PascalCase for components, camelCase for utilities | `BudgetForm.jsx`, `currency.js` |

**Formatting** (enforced by Prettier):

| Rule | Value |
|---|---|
| Semicolons | Always |
| Quotes | Single |
| Trailing commas | All |
| Print width | 100 |
| Tab width | 2 |
| End of line | LF |

**Linting** (ESLint flat config): extends `@eslint/js` recommended + `react-hooks` recommended + `react-refresh`/Vite config, with Prettier integration via `eslint-config-prettier`.

**Imports:** No explicit ordering convention enforced. UI components import from `components/ui/`; utilities from `lib/`; constants from `constants/`.

**Styling:** Tailwind utility classes + `var(--color-*)` custom properties. No Tailwind color classes used directly — all colors are themed through CSS custom properties.

**Comments:** Written in Bahasa Indonesia. JSDoc blocks above all components and exported functions.

**Error handling:** Forms use `noValidate` with custom validation. `SweetAlert2` for user-facing notifications. No try/catch patterns observed in the codebase.

---

## 3. Testing Strategy

**Current state:** No testing frameworks in `devDependencies`. Zero test files exist. The `hooks/` directory (which would typically hold testable logic) is empty.

**Gap:** No testing infrastructure is present — no `vitest`, `jest`, `playwright`, or `testing-library` dependencies. No test scripts in `package.json`. No CI workflow that runs tests. Any future work must introduce a testing framework before adding tests.

---

## 4. Dependency Rules

**Layer constraints** (explicitly documented in README):

| Layer | May import from | Must NOT import from |
|---|---|---|
| `pages/` | features, layouts, ui, lib, constants | — |
| `features/` | ui, lib, constants, hooks | Other features, pages |
| `layouts/` | ui, lib, constants | Features, pages |
| `components/ui/` | (pure presentational, no business logic) | lib, constants, features, pages |
| `lib/` | (zero React or internal dependencies) | Any internal module |
| `constants/` | (zero internal dependencies) | Any internal module |
| `hooks/` | lib, constants | Features, pages, layouts, ui |

**External dependency policy:** Minimal. The entire runtime dependency set is `react`, `react-dom`, `react-router-dom`, `react-icons`, `sweetalert2`, and `tailwindcss`. No component libraries, no utility libraries (lodash/etc.), no state management.

**Storage abstraction:** `src/lib/storage.js` is the sole persistence layer, designed to be swappable (noted in comments). All data access goes through `loadFromStorage` / `saveToStorage` / `loadSettings` / `saveSettings`.

---

## 5. Deployment Assumptions

**Host:** Static web server. The SPA is deployed under the `/cashplan/` subpath (configured via `base: '/cashplan'` in `vite.config.js`).

**Build output:** `dist/` directory via `vite build`. The build script also copies `dist/index.html` → `dist/404.html` for SPA fallback on static hosts (GitHub Pages pattern).

**Entry:** `index.html` loads `src/main.jsx`. Inline `<script>` handles theme application and service worker registration before React mounts.

**PWA:** Installable via `manifest.json` with `display: standalone`, `orientation: portrait`. Service worker in `public/sw.js` uses a precache + network-first navigation strategy under the `/cashplan/` scope.

**No server-side rendering.** No environment variables. No `.env` files. No Docker or container configuration.

**No CI/CD pipeline currently configured.** No `.github/` workflows exist.
