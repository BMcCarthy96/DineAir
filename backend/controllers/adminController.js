const { User, Restaurant } = require("../db/models");

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        next(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await user.destroy();
        res.status(204).end();
    } catch (err) {
        next(err);
    }
};

exports.getAllRestaurants = async (req, res, next) => {
    try {
        const restaurants = await Restaurant.findAll();
        res.json(restaurants);
    } catch (err) {
        next(err);
    }
};

exports.createRestaurant = async (req, res, next) => {
    try {
        const {
            ownerId,
            airportId,
            name,
            description,
            terminal,
            gate,
            cuisineType,
            imageUrl,
        } = req.body;

        const restaurant = await Restaurant.create({
            ownerId: req.user.id,
            airportId,
            name,
            description,
            terminal,
            gate,
            cuisineType,
            imageUrl,
        });

        res.status(201).json(restaurant);
    } catch (err) {
        next(err);
    }
};

exports.updateRestaurant = async (req, res, next) => {
    try {
        const { restaurantId } = req.params;
        const { name, description, terminal, gate, cuisineType, imageUrl } =
            req.body;

        const restaurant = await Restaurant.findByPk(restaurantId);

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

exports.deleteRestaurant = async (req, res, next) => {
    try {
        const { restaurantId } = req.params;

        const restaurant = await Restaurant.findByPk(restaurantId);

        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        await restaurant.destroy();
        res.status(204).end();
    } catch (err) {
        next(err);
    }
};
