"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.User, { foreignKey: "userId" }); // customer
            Order.belongsTo(models.User, { foreignKey: "runnerId" }); // runner
            Order.belongsTo(models.Airport, { foreignKey: "airportId" });
            Order.belongsTo(models.Restaurant, { foreignKey: "restaurantId" });
            Order.hasMany(models.OrderItem, {
                foreignKey: "orderId",
                onDelete: "CASCADE",
            });
        }
    }

    Order.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            runnerId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            airportId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            restaurantId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            gate: {
                type: DataTypes.STRING,
            },
            totalPrice: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING, // 'pending', 'preparing', 'picked_up', 'delivered'
            },
        },
        {
            sequelize,
            modelName: "Order",
            tableName: "Orders",
        }
    );

    return Order;
};
