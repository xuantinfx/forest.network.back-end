let { RpcClient } = require('tendermint');
const BlockChainInfo = require('../models/BlockChainInfo')
const Account = require('../models/Account')
const _ = require('lodash')

let client;

module.exports = {
    init: async (host) => {
        try {
            client = RpcClient(host)

            // Sync block
            let height = parseInt(_.get((await client.abciInfo()),`response.last_block_height`, 0));
            let currentHeight;

            await BlockChainInfo.findOne({}, (err, res) => {
                if(err) throw Error("Cannot Read current height!")
                currentHeight = parseInt(_.get(res, 'currentHeight'))
            })

            console.log(currentHeight)
            //clear database
            if(height === 0 || currentHeight === 0) {
                await Account.deleteMany({});
                await (new BlockChainInfo({currentHeight: 0, blocks: []})).save()
            }

            // Subscribe NewBlock
            await client.subscribe({ query: 'tm.event = \'NewBlock\'' }, (event) => {
                console.log("Newblock", event);
            })
        } catch(err) {
            throw err;
        }
        console.log('Init Sync Successfully')
    }
}