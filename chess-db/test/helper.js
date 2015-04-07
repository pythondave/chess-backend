/*
  Helper module for other modules in this folder.
*/
var o = {};

o.getBelongsToManyMethodNames = function(modelName) {
  //returns an array of method names we would expect a belongs-to-many association to provide
  return [
    'get' + modelName + 's',
    'has' + modelName + 's',
    'has' + modelName,
    'set' + modelName + 's',
    'add' + modelName,
    'add' + modelName + 's',
    'remove' + modelName,
    'remove' + modelName + 's',
    'create' + modelName
  ];
};

o.getHasManyMethodNames = function(modelName) {
  //returns an array of method names we would expect a has-many association to provide
  return o.getBelongsToManyMethodNames(modelName); //it's the same
};

o.getBelongsToMethodNames = function(modelName) {
  //returns an array of method names we would expect a belongs-to association to provide
  return [
    'get' + modelName,
    'set' + modelName,
    'create' + modelName
  ];
};

module.exports = o;
