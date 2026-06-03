import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ROUTES } from './constants/routes';
import HomePage from './pages/HomePage';
import AddNewTransaction from './pages/AddNewTransaction';
import HistoryPage from './pages/HistoryPage';
import BudgetingPage from './pages/BudgetingPage';
import AddBudgetPage from './pages/AddBudgetPage';
import EditBudgetPage from './pages/EditBudgetPage';
import SettingsPage from './pages/SettingsPage';
import { loadSettings } from './lib/storage';

export default function App() {
  // Terapkan tema yang tersimpan saat aplikasi pertama kali dimuat
  useEffect(() => {
    const settings = loadSettings();
    const html = document.documentElement;
    if (settings.theme === 'light') {
      html.setAttribute('data-theme', 'light');
    } else if (settings.theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
  }, []);

  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.ADD_TRANSACTION} element={<AddNewTransaction />} />
      <Route path={ROUTES.HISTORY} element={<HistoryPage />} />
      <Route path={ROUTES.BUDGETING} element={<BudgetingPage />} />
      <Route path={ROUTES.ADD_BUDGET} element={<AddBudgetPage />} />
      <Route path={ROUTES.EDIT_BUDGET} element={<EditBudgetPage />} />
      <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
    </Routes>
  );
}
