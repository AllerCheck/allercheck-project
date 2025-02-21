import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import routes from "./routes"; // Import routes array

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white-50">
      <Header />

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
