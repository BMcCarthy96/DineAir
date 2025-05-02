// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchReviewsByRestaurant } from "../../store/reviews";
// import "./RestaurantReviews.css";

// function RestaurantReviews({ restaurantId }) {
//     const dispatch = useDispatch();
//     const reviews = useSelector((state) => state.reviews); // Access reviews from Redux store
//     const [error, setError] = useState(null);

//     // Fetch reviews when the component loads
//     useEffect(() => {
//         const handleFetchReviews = async () => {
//             try {
//                 await dispatch(fetchReviewsByRestaurant(restaurantId));
//             } catch (err) {
//                 setError("Failed to load reviews. Please try again.");
//             }
//         };

//         handleFetchReviews();
//     }, [dispatch, restaurantId]);

//     return (
//         <div>
//             <h2>Reviews</h2>
//             {error && <p className="error-message">{error}</p>}
//             {reviews && Object.values(reviews).length > 0 ? (
//                 <ul>
//                     {Object.values(reviews).map((review) => (
//                         <li key={review.id}>
//                             <p><strong>{review.username}</strong>: {review.comment}</p>
//                             <p>Rating: {review.rating}</p>
//                         </li>
//                     ))}
//                 </ul>
//             ) : (
//                 <p>No reviews available for this restaurant.</p>
//             )}
//         </div>
//     );
// }

// export default RestaurantReviews;
