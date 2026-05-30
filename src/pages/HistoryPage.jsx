import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';

import AppBar from '../layouts/AppBar';
import BottomNav from '../layouts/BottomNav';
import PillButtonGroup from '../components/ui/PillButtonGroup';
import PillButton from '../components/ui/PillButton';
import TransactionList from '../features/history/TransactionList';
import { loadFromStorage, STORAGE_KEYS } from '../lib/storage';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('INCOME');

  // Ambil data transaksi dari localStorage
  const transactions = loadFromStorage(STORAGE_KEYS.TRANSACTIONS);

  return (
    <div className="pb-16">
      <AppBar icon={FaArrowLeft} onBack={() => navigate(-1)}>
        Riwayat
      </AppBar>

      <PillButtonGroup>
        <PillButton isActive={activeTab === 'INCOME'} onClick={() => setActiveTab('INCOME')}>
          Pemasukan
        </PillButton>

        <PillButton isActive={activeTab === 'EXPENSE'} onClick={() => setActiveTab('EXPENSE')}>
          Pengeluaran
        </PillButton>
      </PillButtonGroup>

      <TransactionList transactions={transactions} filter={activeTab} />

      <BottomNav />
    </div>
  );
}
