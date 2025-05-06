const express = require("express");
const router = express.Router();
const { requireAuth, requireRestaurantOwner } = require("../../utils/auth");
const restaurantOwnerController = require("../../controllers/restaurantOwnerController");

// Restaurant Owner: Get all owned restaurants
router.get(
    "/restaurants",
    requireAuth,
    requireRestaurantOwner,
    restaurantOwnerController.getOwnedRestaurants
);

// Restaurant Owner: Update a restaurant they own
router.put(
    "/restaurants/:restaurantId",
    requireAuth,
    requireRestaurantOwner,
    restaurantOwnerController.updateRestaurant
);

module.exports = router;
