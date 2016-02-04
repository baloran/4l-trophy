var home        = require('../controllers/home'),
    express     = require('express'),
    passport    = require('passport'),
    homeRoutes;

homeRoutes = function () {
    var router = express.Router();

    /**
     * @api {get} / Index of 4l Trophy
     * @apiName index
     * @apiGroup core
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     */
    router.get('/', home.index);

    router.get('/auth/facebook', passport.authenticate('facebook'));

    router.get('/auth/facebook/callback', passport.authenticate('facebook', {authType: 'rerequest', scope:['email', 'user_friends', 'user_posts'], failureRedirect: '/login' }), function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

    router.get('/bet', home.bet);

    router.post('/bet/:id', home.createBet);

    router.get('/wallet', home.addWallet);

    router.get('/validWallet', home.validWallet);

    return router;
};

/*
  Expose homeRoutes
 */
module.exports = homeRoutes;