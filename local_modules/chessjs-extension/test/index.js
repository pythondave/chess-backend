/*
Tests for chessjs-extension.js

To run tests: 1. cmd; 2. cd [chess-backend folder]; 3. mocha --compilers js:mocha-traceur local_modules/chessjs-extension/test;
*/

var chai = require('chai');

var expect = chai.expect;

describe('Initial position', function() {
  var chessjs = new require('chess.js').Chess();
  chessjs.extension = require('..')(chessjs);

  it('isEnPassantPossible() => false', function() {
    expect(chessjs.extension.isEnPassantPossible()).to.be.false;
  });

  it('getNormalizedFen() => 3 parts', function() {
    expect(chessjs.extension.getNormalizedFen()).to.equal('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq');
  });
});

describe('Position where e.p. exists in standard fen and is possible', function() {
  var chessjs;
  beforeEach(function() {
    chessjs = new require('chess.js').Chess();
    chessjs.extension = require('..')(chessjs);
    chessjs.load('rn1qkb1r/ppp1p1pp/3p4/3nPp2/3P2b1/5N2/PPP1BPPP/RNBQK2R w KQkq f6 0 1');
  });

  it('isEnPassantPossible() => true', function() {
    expect(chessjs.extension.isEnPassantPossible()).to.be.true;
  });

  it('getNormalizedFen() => 4 parts', function() {
    expect(chessjs.extension.getNormalizedFen()).to.equal('rn1qkb1r/ppp1p1pp/3p4/3nPp2/3P2b1/5N2/PPP1BPPP/RNBQK2R w KQkq f6');
  });
});

describe('Position where e.p. exists in standard fen and is not possible', function() {
  var chessjs;
  beforeEach(function() {    
    chessjs = new require('chess.js').Chess();
    chessjs.extension = require('..')(chessjs);
    chessjs.load('rn1qkb1r/ppp1p1pp/3p4/3n1p2/3P2b1/5N2/PPP1BPPP/RNBQK2R w KQkq f6 0 1');
  });

  it('isEnPassantPossible() => false', function() {
    expect(chessjs.extension.isEnPassantPossible()).to.be.false;
  });

  it('getNormalizedFen() => 3 parts', function() {
    expect(chessjs.extension.getNormalizedFen()).to.equal('rn1qkb1r/ppp1p1pp/3p4/3n1p2/3P2b1/5N2/PPP1BPPP/RNBQK2R w KQkq');
  });
});

describe('Position where e.p. is not possible because it\'s an illegal move (would leave the mover in check 1)', function() {
  var chessjs;
  beforeEach(function() {    
    chessjs = new require('chess.js').Chess();
    chessjs.extension = require('..')(chessjs);
    chessjs.load('3qk3/8/8/3Pp3/7K/8/8/8 w - e6 0 2');
  });

  it('isEnPassantPossible() => false', function() {
    expect(chessjs.extension.isEnPassantPossible()).to.be.false;
  });
});

describe('Position where e.p. is not possible because it\'s an illegal move (would leave the mover in check 2)', function() {
  var chessjs;
  beforeEach(function() {    
    chessjs = new require('chess.js').Chess();
    chessjs.extension = require('..')(chessjs);
    chessjs.load('4k3/4r3/8/4Pp2/8/8/8/4K3 w - f6 0 2');
  });

  it('isEnPassantPossible() => false', function() {
    expect(chessjs.extension.isEnPassantPossible()).to.be.false;
  });
});

