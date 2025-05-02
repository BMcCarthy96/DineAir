const { MenuItem } = require("../db/models");

exports.getMenuItemsByRestaurant = async (req, res, next) => {
    try {
        const { restaurantId } = req.params;
        const items = await MenuItem.findAll({
            where: { restaurantId },
        });
        res.json(items);
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
        const item = await MenuItem.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: "Not found" });
        await item.update(req.body);
        res.json(item);
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
