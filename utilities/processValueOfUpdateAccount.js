const vstruct = require('varstruct')

const Followings = vstruct([
    { name: 'addresses', type: vstruct.VarArray(vstruct.UInt16BE, vstruct.Buffer(35)) },
]);
module.exports = (key, value) => {
    switch(key) {
        case "name": 
            return value.toString("utf-8");
        case "followings":
            return Followings.decode(value);
        case "picture":
        default:
            return value;
    }
}