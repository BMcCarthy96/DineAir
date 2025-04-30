"use strict";

const { Airport } = require("../models");

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        await Airport.bulkCreate(
            [
                {
                    name: "Sky High Airport",
                    code: "SHA",
                    city: "Cloud City",
                    state: "Nimbus",
                    country: "Fictionland",
                },
                {
                    name: "JetStream Hub",
                    code: "JSH",
                    city: "Windyville",
                    state: "Breeze",
                    country: "Zephyria",
                },
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Airports", null, {});
    },
};
