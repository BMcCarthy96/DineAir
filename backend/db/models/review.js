"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        static associate(models) {
            Review.belongsTo(models.User, { foreignKey: "userId" });
            Review.belongsTo(models.Restaurant, { foreignKey: "restaurantId" });
            Review.hasMany(models.ReviewLike, {
                foreignKey: "reviewId",
                onDelete: "CASCADE",
            });
            Review.hasMany(models.Image, {
                foreignKey: "imageableId",
                constraints: false,
                scope: {
                    imageableType: "Review",
                },
                onDelete: "CASCADE",
            });
        }
    }

    Review.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            restaurantId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 5,
                },
            },
            body: {
                type: DataTypes.TEXT,
            },
        },
        {
            sequelize,
            modelName: "Review",
            tableName: "Reviews",
        }
    );

    return Review;
};
