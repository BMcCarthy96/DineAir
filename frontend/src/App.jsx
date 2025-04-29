import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginFormPage from './components/LoginFormPage';
import SignupFormPage from './components/SignupFormPage';


const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>Welcome!</h1>
  },
  {
    path: '/login',
    element: <LoginFormPage />
  },
  {
    path: '/signup',
    element: <SignupFormPage />
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
