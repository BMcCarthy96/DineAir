const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Favorite extends Model {
        static associate(models) {
            Favorite.belongsTo(models.User, { foreignKey: "userId" });
            Favorite.belongsTo(models.Restaurant, {
                foreignKey: "restaurantId",
            });
        }
    }

    Favorite.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            restaurantId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Favorite",
            tableName: "Favorites",
        }
    );

    return Favorite;
};
