/*
Tests for pgn.js

To run tests:
  1. cmd
  2. cd [chess-backend folder]
  3. mocha --compilers js:mocha-traceur pgns/modules/pgn/test
*/

var chai = require('chai');
var _ = require('lodash');
var pgn = require('..');

var expect = chai.expect;

var root = 'pgns/modules/pgn/test/';

describe('wip', function() {
  it('wip', function() {
    return pgn.wip(root + 'example-one.pgn').then(function(positionMoves) {
      console.log(positionMoves);
      expect(positionMoves).to.have.length(19);
    });
  });
});
