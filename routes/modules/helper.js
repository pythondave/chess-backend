/*
  Idea: Use this rather than hard-code the status codes
*/

var db = require('../../db/db');
var winston = require('winston');

var helper = {};

helper.db = db;

helper.log = winston.info;

helper.statusCodes = { // http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
  OK: 200,
  CREATED: 201,
  DELETED: 204, // No Content
  NOT_FOUND: 404,
  NOT_POSSIBLE: 422 // Unprocessable Entity; See http://stackoverflow.com/a/15818028
};

helper.standardErrorHandler = function(res) {
  return function(err) {
    res.status(helper.statusCodes.NOT_POSSIBLE).json(err);
  };
};

module.exports = helper;
