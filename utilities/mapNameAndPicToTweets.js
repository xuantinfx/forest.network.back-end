module.exports = (account)=>{
    let accountRes = {};
    accountRes.tweets = account.tweets||[]
    accountRes.name = account.name||''
    accountRes.picture = account.picture||Buffer.alloc(0)
    accountRes.address = account.address

    //console.log(accountRes)

    let tweets = [];
    for(let i = 0; i < accountRes.tweets.length; i++) {
        let tweet = accountRes.tweets[i].toObject();
        tweet.name = accountRes.name;
        tweet.picture = accountRes.picture;
        tweet.address = accountRes.address;
        tweets.push(tweet);
    }

    return tweets;
}