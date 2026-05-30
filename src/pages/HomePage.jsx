import { FaDiamond, FaArrowUp, FaArrowDown } from 'react-icons/fa6';

import Greeting from '../features/dashboard/Greeting';
import SummaryCard from '../features/dashboard/SummaryCard';
import BottomNav from '../layouts/BottomNav';

/**
 * Data dummy untuk development.
 * TODO: Ganti dengan data dari localStorage setelah fitur penyimpanan selesai.
 */
const DUMMY_DATA = {
  userName: 'Yusuf Sugiono',
  periodStart: '1 Apr 2026',
  periodEnd: '1 Mei 2026',
  balance: 10_000_000,
  income: 15_000_000,
  expense: 5_000_000,
};

export default function HomePage() {
  return (
    // pb-16 memberi ruang agar konten tidak tertutup BottomNav yang fixed
    <div className="pb-16">
      <Greeting
        name={DUMMY_DATA.userName}
        periodStart={DUMMY_DATA.periodStart}
        periodEnd={DUMMY_DATA.periodEnd}
      />

      <SummaryCard icon={FaDiamond} label="Saldo" amount={DUMMY_DATA.balance} />
      <SummaryCard icon={FaArrowUp} label="Pemasukan" amount={DUMMY_DATA.income} />
      <SummaryCard icon={FaArrowDown} label="Pengeluaran" amount={DUMMY_DATA.expense} />

      <BottomNav />
    </div>
  );
}
