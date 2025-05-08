const express = require("express");
const router = express.Router();
const {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
} = require("../../controllers/restaurantController");
const {
    requireAuth,
    requireAdminOrRestaurantOwner,
} = require("../../utils/auth");

// Allow all users to view restaurants
router.get("/", getAllRestaurants);
router.get("/:id", getRestaurantById);

// Allow admins and restaurant owners to create restaurants
router.post("/", requireAuth, requireAdminOrRestaurantOwner, createRestaurant);

// Allow only restaurant owners to update their own restaurants
router.put(
    "/:id",
    requireAuth,
    requireAdminOrRestaurantOwner,
    updateRestaurant
);

// Allow admins and restaurant owners to delete restaurants
router.delete(
    "/:id",
    requireAuth,
    requireAdminOrRestaurantOwner,
    deleteRestaurant
);

module.exports = router;
