'use strict';

/*
  Notes:
    1. When we say 'fen', we usually mean a 'normalized fen' (defined below) rather than a 'standard fen'
    2. A 'normalized fen' is a simplified version of a standard fen (defined here: http://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation)
      2a. 'En passant target square' is only used if e.p. is possible
      2b. 'Halfmove clock' is removed
      2c. 'Fullmove number' is removed
    3. The motivation for using a 'normalized fen' rather than a standard fen is so that positions which appear the same (for our purposes) have the same fen
    4. pId is a 6-character representation of the position
*/

var __base = require('__base');
var chessjsExtension = require(__base + 'local_modules/chessjs-extension');

module.exports = function(sequelize, DataTypes) {
  var t = DataTypes;
  var chessjs = new require('chess.js').Chess();
  chessjs.extension = chessjsExtension(chessjs); // extend chessjs with additional functionality

  var Position = sequelize.define('Position', {
    fen: {
      type: t.STRING(100), allowNull: false, unique: true,
      validate: {
        isNormalized: function(val) {
          var normalizedFen = chessjs.extension.normalizeFen(val);
          if (val != normalizedFen) { throw new Error('Not a valid FEN. It may be that you haven\'t \'normalized\' your FEN (which you can do using the normalizeFen method).'); }
        }
      }
    }
  }, {
    instanceMethods: {
      pId: function() { return (650000000 + this.id).toString(36); } //pIds will start at 'aqzr7l' (as good as any)
    },
    classMethods: {
      pIdToId: function(pId) { return parseInt(pId, 36) - 650000000; },
      associate: function(models) {
        Position.belongsToMany(models.User, { as: 'UserPosition', through: 'user_positions', foreignKey: 'positionId' });
      },
      normalizeFen: function(str) { return chessjs.extension.normalizeFen(str); } // returns a normalized fen or undefined
    }
  });

  return Position;
};
