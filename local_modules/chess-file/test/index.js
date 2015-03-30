/*
Tests for chess-file/index.js

To run tests: 1. cmd; 2. cd [chess-backend folder]; 3. mocha local_modules/chess-file/test;
*/

var chai = require('chai');
var chessFile = require('..');

var expect = chai.expect;

describe('isValidName()', function() {
  it('a => true', function() {
    expect(chessFile.isValidName('a')).to.be.true;
  });

  it('e => true', function() {
    expect(chessFile.isValidName('e')).to.be.true;
  });

  it('h => true', function() {
    expect(chessFile.isValidName('h')).to.be.true;
  });

  it('i => false', function() {
    expect(chessFile.isValidName('i')).to.be.false;
  });

  it('z => false', function() {
    expect(chessFile.isValidName('z')).to.be.false;
  });

  it('7 => false', function() {
    expect(chessFile.isValidName(7)).to.be.false;
  });

  it('undefined => false', function() {
    expect(chessFile.isValidName(undefined)).to.be.false;
  });

  it('null => false', function() {
    expect(chessFile.isValidName(null)).to.be.false;
  });

  it('abc => false', function() {
    expect(chessFile.isValidName('abc')).to.be.false;
  });
});

describe('normalizeFileName()', function() {
  it('valid file name => file name', function() {
    expect(chessFile.normalizeFileName('a')).to.equal('a');
  });

  it('invalid file name => undefined', function() {
    expect(chessFile.normalizeFileName('abc')).to.be.undefined;
  });
});

describe('getNeighboringFileName()', function() {
  it('a offset -1 => undefined', function() {
    expect(chessFile.getNeighboringFileName('a', -1)).to.be.undefined;
  });

  it('a offset 1 => b', function() {
    expect(chessFile.getNeighboringFileName('a', 1)).to.equal('b');
  });

  it('a offset 7 => h', function() {
    expect(chessFile.getNeighboringFileName('a', 7)).to.equal('h');
  });

  it('e offset -1 => d', function() {
    expect(chessFile.getNeighboringFileName('e', -1)).to.equal('d');
  });

  it('h offset 1 => undefined', function() {
    expect(chessFile.getNeighboringFileName('h', 1)).to.be.undefined;
  });

  it('undefined offset 1 => undefined', function() {
    expect(chessFile.getNeighboringFileName(undefined, 1)).to.be.undefined;
  });
});

describe('ChessFile', function() {
  describe('new chessFile.ChessFile(\'e\') - new file object and functions', function() {
    var file;
    beforeEach(function() {
      file = new chessFile.ChessFile('e');
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

  describe('chessFile.create(\'e\') - alternative object instantiation and functions', function() {
    var file;
    beforeEach(function() {
      file = chessFile.create('e');
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

  describe('new chessFile.ChessFile(\'z\') - new file object and functions, with invalid params to constructor', function() {
    var file;
    beforeEach(function() {
      file = new chessFile.ChessFile('z');
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
