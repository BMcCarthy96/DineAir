const { Restaurant, sequelize } = require("../db/models");

// Schema-qualify the raw table reference when a Postgres SCHEMA is configured — the
// Sequelize-generated part of the query already qualifies via config/database.js's
// `define.schema`, but a hand-written literal doesn't inherit that automatically.
const reviewsRef = process.env.SCHEMA
    ? `"${process.env.SCHEMA}"."Reviews"`
    : '"Reviews"';

const ratingAttributes = {
    include: [
        [
            sequelize.literal(
                `(SELECT AVG(rating) FROM ${reviewsRef} WHERE ${reviewsRef}."restaurantId" = "Restaurant"."id")`
            ),
            "avgRating",
        ],
        [
            sequelize.literal(
                `(SELECT COUNT(*) FROM ${reviewsRef} WHERE ${reviewsRef}."restaurantId" = "Restaurant"."id")`
            ),
            "reviewCount",
        ],
    ],
};

exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.findAll({
            attributes: ratingAttributes,
        });
        res.json(restaurants);
    } catch (err) {
        console.error("Error fetching restaurants:", err);
        res.status(500).json({ error: "Failed to fetch restaurants" });
    }
};

exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findByPk(req.params.id, {
            attributes: ratingAttributes,
        });
        if (!restaurant) return res.status(404).json({ error: "Not found" });
        res.json(restaurant);
    } catch (err) {
        console.error("Error fetching restaurant:", err);
        res.status(500).json({ error: "Failed to fetch restaurant" });
    }
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

