const { CartItem, MenuItem } = require("../db/models");

module.exports = {
    async getUserCart(req, res, next) {
        try {
            const cart = await CartItem.findAll({
                where: { userId: req.user.id },
                include: [{ model: MenuItem }],
            });
            res.json(cart);
        } catch (err) {
            next(err);
        }
    },

    async addItemToCart(req, res, next) {
        try {
            const { menuItemId, quantity } = req.body;

            const cartItem = await CartItem.create({
                userId: req.user.id,
                menuItemId,
                quantity,
            });

            res.status(201).json(cartItem);
        } catch (err) {
            next(err);
        }
    },

    async updateCartItem(req, res, next) {
        try {
            const { cartItemId } = req.params;
            const { quantity } = req.body;

            const cartItem = await CartItem.findByPk(cartItemId);

            if (!cartItem || cartItem.userId !== req.user.id) {
                return res.status(403).json({ error: "Forbidden" });
            }

            cartItem.quantity = quantity;
            await cartItem.save();

            res.json(cartItem);
        } catch (err) {
            next(err);
        }
    },

    async removeItemFromCart(req, res, next) {
        try {
            const { cartItemId } = req.params;

            const cartItem = await CartItem.findByPk(cartItemId);

            if (!cartItem || cartItem.userId !== req.user.id) {
                return res.status(403).json({ error: "Forbidden" });
            }

            await cartItem.destroy();
            res.status(204).end();
        } catch (err) {
            next(err);
        }
    },
};
