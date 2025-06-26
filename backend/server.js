const express = require('express');
const { ethers } = require('ethers');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// basic setup for interacting with the Lottery contract
const providerUrl = process.env.RPC_URL;
const contractAddress = process.env.CONTRACT_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;

let lottery;
if (providerUrl && contractAddress) {
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  const signer = privateKey ? new ethers.Wallet(privateKey, provider) : provider;
  const abi = [
    'function enter() external payable',
    'function getPlayers() view returns (address[] memory)'
  ];
  lottery = new ethers.Contract(contractAddress, abi, signer);
}

app.get('/', (req, res) => {
  res.send('Lottery backend running');
});

app.get('/players', async (req, res) => {
  if (!lottery) return res.status(500).json({ error: 'Contract not configured' });
  try {
    const players = await lottery.getPlayers();
    res.json({ players });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

app.post('/enter', async (req, res) => {
  if (!lottery) return res.status(500).json({ error: 'Contract not configured' });
  try {
    const value = ethers.utils.parseEther(req.body.amount || '0.01');
    const tx = await lottery.enter({ value });
    await tx.wait();
    res.json({ txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to enter lottery' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
