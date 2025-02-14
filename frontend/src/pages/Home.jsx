import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import HomeButtons from "../components/HomeButtons";

function Home() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    const isAuthenticated = localStorage.getItem("token"); // Check user authentication
    console.log("isAuthenticated", isAuthenticated);
    if (isAuthenticated) {
      navigate(path); // Go to the requested page if authenticated
    } else {
      navigate("/login"); // Redirect to login if not authenticated
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-center font-bold text-4xl mt-6 mb-6">
        Welcome to AllerCheck
      </h1>

      {/* Flexbox layout for Articles and Wetter */}
      <div className="flex justify-center gap-x-6 p-4 min-h-96 ml-2 mr-2">
        <div className="bg-teal-50 p-6 text-xl font-bold rounded-2xl w-3/4 md:w-2/3">
          Articles
        </div>
        <div className="bg-green-100 p-6 text-xl font-bold rounded-2xl w-1/2 md:w-1/3">
          Wetter
        </div>
      </div>

     <HomeButtons/>

      {/* Commercial Ads section */}
      <div className="flex justify-center mt-28 text-4xl">
        <h2>Commercial Ads for future use</h2>
      </div>
    </div>
  );
}

export default Home;
