let mongoose = require('mongoose');
let PaymentHistorySchema = require('./PaymentHistorySchema');
let TweetSchema = require('./TweetSchema');

let AccountSchema = new mongoose.Schema({
  address: { type: String, required: true, minlength: 56, maxlength: 56, unique: true },
  balance: { type: Number, required: true },
  sequence: { type: Number, required: true, min: 0 },
  bandwidth: { type: Number },
  bandwidthTime: { type: Number },
  name: { type: String },
  username: { type: String },
  picture: { type: String },
  coverPhotoUrl: { type: String },
  bio: { type: String },
  location: { type: String },
  joinDate: { type: Date },
  paymentHistory: [PaymentHistorySchema],
  tweets: [TweetSchema],
  followings: [String],
  followers: [String]
}, {strict: false})

module.exports = mongoose.model('Account', AccountSchema);