import { Routes, Route } from "react-router-dom";
import routes from "./routes";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Location from "./components/Location";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div>
        <Location />
      </div>

      <main className="flex-grow overflow-y-auto pb-20">
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;
