"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        await User.bulkCreate(
            [
                {
                    email: "JustinTyme@dineair.com",
                    username: "LastMinuteJustin",
                    firstName: "Justin",
                    lastName: "Tyme",
                    hashedPassword: bcrypt.hashSync("password"),
                    userType: "customer",
                },
                {
                    email: "DeeLayed@dineair.com",
                    username: "DeeLayed",
                    firstName: "Dee",
                    lastName: "Layed",
                    hashedPassword: bcrypt.hashSync("password2"),
                    userType: "customer",
                },
                {
                    email: "VayKay@dineair.com",
                    username: "VayKay",
                    firstName: "Vay",
                    lastName: "Kay",
                    hashedPassword: bcrypt.hashSync("password3"),
                    userType: "customer",
                },
                {
                    email: "carrie.on@dineair.com",
                    username: "CarryOnQueen",
                    firstName: "Carrie",
                    lastName: "On",
                    hashedPassword: bcrypt.hashSync("password4"),
                    userType: "runner",
                },
                {
                    email: "maverick@dineair.com",
                    username: "DangerZoneMav",
                    firstName: "Pete",
                    lastName: "Mitchell",
                    hashedPassword: bcrypt.hashSync("TopGun"),
                    userType: "runner",
                },
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "Users";
        await queryInterface.bulkDelete(
            options,
            {
                username: {
                    [Op.in]: [
                        "LastMinuteJustin",
                        "DeeLayed",
                        "VayKay",
                        "CarryOnQueen",
                        "DangerZoneMav",
                    ],
                },
            },
            {}
        );
    },
};
