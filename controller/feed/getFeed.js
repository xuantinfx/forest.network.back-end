const { responseData } = require('../../utilities/responseData')
var Account = require('../../models/Account')
var mapNameAndPicToTweets = require('../../utilities/mapNameAndPicToTweets')
var _ = require('lodash')

module.exports = async (req, res, next) => {
    try {
        let account = await Account.findOne({address: req.headers.public_key},{followings: 1});
        // Không tìm thấy Account
        if(!account) {
            return responseData(res, [], 202, {error : 'Cannot find account with address: ' + req.params.address});
        }
        
        let listFollowingssAddress = account.followings;
        listFollowingssAddress.push(req.headers.public_key)
        let listFollowings = [];
        if( listFollowingssAddress.length > 0) {
            listFollowings = await Account.find({address: {$in: listFollowingssAddress}}, {address: 1, tweets:1, name: 1, picture: 1});
        }
        let tweets = [];
        for(let i = 0; i < listFollowings.length; i++){
            following = listFollowings[i];
            let tweetAfter = [];
            await mapNameAndPicToTweets(following, req.headers.public_key,(tweetRet)=>{tweetAfter=tweetRet})
            tweets = [...tweets,...tweetAfter];
        };

        let tweetsResp = _.orderBy(tweets,['time'],['desc'])

        
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
        responseData(res, tweetsResp, 200, {}, paging);
    }
    catch (err) {
        console.log(err);
        responseData(res, [], 500, {error : 'Internal Error'});
    }
}