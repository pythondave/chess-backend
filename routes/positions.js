/*
*/

var express = require('express');
var winston = require('winston');
var positions = require('./modules/positions');
var router = express.Router();

//routes
router.route('/')
  .get(positions.getPositions)
  .post(positions.addPosition)
  .put(positions.getOrAddPosition);

router.route('/:id([0-9]+)')
  .get(positions.getPosition)
  .put(positions.updatePosition)
  .delete(positions.deletePosition);

module.exports = router;
