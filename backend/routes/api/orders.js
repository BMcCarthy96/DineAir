const express = require("express");
const router = express.Router();
const {
    getUserOrders,
    createOrder,
    getOrderById,
    deleteOrder,
    reorderOrder,
} = require("../../controllers/orderController");
const { requireAuth } = require("../../utils/auth");

router.get("/", requireAuth, getUserOrders);
router.post("/", requireAuth, createOrder);
router.get("/:id", requireAuth, getOrderById);
router.delete("/:id", requireAuth, deleteOrder);

// Reorder a past order
router.post("/:orderId/reorder", requireAuth, reorderOrder);

module.exports = router;
