const Account = require('../../models/Account')
const processValueOfUpdateAccount = require('../../utilities/processValueOfUpdateAccount')
const base32 = require('base32.js')
const _ = require('lodash')

module.exports.in = (tx, timeAddBlock) => {
    return new Promise((resolve, reject) => {
        let {key, value} = tx.params;
        value = processValueOfUpdateAccount(key, value);

        // Trường hợp followings xử lí đặt biệt
        if(key === "followings") {
            let addresses = _.map(value.addresses, (address) => {
                return base32.encode(address)
            })
            Account.findOne({address: tx.account}, {followings: 1})
            .then(res => {
                res.followings = _.uniq(res.followings.concat(addresses));
                return res.save()
            })
            .then(() => {
                return Account.find({address: {"$in": addresses}}, {followers: 1})
            })
            .then(async res => {
                let promises = []
                for(let i = 0; i < res.length; i++) {
                    res[i].followers = _.uniq(res[i].followers.concat([tx.account]));
                    promises.push(res[i].save());
                }
                await Promise.all(promises)
                return {};
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