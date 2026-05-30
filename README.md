# Finance Tracker

Aplikasi pencatat keuangan pribadi untuk tracking pengeluaran dan pemasukan harian.

## Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS 3 + CSS Custom Properties
- **Routing:** React Router DOM 7
- **Icons:** React Icons
- **Linting:** ESLint 10
- **Formatting:** Prettier

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Format code
npm run format

# Check formatting
npm run format:check

# Lint
npm run lint
```

## Project Structure

```
src/
├── assets/                  # Static assets
│   ├── fonts/               # Self-hosted fonts (Inter variable)
│   └── styles/              # Global CSS (Tailwind directives, CSS variables, reset)
│
├── components/              # Shared/reusable components
│   └── ui/                  # Generic UI primitives (tidak terikat fitur tertentu)
│       ├── Input.jsx        # Text input dengan label
│       ├── Select.jsx       # Dropdown select dengan label
│       ├── PillButton.jsx   # Toggle button berbentuk pill
│       └── PillButtonGroup.jsx  # Container untuk PillButton
│
├── constants/               # App-wide constants dan static data
│   └── categories.js       # Daftar kategori expense & income
│
├── features/                # Feature-based modules (grouped by domain)
│   └── transactions/        # Semua yang terkait fitur transaksi
│       └── CashflowForm.jsx # Form untuk input transaksi baru
│
├── hooks/                   # Custom React hooks
│
├── layouts/                 # Layout/structural components
│   └── AppBar.jsx           # Top navigation bar dengan back button
│
├── lib/                     # Utility functions, helpers, formatters
│
├── pages/                   # Route-level page components (1 file = 1 route)
│   └── AddNewTransaction.jsx
│
├── App.jsx                  # Root component, route definitions
└── main.jsx                 # Entry point, providers (BrowserRouter, StrictMode)
```

## Architecture Guidelines

Panduan untuk menentukan di mana kode baru harus diletakkan:

### `components/ui/`
Komponen UI generik yang **tidak memiliki business logic** dan bisa dipakai di mana saja.
- Contoh: Button, Input, Modal, Card, Badge
- Tidak boleh import dari `features/` atau `pages/`
- Props-driven, stateless atau minimal local state

### `features/<nama-fitur>/`
Komponen dan logic yang **spesifik ke satu fitur/domain**.
- Contoh: `features/transactions/`, `features/budget/`, `features/reports/`
- Boleh import dari `components/ui/`, `constants/`, `lib/`, `hooks/`
- Jika sebuah fitur punya sub-components, constants, atau hooks sendiri, letakkan di dalam folder fitur tersebut

### `layouts/`
Komponen **structural** yang membentuk kerangka halaman.
- Contoh: AppBar, Sidebar, BottomNav, PageWrapper
- Tidak mengandung business logic, hanya layout concern

### `pages/`
Komponen **top-level per route**. Tugasnya meng-compose layout + features.
- 1 file = 1 route
- Boleh import dari semua folder lain
- Mengatur state yang perlu di-share antar komponen di halaman tersebut

### `constants/`
Data statis dan konfigurasi yang dipakai lintas fitur.
- Contoh: category lists, enum values, route paths, config keys
- Pure data, tidak ada logic

### `hooks/`
Custom React hooks yang dipakai lintas fitur.
- Contoh: `useLocalStorage`, `useMediaQuery`, `useDebounce`
- Jika hook hanya dipakai oleh satu fitur, letakkan di dalam folder fitur tersebut

### `lib/`
Utility functions murni (non-React) yang dipakai lintas fitur.
- Contoh: `formatCurrency()`, `formatDate()`, `generateId()`
- Pure functions, tidak ada React-specific code

## Theming

Aplikasi menggunakan CSS Custom Properties untuk theming. Mendukung:
- Light mode (default)
- Dark mode (otomatis via `prefers-color-scheme` atau manual via `data-theme="dark"`)

Variabel warna didefinisikan di `src/assets/styles/main.css`.

## Conventions

- **Naming:** PascalCase untuk komponen, camelCase untuk functions/variables, UPPER_SNAKE_CASE untuk constants
- **Exports:** Default export untuk komponen, named export untuk constants dan utilities
- **Formatting:** Diatur oleh Prettier (single quotes, trailing commas, 100 char width)
- **Self-closing tags:** Gunakan `<Component />` bukan `<Component></Component>` jika tidak ada children
