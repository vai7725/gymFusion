import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardLayout from "./Layout/DashboardLayout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import LandingPage from "./pages/LandingPage/LandingPage";
import HomeLayout from "./Layout/HomeLayout";
import AuthLayout from "./Layout/AuthLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [{ path: "", element: <LandingPage /> }],
  },
  {
    path: "/dashboard/",
    element: <DashboardLayout />,
    children: [{ path: "dashboard", element: <DashboardPage /> }],
  },
  {
    path: "/auth/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
