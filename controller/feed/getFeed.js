const { responseData } = require('../../utilities/responseData')
var Account = require('../../models/Account')
var {mapNameAndPicToTweets, populateFromByAccount} = require('../../utilities/mapNameAndPicToTweets')
var _ = require('lodash')

module.exports = async (req, res, next) => {
    try {
        let account = await Account.findOne({address: req.headers.public_key},{followings: 1});
        // Không tìm thấy Account
        if(!account) {
            return responseData(res, [], 202, {error : 'Cannot find account with address: ' + req.params.address});
        }
        
        let listFollowingssAddress = account.followings;
        //listFollowingssAddress.push(req.headers.public_key)
        let listFollowings = [];
        if( listFollowingssAddress.length > 0) {
            listFollowings = await Account.find({address: {$in: listFollowingssAddress}}, {address: 1, tweets:1, name: 1, picture: 1});
        }

        //Tìm các account react và reply
        let likeAndReplyAddresses = [];
        for(let iFollow = 0; iFollow < listFollowings.length; iFollow++){
            let followingTweets = listFollowings[iFollow].tweets;
            for(let i = 0; i < followingTweets.length; i++){
                let tweetAtIndex =followingTweets[i];
                for(let iLike = 0; iLike < tweetAtIndex.likes.length; iLike++){
                    likeAndReplyAddresses.push(tweetAtIndex.likes[iLike].from);
                }
                for(let iRep = 0; iRep < tweetAtIndex.replies.length; iRep++){
                    likeAndReplyAddresses.push(tweetAtIndex.replies[iRep].from);
                }
            }
        }

        let accountLikeReply = await Account.find({address: {$in: likeAndReplyAddresses}}, {address: 1, name: 1, picture: 1});

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

        let tweets = [];
        for(let i = 0; i < listFollowings.length; i++){
            following = listFollowings[i];
            let tweetAfter = [];
            tweetAfter = mapNameAndPicToTweets(following, req.headers.public_key,accountLikeReply,
                {page:1, size:-1})
            
            tweets = [...tweets,...tweetAfter];
        };

        let tweetsResp = _.orderBy(tweets,['time'],['desc'])

        for(let i = (paging.page-1)*paging.size; i < tweetsResp.length && i < paging.page*paging.size; i++){
            tweetsResp[i].likes = populateFromByAccount(tweetsResp[i].likes, accountLikeReply)
            tweetsResp[i].replies = populateFromByAccount(tweetsResp[i].replies, accountLikeReply)
        }

        
        responseData(res, tweetsResp, 200, {}, paging);
    }
    catch (err) {
        console.log(err);
        responseData(res, [], 500, {error : 'Internal Error'});
    }
}