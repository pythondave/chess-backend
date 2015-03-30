// To run: 1. cmd 2. cd {current folder} 3. node pgn-parser.js -i pgns/example-many.pgn -o example-output.txt -n 1

var fs = require('fs');
var q = require('q');
var _ = require('lodash');
var pgn = require('./modules/pgn');
var argv = require('minimist')(process.argv.slice(2));
var chessjs = new require('chess.js').Chess();
console.log('Inputs: ', argv);

var inputFilename = argv.i || 'example.pgn';
var outputFilename = argv.o || 'example-output.txt';

// Make sure we got a filename on the command line.
if (!argv.n) {
  console.log('No -n switch specified. EXITING');
  process.exit(1);
};

//
var getPossibleNextPositionFens = function(fen) {
  //
  var a = [];
  if(!fen) return;
  chessjs.reset();
  var isOkay = chessjs.load(fen);
  if (isOkay) {
    var moves = chessjs.moves();
    for (var i = 0; i < moves.length; i++) {
      var move = moves[i];
      chessjs.move(move);
      var fen = chessjs.fen();
      //*** TODO: to make 'fen' represent unique positions, remove last 2 values and remove e.p. square if e.p. no possible (use chess js .get(square) method)
      a.push({ move: move, fen: chessjs.fen() });
      chessjs.undo();
    }
    return a;
  }
};

if (argv.n == 1) {
  console.log('Running pgnInputOutputExample...');
  pgn.processPgnFile(inputFilename, outputFilename);
}
if (argv.n == 3) {
  console.log('Running getPossibleNextPositionFens...');
  //var fens = getPossibleNextPositionFens('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  var fens = getPossibleNextPositionFens('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1');
  console.log(fens);
}
