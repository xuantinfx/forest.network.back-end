const moment = require('moment')
const { RESERVE_RATIO, MAX_BLOCK_SIZE, BANDWIDTH_PERIOD } = require('../../constant');

const NETWORK_BANDWIDTH = RESERVE_RATIO * MAX_BLOCK_SIZE * BANDWIDTH_PERIOD;
module.exports.NETWORK_BANDWIDTH = NETWORK_BANDWIDTH;

// Trả về bandwidth đã sử dụng kể từ lần trước
const getUsedBandwidthByAccount = function (account = {bandwidthTime, bandwidth: 0}, now) {
  //tính khoảng thời gian giữa thời điểm hiện tại và thời điểm gần nhất đã sử dụng năng lượng
  const diff = account.bandwidthTime
    ? now - moment(account.bandwidthTime).unix()
    : BANDWIDTH_PERIOD;

  return Math.ceil(Math.max(0, (BANDWIDTH_PERIOD - diff) / BANDWIDTH_PERIOD) * account.bandwidth);
};

// Trả về số lượng bandwidth tối đa có thể sử dụng của account
const getMaxBandwidthByAccount = function (account) {
  //tính mức năng lượng tối đa mà tài khoản có thể sử dụng (phụ thuộc vào độ giàu của tài khoản)
  return Math.floor(account.balance / MAX_CELLULOSE * NETWORK_BANDWIDTH);
};

// Tính bandwidth còn lại từ DB
module.exports.getAvailableBandwidthByAccount = function (account) {
  return getMaxBandwidthByAccount(account, moment().unix()) - getUsedBandwidthByAccount(account);
};

// Tính bandwidth đã sử dụng từ block
module.exports.getUsedBandwidthFromBlock = function(oldBandwidth = 0, oldBandwidthTime, txSize, blockTime) {
  let account = {
    bandwidthTime: oldBandwidthTime,
    bandwidth: oldBandwidth,
  }
  return (getUsedBandwidthByAccount(account, blockTime) + txSize);
}

