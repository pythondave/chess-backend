'use strict';

var argv = require('minimist')(process.argv.slice(2));
var db = require('./db');
var sequelize = db.sequelize;
var Position = db.Position;

if (!argv.n) {
  console.log('No -n switch specified. EXITING');
  process.exit(1);
}

if (argv.n == 1) {
  console.log('Synching database to model...');
  sequelize
    .sync()
    .then(function() {
      console.log('Done');
    })
    .catch(function(err) { console.log('ERROR:', err.name, '-', err.message); });
}
if (argv.n == 2) {
  console.log('Test Position.pIdToId (pId aqzr7l => Id 1)...');
  console.log('Id: ' + Position.pIdToId('aqzr7l'));
}
if (argv.n == 3) {
  console.log('Test Position.findAll()...');
  Position
    .findAll()
    .then(function(positions) {
      console.log('fen: ', positions[0].fen);
      console.log('pId: ', positions[0].pId());
    })
    .catch(function(err) { console.log('ERROR:', err.name, '-', err.message); });
}
if (argv.n == 4) {
  console.log('Test Position.create...');
  Position
    .create({ fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -' })
    .then(function(position) {
      console.log('position created: ', position.dataValues);
    })
    .catch(function(err) { console.log('ERROR:', err.name, '-', err.message); });
}
if (argv.n == 5) {
  console.log('Test Position.upsert...');
  Position
    .upsert({ fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -' })
    .then(function(created) {
      console.log('created: ', created);
    })
    .catch(function(err) { console.log('ERROR:', err.name, '-', err.message); });
}
