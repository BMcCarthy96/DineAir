import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import LoginFormPage from './components/LoginFormPage';
import SignupFormPage from './components/SignupFormPage';
import LandingPage from './components/LandingPage';
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
import { io } from "socket.io-client";
import { notifyGateChange } from "./utils/Notifications";
import "./utils/WebSocket";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/login',
        element: <LoginFormPage />
      },
      {
        path: '/signup',
        element: <SignupFormPage />
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
        path: "/restaurants/:restaurantId",
        element: <RestaurantPage />,
      },
      {
        path: "/restaurants/:restaurantId/edit",
        element: <EditRestaurantPage /> },
      {
        path: "/restaurants/:restaurantId/menu-items",
        element: <RestaurantDetails />,
      },
      {
        path: "/restaurants/:restaurantId/menu-items/:menuItemId",
        element: <MenuItemPage /> },
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
        element: <CreateRestaurantPage /> },
      {
        path: "/delivery-tracking",
        element: <DeliveryTrackingPage />,
      },
      {
        path: "/runner-dashboard",
        element: <RunnerDashboardPage />,
      },
      {
        path: '*',
        element: <h1>Page Not Found</h1>
      }
    ]
  }
]);

function App() {
    useEffect(() => {
        const socket = io("http://localhost:8000");

        socket.on("gateChange", ({ gate, terminal }) => {
            notifyGateChange(gate, terminal);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
      <>
        <RouterProvider router={router} />;
        <ToastContainer />
      </>
    )
}

export default App;
