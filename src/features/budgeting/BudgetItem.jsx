import { formatRupiah } from '../../lib/currency';

/**
 * BudgetItem — satu baris checklist item dalam BudgetCard.
 *
 * Props:
 * - name: string, nama item (contoh: "Bayar Listrik")
 * - amount: number, nominal item
 * - checked: boolean, apakah item sudah selesai/terbayar
 * - onToggle: function, dipanggil saat checkbox diklik
 */
export default function BudgetItem({ name, amount, checked, onToggle }) {
  return (
    <div className="flex items-center justify-between py-2">
      {/* Checkbox + nama item */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="w-4 h-4 accent-[var(--color-btn-submit-bg)]"
        />
        <span className={`text-sm ${checked ? 'line-through text-[var(--color-muted)]' : ''}`}>
          {name}
        </span>
      </label>

      {/* Nominal */}
      <span className="text-sm">{formatRupiah(amount)}</span>
    </div>
  );
}
