const { Delivery, Order, Restaurant } = require("../db/models");

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
};
