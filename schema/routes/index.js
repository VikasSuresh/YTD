var express = require('express');
var router = express.Router();

router.get('/',require('../index'));

router.use('/jobs',require('./Job'));

module.exports = router;
