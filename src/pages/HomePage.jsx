import { FaSackDollar, FaArrowUp, FaArrowDown } from 'react-icons/fa6';

import Greeting from '../features/dashboard/Greeting';
import SummaryCard from '../features/dashboard/SummaryCard';
import BottomNav from '../layouts/BottomNav';
import { loadFromStorage, loadSettings, STORAGE_KEYS } from '../lib/storage';
import { formatDateID } from '../lib/date';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Menghitung periode berdasarkan cycleStartDay.
 * Contoh: jika cycleStartDay = 1, maka periode = 1 bulan ini s/d 1 bulan depan.
 *
 * @param {number} cycleStartDay - Tanggal mulai siklus (1-28)
 * @returns {{ start: string, end: string }} Tanggal awal dan akhir periode (formatted)
 */
function calculatePeriod(cycleStartDay) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed

  // Tentukan apakah kita sudah melewati tanggal siklus bulan ini
  let startDate;
  let endDate;

  if (today.getDate() >= cycleStartDay) {
    // Periode: tanggal siklus bulan ini → tanggal siklus bulan depan
    startDate = new Date(year, month, cycleStartDay);
    endDate = new Date(year, month + 1, cycleStartDay);
  } else {
    // Periode: tanggal siklus bulan lalu → tanggal siklus bulan ini
    startDate = new Date(year, month - 1, cycleStartDay);
    endDate = new Date(year, month, cycleStartDay);
  }

  return {
    start: formatDateID(startDate.toISOString()),
    end: formatDateID(endDate.toISOString()),
  };
}

// ─── Komponen ────────────────────────────────────────────────────────────────

export default function HomePage() {
  // Baca settings (nama user, siklus)
  const settings = loadSettings();
  const period = calculatePeriod(settings.cycleStartDay);

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
      <Greeting name={settings.userName} periodStart={period.start} periodEnd={period.end} />

      <SummaryCard icon={FaSackDollar} label="Saldo" amount={balance} />
      <SummaryCard icon={FaArrowUp} label="Pemasukan" amount={totalIncome} />
      <SummaryCard icon={FaArrowDown} label="Pengeluaran" amount={totalExpense} />

      <BottomNav />
    </div>
  );
}
