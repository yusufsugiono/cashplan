# Feature Specification: Statistik Tab dengan Chart per Kategori

**Feature Branch**: `001-expense-category-chart`

**Created**: 2026-06-20

**Status**: Draft

**Input**: User description: "Pada halaman riwayat, tambahkan tab statistik dengan chart pengeluaran per kategori, chart pemasukan per kategori, pie chart perbandingan, dan pengguna dapat memilih periode (periode ini, periode sebelumnya, atau 3 periode)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Lihat Ringkasan & Rincian per Kategori (Priority: P1)

User ingin melihat perbandingan pemasukan vs pengeluaran dalam bentuk donut chart, serta rincian pengeluaran dan pemasukan per kategori dalam bentuk bar chart, sehingga mudah memahami ke mana uang pergi dan dari mana uang datang.

**Why this priority**: Ini adalah core value dari fitur — tanpa donut chart dan bar chart per kategori, fitur tidak memberikan nilai sama sekali.

**Independent Test**: User dapat membuka halaman Riwayat, menekan tab "Statistik", dan melihat donut chart perbandingan income/expense diikuti dua bar chart (pengeluaran per kategori dan pemasukan per kategori) berdasarkan periode aktif.

**Acceptance Scenarios**:

1. **Given** user memiliki data transaksi pengeluaran dan pemasukan, **When** user membuka tab "Statistik", **Then** sistem menampilkan tiga bagian berurutan: donut chart perbandingan, bar chart pengeluaran per kategori, bar chart pemasukan per kategori
2. **Given** donut chart ditampilkan, **When** user melihatnya, **Then** donut menampilkan proporsi pengeluaran (satu warna) vs pemasukan (warna lain) dalam persentase, serta nominal total masing-masing
3. **Given** bar chart pengeluaran ditampilkan, **When** user melihatnya, **Then** setiap bar menampilkan nama kategori, nominal dalam Rupiah, dan bar proporsional, diurutkan dari terbesar ke terkecil
4. **Given** user hanya memiliki data pengeluaran (tidak ada pemasukan), **When** tab Statistik terbuka, **Then** donut chart menunjukkan 100% pengeluaran, bar chart pengeluaran normal, bar chart pemasukan menampilkan state kosong
5. **Given** tidak ada data transaksi sama sekali, **When** tab Statistik terbuka, **Then** donut chart dan kedua bar chart menampilkan state kosong

---

### User Story 2 - Pilih Periode Statistik (Priority: P1)

User ingin memilih rentang waktu untuk statistik — periode saat ini, periode sebelumnya, atau gabungan 3 periode terakhir — dengan perhitungan tanggal berdasarkan pengaturan siklus.

**Why this priority**: Period selector memengaruhi semua data di tab Statistik. Tanpa ini user hanya bisa melihat data agregat tanpa konteks waktu.

**Independent Test**: User dapat memilih "Periode Lalu" dan donut chart serta bar chart berubah hanya menampilkan data dari satu siklus sebelumnya.

**Acceptance Scenarios**:

1. **Given** tab Statistik sedang aktif dengan default "Periode Ini", **When** user menekan opsi "Periode Lalu", **Then** semua chart diperbarui hanya menampilkan data dari satu siklus periode sebelumnya
2. **Given** user menekan opsi "3 Periode", **When** chart diperbarui, **Then** data yang ditampilkan adalah agregasi dari 3 periode terakhir (periode ini + 2 sebelumnya)
3. **Given** user berada di "Periode Lalu" dan tidak ada transaksi di periode tersebut, **When** chart diperbarui, **Then** chart menampilkan state kosong
4. **Given** periode dihitung berdasarkan `cycleStartDay` dari pengaturan, **When** perhitungan dilakukan, **Then** hasilnya konsisten dengan perhitungan periode di Dashboard

---

### User Story 3 - Filter Riwayat dengan Menekan Kategori di Chart (Priority: P2)

User ingin menekan salah satu kategori di chart untuk melihat daftar transaksi spesifik di kategori tersebut pada tab Daftar di bawahnya.

**Why this priority**: Meningkatkan nilai fitur dengan navigasi dari ringkasan visual ke detail transaksi.

**Independent Test**: User dapat menekan kategori "Food & Drinks" di chart pengeluaran, dan daftar transaksi di bawahnya berubah hanya menampilkan transaksi dengan kategori food.

**Acceptance Scenarios**:

1. **Given** chart statistik sedang ditampilkan, **When** user menekan salah satu bar kategori, **Then** daftar transaksi di bawah chart terfilter hanya untuk kategori tersebut
2. **Given** user sudah memfilter kategori tertentu, **When** user menekan kategori yang sama lagi, **Then** filter dihapus (toggle)
3. **Given** user menekan kategori di chart pengeluaran, **When** filter aktif, **Then** hanya transaksi expense dengan kategori tersebut yang ditampilkan

---

### Edge Cases

