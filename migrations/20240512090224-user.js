'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true, 
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        unique: true,  
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      latitude: {
        type: Sequelize.DECIMAL(9, 6),  // Presisi tinggi, hingga 6 angka di belakang koma
        allowNull: true,  // Sesuaikan jika Anda ingin wajib
      },
      longitude: {
        type: Sequelize.DECIMAL(9, 6),  // Presisi tinggi, hingga 6 angka di belakang koma
        allowNull: true,  // Sesuaikan jika Anda ingin wajib
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};