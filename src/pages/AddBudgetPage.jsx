import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';

import AppBar from '../layouts/AppBar';
import BudgetForm from '../features/budgeting/BudgetForm';

export default function AddBudgetPage() {
  const navigate = useNavigate();

  // Setelah form disimpan, kembali ke halaman list budgeting
  function handleSaved() {
    navigate(-1);
  }

  return (
    <>
      <AppBar icon={FaArrowLeft} onBack={() => navigate(-1)}>
        Tambah Rencana
      </AppBar>

      <BudgetForm onSaved={handleSaved} />
    </>
  );
}
