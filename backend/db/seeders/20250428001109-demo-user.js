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
                    phone: "123-456-7890",
                    hashedPassword: bcrypt.hashSync("password"),
                    userType: "customer",
                },
                {
                    email: "DeeLayed@dineair.com",
                    username: "DeeLayed",
                    firstName: "Dee",
                    lastName: "Layed",
                    phone: "123-456-7890",
                    hashedPassword: bcrypt.hashSync("password2"),
                    userType: "customer",
                },
                {
                    email: "VayKay@dineair.com",
                    username: "VayKay",
                    firstName: "Vay",
                    lastName: "Kay",
                    phone: "123-456-7890",
                    hashedPassword: bcrypt.hashSync("password3"),
                    userType: "customer",
                },
                {
                    email: "carrie.on@dineair.com",
                    username: "CarryOnQueen",
                    firstName: "Carrie",
                    lastName: "On",
                    phone: "123-456-7890",
                    hashedPassword: bcrypt.hashSync("password4"),
                    userType: "runner",
                },
                {
                    email: "maverick@dineair.com",
                    username: "DangerZoneMav",
                    firstName: "Pete",
                    lastName: "Mitchell",
                    phone: "123-456-7890",
                    hashedPassword: bcrypt.hashSync("TopGun"),
                    userType: "runner",
                },
                {
                    email: "admin@dineair.com",
                    username: "AdminUser",
                    firstName: "Admin",
                    lastName: "User",
                    phone: "111-111-1111",
                    hashedPassword: bcrypt.hashSync("adminpassword"),
                    userType: "admin",
                },
                {
                    email: "owner1@dineair.com",
                    username: "OwnerOne",
                    firstName: "Owner",
                    lastName: "One",
                    phone: "321-456-7890",
                    hashedPassword: bcrypt.hashSync("ownerpassword"),
                    userType: "restaurantOwner",
                },
                {
                    email: "owner2@dineair.com",
                    username: "OwnerTwo",
                    firstName: "Owner",
                    lastName: "Two",
                    phone: "123-654-7890",
                    hashedPassword: bcrypt.hashSync("ownerpassword2"),
                    userType: "restaurantOwner",
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
                        "AdminUser",
                        "OwnerOne",
                        "OwnerTwo",
                    ],
                },
            },
            {}
        );
    },
};
