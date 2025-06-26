import { useEffect, useState } from 'react';

export default function CurrentPool() {
  const [pool, setPool] = useState(null);

  useEffect(() => {
    fetch('/api/pool')
      .then(res => res.json())
      .then(data => setPool(data.amount))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Current Pool</h2>
      <p>{pool !== null ? `${pool} ETH` : 'Loading...'}</p>
    </div>
  );
}
