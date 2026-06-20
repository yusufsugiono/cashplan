# CashPlan — API Map

There are no HTTP APIs, no REST endpoints, and no network requests for application data. This is a client-only application. The "API" is the `localStorage` abstraction layer in `src/lib/storage.js`.

## Storage API Interface

### Generic Read/Write

| Function | Signature | Description |
|---|---|---|
| `loadFromStorage(key)` | `(string) → Array` | Reads and parses JSON array from localStorage. Returns `[]` on missing key or parse failure. |
| `saveToStorage(key, data)` | `(string, any) → void` | Serializes data to JSON and writes to localStorage. Silently logs errors. |

### Settings-Specific

| Function | Signature | Description |
|---|---|---|
| `loadSettings()` | `() → object` | Reads settings, merges with defaults. Returns `{ userName, theme, cycleStartDay }`. |
| `saveSettings(settings)` | `(object) → void` | Persists settings object. |

### Storage Keys (STORAGE_KEYS)

| Key | Used By | Data Shape |
|---|---|---|
| `transactions` | HomePage, HistoryPage, SettingsPage | `Array<Transaction>` |
| `budgets` | BudgetingPage, SettingsPage | `Array<Budget>` |
| `settings` | App, HomePage, SettingsPage | `Settings` |

## Transaction Flow (Add Transaction)

```
User fills CashflowForm
  → handleSubmit() validates
  → loadFromStorage('transactions') reads existing
  → saveToStorage('transactions', [...existing, newTransaction]) appends
  → onSaved() callback → navigate(-1) back to previous page
  → HomePage re-reads on next visit (no reactive update)
```

## Budget Flow (CRUD)

```
Read:   BudgetingPage mounts → loadFromStorage('budgets')
Create: BudgetForm → saveToStorage('budgets', [...existing, newBudget])
Update: BudgetForm (editData) → saveToStorage('budgets', updatedBudgets)
Delete: BudgetingPage handleDelete → saveToStorage('budgets', filtered)
Toggle: BudgetingPage handleToggleItem → saveToStorage('budgets', mapped)
```

## Settings Flow

```
Read:   App.jsx + HomePage + SettingsPage → loadSettings()
Write:  SettingsPage → saveSettings(updated)
Theme:  SettingsPage → applyTheme(theme) also sets data-theme on <html>
```

## Data Export/Import (SettingsPage)

```
Export:
  → Reads all 3 storage keys directly via localStorage.getItem()
  → Creates JSON Blob → triggers download as cashplan-backup-<date>.json

Import:
  → File input → FileReader → JSON.parse
  → Writes each key back via localStorage.setItem()
  → Reloads page
```

## PWA Service Worker API

The service worker (`public/sw.js`) intercepts `fetch` events:

| Request Mode | Strategy | Behavior |
|---|---|---|
| `navigate` | Network-first | `fetch(request)` → on failure → `caches.match(BASE_PATH)` |
| Other (assets) | Cache-first | `caches.match(request)` → on miss → `fetch(request)` → cache response |
