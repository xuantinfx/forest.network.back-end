const { responseData } = require('../../utilities/responseData')

module.exports = (req, res, next) => {
    responseData(res, {"data": "patch profile"}, 200, {})
}