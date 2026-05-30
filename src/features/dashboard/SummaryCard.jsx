import { formatRupiah } from '../../lib/currency';

/**
 * SummaryCard — card ringkasan keuangan (saldo, pemasukan, atau pengeluaran).
 *
 * Props:
 * - icon: React component, icon yang ditampilkan di sisi kiri
 * - label: string, judul card (contoh: "Saldo", "Pemasukan")
 * - amount: number, nominal yang akan diformat ke Rupiah
 */
export default function SummaryCard({ icon: Icon, label, amount }) {
  return (
    <div className="flex items-center gap-3 mx-3 mb-3 p-3 border border-solid border-[var(--color-border)] rounded-md">
      {/* Icon di sisi kiri */}
      <div className="text-2xl text-[var(--color-muted)] shrink-0">
        <Icon />
      </div>

      {/* Label dan nominal di sisi kanan */}
      <div>
        <p className="text-xs text-[var(--color-muted)]">{label}</p>
        <p className="text-lg font-medium">{formatRupiah(amount)}</p>
      </div>
    </div>
  );
}
