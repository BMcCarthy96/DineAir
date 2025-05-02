const express = require("express");
const router = express.Router({ mergeParams: true });
const { requireAuth } = require("../../utils/auth");
const reviewController = require("../../controllers/reviewController");

// Get all reviews for a restaurant
router.get("/", reviewController.getRestaurantReviews);

// Create a review for a restaurant
router.post("/", requireAuth, reviewController.createReview);

// Update a review
router.put("/:reviewId", requireAuth, reviewController.updateReview);

// Delete a review
router.delete("/:reviewId", requireAuth, reviewController.deleteReview);

module.exports = router;
