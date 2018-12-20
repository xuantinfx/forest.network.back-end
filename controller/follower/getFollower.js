const { responseData } = require('../../utilities/responseData')
var Account = require('../../models/Account')

module.exports = async (req, res, next) => {
    try {
        let account = await Account.findOne({address: req.params.address},{followers: 1});
        // Không tìm thấy Account
        if(!account) {
            return responseData(res, [], 404, {error : 'Cannot find account with address: ' + req.params.address});
        }
        
        let listFollowersAddress = account.followers;
        let listFollowers = [];
        if( listFollowersAddress.length > 0) {
            listFollowers = await Account.find({address: {$in: listFollowersAddress}}, {address: 1, balance: 1, joinDate: 1, name: 1, picture: 1});
        }
        responseData(res, listFollowers, 200, {});
    }
    catch (err) {
        console.log(err);
        responseData(res, [], 500, {error : 'Internal Error'});
    }
    // (err, accountInfo)=> {
    //     if(accountInfo)
    //     {
    //         responseData(res, accountInfo, 200, {});
    //     }
    //     else{
    //         responseData(res, {}, 202, {error : 'Cannot find account with address: ' + req.params.address});
    //     }
    // })
}