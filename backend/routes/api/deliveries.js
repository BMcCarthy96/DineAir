const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const deliveryController = require("../../controllers/deliveryController");

// Get all deliveries assigned to a runner
router.get("/", requireAuth, deliveryController.getRunnerDeliveries);

// Mark a delivery as completed
router.put(
    "/deliveries/:deliveryId/complete",
    requireAuth,
    deliveryController.completeDelivery
);

module.exports = router;
