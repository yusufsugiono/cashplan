/**
 * ComparisonChart — SVG donut chart untuk perbandingan Pemasukan vs Pengeluaran.
 *
 * Props:
 * - totalIncome: number, total pemasukan dalam periode
 * - totalExpense: number, total pengeluaran dalam periode
 */
import { formatRupiah } from '../../lib/currency';

const INCOME_COLOR = '#00adb5';
const EXPENSE_COLOR = '#ef4444';
const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ComparisonChart({ totalIncome, totalExpense }) {
  const grandTotal = totalIncome + totalExpense;
  const incomePct = grandTotal > 0 ? (totalIncome / grandTotal) * 100 : 0;
  const expensePct = grandTotal > 0 ? (totalExpense / grandTotal) * 100 : 0;

  const incomeLength = (incomePct / 100) * CIRCUMFERENCE;
  const expenseLength = (expensePct / 100) * CIRCUMFERENCE;

  return (
    <div className="flex flex-col items-center py-6">
      <svg width="160" height="160" viewBox="0 0 100 100">
        {expensePct > 0 && (
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke={EXPENSE_COLOR}
            strokeWidth="12"
            strokeDasharray={`${expenseLength} ${CIRCUMFERENCE}`}
            strokeDashoffset="0"
            transform="rotate(-90 50 50)"
          />
        )}
        {incomePct > 0 && (
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke={INCOME_COLOR}
            strokeWidth="12"
            strokeDasharray={`${incomeLength} ${CIRCUMFERENCE}`}
            strokeDashoffset={-expenseLength}
            transform="rotate(-90 50 50)"
          />
        )}
        {/* Teks persentase di tengah donut */}
        <text
          x="50"
          y="48"
          textAnchor="middle"
          fill="var(--color-text)"
          fontSize="9"
          fontWeight="bold"
        >
          {incomePct.toFixed(0)}% / {expensePct.toFixed(0)}%
        </text>
      </svg>

      {/* Legend */}
      <div className="flex flex-col gap-2 mt-4 w-full px-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: INCOME_COLOR }}
            />
            <span className="text-sm text-[var(--color-text)]">Pemasukan</span>
          </div>
          <span className="text-sm font-semibold text-[var(--color-text)]">
            {formatRupiah(totalIncome)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: EXPENSE_COLOR }}
            />
            <span className="text-sm text-[var(--color-text)]">Pengeluaran</span>
          </div>
          <span className="text-sm font-semibold text-[var(--color-text)]">
            {formatRupiah(totalExpense)}
          </span>
        </div>
      </div>
    </div>
  );
}