- **Tidak ada data transaksi sama sekali**: Semua chart menampilkan state kosong "Belum ada transaksi"
- **Periode tanpa transaksi**: State kosong per periode dengan pesan "Tidak ada transaksi di periode ini"
- **Hanya pemasukan saja / hanya pengeluaran saja**: Donut chart tetap valid (100% salah satu sisi), bar chart sisi yang tidak ada data menampilkan state kosong
- **Kategori dengan nominal Rp0**: Tidak ditampilkan di chart
- **Banyak kategori (13 expense + 10 income)**: Bar chart harus bisa menampilkan semua kategori tanpa overflow, scroll jika perlu
- **Periode dengan hanya satu kategori**: Bar chart tetap tampil normal dengan 1 bar penuh
- **cycleStartDay di luar rentang 1-28**: Tidak terjadi karena sudah divalidasi di CycleModal (BR-12)
- **Periode Lalu / 3 periode saat aplikasi baru dipakai (belum genap 1 siklus)**: Data yang ada tetap ditampilkan apa adanya

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Halaman Riwayat harus memiliki tab ketiga "Statistik" di samping tab "Pemasukan" dan "Pengeluaran" yang sudah ada
- **FR-002**: Tab Statistik menampilkan tiga bagian berurutan: (1) donut chart perbandingan, (2) bar chart pengeluaran per kategori, (3) bar chart pemasukan per kategori
- **FR-003**: Donut chart menampilkan perbandingan persentase dan nominal total antara INCOME dan EXPENSE dalam satu lingkaran
- **FR-004**: Setiap bar chart mengelompokkan transaksi berdasarkan field `category` dan menjumlahkan total nominal per kategori
- **FR-005**: Kategori dalam bar chart diurutkan menurun (nominal terbesar ke terkecil)
- **FR-006**: Setiap bar chart menampilkan total nominal keseluruhan di bagian atas
- **FR-007**: Setiap bar menampilkan: nama kategori, nominal dalam Rupiah, dan bar proporsional (lebar sesuai persentase terhadap total)
- **FR-008**: Sistem harus menyediakan 3 opsi periode: "Periode Ini", "Periode Lalu", "3 Periode" dalam bentuk pill buttons
- **FR-009**: Opsi "Periode Ini" menampilkan data dari periode siklus aktif (sama dengan perhitungan di Dashboard)
- **FR-010**: Opsi "Periode Lalu" menampilkan data dari satu periode siklus sebelum periode aktif
- **FR-011**: Opsi "3 Periode" mengagregasi data dari periode aktif + 2 periode sebelumnya (total 3 periode)
- **FR-012**: Perhitungan periode menggunakan `cycleStartDay` dari settings dan konsisten dengan Dashboard
- **FR-013**: Default opsi periode adalah "Periode Ini"
- **FR-014**: Jika tidak ada data untuk suatu chart atau periode, tampilkan state kosong yang informatif
- **FR-015**: [P2] User dapat menekan bar kategori untuk memfilter daftar transaksi di bawah chart
- **FR-016**: [P2] Filter kategori bersifat toggle — tekan sekali aktif, tekan lagi nonaktif

### Key Entities

Tidak ada entity baru. Data bersumber dari entity `Transaction` yang sudah ada. Perlu utility tambahan untuk kalkulasi periode (ekstraksi dari HomePage ke lib bersama).

**PeriodCalculator** (utility baru):
- File: `src/lib/period.js`
- Fungsi: `calculatePeriod(cycleStartDay, offset = 0)`
  - `offset = 0`: periode aktif saat ini
  - `offset = -1`: satu periode sebelum periode aktif
  - `offset = -2`: dua periode sebelum periode aktif
- Output: `{ startRaw: string, endRaw: string }` (format YYYY-MM-DD)
- Dipakai oleh: HomePage (existing, replace local function), HistoryPage (baru)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Donut chart dan bar chart muncul dalam < 1 detik setelah tab Statistik ditekan
- **SC-002**: Pergantian opsi periode merespon dalam < 100ms setelah user memilih
- **SC-003**: Total nominal donut chart (income + expense) sama persis dengan jumlah absolut semua transaksi di periode terpilih
- **SC-004**: Total nominal di bar chart pengeluaran sama persis dengan total sisi expense di donut chart
- **SC-005**: Total nominal di bar chart pemasukan sama persis dengan total sisi income di donut chart

## Assumptions

- **Donut chart**: Implementasi menggunakan SVG `stroke-dasharray` pada dua buah circle (satu untuk expense, satu untuk income) — tidak perlu library chart eksternal
- **Bar chart**: Horizontal bar dengan div + CSS width proporsional terhadap nilai maksimum — tidak perlu library eksternal
- **Tata letak**: Donut chart di atas, lalu bar chart pengeluaran, lalu bar chart pemasukan — scroll vertikal jika melebihi layar
- **Period selector**: Pill button grup horizontal — mengikuti pola PillButtonGroup + PillButton yang sudah ada
- **`calculatePeriod()` diekstrak ke `src/lib/period.js`**: Agar bisa dipakai oleh HomePage dan HistoryPage tanpa duplikasi. Ini adalah prasyarat sebelum implementasi fitur
- **Data refresh**: Mengikuti pola existing — data dibaca dari `loadFromStorage()` setiap render, tidak ada reactive sync
- **Tidak perlu storage key baru**: Cukup pakai `transactions` dan `settings` yang sudah ada
- **Filter kategori untuk daftar transaksi**: Menggunakan state lokal di HistoryPage, tidak mengubah struktur data
- **Warna donut chart**: Dua warna kontras — satu untuk expense, satu untuk income — menggunakan CSS custom properties `var(--color-*)`
