"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        static associate(models) {
            Cart.belongsTo(models.User, { foreignKey: "userId" });
            Cart.hasMany(models.CartItem, {
                foreignKey: "cartId",
                onDelete: "CASCADE",
            });
        }
    }

    Cart.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Cart",
            tableName: "Carts",
        }
    );

    return Cart;
};
