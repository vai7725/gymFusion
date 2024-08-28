import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage/LandingPage';
import HomeLayout from './Layout/HomeLayout';
import AuthLayout from './Layout/AuthLayout';
import OrderPage from './pages/Dashboard/OrderPage';
import DashboardLayout from './Layout/DashboardLayout';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ErrorPage from './pages/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage />,
    element: <HomeLayout />,
    children: [{ path: '', element: <LandingPage /> }],
  },
  {
    path: '/dashboard/',
    errorElement: <ErrorPage />,
    element: <DashboardLayout />,
    children: [
      { path: '', element: <DashboardPage /> },
      { path: 'order', element: <OrderPage /> },
    ],
  },
  {
    path: '/auth/',
    errorElement: <ErrorPage />,
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
