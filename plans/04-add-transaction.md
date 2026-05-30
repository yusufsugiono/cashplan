# Plan: Add New Transaction (Tambah Catatan)

## Status: ✅ Selesai

## Deskripsi

Halaman form untuk menambah transaksi baru (pengeluaran atau pemasukan). User memilih tipe transaksi via tab, lalu mengisi form dan menyimpan.

## Referensi Desain

- AppBar: "Tambah Catatan" dengan back button
- PillButton group: INCOME | EXPENSE (toggle tipe transaksi)
- Form fields:
  - Income/Expense Amount (text, inputMode: tel)
  - Description (text)
  - Date (date picker, format: dd/mm/yyyy)
  - Income/Expense Category (dropdown select)
- Tombol "SIMPAN" di bawah form

## Implementasi Saat Ini

```
src/
├── features/transactions/CashflowForm.jsx   ✅
├── components/ui/Input.jsx                  ✅
├── components/ui/Select.jsx                 ✅
├── components/ui/PillButton.jsx             ✅
├── components/ui/PillButtonGroup.jsx        ✅
├── layouts/AppBar.jsx                       ✅
├── constants/categories.js                  ✅
└── pages/AddNewTransaction.jsx              ✅
```

## Review & Saran Perbaikan

### 1. ⚠️ Form belum fungsional
- Belum ada `onSubmit` handler
- Belum ada state management untuk form values
- Belum ada validasi (required fields, format amount)

**Action:** Tambahkan form handling:
- Gunakan `useState` atau `useReducer` untuk form state
- Tambahkan `onSubmit` handler yang prevent default + kumpulkan data
- Simpan ke localStorage (sementara)
- Navigate back setelah save

### 2. ⚠️ Label belum sesuai desain
- Desain menunjukkan label dalam Bahasa Indonesia: "Tambah Catatan"
- Kode saat ini: "New Transaction"
- Tombol submit di desain: "SIMPAN", kode saat ini: "Save"

**Action:** Sesuaikan teks ke Bahasa Indonesia sesuai desain.

### 3. ⚠️ Back button belum fungsional
- AppBar render icon tapi belum ada `onClick` handler
- Perlu `useNavigate()` untuk navigate back

**Action:** Tambahkan prop `onBack` di AppBar atau gunakan `useNavigate(-1)` di dalam AppBar.

### 4. ✅ Struktur sudah benar
- Kategori sudah diekstrak ke constants
- Komponen UI sudah reusable
- Tab switching sudah berfungsi

### 5. ⚠️ Route perlu diupdate
- Saat ini di-mount di `/` (root)
- Seharusnya di `/transactions/new` setelah HomePage dibuat

**Action:** Pindahkan route ke `/transactions/new` saat HomePage sudah ready.

## Steps Lanjutan (Untuk Melengkapi)

### Step 1: Update teks ke Bahasa Indonesia

Di `src/pages/AddNewTransaction.jsx`:
- AppBar title: "New Transaction" → "Tambah Catatan"

Di `src/features/transactions/CashflowForm.jsx`:
- Button submit: "Save" → "SIMPAN"

### Step 2: Tambahkan form state dan handler

Di `src/features/transactions/CashflowForm.jsx`:
- Tambahkan state: `formData` object dengan keys: amount, description, date, category
- Tambahkan `onChange` handler untuk setiap input
- Tambahkan `onSubmit` handler di `<form>`
- Untuk sementara, simpan ke localStorage dengan key `transactions`

### Step 3: Tambahkan validasi dasar

- Amount: required, harus angka
- Description: required
- Date: required
- Category: required (default option "Pilih kategori" yang disabled)

### Step 4: Fungsikan back button

Update `src/layouts/AppBar.jsx`:
- Tambahkan prop `onBack` (function)
- Atau gunakan `useNavigate` langsung di dalam AppBar

### Step 5: Verifikasi

- Jalankan `npm run build` — pastikan tidak ada error
- Jalankan `npm run format`
- Test: isi form → submit → cek localStorage → navigate back
