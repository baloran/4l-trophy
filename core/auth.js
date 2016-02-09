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
    callbackURL: config.get('facebook.callback_url'),
    profileFields: ['first_name', 'last_name', 'age_range', 'bio', 'currency', 'emails', 'gender']
  },
    function(accessToken, refreshToken, profile, cb) {
      
      var curr = profile._json;
      var userObj = {
        facebookId: curr.id,
        email: profile.emails[0].value,
        first_name: curr.first_name,
        last_name: curr.last_name,
        gender: curr.gender,
        currency: curr.currency.user_currency,
        age: curr.age_range.min,
        wallet: 0,
        pen: 0
      };

      db.User.findOrCreate({ where: {facebookId: curr.id}, defaults: userObj}).then(function(user) {
        console.log(user.isNewRecord)
        return cb(false, user[0]);
      }).catch(function (err) {
        return cb(err, false);
      });
    }
  ));
}