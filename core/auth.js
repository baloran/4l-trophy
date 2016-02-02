var config            = require('config');
var passport          = require('passport');
var db                = require('./models');
var FacebookStrategy  = require('passport-facebook').Strategy;

module.exports = function (app) {

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(require('cookie-parser')());
  app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    db.User.find({where: {id: id}}).then(function (user) {
      done(false, user);
    }).catch(function (err) {
      done(err, false);
    });
  });

  passport.use(new FacebookStrategy({
    clientID: config.get('facebook.app_id'),
    clientSecret: config.get('facebook.app_secret'),
    callbackURL: config.get('facebook.callback_url')
  },
    function(accessToken, refreshToken, profile, cb) {
      db.User.findOrCreate({ where: {facebookId: profile.id }, raw: true}).then(function(user) {
        return cb(false, user[0]);
      }).catch(function (err) {
        return cb(err, false);
      });
    }
  ));
}