const { responseData } = require('../../utilities/responseData')
var Account = require('../../models/Account')

module.exports = async (req, res, next) => {
    try {
        let account = await Account.findOne({address: req.params.address},{followings: 1});
        // Không tìm thấy Account
        if(!account) {
            return responseData(res, [], 202, {error : 'Cannot find account with address: ' + req.params.address});
        }
        
        let listFollowingssAddress = account.followings;
        let listFollowings = [];
        if( listFollowingssAddress.length > 0) {
            listFollowings = await Account.find({address: {$in: listFollowingssAddress}}, {address: 1, balance: 1, joinDate: 1, name: 1, picture: 1});
        }
        responseData(res, listFollowings, 200, {});
    }
    catch (err) {
        console.log(err);
        responseData(res, [], 500, {error : 'Internal Error'});
    }
}