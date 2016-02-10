var Sequelize = require('sequelize');

module.exports = function (sequelize, Sequelize) {
  var Bet = sequelize.define('Bet', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: Sequelize.DATE,
    type: Sequelize.STRING,
    type_id: Sequelize.INTEGER,
    value: Sequelize.STRING,
    active: Sequelize.BOOLEAN,
    answer: Sequelize.STRING,
    desc: Sequelize.TEXT,
    city: Sequelize.STRING
  }, {
    classMethods: {
      associate: function (models) {
        Bet.belongsToMany(models.User, { through: models.BetUser, foreignKey: 'bet_id'});Bet.belongsToMany(models.User, { through: models.BetUser, foreignKey: 'bet_id'});
      } 
    }
  });

  return Bet;
}