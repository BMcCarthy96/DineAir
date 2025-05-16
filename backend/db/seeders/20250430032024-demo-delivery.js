"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "Deliveries";
        await queryInterface.bulkInsert(
            options,
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
        options.tableName = "Deliveries";
        await queryInterface.bulkDelete(options, null, {});
    },
};
