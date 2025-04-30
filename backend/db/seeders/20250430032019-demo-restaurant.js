"use strict";

const { Restaurant } = require("../models");

module.exports = {
    async up(queryInterface, Sequelize) {
        await Restaurant.bulkCreate(
            [
                {
                    name: "Taco 'Bout It",
                    description: "Tacos and fun in the sun!",
                    ownerId: 1,
                    airportId: 1,
                    terminal: "T1",
                    gate: "A3",
                    cuisineType: "Mexican",
                    imageUrl: "https://via.placeholder.com/150",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "The Wok and Roll",
                    description: "Sushi so fresh, you'll think it’s swimming!",
                    ownerId: 2,
                    airportId: 2,
                    terminal: "T2",
                    gate: "C4",
                    cuisineType: "Asian Fusion",
                    imageUrl: "https://via.placeholder.com/150",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Pasta La Vista",
                    description: "Italian cuisine for your layover cravings.",
                    ownerId: 3,
                    airportId: 1,
                    terminal: "T1",
                    gate: "B2",
                    cuisineType: "Italian",
                    imageUrl: "https://via.placeholder.com/150",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Bagel Space",
                    description: "Where bagels orbit your breakfast dreams.",
                    ownerId: 1,
                    airportId: 2,
                    terminal: "T3",
                    gate: "D2",
                    cuisineType: "Breakfast",
                    imageUrl: "https://via.placeholder.com/150",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Brew & Fly",
                    description: "Caffeinate before you elevate.",
                    ownerId: 2,
                    airportId: 1,
                    terminal: "T1",
                    gate: "A1",
                    cuisineType: "Cafe",
                    imageUrl: "https://via.placeholder.com/150",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Restaurants", null, {});
    },
};
