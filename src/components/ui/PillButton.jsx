export default function PillButton({ isActive, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-sm uppercase flex-1 ${isActive ? 'm-1 border-2 border-solid border-[var(--color-ring)] rounded-2xl bg-[var(--color-border)]' : 'text-[var(--color-muted)]'}`}
    >
      {children}
    </button>
  );
}
