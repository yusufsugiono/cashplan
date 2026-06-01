import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';

import AppBar from '../layouts/AppBar';
import PillButtonGroup from '../components/ui/PillButtonGroup';
import PillButton from '../components/ui/PillButton';
import CashflowForm from '../features/transactions/CashflowForm';
import BottomNav from '../layouts/BottomNav';

// Tipe transaksi yang tersedia
const TRANSACTION_TYPES = {
  EXPENSE: 'EXPENSE',
  INCOME: 'INCOME',
};

export default function AddNewTransaction() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TRANSACTION_TYPES.EXPENSE);

  // Dipanggil oleh CashflowForm setelah data berhasil disimpan
  function handleTransactionSaved() {
    navigate(-1);
  }

  return (
    <>
      <AppBar icon={FaArrowLeft} onBack={() => navigate(-1)}>
        Tambah Catatan
      </AppBar>

      <PillButtonGroup>
        <PillButton
          isActive={activeTab === TRANSACTION_TYPES.INCOME}
          onClick={() => setActiveTab(TRANSACTION_TYPES.INCOME)}
        >
          Pemasukan
        </PillButton>

        <PillButton
          isActive={activeTab === TRANSACTION_TYPES.EXPENSE}
          onClick={() => setActiveTab(TRANSACTION_TYPES.EXPENSE)}
        >
          Pengeluaran
        </PillButton>
      </PillButtonGroup>

      <CashflowForm mode={activeTab} onSaved={handleTransactionSaved} />
      <BottomNav />
    </>
  );
}
