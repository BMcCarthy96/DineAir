const { MenuItem } = require("../db/models");

exports.getMenuItemsByRestaurant = async (req, res, next) => {
    try {
        const { restaurantId } = req.params;
        const { page = 1, size = 10 } = req.query;

        const limit = Math.min(size, 50);
        const offset = (page - 1) * limit;

        const items = await MenuItem.findAndCountAll({
            where: { restaurantId },
            limit,
            offset,
        });
        res.json({
            items: items.rows,
            totalItems: items.count,
            totalPages: Math.ceil(items.count / limit),
            currentPage: parseInt(page),
        });
    } catch (err) {
        next(err);
    }
};

exports.createMenuItem = async (req, res, next) => {
    try {
        const { restaurantId } = req.params;
        const { name, description, price, available, imageUrl } = req.body;

        const item = await MenuItem.create({
            restaurantId,
            name,
            description,
            price,
            available,
            imageUrl,
        });

        res.status(201).json(item);
    } catch (err) {
        next(err);
    }
};

exports.updateMenuItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, price, available, imageUrl } = req.body;

        const menuItem = await MenuItem.findByPk(id);
        if (!menuItem) {
            return res.status(404).json({
                title: "Resource Not Found",
                message: "The requested resource couldn't be found.",
            });
        }

        await menuItem.update({
            name,
            description,
            price,
            available,
            imageUrl,
        });
        res.json(menuItem);
    } catch (err) {
        next(err);
    }
};

exports.deleteMenuItem = async (req, res, next) => {
    try {
        const item = await MenuItem.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: "Not found" });
        await item.destroy();
        res.status(204).end();
    } catch (err) {
        next(err);
    }
};
