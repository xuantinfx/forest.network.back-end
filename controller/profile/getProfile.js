const { responseData } = require('../../utilities/responseData')
var account = require('../../models/Account')
var _ = require('lodash')

module.exports = (req, res, next) => {
    account.findOne({address: req.params.address},
    (err, accountInfo)=> {
        if(accountInfo)
        {   
            let accountInfoObj = accountInfo.toObject()
            accountInfoObj.tweetsTotal = accountInfoObj.tweets.length;
            accountInfoObj = _.omit(accountInfoObj,['tweets'])
            responseData(res, accountInfoObj, 200, {});
        }
        else{
            responseData(res, {}, 404, {error : 'Cannot find account with address: ' + req.params.address});
        }
    })
    //responseData(res, getProfile(req.params.address), 200, {})
}