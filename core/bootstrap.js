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
    partialsDir: path.join(__dirname, '/../','client/views/partials'),
    helpers: {
        formatDate: function (date) {
          return moment(date).fromNow();
        },
        toLowerCase: function (str) {
          return str.toLowerCase();
        },
        ifCond: function(v1, v2, options) {
          if(v1 === v2) {
            return options.fn(this);
          }
          return options.inverse(this);
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

    res.locals.timeLeft = moment("183000", "hmms").endOf("hour").fromNow();

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
    /**
     *    Seconds: 0-59
     *    Minutes: 0-59
     *    Hours: 0-23
     */
    cronTime: '00 20 12 * * 1-7',
    onTick: function() {
      db.Bet.update({active: 1}, {where: {value: null, active: 0}}).then(function (affectedRows) {
        console.log("row updated");
      }).catch(function (err) {
        console.log("Error: ", err);
      });
    },
    start: false,
    timeZone: 'Europe/Paris'
  });
  job.start();

}