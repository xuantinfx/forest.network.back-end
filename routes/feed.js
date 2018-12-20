var express = require('express');
var router = express.Router();

var getFeed = require('../controller/feed/getFeed')

/* GET tweets listing. */
router.get('/', getFeed);

module.exports = router;
