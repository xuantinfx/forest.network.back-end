const { responseData } = require('../../utilities/responseData')
const BlockChainInfo = require('../../models/BlockChainInfo')
var account = require('../../models/Account')
var error = require('../../constant/statusCode')

module.exports = (req, res, next) => {
    account.findOne({address: req.params.address},{tweets:0},
    (err, accountInfo)=> {
        if(accountInfo)
        {
            responseData(res, accountInfo, 200, {});
        }
        else{
            responseData(res, {}, 404, {error : 'Cannot find account with address: ' + req.params.address});
        }
    })
    //responseData(res, getProfile(req.params.address), 200, {})
}