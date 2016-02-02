var config            = require('config');
var passport          = require('passport');
var db                = require('models');
var FacebookStrategy  = require('passport-facebook').Strategy;

module.exports = function (app) {

  passport.use(new FacebookStrategy({
    clientID: config.get('facebook.app_id'),
    clientSecret: config.get('facebook.app_secret'),
    callbackURL: config.get('facebook.callback_url')
  },
    function(accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ facebookId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  ));
}