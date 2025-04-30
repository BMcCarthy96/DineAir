"use strict";

const { Cart } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await Cart.bulkCreate(
            [
                {
                    userId: 1, // JustinTyme
                },
                {
                    userId: 2, // DeeLayed
                },
                {
                    userId: 3, // VayKay
                },
                {
                    userId: 4, // CarryOnQueen
                },
                {
                    userId: 5, // Maverick
                },
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "Carts";
        await queryInterface.bulkDelete(options, null, {});
    },
};
