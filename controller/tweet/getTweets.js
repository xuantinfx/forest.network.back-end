const { responseData } = require('../../utilities/responseData')
var account = require('../../models/Account')
var error = require('../../constant/statusCode')

module.exports = (req, res, next) => {
    account.findOne({address: req.params.address},{tweets:1},
    (err, account)=> {
        if (err) return handleError(err);
        if(account){
            if(account.tweets){
                responseData(res, account.tweets, 200, {})
                return;
            }
        }
        responseData(res, {}, 404, {error: error['404']})
    })
    //responseData(res, getProfile(req.params.address), 200, {})
}