const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const cartController = require("../../controllers/cartController");

// Get user's cart
router.get("/", requireAuth, cartController.getUserCart);

// Add item to cart
router.post("/items", requireAuth, cartController.addItemToCart);

// Update cart item quantity
router.put("/items/:cartItemId", requireAuth, cartController.updateCartItem);

// Remove item from cart
router.delete(
    "/items/:cartItemId",
    requireAuth,
    cartController.removeItemFromCart
);

module.exports = router;
