const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const {
    addReviewLike,
    removeReviewLike,
} = require("../../controllers/reviewLikeController");

// Add a like to a review
router.post("/", requireAuth, addReviewLike);

// Remove a like from a review
router.delete("/:reviewId", requireAuth, removeReviewLike);

module.exports = router;
