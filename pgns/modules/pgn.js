var q = require('q');
var saveJs = require('./save-js');
var pgnFiles = require('./pgn-files');
var pgnPositions = require('./pgn-positions');

//var pgnInputOutputExample = function() {
  /* examples of use:
    node pgn-parser.js -n 1 -i pgns\example-one.pgn
    node pgn-parser.js -n 1 -i pgns\example.pgn -o example-output.txt
  */

var processPgnFile = function(inputFilename, outputFilename) {
  // Read the input file, parse pgn, get all fens-move combinations, write to output file

  var info = {};
  q.all([ // prepare data
    saveJs.load(outputFilename),
    pgnFiles.load(inputFilename)
  ]).then(function(data) { // process
    var existingPositionMoves = data[0] || [];
    var pgns = data[1];
    info.numPositionMovesBefore = existingPositionMoves.length;
    info.numPgns = pgns.length;
    return pgnPositions.pgnsToPositionMoves(pgns, existingPositionMoves);
  }).then(function(positionMoves) { // save data
    info.numPositionMovesAfter = positionMoves.length;
    info.numNewPositionMoves = info.numPositionMovesAfter - info.numPositionMovesBefore;
    return saveJs.save(outputFilename, positionMoves);
  }).then(function() { // report
    console.log('Success!', info);
  })
  .catch(function(err) {
    console.log(err);
  }).done();
};

module.exports = {
  processPgnFile: processPgnFile
}
