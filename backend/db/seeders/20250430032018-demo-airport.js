"use strict";

const { Airport } = require("../models");

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        await Airport.bulkCreate(
            [
                {
                    id: 1,
                    name: "Sky High Airport",
                    code: "SHA",
                    city: "Cloud City",
                    state: "Nimbus",
                    country: "Fictionland",
                },
                {
                    id: 2,
                    name: "JetStream Hub",
                    code: "JSH",
                    city: "Windyville",
                    state: "Breeze",
                    country: "Zephyria",
                },
                {
                    id: 3,
                    name: "Terminal City Airport",
                    code: "TCA",
                    city: "Terminal City",
                    state: "Transit",
                    country: "Layoverland",
                },
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Airports", null, {});
    },
};
