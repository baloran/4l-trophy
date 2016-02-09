'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.addColumn('Bets', 'city', Sequelize.STRING);
    queryInterface.addColumn('BetsUsers', 'rewards', Sequelize.STRING);
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
