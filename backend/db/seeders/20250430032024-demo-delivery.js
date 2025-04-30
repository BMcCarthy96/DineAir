"use strict";

const { Delivery } = require("../models");

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        await Delivery.bulkCreate(
            [
                {
                    orderId: 1,
                    runnerId: 2,
                    deliveryTime: new Date(),
                    notes: "Be careful, tacos are spicy!",
                },
                {
                    orderId: 2,
                    runnerId: 4,
                    deliveryTime: new Date(),
                    notes: "Sushi delivered fresh, enjoy!",
                },
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Deliveries", null, {});
    },
};
