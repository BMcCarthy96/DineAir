import { csrfFetch } from "./csrf";

// Action Types
const SET_SEARCH_RESULTS = "search/setSearchResults";

// Action Creators
const setSearchResults = (results) => ({
    type: SET_SEARCH_RESULTS,
    payload: results,
});

// Thunk Action
export const searchRestaurantsAndMenuItems = (query) => async (dispatch) => {
    const response = await csrfFetch(`/api/search?query=${query}`);
    const data = await response.json();
    dispatch(setSearchResults(data));
};

// Reducer
const initialState = { restaurants: [], menuItems: [] };

const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SEARCH_RESULTS:
            return action.payload;
        default:
            return state;
    }
};

export default searchReducer;
