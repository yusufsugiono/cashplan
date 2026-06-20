# Data Model: Statistik Tab dengan Chart per Kategori

> Phase 1 output — entities, relationships, validation rules.

---

## 1. Existing Entities (Tidak Berubah)

### Transaction

| Field | Type | Description |
|---|---|---|
| `id` | number | `Date.now()` — unique per session |
| `type` | `'INCOME' \| 'EXPENSE'` | Jenis transaksi |
| `amount` | number | Nominal (positive integer) |
| `description` | string | Deskripsi (trimmed) |
| `date` | string | Format `YYYY-MM-DD` |
| `category` | string | Nilai dari EXPENSE_CATEGORIES atau INCOME_CATEGORIES |
| `createdAt` | string | ISO 8601 timestamp |

**Storage key**: `transactions` (via `STORAGE_KEYS.TRANSACTIONS`)

### Settings

| Field | Type | Default | Description |
|---|---|---|---|
| `userName` | string | `''` | Nama pengguna |
| `theme` | `'light' \| 'dark'` | `'light'` | Tema aplikasi |
| `cycleStartDay` | number | `1` | Tanggal mulai siklus (1-28) |

**Storage key**: `settings` (via `STORAGE_KEYS.SETTINGS`)

---

## 2. New Utility: PeriodCalculator

**File**: `src/lib/period.js`

### Function Signature

```js
/**
 * Menghitung tanggal awal dan akhir periode berdasarkan cycleStartDay dan offset.
 *
 * @param {number} cycleStartDay - Tanggal mulai siklus (1-28)
 * @param {number} [offset=0] - Offset periode:
 *   0 = periode aktif saat ini
 *  -1 = satu periode sebelumnya
 *  -2 = dua periode sebelumnya
 * @returns {{ startRaw: string, endRaw: string }}
 *   startRaw - Tanggal awal periode (YYYY-MM-DD)
 *   endRaw   - Tanggal akhir periode (YYYY-MM-DD, exclusive)
 */
export function calculatePeriod(cycleStartDay, offset = 0) {
  // ...
}
```

### Logic

```
1. Tentukan "bulan referensi" = bulan sekarang + offset
   - offset 0  → bulan ini
   - offset -1 → bulan lalu
   - offset -2 → 2 bulan lalu
2. Tentukan apakah tanggal hari ini >= cycleStartDay di bulan referensi
3. Jika ya:
   - start = cycleStartDay di bulan referensi
   - end   = cycleStartDay di bulan berikutnya
4. Jika tidak:
   - start = cycleStartDay di bulan sebelumnya
   - end   = cycleStartDay di bulan referensi
5. Return { startRaw, endRaw } dalam format YYYY-MM-DD
```

### Behavior for "3 Periode"

Agregasi data dari 3 panggilan `calculatePeriod()`:
- `calculatePeriod(cycleStartDay, 0)` → periode ini
- `calculatePeriod(cycleStartDay, -1)` → periode lalu
- `calculatePeriod(cycleStartDay, -2)` → 2 periode lalu

Filter transaksi: `t.date >= minStart && t.date < maxEnd` dari ketiga periode.

---

## 3. Component Data Flow

```
HistoryPage (local state)
├── activeTab: 'INCOME' | 'EXPENSE' | 'STATISTICS'   (existing + baru)
├── selectedPeriod: 'current' | 'previous' | 'last3'  (baru)
├── selectedCategory: string | null                    (baru - untuk filter)
│
├── [tab = STATISTICS]
│   ├── PeriodSelector
│   │   props: { selected, onChange }
│   │
│   ├── ComparisonChart (donut)
│   │   props: { totalIncome, totalExpense }
│   │   data: dari computeChartData(transactions, selectedPeriod)
│   │
│   ├── ExpenseChart
│   │   props: { categories: [{ name, amount, percentage }], onCategoryClick }
│   │   data: dari groupByCategory(transactions, 'EXPENSE')
│   │
│   └── IncomeChart
│       props: { categories: [{ name, amount, percentage }], onCategoryClick }
│       data: dari groupByCategory(transactions, 'INCOME')
│
└── [tab = INCOME | EXPENSE]
    └── TransactionList (existing, dengan filter selectedCategory)
```

### Helper Functions (inline di HistoryPage atau di file baru `src/features/history/chartUtils.js`)

```js
/**
 * Mengelompokkan transaksi per kategori dan menjumlahkan nominal.
 * @param {Array} transactions - Array transaksi yang sudah difilter periode
 * @param {'INCOME'|'EXPENSE'} type - Tipe transaksi
 * @returns {Array<{ category: string, amount: number }>}
 */
function groupByCategory(transactions, type) { ... }

/**
 * Menghitung data untuk donut chart.
 * @param {Array} transactions - Array transaksi yang sudah difilter periode
 * @returns {{ totalIncome: number, totalExpense: number }}
 */
function computeComparison(transactions) { ... }
```

---

## 4. Validation Rules

| Rule | Source | Diterapkan di |
|---|---|---|
| Kategori harus valid (sesuai EXPENSE_CATEGORIES / INCOME_CATEGORIES) | Existing data | Saat grouping — data invalid diabaikan |
| Total bar chart == total keseluruhan | SC-003, SC-004, SC-005 | Verifikasi manual |
| Period offset hanya 0, -1, -2 | FR-009, FR-010, FR-011 | PeriodSelector |
