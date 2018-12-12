let mongoose = require('mongoose');
module.exports = new mongoose.Schema({
  time: { type: Date },
  fromOrTo: { type: String, required: true },
  amount: { type: Number, required: true }
})