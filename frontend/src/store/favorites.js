import { apiFetch } from "../utils/apiFetch";

// Action Types
const ADD_FAVORITE = "favorites/ADD_FAVORITE";
const REMOVE_FAVORITE = "favorites/REMOVE_FAVORITE";
const SET_FAVORITES = "favorites/SET_FAVORITES";

// Action Creators
export const addFavorite = (restaurant) => ({
    type: ADD_FAVORITE,
    restaurant,
});

export const removeFavorite = (restaurantId) => ({
    type: REMOVE_FAVORITE,
    restaurantId,
});

export const setFavorites = (favorites) => ({
    type: SET_FAVORITES,
    favorites,
});

// Thunk to load the current user's favorites (called after login/signup/session restore)
export const fetchFavorites = () => async (dispatch) => {
    const res = await apiFetch("/api/favorites");
    if (res.ok) {
        const data = await res.json();
        dispatch(setFavorites(data));
    }
};

// Thunk to persist adding a favorite
export const favoriteRestaurant = (restaurant) => async (dispatch) => {
    dispatch(addFavorite(restaurant));
    const res = await apiFetch("/api/favorites", {
        method: "POST",
        body: JSON.stringify({ restaurantId: restaurant.id }),
    });
    if (!res.ok) {
        // Roll back on failure (e.g. already favorited, network error)
        dispatch(removeFavorite(restaurant.id));
    }
};

// Thunk to persist removing a favorite
export const unfavoriteRestaurant = (restaurantId) => async (dispatch, getState) => {
    const previous = getState().favorites.find((f) => f.id === restaurantId);
    dispatch(removeFavorite(restaurantId));
    const res = await apiFetch(`/api/favorites/${restaurantId}`, {
        method: "DELETE",
    });
    if (!res.ok && previous) {
        // Roll back on failure
        dispatch(addFavorite(previous));
    }
};

// Reducer
const initialState = [];

export default function favoritesReducer(state = initialState, action) {
    switch (action.type) {
        case SET_FAVORITES:
            return action.favorites;
        case ADD_FAVORITE:
            if (state.some((fav) => fav.id === action.restaurant.id)) {
                return state;
            }
            return [...state, action.restaurant];
        case REMOVE_FAVORITE:
            return state.filter((fav) => fav.id !== action.restaurantId);
        default:
            return state;
    }
}
