const { responseData } = require('../../utilities/responseData')
const BlockChainInfo = require('../../models/BlockChainInfo')

module.exports = (req, res, next) => {
    responseData(res, {"data": "get tweets" + req.params.address}, 200, {})
}