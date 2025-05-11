const { Favorite, Restaurant } = require("../db/models");

exports.addFavorite = async (req, res, next) => {
    try {
        const { restaurantId } = req.body;

        // Check if the restaurant exists
        const restaurant = await Restaurant.findByPk(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        // Check if the restaurant is already in the user's favorites
        const existingFavorite = await Favorite.findOne({
            where: { userId: req.user.id, restaurantId },
        });
        if (existingFavorite) {
            return res
                .status(400)
                .json({ error: "Restaurant is already in favorites" });
        }

        // Add the restaurant to the user's favorites
        const favorite = await Favorite.create({
            userId: req.user.id,
            restaurantId,
        });

        res.status(201).json(favorite);
    } catch (err) {
        next(err);
    }
};
