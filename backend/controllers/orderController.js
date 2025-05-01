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
    if (!order) return res.status(404).json({ error: "Not found" });
    res.json(order);
};
