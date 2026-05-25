import { Route, Routes } from 'react-router-dom';
import AddNewTransaction from './pages/AddNewTransaction';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AddNewTransaction />}></Route>
    </Routes>
  );
}
