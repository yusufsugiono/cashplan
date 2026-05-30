# Plan: Homepage

## Status: ✅ Selesai

## Deskripsi

Halaman utama yang menampilkan ringkasan keuangan pengguna: saldo, total pemasukan, dan total pengeluaran dalam periode tertentu. Terdapat greeting, summary cards, dan bottom navigation.

## Referensi Desain

- Greeting: "Selamat Datang, [Nama]" + teks periode (contoh: "1 Apr 2026 hingga 1 Mei 2026")
- 3 summary cards: Saldo, Pemasukan, Pengeluaran (masing-masing dengan icon dan nominal Rp)
- Bottom navigation: 4 menu (Homepage, Budgeting, History, Setting) + FAB button di tengah (Add New Transaction)

## Struktur File

```
src/
├── features/
│   └── dashboard/
│       ├── SummaryCard.jsx        # Card untuk saldo/pemasukan/pengeluaran
│       └── Greeting.jsx           # Komponen greeting + periode
├── layouts/
│   └── BottomNav.jsx              # Bottom navigation bar
├── pages/
│   └── HomePage.jsx               # Halaman utama
├── constants/
│   └── routes.js                  # Definisi route paths
└── lib/
    └── currency.js                # Format angka ke Rupiah
```

## Steps

### Step 1: Buat utility format currency

Buat file `src/lib/currency.js`:

```js
export function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
```

### Step 2: Buat constants routes

Buat file `src/constants/routes.js`:

```js
export const ROUTES = {
  HOME: '/',
  BUDGETING: '/budgeting',
  ADD_TRANSACTION: '/transactions/new',
  HISTORY: '/history',
  SETTINGS: '/settings',
};
```

### Step 3: Buat komponen Greeting

Buat file `src/features/dashboard/Greeting.jsx`:

- Props: `name` (string), `periodStart` (string), `periodEnd` (string)
- Tampilkan "Selamat Datang," di baris pertama
- Nama user di baris kedua (font bold/medium)
- Teks periode di baris ketiga (font kecil, warna muted)
- Contoh teks periode: "Berikut adalah rincian cashflow catatan periode 1 Apr 2026 hingga 1 Mei 2026"

### Step 4: Buat komponen SummaryCard

Buat file `src/features/dashboard/SummaryCard.jsx`:

- Props: `icon` (React component), `label` (string), `amount` (number)
- Layout: icon di kiri, label + amount di kanan
- Gunakan `formatRupiah()` dari `src/lib/currency.js` untuk format nominal
- Styling: border, rounded, padding, flex row

### Step 5: Buat komponen BottomNav

Buat file `src/layouts/BottomNav.jsx`:

- 5 slot: 4 menu icons + 1 FAB button di tengah
- Menu items: Home (1), Budgeting (2), [FAB +], History (3), Setting (4)
- FAB button: bulat, lebih besar, navigasi ke `/transactions/new`
- Gunakan `react-router-dom` `useNavigate` atau `Link` untuk navigasi
- Highlight active menu berdasarkan current route (`useLocation`)
- Fixed di bottom viewport

### Step 6: Buat halaman HomePage

Buat file `src/pages/HomePage.jsx`:

- Import Greeting, SummaryCard, BottomNav
- Untuk sementara, gunakan data dummy (hardcoded):
  - name: "Yusuf Sugiono"
  - saldo: 10000000
  - pemasukan: 15000000
  - pengeluaran: 5000000
- Render 3 SummaryCard (Saldo, Pemasukan, Pengeluaran)
- Wrap dengan layout yang menyisakan space untuk BottomNav

### Step 7: Update App.jsx routes

Tambahkan route baru di `src/App.jsx`:

```jsx
import HomePage from './pages/HomePage';

<Route path="/" element={<HomePage />} />
<Route path="/transactions/new" element={<AddNewTransaction />} />
```

### Step 8: Verifikasi

- Jalankan `npm run build` — pastikan tidak ada error
- Jalankan `npm run format` — pastikan formatting konsisten
- Cek visual: greeting tampil, 3 cards tampil dengan format Rupiah, bottom nav tampil fixed di bawah

## Notes

- Data sementara hardcoded. Nanti akan diganti dengan data dari localStorage atau state management.
- Bottom navigation akan dipakai di semua halaman kecuali Add New Transaction (yang pakai AppBar dengan back button).
- Periode saat ini hardcoded. Nanti akan dinamis berdasarkan setting siklus penghitungan.
