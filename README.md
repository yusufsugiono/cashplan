# CashPlan

Aplikasi pencatat keuangan pribadi. Alur Uang Terjaga, Masa Depan Terencana.

## Fitur

- **Dashboard** — Ringkasan saldo, total pemasukan, dan total pengeluaran dalam periode siklus yang bisa dikustomisasi
- **Tambah Transaksi** — Catat pemasukan atau pengeluaran dengan kategori, deskripsi, tanggal, dan nominal
- **Riwayat** — Lihat daftar semua transaksi dengan filter pemasukan/pengeluaran
- **Perencanaan Anggaran** — Buat rencana budget dengan checklist item yang bisa dicentang
- **Pengaturan** — Ubah nama profil, tema (light/dark/system), siklus penghitungan, export/import data, dan reset data
- **PWA** — Installable sebagai aplikasi standalone di mobile dan desktop, dengan offline support via service worker
- **Theming** — Dark mode otomatis mengikuti sistem atau pilihan manual user

## Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS 3 + CSS Custom Properties
- **Routing:** React Router DOM 7
- **Icons:** React Icons
- **Linting:** ESLint 10
- **Formatting:** Prettier

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Format code
npm run format

# Check formatting
npm run format:check

# Lint
npm run lint
```

## Dokumentasi Detail

Informasi lebih lanjut tersedia di file berikut:

| File | Isi |
|---|---|
| `AGENTS.md` | Coding rules, implementation workflow, risk mitigations |
| `CONSTITUTION.md` | Arsitektur, konvensi, dependency rules, deployment assumptions |
| `docs/architecture.md` | Topologi aplikasi, data flow, routing, theming, PWA |
| `docs/module-map.md` | Struktur direktori lengkap, tanggung jawab tiap modul, dependency flow |
| `docs/api-map.md` | Storage API interface, data flow untuk setiap fitur |
| `docs/database-map.md` | Schema localStorage, data relationships, query patterns |

## Spec-Driven Development (SDD) dengan Speckit

Project ini menggunakan **Speckit** untuk Spec-Driven Development — workflow sistematis dari spesifikasi hingga implementasi dengan review gates di setiap tahap.

### Prasyarat

- **OpenCode** sudah terinstall dan aktif
- Jalankan semua perintah dari **root project**
- Speckit akan membaca `CONSTITUTION.md` dan `.specify/memory/constitution.md` sebagai konteks

### Workflow

```
specify → [review gate] → plan → [review gate] → tasks → implement → converge
```

### Langkah-Langkah

| Step | Perintah | Deskripsi |
|---|---|---|
| **1. Specify** | `speckit run` atau `/speckit.specify "deskripsi fitur"` | Buat feature specification — user stories, acceptance criteria, requirements, edge cases |
| **2. Review Spec** | (gate otomatis) | Approve untuk lanjut ke planning, atau reject untuk revisi |
| **3. Plan** | `/speckit.plan "fitur"` | Generate implementation plan — technical context, structure, risks |
| **4. Review Plan** | (gate otomatis) | Approve/reject sebelum task generation |
| **5. Tasks** | `/speckit.tasks "fitur"` | Breakdown ke task list terurut per user story dengan dependencies |
| **6. Implement** | `/speckit.implement "fitur"` | Eksekusi task satu per satu — Speckit akan mengimplementasi sesuai task list |
| **7. Converge** | `/speckit.converge` | Review hasil akhir, pastikan semua task selesai dan tidak ada regresi |

### Contoh: Menambahkan Fitur Baru

```bash
# Langsung pakai workflow (recommended):
speckit run "Tambah halaman statistik dengan chart pengeluaran per kategori"

# Atau step by step:
# 1. /speckit.specify "Tambah halaman statistik dengan chart pengeluaran per kategori"
# 2. Review spec → approve
# 3. /speckit.plan "Tambah halaman statistik dengan chart pengeluaran per kategori"
# 4. Review plan → approve
# 5. /speckit.tasks "Tambah halaman statistik dengan chart pengeluaran per kategori"
# 6. /speckit.implement "Tambah halaman statistik dengan chart pengeluaran per kategori"
# 7. /speckit.converge
```

### Catatan

- Setiap step menghasilkan file di `specs/<nama-fitur>/` yang bisa direview sebelum lanjut
- Pastikan selalu run `npm run lint` dan `npm run build` setelah implementasi
- Untuk perubahan kecil, cukup gunakan `/speckit.implement` langsung tanpa workflow penuh
