/*
This module contains functions for creating and using a chess file

Typical usage:

  var chessFile = require([path to this module]);
  var file = chessFile.create([fileName]);

  OR

  var chessFile = require([path to this module]);
  var file = new chessFile.ChessFile([fileName]);
*/

var o = {};

/// general file functions
o.isValidName = function(fileName) {
  // returns true if a file name is valid (a-h), o/w false
  // e.g. isValidName('a') = true; isValidName('z') = false;
  return (!(!fileName || fileName.length != 1 || fileName < 'a' || fileName > 'h'));
};

o.normalizeFileName = function(fileName) {
  // returns a valid file name (a-h) or undefined
  // e.g. normalizeFile('a') = 'a'; normalizeFile('z') = undefined;
  return o.isValidName(fileName) ? fileName : undefined;
};

o.getNeighboringFileName = function(fileName, offset) {
  // retuns the name of a neighboring file
  // e.g. getNeighboringFile('e', -1) = 'd'; getNeighboringFile('h', 1) = undefined;
  if (!o.isValidName(fileName)) return;
  return o.normalizeFileName(String.fromCharCode(fileName.charCodeAt(0) + offset));
};
///

/// file object
o.ChessFile = function(fileName) {
  if (!o.isValidName(fileName)) return false;
  this.name = fileName;
  return true;
};

o.ChessFile.prototype.isValid = function() { return o.isValidName(this.name) };

o.ChessFile.prototype.getNeighboringFile = function(offset) {
  var neighboringFileName = o.getNeighboringFileName(this.name, offset);
  return new o.ChessFile(neighboringFileName);
};

o.create = function(fileName) {
  return new o.ChessFile(fileName);
};
///

module.exports = o;
