var q = require('q');
var _ = require('lodash');
var chessjs = new require('chess.js').Chess();

// *** TODO: split up this function; use in pgn.js

var pgnToPositionMoves = function(existingPositionMoves, pgn) {
  /*
    purpose: extends positionMoves by taking positions arising in pgn
    inputs:
      positionMoves - existing positionMoves [array]
      pgn - pgn data [string]
    returns positionMoves [array]
  */

  var isOkay = chessjs.load_pgn(pgn);
  if (!isOkay) throw err;

  var positionMoves = existingPositionMoves;

  var move = chessjs.history({ verbose: false }).pop();
  while ( chessjs.undo() != null ) {
    fen = chessjs.fen();
    var positionMove = { fen: fen, move: move };
    var exists = _.some(positionMoves, positionMove);
    if (!exists) { positionMoves.push(positionMove); }

    move = chessjs.history({ verbose: false }).pop();
  }
  return positionMoves;
};

var pgnsToPositionMoves = function(pgns, existingPositionMoves) {
  /*
    purpose: extends positionMoves by taking positions arising in pgns
    inputs:
      positionMoves - existing positionMoves [array]
      pgns - pgn data [array]
    returns positionMoves [array]
  */
  existingPositionMoves = existingPositionMoves || [];
  for (var i = 0; i < pgns.length; i++) {
    positionMoves = pgnToPositionMoves(existingPositionMoves, pgns[i]);
  }
  return positionMoves;
}

module.exports = {
  pgnToPositionMoves: pgnToPositionMoves,
  pgnsToPositionMoves: pgnsToPositionMoves
};
