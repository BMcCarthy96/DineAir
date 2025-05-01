const express = require("express");
const router = express.Router();
const {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
} = require("../../controllers/restaurantController");
const { requireAuth } = require("../../utils/auth");

router.get("/", getAllRestaurants);
router.get("/:id", getRestaurantById);
router.post("/", requireAuth, createRestaurant);
router.put("/:id", requireAuth, updateRestaurant);
router.delete("/:id", requireAuth, deleteRestaurant);

module.exports = router;
