import { csrfFetch } from "./csrf";

// Action Types
const SET_REVIEWS = "reviews/setReviews";
const ADD_REVIEW = "reviews/addReview";
const UPDATE_REVIEW = "reviews/updateReview";
const DELETE_REVIEW = "reviews/deleteReview";
const TOGGLE_LIKE = "reviews/toggleLike";

// Action Creators
const setReviews = (reviews) => ({
    type: SET_REVIEWS,
    payload: reviews,
});

const addReview = (review) => ({
    type: ADD_REVIEW,
    payload: review,
});

const updateReviewAction = (review) => ({
    type: UPDATE_REVIEW,
    payload: review,
});

const deleteReviewAction = (reviewId) => ({
    type: DELETE_REVIEW,
    payload: reviewId,
});

const toggleLikeAction = (reviewId, userId) => ({
    type: TOGGLE_LIKE,
    payload: { reviewId, userId },
});

// Thunk Actions
export const fetchReviewsByRestaurant = (restaurantId) => async (dispatch) => {
    try {
        const response = await csrfFetch(
            `/api/restaurants/${restaurantId}/reviews`
        );
        const data = await response.json();

        // Ensure the reviews include the likes array
        console.log("Fetched reviews with likes:", data); // Debugging
        dispatch(setReviews(data));
        return data;
    } catch (err) {
        console.error("Failed to fetch reviews:", err);
        throw err;
    }
};

export const createReview = (restaurantId, review) => async (dispatch) => {
    const response = await csrfFetch(
        `/api/restaurants/${restaurantId}/reviews`,
        {
            method: "POST",
            body: JSON.stringify(review),
        }
    );
    const data = await response.json();
    dispatch(addReview(data));
    return data;
};

export const updateReview = (restaurantId, review) => async (dispatch) => {
    try {
        console.log("Sending update request for review:", review); // Debugging
        const response = await csrfFetch(
            `/api/restaurants/${restaurantId}/reviews/${review.id}`,
            {
                method: "PUT",
                body: JSON.stringify(review),
            }
        );
        const data = await response.json();
        console.log("Updated review response:", data); // Debugging
        dispatch(updateReviewAction(data));
        return data;
    } catch (err) {
        console.error("Failed to update review:", err); // Debugging
        throw err;
    }
};

export const deleteReview = (restaurantId, reviewId) => async (dispatch) => {
    try {
        console.log("Sending delete request for review ID:", reviewId); // Debugging
        await csrfFetch(
            `/api/restaurants/${restaurantId}/reviews/${reviewId}`,
            {
                method: "DELETE",
            }
        );
        console.log("Successfully deleted review with ID:", reviewId); // Debugging
        dispatch(deleteReviewAction(reviewId));
    } catch (err) {
        console.error("Failed to delete review:", err); // Debugging
        throw err;
    }
};

export const toggleLike = (reviewId, isLiked) => async (dispatch, getState) => {
    const userId = getState().session.user.id;

    // Debugging log to check the reviewId and userId
    console.log(`Toggling like for review ID: ${reviewId}, User ID: ${userId}`);

    dispatch(toggleLikeAction(reviewId, userId));

    try {
        if (isLiked) {
            // Unlike the review
            await csrfFetch(`/api/reviewLikes/${reviewId}`, {
                method: "DELETE",
            });
        } else {
            // Like the review
            await csrfFetch(`/api/reviewLikes`, {
                method: "POST",
                body: JSON.stringify({ reviewId }),
            });
        }
    } catch (err) {
        console.error("Failed to toggle like:", err);

        dispatch(toggleLikeAction(reviewId, userId));
        throw err;
    }
};

// Reducer
const initialState = {};

const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_REVIEWS: {
            const reviews = action.payload;
            const reviewsById = {};
            reviews.forEach((review) => {
                reviewsById[review.id] = review;
            });

            return reviewsById;
        }
        case ADD_REVIEW: {
            const review = action.payload;
            return { ...state, [review.id]: review };
        }
        case UPDATE_REVIEW: {
            const review = action.payload;

            // Ensure the payload is a valid review object
            if (!review.id) {
                console.error("Invalid review payload:", review);
                return state;
            }

            console.log("Updating review in reducer:", review);

            // Update the existing review in the state
            return {
                ...state,
                [review.id]: {
                    ...state[review.id],
                    ...review,
                },
            };
        }
        case DELETE_REVIEW: {
            const newState = { ...state };
            delete newState[action.payload];
            return newState;
        }
        case TOGGLE_LIKE: {
            const { reviewId, userId } = action.payload;
            const review = state[reviewId];

            // Check if the review exists
            if (!review) {
                console.error(`Review with ID ${reviewId} not found in state.`);
                return state; // Return the current state if the review does not exist
            }

            // Toggle the like state
            const isLiked = review.likes?.includes(userId);
            const updatedLikes = isLiked
                ? review.likes.filter((id) => id !== userId)
                : [...(review.likes || []), userId];

            return {
                ...state,
                [reviewId]: {
                    ...review,
                    likes: updatedLikes,
                },
            };
        }
        default:
            return state;
    }
};

export default reviewsReducer;
