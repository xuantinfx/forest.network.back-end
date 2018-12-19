var express = require('express');
var router = express.Router();

var getFollower = require('../controller/follower/getFollower')

/* GET users listing. */
router.get('/:address', getFollower);

module.exports = router;
