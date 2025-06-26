import { useState } from 'react';
import { BrowserProvider } from 'ethers';

export default function useWallet() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState('');

  const connect = async () => {
    if (!window.ethereum) {
      alert('MetaMask is required');
      return;
    }
    const prov = new BrowserProvider(window.ethereum);
    await prov.send('eth_requestAccounts', []);
    const signer = await prov.getSigner();
    setProvider(prov);
    setSigner(signer);
    setAddress(await signer.getAddress());
  };

  return { provider, signer, address, connect };
}
