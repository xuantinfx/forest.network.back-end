const { responseData } = require('../../utilities/responseData')
var account = require('../../models/Account')
var error = require('../../constant/statusCode')

module.exports = (req, res, next) => {
    account.findOne({address: req.params.address},{tweets:1, name: 1, picture:1},
    (err, account)=> {
        if(account){
            let accountRes = {};
            accountRes.tweets = account.tweets||[]
            accountRes.name = account.name||''
            accountRes.picture = account.picture||Buffer.alloc(0)

            //console.log(accountRes)

            let tweets = [];
            for(let i = 0; i < accountRes.tweets.length; i++) {
                let tweet = accountRes.tweets[i].toObject();
                tweet.name = accountRes.name;
                tweet.picture = accountRes.picture;
                tweets.push(tweet);
            }

            responseData(res, tweets, 200, {})
        }
        else{
            responseData(res, {}, 202, {error : 'Cannot find account with address: ' + req.params.address});
        }
    })
    //responseData(res, getProfile(req.params.address), 200, {})
}