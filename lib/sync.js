let { RpcClient } = require('tendermint');
const BlockChainInfo = require('../models/BlockChainInfo')
const Account = require('../models/Account')
const _ = require('lodash')
const transaction = require('./transaction')

const GENESIS_ADDRESS = 'GA6IW2JOWMP4WGI6LYAZ76ZPMFQSJAX4YLJLOQOWFC5VF5C6IGNV2IW7';

let client;
let infoDBDoc;

module.exports = {
    init: async (host, isSyncBlock) => {
        try {
            // init
            client = RpcClient(host)

            // update Height and block
            const upDateHeightBlock = (height, block) => {
                return new Promise((resolve, reject) => {
                    infoDBDoc.currentHeight = height;
                    if (height === 0) {
                        infoDBDoc.blocks = [];
                    }
                    if (block) {
                        infoDBDoc.blocks = infoDBDoc.blocks || [];
                        infoDBDoc.blocks.push(block);
                    }
                    infoDBDoc.save((err, res) => {
                        resolve();
                    })
                })
            }

            // Sync block
            const syncBlock = async (block) => {
                let height;
                if (_.isEmpty(block)) {
                    height = parseInt(_.get((await client.abciInfo()), `response.last_block_height`, 0));
                } else {
                    height = parseInt(_.get(block, `block.header.height`, 0))
                }

                let currentHeight;

                // Đọc Current Height từ DB
                let fnTemp = () => {
                    return new Promise((resolve, reject) => {
                        BlockChainInfo.findOne({}, (err, res) => {
                            if (err) throw Error("Cannot Read current height!")
                            // Lần đầu kết nối với DB
                            if (!res) {
                                res = new BlockChainInfo({
                                    currentHeight: 0,
                                    blocks: []
                                });
                                res.save((err, res) => {
                                    currentHeight = 0;
                                    infoDBDoc = res;
                                    resolve();
                                })
                                // Những lần sau
                            } else {
                                currentHeight = parseInt(_.get(res, 'currentHeight'))
                                infoDBDoc = res;
                                resolve();
                            }
                        })
                    })
                }

                // Đọc Current Height từ DB
                await fnTemp();

                //clear database
                if (height === 0 || currentHeight === 0) {
                    await Account.deleteMany({});

                    //tạo genesis account
                    await Account.create({
                        address: GENESIS_ADDRESS,
                        balance: Number.MAX_SAFE_INTEGER,
                        sequence: 0,
                        bandwidth: 0,
                    });

                    // Cập nhật lại current height
                    await upDateHeightBlock(0);
                }

                // Tìm Transaction trong Block mới để cập nhật DB
                if (currentHeight < height) {
                    for (let i = currentHeight + 1; i <= height; i++) {
                        console.log('Block:', i)
                        let block = await client.block({ height: i });
                        if (_.get(block, `block_meta.header.num_txs`, 0) > 0) {
                            let txs = _.get(block, `block.data.txs`, [])

                            let timeAddBlock = _.get(block, `block_meta.header.time`, (new Date()).toDateString());

                            // Chỉ thực thi khi có block có chứa Transaction
                            for (let j = 0; j < txs.length; j++) {
                                await transaction.execute(txs[j], timeAddBlock);
                                await upDateHeightBlock(i, block);
                            }
                        }
                    }

                    // Cập nhật lại current height
                    await upDateHeightBlock(height);
                }
            }

            // Sync if syncBlock === true
            if (isSyncBlock) {

                console.log('Sync Block!')

                await syncBlock();

                // Subscribe NewBlock
                console.log('Subcribe event NewBlock')
                await client.subscribe({ query: 'tm.event = \'NewBlock\'' }, (block) => {

                    syncBlock(block);
                })
            } else {
                console.log('Don\'t Sync Block!')
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
        console.log('Init Sync Successfully')
    },

    // tx: string base64 của Transaction
    // res trả về có dạng
    //  { 
    //      check_tx: {},
    //      deliver_tx: { tags: [ [Object], [Object] ] },
    //      hash: '0B3D55EDFAE79BC036635FCB48978B386BAB142349BEF44CD7A6FC8059597F82',
    //      height: '2314' 
    //  }
    // Trả về trong then có thể có lỗi
    // Trả về trong catch chắc chắn có lỗi
    // Trường hợp broadcast bị lỗi thì trong trường check_tx hoặc trường deliver_tx sẽ có trường log
    // Trường hợp broadcast không lỗi thì như trên
    broadcastTx: (tx) => {
        return client.broadcastTxCommit({
            tx
        })
    },

    syncFromBlockChainInfo: async (host) => {
        let infoDBDoc1;
        try {
            // init
            console.log('Begin Sync DB from local Block!')
            const blocks = (await BlockChainInfo.findOne()).blocks;
            console.log('Read Blocks Success!');

            // update Height and block
            const upDateHeightBlock = (height) => {
                return new Promise((resolve, reject) => {
                    infoDBDoc1.currentHeight = height;
                    infoDBDoc1.save((err, res) => {
                        resolve();
                    })
                })
            }

            // Sync block
            const syncBlock = async (block) => {
                let height = _.get(blocks[blocks.length - 1], `block.header.height`);

                let currentHeight;

                // Đọc Current Height từ DB
                let fnTemp = () => {
                    return new Promise((resolve, reject) => {
                        BlockChainInfo.findOne({}, (err, res) => {
                            if (err) throw Error("Cannot Read current height!")
                            // Lần đầu kết nối với DB
                            if (!res) {
                                throw Error("Không tồn tại Blocks trong DB")
                                // Những lần sau
                            } else {
                                currentHeight = parseInt(_.get(res, 'currentHeight'))
                                infoDBDoc1 = res;
                                resolve();
                            }
                        })
                    })
                }

                // Đọc Current Height từ DB
                await fnTemp();

                //clear database
                if (height === 0 || currentHeight === 0) {
                    await Account.deleteMany({});

                    //tạo genesis account
                    await Account.create({
                        address: GENESIS_ADDRESS,
                        balance: Number.MAX_SAFE_INTEGER,
                        sequence: 0,
                        bandwidth: 0,
                    });

                    // Cập nhật lại current height
                    await upDateHeightBlock(0);
                }

                // Tìm Transaction trong Block mới để cập nhật DB
                if (currentHeight < height) {
                    for (let i = 0; i <= blocks.length; i++) {
                        let block = blocks[i];
                        let blockHeight = _.get(block, `block.header.height`);
                        console.log('Block:', blockHeight);

                        if (_.get(block, `block_meta.header.num_txs`, 0) > 0) {
                            let txs = _.get(block, `block.data.txs`, [])

                            let timeAddBlock = _.get(block, `block_meta.header.time`, (new Date()).toDateString());

                            // Chỉ thực thi khi có block có chứa Transaction
                            for (let j = 0; j < txs.length; j++) {
                                await transaction.execute(txs[j], timeAddBlock);
                                await upDateHeightBlock(blockHeight);
                            }
                        }
                    }

                    // Cập nhật lại current height
                    await upDateHeightBlock(height);
                }
            }

            await syncBlock();
        } catch (err) {
            console.log(err);
            throw err;
        }
        console.log('Init Sync Successfully')
        return;
    }
}