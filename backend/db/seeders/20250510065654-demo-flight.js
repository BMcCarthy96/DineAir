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
                    departureAirportId: 2,
                    departureTerminal: "T4",
                    departureGate: "B12",
                    arrivalAirportId: 1,
                    arrivalTerminal: "T1",
                    arrivalGate: "A5",
                    status: "On Time",
                },
                {
                    flightNumber: "AA456",
                    departureAirportId: 3,
                    departureTerminal: "T3",
                    departureGate: "K9",
                    arrivalAirportId: 1,
                    arrivalTerminal: "T2",
                    arrivalGate: "C7",
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
