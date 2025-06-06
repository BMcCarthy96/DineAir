import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import usersReducer from "./users";
import reviewsReducer from "./reviews";
import menuItemsReducer from "./menuItems";
import searchReducer from "./search";
import favoritesReducer from "./favorites";

const rootReducer = combineReducers({
    session: sessionReducer,
    users: usersReducer,
    reviews: reviewsReducer,
    menuItems: menuItemsReducer,
    search: searchReducer,
    favorites: favoritesReducer,
});

let enhancer;
if (import.meta.env.MODE === "production") {
    enhancer = applyMiddleware(thunk);
} else {
    const logger = (await import("redux-logger")).default;
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
