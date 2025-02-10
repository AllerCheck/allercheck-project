import { useState, useEffect } from "react";
import { getWeatherData } from "../API/Weather"; // Import the weather API function
// import { getPollenData } from "../API/Pollen"; // Commenting out the pollen API function

export default function Location() {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [weather, setWeather] = useState(null);
  const [pollen, setPollen] = useState(null);
  const [error, setError] = useState(null);

  // Fetch the user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
        },
        (err) => {
          setError("Error getting location: " + err.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  // Fetch weather and pollen data once location is available
  useEffect(() => {
    if (location.lat && location.lon) {
      // Fetch weather data
      getWeatherData(location.lat, location.lon).then((data) =>
        setWeather(data)
      );

      // Commented out for now
      // Fetch pollen data
      // getPollenData(location.lat, location.lon).then((data) => setPollen(data));
    }
  }, [location]);

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      {location.lat && location.lon ? (
        <div>
          <p className="text-green-500">
            Location: Latitude {location.lat}, Longitude {location.lon}
          </p>
          {weather && (
            <div>
              <h2>Weather:</h2>
              <p>Temperature: {weather.main.temp}°C</p>
              <p>{weather.weather[0].description}</p>
            </div>
          )}
          {pollen && (
            <div>
              <h2>Pollen Level:</h2>
              <p>{pollen.level}</p>
            </div>
          )}
        </div>
      ) : (
        <p>Loading your location...</p>
      )}
    </div>
  );
}
