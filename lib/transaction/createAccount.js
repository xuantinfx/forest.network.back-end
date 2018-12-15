const Account = require('../../models/Account')

module.exports.in = (tx, timeAddBlock) => {
    return new Promise((resolve, reject) => {
        let newAccount = new Account({
            address: tx.params.address,
            balance: 0,
            sequence: 0,
            bandwidth: 0,
            joinDate: (new Date(timeAddBlock))
        })

        newAccount.save((err, res) => {
            if(err) console.log(err);
        })

        Account.findOneAndUpdate({address: tx.account}, {sequence: tx.sequence}, (err, res) => {
            resolve();
        })
    })
}