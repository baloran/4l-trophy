var homeCtrl,
    _ = require('underscore'),
    paypal = require('paypal-rest-sdk'),
    db = require('../models');


paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AU_zetnngpuT1gdlZT1UZcx5xckn5rFy6f_xWjCwp2GcxyUVS4dBWz7YIwoNoogQINzC6oXJjPAkRAJf',
  'client_secret': 'EMiJ2_xw3q2POV2JrYs0XfbjaRZMg-p61mt6SxGpt0VzJkTdxBxFXxvoNueHYhlrQk819DdfKfIfTHlb'
});

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
                "price": "10.00",
                "currency": "EUR",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "EUR",
            "total": "10.00"
        },
        "description": "This is the payment description."
    }]
};

homeCtrl = {
  index: function (req, res) {
    res.render('home');
  },

  bet: function (req, res) {

    db.User.findById(req.session.passport.user).then(function (user) {
      db.Bet.findAll({where: {
        active: 1
      }, limit: 3, order: '"updatedAt" ASC'}).then(function (bet) {
        res.render('bet', {
          bets: bet,
          user: user.toJSON()
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
    paypal.payment.create(create_payment_json, function (error, payment) {
      console.log("salut");
      if (error) {
        console.log(error.response.details);
      } else {
        res.redirect(_.findWhere(payment.links, {rel: 'approval_url'}).href)
      }
    });
  },

  validWallet: function (req, res) {
    paypal.payment.get(req.query.paymentId, function (error, payment) {
      if (error) {
          console.log(error);
          throw error;
      } else {
          console.log("Get Payment Response");
          console.log(JSON.stringify(payment));
      }
    });
  }
}


module.exports = homeCtrl;