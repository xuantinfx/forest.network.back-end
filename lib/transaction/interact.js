const Account = require('../../models/Account')

module.exports.in = (tx, timeAddBlock) => {
    return new Promise((resolve, reject) => {
        console.log('interac', tx)
    })
}