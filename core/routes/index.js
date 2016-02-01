var fs = require('fs'),
    path = require('path');

var routes = {};

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== "index.js")
  })
  .forEach(function (file) {
    if (file.slice(-3) !== '.js') return;
    routes[path.basename(file, '.js')] = require(path.join(__dirname, file));
  });

module.exports = routes;