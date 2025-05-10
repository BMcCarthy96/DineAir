import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviewsByRestaurant, createReview, updateReview, deleteReview } from "../../store/reviews";
import "./RestaurantReviews.css";

function RestaurantReviews({ restaurantId }) {
    const dispatch = useDispatch();
    const reviews = useSelector((state) => state.reviews);
    const [error, setError] = useState(null);
    const [editingReview, setEditingReview] = useState(null);
    const [newReview, setNewReview] = useState({ rating: "", comment: "" });

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
            console.log("Editing review:", { ...review, ...editingReview }); // Debugging
            await dispatch(updateReview(restaurantId, { ...review, ...editingReview }));
            setEditingReview(null);
        } catch (err) {
            setError("Failed to edit review. Please try again.");
        }
    };

    const handleDeleteReview = async (reviewId) => {
        console.log("Review ID passed to handleDeleteReview:", reviewId); // Debugging
        if (window.confirm("Are you sure you want to delete this review?")) {
            try {
                console.log("Deleting review with ID:", reviewId); // Debugging
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
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Rating (1-5)"
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                    min="1"
                    max="5"
                />
                <button onClick={handleAddReview} className="add-review-button">
                    Add Review
                </button>
            </div>
            {reviews && Object.values(reviews).length > 0 ? (
                <ul className="review-list">
                    {Object.values(reviews).map((review) => (
                        <li key={review.id} className="review-card">
                            {editingReview?.id === review.id ? (
                                <>
                                    <textarea
                                        value={editingReview.comment}
                                        onChange={(e) =>
                                            setEditingReview({ ...editingReview, comment: e.target.value })
                                        }
                                    />
                                    <input
                                        type="number"
                                        value={editingReview.rating}
                                        onChange={(e) =>
                                            setEditingReview({ ...editingReview, rating: e.target.value })
                                        }
                                        min="1"
                                        max="5"
                                    />
                                    <button
                                        onClick={() => handleEditReview(review)}
                                        className="save-button"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditingReview(null)}
                                        className="cancel-button"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h3>{review.User.username}</h3>
                                    <p className="comment">{review.comment}</p>
                                    <p className="rating">Rating: {review.rating} / 5</p>
                                    <button
                                        onClick={() => setEditingReview(review)}
                                        className="edit-button"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteReview(review.id)}
                                        className="delete-button"
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No reviews available for this restaurant.</p>
            )}
        </div>
    );
}

export default RestaurantReviews;
