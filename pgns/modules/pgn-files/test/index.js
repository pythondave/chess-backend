/*
Tests for pgn-files.js

To run tests:
  1. cmd
  2. cd [chess-backend folder]
  3. mocha --compilers js:mocha-traceur pgns/modules/pgn-files/test

See also:
  http://blog.ibangspacebar.com/write-your-mocha-tests-in-es6/
*/

var chai = require('chai');
var pgnFiles = require('..');

var expect = chai.expect;

var root = 'pgns/modules/pgn-files/test/';

describe('load', function() {
  it('example-one - length 1', function() {
    return pgnFiles.load(root + 'example-one.pgn').then(function(data) {
      expect(data).to.have.length(1);
    });
  });

  it('example-two - length 2', function() {
    return pgnFiles.load(root + 'example-two.pgn').then(function(data) {
      expect(data).to.have.length(2);
    });
  });

  it('example-many - length 246', function() {
    return pgnFiles.load(root + 'example-many.pgn').then(function(data) {
      expect(data).to.have.length(246);
    });
  });

  it('non-existent file - rejected promise which can be caught', function() {
    return pgnFiles.load(root + 'does-not-exist.pgn').then(function(data) {
    })
    .catch(function(err) {
      expect(err.code).to.equal('ENOENT'); //Error NO ENTry
    });
  });
});
