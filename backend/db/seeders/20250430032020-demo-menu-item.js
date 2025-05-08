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
                    imageUrl: "/images/cappuccino.jpg",
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

                // Burger Terminal
                {
                    restaurantId: 6,
                    name: "Classic Cheeseburger",
                    description: "A juicy beef patty with melted cheese.",
                    price: 9.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },
                {
                    restaurantId: 6,
                    name: "Bacon Burger",
                    description: "Topped with crispy bacon and BBQ sauce.",
                    price: 11.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },
                {
                    restaurantId: 6,
                    name: "Fries",
                    description: "Crispy golden fries with ketchup.",
                    price: 3.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },

                // Pho Real
                {
                    restaurantId: 7,
                    name: "Beef Pho",
                    description:
                        "Traditional Vietnamese noodle soup with beef.",
                    price: 12.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },
                {
                    restaurantId: 7,
                    name: "Chicken Pho",
                    description: "Classic pho with tender chicken slices.",
                    price: 11.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },
                {
                    restaurantId: 7,
                    name: "Spring Rolls",
                    description: "Fresh rolls with shrimp and peanut sauce.",
                    price: 6.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },

                // The Flying Curry
                {
                    restaurantId: 8,
                    name: "Butter Chicken",
                    description: "Creamy curry with tender chicken pieces.",
                    price: 13.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },
                {
                    restaurantId: 8,
                    name: "Vegetable Curry",
                    description:
                        "A mix of fresh vegetables in a spicy curry sauce.",
                    price: 11.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },
                {
                    restaurantId: 8,
                    name: "Garlic Naan",
                    description: "Soft naan bread with a hint of garlic.",
                    price: 3.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },

                // Poke Paradise
                {
                    restaurantId: 9,
                    name: "Ahi Tuna Bowl",
                    description:
                        "Fresh ahi tuna with rice and tropical toppings.",
                    price: 14.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },
                {
                    restaurantId: 9,
                    name: "Salmon Poke Bowl",
                    description: "Salmon with avocado, rice, and sesame seeds.",
                    price: 13.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },
                {
                    restaurantId: 9,
                    name: "Veggie Poke Bowl",
                    description:
                        "A vegetarian option with tofu and fresh veggies.",
                    price: 12.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },

                // Crepe Escape
                {
                    restaurantId: 10,
                    name: "Nutella Crepe",
                    description: "Sweet crepe filled with Nutella and bananas.",
                    price: 8.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },
                {
                    restaurantId: 10,
                    name: "Ham and Cheese Crepe",
                    description: "Savory crepe with ham and melted cheese.",
                    price: 9.99,
                    available: true,
                    imageUrl: "https://via.placeholder.com/150",
                },
                {
                    restaurantId: 10,
                    name: "Strawberry Crepe",
                    description: "Fresh strawberries with whipped cream.",
                    price: 8.99,
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
