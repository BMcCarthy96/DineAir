"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "Deliveries",
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
                runnerId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: "Users" },
                    onDelete: "CASCADE",
                },
                deliveryTime: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                notes: {
                    type: Sequelize.TEXT,
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
        options.tableName = "Deliveries";
        return queryInterface.dropTable(options);
    },
};
