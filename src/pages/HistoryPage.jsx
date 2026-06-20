import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';

import AppBar from '../layouts/AppBar';
import BottomNav from '../layouts/BottomNav';
import PillButtonGroup from '../components/ui/PillButtonGroup';
import PillButton from '../components/ui/PillButton';
import TransactionList from '../features/history/TransactionList';
import ComparisonChart from '../features/history/ComparisonChart';
import ExpenseChart from '../features/history/ExpenseChart';
import IncomeChart from '../features/history/IncomeChart';
import PeriodSelector from '../features/history/PeriodSelector';
import { loadFromStorage, loadSettings, STORAGE_KEYS } from '../lib/storage';
import { getPeriodRange } from '../lib/period';
import { groupByCategory, computeComparison } from '../features/history/chartUtils';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('INCOME');
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Ambil data transaksi dan settings dari localStorage
  const transactions = loadFromStorage(STORAGE_KEYS.TRANSACTIONS);
  const settings = loadSettings();

  // Filter transaksi berdasarkan periode yang dipilih
  const period = getPeriodRange(settings.cycleStartDay, selectedPeriod);
  const periodTransactions = transactions.filter(
    (t) => t.date >= period.startRaw && t.date < period.endRaw,
  );

  // Data untuk chart
  const { totalIncome, totalExpense } = computeComparison(periodTransactions);
  const expenseCategories = groupByCategory(periodTransactions, 'EXPENSE');
  const incomeCategories = groupByCategory(periodTransactions, 'INCOME');

  // Filter transaksi yang sudah difilter kategori (untuk TransactionList di tab Statistik)
  const filteredByCategory = selectedCategory
    ? periodTransactions.filter(
        (t) => t.category === selectedCategory.category && t.type === selectedCategory.type,
      )
    : periodTransactions;

  // Toggle kategori: klik kategori yang sama → null (reset), klik kategori lain → set
  const handleCategoryClick = useCallback(({ category, type }) => {
    setSelectedCategory((prev) => {
      if (prev && prev.category === category && prev.type === type) {
        return null;
      }
      return { category, type };
    });
  }, []);

  // Reset selectedCategory saat pindah tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedCategory(null);
  };

  return (
    <div className="pb-16">
      <AppBar icon={FaArrowLeft} onBack={() => navigate(-1)}>
        Riwayat
      </AppBar>

      <PillButtonGroup>
        <PillButton isActive={activeTab === 'INCOME'} onClick={() => handleTabChange('INCOME')}>
          Pemasukan
        </PillButton>

        <PillButton isActive={activeTab === 'EXPENSE'} onClick={() => handleTabChange('EXPENSE')}>
          Pengeluaran
        </PillButton>

        <PillButton
          isActive={activeTab === 'STATISTICS'}
          onClick={() => handleTabChange('STATISTICS')}
        >
          Statistik
        </PillButton>
      </PillButtonGroup>

      {activeTab === 'STATISTICS' ? (
        selectedCategory ? (
          <TransactionList transactions={filteredByCategory} filter={selectedCategory.type} />
        ) : (
          <>
            <div className="mt-3 mb-2">
              <PeriodSelector selected={selectedPeriod} onChange={setSelectedPeriod} />
            </div>
            <ComparisonChart totalIncome={totalIncome} totalExpense={totalExpense} />
            <ExpenseChart categories={expenseCategories} onCategoryClick={handleCategoryClick} />
            <IncomeChart categories={incomeCategories} onCategoryClick={handleCategoryClick} />
          </>
        )
      ) : (
        <TransactionList transactions={transactions} filter={activeTab} />
      )}

      <BottomNav />
    </div>
  );
}
