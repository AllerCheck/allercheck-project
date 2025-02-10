export const getPollenData = async (lat, lon) => {
  const apiKey = import.meta.env.VITE_POLLEN_API_KEY;
  const url = `https://api.tomorrow.io/v4/weather/forecast?lat=${lat}&lon=${lon}&apikey=${apiKey}`;
  // const url = `https://api.pollen.com/v1/pollen?lat=${lat}&lon=${lon}&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching pollen data:", error);
    throw error;
  }
};
