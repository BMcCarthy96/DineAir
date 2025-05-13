import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchReviewsByRestaurant,
    createReview,
    updateReview,
    deleteReview,
    toggleLike,
} from "../../store/reviews";
import "./RestaurantReviews.css";

function RestaurantReviews({ restaurantId }) {
    const dispatch = useDispatch();
    const reviews = useSelector((state) => state.reviews);
    const [error, setError] = useState(null);
    const [editingReview, setEditingReview] = useState(null);
    const [newReview, setNewReview] = useState({ rating: "", comment: "" });
    const userId = useSelector((state) => state.session.user.id);

    // Debugging log to check the reviews state
    useEffect(() => {
        console.log("Reviews state in component:", reviews);
        Object.values(reviews).forEach((review) => {
            console.log(
                `Review ID: ${review.id}, Likes: ${review.likes?.length || 0}`
            );
        });
    }, [reviews]);

    const handleToggleLike = (review) => {
        const isLiked = review.likes?.includes(userId);
        dispatch(toggleLike(review.id, isLiked));
    };

    useEffect(() => {
        const handleFetchReviews = async () => {
            try {
                await dispatch(fetchReviewsByRestaurant(restaurantId));
            } catch (err) {
                setError("Failed to load reviews. Please try again.");
            }
        };

        handleFetchReviews();
    }, [dispatch, restaurantId]);

    const handleAddReview = async () => {
        try {
            await dispatch(createReview(restaurantId, newReview));
            setNewReview({ rating: "", comment: "" });
        } catch (err) {
            setError("Failed to add review. Please try again.");
        }
    };

    const handleEditReview = async (review) => {
        try {
            await dispatch(
                updateReview(restaurantId, { ...review, ...editingReview })
            );
            setEditingReview(null);
        } catch (err) {
            setError("Failed to edit review. Please try again.");
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            try {
                await dispatch(deleteReview(restaurantId, reviewId));
            } catch (err) {
                setError("Failed to delete review. Please try again.");
            }
        }
    };

    return (
        <div className="restaurant-reviews">
            <h2>Customer Reviews</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="add-review">
                <textarea
                    placeholder="Write your review..."
                    value={newReview.comment}
                    onChange={(e) =>
                        setNewReview({ ...newReview, comment: e.target.value })
                    }
                />
                <input
                    type="number"
                    placeholder="Rating (1-5)"
                    value={newReview.rating}
                    onChange={(e) =>
                        setNewReview({ ...newReview, rating: e.target.value })
                    }
                    min="1"
                    max="5"
                />
                <button onClick={handleAddReview} className="add-review-button">
                    Add Review
                </button>
            </div>
            {reviews && Object.values(reviews).length > 0 ? (
                <ul className="review-list">
                    {Object.values(reviews).map((review, index) => {
                        console.log(
                            `Rendering Review ID: ${review.id}, Likes: ${
                                review.likes?.length || 0
                            }`
                        );
                        const isLiked = review.likes?.includes(userId);
                        return (
                            <li
                                key={`${review.id}-${index}`}
                                className="review-card"
                            >
                                <h3>
                                    {review.User?.username || "Unknown User"}
                                </h3>
                                <p className="comment">{review.comment}</p>
                                <p className="rating">
                                    Rating: {review.rating} / 5
                                </p>
                                <div className="like-section">
                                    <span className="like-count">
                                        {review.likes?.length || 0} Likes
                                    </span>
                                    <button
                                        onClick={() => handleToggleLike(review)}
                                        className={`like-button ${
                                            isLiked ? "liked" : ""
                                        }`}
                                    >
                                        👍 {isLiked ? "Liked" : "Like"}
                                    </button>
                                </div>
                                {editingReview?.id === review.id ? (
                                    <>
                                        <textarea
                                            value={editingReview?.comment || ""}
                                            onChange={(e) =>
                                                setEditingReview({
                                                    ...editingReview,
                                                    comment: e.target.value,
                                                })
                                            }
                                        />
                                        <input
                                            type="number"
                                            value={editingReview?.rating || ""}
                                            onChange={(e) =>
                                                setEditingReview({
                                                    ...editingReview,
                                                    rating: e.target.value,
                                                })
                                            }
                                            min="1"
                                            max="5"
                                        />
                                        <button
                                            onClick={() =>
                                                handleEditReview(review)
                                            }
                                            className="save-button"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() =>
                                                setEditingReview(null)
                                            }
                                            className="cancel-button"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <div className="review-actions">
                                        <button
                                            onClick={() =>
                                                setEditingReview({
                                                    id: review.id,
                                                    comment:
                                                        review.comment || "",
                                                    rating: review.rating || 1,
                                                })
                                            }
                                            className="edit-button"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteReview(review.id)
                                            }
                                            className="delete-button"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p>No reviews available for this restaurant.</p>
            )}
        </div>
    );
}

export default RestaurantReviews;
