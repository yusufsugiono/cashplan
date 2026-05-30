/**
 * Select — dropdown select dengan label.
 *
 * Props:
 * - id: string, dipakai untuk menghubungkan label dan select (htmlFor/id)
 * - label: string, teks label yang tampil di atas select
 * - options: array of { label, value }, pilihan yang tersedia
 * - value: string, nilai yang sedang dipilih (controlled)
 * - onChange: function, dipanggil saat pilihan berubah
 * - placeholder: string (opsional), teks default option yang disabled
 */
export default function Select({
  id = '',
  label = '',
  options = [],
  value = '',
  onChange,
  placeholder = '',
}) {
  return (
    <>
      <label className="text-sm block my-2" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="block mt-2 p-1 mb-5 w-full bg-[var(--color-bg)] border border-solid rounded-md h-[32px]"
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
    </>
  );
}
