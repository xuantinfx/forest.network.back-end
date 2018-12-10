let mongoose = require('mongoose');
module.exports = new mongoose.Schema({
  from: { type: String, required: true },
  time: { type: Date, required: true },
  keys: [], //Key size = 0 => no encrypt | Key size = 1 => only me 
  content: { type: String }, // Maximum length 65536 in bytes
  imgUrl: { type: String },
  replies: [new mongoose.Schema({
    from: { type: String, required: true },
    time: { type: Date, required: true },
    content: { type: String, required: true }
  })],
  likes: [new mongoose.Schema({
    from: { type: String, required: true },
    time: { type: Date, required: true }
  })]
})