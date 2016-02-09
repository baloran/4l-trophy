var Sequelize = require('sequelize');

module.exports = function (sequelize, Sequelize) {
  var User = sequelize.define('User', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    facebookId: Sequelize.STRING,
    username: Sequelize.STRING,
    gender: Sequelize.STRING,
    bio: Sequelize.TEXT,
    age: Sequelize.TEXT,
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING,
    gender: Sequelize.STRING,
    currency: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    wallet: Sequelize.INTEGER,
    pen: Sequelize.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        User.belongsToMany(models.Bet, { through: models.BetUser, foreignKey: 'user_id'});
      }
    }
  });

  return User;
}