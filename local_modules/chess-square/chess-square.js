/*
This module contains...

Recommended usage:

  var ChessSquare = require([path to this module]);
  var square = new ChessSquare([identifyingInfo]);


*** WIP - still needs writing, including tests

*/

var __base = require('__base');
var chessFile = require(__base + 'local_modules/chess-file');
var chessPiece = require(__base + 'local_modules/chess-piece');

var o = {};

o.doesSquareContainPiece = function(square, piece) {
  // e.g. doesSquareContainPiece({ name: 'e4' }, { color: 'w' type: 'p' }) = true/false;
  return chessPiece.arePiecesEqual(o.chessjs.get(square.name), piece)
};

/// square object
o.ChessSquare = function(fileName, fileOffset, rank) {
  // e.g. deriveSquare('e', -1, 4) = { file: 'd', rank: 4, name: 'd4' }
  var newFile = chessFile.getNeighboringFile(fileName, fileOffset);
  if (!newFile) return false;
  this.fileName = fileName;
  this.rank = rank;
  this.name = newFile + rank;
  return true;
};

o.ChessSquare.prototype.containsPiece = function(piece) { return o.doesSquareContainPiece(this, piece); };

o.create = function(squareName) {
  return new ChessSquare(squareName);
};
///

module.exports = o;
