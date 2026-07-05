"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "Restaurants";
        const demoRestaurants = [
            {
                name: "Taco 'Bout It",
                description: "Tacos and fun in the sun!",
                ownerId: 7,
                airportId: 1,
                terminal: "T1",
                gate: "A3",
                cuisineType: "Mexican",
                imageUrl:
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Street_Tacos_Oaxaca.jpg/1280px-Street_Tacos_Oaxaca.jpg",
                latitude: 33.9431,
                longitude: -118.4085,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "The Wok and Roll",
                description: "Sushi so fresh, you'll think it’s swimming!",
                ownerId: 7,
                airportId: 1,
                terminal: "T2",
                gate: "C4",
                cuisineType: "Asian Fusion",
                imageUrl:
                    "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1600&q=80",
                latitude: 33.9425,
                longitude: -118.41,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Pasta La Vista",
                description: "Italian cuisine for your layover cravings.",
                ownerId: 7,
                airportId: 1,
                terminal: "T1",
                gate: "B2",
                cuisineType: "Italian",
                imageUrl:
                    "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1600&q=80",
                latitude: 33.941,
                longitude: -118.407,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Bagel Space",
                description: "Where bagels orbit your breakfast dreams.",
                ownerId: 8,
                airportId: 1,
                terminal: "T3",
                gate: "D2",
                cuisineType: "Breakfast",
                imageUrl:
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Bagel_with_cream_cheese%2C_salmon_and_vegetables_-_Sarah_Stierch.jpg/1280px-Bagel_with_cream_cheese%2C_salmon_and_vegetables_-_Sarah_Stierch.jpg",
                latitude: 33.942,
                longitude: -118.4055,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Brew & Fly",
                description: "Caffeinate before you elevate.",
                ownerId: 8,
                airportId: 1,
                terminal: "T1",
                gate: "A1",
                cuisineType: "Cafe",
                imageUrl:
                    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=80",
                latitude: 33.9435,
                longitude: -118.4095,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Burger Terminal",
                description: "Juicy burgers for your layover cravings.",
                ownerId: 8,
                airportId: 1,
                terminal: "T1",
                gate: "C3",
                cuisineType: "American",
                imageUrl:
                    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=80",
                latitude: 33.944,
                longitude: -118.408,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Pho Real",
                description: "Authentic Vietnamese pho and more.",
                ownerId: 7,
                airportId: 1,
                terminal: "T2",
                gate: "B5",
                cuisineType: "Vietnamese",
                imageUrl:
                    "https://images.unsplash.com/photo-1583835746434-cf1534674b41?auto=format&fit=crop&w=1600&q=80",
                latitude: 33.943,
                longitude: -118.406,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "The Flying Curry",
                description: "Spicy Indian curries to warm your soul.",
                ownerId: 8,
                airportId: 1,
                terminal: "T3",
                gate: "A7",
                cuisineType: "Indian",
                imageUrl:
                    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1600&q=80",
                latitude: 33.9427,
                longitude: -118.4105,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Poke Paradise",
                description: "Fresh poke bowls with tropical vibes.",
                ownerId: 8,
                airportId: 1,
                terminal: "T1",
                gate: "D4",
                cuisineType: "Hawaiian",
                imageUrl:
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Poke_Bowl_Losos_Zlaty_Klas_2025.jpg/1280px-Poke_Bowl_Losos_Zlaty_Klas_2025.jpg",
                latitude: 33.9442,
                longitude: -118.4075,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Crepe Escape",
                description: "Sweet and savory crepes for every craving.",
                ownerId: 7,
                airportId: 1,
                terminal: "T2",
                gate: "E2",
                cuisineType: "French",
                imageUrl:
                    "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=1600&q=80",
                latitude: 33.9438,
                longitude: -118.4068,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        for (const restaurant of demoRestaurants) {
            // Check if a restaurant with the same name and airportId exists
            const [existing] = await queryInterface.sequelize.query(
                `SELECT id FROM "${
                    options.schema ? options.schema + '"."' : ""
                }Restaurants" WHERE name = :name AND "airportId" = :airportId`,
                {
                    replacements: {
                        name: restaurant.name,
                        airportId: restaurant.airportId,
                    },
                    type: Sequelize.QueryTypes.SELECT,
                }
            );
            if (!existing) {
                await queryInterface.bulkInsert(options, [restaurant], {
                    validate: true,
                });
            }
        }
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "Restaurants";
        await queryInterface.bulkDelete(options, null, {});
    },
};
