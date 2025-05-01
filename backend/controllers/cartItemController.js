const { Cart, CartItem, MenuItem } = require("../db/models");

exports.getCartItems = async (req, res) => {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) return res.json([]);
    const items = await CartItem.findAll({ where: { cartId: cart.id } });
    res.json(items);
};

exports.addItemToCart = async (req, res) => {
    const cart = await Cart.findOrCreate({ where: { userId: req.user.id } });
    const item = await CartItem.create({ ...req.body, cartId: cart[0].id });
    res.status(201).json(item);
};

exports.updateCartItem = async (req, res) => {
    const item = await CartItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    await item.update(req.body);
    res.json(item);
};

exports.deleteCartItem = async (req, res) => {
    const item = await CartItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    await item.destroy();
    res.status(204).end();
};
