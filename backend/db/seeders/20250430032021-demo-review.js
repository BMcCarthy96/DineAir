"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "Reviews";
        await queryInterface.bulkInsert(
            options,
            [
                // Taco 'Bout It
                {
                    userId: 1,
                    restaurantId: 1,
                    rating: 5,
                    comment: "Best tacos I’ve ever had! 10/10 would eat again!",
                },
                {
                    userId: 2,
                    restaurantId: 1,
                    rating: 3,
                    comment:
                        "Tacos were decent, but the salsa was way too spicy for me.",
                },
                {
                    userId: 3,
                    restaurantId: 1,
                    rating: 1,
                    comment: "I found a hair in my taco. Never coming back.",
                },
                {
                    userId: 4,
                    restaurantId: 1,
                    rating: 4,
                    comment: "Great food, but the wait time was a bit long.",
                },
                {
                    userId: 5,
                    restaurantId: 1,
                    rating: 5,
                    comment: "The churros alone are worth the trip. Amazing!",
                },

                // The Wok and Roll
                {
                    userId: 1,
                    restaurantId: 2,
                    rating: 4,
                    comment:
                        "The sushi was fresh and delicious, but the soy sauce was too salty.",
                },
                {
                    userId: 2,
                    restaurantId: 2,
                    rating: 2,
                    comment: "The teriyaki chicken was dry and overcooked.",
                },
                {
                    userId: 3,
                    restaurantId: 2,
                    rating: 5,
                    comment:
                        "Miso soup was comforting and perfect for a cold day.",
                },
                {
                    userId: 4,
                    restaurantId: 2,
                    rating: 3,
                    comment:
                        "Good food, but the portions were too small for the price.",
                },
                {
                    userId: 5,
                    restaurantId: 2,
                    rating: 5,
                    comment: "I’d roll back here for the sushi any day!",
                },

                // Pasta La Vista
                {
                    userId: 1,
                    restaurantId: 3,
                    rating: 5,
                    comment:
                        "The carbonara was creamy and perfectly seasoned. Loved it!",
                },
                {
                    userId: 2,
                    restaurantId: 3,
                    rating: 1,
                    comment: "The pizza was burnt and tasted like cardboard.",
                },
                {
                    userId: 3,
                    restaurantId: 3,
                    rating: 4,
                    comment: "Tiramisu was heavenly, but the service was slow.",
                },
                {
                    userId: 4,
                    restaurantId: 3,
                    rating: 5,
                    comment: "Best Italian food I’ve had outside of Italy!",
                },
                {
                    userId: 5,
                    restaurantId: 3,
                    rating: 2,
                    comment: "The pasta was undercooked. Disappointed.",
                },

                // Bagel Space
                {
                    userId: 1,
                    restaurantId: 4,
                    rating: 5,
                    comment: "The everything bagel was out of this world!",
                },
                {
                    userId: 2,
                    restaurantId: 4,
                    rating: 3,
                    comment: "Bagels were good, but the coffee was lukewarm.",
                },
                {
                    userId: 3,
                    restaurantId: 4,
                    rating: 1,
                    comment: "The lox bagel smelled weird. Couldn’t eat it.",
                },
                {
                    userId: 4,
                    restaurantId: 4,
                    rating: 4,
                    comment: "Great bagels, but they ran out of cream cheese.",
                },
                {
                    userId: 5,
                    restaurantId: 4,
                    rating: 5,
                    comment:
                        "Bagel sandwich was the perfect breakfast. Highly recommend!",
                },

                // Brew & Fly
                {
                    userId: 1,
                    restaurantId: 5,
                    rating: 5,
                    comment:
                        "The cappuccino was rich and creamy. Perfect start to my day!",
                },
                {
                    userId: 2,
                    restaurantId: 5,
                    rating: 2,
                    comment: "The latte tasted burnt. Not impressed.",
                },
                {
                    userId: 3,
                    restaurantId: 5,
                    rating: 4,
                    comment:
                        "Blueberry muffin was fresh and delicious, but a bit overpriced.",
                },
                {
                    userId: 4,
                    restaurantId: 5,
                    rating: 5,
                    comment:
                        "Great coffee and friendly staff. Will definitely come back!",
                },
                {
                    userId: 5,
                    restaurantId: 5,
                    rating: 3,
                    comment:
                        "Decent coffee, but the seating area was too crowded.",
                },

                // Burger Terminal
                {
                    userId: 1,
                    restaurantId: 6,
                    rating: 5,
                    comment: "The bacon burger was amazing! Highly recommend.",
                },
                {
                    userId: 2,
                    restaurantId: 6,
                    rating: 3,
                    comment: "The fries were cold, but the burger was good.",
                },
                {
                    userId: 3,
                    restaurantId: 6,
                    rating: 1,
                    comment: "Worst burger I’ve ever had. Avoid this place.",
                },

                // Pho Real
                {
                    userId: 4,
                    restaurantId: 7,
                    rating: 5,
                    comment: "The beef pho was authentic and delicious!",
                },
                {
                    userId: 5,
                    restaurantId: 7,
                    rating: 4,
                    comment:
                        "Spring rolls were fresh, but the peanut sauce was too sweet.",
                },
                {
                    userId: 1,
                    restaurantId: 7,
                    rating: 2,
                    comment: "The chicken pho was bland and overpriced.",
                },

                // The Flying Curry
                {
                    userId: 2,
                    restaurantId: 8,
                    rating: 5,
                    comment: "Butter chicken was the best I’ve ever had!",
                },
                {
                    userId: 3,
                    restaurantId: 8,
                    rating: 4,
                    comment: "Garlic naan was soft and flavorful. Loved it!",
                },
                {
                    userId: 4,
                    restaurantId: 8,
                    rating: 3,
                    comment: "The vegetable curry was too spicy for my taste.",
                },

                // Poke Paradise
                {
                    userId: 5,
                    restaurantId: 9,
                    rating: 5,
                    comment: "The ahi tuna bowl was fresh and delicious!",
                },
                {
                    userId: 1,
                    restaurantId: 9,
                    rating: 4,
                    comment: "Great poke, but the portion size was small.",
                },
                {
                    userId: 2,
                    restaurantId: 9,
                    rating: 3,
                    comment:
                        "The veggie poke bowl was okay, but nothing special.",
                },

                // Crepe Escape
                {
                    userId: 3,
                    restaurantId: 10,
                    rating: 5,
                    comment: "Nutella crepe was heavenly. Perfect dessert!",
                },
                {
                    userId: 4,
                    restaurantId: 10,
                    rating: 4,
                    comment: "Ham and cheese crepe was tasty, but a bit salty.",
                },
                {
                    userId: 5,
                    restaurantId: 10,
                    rating: 2,
                    comment: "The strawberry crepe was soggy. Disappointed.",
                },
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "Reviews";
        await queryInterface.bulkDelete(options, null, {});
    },
};
