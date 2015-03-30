/*
Tests for chess-piece/index.js

To run tests: 1. cmd; 2. cd [chess-backend folder]; 3. mocha local_modules/chess-piece/test;
*/

var chai = require('chai');
var chessPiece = require('..');

var expect = chai.expect;

describe('isValidColor()', function() {
  it('b => true', function() {
    expect(chessPiece.isValidColor('b')).to.be.true;
  });

  it('w => true', function() {
    expect(chessPiece.isValidColor('w')).to.be.true;
  });

  it('z => false', function() {
    expect(chessPiece.isValidColor('z')).to.be.false;
  });

  it('B => false', function() {
    expect(chessPiece.isValidColor('B')).to.be.false;
  });
});

describe('isValidType()', function() {
  it('p => true', function() {
    expect(chessPiece.isValidType('p')).to.be.true;
  });

  it('k => true', function() {
    expect(chessPiece.isValidType('k')).to.be.true;
  });

  it('z => false', function() {
    expect(chessPiece.isValidType('z')).to.be.false;
  });

  it('P => false', function() {
    expect(chessPiece.isValidType('P')).to.be.false;
  });
});

describe('arePiecesEqual()', function() {
  it('no piece, no piece => true', function() {
    expect(chessPiece.arePiecesEqual(null, null)).to.be.true;
  });

  // *** WIP
});

describe.skip('chessPiece', function() {
  describe('new chessPiece.chessPiece(\'e\') - new file object and functions', function() {
    var file;
    beforeEach(function() {
      file = new chessPiece.chessPiece('e');
    });

    it('isValid => true', function() {
      expect(file.isValid()).to.be.true;
    });

    it('getNeighboringFile(1).name => f', function() {
      expect(file.getNeighboringFile(1).name).to.equal('f');
    });

    it('getNeighboringFile(7).isValid => false', function() {
      expect(file.getNeighboringFile(7).isValid()).to.be.false;
    });

    it('getNeighboringFile(7).name => undefined', function() {
      expect(file.getNeighboringFile(7).name).to.be.undefined;
    });
  });

  describe('chessPiece.create(\'e\') - alternative object instantiation and functions', function() {
    var file;
    beforeEach(function() {
      file = chessPiece.create('e');
    });

    it('isValid => true', function() {
      expect(file.isValid()).to.be.true;
    });

    it('getNeighboringFile(1).name => f', function() {
      expect(file.getNeighboringFile(1).name).to.equal('f');
    });

    it('getNeighboringFile(7).isValid => false', function() {
      expect(file.getNeighboringFile(7).isValid()).to.be.false;
    });

    it('getNeighboringFile(7).name => undefined', function() {
      expect(file.getNeighboringFile(7).name).to.be.undefined;
    });
  });

  describe('new chessPiece.chessPiece(\'z\') - new file object and functions, with invalid params to constructor', function() {
    var file;
    beforeEach(function() {
      file = new chessPiece.chessPiece('z');
    });

    it('isValid => false', function() {
      expect(file.isValid()).to.be.false;
    });

    it('name => undefined', function() {
      expect(file.name).to.be.undefined;
    });

    it('getNeighboringFile(7).isValid => false', function() {
      expect(file.getNeighboringFile(7).isValid()).to.be.false;
    });

    it('getNeighboringFile(7).name => undefined', function() {
      expect(file.getNeighboringFile(7).name).to.be.undefined;
    });
  });
});
