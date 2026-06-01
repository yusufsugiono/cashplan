import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus } from 'react-icons/fa6';
import Swal from 'sweetalert2';

import AppBar from '../layouts/AppBar';
import BottomNav from '../layouts/BottomNav';
import BudgetCard from '../features/budgeting/BudgetCard';
import { ROUTES } from '../constants/routes';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../lib/storage';

export default function BudgetingPage() {
  const navigate = useNavigate();

  // State lokal yang di-sync dengan localStorage
  const [budgets, setBudgets] = useState(() => loadFromStorage(STORAGE_KEYS.BUDGETS));

  // ─── Handlers ──────────────────────────────────────────────────────────────

  /** Hapus satu rencana budget berdasarkan ID */
  async function handleDelete(budgetId) {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Hapus Rencana',
      text: 'Yakin ingin menghapus rencana ini?',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
    });

    if (!result.isConfirmed) return;

    const updated = budgets.filter((b) => b.id !== budgetId);
    setBudgets(updated);
    saveToStorage(STORAGE_KEYS.BUDGETS, updated);
  }

  /** Toggle checkbox item dalam satu budget */
  function handleToggleItem(budgetId, itemId) {
    const updated = budgets.map((budget) => {
      if (budget.id !== budgetId) return budget;

      return {
        ...budget,
        items: budget.items.map((item) =>
          item.id === itemId ? { ...item, checked: !item.checked } : item,
        ),
      };
    });

    setBudgets(updated);
    saveToStorage(STORAGE_KEYS.BUDGETS, updated);
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="pb-16">
      <AppBar icon={FaArrowLeft} onBack={() => navigate(-1)}>
        Perencanaan
      </AppBar>

      {/* Daftar budget cards */}
      {budgets.length === 0 ? (
        <div className="mx-3 mt-5 text-center">
          <p className="text-sm text-[var(--color-muted)]">Belum ada rencana anggaran</p>
        </div>
      ) : (
        budgets.map((budget) => (
          <BudgetCard
            key={budget.id}
            label={budget.label}
            totalAmount={budget.totalAmount}
            items={budget.items}
            onDelete={() => handleDelete(budget.id)}
            onEdit={() => navigate(`/budgeting/edit/${budget.id}`)}
            onToggleItem={(itemId) => handleToggleItem(budget.id, itemId)}
          />
        ))
      )}

      {/* FAB button untuk tambah rencana baru */}
      <button
        onClick={() => navigate(ROUTES.ADD_BUDGET)}
        aria-label="Tambah rencana baru"
        className="fixed bottom-20 right-4 flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-btn-submit-bg)] text-[var(--color-btn-submit-text)] shadow-md"
      >
        <FaPlus className="text-lg" />
      </button>

      <BottomNav />
    </div>
  );
}
