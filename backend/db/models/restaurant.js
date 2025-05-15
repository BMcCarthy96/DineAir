"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Restaurant extends Model {
        static associate(models) {
            Restaurant.belongsTo(models.User, { foreignKey: "ownerId" });
            Restaurant.hasMany(models.MenuItem, {
                foreignKey: "restaurantId",
                onDelete: "CASCADE",
            });
            Restaurant.hasMany(models.Review, {
                foreignKey: "restaurantId",
                onDelete: "CASCADE",
            });
            Restaurant.hasMany(models.Image, {
                foreignKey: "imageableId",
                constraints: false,
                scope: {
                    imageableType: "Restaurant",
                },
                onDelete: "CASCADE",
            });
        }
    }

    Restaurant.init(
        {
            ownerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            terminal: {
                type: DataTypes.STRING,
            },
            gate: {
                type: DataTypes.STRING,
            },
            cuisineType: {
                type: DataTypes.STRING,
            },
            description: {
                type: DataTypes.TEXT,
            },
            imageUrl: {
                type: DataTypes.STRING,
            },
            latitude: {
                type: DataTypes.DECIMAL(9, 6),
                allowNull: false,
            },
            longitude: {
                type: DataTypes.DECIMAL(9, 6),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Restaurant",
            tableName: "Restaurants",
        }
    );

    return Restaurant;
};
