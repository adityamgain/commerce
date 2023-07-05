const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('commerce', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING
  },
  lastName: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING
  },
  
});

module.exports = User;