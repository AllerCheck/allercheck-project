import Home from "./pages/Home";
import Profile from "./pages/Profile";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { Navigate } from "react-router-dom";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/profile", element: <Profile /> },
  { path: "/login", element: <LoginForm /> },  // Added login route
  { path: "/register", element: <RegisterForm /> }, // Added register route
  { path: "*", element: <Navigate to="/" /> } // Redirect to home if route not found
];

export default routes;
