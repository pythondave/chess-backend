/*
Tests for chess-db.js

To run tests: 1. cmd; 2. cd [chess-backend folder]; 3. mocha --compilers js:mocha-traceur chess-db/test/positions;
*/

var env = process.env.NODE_ENV || 'dev';
var helper = require('./helper');
var chai = require('chai');
var _ = require('lodash');
var chessDb = require('..');

var expect = chai.expect;
var Position = chessDb.Position;

describe('Position', function () {
  var pId1, fen1, fen2, fen3, fen4, fen5, fen6, fen7, fen8, invalidFen, unnormalizedFen, messageForInvalidFen;

  before(function () {
    pId1 = 'aqzr7l';
    fen1 = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq';
    fen2 = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq';
    fen3 = 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq';
    fen4 = 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq';
    fen5 = 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq';
    fen6 = 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq';
    fen7 = 'r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq';
    fen8 = 'r1bqkbnr/1ppp1ppp/p1n5/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R b KQkq';
    invalidFen = 'hello world';
    unnormalizedFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    messageForInvalidFen = 'Not a valid FEN. It may be that you haven\'t \'normalized\' your FEN (which you can do using the normalizeFen method).';
    this.timeout(5000);
    return chessDb.sequelize.sync({ force: true});
  });

  it('check instance method names', function () {
    var expectedMethodNames = [];
    expectedMethodNames.push(...helper.getHasManyMethodNames('Move'));
    expectedMethodNames.push(...helper.getBelongsToManyMethodNames('User'));
    var methodNamesNotInInstance = _.difference(expectedMethodNames, _.functions(Position.build()));
    expect(methodNamesNotInInstance.length).to.equal(0);
  });

  describe('class methods', function () {
    it('pIdToId aqzr7l => 1)', function () {
      expect(chessDb.Position.pIdToId(pId1)).to.equal(1);
    });
  });

  describe('create and find', function () {
    it('create(fen1) => id 1', function () {
      return Position.create({ fen: fen1 }).then(function(position) {
        expect(position.id).to.equal(1);
      });
    });

    it('find(1) => pId aqzr7l', function () {
      return Position.find(1).then(function(position) {
        expect(position.pId()).to.equal(pId1);
      });
    });

    it('create(fen2) => id 2', function () {
      return Position.create({ fen: fen2 }).then(function(position) {
        expect(position.id).to.equal(2);
      });
    });

    it('findAll() => length 2', function () {
      return Position.findAll().then(function(positions) {
        expect(positions).to.have.length(2);
      })
    });

    it('create(fen2) => unique error', function () {
      return Position.create({ fen: fen2 })
      .catch(function(err) {
        expect(err.errors[0].message).to.equal('fen must be unique');
      });
    });

    it('create(invalidFen) => fen validation error', function () {
      return Position.create({ fen: invalidFen })
      .catch(function(err) {
        expect(err.errors[0].message).to.equal(messageForInvalidFen);
      });
    });

    it('findOrCreate(fen3) => id 4, created true', function () {
      return Position.findOrCreate({ where: { fen: fen3 } }).spread(function(position, created) {
        expect(position.id).to.equal(4);
        expect(created).to.equal(true);
      });
    });

    it('findOrCreate(fen3) => id 4, created false', function () {
      return Position.findOrCreate({ where: { fen: fen3 } }).spread(function(position, created) {
        expect(position.id).to.equal(4);
        expect(created).to.equal(false);
      });
    });

    it('create(unnormalizedFen) => fen validation error', function () {
      return Position.create({ fen: unnormalizedFen })
      .catch(function(err) {
        expect(err.errors[0].message).to.equal(messageForInvalidFen);
      });
    });

    it('create(normalized unnormalizedFen) => ok', function () {
      var fen = Position.normalizeFen(unnormalizedFen);
      return Position.findOrCreate({ where: { fen: fen } }).spread(function(position, created) {
        expect(position).to.be.ok;
      });
    });
  });

  describe('instance methods', function () {
    it('fen1 pId() => pId1)', function () {
      return Position.findOrCreate({ where: { fen: fen1 } }).spread(function(position, created) {
        expect(position.pId()).to.equal(pId1);
      });
    });

    it('fen1 isMovePossible(Nf3) => true)', function () {
      return Position.findOrCreate({ where: { fen: fen1 } }).spread(function(position, created) {
        expect(position.isMovePossible('Nf3')).to.be.true;
      });
    });

    it('fen1 isMovePossible(Ng3) => false)', function () {
      return Position.findOrCreate({ where: { fen: fen1 } }).spread(function(position, created) {
        expect(position.isMovePossible('Ng3')).to.be.false;
      });
    });
  });

  describe('bulkCreate', function () {
    it('bulkCreate(fen1, fen4) => length 2', function () {
      var positions = [ { fen: fen1 }, { fen: fen4 } ];
      var options = { ignoreDuplicates: true, validate: true };
      return Position.bulkCreate(positions, options).then(function(positions) {
        // note fen1 ignored, fen4 added, but not possible to get that info from positions
        expect(positions).to.have.length(2);
      });
    });

    it('bulkCreate(fen1.. fen8 => length 8)', function () {
      var positions = [ { fen: fen1 }, { fen: fen2 }, { fen: fen3 }, { fen: fen4 },
                        { fen: fen5 }, { fen: fen6 }, { fen: fen7 }, { fen: fen8 } ];
      var options = { ignoreDuplicates: true, validate: true };
      return Position.bulkCreate(positions, options).then(function(positions) {
        expect(positions).to.have.length(8);
      });
    });

    it('bulkCreate(fen1, invalidFen) => fen validation error', function () {
      var positions = [ { fen: fen1 }, { fen: invalidFen } ];
      var options = { ignoreDuplicates: true, validate: true };
      return Position.bulkCreate(positions, options).then(function() {
      })
      .catch(function(err) {
        // note: whole bulk insert fails (nothing is added) - http://sequelize.readthedocs.org/en/latest/api/model/index.html#bulkcreaterecords-options-promisearrayinstance
        expect(err[0].errors.message).to.equal('Validation error: ' + messageForInvalidFen);
      });
    });
  });
});
