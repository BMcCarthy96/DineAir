const express = require("express");
const router = express.Router({ mergeParams: true });
const {
    getMenuItemsByRestaurant,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
} = require("../../controllers/menuItemController");
const { requireAuth } = require("../../utils/auth");

// Get all menu items for a restaurant
router.get("/", getMenuItemsByRestaurant);

// Get a specific menu item by ID
router.get("/:menuItemId", getMenuItemById);

// Create a menu item for a restaurant
router.post("/", requireAuth, createMenuItem);

// Update a menu item
router.put("/:id", requireAuth, updateMenuItem);

// Delete a menu item
router.delete("/:id", requireAuth, deleteMenuItem);

module.exports = router;
