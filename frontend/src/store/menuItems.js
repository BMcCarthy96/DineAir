import { csrfFetch } from "./csrf";

// Action Types
const SET_MENU_ITEMS = "menuItems/setMenuItems";
const ADD_MENU_ITEM = "menuItems/addMenuItem";
const UPDATE_MENU_ITEM = "menuItems/updateMenuItem";
const DELETE_MENU_ITEM = "menuItems/deleteMenuItem";

// Action Creators
const setMenuItems = (menuItems) => ({
    type: SET_MENU_ITEMS,
    payload: menuItems,
});

const addMenuItem = (menuItem) => ({
    type: ADD_MENU_ITEM,
    payload: menuItem,
});

const updateMenuItemAction = (menuItem) => ({
    type: UPDATE_MENU_ITEM,
    payload: menuItem,
});

const deleteMenuItemAction = (menuItemId) => ({
    type: DELETE_MENU_ITEM,
    payload: menuItemId,
});

// Thunk Actions
export const fetchMenuItemsByRestaurant =
    (restaurantId, page = 1, size = 10) =>
    async (dispatch) => {
        try {
            const response = await csrfFetch(
                `/api/restaurants/${restaurantId}/menu-items?page=${page}&size=${size}`
            );
            const data = await response.json();
            dispatch(setMenuItems(data.items));
            return data;
        } catch (err) {
            console.error("Failed to fetch menu items:", err);
            throw err;
        }
    };

export const createMenuItem = (restaurantId, menuItem) => async (dispatch) => {
    const response = await csrfFetch(
        `/api/restaurants/${restaurantId}/menu-items`,
        {
            method: "POST",
            body: JSON.stringify(menuItem),
        }
    );
    const data = await response.json();
    dispatch(addMenuItem(data));
    return data;
};

export const updateMenuItem = (menuItem) => async (dispatch) => {
    const response = await csrfFetch(`/api/menu-items/${menuItem.id}`, {
        method: "PUT",
        body: JSON.stringify(menuItem),
    });
    const data = await response.json();
    dispatch(updateMenuItemAction(data));
    return data;
};

export const deleteMenuItem = (menuItemId) => async (dispatch) => {
    await csrfFetch(`/api/menu-items/${menuItemId}`, {
        method: "DELETE",
    });
    dispatch(deleteMenuItemAction(menuItemId));
};

// Reducer
const initialState = {};

const menuItemsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_MENU_ITEMS: {
            const menuItems = action.payload;
            return { ...state, ...menuItems };
        }
        case ADD_MENU_ITEM: {
            const menuItem = action.payload;
            return { ...state, [menuItem.id]: menuItem };
        }
        case UPDATE_MENU_ITEM: {
            const menuItem = action.payload;
            return { ...state, [menuItem.id]: menuItem };
        }
        case DELETE_MENU_ITEM: {
            const newState = { ...state };
            delete newState[action.payload];
            return newState;
        }
        default:
            return state;
    }
};

export default menuItemsReducer;
