const { responseData } = require('../../utilities/responseData')
var account = require('../../models/Account')
var error = require('../../constant/statusCode')
const _ = require('lodash')

module.exports = (req, res, next) => {
    account.findOne({address: req.params.address},{tweets:1},
    (err, account)=> {
        if (err) return handleError(err);
        if(account){
            if(account.tweets){
                let index = _.findIndex(account.tweets,(tweet)=>{
                    return tweet._id == req.params.id
                })
                //console.log('index',account.tweets[0]._id == req.params.id)
                if(index != -1){
                    responseData(res, account.tweets[index], 200, {});
                    return;
                }
            }
        }
        responseData(res, {}, 404, {error: error['404']})
        
    })
    //responseData(res, getProfile(req.params.address), 200, {})
}