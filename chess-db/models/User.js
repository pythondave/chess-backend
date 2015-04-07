'use strict';

/*
*/

module.exports = function(sequelize, DataTypes) {
  var t = DataTypes;

  var User = sequelize.define('User', {
    username: { type: t.STRING(30), allowNull: false, unique: true },
    email: { type: t.STRING(100), allowNull: false, unique: true, validate: { isEmail: true } }
  }, {
    classMethods: {
      associate: function(models) {
        User.belongsToMany(models.Position, { as: 'positions', through: 'user_positions', foreignKey: 'userId' });
        User.belongsToMany(models.Move, { as: 'moves', through: 'user_moves', foreignKey: 'userId' });
      }
    }
  });

  return User;
};
