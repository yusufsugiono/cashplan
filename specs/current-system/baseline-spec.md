# CashPlan — Baseline Specification

> Current system behavior. No proposed changes.

---

## Actors

| Actor | Description | Entry Point |
|---|---|---|
| **Unidentified User** | User who has not set their name. Greeting shows empty name. All features still accessible. | `HomePage` |
| **Identified User** | User who has set their name via Settings. Name persists in localStorage and shows in greeting. | `SettingsPage` → `ProfileModal` |
| **User (general)** | The sole actor type. No authentication, no roles, no multi-user support. All data is local to the browser. | any page |

There are no admin, guest, or anonymous distinctions. Every visitor is the same actor.

---

## Workflows

### 1. Dashboard (View Period Summary)

```
1. User lands on HomePage (/)
2. System reads settings from localStorage
3. System calculates current cycle period based on cycleStartDay
4. System reads all transactions from localStorage
5. System filters transactions within the current cycle period
6. System computes totalIncome, totalExpense, balance
7. System renders:
   - Greeting (user name + period start/end dates)
   - SummaryCard (Saldo = balance)
   - SummaryCard (Pemasukan = totalIncome)
   - SummaryCard (Pengeluaran = totalExpense)
   - BottomNav
```

### 2. Add Transaction

```
1. User taps FAB (+) on BottomNav → navigates to /transactions/new
2. User selects tab: Pemasukan (INCOME) or Pengeluaran (EXPENSE)
3. User fills form: amount, description, date, category
4. User taps "SIMPAN"
5. System validates all fields:
   - amount: non-empty, numeric, > 0
   - description: non-empty
   - date: non-empty
   - category: non-empty
6. If validation fails → show inline errors, stop
7. System creates Transaction object with { id, type, amount, description, date, category, createdAt }
8. System reads existing transactions, appends new one, writes back to localStorage
9. System navigates back (-1) to previous page
```

### 3. View History

```
1. User navigates to /history
2. User selects tab: Pemasukan or Pengeluaran
3. System reads all transactions from localStorage
4. System filters by selected type
5. System renders TransactionList with date, description, amount per item
```

### 4. Budget Planning — View List

```
1. User navigates to /budgeting
2. System reads all budgets from localStorage
3. For each budget, system renders BudgetCard with:
   - label, remaining amount, total amount
   - checklist items (name, amount, checked state)
   - Edit and Delete buttons
4. User may:
   - Check/uncheck an item → system updates checked state in localStorage
   - Tap Edit → navigates to /budgeting/edit/:id
   - Tap Delete → confirmation dialog → removes budget from localStorage
   - Tap FAB (+) → navigates to /budgeting/new
```

### 5. Budget Planning — Create

```
1. User navigates to /budgeting/new
2. User fills: label (text), items (dynamic rows of name + cost, starts with 2 empty rows)
3. User may add more items (+) or remove items (−, min 1)
4. Total cost auto-calculates as user types
5. User taps "SIMPAN"
6. System validates:
   - label: non-empty
   - at least 1 item with both name and cost filled
   - all filled costs must be numeric
7. If validation fails → show error banner, stop
8. System creates Budget object with { id, label, totalAmount, items[] }
9. System reads existing budgets, appends new one, writes to localStorage
10. System navigates back (-1)
```

### 6. Budget Planning — Edit

```
1. User navigates to /budgeting/edit/:id
2. System finds budget by id in localStorage
3. If not found → renders "Rencana tidak ditemukan"
4. System pre-fills BudgetForm with existing data
5. User modifies fields (same interactions as Create)
6. User taps "PERBARUI"
7. Same validation as Create
8. System updates budget in localStorage (preserving id)
9. System navigates back (-1)
```

### 7. Settings — Manage Profile

```
1. User navigates to /settings
2. User taps "Ubah Nama"
3. ProfileModal opens with current name pre-filled
4. User edits name, taps "Simpan"
5. Validation: name must not be empty
6. System updates userName in settings → localStorage
7. Modal closes
```

### 8. Settings — Toggle Theme

```
1. User navigates to /settings
2. User taps "Ubah Tema (Terang)" or "Ubah Tema (Gelap)"
3. System cycles: light → dark → light
4. System updates theme in settings → localStorage
5. System applies theme immediately via data-theme attribute on <html>
```

### 9. Settings — Change Cycle Start Day

```
1. User navigates to /settings
2. User taps "Ubah Siklus Penghitungan"
3. CycleModal opens with current day pre-filled (1-28)
4. User edits day, taps "Simpan"
5. Validation: must be number between 1-28
6. System updates cycleStartDay in settings → localStorage
7. Modal closes
```

### 10. Settings — Export Data

```
1. User navigates to /settings
2. User taps "Export Data"
3. System reads all 3 storage keys (transactions, budgets, settings)
4. System creates JSON file and triggers browser download
5. Success notification shown
```

### 11. Settings — Import Data

```
1. User navigates to /settings
2. User taps "Import Data"
3. System opens file picker (.json only)
4. User selects a JSON file
5. System parses file, validates JSON
6. System writes each known key (transactions, budgets, settings) to localStorage
7. Success notification → page reloads
8. On parse failure → error notification, no data changed
```

