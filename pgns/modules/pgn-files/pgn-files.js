/*
See also:
  https://developer.atlassian.com/blog/2015/03/i-keep-my-promises/
*/

var fs = require('fs');

var o = {};

o.load = function(filename) {
  // loads the file at filename into an array of pgns; returns a promise
  return new Promise(function (resolve, reject) {
    fs.readFile(filename, function (err, data) {
      if (err) { reject(err); return; }

      var s = data.toString();
      var separator = String.fromCharCode(7);
      s = s.replace(/(\r\n\r\n)/g, separator);
      s = s.replace(/(\r\n|\n|\r)/gm,'');
      var pgns = s.split(separator);
      resolve(pgns);
    });
  });
}

module.exports = o;
