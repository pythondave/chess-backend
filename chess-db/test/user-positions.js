/*
Tests for chess-db.js

To run tests: 1. cmd; 2. cd [chess-backend folder]; 3. mocha --compilers js:mocha-traceur chess-db/test/user-positions;
*/

var env = process.env.NODE_ENV || 'dev';
var helper = require('./helper');
var chai = require('chai');
var _ = require('lodash');
var chessDb = require('..');

var expect = chai.expect;
var User = chessDb.User;
var Position = chessDb.Position;

describe('UserPosition', function () {
  var fen1, fen2, fen3, fen4, fen5, fen6, fen7, fen8;

  before(function () {
    // re-initialize db and add a user
    fen1 = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq';
    fen2 = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq';
    fen3 = 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq';
    fen4 = 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq';
    fen5 = 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq';
    fen6 = 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq';
    fen7 = 'r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq';
    fen8 = 'r1bqkbnr/1ppp1ppp/p1n5/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R b KQkq';
    this.timeout(5000);
    return chessDb.sequelize.sync({ force: true}).then(function() {
        User.create({ username: 'user1', email: 'a@b.com' });
      });
  });

  it('Create userPosition (find user, findOrCreate position, user.setPositions)', function () {
    return User.find(1).then(function(user) {
      expect(user.id).to.equal(1);
      return Position.findOrCreate({ where: { fen: fen1 } }).spread(function(position, created) {
        expect(position.id).to.equal(1);
        expect(created).to.equal(true);
        return user.setPositions([position]).then(function(positions) {
          expect(positions).to.have.length(1);
          expect(positions[0]).to.have.length(1);
          expect(positions[0][0].isNewRecord).to.be.true;
        });
      });
    });
  });

  it('Create userPosition (repeat - different expectations since records now exist)', function () {
    return User.find(1).then(function(user) {
      expect(user.id).to.equal(1);
      return Position.findOrCreate({ where: { fen: fen1 } }).spread(function(position, created) {
        expect(position.id).to.equal(1);
        expect(created).to.equal(false); //different
        return user.setPositions([position]).then(function(positions) {
          expect(positions).to.have.length(0); //different
        });
      });
    });
  });

  it('Create multiple userPositions (one of which may exist, some which don\'t)', function () {
    return User.find(1).then(function(user) {
      expect(user.id).to.equal(1);
      var positions = [ { fen: fen1 }, { fen: fen2 }, { fen: fen3 }, { fen: fen4 },
                        { fen: fen5 }, { fen: fen6 }, { fen: fen7 }, { fen: fen8 } ];
      var options = { ignoreDuplicates: true, validate: true };
      return Position.bulkCreate(positions, options).then(function(positions) {
        expect(positions).to.have.length(8);
        var query = { where: { fen: { 'in': [fen1, fen2, fen3, fen4, fen5, fen6, fen7, fen8] } } };
        return Position.findAll(query).then(function(positions) { // note: "To obtain Instances for the newly created values, you will need to query for them again." - source: http://sequelize.readthedocs.org/en/latest/api/model/index.html#bulkcreaterecords-options-promisearrayinstance
          expect(positions).to.have.length(8);
          return user.setPositions(positions).then(function(positions) {
            expect(positions[0].length <= 8).to.be.true; // 8 when test run in isolation
            expect(positions[0].length >= 7).to.be.true; // 7 when 1 inserted in earlier test
          });
        });
      });
    });
  });
});
