"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class MenuItem extends Model {
        static associate(models) {
            MenuItem.belongsTo(models.Restaurant, {
                foreignKey: "restaurantId",
            });
            MenuItem.hasMany(models.Image, {
                foreignKey: "imageableId",
                constraints: false,
                scope: {
                    imageableType: "MenuItem",
                },
                onDelete: "CASCADE",
            });
            MenuItem.hasMany(models.CartItem, { foreignKey: "menuItemId" });
        }
    }

    MenuItem.init(
        {
            restaurantId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            imageUrl: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            modelName: "MenuItem",
            tableName: "MenuItems",
        }
    );

    return MenuItem;
};
