var fs = require('fs');
var q = require('q');

var readFile = q.denodeify(fs.readFile);
var writeFile = q.denodeify(fs.writeFile);

var getJsonDataFromFile = function(filename) {
  return readFile(filename, 'utf8').then(function(data) {
    if (data == '') return undefined;
    return JSON.parse(data);
  });
};
var saveJsDataToFile = function(filename, jsData) {
  return writeFile(filename, JSON.stringify(jsData));
};

module.exports = {
  load: getJsonDataFromFile,
  save: saveJsDataToFile
};
