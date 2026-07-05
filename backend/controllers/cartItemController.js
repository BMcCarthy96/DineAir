const { Cart, CartItem, MenuItem } = require("../db/models");

exports.getCartItems = async (req, res) => {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) return res.json([]);
    const items = await CartItem.findAll({
        where: { cartId: cart.id },
        include: {
            model: MenuItem,
            attributes: ["id", "name", "description", "price", "imageUrl"],
        },
    });
    res.json(items);
};

exports.addItemToCart = async (req, res) => {
    const cart = await Cart.findOrCreate({ where: { userId: req.user.id } });
    const cartId = cart[0].id;
    const { menuItemId, quantity = 1 } = req.body;

    const existing = await CartItem.findOne({ where: { cartId, menuItemId } });
    if (existing) {
        existing.quantity += quantity;
        await existing.save();
        return res.status(200).json(existing);
    }

    const item = await CartItem.create({ cartId, menuItemId, quantity });
    res.status(201).json(item);
};

async function ownsCartItem(userId, item) {
    if (!item) return false;
    const cart = await Cart.findByPk(item.cartId);
    return Boolean(cart && cart.userId === userId);
}

exports.updateCartItem = async (req, res) => {
    const item = await CartItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    if (!(await ownsCartItem(req.user.id, item))) {
        return res.status(403).json({ error: "Forbidden" });
    }
    await item.update(req.body);
    res.json(item);
};

exports.deleteCartItem = async (req, res) => {
    const item = await CartItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    if (!(await ownsCartItem(req.user.id, item))) {
        return res.status(403).json({ error: "Forbidden" });
    }
    await item.destroy();
    res.status(204).end();
};

exports.getCartItemsByCartId = async (req, res) => {
    const { cartId } = req.params;
    const items = await CartItem.findAll({
        where: { cartId },
        include: {
            model: MenuItem,
            attributes: ["id", "name", "description", "price", "imageUrl"],
        },
    });
    res.json(items);
};
