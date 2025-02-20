// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPollenData } from "../api/PollenApi";  // Import the API function
import { fetchArticles } from "../api/ArticlesApi"; // Import the News API function
import HomeButtons from "../components/HomeButtons";

function Home() {
  const navigate = useNavigate();
  const [pollenData, setPollenData] = useState(null);  // State for pollen data
  const [location, setLocation] = useState("Berlin");  // Default location
  const [articles, setArticles] = useState([]); // State for articles
  const [loadingArticles, setLoadingArticles] = useState(true); // State for article loading
  const [pollenError, setPollenError] = useState(null);  // Error state for pollen data
  const [articlesError, setArticlesError] = useState(null);  // Error state for articles

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 3;

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
        setPollenError(null);  // Reset error state if data is fetched
      } catch (error) {
        setPollenError("Error fetching pollen data. Please try again later.");
        console.error("Error fetching pollen data:", error);
      }
    };

    getPollenData();
  }, [location]);

  // Fetch articles related to allergies
  useEffect(() => {
    const getArticles = async () => {
      setLoadingArticles(true);
      try {
        const fetchedArticles = await fetchArticles("allergy"); // Get allergy-related articles
        setArticles(fetchedArticles); // Set the articles state
        setArticlesError(null);  // Reset error state if articles are fetched
      } catch (error) {
        setArticlesError("Error fetching articles. Please try again later.");
        console.error("Error fetching articles:", error);
      } finally {
        setLoadingArticles(false);
      }
    };

    getArticles(); // Fetch articles on component mount
  }, []);

  // Pagination logic: Get current articles based on page
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  // Change page
  const nextPage = () => {
    if (currentPage < Math.ceil(articles.length / articlesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Total pages
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  return (
    <div className="flex flex-col">
      <h1 className="text-center font-bold text-4xl mt-6 mb-6">
        Welcome to AllerCheck
      </h1>

      {/* Flexbox layout for Articles and Wetter */}
      <div className="flex justify-center gap-x-6 p-4 min-h-96 ml-2 mr-2">
        {/* Articles section */}
        <div className="bg-teal-50 p-6 text-xl font-bold rounded-2xl w-3/4 md:w-2/3">
          <h2 className="text-xl mb-4">Allergy related news</h2>
          {loadingArticles ? (
            <p>Loading articles...</p>
          ) : articlesError ? (
            <p className="text-red-600">{articlesError}</p> // Display error message for articles
          ) : (
            <div>
              {currentArticles.length === 0 ? (
                <p>No articles found.</p>
              ) : (
                <ul>
                  {currentArticles.map((article, index) => (
                    <li key={index} className="mb-4">
                      <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                        <h3 className="text-lg font-semibold">{article.title}</h3>
                        <p>{article.description}</p>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex justify-between items-center mt-4 text-sm">
                {/* Pagination controls */}
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="text-blue-500 disabled:text-gray-400"
                >
                  Prev
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="text-blue-500 disabled:text-gray-400"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pollen data section */}
        <div className="bg-green-100 p-6 text-xl font-bold rounded-2xl w-1/2 md:w-1/3">
          <h3 className="text-2xl font-semibold mb-4">Pollen Forecast</h3>
          {pollenError ? (
            <p className="text-red-600">{pollenError}</p> // Display error message for pollen data
          ) : pollenData ? (
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

      <HomeButtons />

      {/* Commercial Ads section */}
      <div className="flex justify-center mt-16 text-4xl">
        <h2>Commercial Ads for future use</h2>
      </div>
    </div>
  );
}

export default Home;
