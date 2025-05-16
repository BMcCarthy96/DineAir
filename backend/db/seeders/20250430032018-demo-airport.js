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
        options.tableName = "Airports";
        await queryInterface.bulkDelete(options, null, {});
    },
};
