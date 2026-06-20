/**
 * Utility functions untuk aggregasi data chart di tab Statistik.
 */
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../constants/categories';

/**
 * Warna untuk setiap kategori pada bar chart.
 * Menggunakan array tetap agar warna konsisten antar render.
 */
export const CATEGORY_COLORS = [
  '#00adb5',
  '#ef4444',
  '#f59e0b',
  '#8b5cf6',
  '#06b6d4',
  '#84cc16',
  '#f97316',
  '#ec4899',
  '#14b8a6',
  '#6366f1',
  '#d946ef',
  '#22c55e',
  '#eab308',
];

/**
 * Mendapatkan warna untuk index kategori tertentu.
 *
 * @param {number} index - Index kategori
 * @returns {string} Warna hex
 */
export function getCategoryColor(index) {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
}

/**
 * Mengelompokkan transaksi per kategori berdasarkan tipe.
 * Hanya mengembalikan kategori yang memiliki transaksi (amount > 0).
 * Diurutkan dari amount terbesar ke terkecil.
 *
 * @param {Array} transactions - Array transaksi
 * @param {'INCOME'|'EXPENSE'} type - Tipe transaksi
 * @returns {Array<{name: string, category: string, amount: number, percentage: number}>}
 */
export function groupByCategory(transactions, type) {
  const categories = type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const filtered = transactions.filter((t) => t.type === type);
  const total = filtered.reduce((sum, t) => sum + t.amount, 0);

  return categories
    .map((cat) => {
      const amount = filtered
        .filter((t) => t.category === cat.value)
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        name: cat.label,
        category: cat.value,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      };
    })
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);
}

/**
 * Menghitung total pemasukan dan pengeluaran dari array transaksi.
 *
 * @param {Array} transactions - Array transaksi
 * @returns {{ totalIncome: number, totalExpense: number }}
 */
export function computeComparison(transactions) {
  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);
  return { totalIncome, totalExpense };
}
