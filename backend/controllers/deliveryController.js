const { Delivery, Order, Restaurant } = require("../db/models");
const { getSocket } = require("../utils/socket");
const axios = require("axios");

module.exports = {
    async getRunnerDeliveries(req, res, next) {
        try {
            const deliveries = await Delivery.findAll({
                where: { runnerId: req.user.id },
                include: [{ model: Order, include: [Restaurant] }],
            });

            res.json(deliveries);
        } catch (err) {
            next(err);
        }
    },

    async completeDelivery(req, res, next) {
        try {
            const { deliveryId } = req.params;

            const delivery = await Delivery.findByPk(deliveryId);

            if (!delivery || delivery.runnerId !== req.user.id) {
                return res.status(403).json({ error: "Forbidden" });
            }

            delivery.status = "delivered";
            await delivery.save();

            res.json(delivery);
        } catch (err) {
            next(err);
        }
    },

    async updateRunnerLocation(req, res, next) {
        try {
            const { runnerId, location } = req.body;

            // Log the data being emitted
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

    async updateOrderStatus(req, res, next) {
        try {
            const { orderId, status } = req.body;

            // Emit order status update to all clients
            const io = getSocket();
            io.emit("orderStatusUpdate", { orderId, status });

            res.json({ success: true, message: "Order status updated." });
        } catch (err) {
            console.error("Error updating order status:", err);
            next(err);
        }
    },

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
            next(err);
        }
    },

    async updateRunnerLocation(req, res, next) {
        try {
            const { runnerId, location } = req.body;

            // Emit runner location update to the customer
            const io = getSocket();
            io.emit("runnerLocationUpdate", { runnerId, location });

            res.json({ success: true });
        } catch (err) {
            next(err);
        }
    },

    async getRunnerLocation(req, res, next) {
        try {
            const { runnerId } = req.query;

            // Fetch runner's location (mocked for now; replace with real data source)
            const runnerLocation = { lat: 37.7749, lng: -122.4194 }; // Example location

            res.json({ location: runnerLocation });
        } catch (err) {
            next(err);
        }
    },
};
