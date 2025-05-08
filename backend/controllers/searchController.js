const { Restaurant, MenuItem, Sequelize } = require("../db/models"); // Import Sequelize
const { Op } = require("sequelize");

module.exports = {
    async search(req, res, next) {
        try {
            const { query } = req.query;

            if (!query) {
                return res.status(400).json({ error: "Search query required" });
            }

            console.log("Search Query:", query); // Debugging: Log the query

            const lowerQuery = query.toLowerCase();

            // Search for restaurants by name or description
            const restaurants = await Restaurant.findAll({
                where: {
                    [Op.or]: [
                        Sequelize.where(
                            Sequelize.fn("LOWER", Sequelize.col("name")),
                            "LIKE",
                            `%${lowerQuery}%`
                        ),
                        Sequelize.where(
                            Sequelize.fn("LOWER", Sequelize.col("description")),
                            "LIKE",
                            `%${lowerQuery}%`
                        ),
                    ],
                },
            });

            // Search for menu items by name
            const menuItems = await MenuItem.findAll({
                where: Sequelize.where(
                    Sequelize.fn("LOWER", Sequelize.col("name")),
                    "LIKE",
                    `%${lowerQuery}%`
                ),
            });

            res.json({ restaurants, menuItems });
        } catch (err) {
            console.error("Error in search route:", err); // Debugging: Log the error
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
};
