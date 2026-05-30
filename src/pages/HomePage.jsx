import { FaDiamond, FaArrowUp, FaArrowDown } from 'react-icons/fa6';

import Greeting from '../features/dashboard/Greeting';
import SummaryCard from '../features/dashboard/SummaryCard';
import BottomNav from '../layouts/BottomNav';
import { loadFromStorage, STORAGE_KEYS } from '../lib/storage';

export default function HomePage() {
  // Ambil semua transaksi dari localStorage
  const transactions = loadFromStorage(STORAGE_KEYS.TRANSACTIONS);

  // Hitung total pemasukan dan pengeluaran dari data yang tersimpan
  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    // pb-16 memberi ruang agar konten tidak tertutup BottomNav yang fixed
    <div className="pb-16">
      <Greeting name="Yusuf Sugiono" periodStart="1 Apr 2026" periodEnd="1 Mei 2026" />

      <SummaryCard icon={FaDiamond} label="Saldo" amount={balance} />
      <SummaryCard icon={FaArrowUp} label="Pemasukan" amount={totalIncome} />
      <SummaryCard icon={FaArrowDown} label="Pengeluaran" amount={totalExpense} />

      <BottomNav />
    </div>
  );
}
