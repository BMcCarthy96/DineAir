const express = require("express");
const router = express.Router();
const {
    requireAuth,
    requireAdmin,
    requireCustomer,
} = require("../../utils/auth");
const cartController = require("../../controllers/cartController");

// Get current user's cart (Customer only)
router.get("/", requireAuth, requireCustomer, cartController.getUserCart);

// Admin: Get all carts
router.get("/admin", requireAuth, requireAdmin, cartController.getAllCarts);

// Admin: Delete a cart
router.delete(
    "/admin/:cartId",
    requireAuth,
    requireAdmin,
    cartController.deleteCart
);

module.exports = router;
