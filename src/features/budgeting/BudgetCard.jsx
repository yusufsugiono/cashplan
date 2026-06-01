import BudgetItem from './BudgetItem';
import IconButton from '../../components/ui/IconButton';
import { formatRupiah } from '../../lib/currency';
import { FaTrash, FaPenToSquare } from 'react-icons/fa6';

/**
 * BudgetCard — card yang menampilkan satu rencana budget beserta item-itemnya.
 *
 * Props:
 * - label: string, nama rencana (contoh: "Kebutuhan Bulanan")
 * - totalAmount: number, total budget yang direncanakan
 * - items: array of { id, name, amount, checked }
 * - onDelete: function, dipanggil saat tombol "Hapus" diklik
 * - onEdit: function, dipanggil saat tombol "Edit" diklik
 * - onToggleItem: function(itemId), dipanggil saat checkbox item diklik
 */
export default function BudgetCard({ label, totalAmount, items, onDelete, onEdit, onToggleItem }) {
  // Hitung sisa biaya dari item yang belum dichecklist
  const remainingAmount = items
    .filter((item) => !item.checked)
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="mx-3 mb-4 border border-solid border-[var(--color-border)] rounded-md p-3">
      {/* Header: label + sisa nominal */}
      <div className="mb-2">
        <h3 className="font-medium">{label}</h3>
        <p className="text-lg font-medium text-[var(--color-btn-submit-bg)]">
          {formatRupiah(remainingAmount)}
        </p>
        {remainingAmount !== totalAmount && (
          <p className="text-xs text-[var(--color-muted)]">
            dari total {formatRupiah(totalAmount)}
          </p>
        )}
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

      {/* Footer: tombol edit & hapus */}
      <div className="mt-3 flex justify-center gap-2">
        <IconButton icon={FaPenToSquare} variant="primary" onClick={onEdit}>
          Edit
        </IconButton>
        <IconButton icon={FaTrash} variant="danger" onClick={onDelete}>
          Hapus
        </IconButton>
      </div>
    </div>
  );
}
