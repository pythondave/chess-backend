/*
Tests for chess-db.js

To run tests: 1. cmd; 2. cd [chess-backend folder]; 3. mocha --compilers js:mocha-traceur chess-db/test/moves;
*/

var env = process.env.NODE_ENV || 'dev';
var helper = require('./helper');
var chai = require('chai');
var _ = require('lodash');
var chessDb = require('..');

var expect = chai.expect;
var Position = chessDb.Position;
var Move = chessDb.Move;

describe('Move', function () {
  var pId1, fen1, fen2, fen3, fen4, fen5, fen6, fen7, fen8, invalidFen, messageForInvalidFen;

  before(function () {
    pId1 = 'aqzr7l';
    fen1 = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq'; //initial position
    fen2 = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq'; //after e4
    fen3 = 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq'; //after e4, e5
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

  it('check instance method names', function () {
    var expectedMethodNames = [];
    expectedMethodNames.push(...helper.getBelongsToMethodNames('Position'));
    expectedMethodNames.push(...helper.getBelongsToManyMethodNames('User'));
    var methodNamesNotInInstance = _.difference(expectedMethodNames, _.functions(Move.build()));
    expect(methodNamesNotInInstance.length).to.equal(0);
  });

  it('create - variant 1', function () {
    return Position.findOrCreate({ where: { fen: fen1 } }).spread(function(position, created) {
      expect(position.fen).to.equal(fen1);
      expect(created).to.be.true;
      return Move.create({ positionId: position.id, move: 'e4' }).then(function(move) {
        expect(move.move).to.equal('e4');
        expect(move.positionId).to.equal(position.id);
      });
    });
  });

  it('create - variant 2', function () {
    return Position.findOrCreate({ where: { fen: fen2 } }).spread(function(position, created) {
      expect(position.fen).to.equal(fen2);
      expect(created).to.be.true;
      var move = Move.build({ move: 'e4' });
      return position.addMove(move).then(function(move) {
        expect(move.move).to.equal('e4');
        expect(move.positionId).to.equal(position.id);
      });
    });
  });

  it('create - variant 3', function () {
    return Position.findOrCreate({ where: { fen: fen3 } }).spread(function(position, created) {
      expect(position.fen).to.equal(fen3);
      expect(created).to.be.true;
      var move = Move.build({ move: 'e4' });
      move.setPosition(position, {save: false}); // ref: https://github.com/sequelize/sequelize/issues/3321
      return move.save().then(function(move) {
        expect(move.move).to.equal('e4');
        expect(move.positionId).to.equal(position.id);
      });
    });
  });

  it('create - with validation ok', function () {
    return Position.findOrCreate({ where: { fen: fen4 } }).spread(function(position, created) {
      var okay = position.isMovePossible('h6');
      if (!okay) throw new Error('Invalid move');
      return Move.create({ positionId: position.id, move: 'h6' }).then(function(move) {
        expect(move.move).to.equal('h6');
        expect(move.positionId).to.equal(position.id);
      });
    });
  });

  it('create - with validation fail', function () {
    return Position.findOrCreate({ where: { fen: fen4 } }).spread(function(position, created) {
      var okay = position.isMovePossible('Bh6');
      if (!okay) throw new Error('Invalid move');
      expect(false).to.be.true; //shouldn't get here
    }).catch(function(err) {
      expect(err.message).to.equal('Invalid move');
    });
  });
});

describe('Complex data - create and find', function () {
  var fen1, fen2;

  before(function () {
    fen1 = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq'; //initial position
    fen2 = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq'; //after e4
    this.timeout(5000);
    return chessDb.sequelize.sync({ force: true});
  });

  it('Create position and several moves', function () {
    return Position.findOrCreate({ where: { fen: fen1 } }).spread(function(position, created) {
      var createMove = function(move) { return Move.create({ positionId: position.id, move: move }); };
      return chessDb.Sequelize.Promise.all([
        createMove('e4'), createMove('d4'), createMove('c4'), createMove('Nf3')
      ]);
    });
  });

  it('Find position and related moves', function () {
    var query = {
      where: { fen: fen1 },
      include: [ chessDb.Move ]
    };
    return Position.find(query).then(function(position) {
      var moves = _.pluck(position.Moves, 'move').sort();
      expect(moves.toString()).to.equal('Nf3,c4,d4,e4');
    });
  });

  it('Create position and several moves 2 (more test data)', function () {
    return Position.findOrCreate({ where: { fen: fen2 } }).spread(function(position, created) {
      var createMove = function(move) { return Move.create({ positionId: position.id, move: move }); };
      return chessDb.Sequelize.Promise.all([
        createMove('e5'), createMove('c5'), createMove('Nf6')
      ]);
    });
  });

  it('Find position and related moves 2 (check works with multiple positions)', function () {
    var query = {
      where: { fen: fen2 },
      include: [ chessDb.Move ]
    };
    return Position.find(query).then(function(position) {
      var moves = _.pluck(position.Moves, 'move').sort();
      expect(moves.toString()).to.equal('Nf6,c5,e5');
    });
  });

  it('Find position and number of moves', function () {
    var query = { //ref: https://github.com/sequelize/sequelize/issues/3021
      where: { fen: fen1 },
      include: [
        { model: chessDb.Move, attributes: [[chessDb.sequelize.fn('COUNT', chessDb.sequelize.col('moves.id')), 'count']] }
      ]
    };
    return Position.find(query).then(function(position) {
      expect(position.Moves[0].getDataValue('count')).to.equal(4);
    });
  });

  it('Find positions and numbers of moves', function () {
    var query = { //ref: https://github.com/sequelize/sequelize/issues/3021
      group: ['fen'],
      order: ['id'],
      include: [
        { model: chessDb.Move, attributes: [[chessDb.sequelize.fn('COUNT', chessDb.sequelize.col('position.id')), 'count']] }
      ]
    };
    return Position.findAll(query).then(function(positions) {
      expect(positions).to.have.length(2); //2 positions
      expect(positions[0].Moves[0].getDataValue('count')).to.equal(4); //4 moves for first position
      expect(positions[1].Moves[0].getDataValue('count')).to.equal(3); //3 moves for second position
    });
  });
});
