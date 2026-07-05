const express = require("express");
const router = express.Router();
const {
    requireAuth,
    requireRunner,
    requireAdmin,
} = require("../../utils/auth");
const deliveryController = require("../../controllers/deliveryController");

// Get all deliveries assigned to a runner
router.get(
    "/",
    requireAuth,
    requireRunner,
    deliveryController.getRunnerDeliveries
);

// Mark a delivery as completed (runner-owned check happens in the controller)
router.put(
    "/:deliveryId/complete",
    requireAuth,
    requireRunner,
    deliveryController.completeDelivery
);

// Update runner location
router.post(
    "/update-location",
    requireAuth,
    requireRunner,
    deliveryController.updateRunnerLocation
);

// Notify gate change
router.post(
    "/notify-gate-change",
    requireAuth,
    requireAdmin,
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

// Update order status (runner-owned check happens in the controller)
router.post(
    "/update-order-status",
    requireAuth,
    requireRunner,
    deliveryController.updateOrderStatus
);

module.exports = router;
