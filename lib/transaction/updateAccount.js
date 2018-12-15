const Account = require('../../models/Account')
const processValueOfUpdateAccount = require('../../utilities/processValueOfUpdateAccount')

module.exports.in = (tx, timeAddBlock) => {
    return new Promise((resolve, reject) => {
        let {key, value} = tx.params;
        value = processValueOfUpdateAccount(key, value);

        // Trường hợp followings xử lí đặt biệt
        if(key === "followings") {
            Account.findOne({address: tx.account}, {followings: 1})
            .then(res => {
                res.followings.push(value.addresses);
                return res.save()
            })
            .then(() => {
                Account.findOne({address: value.addresses}, {followers: 1})
            })
            .then(res => {
                res.followers.push(tx.account)
                return res.save();
            })
            .then(() => {
                resolve();
            })
            .catch(err => {
                console.log(err);
                resolve();
            })
        } else {
            Account.findOneAndUpdate({address: tx.account}, {[key]: value})
            .then(res => {
                resolve();
            })
            .catch(err => {
                resolve();
            })
        }
    })
}