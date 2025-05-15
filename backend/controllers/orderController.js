const {
    Order,
    Cart,
    CartItem,
    MenuItem,
    Restaurant,
    OrderItem,
} = require("../db/models");

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: Restaurant,
                    attributes: ["name"], // Include only the restaurant name
                },
            ],
            attributes: ["id", "status", "totalPrice", "gate", "createdAt"],
            order: [["createdAt", "DESC"]],
        });

        res.json(orders);
    } catch (err) {
        console.error("Error fetching user orders:", err);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { gate } = req.body;

        // Fetch the user's cart
        const cart = await Cart.findOne({ where: { userId: req.user.id } });
        if (!cart) {
            return res.status(400).json({ error: "Cart not found" });
        }

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

        if (cartItems.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        // Calculate the total price
        const totalPrice = cartItems.reduce(
            (sum, item) => sum + item.quantity * item.MenuItem.price,
            0
        );

        // Create the order
        const newOrder = await Order.create({
            userId: req.user.id,
            runnerId: null,
            airportId: cartItems[0].MenuItem.Restaurant.airportId,
            restaurantId: cartItems[0].MenuItem.restaurantId,
            gate,
            totalPrice,
            status: "pending",
        });

        // **Create OrderItems for each cart item**
        for (const cartItem of cartItems) {
            await OrderItem.create({
                orderId: newOrder.id,
                menuItemId: cartItem.menuItemId,
                quantity: cartItem.quantity,
                priceAtPurchase: cartItem.MenuItem.price,
            });
        }

        // Clear the user's cart
        await CartItem.destroy({ where: { cartId: cart.id } });

        res.status(201).json(newOrder);
    } catch (err) {
        console.error("Error creating order:", err);
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

exports.reorderOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        console.log("Reorder request received for orderId:", orderId);

        // Fetch the original order with its associated OrderItems and MenuItems
        const originalOrder = await Order.findByPk(orderId, {
            include: [
                {
                    model: OrderItem,
                    include: [MenuItem],
                },
            ],
        });

        if (!originalOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (originalOrder.userId !== req.user.id) {
            return res.status(403).json({ error: "Forbidden" });
        }

        console.log("OrderItems for reorder:", originalOrder.OrderItems);

        // Find or create the user's cart
        const [cart] = await Cart.findOrCreate({
            where: { userId: req.user.id },
        });

        // **Clear the cart before adding new items**
        await CartItem.destroy({ where: { cartId: cart.id } });

        // Add the items from the original order to the cart
        for (const item of originalOrder.OrderItems) {
            await CartItem.create({
                cartId: cart.id,
                menuItemId: item.menuItemId,
                quantity: item.quantity,
            });
        }

        // Fetch the updated cart items to return to the frontend
        const cartItems = await CartItem.findAll({
            where: { cartId: cart.id },
            include: {
                model: MenuItem,
                attributes: ["id", "name", "description", "price", "imageUrl"],
            },
        });

        res.status(201).json(cartItems);
    } catch (err) {
        console.error("Error reordering order:", err);
        res.status(500).json({ error: "Failed to reorder order." });
    }
};
