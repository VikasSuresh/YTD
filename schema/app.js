require('dotenv').config()
var express = require('express');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
const mongoose = require('mongoose');

require('../model')

var app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', require('./routes'));

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  return res.send('Error');
});

mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log("Connected")
}).catch((err)=>{
  console.log("Cant Connect to DB",err)
  process.exit(-1);
})

module.exports = app;
