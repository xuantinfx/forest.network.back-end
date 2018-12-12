const { responseData } = require('../../utilities/responseData')
const BlockChainInfo = require('../../models/BlockChainInfo')

module.exports = (req, res, next) => {
    responseData(res, {"data": {"adress": req.params.address, 'id': req.params.id}}, 200, {})
}