import { Route, Routes } from 'react-router-dom';

import { ROUTES } from './constants/routes';
import HomePage from './pages/HomePage';
import AddNewTransaction from './pages/AddNewTransaction';
import HistoryPage from './pages/HistoryPage';

export default function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.ADD_TRANSACTION} element={<AddNewTransaction />} />
      <Route path={ROUTES.HISTORY} element={<HistoryPage />} />
    </Routes>
  );
}
