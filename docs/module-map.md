# CashPlan — Module Map

## Directory Tree

```
src/
├── main.jsx                          # Entry point
├── App.jsx                           # Root component, route definitions
│
├── assets/
│   ├── fonts/
│   │   ├── Inter-VariableFont_opsz,wght.ttf
│   │   └── Inter-Italic-VariableFont_opsz,wght.ttf
│   └── styles/
│       └── main.css                  # Tailwind directives, CSS reset, theme vars
│
├── components/
│   └── ui/
│       ├── IconButton.jsx            # Button with icon + label + variant
│       ├── Input.jsx                 # Text input with label and error
│       ├── PillButton.jsx            # Toggle pill button
│       ├── PillButtonGroup.jsx       # Horizontal pill button container
│       └── Select.jsx                # Dropdown with label and error
│
├── constants/
│   ├── categories.js                 # EXPENSE_CATEGORIES (13), INCOME_CATEGORIES (10)
│   └── routes.js                     # ROUTES object (7 paths)
│
├── features/
│   ├── budgeting/
│   │   ├── BudgetCard.jsx            # Budget plan card with checklist
│   │   ├── BudgetForm.jsx            # Create/edit budget form
│   │   ├── BudgetItem.jsx            # Single checklist row in card
│   │   └── BudgetItemInput.jsx       # Name + cost input row in form
│   │
│   ├── dashboard/
│   │   ├── Greeting.jsx              # Welcome banner with period info
│   │   └── SummaryCard.jsx           # Balance/income/expense display card
│   │
│   ├── history/
│   │   ├── TransactionItem.jsx       # Single transaction row
│   │   └── TransactionList.jsx       # Filtered transaction list
│   │
│   ├── settings/
│   │   ├── CycleModal.jsx            # Cycle start day modal
│   │   ├── ProfileModal.jsx          # User name edit modal
│   │   ├── SettingsMenu.jsx          # Settings menu container
│   │   └── SettingsMenuItem.jsx      # Single menu item row
│   │
│   └── transactions/
│       └── CashflowForm.jsx          # Income/expense transaction form
│
├── hooks/                            # Empty (placeholder)
│
├── layouts/
│   ├── AppBar.jsx                    # Top bar with back button
│   └── BottomNav.jsx                 # Fixed bottom navigation + FAB
│
├── lib/
│   ├── currency.js                   # formatRupiah, formatThousand, parseThousand
│   ├── date.js                       # formatDateID
│   └── storage.js                    # loadFromStorage, saveToStorage, loadSettings, saveSettings
│
└── pages/
    ├── AddBudgetPage.jsx             # /budgeting/new
    ├── AddNewTransaction.jsx         # /transactions/new
    ├── BudgetingPage.jsx             # /budgeting
    ├── EditBudgetPage.jsx            # /budgeting/edit/:id
    ├── HistoryPage.jsx               # /history
    ├── HomePage.jsx                  # /
    └── SettingsPage.jsx              # /settings

public/
├── icons/
│   ├── apple-icon-180.png
│   ├── manifest-icon-192.maskable.png
│   └── manifest-icon-512.maskable.png
├── CashPlan.png
├── icons.svg
├── manifest.json                     # PWA manifest
└── sw.js                             # Service worker
```

## Module Responsibilities

| Module | Responsibility | Imports From |
|---|---|---|
| pages/* | Compose features + layouts for each route | features, layouts, lib, constants |
| features/dashboard | Home page widgets (greeting, summary cards) | lib, components/ui |
| features/transactions | Income/expense form submission | lib, constants, components/ui |
| features/history | Filtered transaction display | lib, components/ui |
| features/budgeting | Budget plan CRUD with checklist | lib, components/ui |
| features/settings | User preferences (name, theme, cycle, export/import/reset) | lib |
| layouts/* | Structural chrome (top bar, bottom nav) | constants, components/ui |
| components/ui/* | Reusable presentational components | none (pure React + CSS) |
| lib/* | Pure utility functions (no React) | none |
| constants/* | Static data (routes, categories) | none |

## Dependency Flow

```
pages
├── features (dashboard, transactions, history, budgeting, settings)
│   ├── components/ui
│   ├── lib
│   ├── constants
│   └── (other features) ← NOT ALLOWED
├── layouts
│   ├── components/ui
│   ├── constants
│   └── lib
├── lib
└── constants

features → lib, constants, components/ui
layouts → lib, constants, components/ui
components/ui → (no internal imports)
lib → (no internal imports)
constants → (no internal imports)
```
