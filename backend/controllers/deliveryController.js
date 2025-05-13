const { Delivery, Order, Restaurant, User, Airport } = require("../db/models");
const { getSocket } = require("../utils/socket");
const axios = require("axios");

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

            // Emit delivery completion notification
            const io = getSocket();
            io.emit("deliveryCompleted", { deliveryId });

            res.json(delivery);
        } catch (err) {
            next(err);
        }
    },

    // Update the runner's location and emit it to customers
    async updateRunnerLocation(req, res, next) {
        try {
            const { runnerId, location } = req.body;

            console.log(
                `Emitting runnerLocationUpdate for runnerId: ${runnerId}, location:`,
                location
            );

            // Emit runner location update to the customer
            const io = getSocket();
            io.emit("runnerLocationUpdate", { runnerId, location });

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

            order.status = status;
            await order.save();

            console.log(`Order ${orderId} status updated: ${status}`);

            // Emit order status update
            const io = getSocket();
            io.emit("orderStatusUpdate", { orderId, status });

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

            console.log(
                `Notifying gate change: Gate ${gate}, Terminal ${terminal}`
            );

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

            const response = await axios.get(
                "https://maps.googleapis.com/maps/api/directions/json",
                {
                    params: {
                        origin: `${runnerLocation.lat},${runnerLocation.lng}`,
                        destination: `${gateLocation.lat},${gateLocation.lng}`,
                        key: process.env.VITE_GOOGLE_MAPS_API_KEY,
                    },
                }
            );

            const eta = response.data.routes[0]?.legs[0]?.duration?.text;
            res.json({ eta });
        } catch (err) {
            console.error("Error calculating ETA:", err);
            next(err);
        }
    },

    // Fetch the runner's current location (mocked for now)
    async getRunnerLocation(req, res, next) {
        try {
            const { runnerId } = req.query;

            // Mocked runner location; replace with real data source
            const runnerLocation = { lat: 37.7749, lng: -122.4194 };

            res.json({ location: runnerLocation });
        } catch (err) {
            next(err);
        }
    },
};
