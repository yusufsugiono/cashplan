# Component Contracts: Statistik Tab

> Phase 1 output — component props interfaces untuk komponen baru.

---

## PeriodSelector

```jsx
/**
 * Komponen untuk memilih periode statistik.
 * Menggunakan pola PillButtonGroup + PillButton yang sudah ada.
 *
 * @param {{ selected: string, onChange: (period: string) => void }} props
 */
<PeriodSelector
  selected={'current' | 'previous' | 'last3'}
  onChange={(period) => setSelectedPeriod(period)}
/>
```

**Default**: `selected = 'current'`

**Options**:
| Value | Label |
|---|---|
| `current` | "Periode Ini" |
| `previous` | "Periode Lalu" |
| `last3` | "3 Periode" |

---

## ComparisonChart (Donut)

```jsx
/**
 * SVG donut chart perbandingan Pemasukan vs Pengeluaran.
 *
 * @param {{ totalIncome: number, totalExpense: number }} props
 */
<ComparisonChart
  totalIncome={number}
  totalExpense={number}
/>
```

**Renders**:
- SVG lingkaran dengan dua warna (income = `var(--color-primary)`, expense = `var(--color-danger)`)
- Persentase di tengah donut (misal: "60% / 40%")
- Legend: label + nominal masing-masing di bawah donut
- Jika salah satu 0: donut tetap 100% satu warna

---

## ExpenseChart / IncomeChart

```jsx
/**
 * Horizontal bar chart untuk pengeluaran atau pemasukan per kategori.
 *
 * @param {{
 *   categories: Array<{ name: string, amount: number, percentage: number }>,
 *   onCategoryClick?: (category: string | null) => void
 * }} props
 */
<ExpenseChart
  categories={[
    { name: 'Food & Drinks', amount: 1000000, percentage: 40 },
    { name: 'Transportation', amount: 500000, percentage: 20 },
  ]}
  onCategoryClick={(categoryName) => handleFilter(categoryName)}
/>
```

**Renders**:
- Total nominal keseluruhan di bagian atas
- Setiap bar: nama kategori, bar proporsional (CSS width: X%), nominal Rupiah
- Diurutkan dari amount terbesar ke terkecil
- Jika `onCategoryClick` diberikan: bar bersifat clickable (toggle filter)

**Empty state**: Jika `categories` kosong, tampilkan "Belum ada transaksi pengeluaran/pemasukan"

---

## HistoryPage (Modified)

State tambahan di HistoryPage:

```jsx
export default function HistoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('INCOME');       // existing
  const [selectedPeriod, setSelectedPeriod] = useState('current'); // baru
  const [selectedCategory, setSelectedCategory] = useState(null);  // baru

  const transactions = loadFromStorage(STORAGE_KEYS.TRANSACTIONS);
  const settings = loadSettings();

  // Hitung periode dan filter transaksi
  const { filteredTransactions, chartData } = useChartData(
    transactions, settings.cycleStartDay, selectedPeriod, selectedCategory
  );

  // ...
}
```
