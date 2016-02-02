var Sequelize = require('sequelize');

module.exports = function (sequelize, Sequelize) {
  return sequelize.define('User', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: Sequelize.DATE,
    type: Sequelize.STRING,
    type_id: Sequelize.INTEGER,
    value: Sequelize.STRING
  });
}