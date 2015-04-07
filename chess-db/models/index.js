/*
This files in this folder represent the data model.

Useful references:
  https://github.com/sequelize/express-example/blob/master/models/index.js - example copied
  http://stackoverflow.com/a/25072476 - associate tips
  http://stackoverflow.com/a/7470567 - mysql log viewing
*/

var fs = require('fs');
var config = require('../../config')
var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'dev';

// init
var database = config.db[env].database;
var username = config.db[env].username;
var password = config.db[env].password;
var sequelize = new Sequelize(database, username, password, config.db);
var o = {};

// load models
fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  })
  .forEach(function(file) {
    var model = sequelize.import(__dirname + '/' + file);
    o[model.name] = model;
  });

// add relationships
Object.keys(o).forEach(function(modelName) {
  if ('associate' in o[modelName]) {
    o[modelName].associate(o);
  }
});

// add additional properties
o.sequelize = sequelize;
o.Sequelize = Sequelize;

//export
module.exports = o;
