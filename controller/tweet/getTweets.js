const { responseData } = require('../../utilities/responseData')
var account = require('../../models/Account')
var error = require('../../constant/statusCode')

module.exports = (req, res, next) => {
    account.findOne({address: req.params.address},{tweets:1, name: 1, picture:1},
    (err, account)=> {
        if(account){
            account.tweets = account.tweets||[]
            account.name = account.name||''
            account.picture = account.picture||''
            
            responseData(res, account, 200, {})
        }
        else{
            responseData(res, {}, 202, {error : 'Cannot find account with address: ' + req.params.address});
        }
    })
    //responseData(res, getProfile(req.params.address), 200, {})
}