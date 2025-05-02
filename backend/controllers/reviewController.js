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

        res.status(201).json(review);
    } catch (err) {
        next(err);
    }
};

exports.updateReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        const review = await Review.findByPk(reviewId);
        if (!review || review.userId !== req.user.id) {
            return res.status(403).json({ error: "Forbidden" });
        }

        review.rating = rating;
        review.comment = comment;
        await review.save();

        res.json(review);
    } catch (err) {
        next(err);
    }
};

exports.deleteReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findByPk(reviewId);
        if (!review || review.userId !== req.user.id) {
            return res.status(403).json({ error: "Forbidden" });
        }

        await review.destroy();
        res.status(204).end();
    } catch (err) {
        next(err);
    }
};
