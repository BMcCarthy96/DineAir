const express = require("express");
const router = express.Router();
const { requireAuth, requireRunner } = require("../../utils/auth");
const deliveryController = require("../../controllers/deliveryController");

// Get all deliveries assigned to a runner
router.get(
    "/",
    requireAuth,
    requireRunner,
    deliveryController.getRunnerDeliveries
);

// Mark a delivery as completed
router.put(
    "/:deliveryId/complete",
    requireAuth,
    deliveryController.completeDelivery
);

// Update runner location
router.post(
    "/update-location",
    requireAuth,
    deliveryController.updateRunnerLocation
);

// Notify gate change
router.post(
    "/notify-gate-change",
    requireAuth,
    deliveryController.notifyGateChange
);

// Calculate ETA
router.post("/calculate-eta", requireAuth, deliveryController.calculateETA);

// Get runner location
router.get(
    "/runner-location",
    requireAuth,
    deliveryController.getRunnerLocation
);

// Update order status
router.post(
    "/update-order-status",
    requireAuth,
    deliveryController.updateOrderStatus
);

module.exports = router;
