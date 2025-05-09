const { Review, User } = require("../db/models");

exports.getRestaurantReviews = async (req, res, next) => {
    try {
        const { restaurantId } = req.params;
        const reviews = await Review.findAll({
            where: { restaurantId },
            include: [{ model: User, attributes: ["id", "username"] }],
        });
        res.json(reviews);
    } catch (err) {
        next(err);
    }
};

exports.createReview = async (req, res, next) => {
    try {
        const { restaurantId } = req.params;
        const { rating, comment } = req.body;

        const review = await Review.create({
            userId: req.user.id,
            restaurantId,
            rating,
            comment,
        });

        const newReview = await Review.findByPk(review.id, {
            include: [{ model: User, attributes: ["id", "username"] }],
        });

        res.status(201).json(newReview);
    } catch (err) {
        next(err);
    }
};

exports.updateReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        console.log("Updating review with ID:", reviewId); // Debugging
        const review = await Review.findByPk(reviewId);
        if (!review || review.userId !== req.user.id) {
            return res.status(403).json({ error: "Forbidden" });
        }

        review.rating = rating;
        review.comment = comment;
        await review.save();

        console.log("Updated review:", review); // Debugging
        res.json(review);
    } catch (err) {
        console.error("Error updating review:", err); // Debugging
        next(err);
    }
};

exports.deleteReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        console.log("Review ID from request params:", reviewId); // Debugging: Log reviewId
        console.log("User making the request:", req.user); // Debugging: Log user info

        const review = await Review.findByPk(reviewId);
        console.log("Review found in database:", review); // Debugging: Log the review

        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        if (req.user.userType !== "admin" && review.userId !== req.user.id) {
            return res.status(403).json({ error: "Forbidden" });
        }

        await review.destroy();
        res.status(204).end();
    } catch (err) {
        next(err);
    }
};
