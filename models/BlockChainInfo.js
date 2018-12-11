let mongoose = require('mongoose');

let BlockChainInfoSchema = new mongoose.Schema({
  currentHeight: { type: Number, required: true },
  blocks: {type: Array}
}, { strict: false })

module.exports = mongoose.model('BlockChainInfo', BlockChainInfoSchema);