/*
Tests for chess-piece.js

To run tests: 1. cmd; 2. cd [chess-backend folder]; 3. mocha local_modules/chess-piece/test;
*/

var chai = require('chai');
var _ = require('lodash');
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

describe('isValid()', function() {
  it('w, p => true', function() {
    expect(chessPiece.isValid('w', 'p')).to.be.true;
  });

  it('w, z => false', function() {
    expect(chessPiece.isValid('w', 'z')).to.be.false;
  });

  it('w, null => false', function() {
    expect(chessPiece.isValid('w', 'null')).to.be.false;
  });

  it('z, p => false', function() {
    expect(chessPiece.isValid('z', 'p')).to.be.false;
  });

  it('null, p => false', function() {
    expect(chessPiece.isValid(null, 'p')).to.be.false;
  });
});

describe('arePiecesEqual()', function() {
  it('no piece, no piece => true', function() {
    expect(chessPiece.arePiecesEqual(null, null)).to.be.true;
  });

  it('no piece, piece => false', function() {
    expect(chessPiece.arePiecesEqual(null, { color: 'w', type: 'p' })).to.be.false;
  });

  it('piece, no piece => false', function() {
    expect(chessPiece.arePiecesEqual({ color: 'w', type: 'p' }, null)).to.be.false;
  });

  it('piece, piece (different color) => false', function() {
    expect(chessPiece.arePiecesEqual({ color: 'w', type: 'p' }, { color: 'b', type: 'p' })).to.be.false;
  });

  it('piece, piece (different type) => false', function() {
    expect(chessPiece.arePiecesEqual({ color: 'w', type: 'p' }, { color: 'w', type: 'n' })).to.be.false;
  });

  it('piece, piece (same) => true', function() {
    expect(chessPiece.arePiecesEqual({ color: 'w', type: 'p' }, { color: 'w', type: 'p' })).to.be.true;
  });
});

describe('ChessPiece', function() {
  describe('Instantiation', function() {
    describe('No parameters', function() {
      it('No parameters => error', function() {
        expect(function() { var piece = new chessPiece.ChessPiece(); }).to.throw(Error, 'No parameters');
      });
    });

    describe('Using parameter list', function() {
      it('OK', function() {
        expect(function() { var piece = new chessPiece.ChessPiece('w', 'p'); }).to.be.ok;
      });

      it('Invalid color => error', function() {
        expect(function() { var piece = new chessPiece.ChessPiece('z', 'p'); }).to.throw(Error, 'Invalid color');
      });

      it('Invalid type => error', function() {
        expect(function() { var piece = new chessPiece.ChessPiece('w', 'z'); }).to.throw(Error, 'Invalid type');
      });
    });

    describe('Using params object', function() {
      it('OK', function() {
        expect(function() { var piece = new chessPiece.ChessPiece({ color: 'b', type: 'r' }); }).to.be.ok;
      });

      it('Invalid color => error', function() {
        expect(function() { var piece = new chessPiece.ChessPiece({ color: null, type: 'r' }); }).to.throw(Error, 'Invalid color');
      });

      it('Invalid type => error', function() {
        expect(function() { var piece = new chessPiece.ChessPiece({ color: 'b' }); }).to.throw(Error, 'Invalid type');
      });
    });

    describe('Alternative syntax (create)', function() {
      it('Same object equivalence', function() {
        expect(_.isEqual(chessPiece.create('w', 'p'), new chessPiece.ChessPiece('w', 'p'))).to.be.true;
      });

      it('Different object non-equivalence', function() {
        expect(_.isEqual(chessPiece.create('w', 'k'), new chessPiece.ChessPiece('w', 'p'))).to.be.false;
      });
    });
  });

  describe('Properties', function() {
    var piece;
    beforeEach(function() {
      piece = new chessPiece.ChessPiece('w', 'p');
    });

    it('has correct color', function() {
      expect(piece.color).to.equal('w');
    });

    it('has correct type', function() {
      expect(piece.type).to.equal('p');
    });
  });

  describe('Methods', function() {
    var piece, samePiece, differentPiece;
    beforeEach(function() {
      piece = new chessPiece.ChessPiece('w', 'p');
      samePiece = new chessPiece.ChessPiece('w', 'p');
      differentPiece = new chessPiece.ChessPiece('b', 'p');
    });

    it('isValidColor => true', function() {
      expect(piece.isValidColor()).to.be.true;
    });

    it('isValidType => true', function() {
      expect(piece.isValidType()).to.be.true;
    });

    it('isValid => true', function() {
      expect(piece.isValid()).to.be.true;
    });

    it('isEqual(samePiece) => true', function() {
      expect(piece.isEqual(samePiece)).to.be.true;
    });

    it('isEqual(differentPiece) => false', function() {
      expect(piece.isEqual(differentPiece)).to.be.false;
    });
  });
});
