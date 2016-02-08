'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.addColumn(
      'BetUsers',
      'amount',
      Sequelize.INTEGER
      )
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
