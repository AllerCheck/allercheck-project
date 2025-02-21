import { Navigate } from "react-router-dom";
import Home from "./pages/Home";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { ProfilePage } from "./pages/Profile";
import DailyJournal from "./pages/DailyJournal";
import Statistics from "./pages/Statistics";
import FindDoctor from "./pages/Find";
import Appointments from "./pages/appointments";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <LoginForm /> },
  { path: "/register", element: <RegisterForm /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/journal", element: <DailyJournal /> },
  { path: "/statistics", element: <Statistics /> },
  { path: "/appointments", element: <Appointments /> },
  { path: "/find", element: <FindDoctor /> },
  { path: "*", element: <Navigate to="/" replace /> } // Redirect unknown routes
];

export default routes;
