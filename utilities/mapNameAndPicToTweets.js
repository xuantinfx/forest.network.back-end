const _ = require('lodash')
var Account = require('../models/Account')

const populateFromByAccount = async (tweetLikes, accountLikeReply)=>{
    let likes = tweetLikes
    for(let i = 0; i < likes.length; i++)
    {
        let like = likes[i]
        let index = _.findIndex(accountLikeReply,account=>(account.address === like.from))
        //console.log('index',index)
        if(index > -1)
        {
            let accountInfo = accountLikeReply[index]
            if(accountInfo)
            {   
                like.from = accountInfo
            }
        }
    } 
    return likes
}

module.exports = async (account, userAddress, accountLikeReply, paging, cb)=>{
    try{
        let accountRes = {};
        accountRes.tweets = account.tweets||[]
        accountRes.name = account.name||''
        accountRes.picture = account.picture||Buffer.alloc(0)
        accountRes.address = account.address

        accountRes.tweets = _.orderBy(accountRes.tweets,['time'],['desc'])
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

                if(i >= (paging.page-1)*paging.size && i < paging.page*paging.size ){
                    //console.log('abc',i,(paging.page-1)*paging.size,paging.page*paging.size)
                    //console.log('abc',accountRes.tweets[i])
                    tweet.likes = await populateFromByAccount(tweet.likes, accountLikeReply)
                    tweets.replies = await populateFromByAccount(tweet.replies, accountLikeReply)
                }
                tweets.push(tweet);
            }
        }

        cb(tweets);
    }
    catch (err) {
        console.log(err);
    }
}