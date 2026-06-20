import { useState } from 'react';

import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { formatThousand } from '../../lib/currency';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../constants/categories';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../../lib/storage';

// ─── Nilai awal form ────────────────────────────────────────────────────────

const INITIAL_FORM = {
  amount: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  category: '',
};

// ─── Validasi ────────────────────────────────────────────────────────────────

/**
 * Memvalidasi data form sebelum disimpan.
 * Mengembalikan object errors: { fieldName: 'pesan error' }
 * Jika tidak ada error, object akan kosong {}.
 */
function validateForm(formData) {
  const errors = {};

  if (!formData.amount.trim()) {
    errors.amount = 'Nominal wajib diisi';
  } else if (isNaN(Number(formData.amount))) {
    errors.amount = 'Nominal harus berupa angka';
  } else if (Number(formData.amount) <= 0) {
    errors.amount = 'Nominal harus lebih besar dari 0';
  }

  if (!formData.description.trim()) {
    errors.description = 'Deskripsi wajib diisi';
  }

  if (!formData.date) {
    errors.date = 'Tanggal wajib diisi';
  }

  if (!formData.category) {
    errors.category = 'Kategori wajib dipilih';
  }

  return errors;
}

// ─── Komponen ────────────────────────────────────────────────────────────────

/**
 * CashflowForm — form untuk mencatat transaksi baru (income atau expense).
 *
 * Props:
 * - mode: 'INCOME' | 'EXPENSE', menentukan label dan pilihan kategori
 * - onSaved: function, dipanggil setelah transaksi berhasil disimpan
 */
export default function CashflowForm({ mode, onSaved }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  // Pilihan kategori berubah sesuai mode (income/expense)
  const categoryOptions = mode === 'EXPENSE' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  // ─── Handlers ──────────────────────────────────────────────────────────────

  /**
   * Handler generik untuk semua field input.
   * Menggunakan `name` attribute dari input untuk update field yang sesuai.
   * Untuk field amount, hanya menyimpan digit murni.
   */
  function handleChange(e) {
    const { name, value } = e.target;

    if (name === 'amount') {
      // Simpan hanya digit murni
      const raw = value.replace(/\D/g, '');
      setFormData((prev) => ({ ...prev, amount: raw }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Hapus error untuk field yang sedang diubah
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  /**
   * Handler submit form.
   * Validasi → simpan ke localStorage → reset form → callback ke parent.
   */
  function handleSubmit(e) {
    e.preventDefault();

    // Validasi semua field
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Buat object transaksi baru
    const newTransaction = {
      id: Date.now(), // ID sementara, cukup untuk MVP
      type: mode,
      amount: Number(formData.amount),
      description: formData.description.trim(),
      date: formData.date,
      category: formData.category,
      createdAt: new Date().toISOString(),
    };

    // Ambil data lama, tambahkan transaksi baru, simpan kembali
    const existingTransactions = loadFromStorage(STORAGE_KEYS.TRANSACTIONS);
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, [...existingTransactions, newTransaction]);

    // Reset form ke kondisi awal
    setFormData(INITIAL_FORM);
    setErrors({});

    // Beritahu parent bahwa data sudah tersimpan
    if (onSaved) onSaved();
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-5 mx-3 border border-solid border-[var(--color-ring)] rounded-md p-2"
    >
      <Input
        id="date"
        type="date"
        label="Tanggal"
        value={formData.date}
        onChange={handleChange}
        error={errors.date}
      />

      <Input
        id="amount"
        type="text"
        inputMode="numeric"
        label={mode === 'EXPENSE' ? 'Nominal Pengeluaran' : 'Nominal Pemasukan'}
        value={formatThousand(formData.amount)}
        onChange={handleChange}
        error={errors.amount}
      />

      <Input
        id="description"
        type="text"
        label="Deskripsi"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
      />

      <Select
        id="category"
        label={mode === 'EXPENSE' ? 'Kategori Pengeluaran' : 'Kategori Pemasukan'}
        options={categoryOptions}
        value={formData.category}
        onChange={handleChange}
        placeholder="Pilih kategori"
        error={errors.category}
      />

      <div className="p-2 bg-[var(--color-bg)] border-t border-[var(--color-border)]">
        <button
          type="submit"
          className="block w-full bg-[var(--color-btn-submit-bg)] text-[var(--color-btn-submit-text)] h-[40px] rounded-md font-medium"
        >
          SIMPAN
        </button>
      </div>
    </form>
  );
}
