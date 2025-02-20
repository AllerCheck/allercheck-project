import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { ProfilePage } from "./pages/Profile";
import DailyJournal from "./pages/DailyJournal";
import Statistics from "./pages/Statistics";
import FindDoctor from "./pages/Find";
import AppointmentPage from "./pages/appointments";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white-50">
      <Header />

      <main className="flex-grow overflow-y-auto pb-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/journal" element={<DailyJournal />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/appointments" element={<AppointmentPage />} />
          <Route path="/find" element={<FindDoctor />} />
        </Routes>
      </main>

      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
}

export default App;
