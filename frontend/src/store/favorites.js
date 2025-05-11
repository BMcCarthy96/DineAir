// Action Types
const ADD_FAVORITE = "favorites/ADD_FAVORITE";
const REMOVE_FAVORITE = "favorites/REMOVE_FAVORITE";

// Action Creators
export const addFavorite = (restaurant) => ({
    type: ADD_FAVORITE,
    restaurant,
});

export const removeFavorite = (restaurantId) => ({
    type: REMOVE_FAVORITE,
    restaurantId,
});

// Reducer
const initialState = [];

export default function favoritesReducer(state = initialState, action) {
    switch (action.type) {
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
