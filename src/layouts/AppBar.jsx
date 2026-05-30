/**
 * AppBar — top navigation bar yang tampil di halaman dengan back button.
 *
 * Props:
 * - icon: komponen icon (dari react-icons atau lainnya)
 * - onBack: fungsi yang dipanggil saat back button diklik
 * - children: judul halaman
 */
export default function AppBar({ icon: Icon, onBack, children }) {
  return (
    <>
      <div className="mb-2 p-1 flex items-center">
        <button className="px-2" title="Kembali" onClick={onBack}>
          <Icon />
        </button>
        <h2 className="text-xl font-medium">{children}</h2>
      </div>
      <hr className="mb-3" />
    </>
  );
}
