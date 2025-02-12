import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import RegisterForm from "./components/RegisterForm";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-yellow-50">
      <Header />
      
      <main className="flex-grow overflow-y-auto pb-4">
        <Home />
        <RegisterForm />
      </main>

      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
}

export default App;
