const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('commerce', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

// const Order = sequelize.define('Order', {
//     orderID: {
//       type: DataTypes.STRING,
//       defaultValue: DataTypes.UUIDV4
//     },
//     userID: {
//       type: DataTypes.INTEGER,
//       allowNull: false
//     },
//     orderDate: {
//       type: DataTypes.DATE,
//       allowNull: false
//     },
//   });
  
  const OrderItem = sequelize.define('OrderItem', {
    itemID: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4
    },
    orderID: {
      type: DataTypes.STRING,
      allowNull: false
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  });
  
//   (async () => {
//     await sequelize.sync({ force: true });
//     console.log('Database synced.');
//   })();

//   Order.hasMany(OrderItem, { foreignKey: 'orderID' });
//   OrderItem.belongsTo(Order, { foreignKey: 'orderID' });
  
//   module.exports = Order;
  module.exports = OrderItem;

