/*
This module contains functions for creating and using a chess piece

Typical usage:

  var chessPiece = require([path to this module]);
  var piece = chessPiece.create('w', 'p');

See tests and code below for more info.
*/

var _ = require('lodash');

var o = {};

/// general piece functions
o.isValidColor = function(pieceColor) {
  // returns true if a piece color is valid (b, w), o/w false
  var validPieceColors = ['b', 'w'];
  return _.includes(validPieceColors, pieceColor);
};

o.isValidType = function(pieceType) {
  // returns true if a piece type is valid (p, n, b, r, q, k), o/w false
  var validPieceTypes = ['p', 'n', 'b', 'r', 'q', 'k'];
  return _.includes(validPieceTypes, pieceType);
};

o.isValid = function(pieceColor, pieceType) {
  // returns true if valid color and type, o/w false
  return o.isValidColor(pieceColor) && o.isValidType(pieceType);
};

o.arePiecesEqual = function(piece1, piece2) {
  // e.g. arePiecesEqual({ color: 'w' type: 'p' }, { color: 'w' type: 'p' }) = true;
  if (_.isNull(piece1) != _.isNull(piece2)) return false; //one null, one not
  if (_.isNull(piece1) && _.isNull(piece2)) return true; //both null => define as equal
  return (piece1.color == piece2.color && piece1.type == piece2.type);
};
///

/// piece object
o.ChessPiece = function(paramsObjectOrPieceColor, pieceType) {
  /*
    can be instantiated in 2 different ways. e.g.
      1. ChessPiece({ color: 'w', type: 'p' })
      2. ChessPiece('w', 'p') //sugar for 1
  */
  if (arguments.length == 0) throw new Error('No parameters');
  if (arguments.length == 1 && _.isPlainObject(paramsObjectOrPieceColor))
    return o.createFromParamsObject.call(this, paramsObjectOrPieceColor); //1
  if (arguments.length == 2) return o.createFromParameterList.call(this, paramsObjectOrPieceColor, pieceType); //2
  throw new Error('Invalid parameters');
};

o.create = function(paramsObjectOrPieceColor, pieceType) {
  // sugar for ChessPiece
  var chessPiece = Object.create(o.ChessPiece.prototype);
  o.ChessPiece.apply(chessPiece, arguments);
  return chessPiece;
};

o.createFromParamsObject = function(paramsObject) {
  return o.createFromParameterList.call(this, paramsObject.color, paramsObject.type);
};

o.createFromParameterList = function(pieceColor, pieceType) {
  if (!o.isValidColor(pieceColor)) throw new Error('Invalid color');
  if (!o.isValidType(pieceType)) throw new Error('Invalid type');
  this.color = pieceColor;
  this.type = pieceType;
};

o.isPiece = function(piece) { return (piece instanceof o.ChessPiece); };

o.ChessPiece.prototype.isValidColor = function() { return o.isValidColor(this.color) };
o.ChessPiece.prototype.isValidType = function() { return o.isValidType(this.type); };
o.ChessPiece.prototype.isValid = function() { return this.isValidColor() && this.isValidType(); };
o.ChessPiece.prototype.isEqual = function(piece) { return o.arePiecesEqual(this, piece); };
///

module.exports = o;
