"use strict";
const { Model, Validator } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // User can have many Orders (as a customer)
            User.hasMany(models.Order, {
                foreignKey: "userId",
                onDelete: "CASCADE",
            });
            // User can have many Orders (as a runner)
            User.hasMany(models.Order, {
                foreignKey: "runnerId",
                onDelete: "CASCADE",
            });
            // User can have many Reviews
            User.hasMany(models.Review, {
                foreignKey: "userId",
                onDelete: "CASCADE",
            });
            // User can have many Carts
            User.hasMany(models.Cart, {
                foreignKey: "userId",
                onDelete: "CASCADE",
            });
            // User can have many CartItems
            User.hasMany(models.CartItem, {
                foreignKey: "userId",
                onDelete: "CASCADE",
            });
            // User can like many Reviews
            User.hasMany(models.ReviewLike, {
                foreignKey: "userId",
                onDelete: "CASCADE",
            });
        }
    }

    User.init(
        {
            // Personal Information
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    len: [4, 30],
                    isNotEmail(value) {
                        if (Validator.isEmail(value)) {
                            throw new Error("Cannot be an email");
                        }
                    },
                },
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    len: [3, 256],
                    isEmail: true,
                },
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            // Authentication Information
            hashedPassword: {
                type: DataTypes.STRING.BINARY,
                allowNull: false,
                validate: {
                    len: [60, 60],
                },
            },

            // User Type: Customer or Runner
            userType: {
                type: DataTypes.STRING,
                allowNull: false, // 'customer' or 'runner'
            },

            // Timestamps
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "User",
            tableName: "Users",
            defaultScope: {
                attributes: {
                    exclude: ["hashedPassword", "createdAt", "updatedAt"],
                },
            },
        }
    );

    return User;
};
