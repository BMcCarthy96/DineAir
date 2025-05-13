const { ReviewLike, Review, User } = require("../db/models");

// Add a like to a review
exports.addReviewLike = async (req, res, next) => {
    try {
        const { reviewId } = req.body;
        const userId = req.user.id;

        // Check if the review exists
        const review = await Review.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        // Check if the user already liked the review
        const existingLike = await ReviewLike.findOne({
            where: { userId, reviewId },
        });
        if (existingLike) {
            // Fetch the updated review with likes and user data
            const updatedReview = await Review.findByPk(reviewId, {
                include: [
                    { model: User, attributes: ["id", "username"] },
                    { model: ReviewLike },
                ],
            });
            const likes = updatedReview.ReviewLikes.map((like) => like.userId);
            console.log("Updated review being returned:", updatedReview); // Add this line
            return res.status(200).json({ ...updatedReview.toJSON(), likes });
        }

        // Add the like
        await ReviewLike.create({ userId, reviewId });

        // Fetch the updated review with likes and user data
        const updatedReview = await Review.findByPk(reviewId, {
            include: [
                { model: User, attributes: ["id", "username"] },
                { model: ReviewLike },
            ],
        });
        const likes = updatedReview.ReviewLikes.map((like) => like.userId);
        console.log("Updated review being returned:", updatedReview); // Add this line
        res.status(201).json({ ...updatedReview.toJSON(), likes });
    } catch (err) {
        next(err);
    }
};

// Remove a like from a review
exports.removeReviewLike = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;

        // Check if the review exists
        const review = await Review.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        // Check if the like exists
        const like = await ReviewLike.findOne({
            where: { userId, reviewId },
        });
        if (!like) {
            return res.status(404).json({ error: "Like not found" });
        }

        // Remove the like
        await like.destroy();

        // Fetch the updated review with likes and user data
        const updatedReview = await Review.findByPk(reviewId, {
            include: [
                { model: User, attributes: ["id", "username"] },
                { model: ReviewLike },
            ],
        });
        const likes = updatedReview.ReviewLikes.map((like) => like.userId);

        res.status(200).json({ ...updatedReview.toJSON(), likes });
    } catch (err) {
        next(err);
    }
};
