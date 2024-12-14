"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // Relasi dengan User (created_by, updated_by)
      Product.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user", // Alias untuk relasi
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      Product.hasMany(models.Order, {
        foreignKey: "product_id", // This is assuming the foreign key in the orders table is product_id
        as: "orders", // Alias for the related orders
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }
  }

  Product.init(
    {
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
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
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "Products", // Nama tabel dalam database
      timestamps: false, // Karena kita menggunakan Unix timestamp secara manual
    }
  );

  return Product;
};
