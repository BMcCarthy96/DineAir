"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Delivery extends Model {
        static associate(models) {
            Delivery.belongsTo(models.Order, { foreignKey: "orderId" });
            Delivery.belongsTo(models.User, { foreignKey: "runnerId" });
        }
    }

    Delivery.init(
        {
            orderId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            runnerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            deliveryTime: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            notes: {
                type: DataTypes.TEXT,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "pending", // Default statuses: 'pending', 'in_progress', 'delivered'
            },
        },
        {
            sequelize,
            modelName: "Delivery",
            tableName: "Deliveries",
        }
    );

    return Delivery;
};
