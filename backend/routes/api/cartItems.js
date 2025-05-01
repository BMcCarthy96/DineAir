const express = require("express");
const router = express.Router();
const {
    addItemToCart,
    updateCartItem,
    deleteCartItem,
    getCartItems,
} = require("../../controllers/cartItemController");
const { requireAuth } = require("../../utils/auth");

router.get("/", requireAuth, getCartItems);
router.post("/", requireAuth, addItemToCart);
router.put("/:id", requireAuth, updateCartItem);
router.delete("/:id", requireAuth, deleteCartItem);

module.exports = router;
