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

// Thunk to fetch favorites for the current user
export const fetchFavorites = () => async (dispatch) => {
    const res = await fetch("/api/favorites");
    if (res.ok) {
        const data = await res.json();
        dispatch(setFavorites(data));
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
