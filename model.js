const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Authors = sequelize.define('Authors', {
  // Model attributes are defined here
  id: {
    type:DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING
    // allowNull defaults to true
  }
});

// `sequelize.define` also returns the model
console.log(Authors === sequelize.models.Authors); // true