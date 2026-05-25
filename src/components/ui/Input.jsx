export default function Input({ id, label, type, inputMode = '' }) {
  return (
    <>
      <label className="text-sm block my-2" htmlFor={id}>
        {label}
      </label>
      <input
        className="block mt-2 p-2 mb-5 w-full bg-[var(--color-bg)] border border-solid rounded-md h-[32px]"
        type={type}
        {...(inputMode && { inputMode })}
        id={id}
        name={id}
        autoComplete="off"
      />
    </>
  );
}
