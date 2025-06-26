const express = require('express');
const router = express.Router();
const Round = require('../models/Round');
const Participant = require('../models/Participant');
const web3 = require('../config/web3');

// Example contract ABI and address (placeholders)
const contractABI = [];
const contractAddress = process.env.CONTRACT_ADDRESS || '0x0';
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Start a new round
router.post('/start', async (req, res) => {
  try {
    const { roundNumber } = req.body;

    // Call smart contract to start round
    const accounts = await web3.eth.getAccounts();
    await contract.methods.startRound(roundNumber).send({ from: accounts[0] });

    // Save round to database
    const round = new Round({ roundNumber });
    await round.save();

    res.json({ message: 'Round started', round });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to start round' });
  }
});

// Close a round
router.post('/close', async (req, res) => {
  try {
    const { roundNumber } = req.body;

    const accounts = await web3.eth.getAccounts();
    const tx = await contract.methods.closeRound(roundNumber).send({ from: accounts[0] });

    const round = await Round.findOneAndUpdate(
      { roundNumber },
      { isActive: false, endedAt: new Date() },
      { new: true }
    );

    res.json({ message: 'Round closed', round, tx });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to close round' });
  }
});

// Get current status
router.get('/status/:roundNumber', async (req, res) => {
  try {
    const { roundNumber } = req.params;
    const round = await Round.findOne({ roundNumber });
    if (!round) return res.status(404).json({ error: 'Round not found' });

    res.json({ round });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve status' });
  }
});

module.exports = router;
