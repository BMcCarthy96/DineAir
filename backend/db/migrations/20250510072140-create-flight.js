"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "Flights",
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                flightNumber: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique: true,
                },
                departureAirportId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: "Airports", key: "id" },
                    onDelete: "CASCADE",
                },
                departureTerminal: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                departureGate: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                arrivalAirportId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: "Airports", key: "id" },
                    onDelete: "CASCADE",
                },
                arrivalTerminal: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                arrivalGate: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                status: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    defaultValue: "On Time",
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                },
            },
            options
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "Flights";
        await queryInterface.dropTable(options);
    },
};
