"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "Airports";
        await queryInterface.bulkInsert(
            options,
            [
                {
                    id: 1,
                    name: "Los Angeles International Airport",
                    code: "LAX",
                    city: "Los Angeles",
                    state: "California",
                    country: "USA",
                },
                {
                    id: 2,
                    name: "John F. Kennedy International Airport",
                    code: "JFK",
                    city: "New York",
                    state: "New York",
                    country: "USA",
                },
                {
                    id: 3,
                    name: "O'Hare International Airport",
                    code: "ORD",
                    city: "Chicago",
                    state: "Illinois",
                    country: "USA",
                },
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "Airports";
        await queryInterface.bulkDelete(options, null, {});
    },
};
