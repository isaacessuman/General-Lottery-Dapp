const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  address: { type: String, required: true },
  roundNumber: { type: Number, required: true },
  joinedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Participant', participantSchema);
