# Research: Statistik Tab dengan Chart per Kategori

> Phase 0 output — technology decisions and rationale.

---

## 1. Chart Implementation

### Donut Chart (Perbandingan Income vs Expense)

- **Decision**: SVG `circle` dengan `stroke-dasharray` dan `stroke-dashoffset`
- **Rationale**: Dua circle yang saling bertumpuk — satu untuk expense, satu untuk income. Proporsi dihitung dari persentase terhadap total. Tanpa library eksternal.
- **Alternatives considered**:
  - Canvas API: lebih kompleks, tidak perlu untuk visualisasi sederhana
  - Library eksternal (Chart.js, Recharts): melanggar aturan minimal dependencies
  - CSS conic-gradient: kurang konsisten di berbagai browser

### Bar Chart (Per Kategori)

- **Decision**: Div horizontal dengan CSS `width: X%` proporsional terhadap nilai maksimum
- **Rationale**: Setiap kategori dirender sebagai div dengan lebar `(amount / maxAmount) * 100%`. Sederhana, performa tinggi, styling mudah dengan Tailwind.
- **Alternatives considered**: Table-based layout, SVG rect — keduanya lebih kompleks tanpa benefit signifikan

## 2. Period Calculation

- **Decision**: Extract `calculatePeriod()` dari `HomePage.jsx` ke `src/lib/period.js` dengan tambahan parameter `offset`
- **Rationale**: HomePage sudah punya logika `calculatePeriod()` untuk siklus aktif. Dengan ekstrak ke lib, HistoryPage bisa pakai fungsi yang sama untuk periode lalu (-1) dan -2. Konsistensi terjamin.
- **Alternatives considered**: Duplikasi kode di HistoryPage — riskan inkonsistensi

## 3. State Management untuk Tab Statistik

- **Decision**: Local state `useState` di HistoryPage untuk `activeTab` (existing) dan `selectedPeriod` (baru)
- **Rationale**: Mengikuti pola existing — tidak perlu Context/Redux. Data di-re-read dari localStorage setiap render.

## 4. Filter Kategori (US3)

- **Decision**: State `selectedCategory` di HistoryPage; ketika user menekan bar di chart, set state → TransactionList difilter
- **Rationale**: Toggle behavior — tekan sekali aktif, tekan lagi nonaktif. Tidak perlu mengubah struktur data.

## 5. Warna Chart

- **Decision**: CSS custom properties `var(--color-*)` untuk konsistensi tema
- **Donut colors**: Expense = `var(--color-danger)`, Income = `var(--color-primary)` — dua warna kontras yang sudah ada di sistem theming
- **Alternatives considered**: Hardcoded colors — melanggar aturan theming

## 6. Layout & Responsivitas

- **Decision**: Stack vertikal — donut chart di atas, lalu expense bar chart, lalu income bar chart. Scroll jika melebihi viewport.
- **Rationale**: Mobile-first. Layar sempit tidak cukup untuk layout grid/side-by-side.

## 7. Empty State

- **Decision**: Text center dengan icon dan pesan informatif — konsisten dengan pola yang sudah ada (tidak ada empty state component existing, jadi pakai inline)

## 8. ID & Data Integrity

- **Decision**: Tidak ada perubahan pada schema data. Semua perhitungan dilakukan di memori dari data transaksi yang sudah ada.
