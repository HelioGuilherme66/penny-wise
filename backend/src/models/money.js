const mongoose = require('mongoose');

const moneySchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'United States Dollar' },
  coins: [
    {
      value: { type: Number, required: true },
      image: { type: String, required: true },
    },
  ],
  notes: [
    {
      value: { type: Number, required: true },
      image: { type: String, required: true },
    },
  ],
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
  },
});

module.exports = mongoose.model('Money', moneySchema);
