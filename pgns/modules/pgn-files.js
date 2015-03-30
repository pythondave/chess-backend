var fs = require('fs');
var q = require('q');

var readFile = q.denodeify(fs.readFile);

var getPgnsFromFile = function(filename) {
  return readFile(filename, 'utf8').then(function(data) {
    var separator = String.fromCharCode(7);
    data = data.replace(/(\r\n\r\n)/g, separator);
    data = data.replace(/(\r\n|\n|\r)/gm,'');
    var pgns = data.split(separator);

    return pgns;
  });
};

module.exports = {
  load: getPgnsFromFile
};