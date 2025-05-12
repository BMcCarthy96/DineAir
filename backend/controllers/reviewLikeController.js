const { ReviewLike, Review } = require("../db/models");

// Add a like to a review
exports.addReviewLike = async (req, res, next) => {
    try {
        const { reviewId } = req.body;

        // Check if the review exists
        const review = await Review.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        // Check if the user already liked the review
        const existingLike = await ReviewLike.findOne({
            where: { userId: req.user.id, reviewId },
        });
        if (existingLike) {
            return res.status(400).json({ error: "Review already liked" });
        }

        // Add the like
        const like = await ReviewLike.create({
            userId: req.user.id,
            reviewId,
        });

        res.status(201).json(like);
    } catch (err) {
        next(err);
    }
};

// Remove a like from a review
exports.removeReviewLike = async (req, res, next) => {
    try {
        const { reviewId } = req.params;

        // Check if the like exists
        const like = await ReviewLike.findOne({
            where: { userId: req.user.id, reviewId },
        });
        if (!like) {
            return res.status(404).json({ error: "Like not found" });
        }

        // Remove the like
        await like.destroy();
        res.status(204).end();
    } catch (err) {
        next(err);
    }
};
