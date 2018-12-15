const { responseData } = require('../../utilities/responseData')
const { broadcastTx } = require('../../lib/sync')

module.exports = (req, res, next) => {

    // thiếu tx
    if(!req.body.tx) {
        responseData(res, {}, 200, {error: "field tx is required"})
    } else {
        broadcastTx(req.body.tx)
        .then(result => {
            // lỗi ở checkTx
            if(result.check_tx && result.check_tx.log) {
                responseData(res, {}, 200, {error: result.check_tx.log})
            } else
            // Lỗi ở deliverTx
            if(result.deliver_tx && result.deliver_tx.log) {
                responseData(res, {}, 200, {error: result.deliver_tx.log})
            } else {  
            // Thành công
                responseData(res, {hash: result.hash}, 200, {message: "Broadcast Transaction success!"})
            }
        })
        .catch(err => { 
            //Lỗi cú pháp và định dạng tx
            //base64
            responseData(res, {}, 200, {error: err.data})
        })
    }
}