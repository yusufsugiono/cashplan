/**
 * Input — text input dengan label.
 *
 * Props:
 * - id: string, dipakai untuk menghubungkan label dan input (htmlFor/id)
 * - label: string, teks label yang tampil di atas input
 * - type: string, tipe input HTML (text, date, number, dll.)
 * - inputMode: string (opsional), hint keyboard untuk mobile (tel, numeric, dll.)
 * - value: string, nilai input saat ini (controlled)
 * - onChange: function, dipanggil saat nilai input berubah
 */
export default function Input({ id, label, type, inputMode = '', value = '', onChange }) {
  return (
    <>
      <label className="text-sm block my-2" htmlFor={id}>
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
        className="block mt-2 p-2 mb-5 w-full bg-[var(--color-bg)] border border-solid rounded-md h-[32px]"
      />
    </>
  );
}
