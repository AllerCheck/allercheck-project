import { Navigate } from "react-router-dom";
import Home from "./pages/Home";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { ProfilePage } from "./pages/Profile";
import DailyJournal from "./pages/DailyJournal";
import Statistics from "./pages/Statistics";
import FindDoctor from "./pages/Find";
import Appointments from "./pages/appointments";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute

const routes = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <LoginForm /> },
  { path: "/register", element: <RegisterForm /> },
  { path: "/profile", element: <ProtectedRoute element={<ProfilePage />} /> },
  { path: "/journal", element: <ProtectedRoute element={<DailyJournal />} /> },
  { path: "/statistics", element: <ProtectedRoute element={<Statistics />} /> },
  { path: "/appointments", element: <ProtectedRoute element={<Appointments />} /> },
  { path: "/find", element: <ProtectedRoute element={<FindDoctor />} /> },
  { path: "*", element: <Navigate to="/" replace /> }
];

export default routes;
