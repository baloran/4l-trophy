/**
 * Boilerplate Express App
 * Bootstrap
 * Arnaud Allouis aka Baloran
 */

var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
var moment = require('moment');

var env = process.env.NODE_ENV || 'development';
var routes = require('./routes');

module.exports = function (app) {
  app.engine('hbs', hbs({
    layoutsDir: path.join(__dirname, '/../','client/views/layouts'),
    defaultLayout: 'template',
    extname: '.hbs',
    helpers: {
        formatDate: function (date) {
          return moment(date).fromNow();
        },
        toLowerCase: function (str) {
          return str.toLowerCase();
        }
    }
  }));
  app.set('views', './client/views');
  app.set('view engine', 'hbs');
  app.use(express.static(__dirname + '/client/'));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
      extended: false
  }));

  app.use('/', routes.home());

  app.use(express.static(path.join(path.normalize(__dirname + '/..'), 'client')));

}