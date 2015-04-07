/*
This module contains functions which can be used to extend chessjs.

Recommended usage:

  var chessjs = new require('chess.js').Chess();
  chessjs.extension = require([path to this module])(chessjs);

OR (in longhand):

  var chessJs = new require('chess.js');
  var __base = require('__base');
  var chessjsExtension = require(__base + [path from base to this module]);
  var chessjs = chessJs.Chess();
  chessjs.extension = chessjsExtension(chessjs);

This will attach the functions below to chessjs.extension. This which have minimal impact on chessjs, and therefore minimise potential conflicts.

*** TODO: consider forking chessjs and extending more formally within the fork.
*/

var _ = require('lodash');
var __base = require('__base');
var chessFile = require(__base + 'local_modules/chess-file');
var chessPiece = require(__base + 'local_modules/chess-piece');
var chessSquare = require(__base + 'local_modules/chess-square');

var o = {};

o.doesSquareContainPiece = function(squareParams, pieceParams) {
  /*
    can be used in various different ways. e.g.
      1. various ways of identifying a square (list, plain object x2, square object):
        a. doesSquareContainPiece('d4', ...)
        b. doesSquareContainPiece({ name: 'd4' }, ...)
        c. doesSquareContainPiece({ fileName: 'e', fileOffset: -1, rank: 4 }, ...)
        d. doesSquareContainPiece(chessSquare.create('d4'), ...)
      2. various ways of identifying a piece (list, plain object, piece object):
        a. doesSquareContainPiece(..., 'w', 'p')
        b. doesSquareContainPiece(..., { color: 'w', type: 'p' })
        c. doesSquareContainPiece(..., chessPiece.create('w', 'p'))
  */
  var square = (chessSquare.isSquare(squareParams) ? squareParams : chessSquare.create(squareParams));
  var pieceOnSquare = this.chessjs.get(square.name);
  var pieceArguments = [].slice.call(arguments,1);
  var pieceToCompare = (chessPiece.isPiece(pieceParams) ? pieceParams : chessPiece.create.apply(this, pieceArguments));
  return chessPiece.arePiecesEqual(pieceOnSquare, pieceToCompare);
};

o.getEnPassantSquareName = function() {
  //e.g. returns a square (e.g. 'e3') if standard fen contains an e.p. part, o/w null
  var standardFenEnPassantPart = o.chessjs.fen().split(' ')[3];
  return (standardFenEnPassantPart == '-') ? null : standardFenEnPassantPart;
};

o.isEnPassantPossible2 = function() {
  var moves = o.chessjs.moves({ verbose: true });
  return _.some(moves, { flags: 'e'});
};

o.isEnPassantPossible = function() {
  // returns true if en passant is possible, o/w false
  // *** TODO: test against some positions where the player to move is in check
  // strategy: identify the squares which e.p. can be made from, if the right color pawn is on one, return true, o/w false
  var fen = o.chessjs.fen();
  var enPassantSquare = o.getEnPassantSquareName(fen); // e.g. e3
  if (enPassantSquare == null) return false; // no potential e.p.
  var enPassantSquareFile = enPassantSquare[0]; // e.g. 'e'
  var colorToCheck = o.chessjs.turn(); // e.g. 'b' => black to move, so will need to check for black pawns
  var rankToCheck = (colorToCheck == 'b' ? 4 : 5); // e.g. check for black pawns on 4th rank
  var pieceToCheck = { color: colorToCheck, type: 'p' }; // e.g. black pawn
  var square1ToCheck = chessSquare.deriveSquareName({ fileName: enPassantSquareFile, fileOffset: -1, rank: rankToCheck });
  var square2ToCheck = chessSquare.deriveSquareName({ fileName: enPassantSquareFile, fileOffset: 1, rank: rankToCheck });
  if ( square1ToCheck && o.doesSquareContainPiece(square1ToCheck, pieceToCheck) ) return true;
  if ( square2ToCheck && o.doesSquareContainPiece(square2ToCheck, pieceToCheck) ) return true;
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
  return first3Parts + (o.isEnPassantPossible() ? ' ' + o.getEnPassantSquareName() : '')
};

module.exports = function(chessjs) { o.chessjs = chessjs; return o; };
