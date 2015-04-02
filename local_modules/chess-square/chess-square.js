/*
This module contains functions for creating and using a chess square

Recommended usage:

  var chessSquare = require([path to this module]);
  var square = chessSquare.create('e4');

See tests and code below for more info.
*/

var _ = require('lodash');
var __base = require('__base');
var chessFile = require(__base + 'local_modules/chess-file');

var o = {};

o.isValidName = function(squareName) {
  // returns true if a square name is valid (a-h + 1-8), o/w false
  // e.g. isValidName('e4') = true; isValidName('e9') = false;
  if (!squareName || squareName.length != 2) return false;
  var fileName = squareName.substr(0, 1);
  var rankName = squareName.substr(1, 1);
  return (!(fileName < 'a' || fileName > 'h' || rankName < '1' || rankName > '8'));
};

o.normalizeSquareName = function(squareName) {
  // returns a valid square name (e.g. e4) or undefined
  // e.g. normalizeFile('e4') = 'e4'; normalizeFile('e9') = undefined;
  return o.isValidName(squareName) ? squareName : undefined;
};

o.deriveSquareName = function(paramsObjectOrFileName, fileOffset, rank) {
  // e.g. deriveSquareName('e', -1, 4) = 'd4'
  // OR deriveSquareName({ fileName: 'e', fileOffset: -1, rank: 4 }) = 'd4'
  var fileName;
  if (arguments.length == 0) throw new Error('No parameters');
  if (_.isPlainObject(paramsObjectOrFileName)) {
    fileName = paramsObjectOrFileName.fileName;
    fileOffset = paramsObjectOrFileName.fileOffset;
    rank = paramsObjectOrFileName.rank;
  } else {
    fileName = paramsObjectOrFileName;
  }

  var newFile = chessFile.getNeighboringFileName(fileName, fileOffset);
  return o.normalizeSquareName(newFile + rank);
};

/// square object
o.ChessSquare = function(paramsObjectOrParam, fileOffset, rank) {
  /*
    can be instantiated in 4 different ways. e.g.
      1. ChessSquare({ name: 'd4' })
      2. ChessSquare({ fileName: 'e', fileOffset: -1, rank: 4 })
      3. ChessSquare('d4') //sugar for 1
      4. ChessSquare('e', -1, 4) //sugar for 2
  */
  if (arguments.length == 0) throw new Error('No parameters');
  if (arguments.length == 1 && _.isPlainObject(paramsObjectOrParam))
    return o.createFromParamsObject.call(this, paramsObjectOrParam); //1,2
  if (arguments.length == 1) return o.createFromSquareName.call(this, paramsObjectOrParam); //3
  if (arguments.length == 3) return o.createFromFileOffset.call(this, paramsObjectOrParam, fileOffset, rank); //4
  throw new Error('Invalid parameters');
};

o.create = function(paramsObjectOrParam, fileOffset, rank) {
  // sugar for ChessSquare
  var chessSquare = Object.create(o.ChessSquare.prototype);
  o.ChessSquare.apply(chessSquare, arguments);
  return chessSquare;
};

o.createFromParamsObject = function(paramsObject) {
  var p = paramsObject;
  if (p.name) return o.createFromSquareName.call(this, p.name);
  if (p.fileName && p.fileOffset && p.rank) return o.createFromFileOffset.call(this, p.fileName, p.fileOffset, p.rank);
  throw new Error('Invalid parameters');
};

o.createFromSquareName = function(squareName) {
  if (!o.isValidName(squareName)) throw new Error('Invalid name');
  this.name = squareName;
};

o.createFromFileOffset = function(fileName, fileOffset, rank) {
  var squareName = o.deriveSquareName(fileName, fileOffset, rank);
  if (!squareName) throw new Error('Invalid square');
  o.createFromSquareName.call(this, squareName);
};

o.isSquare = function(square) { return (square instanceof o.ChessSquare); };

o.ChessSquare.prototype.isValidName = function() { return o.isValidName(this.name) };
o.ChessSquare.prototype.isValid = function() { return this.isValidName(); };
///

module.exports = o;
