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
                    totalPrice: 17.98,
                    status: "pending",
                },
                {
                    userId: 1,
                    runnerId: 2,
                    airportId: 2,
                    restaurantId: 2,
                    gate: "B2",
                    totalPrice: 33.96,
                    status: "delivered",
                },
                {
                    userId: 1,
                    runnerId: 1,
                    airportId: 2,
                    restaurantId: 3,
                    gate: "D8",
                    totalPrice: 19.98,
                    status: "preparing",
                },
                {
                    userId: 4,
                    runnerId: 2,
                    airportId: 2,
                    restaurantId: 5,
                    gate: "A4",
                    totalPrice: 17.96,
                    status: "picked_up",
                },
                {
                    userId: 1,
                    runnerId: 1,
                    airportId: 1,
                    restaurantId: 7,
                    gate: "C6",
                    totalPrice: 38.96,
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
