const { responseData } = require('../../utilities/responseData')
const BlockChainInfo = require('../../models/BlockChainInfo')
var account = require('../../models/Account')

module.exports = (req, res, next) => {
    account.find({address: req.params.address},{tweets:0},
    (err, acountInfo)=> {
        if (err) return handleError(err);
        // Prints "Space Ghost is a talk show host".
        console.log(acountInfo[0].paymentHistory);
        responseData(res, acountInfo, 200, {})
    })
    //responseData(res, getProfile(req.params.address), 200, {})
}