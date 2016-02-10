var home        = require('../controllers/home'),
    express     = require('express'),
    passport    = require('passport'),
    db          = require('../models'),
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

    router.post('/auth/email', home.login);

    router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'], failureRedirect: '/#connexion' }));

    router.get('/auth/facebook/callback', passport.authenticate('facebook', {authType: 'rerequest', scope: ['email', 'public_profile'], failureRedirect: '/#connexion' }), function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

    router.get('/bet', home.bet);

    router.post('/bet/:id', home.createBet);

    router.get('/bet/:id', home.walletChoice);

    router.get('/bet/:id/choice/:type', home.makeChoice);

    router.post('/wallet', home.addWallet);

    router.get('/validWallet', home.validWallet);

    router.post('/validey', home.valideDay);
 
    router.get('/about', function (req, res) {
        res.render('about');
    });

    router.get('/cgu', function (req, res) {
        res.render('cgu');
    });

    router.get('/rules', function (req, res) {
        res.render('rules');
    });

    return router;
};

/*
  Expose homeRoutes
 */
module.exports = homeRoutes;