import { Routes, Route, Link } from 'react-router-dom';
import BuyTickets from './pages/BuyTickets';
import CurrentPool from './pages/CurrentPool';
import Winners from './pages/Winners';

export default function App() {
  return (
    <>
      <nav>
        <Link to="/">Buy</Link>
        <Link to="/pool">Pool</Link>
        <Link to="/winners">Winners</Link>
      </nav>
      <Routes>
        <Route path="/" element={<BuyTickets />} />
        <Route path="/pool" element={<CurrentPool />} />
        <Route path="/winners" element={<Winners />} />
      </Routes>
    </>
  );
}
