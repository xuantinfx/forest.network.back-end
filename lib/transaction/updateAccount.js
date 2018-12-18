const Account = require('../../models/Account')
const processValueOfUpdateAccount = require('../../utilities/processValueOfUpdateAccount')
const base32 = require('base32.js')
const _ = require('lodash')

const processFollowings = (tx, value, resolve, reject) => {
    // Map từ 32 sang 54
    let addresses = _.map(value.addresses, (address) => {
        return base32.encode(address)
    })

    let oldAddresses = [];
    // cập nhật vào DB followings cho account
    Account.findOne({address: tx.account}, {followings: 1})
    .then(res => {
        oldAddresses = res.followings;
        res.followings = addresses;
        return res.save()
    })
    // Tìm các account bị unfollow
    .then(() => {
        let listUnfollowAddress = _.filter(oldAddresses, (oldAddress) => {
            return _.findIndex(addresses, (address) => {
                return address === oldAddress;
            }) < 0;
        })
        return Account.find({address: {"$in": listUnfollowAddress}}, {followers: 1})
    })
    // Cập nhật các account bị unfollow
    .then(async res => {
        let promises = []
        for(let i = 0; i < res.length; i++) {
            // lọc lại và loại bỏ đi account trong danh sách followers
            res[i].followers = _.filter(res[i].followers, (follower) => {
                return follower !== tx.account;
            })
            promises.push(res[i].save());
        }
        await Promise.all(promises)
        return {};
    })
    // Tìm các account được follow
    .then(() => {
        let listFollowAddress = _.filter(addresses, (address) => {
            return _.findIndex(oldAddresses, (oldAddress) => {
                return address === oldAddress;
            }) < 0;
        })
        return Account.find({address: {"$in": listFollowAddress}}, {followers: 1})
    })
    // Cập nhật các account được follow
    .then(async res => {
        let promises = []
        for(let i = 0; i < res.length; i++) {
            // thêm tx.account vào danh sách follower
            res[i].followers.push(tx.account);
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
}

module.exports.in = (tx, timeAddBlock) => {
    return new Promise((resolve, reject) => {
        let {key, value} = tx.params;
        value = processValueOfUpdateAccount(key, value);

        // Trường hợp followings xử lí đặt biệt
        if(key === "followings") {
            processFollowings(tx, value, resolve, reject);
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