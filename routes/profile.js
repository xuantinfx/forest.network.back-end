var express = require('express');
var router = express.Router();

var getProfile = require('../controller/profile/getProfile')
var patchProfile = require('../controller/profile/patchProfile')

/* GET users listing. */
router.get('/:address', getProfile);
router.patch('/', patchProfile)

module.exports = router;
