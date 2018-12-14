var express = require('express');
var router = express.Router();
var profileRouter = require('./profile')
const transactionRouter = require('./transaction')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/profile', profileRouter);

router.use('/transaction', transactionRouter)

module.exports = router;
