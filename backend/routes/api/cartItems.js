const express = require("express");
const router = express.Router();
const {
    requireAuth,
    requireAdmin,
    requireAnyUser,
} = require("../../utils/auth");
const cartItemController = require("../../controllers/cartItemController");

// Get all items in the current user's cart
router.get("/", requireAuth, requireAnyUser, cartItemController.getCartItems);

// Add an item to the current user's cart
router.post("/", requireAuth, requireAnyUser, cartItemController.addItemToCart);

// Update a cart item in the current user's cart
router.put(
    "/:id",
    requireAuth,
    requireAnyUser,
    cartItemController.updateCartItem
);

// Delete a cart item in the current user's cart
router.delete(
    "/:id",
    requireAuth,
    requireAnyUser,
    cartItemController.deleteCartItem
);

// Admin: Get all cart items for a specific cart
router.get(
    "/admin/:cartId",
    requireAuth,
    requireAdmin,
    cartItemController.getCartItemsByCartId
);

module.exports = router;
