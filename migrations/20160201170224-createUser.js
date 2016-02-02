'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
   queryInterface.define('Users', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    facebookId: Sequelize.STRING,
    updatedAt:          Sequelize.DATE,
    createdAt:          Sequelize.DATE
   }).done(done);
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
