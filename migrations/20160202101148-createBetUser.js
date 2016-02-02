'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.createTable('BetUsers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      value: Sequelize.INTEGER,
      bet_id: {
        type: Sequelize.INTEGER,
        references: 'Bets',
        referencesKey: 'id'
      },
      user_id:{
        type: Sequelize.INTEGER,
        references: 'Users',
        referencesKey: 'id'
      },
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
