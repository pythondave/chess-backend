/*
This module contains functions for creating and using a chess piece

Typical usage:

  var chessPiece = require([path to this module]);
  var piece = chessPiece.create(color, type);

  OR

  var chessPiece = require([path to this module]);
  var piece = new chessPiece.ChessPiece(color, type);
*/

var o = {};

/// general piece functions
o.isValidColor = function(pieceColor) {
  // returns true if a piece color is valid (b, w), o/w false
  return ['b', 'w'].indexOf(pieceColor) != -1;
};

o.isValidType = function(pieceType) {
  // returns true if a piece type is valid (p, n, b, r, q, k), o/w false
  return ['p', 'n', 'b', 'r', 'q', 'k'].indexOf(pieceType) != -1;
};

o.arePiecesEqual = function(piece1, piece2) {
  // e.g. arePiecesEqual({ color: 'w' type: 'p' }, { color: 'w' type: 'p' }) = true;
  var isNull = function(piece) { return (piece == null); };
  if (isNull(piece1) != isNull(piece2)) return false; //one null, one not
  if (isNull(piece1) && isNull(piece2)) return true; //both null => define as equal
  return (piece1.color == piece2.color && piece1.type == piece2.type);
};
///

/// piece object
o.ChessPiece = function(pieceColor, pieceType) {
  if (!o.isValidColor(pieceColor)) return new Error('Invalid pieceColor');;
  if (!o.isValidType(pieceType)) return new Error('Invalid pieceType');
  this.color = pieceColor;
  this.type = pieceType;
};

o.ChessPiece.prototype.isValid = function() { return o.isValidColor(this.color) && o.isValidType(this.type); };

o.ChessPiece.prototype.isEqual = function(piece) { return o.arePiecesEqual(this, piece); };

o.create = function(pieceColor, pieceType) {
  return new ChessPiece(pieceColor, pieceType);
};
///

module.exports = o;
