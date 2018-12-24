const { decode, hash } = require('./encrypt')
const createAccount = require('./createAccount')
const payment = require('./payment')
const interact = require('./interact')
const post = require('./post');
const updateAccount = require('./updateAccount')
const Account = require('../../models/Account')
const { getUsedBandwidthFromBlock } = require('../bandwidth')
const moment = require('moment')

module.exports.execute = async (tx, timeAddBlock) => {
    let txObj = decode(Buffer.from(tx, 'base64'));

    try {
        txObj.hash = hash(txObj);
    } catch (err) {
        return new Promise((resolve, reject) => {
            console.log("Error hash tx", txObj);
            resolve()
        })
    }

    // Update bandWidth & bandWidthTime & sequence
    try {
        let res = await Account.findOne({ address: txObj.account }, { bandwidth: 1, bandwidthTime: 1, sequence: 1 });
        let txSize = Buffer.from(tx, 'base64').length;

        // Nếu là account đầu tiên của blockchain thì bỏ qua 1 vài transaction đầu
        if (res) {
            res.bandwidth = getUsedBandwidthFromBlock(res.bandwidth, res.bandwidthTime, txSize, moment(timeAddBlock).unix())
            res.bandwidthTime = moment(timeAddBlock).unix();
            res.sequence = txObj.sequence;
            await res.save();
        }
    } catch (error) {
        console.error(error);
    }

    switch (txObj.operation) {
        case 'create_account':
            console.log('create account', txObj)
            return createAccount.in(txObj, timeAddBlock);
        case 'payment':
            console.log('payment', txObj)
            return payment.in(txObj, timeAddBlock);
        case 'post':
            console.log('post', txObj)
            return post.in(txObj, timeAddBlock);
        case 'interact':
            console.log('interact', txObj)
            return interact.in(txObj, timeAddBlock);
        case 'update_account':
            console.log('update_account', txObj)
            return updateAccount.in(txObj, timeAddBlock);
        default:
            return new Promise((resolve, reject) => {
                console.log('Cannot support Method', txObj.operation);
                resolve()
            })
    }
}