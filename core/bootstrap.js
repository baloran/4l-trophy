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
var db = require('./models');

var sassMiddleware = require('node-sass-middleware');

var env = process.env.NODE_ENV || 'development';
var routes = require('./routes');

var CronJob = require('cron').CronJob;

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

  app.use(sassMiddleware({
    src: path.join(__dirname, '/../', 'client/scss'),
    dest: path.join(__dirname, '/../', 'client/css'),
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/css'
  }));

  app.set('views', './client/views');
  app.set('view engine', 'hbs');
  app.use(express.static(__dirname + '/client/'));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
      extended: true
  }));

  app.use(function(req, res, next){
    res.locals.session = req.session;
    next();
  });

  app.use('/', routes.home());

  app.use(express.static(path.join(path.normalize(__dirname + '/..'), 'client')));

  var CronJob = require('cron').CronJob;
  /**
   * type_id
   *   - 1: kilometers
   *   - 2: ?
   *   - 3: ?
   */
  var job = new CronJob({
    cronTime: '00 11 10 * * 1-7',
    onTick: function() {
      db.Bet.create({
        date: new Date,
        type: 'kilometers',
        type_id: 1,
        value: null
      });
    },
    start: false,
    timeZone: 'Europe/Paris'
  });
  job.start();

}