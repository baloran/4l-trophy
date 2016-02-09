var homeCtrl,
    _ = require('underscore'),
    paypal = require('paypal-rest-sdk'),
    db = require('../models');


paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AU_zetnngpuT1gdlZT1UZcx5xckn5rFy6f_xWjCwp2GcxyUVS4dBWz7YIwoNoogQINzC6oXJjPAkRAJf',
  'client_secret': 'EMiJ2_xw3q2POV2JrYs0XfbjaRZMg-p61mt6SxGpt0VzJkTdxBxFXxvoNueHYhlrQk819DdfKfIfTHlb'
});

homeCtrl = {
  
  index: function (req, res) {
    res.render('home');
  },

  login: function (req, res) {

    db.User.find({where: {email: req.body.email}, limit: 1}).then(function (user) {
      if (!user) {
        return res.redirect('/#connexion');
      }

      req.session.passport = {
        user: user.id
      }

      if (user.passport == req.body.passport) {

        return res.redirect('/bet');
      } else {
        return res.redirect('/#connexion'); 
      }
    });
  },

  bet: function (req, res) {

    if (req.session.user == 18) {
      console.log()
    }

    db.User.findById(req.session.passport.user).then(function (user) {
      db.Bet.findAll({where: {
        active: 1
      }, limit: 3, order: '"updatedAt" ASC'}).then(function (bet) {
        res.render('bet', {
          bets: bet,
          user: user.toJSON(),
          wallet: user.wallet / 0.19
        });
      }).catch(function (err) {
        console.log(err);
      });
    })
  },

  createBet: function (req, res) {

    /**
     * TODO:
     *   - put this to a middleware
     *   - make transaction
     */
    db.User.findById(req.session.passport.user).then(function (user) {
      if (user.wallet < req.body.value) {
        req.session.erreur = "No money felasse";
        req.session.save(function(err) {
          return res.redirect('/bet');
        });
      }

      db.BetUser.find({
        where: {
          bet_id: req.params.id, 
          user_id: req.session.passport.user
        }
      }).then(function (bet) {

        if (bet != null) {
          return res.redirect('/bet');
        }

        user.wallet = user.wallet - req.body.value;

        db.BetUser.create({
          bet_id: req.params.id,
          user_id: req.session.passport.user,
          value: req.body.value
        }).then(function (bet) {

          user.save();

          res.redirect('/bet');
        }).catch(function (error) {
          res.redirect('/bet');
        });
      }).catch(function (err) {
        return res.redirect('/bet');
      });
    }).catch(function (error) {
        return res.redirect('/bet');
    });
  },

  addWallet: function (req, res) {

    if (req.body.quantity < 14) {
      return res.redirect('/bet');
    };

    var price = (req.body.quantity * 0.19).toFixed(2).toString();

    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:1984/validWallet",
            "cancel_url": "http://cancel.url"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "item",
                    "price": price,
                    "currency": "EUR",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "EUR",
                "total": price
            },
            "description": "This is the payment description."
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      console.log(payment);
      if (error) {
        console.log(error.response.details);
      } else {
        db.liveWallet.create({
          amount: price,
          user_id: req.session.passport.user,
          paypal_id: payment.id,
          verified: false,
          pen: req.body.quantity
        }).then(function (pay) {
          res.redirect(_.findWhere(payment.links, {rel: 'approval_url'}).href)
        }).catch(function (err) {
          res.redirect('/bet');
        });
      }
    });
  },

  validWallet: function (req, res) {

    paypal.payment.get(req.query.paymentId, function (error, payment) {
      if (error) {
          console.log(error);
          throw error;
      } else {
          var payment = JSON.stringify(payment);
          db.liveWallet.find({where: {user_id: req.session.passport.user, paypal_id: req.query.paymentId}}).then(function(wallet) {


            if (wallet.verified) {
              return res.redirect('/bet');
            };

            wallet.verified = true;
            wallet.save().then(function () {
              db.User.findById(wallet.user_id).then(function (user) {
                user.wallet = user.wallet + wallet.amount;
                user.pen = user.pen + wallet.pen;
                user.save().then(function () {
                  res.redirect('/bet');
                });
              }).catch(function() {
                res.redirect('/bet');
              });
            });
          }).catch(function (err) {

          });
      }
    });
  }
}


module.exports = homeCtrl;