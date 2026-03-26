import { useState, useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navigation from "./components/Navigation";
import PageLoader from "./components/PageLoader";
import * as sessionActions from "./store/session";
import { io } from "socket.io-client";
import { notifyGateChange } from "./utils/Notifications";
import "./utils/WebSocket";
import ThemedToastContainer from "./components/ThemedToastContainer";
import "react-toastify/dist/ReactToastify.css";

const LandingPage = lazy(() => import("./components/LandingPage"));
const LoginFormPage = lazy(() => import("./components/LoginFormPage"));
const SignupFormPage = lazy(() => import("./components/SignupFormPage"));
const AllRestaurantsPage = lazy(() =>
    import("./components/AllRestaurantsPage/AllRestaurantsPage")
);
const RestaurantPage = lazy(() =>
    import("./components/RestaurantPage/RestaurantPage")
);
const RestaurantDetails = lazy(() =>
    import("./components/RestaurantDetails")
);
const MenuItemPage = lazy(() => import("./components/MenuItemPage"));
const CartPage = lazy(() => import("./components/CartPage/CartPage"));
const CheckoutPage = lazy(() =>
    import("./components/CheckoutPage/CheckoutPage")
);
const OrderHistoryPage = lazy(() =>
    import("./components/OrderHistoryPage/OrderHistoryPage")
);
const AdminRestaurantsPage = lazy(() =>
    import("./components/AdminRestaurantsPage/AdminRestaurantsPage")
);
const OwnerRestaurantsPage = lazy(() =>
    import("./components/OwnerRestaurantsPage/OwnerRestaurantsPage")
);
const CreateRestaurantPage = lazy(() =>
    import("./components/CreateRestaurantPage/CreateRestaurantPage")
);
const EditRestaurantPage = lazy(() =>
    import("./components/EditRestaurantPage/EditRestaurantPage")
);
const DeliveryTrackingPage = lazy(() =>
    import("./components/DeliveryTrackingPage/DeliveryTrackingPage")
);
const RunnerDashboardPage = lazy(() =>
    import("./components/RunnerDashboardPage/RunnerDashboardPage")
);
const FavoritesPage = lazy(() => import("./components/FavoritesPage/FavoritesPage"));
const AccountPage = lazy(() => import("./components/AccountPage/AccountPage"));
const NotFoundPage = lazy(() =>
    import("./components/NotFoundPage/NotFoundPage.jsx")
);

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
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[2000] focus:rounded-xl focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-slate-900 focus:shadow-soft-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:bg-slate-900 dark:focus:text-white"
            >
                Skip to main content
            </a>
            <Navigation />
            {isLoaded && (
                <Suspense fallback={<PageLoader />}>
                    <main
                        id="main-content"
                        className="outline-none"
                        tabIndex={-1}
                    >
                        <Outlet context={{ sessionUser }} />
                    </main>
                </Suspense>
            )}
            {!isLoaded && <PageLoader />}
        </>
    );
}

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: "/", element: <LandingPage /> },
            { path: "/login", element: <LoginFormPage /> },
            { path: "/signup", element: <SignupFormPage /> },
            { path: "/cart", element: <CartPage /> },
            { path: "/checkout", element: <CheckoutPage /> },
            { path: "/orders", element: <OrderHistoryPage /> },
            { path: "/restaurants", element: <AllRestaurantsPage /> },
            { path: "/restaurants/:restaurantId", element: <RestaurantPage /> },
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
            { path: "/restaurants/admin", element: <AdminRestaurantsPage /> },
            { path: "/restaurants/owner", element: <OwnerRestaurantsPage /> },
            { path: "/restaurants/new", element: <CreateRestaurantPage /> },
            {
                path: "/delivery-tracking",
                element: <DeliveryTrackingPage />,
            },
            {
                path: "/runner-dashboard",
                element: <RunnerDashboardPage />,
            },
            { path: "/favorites", element: <FavoritesPage /> },
            { path: "/account", element: <AccountPage /> },
            { path: "*", element: <NotFoundPage /> },
        ],
    },
]);

function App() {
    useEffect(() => {
        const backendUrl =
            import.meta.env.MODE === "production"
                ? undefined
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
            <ThemedToastContainer />
        </>
    );
}

export default App;
