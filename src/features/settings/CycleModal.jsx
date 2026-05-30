import { useState } from 'react';

/**
 * CycleModal — modal untuk mengubah tanggal mulai siklus penghitungan.
 *
 * Props:
 * - currentDay: number, tanggal siklus saat ini (1-28)
 * - onSave: function(newDay), dipanggil saat user menyimpan
 * - onClose: function, dipanggil saat user membatalkan
 */
export default function CycleModal({ currentDay, onSave, onClose }) {
  const [day, setDay] = useState(String(currentDay));
  const [error, setError] = useState('');

  function handleSave() {
    const numDay = Number(day);

    if (!day.trim() || isNaN(numDay)) {
      setError('Harus berupa angka');
      return;
    }

    if (numDay < 1 || numDay > 28) {
      setError('Tanggal harus antara 1-28');
      return;
    }

    onSave(numDay);
  }

  return (
    // Overlay backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* Modal content */}
      <div className="bg-[var(--color-bg)] rounded-md p-4 mx-4 w-full max-w-sm border border-[var(--color-border)]">
        <h3 className="text-lg font-medium mb-4">Ubah Siklus Penghitungan</h3>

        <p className="text-xs text-[var(--color-muted)] mb-3">
          Pilih tanggal mulai siklus (1-28). Periode akan dihitung dari tanggal ini setiap bulan.
        </p>

        <label className="text-sm block mb-1" htmlFor="cycle-day">
          Tanggal Mulai
        </label>
        <input
          id="cycle-day"
          type="number"
          min="1"
          max="28"
          value={day}
          onChange={(e) => {
            setDay(e.target.value);
            if (error) setError('');
          }}
          className="block w-full p-2 mb-2 bg-[var(--color-bg)] border border-solid rounded-md h-[32px]"
        />
        {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

        {/* Tombol aksi */}
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 text-sm border border-solid border-[var(--color-border)] rounded-md"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2 text-sm bg-[var(--color-btn-submit-bg)] text-[var(--color-btn-submit-text)] rounded-md font-medium"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
