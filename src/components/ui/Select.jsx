/**
 * Select — dropdown select dengan label dan error message.
 *
 * Props:
 * - id: string, dipakai untuk menghubungkan label dan select (htmlFor/id)
 * - label: string, teks label yang tampil di atas select
 * - options: array of { label, value }, pilihan yang tersedia
 * - value: string, nilai yang sedang dipilih (controlled)
 * - onChange: function, dipanggil saat pilihan berubah
 * - placeholder: string (opsional), teks default option yang disabled
 * - error: string (opsional), pesan error jika validasi gagal
 */
export default function Select({
  id = '',
  label = '',
  options = [],
  value = '',
  onChange,
  placeholder = '',
  error = '',
}) {
  return (
    <div className="mb-5">
      <label className="text-sm block mb-1" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className={`block w-full p-1 bg-[var(--color-bg)] border border-solid rounded-md h-[32px] focus:outline-none focus:border-[var(--color-ring)] ${
          error ? 'border-red-500' : 'border-[var(--color-border)]'
        }`}
      >
        {/* Default option sebagai placeholder — tidak bisa dipilih kembali setelah user memilih */}
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
