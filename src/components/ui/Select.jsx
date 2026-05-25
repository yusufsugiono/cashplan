export default function Select({ id = '', label = '', options = [] }) {
  return (
    <>
      <label className="text-sm block my-2" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="block mt-2 p-1 mb-5 w-full bg-[var(--color-bg)] border border-solid rounded-md h-[32px]"
      >
        {options.map((item) => {
          return (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>
    </>
  );
}
