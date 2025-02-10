import Home from "./pages/Home";
import Profile from "./pages/Profile";
import AllergyJournal from "./components/AllergyJournal";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/profile", element: <Profile /> },
  { path: "/journal", element: <AllergyJournal /> },
  { path: "/login", element: <LoginForm /> },  // Added login route
  { path: "/register", element: <RegisterForm /> } // Added register route
];

export default routes;
