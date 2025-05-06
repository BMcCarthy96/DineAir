const { Restaurant } = require("../db/models");

exports.getOwnedRestaurants = async (req, res, next) => {
    try {
        const restaurants = await Restaurant.findAll({
            where: { ownerId: req.user.id },
        });
        res.json(restaurants);
    } catch (err) {
        next(err);
    }
};

exports.updateRestaurant = async (req, res, next) => {
    try {
        const { restaurantId } = req.params;
        const { name, description, terminal, gate, cuisineType, imageUrl } =
            req.body;

        const restaurant = await Restaurant.findOne({
            where: { id: restaurantId, ownerId: req.user.id },
        });

        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        await restaurant.update({
            name,
            description,
            terminal,
            gate,
            cuisineType,
            imageUrl,
        });

        res.json(restaurant);
    } catch (err) {
        next(err);
    }
};
