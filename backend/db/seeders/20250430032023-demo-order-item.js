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
                    menuItemId: 4,
                    quantity: 2,
                    priceAtPurchase: 25.98,
                },
                {
                    orderId: 2,
                    menuItemId: 6,
                    quantity: 2,
                    priceAtPurchase: 7.98,
                },
                {
                    orderId: 3,
                    menuItemId: 8,
                    quantity: 1,
                    priceAtPurchase: 12.99,
                },
                {
                    orderId: 3,
                    menuItemId: 9,
                    quantity: 1,
                    priceAtPurchase: 6.99,
                },
                {
                    orderId: 4,
                    menuItemId: 13,
                    quantity: 1,
                    priceAtPurchase: 4.99,
                },
                {
                    orderId: 4,
                    menuItemId: 14,
                    quantity: 2,
                    priceAtPurchase: 4.49,
                },
                {
                    orderId: 4,
                    menuItemId: 15,
                    quantity: 1,
                    priceAtPurchase: 3.99,
                },
                {
                    orderId: 5,
                    menuItemId: 19,
                    quantity: 1,
                    priceAtPurchase: 12.99,
                },
                {
                    orderId: 5,
                    menuItemId: 20,
                    quantity: 1,
                    priceAtPurchase: 11.99,
                },
                {
                    orderId: 5,
                    menuItemId: 21,
                    quantity: 2,
                    priceAtPurchase: 3.99,
                },
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("OrderItems", null, {});
    },
};
