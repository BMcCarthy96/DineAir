const { Restaurant } = require("../db/models");

exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.findAll();
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch restaurants" });
    }
};

exports.getRestaurantById = async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (!restaurant) return res.status(404).json({ error: "Not found" });
    res.json(restaurant);
};

exports.createRestaurant = async (req, res) => {
    try {
        const {
            name,
            description,
            terminal,
            gate,
            cuisineType,
            imageUrl,
            airportId,
            latitude,
            longitude,
        } = req.body;

        if (!name || !airportId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const restaurant = await Restaurant.create({
            ownerId: req.user.id,
            name,
            description,
            terminal,
            gate,
            cuisineType,
            imageUrl,
            airportId,
            latitude,
            longitude,
        });

        res.status(201).json(restaurant);
    } catch (err) {
        console.error("Error creating restaurant:", err);
        res.status(500).json({
            error: err.message || "Failed to create restaurant",
        });
    }
};
exports.updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, terminal, gate, cuisineType, imageUrl } =
            req.body;

        const restaurant = await Restaurant.findByPk(id);

        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        if (
            req.user.userType !== "admin" &&
            restaurant.ownerId !== req.user.id
        ) {
            return res.status(403).json({
                error: "You do not have permission to update this restaurant",
            });
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
        console.error(err);
        res.status(500).json({ error: "Failed to update restaurant" });
    }
};

exports.deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;

        const restaurant = await Restaurant.findByPk(id);

        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        if (
            req.user.userType !== "admin" &&
            restaurant.ownerId !== req.user.id
        ) {
            return res.status(403).json({
                error: "You do not have permission to delete this restaurant",
            });
        }

        await restaurant.destroy();
        res.status(204).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete restaurant" });
    }
};

exports.getFastPrepRestaurants = async (req, res) => {
    const { timeBeforeBoarding } = req.query;

    const restaurants = await Restaurant.findAll({
        where: {
            prepTime: { [Op.lte]: timeBeforeBoarding },
        },
    });

    res.json(restaurants);
};
