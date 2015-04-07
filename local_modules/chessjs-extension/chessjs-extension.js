/*
This module contains functions which can be used to extend chessjs.

Recommended usage:

  var chessjs = new require('chess.js').Chess();
  chessjs.extension = require([path to this module])(chessjs);

OR (in longhand):

  var chessDotJs = new require('chess.js');
  var __base = require('__base');
  var chessjsExtension = require(__base + [path from base to this module]);
  var chessjs = chessDotJs.Chess();
  chessjs.extension = chessjsExtension(chessjs);

This will attach the functions below to chessjs.extension. This which have minimal impact on chessjs, and therefore minimise potential conflicts.

*** TODO: consider forking chessjs and extending more formally within the fork
*** TODO: consider how to make the declaration even shorter
*/

var _ = require('lodash');

var o = {};

o.getEnPassantSquareName = function() {
  //e.g. returns a square (e.g. 'e3') if standard fen contains an e.p. part, o/w null
  var standardFenEnPassantPart = o.chessjs.fen().split(' ')[3];
  return (standardFenEnPassantPart == '-') ? null : standardFenEnPassantPart;
};

o.isEnPassantPossible = function() {
  var moves = o.chessjs.moves({ verbose: true });
  return _.some(moves, { flags: 'e'});
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
