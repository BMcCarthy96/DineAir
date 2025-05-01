const express = require("express");
const router = express.Router();
const {
    getUserOrders,
    createOrder,
    getOrderById,
} = require("../../controllers/orderController");
const { requireAuth } = require("../../utils/auth");

router.get("/", requireAuth, getUserOrders);
router.post("/", requireAuth, createOrder);
router.get("/:id", requireAuth, getOrderById);

module.exports = router;
