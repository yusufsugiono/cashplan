# Plan: Settings (Pengaturan)

## Status: ✅ Selesai

## Deskripsi

Halaman pengaturan yang memungkinkan user mengelola profil, tema, siklus penghitungan, dan data aplikasi. Berisi daftar menu pengaturan yang masing-masing memiliki aksi berbeda.

## Referensi Desain

- AppBar: "Pengaturan" dengan back button
- List menu (masing-masing satu baris yang bisa diklik):
  1. Ubah Profil/Nama
  2. Ubah Tema Dark/Light
  3. Ubah Siklus Penghitungan
  4. Export Data
  5. Import Data
  6. Reset Data
  7. Tentang
  8. Bagikan
- Bottom navigation tetap tampil

## Struktur File

```
src/
├── features/
│   └── settings/
│       ├── SettingsMenu.jsx        # List menu pengaturan
│       ├── SettingsMenuItem.jsx    # Single item menu
│       ├── ProfileModal.jsx        # Modal/form ubah nama
│       └── CycleModal.jsx          # Modal/form ubah siklus penghitungan
├── pages/
│   └── SettingsPage.jsx            # Halaman pengaturan
├── lib/
│   └── storage.js                  # Tambah STORAGE_KEYS.SETTINGS
└── constants/
    └── routes.js                   # Sudah ada ROUTES.SETTINGS
```

## Steps

### Step 1: Update storage keys

Di `src/lib/storage.js`, tambahkan key baru:

```js
export const STORAGE_KEYS = {
  TRANSACTIONS: 'transactions',
  BUDGETS: 'budgets',
  SETTINGS: 'settings',
};
```

Data settings yang disimpan:

```js
{
  userName: 'Yusuf Sugiono',
  theme: 'system',        // 'light' | 'dark' | 'system'
  cycleStartDay: 1,       // tanggal mulai siklus (1-28)
}
```

### Step 2: Buat komponen SettingsMenuItem

Buat file `src/features/settings/SettingsMenuItem.jsx`:

- Props: `label` (string), `onClick` (function)
- Layout: full-width button/row dengan teks di kiri
- Styling: border-bottom, padding, hover state
- Accessible: gunakan `<button>` agar bisa diklik dan keyboard-navigable

### Step 3: Buat komponen SettingsMenu

Buat file `src/features/settings/SettingsMenu.jsx`:

- Props: `items` (array of { label, onClick })
- Map items ke `SettingsMenuItem`
- Wrapper dengan border dan rounded

### Step 4: Buat komponen ProfileModal

Buat file `src/features/settings/ProfileModal.jsx`:

- Props: `currentName` (string), `onSave` (function), `onClose` (function)
- Tampilkan sebagai overlay/modal sederhana
- Input text untuk nama baru
- Tombol "Simpan" dan "Batal"
- Validasi: nama tidak boleh kosong

### Step 5: Buat komponen CycleModal

Buat file `src/features/settings/CycleModal.jsx`:

- Props: `currentDay` (number), `onSave` (function), `onClose` (function)
- Tampilkan sebagai overlay/modal sederhana
- Input number (1-28) atau select dropdown untuk pilih tanggal mulai siklus
- Tombol "Simpan" dan "Batal"
- Validasi: harus angka 1-28

### Step 6: Buat halaman SettingsPage

Buat file `src/pages/SettingsPage.jsx`:

- Import: AppBar, BottomNav, SettingsMenu, ProfileModal, CycleModal
- State:
  - `settings`: object dari localStorage (userName, theme, cycleStartDay)
  - `showProfileModal`: boolean
  - `showCycleModal`: boolean
- Menu items dan handler:

| Menu | Aksi |
|------|------|
| Ubah Profil/Nama | Buka ProfileModal |
| Ubah Tema Dark/Light | Toggle tema (light → dark → system → light) atau buka pilihan |
| Ubah Siklus Penghitungan | Buka CycleModal |
| Export Data | Download semua data localStorage sebagai JSON file |
| Import Data | Buka file picker, baca JSON, tulis ke localStorage |
| Reset Data | Confirm dialog → hapus semua data localStorage |
| Tentang | Alert atau modal dengan info versi aplikasi |
| Bagikan | Gunakan Web Share API jika tersedia, fallback copy link |

- Handler tema:
  - Set `data-theme` attribute di `<html>` element
  - Simpan pilihan ke localStorage

- Handler export:
  - Kumpulkan semua data dari STORAGE_KEYS
  - Buat Blob JSON → download via anchor tag

- Handler import:
  - Buka `<input type="file" accept=".json" />`
  - Parse JSON → tulis ke localStorage per key
  - Reload halaman setelah import

- Handler reset:
  - `window.confirm('Yakin ingin menghapus semua data?')`
  - Jika ya: `localStorage.clear()` → reload halaman

### Step 7: Update App.jsx routes

Tambahkan route:

```jsx
import SettingsPage from './pages/SettingsPage';

<Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
```

### Step 8: Update HomePage agar membaca settings

Di `src/pages/HomePage.jsx`:
- Baca `userName` dari settings di localStorage (bukan hardcoded)
- Hitung `periodStart` dan `periodEnd` berdasarkan `cycleStartDay`

### Step 9: Verifikasi

- Jalankan `npm run build` — pastikan tidak ada error
- Jalankan `npm run format` — pastikan formatting konsisten
- Cek fungsionalitas:
  - Ubah nama → cek di HomePage greeting berubah
  - Toggle tema → cek dark/light mode berubah
  - Ubah siklus → cek periode di HomePage berubah
  - Export → file JSON terdownload
  - Import → data ter-restore setelah reload
  - Reset → semua data hilang setelah reload
  - Tentang → info tampil
  - Bagikan → share dialog muncul (atau link tercopy)

## Notes

- Tema default mengikuti system preference (`prefers-color-scheme`). Jika user memilih manual, simpan pilihan dan override.
- `cycleStartDay` dipakai untuk menghitung periode di HomePage. Contoh: jika cycleStartDay = 1, maka periode = tanggal 1 bulan ini hingga tanggal 1 bulan depan.
- Export/Import berguna untuk backup data atau pindah device.
- Reset data adalah operasi destruktif — wajib confirm dialog.
- Web Share API tidak tersedia di semua browser. Sediakan fallback (copy to clipboard).
- Untuk MVP, modal bisa berupa overlay sederhana (div absolute/fixed). Tidak perlu library modal.
