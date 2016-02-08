var Sequelize = require('sequelize');

module.exports = function (sequelize, Sequelize) {
  return sequelize.define('liveWallet', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
        type: Sequelize.INTEGER,
    },
    paypal_id: Sequelize.STRING,
    verified: Sequelize.BOOLEAN,
    amount: Sequelize.STRING,
    pen: Sequelize.INTEGER
  }, {
    tableName: 'liveWallet'
  });
}