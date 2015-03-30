/*
Tests for chess-square/index.js

To run tests: 1. cmd; 2. cd [chess-backend folder]; 3. mocha local_modules/chess-square/test;
*/

var chai = require('chai');
var chessSquare = require('..');

var expect = chai.expect;
var should = chai.should();

describe('...', function() {
  var square;
  beforeEach(function() {
    
    square = new chessSquare.ChessSquare('e', -1, 4);
  });

  it('isValid => true', function() {
    expect(square.containsPiece({ color: 'w' type: 'p' })).to.be.true;
  });

});
