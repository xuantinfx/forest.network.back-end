var express = require('express');
var router = express.Router();

var getProfile = require('../controller/profile/getProfile')
var patchProfile = require('../controller/profile/patchProfile')
var postProfile = require('../controller/profile/postProfile')

/* GET users listing. */
router.get('/:address', getProfile);
router.patch('/', patchProfile)
router.post('/:address', postProfile);

module.exports = router;
