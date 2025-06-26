const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  roundNumber: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  participants: [{ type: String }], // wallet addresses
  winner: { type: String },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date }
});

module.exports = mongoose.model('Round', roundSchema);
