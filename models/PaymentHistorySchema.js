let mongoose = require('mongoose');
module.exports = new mongoose.Schema({
  time: { type: Date, required: true },
  to: { type: String, required: true },
  amount: { type: Number, required: true }
})