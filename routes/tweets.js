var express = require('express');
var router = express.Router();

var getTweets = require('../controller/tweet/getTweets')
var getTweetsWithId = require('../controller/tweet/getTweetsWithId')
var postTweets = require('../controller/tweet/postTweets')
var patchTweets = require('../controller/tweet/patchTweets')
var deleteTweets = require('../controller/tweet/deleteTweets')

/* GET users listing. */
router.get('/:address', getTweets);
router.get('/:address/:id', getTweetsWithId);
router.post('/:address', postTweets);
router.patch('/:address/:id', patchTweets);
router.delete('/:address/:id', deleteTweets);

module.exports = router;
