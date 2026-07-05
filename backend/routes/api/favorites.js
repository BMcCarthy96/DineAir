const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const {
    addFavorite,
    getFavorites,
    removeFavorite,
} = require("../../controllers/favoritesController");

// Get the current user's favorite restaurants
router.get("/", requireAuth, getFavorites);

// Route to add a restaurant to favorites
router.post("/", requireAuth, addFavorite);

// Remove a restaurant from favorites
router.delete("/:restaurantId", requireAuth, removeFavorite);

module.exports = router;
