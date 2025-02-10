export const getWeatherData = async (lat, lon) => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  
    try {
      const response = await fetch(url);
  
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  };
  