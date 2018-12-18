const Account = require('../../models/Account')

module.exports.in = (tx, timeAddBlock) => {
    return new Promise((resolve, reject) => {
        // Update tài khoản gửi
        Account.findOne({address: tx.account}, (err, res) => {
            if(err) throw err;

            // Tài khoản của thầy
            if(!res) {
                res = new Account({
                    address: tx.account,
                    balance: Number.MAX_SAFE_INTEGER,
                    sequence: tx.sequence,
                    bandwidth: 0,
                })
            }
            res.paymentHistory = res.paymentHistory || []
            res.paymentHistory.push({
                time: new Date(timeAddBlock),
                fromOrTo: tx.params.address,
                amount: -tx.params.amount
            })
            res.balance = res.balance - tx.params.amount;
            res.save();

            // Update tài khoản nhận
            Account.findOne({address: tx.params.address}, (err1, res1) => {
                if(err1) throw err1;
                res1.paymentHistory.push({
                    time: new Date(timeAddBlock),
                    fromOrTo: tx.account,
                    amount: tx.params.amount
                })
                res1.balance = res1.balance + tx.params.amount;
                res1.save((e, r) => {
                    resolve();
                });
            })
        })
    })
}