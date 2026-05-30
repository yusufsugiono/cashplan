/**
 * SettingsMenuItem — satu baris menu di halaman pengaturan.
 *
 * Props:
 * - label: string, teks yang ditampilkan
 * - onClick: function, dipanggil saat item diklik
 */
export default function SettingsMenuItem({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-4 py-3 text-sm border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface)] transition-colors"
    >
      {label}
    </button>
  );
}
