const express = require("express");
const router = express.Router();
const { requireAuth, requireAdmin } = require("../../utils/auth");
const adminController = require("../../controllers/adminController");

// Admin: Get all users
router.get("/users", requireAuth, requireAdmin, adminController.getAllUsers);

// Admin: Delete a user
router.delete(
    "/users/:userId",
    requireAuth,
    requireAdmin,
    adminController.deleteUser
);

// Admin: Get all restaurants
router.get(
    "/restaurants",
    requireAuth,
    requireAdmin,
    adminController.getAllRestaurants
);

// Admin: Create a new restaurant
router.post(
    "/restaurants",
    requireAuth,
    requireAdmin,
    adminController.createRestaurant
);

// Admin: Update any restaurant
router.put(
    "/restaurants/:restaurantId",
    requireAuth,
    requireAdmin,
    adminController.updateRestaurant
);

// Admin: Delete any restaurant
router.delete(
    "/restaurants/:restaurantId",
    requireAuth,
    requireAdmin,
    adminController.deleteRestaurant
);

module.exports = router;
