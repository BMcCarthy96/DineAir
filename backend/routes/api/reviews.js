const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const reviewController = require("../../controllers/reviewController");

// Get all reviews for a restaurant
router.get("/restaurant/:restaurantId", reviewController.getRestaurantReviews);

// Create a review
router.post("/", requireAuth, reviewController.createReview);

// Update a review
router.put("/:reviewId", requireAuth, reviewController.updateReview);

// Delete a review
router.delete("/:reviewId", requireAuth, reviewController.deleteReview);

module.exports = router;
