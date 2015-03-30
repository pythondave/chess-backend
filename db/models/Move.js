'use strict';

/*
*/

module.exports = function(sequelize, DataTypes) {
  var t = DataTypes;

  var Move = sequelize.define('Move', {
    positionId: { type: DataTypes.INTEGER, unique: 'positionId_move' }, // ref: https://github.com/sequelize/sequelize/issues/2013
    move: { type: t.STRING(5), allowNull: false, unique: 'positionId_move' }
  }, {
    classMethods: {
      associate: function(models) {
        Move.belongsTo(models.Position, { foreignKey: 'positionId' });
        Move.belongsToMany(models.User, { as: 'UserMove', through: 'user_moves', foreignKey: 'moveId' });
      }
    }
  });

  return Move;
};
