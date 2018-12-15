var express = require('express');
var router = express.Router();

var postTransaction = require('../controller/transaction/postTransaction')

/* GET users listing. */
router.post('/', postTransaction)

module.exports = router;
