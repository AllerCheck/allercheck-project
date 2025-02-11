import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Main content should grow to fill space, without scrolling */}
      <main className="flex-grow overflow-y-auto pb-4">
        <Home />
      </main>

      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
}

export default App;
