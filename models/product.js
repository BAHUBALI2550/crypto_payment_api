'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A product can have many transactions
      Product.hasMany(models.Transaction, { foreignKey: 'productId' });
    }
  }
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.FLOAT,
    coinType: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    sellerAddress: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};