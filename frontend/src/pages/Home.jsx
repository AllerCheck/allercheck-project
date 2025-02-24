// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { fetchPollenData } from "../api/PollenApi"; // Import the API function
import { fetchArticles } from "../api/ArticlesApi"; // Import the News API function
import HomeButtons from "../components/HomeButtons";

function Home() {
  const [pollenData, setPollenData] = useState(null); // State for pollen data
  const [location] = useState("Berlin"); // Default location
  const [articles, setArticles] = useState([]); // State for articles
  const [loadingArticles, setLoadingArticles] = useState(true); // State for article loading
  const [pollenError, setPollenError] = useState(null); // Error state for pollen data
  const [articlesError, setArticlesError] = useState(null); // Error state for articles

  // Pagination state for articles
  const [currentPageArticles] = useState(1);
  const articlesPerPage = 10;

  // Pagination state for pollen data
  const [currentPagePollen] = useState(1);
  const pollenPerPage = 1; // Show 1 pollen record per page

  // Fetch pollen data when the component mounts or location changes
  useEffect(() => {
    const getPollenData = async () => {
      try {
        const data = await fetchPollenData(location); // Correctly receive parsed JSON data
        setPollenData(data); // Set the data in state
        setPollenError(null);
      } catch (error) {
        console.error("Error fetching pollen data:", error);
        setPollenError("Error fetching pollen data. Please try again later.");
      }
    };

    getPollenData();
  }, [location]); // Runs when 'location' changes

  // Fetch articles related to allergies
  useEffect(() => {
    const getArticles = async () => {
      setLoadingArticles(true);
      try {
        const fetchedArticles = await fetchArticles("allergy"); // Get allergy-related articles
        setArticles(fetchedArticles); // Set the articles state
        setArticlesError(null); // Reset error state if articles are fetched
      } catch (error) {
        setArticlesError("Error fetching articles. Please try again later.");
        console.error("Error fetching articles:", error);
      } finally {
        setLoadingArticles(false);
      }
    };

    getArticles(); // Fetch articles on component mount
  }, []);

  // Pagination logic for articles: Get current articles based on page
  const indexOfLastArticle = currentPageArticles * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  // Pagination logic for pollen data: Get current pollen data based on page
  const indexOfLastPollen = currentPagePollen * pollenPerPage;
  const indexOfFirstPollen = indexOfLastPollen - pollenPerPage;
  const currentPollenData = pollenData?.dailyInfo?.slice(
    indexOfFirstPollen,
    indexOfLastPollen
  );

  return (
    <div className="flex flex-col items-center px-4 md:px-12 lg:px-24">
    <h1 className="text-center font-bold text-4xl mt-6 mb-6 text-orange-600">
      Welcome to AllerCheck
    </h1>

    {/* Main Content Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-7xl">
      {/* Articles Section */}
      <div className="bg-stone-50 p-6 rounded-2xl shadow-lg overflow-y-auto h-[50vh] scrollbar-hidden hover:scrollbar">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Allergy News</h2>
        {loadingArticles ? (
          <p>Loading articles...</p>
        ) : articlesError ? (
          <p className="text-red-600">{articlesError}</p>
        ) : (
          <ul>
            {currentArticles.length === 0 ? (
              <p>No articles found.</p>
            ) : (
              currentArticles.map((article, index) => (
                <li key={index} className="mb-4 border-b pb-2">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-700 hover:underline"
                  >
                    <h3 className="text-lg font-bold">{article.title}</h3>
                    <p className="text-gray-600">{article.description}</p>
                  </a>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {/* Pollen Forecast Section */}
      <div className="bg-stone-50 p-6 rounded-2xl shadow-lg overflow-y-auto h-[50vh] scrollbar-hidden hover:scrollbar">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Pollen Forecast</h3>
        {pollenError ? (
          <p className="text-red-600">{pollenError}</p>
        ) : currentPollenData && currentPollenData.length > 0 ? (
          <div>
            {currentPollenData.map((day, index) => (
              <div key={index} className="mt-4 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Date:</strong> {day.date?.day}/{day.date?.month}/{day.date?.year}
                </p>

                <h4 className="font-semibold mt-2 text-indigo-600">Pollen Types:</h4>
                <ul className="list-disc ml-4 text-gray-700">
                  {day.pollenTypeInfo.map((pollen, i) => (
                    <li key={i} className="mt-2">
                      <strong>{pollen.displayName}</strong> {pollen.inSeason ? "(In Season)" : ""}
                      {pollen.indexInfo && (
                        <>
                          <p>
                            <strong>Index:</strong> {pollen.indexInfo.value} ({pollen.indexInfo.category})
                          </p>
                          <p className="text-red-500 text-sm italic">
                            {pollen.indexInfo.indexDescription}
                          </p>
                          <div
                            className="w-6 h-6 rounded-full mt-1"
                            style={{ backgroundColor: `rgb(${pollen.indexInfo.color.green * 255}, 0, ${pollen.indexInfo.color.blue * 255})` }}
                          ></div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>

                <h4 className="font-semibold mt-4 text-indigo-600">Plants:</h4>
                <ul className="list-disc ml-4 text-gray-700">
                  {day.plantInfo.map((plant, i) => (
                    <li key={i} className="mt-2">
                      <strong>{plant.displayName}</strong> {plant.inSeason ? "(In Season)" : ""}
                      {plant.indexInfo && (
                        <>
                          <p>
                            <strong>Index:</strong> {plant.indexInfo.value} ({plant.indexInfo.category})
                          </p>
                          <p className="text-red-500 text-sm italic">
                            {plant.indexInfo.indexDescription}
                          </p>
                          <div
                            className="w-6 h-6 rounded-full mt-1"
                            style={{ backgroundColor: `rgb(${plant.indexInfo.color.green * 255}, 0, ${plant.indexInfo.color.blue * 255})` }}
                          ></div>
                        </>
                      )}
                      {plant.plantDescription && (
                        <div className="mt-2 p-2 bg-gray-100 rounded-lg">
                          <p>
                            <strong>Type:</strong> {plant.plantDescription.type}
                          </p>
                          <p>
                            <strong>Family:</strong> {plant.plantDescription.family}
                          </p>
                          <p>
                            <strong>Season:</strong> {plant.plantDescription.season}
                          </p>
                          <p>
                            <strong>Cross-Reactions:</strong> {plant.plantDescription.crossReaction}
                          </p>
                          <p className="text-gray-600 text-sm italic">
                            {plant.plantDescription.specialShapes}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <img
                              src={plant.plantDescription.picture}
                              alt={plant.displayName}
                              className="w-16 h-16 rounded-lg"
                            />
                            <img
                              src={plant.plantDescription.pictureCloseup}
                              alt={`${plant.displayName} Close-up`}
                              className="w-16 h-16 rounded-lg"
                            />
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p>Loading pollen data...</p>
        )}
      </div>
    </div>

    {/* Buttons */}
    <div className="mt-6">
      <HomeButtons />
    </div>

    {/* Commercial Ads Section */}
    <div className="flex justify-center mt-8 text-gray-500 text-2xl">
      <h2>Commercial Ads for Future Use</h2>
    </div>
  </div>
);
}

export default Home;
