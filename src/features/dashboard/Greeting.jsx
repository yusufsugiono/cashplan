/**
 * Greeting — menampilkan sapaan dan informasi periode pencatatan.
 *
 * Props:
 * - name: string, nama pengguna
 * - periodStart: string, tanggal awal periode (contoh: "1 Apr 2026")
 * - periodEnd: string, tanggal akhir periode (contoh: "1 Mei 2026")
 */
export default function Greeting({ name, periodStart, periodEnd }) {
  return (
    <div className="mx-3 mt-4 mb-4">
      <p className="text-sm text-[var(--color-muted)]">Selamat Datang,</p>
      <p className="text-lg font-medium">{name}</p>
      <p className="text-xs text-[var(--color-muted)] mt-1">
        Berikut adalah rincian cashflow catatan periode {periodStart} hingga {periodEnd}
      </p>
    </div>
  );
}
