"use strict";

const { MenuItem } = require("../models");

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        await MenuItem.bulkCreate(
            [
                // Taco 'Bout It
                {
                    restaurantId: 1,
                    name: "Taco Supreme",
                    description: "A taco with all the fixings!",
                    price: 8.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },
                {
                    restaurantId: 1,
                    name: "Spicy Nachos",
                    description: "Loaded nachos with jalapeños and cheese.",
                    price: 7.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },
                {
                    restaurantId: 1,
                    name: "Churros",
                    description: "Sweet cinnamon churros with chocolate dip.",
                    price: 4.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },

                // The Wok and Roll
                {
                    restaurantId: 2,
                    name: "Sushi Roll",
                    description: "A roll of sushi that’s totally on a roll!",
                    price: 12.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },
                {
                    restaurantId: 2,
                    name: "Teriyaki Chicken",
                    description: "Grilled chicken with teriyaki sauce.",
                    price: 10.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },
                {
                    restaurantId: 2,
                    name: "Miso Soup",
                    description:
                        "Traditional Japanese soup with tofu and seaweed.",
                    price: 3.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },

                // Pasta La Vista
                {
                    restaurantId: 3,
                    name: "Spaghetti Carbonara",
                    description: "Classic Italian pasta with creamy sauce.",
                    price: 14.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },
                {
                    restaurantId: 3,
                    name: "Margherita Pizza",
                    description: "Fresh pizza with mozzarella and basil.",
                    price: 12.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },
                {
                    restaurantId: 3,
                    name: "Tiramisu",
                    description:
                        "Traditional Italian dessert with coffee flavor.",
                    price: 6.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },

                // Bagel Space
                {
                    restaurantId: 4,
                    name: "Everything Bagel",
                    description:
                        "Bagel with cream cheese and everything seasoning.",
                    price: 5.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },
                {
                    restaurantId: 4,
                    name: "Lox Bagel",
                    description:
                        "Bagel with smoked salmon, cream cheese, and capers.",
                    price: 8.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },
                {
                    restaurantId: 4,
                    name: "Bagel Sandwich",
                    description: "Bagel with egg, cheese, and bacon.",
                    price: 7.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },

                // Brew & Fly
                {
                    restaurantId: 5,
                    name: "Cappuccino",
                    description: "Rich espresso with steamed milk and foam.",
                    price: 4.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },
                {
                    restaurantId: 5,
                    name: "Latte",
                    description: "Smooth espresso with steamed milk.",
                    price: 4.49,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },
                {
                    restaurantId: 5,
                    name: "Blueberry Muffin",
                    description: "Freshly baked muffin with blueberries.",
                    price: 3.99,
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
