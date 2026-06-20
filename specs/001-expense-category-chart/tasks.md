---

description: "Task list for Statistik Tab dengan Chart per Kategori"
---

# Tasks: Statistik Tab dengan Chart per Kategori

**Input**: Design documents from `specs/001-expense-category-chart/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tidak ada test tasks — proyek belum memiliki testing framework.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root
- All paths relative to project root: `D:\Personal\finance-tracker\`

---

## Phase 1: Setup

**Purpose**: Project initialization and basic structure

Tidak ada setup tasks — project sudah terinisialisasi dengan React 19 + Vite 8, semua dependencies sudah terinstall.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T001 [P] Extract `calculatePeriod()` and `toDateString()` from `src/pages/HomePage.jsx` to new file `src/lib/period.js` — export `calculatePeriod(cycleStartDay, offset = 0)` and `toDateString(date)`; preserve exact same logic for offset=0; add offset parameter: -1 = previous period, -2 = two periods ago; add helper `getPeriodRange(cycleStartDay, mode)` that returns `{ startRaw, endRaw }` for modes 'current', 'previous', 'last3'
- [ ] T002 Update `src/pages/HomePage.jsx` — remove local `toDateString()` and `calculatePeriod()` functions; import `{ calculatePeriod, toDateString }` from `../lib/period`; verify no behavior change

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 - Lihat Ringkasan & Rincian per Kategori (Priority: P1) 🎯 MVP

**Goal**: User dapat melihat donut chart perbandingan income vs expense, bar chart pengeluaran per kategori, dan bar chart pemasukan per kategori — untuk periode aktif (default "Periode Ini")

**Independent Test**: Buka halaman Riwayat → tab "Statistik" → donut chart + dua bar chart muncul dengan data dari periode ini

- [ ] T003 [P] [US1] Create `src/features/history/ComparisonChart.jsx` — SVG donut chart component using two `<circle>` elements with `stroke-dasharray`/`stroke-dashoffset`; props `{ totalIncome, totalExpense }`; income color `var(--color-primary)`, expense color `var(--color-danger)`; display percentage in center; legend below with label + nominal in Rupiah; JSDoc with Bahasa Indonesia comments
- [ ] T004 [P] [US1] Create `src/features/history/ExpenseChart.jsx` — horizontal bar chart component; props `{ categories: [{ name, amount, percentage }], onCategoryClick? }`; div-based bars with CSS `width: X%` proportional to max amount; sorted descending by amount; total nominal at top; each bar shows name, bar, nominal; if `onCategoryClick` provided, bar is clickable (cursor pointer); empty state "Belum ada transaksi pengeluaran"; JSDoc in Bahasa Indonesia
- [ ] T005 [P] [US1] Create `src/features/history/IncomeChart.jsx` — same structure as ExpenseChart but for income; empty state "Belum ada transaksi pemasukan"; JSDoc in Bahasa Indonesia
- [ ] T006 [US1] Create `src/features/history/chartUtils.js` — helper functions `groupByCategory(transactions, type)` returns sorted array `[{ name, amount, percentage }]` and `computeComparison(transactions)` returns `{ totalIncome, totalExpense }`; JSDoc in Bahasa Indonesia
- [ ] T007 [US1] Modify `src/pages/HistoryPage.jsx` — add third tab "Statistik" between "Pengeluaran" and BottomNav; add state `activeTab` with value `'STATISTICS'`; when `activeTab === 'STATISTICS'`, render: ComparisonChart → ExpenseChart → IncomeChart; import `loadSettings` from `storage.js`; import `calculatePeriod` from `lib/period.js`; pass `filteredTransactions` and chart data computed from current period (offset=0)

**Checkpoint**: MVP — tab Statistik muncul, donut + bar charts menampilkan data periode aktif

---

## Phase 4: User Story 2 - Pilih Periode Statistik (Priority: P1)

**Goal**: User dapat memilih "Periode Ini", "Periode Lalu", atau "3 Periode" dan chart berubah sesuai

**Independent Test**: Buka tab Statistik → tekan "Periode Lalu" → semua chart berubah hanya menampilkan data periode sebelumnya

- [ ] T008 [P] [US2] Create `src/features/history/PeriodSelector.jsx` — pill button group using existing PillButtonGroup and PillButton; props `{ selected, onChange }`; three options: "Periode Ini" (value: 'current'), "Periode Lalu" (value: 'previous'), "3 Periode" (value: 'last3'); default selected 'current'; JSDoc in Bahasa Indonesia
- [ ] T009 [US2] Add `getPeriodRange` logic in `src/lib/period.js` — implement the function body: for 'current' return `calculatePeriod(day, 0)`; for 'previous' return `calculatePeriod(day, -1)`; for 'last3' compute min start from offset -2 and max end from offset 0
- [ ] T010 [US2] Modify `src/pages/HistoryPage.jsx` — add state `selectedPeriod` (default 'current'); import PeriodSelector; render above chart components when `activeTab === 'STATISTICS'`; on period change, recalculate filtered transactions using `getPeriodRange` and pass updated data to all three charts

**Checkpoint**: Period selector works — all three options filter data correctly across all charts

---

## Phase 5: User Story 3 - Filter Riwayat dengan Menekan Kategori (Priority: P2)

**Goal**: User dapat menekan bar kategori di chart untuk memfilter daftar transaksi di bawahnya

**Independent Test**: Buka tab Statistik → tekan bar "Food & Drinks" → TransactionList di bawah hanya menampilkan transaksi food

- [ ] T011 [US3] Modify `src/pages/HistoryPage.jsx` — add state `selectedCategory` (default null); add `handleCategoryClick(categoryName)` that toggles: if same category clicked → set null, else set categoryName; pass `onCategoryClick={handleCategoryClick}` to ExpenseChart and IncomeChart; reset `selectedCategory` when switching tabs
- [ ] T012 [US3] Modify rendering logic in `src/pages/HistoryPage.jsx` — when `activeTab === 'STATISTICS'` and `selectedCategory` is set, render TransactionList filtered by `t.category === selectedCategory && t.type === 'EXPENSE'`; when `selectedCategory` is null, render all expense transactions in the chart view; when active tab is not 'STATISTICS', show original behavior

**Checkpoint**: Category click works — transaction list filters correctly on click, toggles off on re-click

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T013 Run `npm run lint` and fix any lint errors in modified/new files
- [ ] T014 Run `npm run format:check` and fix formatting if needed; run `npm run build` to confirm build succeeds

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — project already initialized
- **Foundational (Phase 2)**: BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational — charts for current period
- **US2 (Phase 4)**: Depends on Foundational — best after US1 to verify chart updates
- **US3 (Phase 5)**: Depends on US1 — needs chart bars to be clickable
- **Polish (Phase 6)**: Depends on all user stories being complete

### Parallel Opportunities

- T001 and T002 can run in parallel (different files)
- T003, T004, T005 can run in parallel (independent components)
- T006 and T007 can run after T003-T005
- T008 is independent — can run in parallel with T009

---

## Implementation Strategy

### MVP First (US1 Only)

1. Phase 2: Foundational (period.js extraction)
2. Phase 3: US1 (charts + tab Statistik)
3. **STOP and VALIDATE**: Charts visible for current period
4. Deploy/demo if ready

### Incremental Delivery

1. Foundational → period.js, HomePage tetap sama
2. US1 (P1) → Charts periode aktif → **MVP!**
3. US2 (P1) → Period switching
4. US3 (P2) → Category filter on click
5. Polish → Lint, format, build
