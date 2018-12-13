var express = require('express');
var router = express.Router();

var getProfile = require('../controller/profile/getProfile')

/* GET users listing. */
router.get('/:address', getProfile);

module.exports = router;
