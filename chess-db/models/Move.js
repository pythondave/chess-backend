'use strict';

/*
  Notes:
    A move object has a move property - i.e. 'move' has 2 meanings
    A move object might properly be called a 'position move', but that gets too verbose/clumsy
*/

module.exports = function(sequelize, DataTypes) {
  var t = DataTypes;

  var Move = sequelize.define('Move', {
    positionId: { type: DataTypes.INTEGER, unique: 'positionId_move' }, // ref: https://github.com/sequelize/sequelize/issues/2013
    move: {
      type: t.STRING(5), allowNull: false, unique: 'positionId_move',
      validate: {
        isValid: function(val) {
          // *** TODO: For consideration... it's currently possible to add invalid moves (from a chess perspective). Should this be addressed in this layer? Should it be addressed in a higher-level layer?
        }
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        Move.belongsTo(models.Position, { onDelete: 'CASCADE', foreignKey: { name: 'positionId', allowNull: false } }); // ref: http://stackoverflow.com/a/26839975
        Move.belongsToMany(models.User, { as: 'users', through: 'user_moves', foreignKey: 'moveId' });
      }
    }
  });

  return Move;
};
