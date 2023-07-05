const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('commerce', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

const Items = sequelize.define('Items', {
  name: {
    type: DataTypes.STRING
  },
  img: {
    type: DataTypes.STRING
  },
  price: {
    type: DataTypes.INTEGER
  }
});

module.exports = Items;