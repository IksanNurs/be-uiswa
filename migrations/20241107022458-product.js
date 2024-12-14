'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Create the 'Bundles' table with the columns as defined in the struct
     */
    await queryInterface.createTable('Products', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',  // Assuming there's a 'Users' table with 'id' as the primary key
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        index: true,  // index for faster querying by user_id
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,  // nullable because it can be nil in the struct
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.TEXT,
        allowNull: true,  // nullable because it can be nil in the struct
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Revert the table creation
     */
    await queryInterface.dropTable('Products');
  }
};
