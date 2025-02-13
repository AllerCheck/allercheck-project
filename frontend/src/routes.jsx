import Home from "./pages/Home";
import Profile, { ProfilePage } from "./pages/Profile";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { Navigate } from "react-router-dom";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/login", element: <LoginForm /> },  // Added login route
  { path: "/register", element: <RegisterForm /> }, // Added register route
  { path: "*", element: <Navigate to="/" /> } // Redirect to home if route not found
];

export default routes;
