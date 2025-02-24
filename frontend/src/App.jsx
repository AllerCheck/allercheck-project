import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HeaderWithNav from "./components/HeaderWithNav";
import Footer from "./components/Footer";
import routes from "./routes"; // Import routes array
import useAuthStore from "./store/useAuthStore"; // Import Zustand store

function App() {
  const { token } = useAuthStore(); // Check if user is logged in

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
      {/* Show HeaderWithNav if logged in, otherwise show Header */}
      {token ? <HeaderWithNav /> : <Header />}

      <main className="flex-grow overflow-y-auto pb-4">
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </main>

      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
}

export default App;
