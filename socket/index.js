const _ = require('lodash');
const Account = require('../models/Account');

const typeAction = {
    RECEIVE_MONEY: "RECEIVE_MONEY",
    FOLLOWING_POST: "FOLLOWING_POST",
    RECEIVE_FOLLOWINGS: "RECEIVE_FOLLOWINGS",
    RECEIVE_UNFOLLOWINGS: "RECEIVE_UNFOLLOWINGS",
    RECEIVE_REACTION: "RECEIVE_REACTION",
    RECEIVE_COMMENT: "RECEIVE_COMMENT"
}

const chainel = "notify";

let sockets = [];

module.exports.init = (server) => {
    const io = require('socket.io')(server);
    io.on("connection", (socket) => {
        let saveAddress = "";
        let saveRandom = 0;
        socket.on("onConnect", (address, random) => {

            saveAddress = address;
            saveRandom = random;

            sockets.push({address, random, socket});

            console.log(address, "connected!");
        })

        socket.on("disconnect", () => {
            _.remove(sockets, soc => soc.address === saveAddress && soc.random === saveRandom);
            console.log(saveAddress, "disconnected!");
        })
    })
}

module.exports.payment = (from, to, amount) => {
    for(let i = 0; i < sockets.length; i++) {
        if(sockets[i].address === to.address) {
            sockets[i].socket.emit(chainel, {
                type: typeAction.RECEIVE_MONEY,
                from: from.address,
                name: from.name,
                amount
            })
        }
    }
}

module.exports.post = (account, content) => {
    for(let i = 0; i < account.followers.length; i++) {
        for(let j = 0; j < sockets.length; j++) {
            if(sockets[j].address === account.followers[i]) {
                sockets[j].socket.emit(chainel, {
                    type: typeAction.FOLLOWING_POST,
                    content,
                    address: account.address,
                    name: account.name
                })
            }
        }
    }
}

// type 1: comment
// type 2: react
module.exports.interact = (fromAdress, to, type, content) => {
    Account.findOne({address: fromAdress}, {name: 1}, (err, res) => {
        if(!err && res) {
            for(let i = 0; i < sockets.length; i++) {
                if(sockets[i].socket === to.address) {
                    if(type === 1) {
                        sockets[i].socket.emit(chainel, {
                            type: typeAction.RECEIVE_COMMENT,
                            address: fromAdress,
                            name: res.name,
                            content
                        })
                    } else 
                    if(type === 2) {
                        sockets[i].socket.emit(chainel, {
                            type: typeAction.RECEIVE_REACTION,
                            address: fromAdress,
                            name: res.name,
                            content
                        })
                    }
                }
            }  
        }
    })
}

module.exports.followings = (from, to) => {
    for(let i = 0; i < sockets.length; i++) {
        if(sockets[i].address === to.address) {
            sockets[i].socket.emit(chainel, {
                type: typeAction.RECEIVE_FOLLOWINGS,
                address: from.address,
                name: from.name
            })
        }
    }
}

module.exports.unFollowings = (from, to) => {
    for(let i = 0; i < sockets.length; i++) {
        if(sockets[i].address === to.address) {
            sockets[i].socket.emit(chainel, {
                type: typeAction.RECEIVE_UNFOLLOWINGS,
                address: from.address,
                name: from.name
            })
        }
    }
}