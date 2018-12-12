var express = require('express');
var router = express.Router();
var profileRouter = require('./profile')
var tweetsRouter = require('./tweets')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/profile', profileRouter);
router.use('/tweets', tweetsRouter);

module.exports = router;
