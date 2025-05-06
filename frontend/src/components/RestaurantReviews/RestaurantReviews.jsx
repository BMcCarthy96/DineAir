import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviewsByRestaurant } from "../../store/reviews";
import "./RestaurantReviews.css";

function RestaurantReviews({ restaurantId }) {
    const dispatch = useDispatch();
    const reviews = useSelector((state) => state.reviews); // Access reviews from Redux store
    const [error, setError] = useState(null);

    // Fetch reviews when the component loads
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

    return (
        <div className="restaurant-reviews">
            <h2>Customer Reviews</h2>
            {error && <p className="error-message">{error}</p>}
            {reviews && Object.values(reviews).length > 0 ? (
                <ul className="review-list">
                    {Object.values(reviews).map((review) => (
                        <li key={review.id} className="review-card">
                            <h3>{review.User.username}</h3>
                            <p className="comment">{review.comment}</p>
                            <p className="rating">Rating: {review.rating} / 5</p>
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
