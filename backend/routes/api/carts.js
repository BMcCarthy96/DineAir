const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const cartController = require("../../controllers/cartController");

// Get user's cart
router.get("/", requireAuth, cartController.getUserCart);

// Add item to cart
router.post("/", requireAuth, cartController.addItemToCart);

// Update cart item quantity
router.put("/:cartItemId", requireAuth, cartController.updateCartItem);

// Remove item from cart
router.delete("/:cartItemId", requireAuth, cartController.removeItemFromCart);

module.exports = router;
