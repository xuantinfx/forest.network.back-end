var express = require('express');
var router = express.Router();

var getTweets = require('../controller/tweet/getTweets')
var getTweetsWithId = require('../controller/tweet/getTweetsWithId')

/* GET users listing. */
router.get('/:address', getTweets);
router.get('/:address/:id', getTweetsWithId);

module.exports = router;
