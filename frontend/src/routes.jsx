import Home from "./pages/Home";
import Profile from "./pages/Profile";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import FindPage from "./pages/FindPage";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/profile", element: <Profile /> },
  { path: "/login", element: <LoginForm /> },  // Added login route
  { path: "/register", element: <RegisterForm /> }, // Added register route
  { path: "/findpage", element: <FindPage /> }
];

export default routes;
