"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Flight extends Model {
        static associate(models) {
            // Associate Flight with Airports
            Flight.belongsTo(models.Airport, {
                foreignKey: "departureAirportId",
                as: "departureAirport",
            });
            Flight.belongsTo(models.Airport, {
                foreignKey: "arrivalAirportId",
                as: "arrivalAirport",
            });
        }
    }

    Flight.init(
        {
            flightNumber: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            departureAirportId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            departureTerminal: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            departureGate: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            arrivalAirportId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            arrivalTerminal: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            arrivalGate: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "On Time",
            },
        },
        {
            sequelize,
            modelName: "Flight",
            tableName: "Flights",
        }
    );

    return Flight;
};
