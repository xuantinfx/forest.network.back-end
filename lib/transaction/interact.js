const Account = require('../../models/Account');
const _ = require('lodash');
const socket = require('../../socket');

module.exports.in = (tx, timeAddBlock) => {
    return new Promise((resolve, reject) => {
        const hash = tx.params.object;
        const content = tx.params.content;
        Account.findOne({"tweets.hash": hash}, {tweets: 1, address: 1, name: 1}, (err, res) => {
            if ( err ) {
                return resolve();
            }
            if (res) {
                for ( let i = 0; i < res.tweets.length; i++ ) {
                    // Lấy bài tweet được tương tác
                    if( res.tweets[i].hash === hash ) {
                        // Comment
                        if( content.type === 1 ) {
                            res.tweets[i].replies.push({
                                from: tx.account,
                                time: (new Date(timeAddBlock)),
                                content: content.text
                            })
                        } else
                        // Reaction
                        if ( content.type === 2 ) {
                            switch (content.reaction) {
                                // Reaction
                                case 1:
                                case 2:
                                case 3:
                                case 4:
                                case 5:
                                case 6:
                                {
                                    // check user react current tweet
                                    let j;
                                    for(j = 0; j < res.tweets[i].likes.length; j++) {
                                        // exits user's reaction
                                        if(res.tweets[i].likes[j].from === tx.account) {
                                            res.tweets[i].likes[j] = {
                                                from: tx.account,
                                                time: (new Date(timeAddBlock)),
                                                reaction: content.reaction
                                            }
                                            break;
                                        }
                                    }

                                    // update reaction
                                    if(j < res.tweets[i].likes.length) {
                                        break;
                                    }

                                    // add reaction
                                    res.tweets[i].likes.push({
                                        from: tx.account,
                                        time: (new Date(timeAddBlock)),
                                        reaction: content.reaction
                                    })
                                }
                                    break;
                                // UnReaction
                                case 0:
                                    //_.remove(res.tweets[i].likes, like => like.from === tx.account);
                                    for(let j = 0; j < res.tweets[i].likes.length; j++) {
                                        let likes = []
                                        if(res.tweets[i].likes[j].from !== tx.account) {
                                            likes.push(res.tweets[i].likes[j]);
                                        }
                                        res.tweets[i].likes = likes;
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                        break;
                    }
                }
                res.save((err1, res1) => {
                    if(err1) console.error(err1);

                    // send socket
                    socket.interact(tx.account, res, content.type, content.text || content.reaction)

                    resolve();
                })
            } else {
                // Tìm không thấy hash
                resolve();
            }
        })
    })
}