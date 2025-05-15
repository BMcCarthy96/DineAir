"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "Restaurants",
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                ownerId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: "Users" },
                    onDelete: "CASCADE",
                },
                airportId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: "Airports" },
                    onDelete: "CASCADE",
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                terminal: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                gate: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                cuisineType: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                description: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
                imageUrl: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                latitude: {
                    type: Sequelize.DECIMAL(9, 6),
                    allowNull: false,
                },
                longitude: {
                    type: Sequelize.DECIMAL(9, 6),
                    allowNull: false,
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
        options.tableName = "Restaurants";
        await queryInterface.dropTable(options);
    },
};
