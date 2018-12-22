const Account = require('../../models/Account')

module.exports.in = (tx, timeAddBlock) => {
    return new Promise((resolve, reject) => {
        Account.findOne({address: tx.account}, {tweets: 1})
        .then(res => {
            res.tweets.push({
                time: (new Date(timeAddBlock)),
                content: tx.params.content.text,
                hash: tx.hash
            })

            return res.save();
        })
        .then(() => {
            resolve();
        })
        .catch(err => {
            console.log(err);
            resolve();
        })
        //resolve();
    })
}