var homeCtrl,
    _ = require('underscore'),
    paypal = require('paypal-rest-sdk'),
    fs = require('fs'),
    db = require('../models');


paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AU_zetnngpuT1gdlZT1UZcx5xckn5rFy6f_xWjCwp2GcxyUVS4dBWz7YIwoNoogQINzC6oXJjPAkRAJf',
  'client_secret': 'EMiJ2_xw3q2POV2JrYs0XfbjaRZMg-p61mt6SxGpt0VzJkTdxBxFXxvoNueHYhlrQk819DdfKfIfTHlb'
});

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('gfv3y4xjJGQqHSgHrD8Rxg');

var win;
fs.readFile('./client/email/winner.html', "utf-8", function (err, data) {
  win = data;
});

var pari;
fs.readFile('./client/email/pari.html', "utf-8", function (err, data) {
  pari = data;
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

      if (user.password == req.body.password) {
        
        req.session.passport = {
          user: user.id
        }

        return res.redirect('/bet');
      } else {
        return res.redirect('/#connexion'); 
      }
    });
  },

  bet: function (req, res) {

    if (typeof req.session.passport === "undefined") {
      return res.redirect('/#connexion');
    };

    if (req.session.passport.user == 18) {
      return res.render('admin');
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

    if (req.body.bet < 14 ) {
      return res.redirect('/bet');
    };

    /**
     * TODO:
     *   - put this to a middleware
     *   - make transaction
     */
    
    db.User.findById(req.session.passport.user).then(function (user) {
      if (user.pen < req.body.bet) {
        req.session.erreur = "No money felasse";
        req.session.save(function(err) {
          return res.redirect('/bet');
        });
      }

      db.Bet.find({
        where: {
          id: req.params.id
        }
      }).then(function (bet) {

        if (bet == null) {
          return res.redirect('/bet');
        }

        user.pen = user.pen - req.body.bet;

        db.BetUser.create({
          bet_id: req.params.id,
          user_id: req.session.passport.user,
          value: req.body.value,
          amount: req.body.bet
        }).then(function (bet) {

          user.save();

          console.log(win)

          var message = {
            "html": pari,
            "subject": "Bet Trophy",
            "from_email": "hello@baloran.fr",
            "to": [
              {
                "email": user.email,
                "name": user.first_name + " " + user.last_name,
                "type": "to"
              }
            ]
          }

          mandrill_client.messages.send({"message": message}, function(result) {
              console.log(result);
          }, function(e) {
              console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
          });

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
  },

  valideDay: function (req, res) {

    var type = [];
    type[1] = req.body.kilometers;
    type[2] = req.body.position;
    type[3] = req.body.alive || false;

    db.Bet.findAll({where: {active: 1, value: null}}).then(function (bets) {

      _.each(bets, function (item) {

        item.value = type[item.type_id];
        item.active = false;

        item.save(function () {
          console.log("saved");
        });

        var curr = type[item.type_id];

        console.log("curr: ", curr);
        console.log("item: ", item.type_id)

        db.BetUser.findAll({
          where: {bet_id: item.id}, 
          limit: 3,  
          order: [
            [db.sequelize.fn('ABS', db.sequelize.condition(db.sequelize.col('value'), '-', curr)), 'ASC']
          ]}).then(function (b) {

          if (b.length < 1) {
            console.log("No user")
          } else {
            if (b[0].value == curr) {
              db.User.findById(b[0].user_id).then(function (user) {
                var message = {
                  "html": win,
                  "subject": "Bet Trophy",
                  "from_email": "hello@baloran.fr",
                  "to": [
                    {
                      "email": user.email,
                      "name": user.first_name + " " + user.last_name,
                      "type": "to"
                    }
                  ],
                  "global_merge_vars": [
                    {
                        "name": "URL_GAIN",
                        "content": "http://baloran.fr:6777/bet/" + b[0].id
                    }
                  ],
                }

                mandrill_client.messages.send({"message": message}, function(result) {
                    console.log(result);
                }, function(e) {
                    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
                });
              }).catch(function (err) {
                console.log(err);
              });
            } else {

              console.log(b);

              if (b.length > 1) {
                var userIds = _.map(b, function (item) {
                  return b.user_id;
                });
              } else {
                var userIds = b[0].user_id;
              }

              db.User.findAll({where:{id: userIds}}).then(function (users) {

                _.each(users, function (item, index) {

                  var message = {
                    "html": win,
                    "subject": "Bet Trophy",
                    "from_email": "hello@baloran.fr",
                    "to": [{
                      "email": item.email,
                      "name": item.first_name + " " + item.last_name,
                      "type": "to"
                    }],
                    "global_merge_vars": [
                        {
                            "name": "URL_GAIN",
                            "content": "http://baloran.fr:6777/bet/" + b[index].id
                        }
                    ],
                  }

                  mandrill_client.messages.send({"message": message}, function(result) {
                      console.log(result);
                  }, function(e) {
                      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
                  });
                });
              });
            }
          }
        });
      });

      db.Bet.bulkCreate([
        {
          date: new Date,
          type: 'kilometers',
          answer: "Combien de kilomètres vont-elle parcourir ?",
          desc: "Pariez sur les kilomètres parcourut sur chaques étapes",
          type_id: 1,
          active: 1,
          value: null,
          city: req.body.ville
        },
        {
          date: new Date,
          type: 'rank',
          answer: "Quel sera leur classement à la fin du raid ?",
          desc: "Pariez sur leur classement à la fin du raid",
          type_id: 2,
          active: 1,
          value: null,
          city: req.body.ville
        },
        {
          date: new Date,
          type: 'finish',
          answer: "Pauline et Margaux vont-elles finir le raid ?",
          desc: "Pariez sur le kilomètre où elles vont abandonner le raid",
          type_id: 3,
          active: 1,
          value: null,
          city: req.body.ville
        }
      ]).then(function (affectedRows) {

        
      });
    });
  },

  walletChoice: function (req,res) {

    db.BetUser.findById(req.params.id).then(function (bet) {
      res.render('successful', {
        id: req.params.id,
        bet: bet
      });
    });
  },

  makeChoice: function (req, res) {

    db.BetUser.findById(req.params.id).then(function (bet) {

      bet.rewards = req.params.type;
      bet.save().then(function () {
        res.redirect('/');
      });
    });
  }
}


module.exports = homeCtrl;