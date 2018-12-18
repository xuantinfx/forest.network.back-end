const vstruct = require('varstruct')

const Followings = vstruct([
    { name: 'addresses', type: vstruct.VarArray(vstruct.UInt16BE, vstruct.Buffer(35)) },
]);
module.exports = (key, value) => {
    switch(key) {
        case "name": 
            return value.toString("utf-8");
        case "followings":
            let result;
            try {
                result = Followings.decode(value);
            }
            catch(err) {
                console.log("DECODE_FOLLOWINGS_FAIL", value.toString());
                console.error("ERROR", err)
                result = {
                    addresses: []
                }
            }
            return result
        case "picture":
        default:
            return value;
    }
}