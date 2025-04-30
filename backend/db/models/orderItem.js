"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class OrderItem extends Model {
        static associate(models) {
            OrderItem.belongsTo(models.Order, { foreignKey: "orderId" });
            OrderItem.belongsTo(models.MenuItem, { foreignKey: "menuItemId" });
        }
    }

    OrderItem.init(
        {
            orderId: {
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
            priceAtPurchase: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "OrderItem",
            tableName: "OrderItems",
        }
    );

    return OrderItem;
};
