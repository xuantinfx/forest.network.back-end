const { decode } = require('./encrypt')
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

    // Update bandWidth & bandWidthTime
    try {
        let res = await Account.findOne({address: txObj.account}, {bandWidth: 1, bandWidthTime: 1});

        // Nếu là account đầu tiên của blockchain thì bỏ qua 1 vài transaction đầu
        if(res) {
            res.bandwidth = getUsedBandwidthFromBlock(res.bandwidth, res.bandwidthTime, tx.length, moment(timeAddBlock).unix())
            res.bandwidthTime = moment(timeAddBlock).unix();
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