let { RpcClient } = require('tendermint');
const BlockChainInfo = require('../models/BlockChainInfo')
const Account = require('../models/Account')
const _ = require('lodash')
const transaction = require('./transaction')

let client;

module.exports = {
    init: async (host, isSyncBlock) => {
        try {
            // init
            client = RpcClient(host)

            // Sync block
            const syncBlock = async (block) => {
                let height;
                if(_.isEmpty(block)) {
                    height = parseInt(_.get((await client.abciInfo()),`response.last_block_height`, 0));
                } else {
                    height = parseInt(_.get(block, `block.header.height`, 0))
                }
                
                let currentHeight;

                let fnTemp = () => {
                    return new Promise((resolve, reject) => {
                        BlockChainInfo.findOne({}, (err, res) => {
                            if(err) throw Error("Cannot Read current height!")
                            currentHeight = parseInt(_.get(res, 'currentHeight'))
                            resolve();
                        })
                    })
                }

                await fnTemp();

                //clear database
                if(height === 0 || currentHeight === 0) {
                    await Account.deleteMany({});

                    // Cập nhật lại current height
                    await BlockChainInfo.findOne({}, (err, res) => {
                        if(err) throw err;
                        res.currentHeight = 0;
                        res.save();
                    })
                }

                // Tìm Transaction trong Block mới để cập nhật DB
                if(currentHeight < height) {
                    for(let i = currentHeight + 1; i <= height; i++) {
                        console.log('Block:', i)
                        let block = await client.block({height: i});
                        if(_.get(block, `block_meta.header.num_txs`, 0) > 0) {
                            let txs = _.get(block, `block.data.txs`, [])
                            for(let j = 0; j < txs.length; j++) {
                                await transaction.execute(txs[j]);
                            }
                        }
                    }

                    // Cập nhật lại current height
                    await BlockChainInfo.findOne({}, (err, res) => {
                        if(err) throw err;
                        res.currentHeight = height;
                        res.save();
                    })
                }
            }

            await syncBlock();

            // Subscribe NewBlock
            await client.subscribe({ query: 'tm.event = \'NewBlock\'' }, (block) => {
                if(isSyncBlock) {
                    syncBlock(block);
                }
            })
        } catch(err) {
            console.log(err);
            throw err;
        }
        console.log('Init Sync Successfully')
    }
}