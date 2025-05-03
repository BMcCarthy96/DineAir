"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "Orders",
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                userId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: "Users" },
                    onDelete: "CASCADE",
                },
                runnerId: {
                    type: Sequelize.INTEGER,
                    allowNull: true, // initially null, can be assigned once a runner picks up the order
                    references: { model: "Users" },
                    onDelete: "SET NULL",
                },
                airportId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: "Airports" },
                    onDelete: "CASCADE",
                },
                restaurantId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: "Restaurants" },
                    onDelete: "CASCADE",
                },
                gate: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                totalPrice: {
                    type: Sequelize.DECIMAL(10, 2),
                    allowNull: false,
                },
                status: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    defaultValue: "pending", // statuses: 'pending', 'preparing', 'picked_up', 'delivered'
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                },
            },
            options
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "Orders";
        return queryInterface.dropTable(options);
    },
};
