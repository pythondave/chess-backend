/*

  *** TODO: Not sure I like this mixing routing stuff (i.e. req & res) with db stuff. Consider refactoring possibilities.
  *** TODO: Consider error handling possibilities.
*/

var helper = require('./helper');
var db = helper.db, log = helper.log, sc = helper.statusCodes, eh = helper.standardErrorHandler;

var o = {};

var standardError = function(err) {
  res.status(sc.NOT_POSSIBLE).json(err);
};

o.getPositions = function(req, res) {
  // get a list of positions
  var values = {};
  if (req.query.fen) values.fen = db.Position.normalizeFen(req.query.fen);
  db.Position.findAll({ where: values }).then(function(positions) {
    res.status(sc.OK).json(positions);
  })
  .catch(eh(res));
};

o.addPosition = function(req, res) {
  //add a new position
  var values = {};
  if (req.body.fen) values.fen = db.Position.normalizeFen(req.body.fen);
  db.Position.create(values).then(function(instance) {
    res.status(sc.CREATED).json({ id: instance.dataValues.id });
  })
  .catch(eh(res));
};

o.getPosition = function(req, res) {
  // get a position
  db.Position.find(req.params.id).then(function(position) {
    if (position == null) res.status(sc.NOT_FOUND).end();
    else res.status(sc.OK).json(position);
  })
  .catch(eh(res));
};

o.updatePosition = function(req, res) {
  // update a position
  var values = {};
  db.Position.find(req.params.id).then(function(position) {
    if (position == null) res.status(sc.NOT_FOUND).end();
    else {
      if (req.body.fen) values.fen = req.body.fen;

      position.update(values).then(function() {
        res.status(sc.OK).end();
      });
    }
  })
  .catch(eh(res));
};

o.getOrAddPosition = function(req, res) {
  // gets a position, first adding it if doesn't exist; returns the position
  var values = {};
  if (req.body.fen) values.fen = db.Position.normalizeFen(req.body.fen);
  db.Position.findOrCreate({ where: values }).spread(function(position, created) {
    res.status(created ? sc.CREATED : sc.OK).json(position);
  })
  .catch(eh(res));
};

o.deletePosition = function(req, res) {
  // delete a position
  db.Position.find(req.params.id).then(function(position) {
    if (position == null) res.status(sc.NOT_FOUND).end();
    else {
      position.destroy().then(function() {
        res.status(sc.DELETED).end();
      });
    }
  })
  .catch(eh(res));
};

module.exports = o;
