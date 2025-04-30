"use strict";

const { MenuItem } = require("../models");

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        await MenuItem.bulkCreate(
            [
                {
                    restaurantId: 1,
                    name: "Taco Supreme",
                    description: "A taco with all the fixings!",
                    price: 8.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },
                {
                    restaurantId: 2,
                    name: "Sushi Roll",
                    description: "A roll of sushi that’s totally on a roll!",
                    price: 12.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("MenuItems", null, {});
    },
};
