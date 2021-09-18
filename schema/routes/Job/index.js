var express = require('express');
var router = express.Router({mergeParams:true});

router.get('/:fileId',require('./get'))
router.post('/',require('./post'))


module.exports = router;
