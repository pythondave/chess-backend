/*
This module contains functions for creating and using a chess file

Typical usage:

  var chessFile = require([path to this module]);
  var file = chessFile.create('e');

See tests and code below for more info.
*/

var _ = require('lodash');

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
o.ChessFile = function(paramsObjectOrFileName) {
  /*
    can be instantiated in 2 different ways. e.g.
      1. ChessFile({ name: 'e' })
      2. ChessFile('e') //sugar for 1
  */
  if (arguments.length == 0) throw new Error('No parameters');
  if (arguments.length == 1 && _.isPlainObject(paramsObjectOrFileName))
    return o.createFromParamsObject.call(this, paramsObjectOrFileName); //1
  if (arguments.length == 1) return o.createFromParameterList.call(this, paramsObjectOrFileName); //2
  throw new Error('Invalid parameters');
};

o.create = function(paramsObjectOrFileName) {
  // sugar for ChessFile
  var chessFile = Object.create(o.ChessFile.prototype);
  o.ChessFile.apply(chessFile, arguments);
  return chessFile;
};

o.createFromParamsObject = function(paramsObject) {
  return o.createFromParameterList.call(this, paramsObject.name);
};

o.createFromParameterList = function(fileName) {
  if (!o.isValidName(fileName)) throw new Error('Invalid name');
  this.name = fileName;
};

o.isFile = function(file) { return (file instanceof o.ChessFile); };

o.ChessFile.prototype.isValidName = function() { return o.isValidName(this.name) };
o.ChessFile.prototype.isValid = function() { return this.isValidName() };
o.ChessFile.prototype.getNeighboringFileName = function(offset) {
  return o.getNeighboringFileName(this.name, offset);
};
o.ChessFile.prototype.getNeighboringFile = function(offset) {
  var neighboringFileName = this.getNeighboringFileName(offset);
  return o.create(neighboringFileName);
};
///

module.exports = o;
