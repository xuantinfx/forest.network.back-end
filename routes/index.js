var express = require('express');
var router = express.Router();
var profileRouter = require('./profile')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/profile', profileRouter);

module.exports = router;
