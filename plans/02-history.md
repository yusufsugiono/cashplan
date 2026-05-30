# Plan: History (Riwayat)

## Deskripsi

Halaman riwayat transaksi yang menampilkan daftar semua transaksi (income/expense) dengan filter tab. Setiap item menampilkan tanggal, kategori/deskripsi, dan nominal.

## Referensi Desain

- AppBar: "Riwayat" dengan back button
- PillButton group: INCOME | EXPENSE (filter)
- List transaksi: setiap item menampilkan tanggal (format: "10 Apr 2026"), deskripsi/kategori, dan nominal (format Rupiah)
- Bottom navigation tetap tampil

## Struktur File

```
src/
├── features/
│   └── history/
│       ├── TransactionList.jsx     # Container list transaksi
│       └── TransactionItem.jsx     # Single item transaksi
├── pages/
│   └── HistoryPage.jsx             # Halaman riwayat
└── lib/
    └── date.js                     # Format tanggal ke locale Indonesia
```

## Steps

### Step 1: Buat utility format date

Buat file `src/lib/date.js`:

```js
export function formatDateID(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}
```

### Step 2: Buat komponen TransactionItem

Buat file `src/features/history/TransactionItem.jsx`:

- Props: `date` (string), `description` (string), `amount` (number)
- Layout: flex row
  - Kiri: tanggal (formatted) + deskripsi di bawahnya
  - Kanan: nominal (formatted Rupiah)
- Gunakan `formatDateID()` dari `src/lib/date.js`
- Gunakan `formatRupiah()` dari `src/lib/currency.js`

### Step 3: Buat komponen TransactionList

Buat file `src/features/history/TransactionList.jsx`:

- Props: `transactions` (array of objects), `filter` (string: 'INCOME' | 'EXPENSE')
- Filter array berdasarkan `filter` prop
- Map dan render `TransactionItem` untuk setiap transaksi
- Jika list kosong, tampilkan pesan "Belum ada transaksi"

### Step 4: Buat halaman HistoryPage

Buat file `src/pages/HistoryPage.jsx`:

- Import: AppBar, PillButtonGroup, PillButton, TransactionList, BottomNav
- State: `activeTab` (default: 'INCOME')
- Data dummy sementara:

```js
const dummyTransactions = [
  { id: 1, date: '2026-04-10', description: 'Gajian', amount: 5000000, type: 'INCOME' },
  { id: 2, date: '2026-03-10', description: 'Gajian', amount: 5000000, type: 'INCOME' },
  { id: 3, date: '2026-02-10', description: 'Gajian', amount: 5000000, type: 'INCOME' },
];
```

- Render:
  1. AppBar dengan icon back dan title "Riwayat"
  2. PillButtonGroup dengan tab INCOME / EXPENSE
  3. TransactionList dengan filter berdasarkan activeTab
  4. BottomNav

### Step 5: Update App.jsx routes

Tambahkan route:

```jsx
import HistoryPage from './pages/HistoryPage';

<Route path="/history" element={<HistoryPage />} />
```

### Step 6: Verifikasi

- Jalankan `npm run build` — pastikan tidak ada error
- Jalankan `npm run format` — pastikan formatting konsisten
- Cek visual: tab filter berfungsi, list tampil dengan format tanggal dan Rupiah yang benar
- Cek bahwa switching tab memfilter data dengan benar

## Notes

- Data sementara hardcoded. Nanti akan diganti dengan data dari localStorage.
- Desain menunjukkan list sederhana tanpa pagination — untuk MVP ini cukup render semua.
- Jika nanti data banyak, pertimbangkan virtualized list atau pagination.
- Back button di AppBar harus navigate ke HomePage (`useNavigate`).
