const _ = require('lodash')
var Account = require('../models/Account')

const populateFromByAccount = async (tweetLikes)=>{
    let likes = tweetLikes
    for(let i = 0; i < likes.length; i++)
    {
        let like = likes[i]
        let accountInfo = await Account.findOne({address: like.from}, {address: 1, picture: 1, name: 1})
        if(accountInfo)
            {   
                like.from = accountInfo
            }
    } 
    return likes
}

module.exports = async (account, userAddress, cb)=>{
    try{
        let accountRes = {};
        accountRes.tweets = account.tweets||[]
        accountRes.name = account.name||''
        accountRes.picture = account.picture||Buffer.alloc(0)
        accountRes.address = account.address

        //console.log(accountRes)

        let tweets = [];
        for(let i = 0; i < accountRes.tweets.length; i++) {
            let tweet = accountRes.tweets[i].toObject();
            if(tweet.content && tweet.content != ''){
                tweet.name = accountRes.name;
                tweet.picture = accountRes.picture;
                tweet.address = accountRes.address;
                let index = _.findIndex(tweet.likes,like=>{
                    if(like.from == userAddress)
                        return true;
                })
                //console.log('index', index)
                tweet.reaction = (index === -1) ? 0:tweet.likes[index].reaction;
                /* for(let i = 0; i < tweet.likes.length; i++)
                {
                    let like = tweet.likes[i]
                    let accountInfo = await Account.findOne({address: like.from}, {address: 1, name: 1})
                    if(accountInfo)
                        {   
                            like.from = accountInfo
                        }
                }  */
                tweet.likes = await populateFromByAccount(tweet.likes)
                tweets.replies = await populateFromByAccount(tweet.replies)
                tweets.push(tweet);
            }
        }

        cb(tweets);
    }
    catch (err) {
        console.log(err);
    }
}