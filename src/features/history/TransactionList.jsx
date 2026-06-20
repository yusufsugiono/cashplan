import TransactionItem from './TransactionItem';

/**
 * TransactionList — container yang menampilkan daftar transaksi yang sudah difilter.
 *
 * Props:
 * - transactions: array of { id, date, description, amount, type }
 * - filter: string ('INCOME' | 'EXPENSE'), tipe transaksi yang ditampilkan
 */
export default function TransactionList({ transactions, filter }) {
  // Filter transaksi berdasarkan tipe yang dipilih
  const filteredTransactions = transactions
    .filter((item) => item.type === filter)
    .sort((a, b) => b.date.localeCompare(a.date));

  // Tampilkan pesan jika tidak ada data
  if (filteredTransactions.length === 0) {
    return (
      <div className="mx-3 mt-5 text-center">
        <p className="text-sm text-[var(--color-muted)]">Belum ada transaksi</p>
      </div>
    );
  }

  return (
    <div className="mx-3 mt-5 border border-solid border-[var(--color-border)] rounded-md overflow-hidden">
      {filteredTransactions.map((item) => (
        <TransactionItem
          key={item.id}
          date={item.date}
          description={item.description}
          amount={item.amount}
        />
      ))}
    </div>
  );
}
