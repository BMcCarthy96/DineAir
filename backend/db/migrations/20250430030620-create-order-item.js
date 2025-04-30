"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "OrderItems",
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                orderId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: "Orders" },
                    onDelete: "CASCADE",
                },
                menuItemId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: "MenuItems" },
                    onDelete: "CASCADE",
                },
                quantity: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 1,
                },
                priceAtPurchase: {
                    type: Sequelize.DECIMAL(10, 2),
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
        options.tableName = "OrderItems";
        return queryInterface.dropTable(options);
    },
};
