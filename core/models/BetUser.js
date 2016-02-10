var Sequelize = require('sequelize');

module.exports = function (sequelize, Sequelize) {
  return sequelize.define('BetUser', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    value: Sequelize.INTEGER,
    bet_id: {
      type: Sequelize.INTEGER
    },
    user_id:{
      type: Sequelize.INTEGER
    },
    amount: {
      type: Sequelize.INTEGER
    },
    rewards: {
      type: Sequelize.STRING
    }
  });
}