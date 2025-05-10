const { Delivery, Order, Restaurant } = require("../db/models");
const { io } = require("../bin/www");
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

            // Emit runner location update to the customer
            io.emit("runnerLocationUpdate", { runnerId, location });

            res.json({ success: true });
        } catch (err) {
            next(err);
        }
    },

    async notifyGateChange(req, res, next) {
        try {
            const { gate, terminal } = req.body;

            // Emit gate change notification
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

    async getRunnerLocation(req, res, next) {
        try {
            const { runnerId } = req.query; // Assume runnerId is passed as a query parameter

            // Fetch runner's location (mocked for now; replace with real data source)
            const runnerLocation = { lat: 37.7749, lng: -122.4194 }; // Example location

            res.json({ location: runnerLocation });
        } catch (err) {
            next(err);
        }
    },
};
