const { RESERVE_RATIO, MAX_BLOCK_SIZE, BANDWIDTH_PERIOD } = require('../../constant');

const NETWORK_BANDWIDTH = RESERVE_RATIO * MAX_BLOCK_SIZE * BANDWIDTH_PERIOD;
module.exports.NETWORK_BANDWIDTH = NETWORK_BANDWIDTH;


module.exports.getUsedBandwidthByAccount = function (account) {
  //tính khoảng thời gian giữa thời điểm hiện tại và thời điểm gần nhất đã sử dụng năng lượng
  const diff = account.bandwidthTime
    ? moment().unix() - moment(account.bandwidthTime).unix()
    : BANDWIDTH_PERIOD;

  return Math.ceil(Math.max(0, (BANDWIDTH_PERIOD - diff) / BANDWIDTH_PERIOD) * account.bandwidth);
};

module.exports.getMaxBandwidthByAccount = function (account) {
  //tính mức năng lượng tối đa mà tài khoản có thể sử dụng (phụ thuộc vào độ giàu của tài khoản)
  return Math.floor(account.balance / MAX_CELLULOSE * NETWORK_BANDWIDTH);
};

module.exports.getAvailableBandwidthByAccount = function (account) {
  return getMaxBandwidthByAccount(account) - getUsedBandwidthByAccount(account);
};

