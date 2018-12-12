var dummyData = require('./dummyData');
var acc = require('../models/Account')

module.exports.getProfile = (address)=>{
    var accountFind = acc.find({address: 'GCHXJEPT37MVIC55EUKF54KOBUITFXUXL3YBSYVG4OEK7JK5QEAVQ6DT'},
    (err, person)=> {
        if (err) return handleError(err);
        // Prints "Space Ghost is a talk show host".
        console.log(person[0].paymentHistory);
      })
    return {
        ...dummyData,
        address,
        tweets: [],
    }
}