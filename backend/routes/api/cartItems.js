const express = require("express");
const router = express.Router();
const {
    requireAuth,
    requireAdmin,
    requireCustomer,
} = require("../../utils/auth");
const cartItemController = require("../../controllers/cartItemController");

// Get all items in the current user's cart (Customer only)
router.get("/", requireAuth, requireCustomer, cartItemController.getCartItems);

// Add an item to the current user's cart (Customer only)
router.post(
    "/",
    requireAuth,
    requireCustomer,
    cartItemController.addItemToCart
);

// Update a cart item in the current user's cart (Customer only)
router.put(
    "/:id",
    requireAuth,
    requireCustomer,
    cartItemController.updateCartItem
);

// Delete a cart item in the current user's cart (Customer only)
router.delete(
    "/:id",
    requireAuth,
    requireCustomer,
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
