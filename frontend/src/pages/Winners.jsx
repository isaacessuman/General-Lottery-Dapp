import { useEffect, useState } from 'react';

export default function Winners() {
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    fetch('/api/winners')
      .then(res => res.json())
      .then(data => setWinners(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Winners</h2>
      <ul>
        {winners.map((w, idx) => (
          <li key={idx}>{w}</li>
        ))}
      </ul>
    </div>
  );
}
