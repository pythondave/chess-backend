/*
  Helper module for other modules in this folder.

  Idea: Use the status codes from here rather than hard-code them
*/
var __base = require('__base');
var chessDb = require(__base + 'chess-db');
var winston = require('winston');

var o = {};

o.db = chessDb;

o.log = winston.info;

o.statusCodes = { // http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
  OK: 200,
  CREATED: 201,
  DELETED: 204, // No Content
  NOT_FOUND: 404,
  NOT_POSSIBLE: 422 // Unprocessable Entity; See http://stackoverflow.com/a/15818028
};

o.standardErrorHandler = function(res) {
  return function(err) {
    res.status(o.statusCodes.NOT_POSSIBLE).json(err);
  };
};

module.exports = o;
