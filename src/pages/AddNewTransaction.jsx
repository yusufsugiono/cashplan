import { useState } from 'react';
import AppBar from '../layouts/AppBar';
import PillButtonGroup from '../components/ui/PillButtonGroup';
import PillButton from '../components/ui/PillButton';
import CashflowForm from '../features/transactions/CashflowForm';
import { FaArrowLeft } from 'react-icons/fa6';

export default function AddNewTransaction() {
  const [activeTab, setActiveTab] = useState('EXPENSE');

  return (
    <>
      <AppBar icon={FaArrowLeft}>New Transaction</AppBar>

      <PillButtonGroup>
        <PillButton isActive={activeTab === 'EXPENSE'} onClick={() => setActiveTab('EXPENSE')}>
          Expense
        </PillButton>

        <PillButton isActive={activeTab === 'INCOME'} onClick={() => setActiveTab('INCOME')}>
          Income
        </PillButton>
      </PillButtonGroup>

      <CashflowForm mode={activeTab} />
    </>
  );
}
