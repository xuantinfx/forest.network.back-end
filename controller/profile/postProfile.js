const { responseData } = require('../../utilities/responseData')

module.exports = (req, res, next) => {
    responseData(res, {"data": "post profile"}, 200, {})
}