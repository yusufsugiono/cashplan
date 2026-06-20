/**
 * Input — text input dengan label dan error message.
 *
 * Props:
 * - id: string, dipakai untuk menghubungkan label dan input (htmlFor/id)
 * - label: string, teks label yang tampil di atas input
 * - type: string, tipe input HTML (text, date, number, dll.)
 * - inputMode: string (opsional), hint keyboard untuk mobile (tel, numeric, dll.)
 * - value: string, nilai input saat ini (controlled)
 * - onChange: function, dipanggil saat nilai input berubah
 * - error: string (opsional), pesan error jika validasi gagal
 */
export default function Input({
  id,
  label,
  type,
  inputMode = '',
  value = '',
  onChange,
  error = '',
}) {
  return (
    <div className="mb-5">
      <label className="text-sm block mb-1" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete="off"
        {...(inputMode && { inputMode })}
        className={`block w-full p-2 bg-[var(--color-bg)] border border-solid rounded-md h-[32px] focus:outline-none focus:border-[var(--color-ring)] ${
          error ? 'border-red-500' : 'border-[var(--color-border)]'
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
