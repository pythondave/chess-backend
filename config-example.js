/*
To set the environment (to dev, test or production), use: set NODE_ENV=test (for example) from the command line
*/

var config = {
  db: {
    dev: {
      database: 'my-dev-database',
      username: 'my-username',
      password: 'my-password'
    },
    test: {
      database: 'my-test-database',
      username: 'my-username',
      password: 'my-password'
    },
    production: {
      database: 'my-production-database',
      username: 'my-username',
      password: 'my-password'
    },
    host: 'localhost',
    dialect: 'mysql',
    logging: function (str) {
      //console.log(str);
    },
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  }
}

module.exports = config;
