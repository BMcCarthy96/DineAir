import { csrfFetch } from "./csrf";

// Action Types
const SET_USER = "users/setUser";
const REMOVE_USER = "users/removeUser";

// Action Creators
const setUser = (user) => ({
    type: SET_USER,
    payload: user,
});

const removeUser = () => ({
    type: REMOVE_USER,
});

// Thunk Actions
export const fetchUserById = (userId) => async (dispatch) => {
    const response = await csrfFetch(`/api/users/${userId}`);
    const data = await response.json();
    dispatch(setUser(data));
    return data;
};

export const updateUser = (user) => async (dispatch) => {
    const response = await csrfFetch(`/api/users/${user.id}`, {
        method: "PUT",
        body: JSON.stringify(user),
    });
    const data = await response.json();
    dispatch(setUser(data));
    return data;
};

export const deleteUser = (userId) => async (dispatch) => {
    const response = await csrfFetch(`/api/users/${userId}`, {
        method: "DELETE",
    });
    if (response.ok) {
        dispatch(removeUser());
    }
    return response;
};

// Initial State
const initialState = {};

// Reducer
const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER: {
            const user = action.payload;
            return { ...state, [user.id]: user };
        }
        case REMOVE_USER: {
            const newState = { ...state };
            delete newState[action.payload];
            return newState;
        }
        default:
            return state;
    }
};

export default usersReducer;
