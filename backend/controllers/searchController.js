const { Restaurant, MenuItem } = require("../db/models");
const { Op } = require("sequelize");

module.exports = {
    async search(req, res, next) {
        try {
            const { query } = req.query;

            if (!query) {
                return res.status(400).json({ error: "Search query required" });
            }

            const lowerQuery = query.toLowerCase();

            // Search for restaurants
            const restaurants = await Restaurant.findAll({
                where: {
                    name: { [Op.like]: `%${lowerQuery}%` },
                },
            });

            // Search for menu items
            const menuItems = await MenuItem.findAll({
                where: {
                    name: { [Op.like]: `%${lowerQuery}%` },
                },
            });

            res.json({ restaurants, menuItems });
        } catch (err) {
            next(err);
        }
    },
};
