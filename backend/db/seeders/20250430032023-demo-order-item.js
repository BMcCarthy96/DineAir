"use strict";

const { OrderItem } = require("../models");

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        await OrderItem.bulkCreate(
            [
                {
                    orderId: 1,
                    menuItemId: 1,
                    quantity: 2,
                    priceAtPurchase: 8.99,
                },
                {
                    orderId: 2,
                    menuItemId: 2,
                    quantity: 1,
                    priceAtPurchase: 12.99,
                },
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("OrderItems", null, {});
    },
};
