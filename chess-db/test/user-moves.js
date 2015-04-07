/*
Tests for chess-db.js

To run tests: 1. cmd; 2. cd [chess-backend folder]; 3. mocha --compilers js:mocha-traceur chess-db/test/user-moves;
*/

var env = process.env.NODE_ENV || 'dev';
var helper = require('./helper');
var chai = require('chai');
var _ = require('lodash');
var chessDb = require('..');

var expect = chai.expect;
var Position = chessDb.Position;
var Move = chessDb.Move;
var User = chessDb.User;

describe('Move', function () {
  var pId1, fen1, fen2, fen3, fen4, fen5, fen6, fen7, fen8, invalidFen, messageForInvalidFen;
  var user1, user2, user3;

  before(function () {
    user1 = { username: 'user1', email: 'a@b.com' };
    user2 = { username: 'user2', email: 'c@d.com' };
    user3 = { username: 'user3', email: 'e@f.com' };
    fen1 = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq';
    fen2 = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq';
    fen3 = 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq';
    fen4 = 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq';
    fen5 = 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq';
    fen6 = 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq';
    fen7 = 'r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq';
    fen8 = 'r1bqkbnr/1ppp1ppp/p1n5/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R b KQkq';
    invalidFen = 'hello world';
    messageForInvalidFen = 'Not a valid FEN. It may be that you haven\'t \'normalized\' your FEN (which you can do using the normalizeFen method).';
    this.timeout(5000);
    return chessDb.sequelize.sync({ force: true});
  });

  it('create', function () {
    // addes a user, a position, a move (i.e. associates a move with that position) and a user move (i.e. associates the user with that move)
    return chessDb.Sequelize.Promise.all([
      User.findOrCreate({ where: user1 }),
      Position.findOrCreate({ where: { fen: fen1 } })
    ])
    .spread(function(userData, positionData) {
      var user = userData[0];
      var position = positionData[0];
      return Move.create({ positionId: position.id, move: 'e4' }).then(function(move) {
        return user.addMove(move).then(function(userMove) {
          expect(userMove.userId).to.equal(1);
          expect(userMove.moveId).to.equal(1);
        });
      });
    });
  });
});
