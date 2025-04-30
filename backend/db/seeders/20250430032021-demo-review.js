"use strict";

const { Review } = require("../models");

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        await Review.bulkCreate(
            [
                {
                    userId: 1,
                    restaurantId: 1,
                    rating: 5,
                    comment: "Best tacos I’ve ever had! 10/10 would eat again!",
                },
                {
                    userId: 2,
                    restaurantId: 2,
                    rating: 4,
                    comment:
                        "Great sushi but the wasabi hit a little too hard.",
                },
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Reviews", null, {});
    },
};
