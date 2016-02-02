'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.createTable('Bets', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      date: Sequelize.DATE,
      type: Sequelize.STRING,
      type_id: Sequelize.INTEGER,
      value: Sequelize.STRING,
      updatedAt: Sequelize.DATE,
      createdAt: Sequelize.DATE
    });
    done();
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
