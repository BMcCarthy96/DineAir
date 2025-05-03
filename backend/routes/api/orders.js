const express = require("express");
const router = express.Router();
const {
    getUserOrders,
    createOrder,
    getOrderById,
    deleteOrder,
} = require("../../controllers/orderController");
const { requireAuth } = require("../../utils/auth");

router.get("/", requireAuth, getUserOrders);
router.post("/", requireAuth, createOrder);
router.get("/:id", requireAuth, getOrderById);
router.delete("/:id", requireAuth, deleteOrder);

module.exports = router;
