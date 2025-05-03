const { Order } = require("../db/models");

exports.getUserOrders = async (req, res) => {
    const orders = await Order.findAll({ where: { userId: req.user.id } });
    res.json(orders);
};

exports.createOrder = async (req, res) => {
    const newOrder = await Order.create({ ...req.body, userId: req.user.id });
    res.status(201).json(newOrder);
};

exports.getOrderById = async (req, res) => {
    const order = await Order.findOne({
        where: { id: req.params.id, userId: req.user.id },
    });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
};

exports.deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params;

        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Check if the user is the owner of the order or an admin
        if (order.userId !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ error: "Forbidden" });
        }

        await order.destroy();

        res.status(204).end();
    } catch (err) {
        next(err);
    }
};
