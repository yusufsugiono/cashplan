export default function PillButtonGroup({ children }) {
  return (
    <div className="mx-3 border-2 border-solid rounded-3xl border-[var(--color-ring)] flex">
      {children}
    </div>
  );
}
