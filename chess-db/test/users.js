/*
Tests for chess-db.js

To run tests: 1. cmd; 2. cd [chess-backend folder]; 3. mocha --compilers js:mocha-traceur chess-db/test/users;
*/

var env = process.env.NODE_ENV || 'dev';
var helper = require('./helper');
var chai = require('chai');
var _ = require('lodash');
var chessDb = require('..');

var expect = chai.expect;
var User = chessDb.User;

describe('User', function () {
  var user1, user2, user3;

  before(function () {
    user1 = { username: 'user1', email: 'a@b.com' };
    user2 = { username: 'user2', email: 'c@d.com' };
    user3 = { username: 'user3', email: 'e@f.com' };
    this.timeout(5000);
    return chessDb.sequelize.sync({ force: true});
  });

  it('check instance method names', function () {
    var expectedMethodNames = [];
    expectedMethodNames.push(...helper.getBelongsToManyMethodNames('Position'));
    expectedMethodNames.push(...helper.getBelongsToManyMethodNames('Move'));
    var methodNamesNotInInstance = _.difference(expectedMethodNames, _.functions(User.build()));
    expect(methodNamesNotInInstance.length).to.equal(0);
  });

  it('create(user1) => id 1', function () {
    return User.create(user1).then(function(user) {
      expect(user.id).to.equal(1);
    });
  });

  it('find(1) => username user1', function () {
    return User.find(1).then(function(user) {
      expect(user.username).to.equal(user1.username);
    });
  });

  it('create(user2) => id 2', function () {
    return User.create(user2).then(function(user) {
      expect(user.id).to.equal(2);
    });
  });

  it('findAll() => length 2', function () {
    return User.findAll().then(function(users) {
      expect(users).to.have.length(2);
    })
  });

  it('create(user2) => unique error', function () {
    return User.create(user2)
    .catch(function(err) {
      expect(err.errors[0].message).to.equal('username must be unique');
    });
  });

  it('findOrCreate(user3) => id 4, created true', function () {
    return User.findOrCreate({ where: user3 }).spread(function(user, created) {
      expect(user.id).to.equal(4);
      expect(created).to.equal(true);
    });
  });

  it('findOrCreate(user3) => id 4, created false', function () {
    return User.findOrCreate({ where: user3 }).spread(function(user, created) {
      expect(user.id).to.equal(4);
      expect(created).to.equal(false);
    });
  });
});
