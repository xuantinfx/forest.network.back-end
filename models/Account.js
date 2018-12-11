let mongoose = require('mongoose');
let PaymentHistorySchema = require('./PaymentHistorySchema');
let TweetSchema = require('./TweetSchema');

let AccountSchema = new mongoose.Schema({
  address: { type: String, required: true, minlength: 56, maxlength: 56, unique: true },
  balance: { type: Number, required: true },
  sequence: { type: Number, required: true, min: 0 },
  bandwidth: { type: Number },
  bandwidthTime: { type: Date },
  displayName: { type: String },
  username: { type: String, required: true },
  avatarUrl: { type: String },
  coverPhotoUrl: { type: String },
  bio: { type: String },
  location: { type: String },
  joinDate: { type: Date, required: true },
  paymentHistory: [PaymentHistorySchema],
  tweets: [TweetSchema],
  followings: [String],
  followers: [String]
})

module.exports = mongoose.model('Account', AccountSchema);