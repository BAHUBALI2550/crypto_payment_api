'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A transaction belongs to one product
      Transaction.belongsTo(models.Product, { foreignKey: 'productId' });
    }
  }
  Transaction.init({
    transactionHash: DataTypes.STRING,
    productId: DataTypes.INTEGER,
    sellerAddress: DataTypes.STRING,
    coinType: DataTypes.STRING,
    status: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    message: DataTypes.STRING,
    confirmationCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};