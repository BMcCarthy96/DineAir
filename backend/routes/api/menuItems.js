const express = require("express");
const router = express.Router();
const {
    getMenuItemsByRestaurant,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
} = require("../../controllers/menuItemController");
const { requireAuth } = require("../../utils/auth");

router.get("/restaurant/:restaurantId", getMenuItemsByRestaurant);
router.post("/", requireAuth, createMenuItem);
router.put("/:id", requireAuth, updateMenuItem);
router.delete("/:id", requireAuth, deleteMenuItem);

module.exports = router;
