const { Review, User, Restaurant } = require("../db/models");

module.exports = {
    async getRestaurantReviews(req, res, next) {
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
    },

    async createReview(req, res, next) {
        try {
            const { restaurantId, rating, comment } = req.body;
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
    },

    async updateReview(req, res, next) {
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
    },

    async deleteReview(req, res, next) {
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
    },
};
