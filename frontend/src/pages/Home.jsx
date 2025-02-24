import { useEffect, useState } from "react";
import { fetchPollenData } from "../api/PollenApi";
import { fetchArticles } from "../api/ArticlesApi";
import HomeButtons from "../components/HomeButtons";

function Home() {
  const [pollenData, setPollenData] = useState(null);
  const [location] = useState("Berlin");
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [pollenError, setPollenError] = useState(null);
  const [articlesError, setArticlesError] = useState(null);

  const [currentPageArticles] = useState(1);
  const articlesPerPage = 10;

  const [currentPagePollen] = useState(1);
  const pollenPerPage = 1;

  useEffect(() => {
    const getPollenData = async () => {
      try {
        const data = await fetchPollenData(location);
        setPollenData(data);
        setPollenError(null);
      } catch (error) {
        setPollenError("Error fetching pollen data.");
      }
    };

    getPollenData();
  }, [location]);

  useEffect(() => {
    const getArticles = async () => {
      setLoadingArticles(true);
      try {
        const fetchedArticles = await fetchArticles("allergy");
        setArticles(fetchedArticles);
        setArticlesError(null);
      } catch (error) {
        setArticlesError("Error fetching articles.");
      } finally {
        setLoadingArticles(false);
      }
    };

    getArticles();
  }, []);

  const indexOfLastArticle = currentPageArticles * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  const indexOfLastPollen = currentPagePollen * pollenPerPage;
  const indexOfFirstPollen = indexOfLastPollen - pollenPerPage;
  const currentPollenData = pollenData?.dailyInfo?.slice(
    indexOfFirstPollen,
    indexOfLastPollen
  );

  return (
    <div className="flex flex-col items-center px-6 md:px-12 lg:px-24 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 min-h-screen">
      {/* Header */}
      <h1 className="text-center font-extrabold text-5xl mt-6 mb-8 p-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">
        Allergy Insights. Alerts. Control.
      </h1>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-7xl">
        {/* Articles Section */}
        <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl p-8 h-[50vh] overflow-y-auto scrollbar-hidden transition-transform transform hover:scale-105 duration-300 ease-in-out hover:shadow-3xl">
          <h2 className="text-3xl font-semibold text-white mb-6">
            Allergy News
          </h2>
          {loadingArticles ? (
            <p className="text-gray-300 text-xl">Loading articles...</p>
          ) : articlesError ? (
            <p className="text-red-400">{articlesError}</p>
          ) : (
            <div className="space-y-8">
              {currentArticles.length === 0 ? (
                <p className="text-gray-300">No articles found.</p>
              ) : (
                currentArticles.map((article, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-6 hover:bg-white/10 p-6 rounded-2xl transition-all duration-200 hover:shadow-lg"
                  >
                    <img
                      src={
                        article.urlToImage || "https://via.placeholder.com/150"
                      }
                      alt={article.title}
                      className="w-32 h-32 object-cover rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300"
                    />
                    <div>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-2xl font-semibold text-white hover:text-yellow-300 transition-all duration-300"
                      >
                        {article.title}
                      </a>
                      <p className="text-sm text-gray-300 mt-2 line-clamp-3">
                        {article.description}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Pollen Forecast Section */}
        <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl p-8 h-[50vh] overflow-y-auto scrollbar-hidden transition-transform transform hover:scale-105 duration-300 ease-in-out hover:shadow-3xl">
          <h2 className="text-3xl font-semibold text-white mb-6">
            Pollen Forecast
          </h2>
          {pollenError ? (
            <p className="text-red-400">{pollenError}</p>
          ) : currentPollenData && currentPollenData.length > 0 ? (
            <div>
              {currentPollenData.map((day, index) => (
                <div
                  key={index}
                  className="mt-6 p-6 rounded-2xl hover:bg-white/10 transition-all duration-200"
                >
                  <p className="text-lg text-gray-300">
                    <strong>Date:</strong> {day.date?.day}/{day.date?.month}/
                    {day.date?.year}
                  </p>

                  {/* Pollen Types */}
                  <h4 className="font-semibold mt-4 text-yellow-300 text-xl">
                    Pollen Types:
                  </h4>
                  <ul className="list-disc ml-6 text-gray-300">
                    {day.pollenTypeInfo.map((pollen, i) => (
                      <li key={i} className="mt-2">
                        <strong>{pollen.displayName}</strong>{" "}
                        {pollen.inSeason ? "(In Season)" : ""}
                        {pollen.indexInfo && (
                          <>
                            <p>
                              <strong>Index:</strong> {pollen.indexInfo.value} (
                              {pollen.indexInfo.category})
                            </p>
                            <p className="text-red-300 text-sm italic">
                              {pollen.indexInfo.indexDescription}
                            </p>
                            <div
                              className="w-10 h-10 rounded-full mt-2"
                              style={{
                                backgroundColor: `rgb(${
                                  pollen.indexInfo.color.green * 255
                                }, 0, ${pollen.indexInfo.color.blue * 255})`,
                              }}
                            ></div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>

                  {/* Plants Information */}
                  <h4 className="font-semibold mt-4 text-yellow-300 text-xl">
                    Plants:
                  </h4>
                  <ul className="list-disc ml-6 text-gray-300">
                    {day.plantInfo.map((plant, i) => (
                      <li key={i} className="mt-2">
                        <strong>{plant.displayName}</strong>{" "}
                        {plant.inSeason ? "(In Season)" : ""}
                        {plant.indexInfo && (
                          <>
                            <p>
                              <strong>Index:</strong> {plant.indexInfo.value} (
                              {plant.indexInfo.category})
                            </p>
                            <p className="text-red-300 text-sm italic">
                              {plant.indexInfo.indexDescription}
                            </p>
                            <div
                              className="w-10 h-10 rounded-full mt-2"
                              style={{
                                backgroundColor: `rgb(${
                                  plant.indexInfo.color.green * 255
                                }, 0, ${plant.indexInfo.color.blue * 255})`,
                              }}
                            ></div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-300">Loading pollen data...</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-10 mb-16">
        <HomeButtons />
      </div>

      {/* Commercial Ads Section */}
      <div className="text-yellow-300 text-lg text-center">
        <p>Coming Soon: for Ads</p>
      </div>
    </div>
  );
}

export default Home;
