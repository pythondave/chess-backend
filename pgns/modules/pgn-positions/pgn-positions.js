var _ = require('lodash');
var chessjs = new require('chess.js').Chess();
var __base = require('__base');
var chessjsExtension = require(__base + 'local_modules/chessjs-extension');

chessjs.extension = chessjsExtension(chessjs);

var o = {};

o.filterGenerators = { // functions which produce a filter function
  /*
  Notes:
    These filter generators are very useful
    They help to write clean, flexible and reasonably efficient code (e.g. duplicates can be barred entry in several ways)
    They're complex functions (e.g. functions of functions of functions), so they may be a little tricky to understand

  Filtering types:
    1. Don't add position moves which already occurred in current pgn
    2. Don't add position moves which already occurred in pgns array
    3. Don't add position moves which were previously identified elsewhere
  */
  none: function() { return function() { return false; }; }, // no filtering - all position moves will be added
  unique: function() { return function(type1positionMoves, positionMove) {
    return _.some(type1positionMoves, positionMove);
  }; },
  uniqueNew: function(type3PositionMoves) { return function(type1positionMoves, positionMove) {
    return _.some(type1positionMoves, positionMove)
        || _.some(type3PositionMoves, positionMove);
  }; },
  double: { // functions which produce a filter generator function
    none: function() { return o.filterGenerators.none; },
    unique: function() { return o.filterGenerators.uniqueNew; },
    uniqueNew: function(type3PositionMoves) { return function(type2PositionMoves) {
      return function(type1positionMoves, positionMove) {
        return _.some(type1positionMoves, positionMove)
            || _.some(type2PositionMoves, positionMove)
            || _.some(type3PositionMoves, positionMove);
      };
    }; }
  }
};

o.pgnToPositionMoves = function(pgn, filter) {
  /*
    purpose: turns a pgn string into an array of positionMoves
    note: any positionMove which is passed to filter and returns true is ignored
    inputs:
      pgn - pgn data [string]
      filter - function for filtering position moves as they're identified [function(positionMoves, positionMove)]
    returns positionMoves [array]
  */
  var isOkay = chessjs.load_pgn(pgn);
  if (!isOkay) throw err;

  filter = filter || o.filterGenerators.none();
  var positionMoves = [];

  var move = chessjs.history({ verbose: false }).pop();
  while ( chessjs.undo() != null ) {
    var fen = chessjs.extension.getNormalizedFen();
    var positionMove = { fen: fen, move: move };
    if (!filter(positionMoves, positionMove)) { positionMoves.push(positionMove); }

    move = chessjs.history({ verbose: false }).pop(); //note - works backwards through game
  }
  return positionMoves;
};

o.pgnToUniquePositionMoves = function(pgn) {
  // pgnToPositionMoves with filter which doesn't let duplicates in
  return o.pgnToPositionMoves(pgn, o.filterGenerators.unique());
};

o.pgnToUniqueNewPositionMoves = function(pgn, existingPositionMoves) {
  // pgnToPositionMoves with filter which doesn't let duplicates or previously existing position moves in
  return o.pgnToPositionMoves(pgn, o.filterGenerators.uniqueNew(existingPositionMoves));
};

o.pgnsToPositionMoves = function(pgns, doubleFilter) {
  /*
    purpose: turns an array of pgn strings into an array of positionMoves
    note: any positionMove passed to filter returning true is ignored
    inputs:
      pgns - pgn data [array]
      doubleFilter - function for filtering position moves as they're identified [complex function]
    returns positionMoves [array]
  */
  doubleFilter = doubleFilter || o.filterGenerators.double.none();
  var filter;
  var positionMoves = [];
  for (var i = 0; i < pgns.length; i++) {
    filter = doubleFilter(positionMoves);
    var newPositionMoves = o.pgnToPositionMoves(pgns[i], filter);
    positionMoves = positionMoves.concat(newPositionMoves);
  }
  return positionMoves;
};

o.pgnsToUniquePositionMoves = function(pgns) {
  // pgnsToPositionMoves with filter which doesn't let duplicates in (either within a pgn or between pgns)
  return o.pgnsToPositionMoves(pgns, o.filterGenerators.double.unique());
};

o.pgnsToUniqueNewPositionMoves = function(pgns, existingPositionMoves) {
  // pgnsToPositionMoves with filter which doesn't let duplicates in (either within a pgn or between pgns, or which are in existingPositionMoves)
  return o.pgnsToPositionMoves(pgns, o.filterGenerators.double.uniqueNew(existingPositionMoves));
};

// *** TODO: move this elsewhere (not actually used within this module, but may be useful)
o.sortAndDedupeArrayOfObjects = function(array, isSorted, sortByProperties) {
  var sortedArray = isSorted ? array : _.sortByAll(array, sortByProperties);
  var newArray = _.forEachRight(sortedArray, function(value, index, array) {
    if (_.isEqual(value, array[index+1])) array.splice(index, 1);
  });
  return newArray;  
};

module.exports = o;
