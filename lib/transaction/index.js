const { decode } = require('./encrypt')
const createAccount = require('./createAccount')
const payment = require('./payment')

module.exports.execute = (tx, timeAddBlock) => {
    let txObj = decode(Buffer.from(tx, 'base64'));
    switch (txObj.operation) {
        case 'create_account':
            console.log('create account', txObj)
            return createAccount.in(txObj, timeAddBlock);
        case 'payment': 
            console.log('payment', txObj)
            return payment.in(txObj, timeAddBlock);
        default:
            return new Promise((resolve, reject) => {
                console.log('Cannot support Method', txObj.operation);
                resolve()
            })
    }
}