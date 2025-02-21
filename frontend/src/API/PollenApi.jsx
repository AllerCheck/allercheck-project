
export const fetchPollenData = async (location) => {
  try {
    
    // Build the API URL dynamically using the location parameter
    const response = await fetch(`http://localhost:5000/pollen?location=${encodeURIComponent(location)}`);
    const data = await response.json();
    console.log("data", data);
    if (!response.ok) {
      throw new Error("Failed to fetch pollen data");
    }
    
    // Parse and return the JSON data
    return response.json();
  } catch (error) {
    console.error("Error fetching pollen data:", error);
    throw error;
  }
};
