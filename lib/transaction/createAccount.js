const Account = require('../../models/Account')

module.exports.in = (tx) => {
    return new Promise((resolve, reject) => {
        let newAccount = new Account({
            address: tx.params.address,
            balance: 0,
            sequence: 0,
            bandwidth: 0,
        })

        newAccount.save((err, res) => {
            if(err) console.log(err);
        })

        Account.findOneAndUpdate({address: tx.account}, {sequence: tx.sequence}, (err, res) => {
            resolve();
        })
    })
}

module.exports.out = (tx) => {
    console.log("Create Account out")
}