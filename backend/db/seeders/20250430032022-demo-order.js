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
                    gate: "A1",
                    totalPrice: 18.99,
                    status: "pending",
                },
                {
                    userId: 3,
                    runnerId: 4,
                    airportId: 2,
                    gate: "B2",
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
