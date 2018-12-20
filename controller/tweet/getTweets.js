const { responseData } = require('../../utilities/responseData')
var account = require('../../models/Account')
var mapNameAndPicToTweets = require('../../utilities/mapNameAndPicToTweets')

module.exports = (req, res, next) => {
    //console.log(req.query)
    account.findOne({address: req.params.address},{tweets:1, name: 1, picture:1, address: 1},
    (err, account)=> {
        if(account){
            let tweets = mapNameAndPicToTweets(account)
            let paging = {}
            if(!req.query){
                paging = {page:1, size: tweets.length}
            }
            else{
                if(req.query.page && req.query.size)
                {
                    paging = req.query
                }
                else{
                    paging = {page:1, size: tweets.length}
                }
            }
            //console.log('page', paging)
            responseData(res, tweets, 200, {}, paging)
        }
        else{
            responseData(res, {}, 202, {error : 'Cannot find account with address: ' + req.params.address});
        }
    })
    //responseData(res, getProfile(req.params.address), 200, {})
}