import { csrfFetch } from "./csrf";

// Action Types
const SET_REVIEWS = "reviews/setReviews";
const ADD_REVIEW = "reviews/addReview";
const UPDATE_REVIEW = "reviews/updateReview";
const DELETE_REVIEW = "reviews/deleteReview";

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

// Thunk Actions
export const fetchReviewsByRestaurant = (restaurantId) => async (dispatch) => {
    try {
        const response = await csrfFetch(
            `/api/restaurants/${restaurantId}/reviews`
        );
        const data = await response.json();
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

// Reducer
const initialState = {};

const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_REVIEWS: {
            const reviews = action.payload;
            return { ...state, ...reviews };
        }
        case ADD_REVIEW: {
            const review = action.payload;
            return { ...state, [review.id]: review };
        }
        case UPDATE_REVIEW: {
            const review = action.payload;
            return { ...state, [review.id]: review };
        }
        case DELETE_REVIEW: {
            const newState = { ...state };
            delete newState[action.payload];
            return newState;
        }
        default:
            return state;
    }
};

export default reviewsReducer;
