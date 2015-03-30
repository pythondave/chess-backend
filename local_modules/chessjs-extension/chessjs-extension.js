/*
This module contains functions which can be used to extend chessjs.

Recommended usage:

  var chessjs = new require('chess.js').Chess();
  chessjs.extension = require([path to this module])(chessjs);
  
This will attach the functions below to chessjs.extension. This which have minimal impact on chessjs, and therefore minimise potential conflicts.

*** TODO: consider forking chessjs and extending more formally within the fork.

*** WIP - needs re-writing to make use of chess-square etc., including tests
*/

/*
var __base = require('__base');
var chessFile = require(__base + 'local_modules/chess-file');
var chessPiece = require(__base + 'local_modules/chess-piece');
var chessSquare = require(__base + 'local_modules/chess-square');
*/

var o = {};

o.getEnPassantSquare = function() {
  //e.g. returns a square object (e.g. { name: 'e3' }) if standard fen contains an e.p. part, o/w null
  var standardFenEnPassantPart = o.chessjs.fen().split(' ')[3];
  return (standardFenEnPassantPart == '-') ? null : { name: standardFenEnPassantPart };
};

o.normalizeFile = function(file) {
  // returns a valid file (a-h) or undefined
  // e.g. normalizeFile('a') = 'a'; normalizeFile('z') = undefined;
  return ('a' <= file && file <= 'h') ? file : undefined;
};

o.getNeighboringFile = function(file, offset) {
  // e.g. getNeighboringFile('e', -1) = 'd'; getNeighboringFile('h', 1) = undefined;
  return o.normalizeFile(String.fromCharCode(file.charCodeAt(0) + offset));
};

o.arePiecesEqual = function(piece1, piece2) {
  // e.g. arePiecesEqual({ color: 'w' type: 'p' }, { color: 'w' type: 'p' }) = true;
  if (piece1 == null && piece2 != null) return false;
  if (piece1 != null && piece2 == null) return false;
  return (piece1.color == piece2.color && piece1.type == piece2.type);
};

o.doesSquareContainPiece = function(square, piece) {
  // e.g. doesSquareContainPiece({ name: 'e4' }, { color: 'w' type: 'p' }) = true/false;
  return o.arePiecesEqual(o.chessjs.get(square.name), piece)
};

o.deriveSquare = function(file, fileOffset, rank) {
  // e.g. deriveSquare('e', -1, 4) = { file: 'd', rank: 4, name: 'd4' }
  var newFile = o.getNeighboringFile(file, fileOffset);
  return (newFile ? { file: file, rank: rank, name: newFile + rank } : null );
};

o.isEnPassantPossible = function() {
  // returns true if en passant is possible, o/w false
  // *** TODO: test against some positions where the player to move is in check
  // strategy: identify the squares which e.p. can be made from, if the right color pawn is on one, return true, o/w false
  var fen = o.chessjs.fen();
  var enPassantSquare = o.getEnPassantSquare(fen); // e.g. e3
  if (enPassantSquare == null) return false; // no potential e.p.
  var enPassantSquareFile = enPassantSquare[0]; // e.g. 'e'
  var colorToCheck = o.chessjs.turn(); // e.g. 'b' => black to move, so will need to check for black pawns
  var rankToCheck = (colorToCheck == 'b' ? 4 : 5); // e.g. check for black pawns on 4th rank
  var f = function(file, fileOffset, rank, pieceColor, pieceType) {
    var square1ToCheck = o.getNeighboringFile(file, -1) + rank; // e.g. check d4
    if ( o.doesSquareContainPiece(square1ToCheck, pieceColor, pieceType) ) return true;    
  };
  if ( f(enPassantSquareFile, -1, colorToCheck, rankToCheck) ) return true;


  var square1ToCheck = o.deriveSquare(enPassantSquareFile, -1, rankToCheck); // e.g. check { name: 'd4' }
  if ( o.doesSquareContainPiece(square1ToCheck, colorToCheck, 'p') ) return true;
  var square2ToCheck = o.getNeighboringFile(enPassantSquareFile, 1) + rankToCheck; // e.g. check f4
  if ( o.doesSquareContainPiece(square2ToCheck, colorToCheck, 'p') ) return true;
  return false;
};

o.loadFlexibleFen = function(str) {
  // a more forgiving version of chessjs.load (which insists on 6-part fens)
  // returns true if loaded, o/w false

  if (!str) return;

  var prepareFenForLoadFunction = function(str) {
    // returns a simple 6-part string (which the standard chessjs load function can handle)
    var parts = str.split(' ');
    if (parts.length < 3) return; // something must be wrong
    if (parts.length == 3) return str + ' - 0 1'; // add 3 simple hard-coded parts
    return parts.slice(0,4).join(' ') + ' 0 1'; // take first 4 parts and 2 simple hard-coded parts
  };

  var fen = prepareFenForLoadFunction(str);
  if (!fen) return false; // invalid fen
  var isLoaded = o.chessjs.load(fen);
  return isLoaded;
};

o.normalizeFen = function(str) {
  // returns a fen with unnecessary (for our purposes) terms removed
  var isLoaded = o.loadFlexibleFen(str);
  return isLoaded ? o.getNormalizedFen() : undefined;
};

o.getNormalizedFen = function() {
  // returns a fen with unnecessary (for our purposes) terms removed
  var first3Parts = o.chessjs.fen().split(' ').slice(0,3).join(' ');
  return first3Parts + (o.isEnPassantPossible() ? ' ' + o.getEnPassantSquare() : '')
};

module.exports = function(chessjs) { o.chessjs = chessjs; return o; };
