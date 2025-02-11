import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";


function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
        <main className="flex-grow overflow-y-auto pb-20">
      </main>
      
      <Home />

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;
