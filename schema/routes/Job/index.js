var express = require('express');
var router = express.Router({mergeParams:true});

router.get('/:fileId',require('./getId'))
router.get('/',require('./get'))
router.post('/',require('./post'))


module.exports = router;
