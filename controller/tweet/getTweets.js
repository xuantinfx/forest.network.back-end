const { responseData } = require('../../utilities/responseData')
var Account = require('../../models/Account')
var mapNameAndPicToTweets = require('../../utilities/mapNameAndPicToTweets')
var _ = require('lodash')

module.exports = (req, res, next) => {
    //console.log(req.query)
    Account.findOne({address: req.params.address},{tweets:1, name: 1, picture:1, address: 1},
    (err, account)=> {
        if(account){
            //console.log('account', account.address,req.headers.public_key)

                let likeAndReplyAddresses = []
                for(let i = 0; i < account.tweets.length; i++){
                    let tweetAtIndex = account.tweets[i]
                    for(let iLike = 0; iLike < tweetAtIndex.likes.length; iLike++){
                        likeAndReplyAddresses.push(tweetAtIndex.likes[iLike].from)
                    }
                    for(let iRep = 0; iRep < tweetAtIndex.replies.length; iRep++){
                        likeAndReplyAddresses.push(tweetAtIndex.replies[iRep].from)
                    }
                }
                Account.find({address: {$in: likeAndReplyAddresses}}, {address: 1, name: 1, picture: 1}, 
                (error,accountLikeReply)=>{
                    if(accountLikeReply){
                        let paging = {}
                        if(!req.query){
                            paging = {page:1, size: account.tweets.length}
                        }
                        else{
                            if(req.query.page && req.query.size && req.query.size > -1)
                            {
                                paging = req.query
                            }
                            else{
                                paging = {page:1, size: account.tweets.length}
                            }
                        }

                        //console.log('page', paging)
                        let tweets = []
                        
                        mapNameAndPicToTweets(account,req.headers.public_key,accountLikeReply,
                            paging,(tweetsRet)=>{tweets=tweetsRet})
                            .then(()=>{
                                //let tweetsResp = _.orderBy(tweets,['time'],['desc'])
                                responseData(res, tweets, 200, {}, paging)
                            })
                            .catch((error)=>{
                                console.log(error);
                                responseData(res, {}, 202, {error : 'Cannot find account'});
                            })
                    }
                    else{
                        console.log(error);
                        responseData(res, {}, 202, {error : 'Cannot find account'});
                    }
                })
        }
        else{
            responseData(res, {}, 202, {error : 'Cannot find account with address: ' + req.params.address});
        }
    })
    //responseData(res, getProfile(req.params.address), 200, {})
}