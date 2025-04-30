import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import LoginFormPage from './components/LoginFormPage';
import SignupFormPage from './components/SignupFormPage';
import LandingPage from './components/LandingPage';


function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      // dispatch(fetchSpots())
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
      // {
      //   path: "/api/spots",
      //   element: <CreateSpot/>
      // },
      // {
      //   path: "api/spots/current",
      //   element: <ManageSpots />
      // },
      // {
      //   path: '/spots/:spotId',
      //   element: <SpotDetails />
      // },
      // {
      //   path: "/api/spots/:spotId/edit",
      //   element: <UpdateSpot/>
      // },
      // {
      //   path: "/api/reviews/current",
      //   element: <ManageReviews />
      // },
      {
        path: '*',
        element: <h1>Page Not Found</h1>
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
