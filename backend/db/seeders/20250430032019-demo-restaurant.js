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
                    "https://media.istockphoto.com/id/1349480436/photo/homemade-pork-carnitas-tacos.jpg?s=612x612&w=0&k=20&c=CJkpVp7g_qnhW5G0CpjWGLES1SzGE3yu2S8f9KV3jDo=",
                latitude: 41.978611,
                longitude: -87.904724,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "The Wok and Roll",
                description: "Sushi so fresh, you'll think it’s swimming!",
                ownerId: 7,
                airportId: 2,
                terminal: "T2",
                gate: "C4",
                cuisineType: "Asian Fusion",
                imageUrl:
                    "https://media.istockphoto.com/id/1434408830/photo/freeze-motion-of-wok-pan-and-flying-ingredients-in-the-air.jpg?s=612x612&w=0&k=20&c=mJJjrA8-TOcnsWJNei4yjjEP1ZUwmmUtMqoPwBYgU-g=",
                latitude: 41.98,
                longitude: -87.902,
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
                    "https://media.istockphoto.com/id/637214478/photo/pasta-plate.jpg?s=612x612&w=0&k=20&c=oebCQG_Zfv2zJpobSzpF6JFNdsBQUjG6MdQh-En5l3c=",
                latitude: 41.977,
                longitude: -87.907,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Bagel Space",
                description: "Where bagels orbit your breakfast dreams.",
                ownerId: 8,
                airportId: 2,
                terminal: "T3",
                gate: "D2",
                cuisineType: "Breakfast",
                imageUrl:
                    "https://media.istockphoto.com/id/148003375/photo/bagels-with-cream-cheese.jpg?s=612x612&w=0&k=20&c=gJQIsh__oVKzAEICJdz39dG1491IiM9iAu1HqW4WWkk=",
                latitude: 41.976,
                longitude: -87.903,
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
                    "https://media.istockphoto.com/id/1467199060/photo/cup-of-coffee-with-smoke-and-coffee-beans-on-old-wooden-background.jpg?s=612x612&w=0&k=20&c=OnS8_6FM5ussfSGmjpDD-GofERg2UbItdxShIAA90sQ=",
                latitude: 41.9795,
                longitude: -87.908,
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
                    "https://media.istockphoto.com/id/617759204/photo/steakhouse-double-bacon-cheeseburger.jpg?s=612x612&w=0&k=20&c=QRaHtrxJsmNKOlOTkvxyE-o-3kM-Me1zU320yPT8ycI=",
                latitude: 41.981,
                longitude: -87.906,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Pho Real",
                description: "Authentic Vietnamese pho and more.",
                ownerId: 7,
                airportId: 2,
                terminal: "T2",
                gate: "B5",
                cuisineType: "Vietnamese",
                imageUrl:
                    "https://media.istockphoto.com/id/1687829797/photo/pho-bo-for-breakfast-in-vietnam-stock-photo.jpg?s=612x612&w=0&k=20&c=5aWVkSBZikSPsZMPoAJZWXGKiw3ZvlxrcaldJx0w0_c=",
                latitude: 41.9778,
                longitude: -87.9005,
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
                    "https://media.istockphoto.com/id/177043240/photo/indian-butter-chicken-curry.jpg?s=612x612&w=0&k=20&c=GnqnIWq99zDdjmOWQg0L7p3eKJTQO_bxnJTVbf8PlpM=",
                latitude: 41.9805,
                longitude: -87.9055,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Poke Paradise",
                description: "Fresh poke bowls with tropical vibes.",
                ownerId: 8,
                airportId: 2,
                terminal: "T1",
                gate: "D4",
                cuisineType: "Hawaiian",
                imageUrl:
                    "https://media.istockphoto.com/id/1304027187/photo/hawaiian-tuna-poke-bowl-with-seaweed-avocado-mango-cucumber.jpg?s=612x612&w=0&k=20&c=kUfPqMxAP0LggJHdqBGFNtE0ThL4jaSe1HKScsII-3c=",
                latitude: 41.9782,
                longitude: -87.909,
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
                    "https://media.istockphoto.com/id/1210773494/photo/chocolate-pancake-with-bananas.jpg?s=612x612&w=0&k=20&c=dIj_EfOxKKOnWYU4GdfvKGgePRiKB__YZPHHfsRfPb4=",
                latitude: 41.9768,
                longitude: -87.9075,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        for (const restaurant of demoRestaurants) {
            // Check if a restaurant with the same name and airportId exists
            const [existing] = await queryInterface.sequelize.query(
                `SELECT id FROM "${
                    options.schema ? options.schema + '"."' : ""
                }Restaurants" WHERE name = :name AND airportId = :airportId`,
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
