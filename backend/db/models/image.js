"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Image extends Model {
        static associate(models) {
            // Polymorphic association, handled via constraints/scope in other models
        }
    }

    Image.init(
        {
            url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            imageableType: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            imageableId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Image",
            tableName: "Images",
        }
    );

    return Image;
};
