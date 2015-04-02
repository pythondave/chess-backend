/*
Use this to set up the database structure, based on the sequelize models (i.e. 'sync' the db to sequelize).

1. Manually create the mysql databases and users to match config.js
2. 2.1. cmd; 2.2. cd [path to chess-backend folder]; 2.3. set NODE_ENV=dev 2.4. node db/setup.js

IMPORTANT - You can also use this to re-create the database structure. If you do this, data will be dropped - so beware!
*/

var db = require('./db');
var env = process.env.NODE_ENV || 'dev';

db.sequelize.sync({ force: true }) //force => drop and recreate
  .then(function () {
    console.log('SUCCESS!', 'Database successfully set up on the ' + env + ' environment.');
  })
  .catch(function (err) {
    console.log('ERROR', err);
  });
