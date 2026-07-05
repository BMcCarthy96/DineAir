const { Delivery, Order, Restaurant, User, Airport } = require("../db/models");
const { getSocket } = require("../utils/socket");
const trackingSimulation = require("../utils/trackingSimulation");

module.exports = {
    // Fetch all deliveries assigned to the current runner
    async getRunnerDeliveries(req, res, next) {
        try {
            const deliveries = await Delivery.findAll({
                where: { runnerId: req.user.id },
                include: [
                    {
                        model: Order,
                        include: [Restaurant],
                    },
                ],
            });

            res.json(deliveries);
        } catch (err) {
            next(err);
        }
    },

    // Mark a delivery as completed
    async completeDelivery(req, res, next) {
        try {
            const { deliveryId } = req.params;

            const delivery = await Delivery.findByPk(deliveryId);

            if (!delivery || delivery.runnerId !== req.user.id) {
                return res.status(403).json({ error: "Forbidden" });
            }

            delivery.status = "delivered";
            await delivery.save();

            if (delivery.orderId) {
                const order = await Order.findByPk(delivery.orderId);
                if (order && order.status !== "delivered") {
                    order.status = "delivered";
                    await order.save();
                }
                trackingSimulation.stop(delivery.orderId);
                getSocket()
                    .to(`order:${delivery.orderId}`)
                    .emit("orderStatusUpdate", {
                        orderId: delivery.orderId,
                        status: "delivered",
                    });
                getSocket()
                    .to(`order:${delivery.orderId}`)
                    .emit("deliveryCompleted", { deliveryId });
            }

            res.json(delivery);
        } catch (err) {
            next(err);
        }
    },

    // Update the runner's location and emit it to customers
    async updateRunnerLocation(req, res, next) {
        try {
            const { runnerId, location, orderId } = req.body;

            if (Number(runnerId) !== req.user.id) {
                return res.status(403).json({ error: "Forbidden" });
            }

            const io = getSocket();
            if (orderId && location) {
                trackingSimulation.pauseForRealRunner(orderId);
                io.to(`order:${orderId}`).emit("runnerLocationUpdate", {
                    orderId,
                    runnerId,
                    location,
                    source: "runner",
                });
            } else {
                io.emit("runnerLocationUpdate", { runnerId, location });
            }

            res.json({ success: true });
        } catch (err) {
            next(err);
        }
    },

    // Update the order status and emit it to customers
    async updateOrderStatus(req, res, next) {
        try {
            const { orderId, status } = req.body;

            const order = await Order.findByPk(orderId);
            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }
            if (order.runnerId !== req.user.id) {
                return res.status(403).json({ error: "Forbidden" });
            }

            order.status = status;
            await order.save();

            trackingSimulation.setOrderStatus(Number(orderId), status);
            if (status === "delivered") {
                trackingSimulation.stop(Number(orderId));
            }

            getSocket()
                .to(`order:${orderId}`)
                .emit("orderStatusUpdate", { orderId, status });

            res.json({ success: true, message: "Order status updated." });
        } catch (err) {
            console.error("Error updating order status:", err);
            next(err);
        }
    },

    // Notify customers of a gate change
    async notifyGateChange(req, res, next) {
        try {
            const { gate, terminal } = req.body;

            // Emit gate change notification
            const io = getSocket();
            io.emit("gateChange", { gate, terminal });

            res.json({
                success: true,
                message: "Gate change notification sent.",
            });
        } catch (err) {
            next(err);
        }
    },

    // Calculate ETA using Google Maps Directions API
    async calculateETA(req, res, next) {
        try {
            const { runnerLocation, gateLocation } = req.body;

            const mapsKey =
                process.env.GOOGLE_MAPS_API_KEY ||
                process.env.VITE_GOOGLE_MAPS_API_KEY;
            const params = new URLSearchParams({
                origin: `${runnerLocation.lat},${runnerLocation.lng}`,
                destination: `${gateLocation.lat},${gateLocation.lng}`,
                key: mapsKey,
            });
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/directions/json?${params}`
            );
            const data = await response.json();

            const eta = data.routes?.[0]?.legs?.[0]?.duration?.text;
            res.json({ eta });
        } catch (err) {
            console.error("Error calculating ETA:", err);
            next(err);
        }
    },

    // Fetch the runner's current location from their active delivery's simulation/order
    async getRunnerLocation(req, res, next) {
        try {
            const { runnerId } = req.query;

            const delivery = await Delivery.findOne({
                where: { runnerId, status: ["pending", "in_progress"] },
                include: [{ model: Order, include: [Restaurant] }],
                order: [["createdAt", "DESC"]],
            });

            if (!delivery?.Order) {
                return res.status(404).json({ error: "No active delivery" });
            }

            const simulated = trackingSimulation.getLocation(delivery.Order.id);
            const location = simulated || {
                lat: Number(delivery.Order.Restaurant?.latitude),
                lng: Number(delivery.Order.Restaurant?.longitude),
            };

            res.json({ location, orderId: delivery.Order.id });
        } catch (err) {
            next(err);
        }
    },
};
