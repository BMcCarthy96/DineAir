"use strict";

const { CartItem } = require("../models");

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        await CartItem.bulkCreate(
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
        await queryInterface.bulkDelete("CartItems", null, {});
    },
};
