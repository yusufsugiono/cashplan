# CashPlan — Architecture

## Application Topology

**CashPlan** is a client-side-only Single Page Application (SPA). There is no backend server, no API gateway, and no database server. All code executes in the browser.

| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 3 + CSS Custom Properties |
| Routing | React Router DOM 7 (BrowserRouter) |
| Icons | react-icons (Font Awesome 6) |
| Notifications | SweetAlert2 |
| Persistence | Web localStorage |
| PWA | Custom service worker + Web App Manifest |

## Module Architecture

```
index.html             → Entry point (theme script, SW registration)
src/main.jsx           → React root (StrictMode, BrowserRouter)
src/App.jsx            → Route definitions, theme sync effect
src/pages/             → Route-level page components
src/features/<name>/   → Domain feature components
src/components/ui/     → Generic reusable UI primitives
src/layouts/           → Structural chrome (AppBar, BottomNav)
src/lib/               → Pure utility functions
src/constants/         → Static app data
src/hooks/             → Custom hooks (currently empty)
```

## Data Flow Pattern

1. **Page mounts** → calls `loadFromStorage()` or `loadSettings()` from `src/lib/storage.js`
2. **Page passes data as props** → down to feature components
3. **Feature component mutates data** → calls `saveToStorage()` directly
4. **No reactive synchronization** — data is re-read from localStorage on each page navigation

There is no global state management library. No context providers (except BrowserRouter). No reducer pattern.

## Routing

Flat route structure in `App.jsx`. All routes defined as constants in `src/constants/routes.js`.

| Route | Page | Navigation pattern |
|---|---|---|
| `/` | HomePage | Push state for back-button handling |
| `/transactions/new` | AddNewTransaction | `navigate(-1)` after save |
| `/history` | HistoryPage | `navigate(-1)` for back |
| `/budgeting` | BudgetingPage | `navigate(-1)` for back |
| `/budgeting/new` | AddBudgetPage | `navigate(-1)` after save |
| `/budgeting/edit/:id` | EditBudgetPage | `navigate(-1)` after save |
| `/settings` | SettingsPage | `navigate(-1)` for back |

BottomNav uses `navigate(route, { replace: true })` to avoid bloating browser history.

## Theming System

- CSS custom properties define colors in `:root` (light) and `[data-theme='dark']` (dark)
- `@media (prefers-color-scheme: dark)` applies dark when no explicit theme is set
- Inline script in `index.html` applies saved theme before React mounts (flash prevention)
- `App.jsx` useEffect re-applies theme on mount (in case settings changed)
- Three modes: `light`, `dark`, `system`

## ID Generation

Transaction and budget IDs are generated client-side using `Date.now()` (and `Math.random()` for budget item IDs). Not cryptographically unique — sufficient for localStorage MVP.

## PWA Architecture

- **Service Worker** (`public/sw.js`): Cache-first for static assets, network-first for navigation requests
- **Scope**: `/cashplan/`
- **Precache on install**: root page, manifest.json, 192px icon
- **Manifest**: standalone display, portrait orientation, theme color #00ADB5

## Deployment Topology

- Static file server hosting the `dist/` directory under `/cashplan/` subpath
- `index.html` copied as `404.html` for SPA fallback (GitHub Pages pattern)
- No server-side rendering, no environment variables, no Docker
