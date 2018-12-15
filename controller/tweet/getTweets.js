const { responseData } = require('../../utilities/responseData')
var account = require('../../models/Account')
var error = require('../../constant/statusCode')

module.exports = (req, res, next) => {
    account.findOne({address: req.params.address},{tweets:1},
    (err, account)=> {
        if(account){
            if(account.tweets){
                responseData(res, account.tweets, 200, {})
            }
            else{
                responseData(res, {}, 404, {error : 'Tweets is not existed in account with address: ' + req.params.address});
            }
        }
        else{
            responseData(res, {}, 404, {error : 'Cannot find account with address: ' + req.params.address});
        }
    })
    //responseData(res, getProfile(req.params.address), 200, {})
}