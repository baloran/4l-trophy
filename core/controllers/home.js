var homeCtrl,
    db = require('../models');

homeCtrl = {
  index: function (req, res) {
    res.render('home');
  },

  bet: function (req, res) {

    db.Bet.findAll().then(function (bet) {
      res.render('bet', {
        bets: bet
      });
    }).catch(function (err) {
      console.log(err);
    });
  }
}


module.exports = homeCtrl;