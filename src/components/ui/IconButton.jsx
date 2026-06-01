/**
 * IconButton — tombol reusable dengan icon dan label teks.
 *
 * Props:
 * - icon: React component icon (dari react-icons)
 * - children: string label teks
 * - variant: 'default' | 'danger' | 'primary' — menentukan warna hover
 * - onClick: function
 * - className: string (optional), class tambahan
 */

const VARIANTS = {
  default: 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-ring)]',
  danger: 'text-[var(--color-muted)] hover:text-red-500 hover:border-red-500',
  primary: 'text-[var(--color-muted)] hover:text-blue-500 hover:border-blue-500',
};

export default function IconButton({ icon: Icon, children, variant = 'default', onClick, className = '' }) {
  const variantClass = VARIANTS[variant] || VARIANTS.default;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1 px-4 py-1 text-sm border border-solid border-[var(--color-border)] rounded-md ${variantClass} ${className}`}
    >
      {Icon && <Icon />}
      {children}
    </button>
  );
}
