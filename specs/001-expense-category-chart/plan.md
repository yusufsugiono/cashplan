# Implementation Plan: Statistik Tab dengan Chart per Kategori

**Branch**: `001-expense-category-chart` | **Date**: 2026-06-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-expense-category-chart/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command.

## Summary

Tambahkan tab "Statistik" di halaman Riwayat yang menampilkan donut chart perbandingan pemasukan vs pengeluaran, bar chart pengeluaran per kategori, dan bar chart pemasukan per kategori — dengan opsi filter periode (Periode Ini, Periode Lalu, 3 Periode) berdasarkan pengaturan siklus.

## Technical Context

**Language/Version**: JavaScript (JSX), React 19

**Primary Dependencies**: react, react-dom, react-router-dom, react-icons, sweetalert2, tailwindcss — tidak perlu dependency baru

**Storage**: localStorage via `src/lib/storage.js` — key `transactions` dan `settings` sudah ada

**Testing**: None (tanpa testing framework; verifikasi manual via `npm run dev`)

**Target Platform**: Browser — mobile-first PWA (standalone di Android/iOS)

**Project Type**: Client-side SPA (React + Vite)

**Performance Goals**: Chart render < 1 detik setelah tab ditekan; pergantian periode < 100ms (data sudah di memori)

**Constraints**:
- Tidak boleh menggunakan library chart eksternal — donut via SVG, bar via CSS
- Tidak boleh menambah storage key baru
- Warna harus menggunakan CSS custom properties `var(--color-*)`
- Layout harus mobile-first (scroll vertikal jika melebihi layar)
- Tidak ada reactive sync — data dibaca ulang setiap render
- Komentar dan JSDoc dalam Bahasa Indonesia

**Scale/Scope**: Single user, semua data di localStorage lokal, maks ~5000 transaksi

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. Client-Only SPA | ✅ Pass | Semua komponen client-side, tidak ada backend |
| II. Feature-First Organization | ✅ Pass | Komponen baru di `src/features/history/`, utility di `src/lib/` |
| III. Minimal Dependencies | ✅ Pass | Menggunakan SVG + CSS saja, zero new dependencies |
| IV. Theming via CSS Custom Properties | ✅ Pass | Warna donut & bar chart pakai `var(--color-*)` |
| V. Risk & Safety | ✅ Pass | Tidak mengubah schema localStorage, lint+build verification |
| Language & Style | ✅ Pass | Komentar Bahasa Indonesia, JSDoc, Prettier formatting |
| Data Access | ✅ Pass | Hanya `loadFromStorage()`, tidak akses localStorage langsung |

**Kesimpulan**: Semua gates pass. Tidak ada complexity violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-expense-category-chart/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0: technology decisions
├── data-model.md        # Phase 1: entities & contracts
├── quickstart.md        # Phase 1: validation guide
├── contracts/           # Phase 1: component contracts
│   └── components.md
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
src/
├── lib/
│   └── period.js              # [BARU] calculatePeriod(cycleStartDay, offset)
│
├── features/
│   └── history/
│       ├── ComparisonChart.jsx # [BARU] SVG donut chart income vs expense
│       ├── ExpenseChart.jsx    # [BARU] bar chart expense per kategori
│       ├── IncomeChart.jsx     # [BARU] bar chart income per kategori
│       └── PeriodSelector.jsx  # [BARU] pill button 3 opsi periode
│
└── pages/
    ├── HomePage.jsx            # [MOD IF] import calculatePeriod dari lib/period.js
    └── HistoryPage.jsx         # [MOD IF] tambah tab "Statistik"
```

**Structure Decision**: Single project (React SPA). Semua komponen baru di `src/features/history/` karena terkait fitur riwayat yang sudah ada. Utility function di `src/lib/period.js` karena dipakai oleh dua pages (HomePage dan HistoryPage).

## Complexity Tracking

Tidak ada complexity violations. Semua gates pass.
