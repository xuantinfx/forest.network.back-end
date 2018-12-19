var express = require('express');
var router = express.Router();
var profileRouter = require('./profile')
const transactionRouter = require('./transaction')
var tweetsRouter = require('./tweets')
const follower = require('./follower')
const following = require('./following')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/profile', profileRouter);
router.use('/tweets', tweetsRouter);

router.use('/transaction', transactionRouter)
router.use('/followers', follower)
router.use('/followings', following)

module.exports = router;
