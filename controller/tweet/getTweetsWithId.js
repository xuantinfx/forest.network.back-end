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
                }
                else{
                    responseData(res, {}, 404, {error: 'The tweets id ' + req.params.id + ' is not existed!'});
                }
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