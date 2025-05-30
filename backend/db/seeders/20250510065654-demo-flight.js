"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "Flights";
        await queryInterface.bulkInsert(
            options,
            [
                {
                    flightNumber: "DL123",
                    departureAirportId: 1,
                    departureTerminal: "T1",
                    departureGate: "A5",
                    arrivalAirportId: 2,
                    arrivalTerminal: "T3",
                    arrivalGate: "C7",
                    status: "On Time",
                },
                {
                    flightNumber: "AA456",
                    departureAirportId: 2,
                    departureTerminal: "T4",
                    departureGate: "B2",
                    arrivalAirportId: 3,
                    arrivalTerminal: "T1",
                    arrivalGate: "D4",
                    status: "Delayed",
                },
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "Flights";
        await queryInterface.bulkDelete(options, null, {});
    },
};
