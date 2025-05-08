const { Order, Cart, CartItem, MenuItem, Restaurant } = require("../db/models");

exports.getUserOrders = async (req, res) => {
    const orders = await Order.findAll({ where: { userId: req.user.id } });
    res.json(orders);
};

exports.createOrder = async (req, res) => {
    try {
        const { gate } = req.body;

        console.log("Gate:", gate); // Debugging: Log the gate value
        console.log("User ID:", req.user.id); // Debugging: Log the user ID

        // Fetch the user's cart
        const cart = await Cart.findOne({ where: { userId: req.user.id } });

        if (!cart) {
            return res.status(400).json({ error: "Cart not found" });
        }

        console.log("Cart ID:", cart.id); // Debugging: Log the cart ID

        // Fetch the user's cart items
        const cartItems = await CartItem.findAll({
            where: { cartId: cart.id },
            include: {
                model: MenuItem,
                include: {
                    model: Restaurant,
                    attributes: ["airportId"],
                },
            },
        });

        console.log("Cart Items:", cartItems); // Debugging: Log the cart items

        if (cartItems.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        // Calculate the total price
        const totalPrice = cartItems.reduce(
            (sum, item) => sum + item.quantity * item.MenuItem.price,
            0
        );

        console.log("Total Price:", totalPrice); // Debugging: Log the total price

        // Create the order
        const newOrder = await Order.create({
            userId: req.user.id,
            runnerId: null, // Runner will be assigned later
            airportId: cartItems[0].MenuItem.Restaurant.airportId,
            restaurantId: cartItems[0].MenuItem.restaurantId,
            gate,
            totalPrice,
            status: "pending",
        });

        console.log("New Order:", newOrder); // Debugging: Log the created order

        // Clear the user's cart
        await CartItem.destroy({ where: { cartId: cart.id } });

        res.status(201).json(newOrder);
    } catch (err) {
        console.error("Error creating order:", err); // Debugging: Log the error
        res.status(500).json({ error: "Failed to create order" });
    }
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
