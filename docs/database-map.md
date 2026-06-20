# CashPlan — Database Map

## Database Engine

**Browser Web Storage API (`localStorage`)**. All data is stored as JSON strings under string keys. There is no relational database, no IndexedDB, and no backend database.

Transactional guarantee: localStorage operations are synchronous and atomic per `setItem` call, but there is no multi-key transaction support.

## Storage Keys

| Key | Type | Default | Description |
|---|---|---|---|
| `transactions` | `string (JSON Array)` | `[]` | All financial transactions |
| `budgets` | `string (JSON Array)` | `[]` | Budget planning documents |
| `settings` | `string (JSON Object)` | `{}` | User preferences |

## Schema Definitions

### Transaction Object

```
{
  id: number,              // Date.now() — unique per session, collisions possible
  type: 'INCOME' | 'EXPENSE',
  amount: number,          // Positive integer, stored as Number
  description: string,     // Trimmed user input
  date: string,            // YYYY-MM-DD format
  category: string,        // One of category value strings (see constants)
  createdAt: string        // ISO 8601 timestamp of creation
}
```

**Category values** (`EXPENSE`): `food`, `transportation`, `shopping`, `bills`, `entertainment`, `health`, `education`, `housing`, `travel`, `family`, `subscription`, `investment`, `other`

**Category values** (`INCOME`): `salary`, `freelance`, `bonus`, `business`, `selling`, `investmentReturn`, `gift`, `refund`, `passiveIncome`, `other`

### Budget Object

```
{
  id: number,              // Date.now() — unique per session
  label: string,           // Trimmed user input (e.g., "Kebutuhan Bulanan")
  totalAmount: number,     // Sum of all item amounts, computed
  items: [
    {
      id: number,          // Date.now() + Math.random()
      name: string,        // Item name
      amount: number,      // Item cost
      checked: boolean     // Whether item is marked as paid
    }
  ]
}
```

### Settings Object

```
{
  userName: string,        // Empty string by default
  theme: 'light' | 'dark', // 'light' by default (UI also supports 'system' via theme removal)
  cycleStartDay: number    // 1-28, default 1
}
```

**Default settings** (applied by `loadSettings()` via spread merge):
```
{ userName: '', theme: 'light', cycleStartDay: 1 }
```

## Data Relationships

```
Settings.cycleStartDay  →  HomePage.calculatePeriod()  →  filters Transaction.date
                                  ↓
                     Determines current billing period window
                                  ↓
                     Computes: balance, totalIncome, totalExpense
```

- `Transaction` and `Budget` are **independent** — no foreign key relationship
- Budget items being `checked` does not deduct from any transaction or balance
- Budget `totalAmount` is computed from items and stored redundantly

## Data Lifecycle

| Operation | Mechanism | Atomicity |
|---|---|---|
| Read all transactions | `loadFromStorage('transactions')` | Single key read |
| Append transaction | Read all → push → write all | Not atomic (read-then-write gap) |
| Read all budgets | `loadFromStorage('budgets')` | Single key read |
| Create/update/delete budget | Read all → mutate → write all | Not atomic |
| Read settings | `loadSettings()` (merge with defaults) | Single key read |
| Write settings | `saveSettings()` → `setItem` | Single key write |
| Export all | `getItem` on all 3 keys → serialize to file | Read-only |
| Import all | Parse file → `setItem` on all 3 keys → reload | Per-key atomic |
| Reset all | `localStorage.clear()` | All keys atomically cleared |

## Queries

There is no query language. All data access patterns are Array methods in JavaScript:

| Query | Implementation | Location |
|---|---|---|
| Transactions in period | `transactions.filter(t => t.date >= start && t.date < end)` | HomePage.jsx:83-85 |
| Sum income in period | `.filter(t => t.type === 'INCOME').reduce(...)` | HomePage.jsx:88-90 |
| Sum expense in period | `.filter(t => t.type === 'EXPENSE').reduce(...)` | HomePage.jsx:92-94 |
| Filter by type | `transactions.filter(item => item.type === filter)` | TransactionList.jsx:12 |
| Find budget by ID | `budgets.find(b => String(b.id) === id)` | EditBudgetPage.jsx:14 |
| Delete budget by ID | `budgets.filter(b => b.id !== budgetId)` | BudgetingPage.jsx:35 |
| Toggle budget item | `budgets.map(...).items.map(...)` | BudgetingPage.jsx:41-55 |
| Sum unchecked items | `items.filter(item => !item.checked).reduce(...)` | BudgetCard.jsx:19-21 |
