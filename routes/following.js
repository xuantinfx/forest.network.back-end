var express = require('express');
var router = express.Router();

var getFollowing = require('../controller/following/getFollowing')

/* GET users listing. */
router.get('/:address', getFollowing);

module.exports = router;
