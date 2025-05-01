const { MenuItem } = require("../db/models");

exports.getMenuItemsByRestaurant = async (req, res) => {
    const items = await MenuItem.findAll({
        where: { restaurantId: req.params.restaurantId },
    });
    res.json(items);
};

exports.createMenuItem = async (req, res) => {
    const item = await MenuItem.create(req.body);
    res.status(201).json(item);
};

exports.updateMenuItem = async (req, res) => {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    await item.update(req.body);
    res.json(item);
};

exports.deleteMenuItem = async (req, res) => {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    await item.destroy();
    res.status(204).end();
};
