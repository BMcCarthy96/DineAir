const { Restaurant } = require("../db/models");

exports.getAllRestaurants = async (req, res) => {
    const restaurants = await Restaurant.findAll();
    res.json(restaurants);
};

exports.getRestaurantById = async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (!restaurant) return res.status(404).json({ error: "Not found" });
    res.json(restaurant);
};

exports.createRestaurant = async (req, res) => {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
};

exports.updateRestaurant = async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (!restaurant) return res.status(404).json({ error: "Not found" });
    await restaurant.update(req.body);
    res.json(restaurant);
};

exports.deleteRestaurant = async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (!restaurant) return res.status(404).json({ error: "Not found" });
    await restaurant.destroy();
    res.status(204).end();
};
