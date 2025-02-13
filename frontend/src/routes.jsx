import Home from "./pages/Home";
import Profile, { ProfilePage } from "./pages/Profile";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/login", element: <LoginForm /> },  // Added login route
  { path: "/register", element: <RegisterForm /> } // Added register route
];

export default routes;
