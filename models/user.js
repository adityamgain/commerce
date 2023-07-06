const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('commerce', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

const User = sequelize.define('User', {
  Name: {
    type: DataTypes.STRING
  },
  userName: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING
  },
   password:{
     type:DataTypes.STRING
    }
});

module.exports = User;