import { formatDateID } from '../../lib/date';
import { formatRupiah } from '../../lib/currency';

/**
 * TransactionItem — satu baris item transaksi dalam daftar riwayat.
 *
 * Props:
 * - date: string, tanggal transaksi dalam format ISO (YYYY-MM-DD)
 * - description: string, deskripsi/kategori transaksi
 * - amount: number, nominal transaksi
 */
export default function TransactionItem({ date, description, amount }) {
  return (
    <div className="flex items-center justify-between px-3 py-3 border-b border-[var(--color-border)]">
      {/* Kiri: tanggal + deskripsi */}
      <div>
        <p className="text-sm font-medium">{formatDateID(date)}</p>
        <p className="text-xs text-[var(--color-muted)]">{description}</p>
      </div>

      {/* Kanan: nominal */}
      <p className="text-sm font-medium">{formatRupiah(amount)}</p>
    </div>
  );
}
