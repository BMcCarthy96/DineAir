const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const { addFavorite } = require("../../controllers/favoritesController");

// Route to add a restaurant to favorites
router.post("/", requireAuth, addFavorite);

module.exports = router;
