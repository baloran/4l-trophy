'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.createTable('liveWallet', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: 'Users',
        referencesKey: 'id'
      },
      paypal_id: Sequelize.STRING,
      verified: Sequelize.BOOLEAN,
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
