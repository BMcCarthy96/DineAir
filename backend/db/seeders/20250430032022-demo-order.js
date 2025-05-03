"use strict";

const { Order } = require("../models");

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        await Order.bulkCreate(
            [
                {
                    userId: 1,
                    runnerId: 2,
                    airportId: 1,
                    restaurantId: 1,
                    gate: "A1",
                    totalPrice: 18.99,
                    status: "pending",
                },
                {
                    userId: 3,
                    runnerId: 4,
                    airportId: 2,
                    restaurantId: 2,
                    gate: "B2",
                    totalPrice: 15.99,
                    status: "delivered",
                },
                {
                    userId: 2,
                    runnerId: 1,
                    airportId: 2,
                    restaurantId: 2,
                    gate: "D8",
                    totalPrice: 15.99,
                    status: "preparing",
                },
                {
                    userId: 4,
                    runnerId: 5,
                    airportId: 2,
                    restaurantId: 5,
                    gate: "A4",
                    totalPrice: 15.99,
                    status: "picked_up",
                },
                {
                    userId: 5,
                    runnerId: 3,
                    airportId: 1,
                    restaurantId: 3,
                    gate: "C6",
                    totalPrice: 15.99,
                    status: "delivered",
                },
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Orders", null, {});
    },
};
