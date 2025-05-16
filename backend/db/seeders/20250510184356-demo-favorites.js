"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "Favorites";
        await queryInterface.bulkInsert(
            options,
            [
                {
                    userId: 1,
                    restaurantId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    userId: 2,
                    restaurantId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "Favorites";
        await queryInterface.bulkDelete(options, null, {});
    },
};
