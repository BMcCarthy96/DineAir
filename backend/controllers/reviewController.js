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
        const { restaurantId, reviewId } = req.params;
        const { rating, comment } = req.body;

        console.log("Updating review with ID:", reviewId); // Debugging
        console.log("Restaurant ID from request params:", restaurantId); // Debugging

        const review = await Review.findOne({
            where: { id: reviewId, restaurantId },
        });
        console.log("Review found in database:", review); // Debugging

        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        // Allow admins to update any review
        if (req.user.userType !== "admin" && review.userId !== req.user.id) {
            return res.status(403).json({ error: "Forbidden" });
        }

        review.rating = rating;
        review.comment = comment;
        await review.save();

        // Fetch the updated review with the associated User data
        const updatedReview = await Review.findByPk(review.id, {
            include: [{ model: User, attributes: ["id", "username"] }],
        });

        console.log("Updated review with User data:", updatedReview); // Debugging
        res.json(updatedReview);
    } catch (err) {
        console.error("Error updating review:", err); // Debugging
        next(err);
    }
};

exports.deleteReview = async (req, res, next) => {
    try {
        const { restaurantId, reviewId } = req.params;
        console.log("Restaurant ID from request params:", restaurantId); // Debugging
        console.log("Review ID from request params:", reviewId); // Debugging
        console.log("User making the request:", req.user); // Debugging

        const review = await Review.findOne({
            where: { id: reviewId, restaurantId },
        });
        console.log("Review found in database:", review); // Debugging

        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        if (req.user.userType !== "admin" && review.userId !== req.user.id) {
            return res.status(403).json({ error: "Forbidden" });
        }

        await review.destroy();
        console.log("Deleted review with ID:", reviewId); // Debugging
        res.status(204).end();
    } catch (err) {
        console.error("Error deleting review:", err); // Debugging
        next(err);
    }
};
