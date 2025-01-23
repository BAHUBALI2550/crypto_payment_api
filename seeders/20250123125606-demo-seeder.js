'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', [
      {
        name: 'T-Shirt',
        description: 'Cool crypto T-Shirt',
        price: 0.05,
        coinType: 'USD',
        imageUrl: 'https://djm0962033frr.cloudfront.net/791362_01_jpg_e51ec7c1d5.jpg',
        sellerAddress: '0xabc123',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Hoodie',
        description: 'Crypto hoodie',
        price: 0.1,
        coinType: 'USD',
        imageUrl: 'https://cdn-images.farfetch-contents.com/15/46/77/78/15467778_27920407_600.jpg',
        sellerAddress: '0xabc123',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
    await queryInterface.bulkDelete('Transactions', null, {});
  },
};
