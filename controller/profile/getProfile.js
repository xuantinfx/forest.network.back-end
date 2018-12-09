const { responseData } = require('../../utilities/responseData')

module.exports = (req, res, next) => {
    responseData(res, {"data": "get profile " + req.params.address}, 200, {})
}