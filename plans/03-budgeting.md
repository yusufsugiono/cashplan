# Plan: Budgeting (Perencanaan)

## Status: ✅ Selesai

## Deskripsi

Halaman perencanaan budget yang menampilkan daftar rencana pengeluaran. Setiap rencana memiliki label, total budget, dan daftar item (checklist). User bisa menambah rencana baru melalui form terpisah.

## Referensi Desain

### Halaman List Perencanaan
- AppBar: "Perencanaan" dengan back button
- Cards per rencana:
  - Header: label rencana + total nominal (contoh: "Kebutuhan Bulanan Rp2.000.000")
  - Body: checklist items dengan nama + nominal (contoh: "☐ Bayar Listrik Rp30.000")
  - Footer: tombol "Hapus"
- FAB button (+) di bottom right untuk tambah rencana baru

### Halaman Tambah Rencana
- AppBar: "Tambah Rencana" dengan back button
- Form fields:
  - Label (text input)
  - Dynamic items: setiap item punya field "Item" (nama) + "Biaya" (nominal)
  - Tombol (+) untuk tambah item baru
  - Tombol (-) untuk hapus item
- Tombol "SIMPAN" di bawah

## Struktur File

```
src/
├── features/
│   └── budgeting/
│       ├── BudgetCard.jsx          # Card satu rencana budget
│       ├── BudgetItem.jsx          # Single checklist item dalam card
│       ├── BudgetForm.jsx          # Form tambah rencana baru
│       └── BudgetItemInput.jsx     # Input row untuk item + biaya di form
├── pages/
│   ├── BudgetingPage.jsx           # Halaman list perencanaan
│   └── AddBudgetPage.jsx           # Halaman form tambah rencana
```

## Steps

### Step 1: Buat komponen BudgetItem

Buat file `src/features/budgeting/BudgetItem.jsx`:

- Props: `name` (string), `amount` (number), `checked` (boolean), `onToggle` (function)
- Layout: flex row dengan checkbox di kiri, nama di tengah, nominal di kanan
- Checkbox menggunakan native `<input type="checkbox" />`
- Gunakan `formatRupiah()` untuk format nominal

### Step 2: Buat komponen BudgetCard

Buat file `src/features/budgeting/BudgetCard.jsx`:

- Props: `label` (string), `totalAmount` (number), `items` (array), `onDelete` (function), `onToggleItem` (function)
- Layout:
  - Header: label (bold) + total amount (formatted Rupiah)
  - Body: map `items` ke `BudgetItem`
  - Footer: tombol "Hapus" (outlined/bordered style)
- Styling: card dengan border, rounded, padding

### Step 3: Buat komponen BudgetItemInput

Buat file `src/features/budgeting/BudgetItemInput.jsx`:

- Props: `index` (number), `item` (object: {name, cost}), `onChange` (function), `onRemove` (function)
- Layout: 2 input fields dalam satu row
  - Input "Item" (text) — nama item
  - Input "Biaya" (text, inputMode: tel) — nominal
  - Tombol (-) untuk hapus row ini
- `onChange` dipanggil dengan `(index, field, value)`

### Step 4: Buat komponen BudgetForm

Buat file `src/features/budgeting/BudgetForm.jsx`:

- State: `label` (string), `items` (array of {name, cost})
- Initial state: 2 item kosong
- Render:
  - Input "Label" untuk nama rencana
  - Map `items` ke `BudgetItemInput`
  - Tombol (+) untuk tambah item baru ke array
  - Tombol "SIMPAN" (submit)
- Handler:
  - `handleAddItem`: push item kosong ke array
  - `handleRemoveItem(index)`: hapus item di index tertentu
  - `handleItemChange(index, field, value)`: update field item
  - `handleSubmit`: kumpulkan data, simpan (sementara console.log), navigate back

### Step 5: Buat halaman BudgetingPage

Buat file `src/pages/BudgetingPage.jsx`:

- Import: AppBar, BudgetCard, BottomNav
- Data dummy sementara:

```js
const dummyBudgets = [
  {
    id: 1,
    label: 'Kebutuhan Bulanan',
    totalAmount: 2000000,
    items: [
      { id: 1, name: 'Bayar Listrik', amount: 30000, checked: false },
      { id: 2, name: 'Beli Pulsa', amount: 30000, checked: false },
    ],
  },
  {
    id: 2,
    label: 'Liburan',
    totalAmount: 750000,
    items: [
      { id: 3, name: 'Tiket Bus', amount: 30000, checked: false },
      { id: 4, name: 'Tiket Kereta', amount: 30000, checked: false },
    ],
  },
];
```

- Render:
  1. AppBar dengan title "Perencanaan"
  2. Map `dummyBudgets` ke `BudgetCard`
  3. FAB button (+) fixed di bottom right, navigate ke `/budgeting/new`
  4. BottomNav

### Step 6: Buat halaman AddBudgetPage

Buat file `src/pages/AddBudgetPage.jsx`:

- Import: AppBar, BudgetForm
- Render:
  1. AppBar dengan icon back dan title "Tambah Rencana"
  2. BudgetForm
- Tidak perlu BottomNav (halaman form, pakai AppBar back button)

### Step 7: Update App.jsx routes

Tambahkan routes:

```jsx
import BudgetingPage from './pages/BudgetingPage';
import AddBudgetPage from './pages/AddBudgetPage';

<Route path="/budgeting" element={<BudgetingPage />} />
<Route path="/budgeting/new" element={<AddBudgetPage />} />
```

### Step 8: Verifikasi

- Jalankan `npm run build` — pastikan tidak ada error
- Jalankan `npm run format` — pastikan formatting konsisten
- Cek visual:
  - BudgetingPage: cards tampil dengan items dan tombol hapus
  - AddBudgetPage: form dengan dynamic items bisa ditambah/dihapus
  - Navigasi antara list dan form berfungsi
  - FAB button navigasi ke form tambah rencana

## Notes

- Data sementara hardcoded. Nanti akan diganti dengan localStorage.
- `totalAmount` di desain terlihat sebagai jumlah yang di-set manual oleh user (bukan sum dari items). Pertimbangkan apakah ini manual input atau auto-calculated.
- Checkbox toggle sementara hanya update local state. Nanti akan persist ke storage.
- Tombol "Hapus" di card akan menghapus seluruh rencana (confirm dialog disarankan).
