/*
Useful references:
  http://stackoverflow.com/questions/4024271/rest-api-best-practices-where-to-put-parameters
*/

var express = require('express');
var winston = require('winston');
var users = require('./modules/users');
var router = express.Router();

//uses
router.use(function timeLog(req, res, next) {
  winston.info('example router middleware');
  next();
});

//routes
router.route('/')
  .get(users.getUsers)
  .post(users.addUser);

router.route('/:id([0-9]+)')
  .get(users.getUser)
  .put(users.updateUser)
  .delete(users.deleteUser);

module.exports = router;
