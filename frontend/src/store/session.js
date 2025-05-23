import { csrfFetch } from "./csrf";
import { setFavorites } from "./favorites";

// action creators
const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

export const setUser = (user) => {
    return {
        type: SET_USER,
        payload: user,
    };
};

export const removeUser = () => {
    return {
        type: REMOVE_USER,
    };
};

export const updateUser = (user) => async (dispatch) => {
    dispatch(setUser(user));
};

// signup
export const signup = (user) => async (dispatch) => {
    const { username, firstName, lastName, email, password, userType } = user;
    const response = await csrfFetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
            username,
            firstName,
            lastName,
            email,
            password,
            userType,
        }),
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

// login
export const login = (user) => async (dispatch) => {
    const { credential, password } = user;
    const response = await csrfFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
            credential,
            password,
        }),
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(setUser(data.user));
        return response;
    } else {
        throw new Error("Login failed");
    }
};

// logout
export const logout = () => async (dispatch) => {
    const response = await csrfFetch("/api/auth/logout", {
        method: "DELETE",
    });

    if (response.ok) {
        dispatch(removeUser());
        dispatch(setFavorites([]));
    }
};

// restore session user thunk action
export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/auth/session");
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

// initial state
const initialState = { user: null };

// session reducer
const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload };
        case REMOVE_USER:
            return { ...state, user: null };
        default:
            return state;
    }
};

export default sessionReducer;
