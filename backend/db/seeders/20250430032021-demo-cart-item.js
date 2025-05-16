"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "CartItems";
        await queryInterface.bulkInsert(
            options,
            [
                {
                    cartId: 1,
                    menuItemId: 1,
                    quantity: 2,
                },
                {
                    cartId: 2,
                    menuItemId: 2,
                    quantity: 1,
                },
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "CartItems";
        await queryInterface.bulkDelete(options, null, {});
    },
};
