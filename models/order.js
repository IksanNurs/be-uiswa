"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // Relasi dengan User (user_id, created_by, updated_by)
      Order.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user", // Alias untuk relasi
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      Order.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product", // Alias untuk relasi
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }
  }

  Order.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Tabel referensi
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        field: "user_id",
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Products", // Tabel referensi
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        field: "product_id",
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      rate: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 1, // Default value for active status
        allowNull: true,
      },
      return_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      loan_date: {
        type: DataTypes.DATE,
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "Orders", // Nama tabel dalam database
      timestamps: false, // Karena kita menggunakan Unix timestamp secara manual
    }
  );

  return Order;
};
