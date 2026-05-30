import { useState } from 'react';

/**
 * ProfileModal — modal sederhana untuk mengubah nama pengguna.
 *
 * Props:
 * - currentName: string, nama saat ini (ditampilkan sebagai value awal)
 * - onSave: function(newName), dipanggil saat user menyimpan
 * - onClose: function, dipanggil saat user membatalkan
 */
export default function ProfileModal({ currentName, onSave, onClose }) {
  const [name, setName] = useState(currentName);
  const [error, setError] = useState('');

  function handleSave() {
    if (!name.trim()) {
      setError('Nama tidak boleh kosong');
      return;
    }
    onSave(name.trim());
  }

  return (
    // Overlay backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* Modal content */}
      <div className="bg-[var(--color-bg)] rounded-md p-4 mx-4 w-full max-w-sm border border-[var(--color-border)]">
        <h3 className="text-lg font-medium mb-4">Ubah Nama</h3>

        <label className="text-sm block mb-1" htmlFor="profile-name">
          Nama
        </label>
        <input
          id="profile-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          autoComplete="off"
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
