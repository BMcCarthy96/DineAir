"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Airport extends Model {
        static associate(models) {
            Airport.hasMany(models.Restaurant, {
                foreignKey: "airportId",
                onDelete: "CASCADE",
                hooks: true,
            });

            Airport.hasMany(models.Order, {
                foreignKey: "airportId",
                onDelete: "SET NULL",
            });
        }
    }

    Airport.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            code: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    len: [3, 5],
                },
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            state: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            country: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
            },
            updatedAt: {
                type: DataTypes.DATE,
            },
        },
        {
            sequelize,
            modelName: "Airport",
            tableName: "Airports",
        }
    );

    return Airport;
};
