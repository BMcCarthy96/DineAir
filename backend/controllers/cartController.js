const { Cart, CartItem, MenuItem } = require("../db/models");

module.exports = {
    async getUserCart(req, res, next) {
        try {
            const cart = await Cart.findOne({
                where: { userId: req.user.id },
                include: {
                    model: CartItem,
                    include: {
                        model: MenuItem,
                        attributes: [
                            "id",
                            "name",
                            "description",
                            "price",
                            "imageUrl",
                        ],
                    },
                },
            });

            if (!cart) {
                return res.json([]);
            }

            res.json(cart.CartItems);
        } catch (err) {
            next(err);
        }
    },

    async getAllCarts(req, res, next) {
        try {
            const carts = await Cart.findAll({
                include: {
                    model: CartItem,
                    include: {
                        model: MenuItem,
                        attributes: [
                            "id",
                            "name",
                            "description",
                            "price",
                            "imageUrl",
                        ],
                    },
                },
            });

            res.json(carts);
        } catch (err) {
            next(err);
        }
    },

    async deleteCart(req, res, next) {
        try {
            const { cartId } = req.params;

            const cart = await Cart.findByPk(cartId);

            if (!cart) {
                return res.status(404).json({ error: "Cart not found" });
            }

            await cart.destroy();
            res.status(204).end();
        } catch (err) {
            next(err);
        }
    },
};
