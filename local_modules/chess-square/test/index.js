/*
Tests for chess-square.js

To run tests: 1. cmd; 2. cd [chess-backend folder]; 3. mocha local_modules/chess-square/test;
*/

var chai = require('chai');
var _ = require('lodash');
var chessDotJs = require('chess.js');
var chessSquare = require('..');

var expect = chai.expect;

describe('create', function() {
  it('create - e4', function() {
    expect(chessSquare.create('e4')).to.be.ok;
  });

  it('create - e4 - name', function() {
    expect(chessSquare.create('e4').name).to.equal('e4');
  });

  it('e, -1, 4 = > ok', function() {
    expect(chessSquare.create('e', -1, 4)).to.be.ok;
  });

  it('a, -1, 4', function() {
    expect(function() { var square = chessSquare.create('a', -1, 4) }).to.throw(Error, 'Invalid square');
  });
});

describe('isValidName()', function() {
  it('e4 => true', function() {
    expect(chessSquare.isValidName('e4')).to.be.true;
  });

  it('a1 => true', function() {
    expect(chessSquare.isValidName('a1')).to.be.true;
  });

  it('h8 => true', function() {
    expect(chessSquare.isValidName('h8')).to.be.true;
  });

  it('e9 => false', function() {
    expect(chessSquare.isValidName('e9')).to.be.false;
  });

  it('a0 => false', function() {
    expect(chessSquare.isValidName('a0')).to.be.false;
  });

  it('i4 => false', function() {
    expect(chessSquare.isValidName('i4')).to.be.false;
  });

  it('undefined => false', function() {
    expect(chessSquare.isValidName(undefined)).to.be.false;
  });

  it('null => false', function() {
    expect(chessSquare.isValidName(null)).to.be.false;
  });

  it('abc => false', function() {
    expect(chessSquare.isValidName('abc')).to.be.false;
  });
});

describe('normalizeSquareName()', function() {
  it('valid square name => square name', function() {
    expect(chessSquare.normalizeSquareName('e4')).to.equal('e4');
  });

  it('invalid file name => undefined', function() {
    expect(chessSquare.normalizeSquareName('e0')).to.be.undefined;
  });
});

describe('deriveSquareName()', function() {
  it('e, -1, 4 => d4', function() {
    expect(chessSquare.deriveSquareName('e', -1, 4)).to.equal('d4');
  });

  it('e, -7, 4 => undefined', function() {
    expect(chessSquare.deriveSquareName('e', -7, 4)).to.be.undefined;
  });
});

describe('ChessSquare', function() {
  describe('Instantiation', function() {
    describe('No params', function() {
      it('No parameters => error', function() {
        expect(function() { var square = chessSquare.create(); }).to.throw(Error, 'No parameters');
      });
    });

    describe('Using parameter list', function() {
      it('OK', function() {
        expect(function() { var square = chessSquare.create('e4'); }).to.be.ok;
      });

      it('Invalid name => error', function() {
        expect(function() { var square = chessSquare.create('e9'); }).to.throw(Error, 'Invalid name');
      });
    });

    describe('Using params object with name', function() {
      it('OK', function() {
        expect(function() { var square = chessSquare.create({ name: 'h8' }); }).to.be.ok;
      });

      it('Invalid name => error', function() {
        expect(function() { var square = chessSquare.create({ name: 'f0' }); }).to.throw(Error, 'Invalid name');
      });
    });

    describe('Using params object with fileName, fileOffset and rank', function() {
      it('OK', function() {
        expect(function() { var square = chessSquare.create({ fileName: 'e', fileOffset: '1', rank: 4 }); }).to.be.ok;
      });

      it('OK', function() {
        expect(function() { var square = chessSquare.create('e', '1', 4); }).to.be.ok;
      });

      it('Invalid name => error', function() {
        expect(function() { var square = chessSquare.create({ name: 'f0' }); }).to.throw(Error, 'Invalid name');
      });
    });

    describe('Using invalid params object', function() {
      it('Empty params object => error', function() {
        expect(function() { var square = chessSquare.create({}); }).to.throw(Error, 'Invalid parameters');
      });

      it('Missing rank => error', function() {
        expect(function() { var square = chessSquare.create({ fileName: 'e', fileOffset: '1' }); }).to.throw(Error, 'Invalid parameters');
      });
    });

    describe('Alternative syntax (new chessSquare.ChessSquare)', function() {
      it('Same object equivalence', function() {
        expect(_.isEqual(chessSquare.create('e4'), new chessSquare.ChessSquare('e4'))).to.be.true;
      });

      it('Different object non-equivalence', function() {
        expect(_.isEqual(chessSquare.create('e5'), new chessSquare.ChessSquare('e4'))).to.be.false;
      });
    });
  });

  describe('Properties', function() {
    var square;
    beforeEach(function() {
      square = chessSquare.create('e4');
    });

    it('has correct name', function() {
      expect(square.name).to.equal('e4');
    });
  });

  describe('Methods', function() {
    var square;
    beforeEach(function() {
      square = chessSquare.create('e2');
    });

    it('isValidName => true', function() {
      expect(square.isValidName()).to.be.true;
    });

    it('isValid => true', function() {
      expect(square.isValid()).to.be.true;
    });
  });
});
