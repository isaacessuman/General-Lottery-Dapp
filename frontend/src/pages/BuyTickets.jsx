import { useState } from 'react';
import useWallet from '../useWallet';

export default function BuyTickets() {
  const [count, setCount] = useState(1);
  const [status, setStatus] = useState('');
  const wallet = useWallet();

  const buy = async () => {
    if (!wallet.signer) {
      await wallet.connect();
    }
    setStatus('Sending transaction...');
    try {
      const res = await fetch('/api/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count })
      });
      const data = await res.json();
      const tx = await wallet.signer.sendTransaction(data.tx);
      await tx.wait();
      setStatus('Tickets purchased!');
    } catch (err) {
      console.error(err);
      setStatus('Error purchasing tickets');
    }
  };

  return (
    <div>
      <h2>Buy Tickets</h2>
      <input
        type="number"
        min="1"
        value={count}
        onChange={e => setCount(Number(e.target.value))}
      />
      <button onClick={buy}>Buy</button>
      <p>{status}</p>
    </div>
  );
}
