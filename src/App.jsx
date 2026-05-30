import { Route, Routes } from 'react-router-dom';

import { ROUTES } from './constants/routes';
import HomePage from './pages/HomePage';
import AddNewTransaction from './pages/AddNewTransaction';

export default function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.ADD_TRANSACTION} element={<AddNewTransaction />} />
    </Routes>
  );
}
