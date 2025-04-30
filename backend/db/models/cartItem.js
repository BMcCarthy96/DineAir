"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class CartItem extends Model {
        static associate(models) {
            CartItem.belongsTo(models.Cart, { foreignKey: "cartId" });
            CartItem.belongsTo(models.MenuItem, { foreignKey: "menuItemId" });
        }
    }

    CartItem.init(
        {
            cartId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            menuItemId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "CartItem",
            tableName: "CartItems",
        }
    );

    return CartItem;
};
