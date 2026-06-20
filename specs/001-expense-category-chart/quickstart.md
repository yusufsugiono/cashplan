# Quickstart: Statistik Tab dengan Chart per Kategori

> Phase 1 output — validation scenarios untuk menguji fitur secara manual.

---

## Prerequisites

- `npm install` sudah dijalankan
- Dev server berjalan: `npm run dev`
- Browser terbuka ke `/cashplan/`

## Setup Data Test

Sebelum testing, tambahkan beberapa transaksi dengan kategori variatif:

1. Buka halaman Tambah Transaksi (`/transactions/new`)
2. Tambahkan transaksi **pengeluaran**:
   - Food & Drinks: 3x (masing-masing Rp50.000, Rp75.000, Rp100.000)
   - Transportation: 2x (Rp20.000, Rp30.000)
   - Bills & Utilities: 1x (Rp500.000)
   - Entertainment: 1x (Rp150.000)
3. Tambahkan transaksi **pemasukan**:
   - Main Salary: 1x (Rp5.000.000)
   - Freelance: 1x (Rp1.500.000)
4. Pastikan beberapa transaksi dibuat dengan tanggal berbeda (sebagian di luar periode aktif)

## Test Scenarios

### S1: Tab Statistik Muncul

1. Buka halaman Riwayat (`/history`)
2. ✅ Verifikasi ada 3 tab: [Pemasukan] [Pengeluaran] [Statistik]
3. Tekan tab "Statistik"

### S2: Donut Chart Perbandingan

1. ✅ Donut chart muncul di bagian paling atas dengan dua warna
2. ✅ Persentase terlihat (misal: Expense 15%, Income 85%)
3. ✅ Nominal total masing-masing terlihat di legend bawah donut
4. ✅ Total donut (income + expense) sama dengan absolut semua transaksi

### S3: Bar Chart Pengeluaran per Kategori

1. ✅ Bar chart "Pengeluaran per Kategori" muncul setelah donut
2. ✅ Kategori diurutkan: Bills (Rp500.000) → Entertainment (Rp150.000) → Food (Rp225.000) → Transportation (Rp50.000)
3. ✅ Setiap bar menampilkan nama kategori, nominal, dan bar proporsional
4. ✅ Total pengeluaran keseluruhan terlihat di bagian atas

### S4: Bar Chart Pemasukan per Kategori

1. ✅ Bar chart "Pemasukan per Kategori" muncul setelah expense chart
2. ✅ Kategori diurutkan: Salary (Rp5.000.000) → Freelance (Rp1.500.000)
3. ✅ Total pemasukan keseluruhan terlihat

### S5: Period Selector

1. ✅ Tiga pill button terlihat: [Periode Ini] [Periode Lalu] [3 Periode]
2. ✅ Default aktif: "Periode Ini"
3. Tekan "Periode Lalu"
4. ✅ Chart berubah — hanya menampilkan data dari periode sebelumnya
5. Tekan "3 Periode"
6. ✅ Chart menampilkan agregasi dari 3 periode terakhir

### S6: Empty State

1. Hapus semua transaksi yang ada (via Settings → Reset Data, atau manual)
2. Buka tab "Statistik"
3. ✅ Semua chart menampilkan state kosong "Belum ada transaksi"

### S7: Filter Kategori (P2)

1. Tambah data test kembali (S0)
2. Tekan bar kategori "Food & Drinks" di chart pengeluaran
3. ✅ Daftar transaksi di bawah chart terfilter hanya menampilkan transaksi food
4. Tekan bar "Food & Drinks" lagi
5. ✅ Filter hilang, semua transaksi expense tampil kembali

### S8: Responsivitas & Scroll

1. ✅ Dengan banyak kategori, halaman bisa di-scroll vertikal tanpa masalah
2. ✅ Semua chart tetap proporsional di layar mobile (320px) dan desktop

## Verification Checklist

- [ ] `npm run lint` — tidak ada error
- [ ] `npm run format:check` — formatting sesuai Prettier
- [ ] `npm run build` — build sukses
- [ ] S1-S8 semua passing
- [ ] Tab Pemasukan dan Pengeluaran yang sudah ada tetap berfungsi normal (regression check)
