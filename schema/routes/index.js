var express = require('express');
var router = express.Router();

router.get('/healthCheck',require('../index'));

router.use('/',require('./Job'));

module.exports = router;
