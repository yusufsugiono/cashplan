import { useEffect } from 'react';
import { FaSackDollar, FaArrowUp, FaArrowDown } from 'react-icons/fa6';

import Greeting from '../features/dashboard/Greeting';
import SummaryCard from '../features/dashboard/SummaryCard';
import BottomNav from '../layouts/BottomNav';
import { loadFromStorage, loadSettings, STORAGE_KEYS } from '../lib/storage';
import { formatDateID } from '../lib/date';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Mengubah Date object ke format string YYYY-MM-DD local time.
 */
function toDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Menghitung periode berdasarkan cycleStartDay.
 * Contoh: jika cycleStartDay = 1, maka periode = 1 bulan ini s/d 1 bulan depan.
 *
 * @param {number} cycleStartDay - Tanggal mulai siklus (1-28)
 * @returns {{ start: string, end: string, startRaw: string, endRaw: string }} Tanggal awal dan akhir periode
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
    startRaw: toDateString(startDate),
    endRaw: toDateString(endDate),
  };
}

// ─── Komponen ────────────────────────────────────────────────────────────────

export default function HomePage() {
  // ─── Back button handling untuk PWA ──────────────────────────────────────
  // Saat di halaman Home, tekan back = keluar dari app (behavior native Android).
  // Kita pastikan tidak ada history entry yang tersisa di belakang Home.
  useEffect(() => {
    // Push state dummy agar ada entry yang bisa di-pop
    window.history.pushState({ home: true }, '');

    function handlePopState(e) {
      // Jika user menekan back di Home, biarkan browser/OS handle (close PWA)
      // Tidak perlu push ulang — biarkan history habis sehingga OS menutup app
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Baca settings (nama user, siklus)
  const settings = loadSettings();
  const period = calculatePeriod(settings.cycleStartDay);

  // Ambil semua transaksi dari localStorage
  const transactions = loadFromStorage(STORAGE_KEYS.TRANSACTIONS);

  // Filter transaksi yang masuk dalam periode siklus aktif
  const transactionsThisPeriod = transactions.filter((t) => {
    return t.date >= period.startRaw && t.date < period.endRaw;
  });

  // Hitung total pemasukan dan pengeluaran dari data periode ini
  const totalIncome = transactionsThisPeriod
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactionsThisPeriod
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
