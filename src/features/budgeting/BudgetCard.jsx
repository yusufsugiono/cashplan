import BudgetItem from './BudgetItem';
import { formatRupiah } from '../../lib/currency';

/**
 * BudgetCard — card yang menampilkan satu rencana budget beserta item-itemnya.
 *
 * Props:
 * - label: string, nama rencana (contoh: "Kebutuhan Bulanan")
 * - totalAmount: number, total budget yang direncanakan
 * - items: array of { id, name, amount, checked }
 * - onDelete: function, dipanggil saat tombol "Hapus" diklik
 * - onToggleItem: function(itemId), dipanggil saat checkbox item diklik
 */
export default function BudgetCard({ label, totalAmount, items, onDelete, onToggleItem }) {
  return (
    <div className="mx-3 mb-4 border border-solid border-[var(--color-border)] rounded-md p-3">
      {/* Header: label + total nominal */}
      <div className="mb-2">
        <h3 className="font-medium">{label}</h3>
        <p className="text-lg font-medium text-[var(--color-btn-submit-bg)]">
          {formatRupiah(totalAmount)}
        </p>
      </div>

      {/* Body: daftar checklist items */}
      <div className="border-t border-[var(--color-border)] pt-2">
        {items.map((item) => (
          <BudgetItem
            key={item.id}
            name={item.name}
            amount={item.amount}
            checked={item.checked}
            onToggle={() => onToggleItem(item.id)}
          />
        ))}
      </div>

      {/* Footer: tombol hapus */}
      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={onDelete}
          className="px-4 py-1 text-sm border border-solid border-[var(--color-border)] rounded-md text-[var(--color-muted)] hover:text-red-500 hover:border-red-500"
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
