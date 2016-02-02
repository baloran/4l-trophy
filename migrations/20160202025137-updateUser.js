'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
      queryInterface.addColumn(
        'Users',
        'first_name', 
        Sequelize.STRING
      );

      queryInterface.addColumn(
        'Users',
        'last_name', 
        Sequelize.STRING
      );

      queryInterface.addColumn(
        'Users',
        'gender', 
        Sequelize.STRING
      );

      queryInterface.addColumn(
        'Users',
        'bio', 
        Sequelize.TEXT
      );

      queryInterface.addColumn(
        'Users',
        'currency', 
        Sequelize.STRING
      );

      queryInterface.addColumn(
        'Users',
        'age', 
        Sequelize.STRING
      );
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
