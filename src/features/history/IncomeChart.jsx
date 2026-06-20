/**
 * IncomeChart — Horizontal bar chart untuk pemasukan per kategori.
 *
 * Props:
 * - categories: Array<{ name: string, category: string, amount: number, percentage: number }>
 * - onCategoryClick?: (category: string) => void
 */
import { formatRupiah } from '../../lib/currency';
import { getCategoryColor } from './chartUtils';

export default function IncomeChart({ categories, onCategoryClick }) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--color-muted)]">
        <p>Belum ada transaksi pemasukan</p>
      </div>
    );
  }

  const total = categories.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="px-4 py-4">
      <p className="text-sm text-[var(--color-muted)] mb-1">Total Pemasukan</p>
      <p className="text-lg font-bold text-[var(--color-text)] mb-4">{formatRupiah(total)}</p>
      <div className="space-y-3">
        {categories.map((cat, idx) => (
          <div
            key={cat.category}
            onClick={() => onCategoryClick?.({ category: cat.category, type: 'INCOME' })}
            className={onCategoryClick ? 'cursor-pointer' : ''}
          >
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[var(--color-text)]">{cat.name}</span>
              <span className="text-[var(--color-text)] font-medium">
                {formatRupiah(cat.amount)}
              </span>
            </div>
            <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${cat.percentage}%`,
                  backgroundColor: getCategoryColor(idx),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
