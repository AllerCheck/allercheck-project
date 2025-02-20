// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPollenData } from "../api/PollenApi";  // Import the API function
import HomeButtons from "../components/HomeButtons";

function Home() {
  const navigate = useNavigate();
  const [pollenData, setPollenData] = useState(null);  // State for pollen data
  const [location, setLocation] = useState("Berlin");  // Default location, you can modify this
  
  const handleNavigation = (path) => {
    const isAuthenticated = localStorage.getItem("token"); // Check user authentication
    console.log("isAuthenticated", isAuthenticated);
    if (isAuthenticated) {
      navigate(path); // Go to the requested page if authenticated
    } else {
      navigate("/login"); // Redirect to login if not authenticated
    }
  };

  // Fetch pollen data when the component mounts or location changes
  useEffect(() => {
    const getPollenData = async () => {
      try {
        const data = await fetchPollenData(location);
        setPollenData(data);
      } catch (error) {
        console.error("Error fetching pollen data:", error);
      }
    };

    getPollenData();
  }, [location]);

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
        
        {/* Display Pollen data in the Wetter section */}
        <div className="bg-green-100 p-6 text-xl font-bold rounded-2xl w-1/2 md:w-1/3">
          <h3 className="text-2xl font-semibold mb-4">Pollen Forecast</h3>
          {pollenData ? (
            <div>
              <p><strong>Location:</strong> {pollenData.location}</p>
              <p><strong>Forecast:</strong> {pollenData.forecast}</p>
              <p><strong>Pollen Level:</strong> {pollenData.pollen_level}</p>
              <p><strong>Additional Info:</strong> {pollenData.info}</p>
            </div>
          ) : (
            <p>Loading pollen data...</p>
          )}
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
