import { formatThousand } from '../../lib/currency';

/**
 * BudgetItemInput — satu baris input untuk item + biaya di form tambah rencana.
 *
 * Props:
 * - index: number, posisi item dalam array (untuk identifikasi)
 * - item: object { name, cost }, data item saat ini (cost disimpan tanpa titik)
 * - onChange: function(index, field, value), dipanggil saat input berubah
 * - onRemove: function(index), dipanggil saat tombol hapus diklik
 * - canRemove: boolean, apakah tombol hapus ditampilkan (minimal 1 item harus ada)
 */
export default function BudgetItemInput({ index, item, onChange, onRemove, canRemove }) {
  /** Handle perubahan input biaya — simpan angka murni, tampilkan format ribuan */
  function handleCostChange(e) {
    const raw = e.target.value.replace(/\D/g, '');
    onChange(index, 'cost', raw);
  }

  return (
    <div className="flex items-end gap-2 mb-3">
      {/* Input nama item */}
      <div className="flex-1">
        <label className="text-sm block mb-1" htmlFor={`item-name-${index}`}>
          Item
        </label>
        <input
          id={`item-name-${index}`}
          type="text"
          value={item.name}
          onChange={(e) => onChange(index, 'name', e.target.value)}
          autoComplete="off"
          className="block w-full p-2 bg-[var(--color-bg)] border border-solid rounded-md h-[32px]"
        />
      </div>

      {/* Input biaya */}
      <div className="flex-1">
        <label className="text-sm block mb-1" htmlFor={`item-cost-${index}`}>
          Biaya
        </label>
        <input
          id={`item-cost-${index}`}
          type="text"
          inputMode="numeric"
          value={formatThousand(item.cost)}
          onChange={handleCostChange}
          autoComplete="off"
          className="block w-full p-2 bg-[var(--color-bg)] border border-solid rounded-md h-[32px]"
        />
      </div>

      {/* Tombol hapus item */}
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          aria-label="Hapus item"
          className="flex items-center justify-center w-8 h-8 text-lg text-[var(--color-muted)] border border-solid border-[var(--color-border)] rounded-md hover:text-red-500 hover:border-red-500"
        >
          −
        </button>
      )}
    </div>
  );
}
