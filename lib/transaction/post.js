const Account = require('../../models/Account');
const socket = require('../../socket');

module.exports.in = (tx, timeAddBlock) => {
    return new Promise((resolve, reject) => {
        Account.findOne({address: tx.account}, {tweets: 1, followers: 1, address: 1, name: 1})
        .then(res => {
            res.tweets.push({
                time: (new Date(timeAddBlock)),
                content: tx.params.content.text,
                hash: tx.hash
            })

            // send socket
            socket.post(res, tx.params.content.text);

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