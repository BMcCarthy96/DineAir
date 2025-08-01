import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navigation from "./components/Navigation";
import * as sessionActions from "./store/session";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import LandingPage from "./components/LandingPage";
import AllRestaurantsPage from "./components/AllRestaurantsPage/AllRestaurantsPage";
import RestaurantPage from "./components/RestaurantPage/RestaurantPage";
import RestaurantDetails from "./components/RestaurantDetails/RestaurantDetails";
import MenuItemPage from "./components/MenuItemPage/MenuItemPage";
import CartPage from "./components/CartPage/CartPage";
import CheckoutPage from "./components/CheckoutPage/CheckoutPage";
import OrderHistoryPage from "./components/OrderHistoryPage/OrderHistoryPage";
import AdminRestaurantsPage from "./components/AdminRestaurantsPage/AdminRestaurantsPage";
import OwnerRestaurantsPage from "./components/OwnerRestaurantsPage/OwnerRestaurantsPage";
import CreateRestaurantPage from "./components/CreateRestaurantPage/CreateRestaurantPage";
import EditRestaurantPage from "./components/EditRestaurantPage/EditRestaurantPage";
import DeliveryTrackingPage from "./components/DeliveryTrackingPage/DeliveryTrackingPage";
import RunnerDashboardPage from "./components/RunnerDashboardPage/RunnerDashboardPage";
import FavoritesPage from "./components/FavoritesPage/FavoritesPage";
import AccountPage from "./components/AccountPage/AccountPage";
import { io } from "socket.io-client";
import { notifyGateChange } from "./utils/Notifications";
import "./utils/WebSocket";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Layout() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const sessionUser = useSelector((state) => state.session.user);

    useEffect(() => {
        dispatch(sessionActions.restoreUser()).then(() => {
            setIsLoaded(true);
        });
    }, [dispatch]);

    return (
        <>
            <Navigation isLoaded={isLoaded} />
            {isLoaded && <Outlet context={{ sessionUser }} />}{" "}
            {/* Pass sessionUser to child routes */}
        </>
    );
}

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <LandingPage />,
            },
            {
                path: "/login",
                element: <LoginFormPage />,
            },
            {
                path: "/signup",
                element: <SignupFormPage />,
            },
            {
                path: "/cart",
                element: <CartPage />,
            },
            {
                path: "/checkout",
                element: <CheckoutPage />,
            },
            {
                path: "/orders",
                element: <OrderHistoryPage />,
            },
            {
                path: "/restaurants",
                element: <AllRestaurantsPage />,
            },
            {
                path: "/restaurants/:restaurantId",
                element: <RestaurantPage />,
            },
            {
                path: "/restaurants/:restaurantId/edit",
                element: <EditRestaurantPage />,
            },
            {
                path: "/restaurants/:restaurantId/menu-items",
                element: <RestaurantDetails />,
            },
            {
                path: "/restaurants/:restaurantId/menu-items/:menuItemId",
                element: <MenuItemPage />,
            },
            {
                path: "/restaurants/admin",
                element: <AdminRestaurantsPage />,
            },
            {
                path: "/restaurants/owner",
                element: <OwnerRestaurantsPage />,
            },
            {
                path: "/restaurants/new",
                element: <CreateRestaurantPage />,
            },
            {
                path: "/delivery-tracking",
                element: <DeliveryTrackingPage />,
            },
            {
                path: "/runner-dashboard",
                element: <RunnerDashboardPage />,
            },
            {
                path: "/favorites",
                element: <FavoritesPage />,
            },
            {
                path: "/account",
                element: <AccountPage />,
            },
            {
                path: "*",
                element: <h1>Page Not Found</h1>,
            },
        ],
    },
]);

function App() {
    useEffect(() => {
        const backendUrl =
            import.meta.env.MODE === "production"
                ? undefined // relative, same origin as frontend
                : "http://localhost:8000";

        const socket = io(backendUrl);

        socket.on("gateChange", ({ gate, terminal }) => {
            notifyGateChange(gate, terminal);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <>
            <RouterProvider router={router} />
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
}

export default App;
