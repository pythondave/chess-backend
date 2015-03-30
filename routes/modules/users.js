/*
Notes:
  - I don't really like that this combines routing logic and database logic - can they be separated somehow?
  - Would making more use of promises or ES6, somehow, be a good idea?
  - Would like middleware (perhaps the db layer or some wrapper) to be told what to do, and then return a json object representing whatever it managed to come back with (including a status)
*/

var helper = require('./helper');
var db = helper.db, log = helper.log, sc = helper.statusCodes, eh = helper.standardErrorHandler;

var o = {};

o.getUsers = function(req, res) {
  //get a list of users
  db.User.findAll().then(function(users) {
    res.status(sc.OK).json(users);
  })
  .catch(eh(res));
};

o.addUser = function(req, res) {
  //add a new user
  var values = {
    username: req.body.username,
    email: req.body.email
  };
  log(values);
  db.User.create(values).then(function(instance) {
    res.status(sc.CREATED).json({ id: instance.dataValues.id });
  })
  .catch(eh(res));
};

o.getUser = function(req, res) {
  //get a user
  log('getUser', req.params.id);
  db.User.find(req.params.id).then(function(user) {
    if (user == null) res.status(sc.NOT_FOUND).end();
    else res.status(sc.OK).json(user);
  })
  .catch(eh(res));
};

o.updateUser = function(req, res) {
  //update a user
  db.User.find(req.params.id).then(function(user) {
    if (user == null) res.status(sc.NOT_FOUND).end();
    else {
      var values = {};
      if (req.body.username) values.username = req.body.username;
      if (req.body.email) values.email = req.body.email;

      user.update(values).then(function() {
        res.status(sc.OK).end();
      });
    }
  })
  .catch(eh(res));
};

o.deleteUser = function(req, res) {
  //delete a user
  db.User.find(req.params.id).then(function(user) {
    if (user == null) res.status(sc.NOT_FOUND).end();
    else {
      user.destroy().then(function() {
        res.status(sc.DELETED).end();
      });
    }
  })
  .catch(eh(res));
};

module.exports = o;
