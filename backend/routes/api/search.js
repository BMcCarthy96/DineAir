const express = require("express");
const router = express.Router();
const searchController = require("../../controllers/searchController");

// Search restaurants or menu items
router.get("/", searchController.search);

module.exports = router;
