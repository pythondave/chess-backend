'use strict';

var express = require('express');
var winston = require('winston'); //logging
var bodyParser = require('body-parser');
var expressRequestBundler = require('express-request-bundler'); //use for bundling requests - NOT GOT WORKING YET (their build is failing - an issue with native promises it looks like)
var users = require('./routes/users');
var positions = require('./routes/positions');
var app = express();

winston.add(winston.transports.File, { filename: 'winston.log' });
winston.remove(winston.transports.Console);

//uses
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function log(req, res, next) {
  winston.info({ type: 'Basic request info', query: req.query, params: req.params, body: req.body });
  next();
});

//app.use(express.static('static'));
app.use(express.static('../chess/build/dev'));

app.use('/api/users', users);
app.use('/api/positions', positions);

app.get('/api/bundle', expressRequestBundler()); // WIP

//
var server = app.listen(5000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