### 12. Settings — Reset All Data

```
1. User navigates to /settings
2. User taps "Reset Data"
3. Confirmation dialog: "Yakin ingin menghapus semua data?"
4. User confirms
5. System clears all localStorage
6. Success notification → page reloads
```

### 13. Settings — Share / About

```
1. User taps "Tentang" → SweetAlert2 modal with app name, version, author
2. User taps "Bagikan" → Web Share API (or clipboard fallback) with app URL
```

### 14. PWA Install (Browser-mediated)

```
1. Browser detects manifest.json with display: standalone
2. Browser fires beforeinstallprompt event (handled by browser default)
3. User may install app via browser's install prompt
4. Installed app opens in standalone window, portrait orientation
```

---

## Business Rules

| Rule ID | Rule | Enforced At |
|---|---|---|
| BR-01 | A transaction amount must be a positive number > 0 | `CashflowForm.validateForm` |
| BR-02 | A transaction must have a non-empty description | `CashflowForm.validateForm` |
| BR-03 | A transaction must have a date | `CashflowForm.validateForm` |
| BR-04 | A transaction must belong to exactly one category | `CashflowForm.validateForm` |
| BR-05 | Transaction type is either `INCOME` or `EXPENSE` (from tab selection) | `AddNewTransaction` page state |
| BR-06 | Transaction IDs are generated using `Date.now()` (not guaranteed globally unique) | `CashflowForm.handleSubmit` |
| BR-07 | A budget plan must have a non-empty label | `BudgetForm.validateBudgetForm` |
| BR-08 | A budget plan must have at least 1 item with both name and cost filled | `BudgetForm.validateBudgetForm` |
| BR-09 | All filled budget item costs must be numeric values | `BudgetForm.validateBudgetForm` |
| BR-10 | Budget items start with `checked: false` | `BudgetForm.handleSubmit` |
| BR-11 | User name cannot be empty when saving | `ProfileModal.handleSave` |
| BR-12 | Cycle start day must be an integer between 1 and 28 (inclusive) | `CycleModal.handleSave` |
| BR-13 | Theme cycles: light → dark → light (no 'system' option in toggle) | `SettingsPage.getNextTheme` |
| BR-14 | Period is calculated from cycleStartDay: current period = [cycleStartDay this/last month, cycleStartDay next/this month) | `HomePage.calculatePeriod` |
| BR-15 | Only transactions within the current cycle period are counted on the dashboard | `HomePage` filter |
| BR-16 | Budget checklist is independent from transactions — checking an item does not affect balance | `BudgetCard` / `BudgetingPage` |
| BR-17 | Data import overwrites existing localStorage values by key | `SettingsPage.handleImport` |
| BR-18 | Data reset clears all localStorage (all keys removed) | `SettingsPage.handleReset` |
| BR-19 | Budget edit preserves the original budget id | `BudgetForm.handleSubmit` (edit mode) |
| BR-20 | Navigation tabs (Pemasukan/Pengeluaran) default to INCOME on HistoryPage, EXPENSE on AddNewTransaction | `HistoryPage` useState, `AddNewTransaction` useState |

---

## Constraints

| Constraint ID | Constraint | Impact |
|---|---|---|
| C-01 | **No backend** — all data lives in the browser's localStorage | Data is device-specific, cleared on browser data wipe, no cross-device sync, max ~5-10MB storage |
| C-02 | **No authentication** — no user identity, no multi-user support | Anyone who opens the app sees the same local data |
| C-03 | **No TypeScript** — all code is JavaScript (JSX) with JSDoc annotations | No compile-time type checking; type errors surface only at runtime |
| C-04 | **No testing infrastructure** — zero test files or frameworks | No automated regression coverage; all validation is manual |
| C-05 | **No CI/CD pipeline** — no GitHub Actions or deployment automation | Build and deploy are manual processes |
| C-06 | **No edit/delete for transactions** — only create is implemented | Users cannot correct or remove mistaken transactions |
| C-07 | **No reactive cross-page sync** — data is re-read from localStorage on each navigation | Changes made on one page are not reflected on another until the user navigates there |
| C-08 | **No nested routing** — all routes are flat | No shared layout wrappers; each page manages its own layout inclusion |
| C-09 | **ID collision risk** — `Date.now()` used for IDs | Two transactions created in the same millisecond could share an ID; `Math.random()` is added for budget item IDs only |
| C-10 | **No read-then-write atomicity** — data is read, mutated, then written with no locking | Concurrent tabs could overwrite each other's changes (last write wins) |
| C-11 | **Deployment subpath** — app is deployed under `/cashplan/` | Must match `base` in vite.config.js; PWA scope and SW paths must align |
| C-12 | **Currency hardcoded to IDR** — `formatRupiah` uses `id-ID` locale | No multi-currency support; user-facing amounts always in Rupiah |
| C-13 | **UI language is Indonesian** — all labels, errors, and notifications | Non-Indonesian users would need translation |
| C-14 | **No environment variables** — no `.env` support, no configurable parameters | All configuration is hardcoded (base path, PWA scope, etc.) |