describe('loadFlexibleFen()', function() {
  describe('En passant not possible', function() {
    var chessjs;
    var fen3parts = 'rn1qkb1r/ppp1p1pp/3p4/3n1p2/3P2b1/5N2/PPP1BPPP/RNBQK2R w KQkq';
    var fen4parts = 'rn1qkb1r/ppp1p1pp/3p4/3n1p2/3P2b1/5N2/PPP1BPPP/RNBQK2R w KQkq f6';
    var fen5parts = 'rn1qkb1r/ppp1p1pp/3p4/3n1p2/3P2b1/5N2/PPP1BPPP/RNBQK2R w KQkq f6 0';
    var fen6parts = 'rn1qkb1r/ppp1p1pp/3p4/3n1p2/3P2b1/5N2/PPP1BPPP/RNBQK2R w KQkq f6 0 1';
    beforeEach(function() {
      chessjs = new require('chess.js').Chess();
      chessjs.extension = require('..')(chessjs);
    });

    it('3 parts => ok', function() {
      expect(chessjs.extension.loadFlexibleFen(fen3parts)).to.be.ok;
    });

    it('4 parts => ok', function() {
      expect(chessjs.extension.loadFlexibleFen(fen4parts)).to.be.ok;
    });

    it('5 parts => ok', function() {
      expect(chessjs.extension.loadFlexibleFen(fen5parts)).to.be.ok;
    });

    it('6 parts => ok', function() {
      expect(chessjs.extension.loadFlexibleFen(fen6parts)).to.be.ok;
    });

    describe('getNormalizedFen()', function() {
      it('3 parts => 3 parts', function() {
        expect((function() {
          chessjs.extension.loadFlexibleFen(fen3parts);
          return chessjs.extension.getNormalizedFen();
        })()).to.equal(fen3parts);
      });

      it('4 parts => 3 parts', function() {
        expect((function() {
          chessjs.extension.loadFlexibleFen(fen4parts);
          return chessjs.extension.getNormalizedFen();
        })()).to.equal(fen3parts);
      });

      it('5 parts => 3 parts', function() {
        expect((function() {
          chessjs.extension.loadFlexibleFen(fen5parts);
          return chessjs.extension.getNormalizedFen();
        })()).to.equal(fen3parts);
      });

      it('6 parts => 3 parts', function() {
        expect((function() {
          chessjs.extension.loadFlexibleFen(fen6parts);
          return chessjs.extension.getNormalizedFen();
        })()).to.equal(fen3parts);
      });
    });
  });

  describe('getNormalizedFen()', function() {
    var chessjs;
    var fen3parts = 'rn1qkb1r/ppp1p1pp/3p4/3nPp2/3P2b1/5N2/PPP1BPPP/RNBQK2R w KQkq';
    var fen4parts = 'rn1qkb1r/ppp1p1pp/3p4/3nPp2/3P2b1/5N2/PPP1BPPP/RNBQK2R w KQkq f6';
    var fen5parts = 'rn1qkb1r/ppp1p1pp/3p4/3nPp2/3P2b1/5N2/PPP1BPPP/RNBQK2R w KQkq f6 0';
    var fen6parts = 'rn1qkb1r/ppp1p1pp/3p4/3nPp2/3P2b1/5N2/PPP1BPPP/RNBQK2R w KQkq f6 0 1';
    beforeEach(function() {
      chessjs = new require('chess.js').Chess();
      chessjs.extension = require('..')(chessjs);
    });

    it('3 parts => ok', function() {
      expect(chessjs.extension.loadFlexibleFen(fen3parts)).to.be.ok;
    });

    it('4 parts => ok', function() {
      expect(chessjs.extension.loadFlexibleFen(fen4parts)).to.be.ok;
    });

    it('5 parts => ok', function() {
      expect(chessjs.extension.loadFlexibleFen(fen5parts)).to.be.ok;
    });

    it('6 parts => ok', function() {
      expect(chessjs.extension.loadFlexibleFen(fen6parts)).to.be.ok;
    });

    describe('getNormalizedFen()', function() {
      it('3 parts => 3 parts', function() {
        expect((function() {
          chessjs.extension.loadFlexibleFen(fen3parts);
          return chessjs.extension.getNormalizedFen();
        })()).to.equal(fen3parts);
      });

      it('4 parts => 4 parts', function() {
        expect((function() {
          chessjs.extension.loadFlexibleFen(fen4parts);
          return chessjs.extension.getNormalizedFen();
        })()).to.equal(fen4parts);
      });

      it('5 parts => 4 parts', function() {
        expect((function() {
          chessjs.extension.loadFlexibleFen(fen5parts);
          return chessjs.extension.getNormalizedFen();
        })()).to.equal(fen4parts);
      });

      it('6 parts => 4 parts', function() {
        expect((function() {
          chessjs.extension.loadFlexibleFen(fen6parts);
          return chessjs.extension.getNormalizedFen();
        })()).to.equal(fen4parts);
      });
    });
  });
});
