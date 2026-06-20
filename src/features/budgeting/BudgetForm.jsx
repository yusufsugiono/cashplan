import { useState } from 'react';

import BudgetItemInput from './BudgetItemInput';
import { formatRupiah } from '../../lib/currency';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../../lib/storage';

// ─── Nilai awal ──────────────────────────────────────────────────────────────

const EMPTY_ITEM = { name: '', cost: '' };

// Mulai dengan 2 baris item kosong agar user langsung bisa mengisi
const INITIAL_ITEMS = [{ ...EMPTY_ITEM }, { ...EMPTY_ITEM }];

// ─── Validasi ────────────────────────────────────────────────────────────────

/**
 * Validasi form budget sebelum disimpan.
 * Mengembalikan string error message, atau null jika valid.
 */
function validateBudgetForm(label, items) {
  if (!label.trim()) {
    return 'Label rencana wajib diisi';
  }

  // Minimal 1 item harus terisi lengkap
  const filledItems = items.filter((item) => item.name.trim() && item.cost.trim());
  if (filledItems.length === 0) {
    return 'Minimal 1 item harus diisi lengkap (nama dan biaya)';
  }

  // Cek semua biaya yang diisi harus berupa angka (cost sudah berupa digit murni)
  for (const item of items) {
    if (item.cost.trim() && isNaN(Number(item.cost))) {
      return `Biaya "${item.name || 'item'}" harus berupa angka`;
    }
  }

  return null;
}

// ─── Komponen ────────────────────────────────────────────────────────────────

/**
 * BudgetForm — form untuk membuat atau mengedit rencana budget.
 *
 * Props:
 * - onSaved: function, dipanggil setelah rencana berhasil disimpan
 * - editData: object (optional), data budget yang akan diedit { id, label, totalAmount, items }
 */
export default function BudgetForm({ onSaved, editData }) {
  const [label, setLabel] = useState(editData ? editData.label : '');
  const [items, setItems] = useState(() => {
    if (editData && editData.items.length > 0) {
      return editData.items.map((item) => ({
        name: item.name,
        cost: String(item.amount),
      }));
    }
    return INITIAL_ITEMS;
  });
  const [error, setError] = useState('');

  // ─── Handlers ──────────────────────────────────────────────────────────────

  /** Tambah baris item baru di akhir list */
  function handleAddItem() {
    setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  }

  /** Hapus item di posisi tertentu */
  function handleRemoveItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  /** Update field tertentu (name/cost) pada item di posisi tertentu */
  function handleItemChange(index, field, value) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  /** Submit form: validasi → simpan ke localStorage → callback */
  function handleSubmit(e) {
    e.preventDefault();

    // Validasi
    const validationError = validateBudgetForm(label, items);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Filter hanya item yang terisi, lalu buat object budget
    const filledItems = items
      .filter((item) => item.name.trim() && item.cost.trim())
      .map((item) => ({
        id: Date.now() + Math.random(), // ID unik sederhana
        name: item.name.trim(),
        amount: Number(item.cost),
        checked: false,
      }));

    const totalAmount = filledItems.reduce((sum, item) => sum + item.amount, 0);

    const existingBudgets = loadFromStorage(STORAGE_KEYS.BUDGETS);

    if (editData) {
      // Mode edit: update budget yang sudah ada
      const updatedBudgets = existingBudgets.map((b) =>
        b.id === editData.id ? { ...b, label: label.trim(), totalAmount, items: filledItems } : b,
      );
      saveToStorage(STORAGE_KEYS.BUDGETS, updatedBudgets);
    } else {
      // Mode tambah: buat budget baru
      const newBudget = {
        id: Date.now(),
        label: label.trim(),
        totalAmount,
        items: filledItems,
      };
      saveToStorage(STORAGE_KEYS.BUDGETS, [...existingBudgets, newBudget]);
    }

    // Reset dan beritahu parent
    setLabel('');
    setItems(INITIAL_ITEMS);
    setError('');
    if (onSaved) onSaved();
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-5 mx-3 border border-solid border-[var(--color-ring)] rounded-md p-3"
    >
      {/* Error message */}
      {error && (
        <p className="text-red-500 text-xs mb-3 p-2 bg-red-50 rounded-md border border-red-200">
          {error}
        </p>
      )}

      {/* Input label rencana */}
      <label className="text-sm block mb-1" htmlFor="budget-label">
        Label
      </label>
      <input
        id="budget-label"
        type="text"
        value={label}
        onChange={(e) => {
          setLabel(e.target.value);
          if (error) setError('');
        }}
        autoComplete="off"
        className="block w-full p-2 mb-5 bg-[var(--color-bg)] border border-solid rounded-md h-[32px]"
      />

      {/* Dynamic item inputs */}
      {items.map((item, index) => (
        <BudgetItemInput
          key={index}
          index={index}
          item={item}
          onChange={handleItemChange}
          onRemove={handleRemoveItem}
          canRemove={items.length > 1}
        />
      ))}

      {/* Tombol tambah item */}
      <button
        type="button"
        onClick={handleAddItem}
        className="flex items-center justify-center w-8 h-8 mx-auto mb-5 text-lg border border-solid border-[var(--color-border)] rounded-md text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-ring)]"
        aria-label="Tambah item"
      >
        +
      </button>

      {/* Total biaya (otomatis dihitung, non-editable) */}
      <div className="mb-5 p-3 bg-[var(--color-bg)] border border-solid border-[var(--color-border)] rounded-md">
        <span className="text-sm text-[var(--color-muted)]">Total Biaya</span>
        <p className="text-lg font-medium text-[var(--color-btn-submit-bg)]">
          {formatRupiah(items.reduce((sum, item) => sum + (item.cost ? Number(item.cost) : 0), 0))}
        </p>
      </div>

      {/* Tombol simpan */}
      <div className="p-2 bg-[var(--color-bg)] border-t border-[var(--color-border)]">
        <button
          type="submit"
          className="block w-full bg-[var(--color-btn-submit-bg)] text-[var(--color-btn-submit-text)] h-[40px] rounded-md font-medium"
        >
          {editData ? 'PERBARUI' : 'SIMPAN'}
        </button>
      </div>
    </form>
  );
}
