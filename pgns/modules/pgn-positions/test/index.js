/*
Tests for pgn-positions.js

To run tests:
  1. cmd
  2. cd [chess-backend folder]
  3. mocha pgns/modules/pgn-positions/test
*/

var chai = require('chai');
var pgnPositions = require('..');

var expect = chai.expect;

var initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq';

describe('pgnToPositionMoves - simple pgn', function() {
  var pgn, positionMoves;
  before(function () {
    pgn = '1. e4';
    positionMoves = pgnPositions.pgnToPositionMoves(pgn);
  });

  it('length => 1', function() {
    expect(positionMoves).to.have.length(1);
  });

  it('positionMove[0].fen => initialFen', function() {
    expect(positionMoves[0].fen).to.equal(initialFen);
  });

  it('positionMove[0].move => e4', function() {
    expect(positionMoves[0].move).to.equal('e4');
  });
});

describe('pgnToPositionMoves - typical pgn', function() {
  var pgn, fenBeforeFinalMove, positionMoves;
  before(function () {
    pgn = "[Event \"Chess Position Trainer\"][Site \"Chess Position Trainer\"][Date \"????.??.??\"][White \"Other\"][Black \"1.\"][Result \"*\"]1. e4 d6 2. d4 Nf6 3. Nc3 c6 4. f4 Qa5 5. Bd3 e5 6. Nf3 Bg4 7. Be3 Nbd7 8. O-O Be7 9. h3 Bh5 10. Qd2 *";
    fenBeforeFinalMove = 'r3k2r/pp1nbppp/2pp1n2/q3p2b/3PPP2/2NBBN1P/PPP3P1/R2Q1RK1 w kq';
    positionMoves = pgnPositions.pgnToPositionMoves(pgn);
  });

  it('length => 19', function() {
    expect(positionMoves).to.have.length(19);
  });

  it('positionMove[18].fen => initialFen', function() {
    expect(positionMoves[18].fen).to.equal(initialFen);
  });

  it('positionMove[18].move => e4', function() {
    expect(positionMoves[18].move).to.equal('e4');
  });

  it('positionMove[0].fen => fenBeforeFinalMove', function() {
    expect(positionMoves[0].fen).to.equal(fenBeforeFinalMove);
  });

  it('positionMove[0].move => Qd2', function() {
    expect(positionMoves[0].move).to.equal('Qd2');
  });
});

describe('pgnToUniquePositionMoves', function() {
  var pgn, positionMoves;
  before(function () {
    pgn = "1. Nf3 Nf6 2. Ng1 Ng8 3. Nf3 Nf6 4. Ng1 Ng8"; // silly game!
    positionMoves = pgnPositions.pgnToUniquePositionMoves(pgn);
  });

  it('length => 4', function() {
    expect(positionMoves).to.have.length(4);
  });
});

describe('pgnToUniqueNewPositionMoves', function() {
  var pgnWith19PositionMoves, existingPositionMoves, positionMoves;
  before(function () {
    pgnWith19PositionMoves = "[Event \"Chess Position Trainer\"][Site \"Chess Position Trainer\"][Date \"????.??.??\"][White \"Other\"][Black \"1.\"][Result \"*\"]1. e4 d6 2. d4 Nf6 3. Nc3 c6 4. f4 Qa5 5. Bd3 e5 6. Nf3 Bg4 7. Be3 Nbd7 8. O-O Be7 9. h3 Bh5 10. Qd2 *";
    existingPositionMoves = [
      { fen: 'r3kb1r/pp1n1ppp/2pp1n2/q3p3/3PPPb1/2NBBN2/PPP3PP/R2QK2R w KQkq', move: 'O-O' },
      { fen: 'rn2kb1r/pp3ppp/2pp1n2/q3p3/3PPPb1/2NBBN2/PPP3PP/R2QK2R b KQkq', move: 'Nbd7' },
      { fen: 'rn2kb1r/pp3ppp/2pp1n2/q3p3/3PPPb1/2NB1N2/PPP3PP/R1BQK2R w KQkq', move: 'Be3' }
    ];
     positionMoves = pgnPositions.pgnToUniqueNewPositionMoves(pgnWith19PositionMoves, existingPositionMoves);
  });

  it('length => 16', function() {
    expect(positionMoves).to.have.length(16);
  });
});

describe('pgnsToPositionMoves - simple pgns', function() {
  var pgns, positionMoves;
  before(function () {
    pgns = ['1. e4 e5 2. Nf3', '1. e4 e5 2. Nc3']; // note: 2 pgns, 6 moves, 4 unique position moves
    positionMoves = pgnPositions.pgnsToPositionMoves(pgns);
  });

  it('length => 6', function() {
    expect(positionMoves).to.have.length(6);
  });
});

describe('pgnsToUniquePositionMoves - simple pgns', function() {
  var pgns, positionMoves;
  before(function () {
    pgns = ['1. e4 e5 2. Nf3', '1. e4 e5 2. Nc3']; // note: 2 pgns, 6 moves, 4 unique position moves
    positionMoves = pgnPositions.pgnsToUniquePositionMoves(pgns);
  });

  it('length => 4', function() {
    expect(positionMoves).to.have.length(4);
  });
});

describe('pgnsToUniqueNewPositionMoves - simple pgns', function() {
  var pgns, positionMoves;
  before(function () {
    pgns = ['1. e4 e5 2. Nf3', '1. e4 e5 2. Nc3']; // note: 2 pgns, 6 moves, 4 unique position moves
    existingPositionMoves = [
      { fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq', move: 'e5' }
    ];
    positionMoves = pgnPositions.pgnsToUniqueNewPositionMoves(pgns, existingPositionMoves);
  });

  it('length => 3', function() {
    expect(positionMoves).to.have.length(3);
  });
});

describe('*** TODO - move elsewhere (not used within this module)', function() {
  var positionMoves;
  before(function () {
    positionMoves = [
      { fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq', move: 'Nf3' },
      { fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq', move: 'e5' },
      { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq', move: 'e4' },
      { fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq', move: 'Nc3' },
      { fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq', move: 'e5' },
      { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq', move: 'e4' }
    ];
  });

  it('sortAndDedupeArrayOfObjects', function() {
    expect(pgnPositions.sortAndDedupeArrayOfObjects(positionMoves, false, ['fen', 'move'])).to.have.length(4);
  });
});
