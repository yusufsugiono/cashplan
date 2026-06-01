import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';

import AppBar from '../layouts/AppBar';
import BudgetForm from '../features/budgeting/BudgetForm';
import { loadFromStorage, STORAGE_KEYS } from '../lib/storage';

export default function EditBudgetPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Cari budget berdasarkan ID dari URL
  const budgets = loadFromStorage(STORAGE_KEYS.BUDGETS);
  const budget = budgets.find((b) => String(b.id) === id);

  // Jika budget tidak ditemukan, kembali ke halaman sebelumnya
  if (!budget) {
    return (
      <>
        <AppBar icon={FaArrowLeft} onBack={() => navigate(-1)}>
          Edit Rencana
        </AppBar>
        <div className="mx-3 mt-5 text-center">
          <p className="text-sm text-[var(--color-muted)]">Rencana tidak ditemukan</p>
        </div>
      </>
    );
  }

  function handleSaved() {
    navigate(-1);
  }

  return (
    <>
      <AppBar icon={FaArrowLeft} onBack={() => navigate(-1)}>
        Edit Rencana
      </AppBar>

      <BudgetForm onSaved={handleSaved} editData={budget} />
    </>
  );
}
