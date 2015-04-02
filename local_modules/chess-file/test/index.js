/*
Tests for chess-file.js

To run tests: 1. cmd; 2. cd [chess-backend folder]; 3. mocha local_modules/chess-file/test;
*/

var chai = require('chai');
var _ = require('lodash');
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

  it('a offset 8 => undefined', function() {
    expect(chessFile.getNeighboringFileName('a', 8)).to.be.undefined;
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

describe('isFile()', function() {
  it('file => true', function() {
    expect(chessFile.isFile(chessFile.create('e'))).to.be.true;
  });

  it('fileName => false', function() {
    expect(chessFile.isFile('e')).to.be.false;
  });

  it('undefined => false', function() {
    expect(chessFile.isFile()).to.be.false;
  });

  it('Invalid file => error', function() {
    expect(function() { chessFile.isFile(chessFile.create('z')) }).to.throw(Error, 'Invalid name');
  });
});

describe('ChessFile', function() {
  describe('Instantiation', function() {
    describe('No parameters', function() {
      it('No parameters => error', function() {
        expect(function() { var file = new chessFile.ChessFile(); }).to.throw(Error, 'No parameters');
      });
    });

    describe('Using parameter list', function() {
      it('OK', function() {
        expect(function() { var file = new chessFile.ChessFile('e'); }).to.be.ok;
      });

      it('Invalid name => error', function() {
        expect(function() { var file = new chessFile.ChessFile('z'); }).to.throw(Error, 'Invalid name');
      });
    });

    describe('Using params object', function() {
      it('OK', function() {
        expect(function() { var file = new chessFile.ChessFile({ name: 'e' }); }).to.be.ok;
      });

      it('Invalid name => error', function() {
        expect(function() { var file = new chessFile.ChessFile({ name: 'i' }); }).to.throw(Error, 'Invalid name');
      });
    });

    describe('Alternative syntax (create)', function() {
      it('Same object equivalence', function() {
        expect(_.isEqual(chessFile.create('e'), new chessFile.ChessFile('e'))).to.be.true;
      });

      it('Different object non-equivalence', function() {
        expect(_.isEqual(chessFile.create('e'), new chessFile.ChessFile('f'))).to.be.false;
      });
    });
  });

  describe('Properties', function() {
    var file;
    beforeEach(function() {
      file = chessFile.create('e');
    });

    it('has correct name', function() {
      expect(file.name).to.equal('e');
    });
  });

  describe('Methods', function() {
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

    it('getNeighboringFile(1)', function() {
      expect(_.isEqual(file.getNeighboringFile(1), new chessFile.ChessFile('f'))).to.be.true;
    });

    it('getNeighboringFile(7) => error', function() {
      expect(function() { var newFile = file.getNeighboringFile(7); }).to.throw(Error, 'Invalid name');
    });
  });
});
