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
    const response = await csrfFetch(
        `/api/restaurants/${restaurantId}/reviews`
    );
    const data = await response.json();
    dispatch(setReviews(data));
    return data;
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
    const response = await csrfFetch(
        `/api/restaurants/${restaurantId}/reviews/${review.id}`,
        {
            method: "PUT",
            body: JSON.stringify(review),
        }
    );
    const data = await response.json();
    dispatch(updateReviewAction(data));
    return data;
};

export const deleteReview = (restaurantId, reviewId) => async (dispatch) => {
    await csrfFetch(
        `/api/restaurants/${restaurantId}/reviews/${reviewId}`,
        {
            method: "DELETE",
        }
    );
    dispatch(deleteReviewAction(reviewId));
};

export const toggleLike = (reviewId, isLiked) => async (dispatch, getState) => {
    const user = getState().session.user;
    if (!user?.id) return;
    const userId = user.id;

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
            return {
                ...state,
                [review.id]: { ...review, likes: review.likes || [] },
            };
        }
        case UPDATE_REVIEW: {
            const review = action.payload;

            // Ensure the payload is a valid review object
            if (!review.id) {
                return state;
            }

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
                return state;
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
