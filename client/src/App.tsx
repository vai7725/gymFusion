import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomeLayout from './Layout/HomeLayout';
import AuthLayout from './Layout/AuthLayout';
import OrderPage from './pages/Dashboard/OrderPage';
import ErrorPage from './pages/ErrorPage';
import LandingPage from './pages/LandingPage/LandingPage.tsx';
import DashboardLayout from './Layout/DashboardLayout.tsx';
import HomePage from './pages/Dashboard/HomePage.tsx';

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
      { path: 'home', element: <HomePage /> },
      { path: 'order', element: <OrderPage /> },
      { path: 'diet-food-plan', element: <OrderPage /> },
      { path: 'workout-plan', element: <OrderPage /> },
      { path: 'attendance', element: <OrderPage /> },
      { path: 'trainers', element: <OrderPage /> },
      { path: 'subscription', element: <OrderPage /> },
      { path: 'personal-record', element: <OrderPage /> },
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
