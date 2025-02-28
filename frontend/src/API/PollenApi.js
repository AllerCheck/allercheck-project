export const fetchPollenData = async (location) => {
  try {
    const response = await fetch(`http://localhost:5000/pollen?location=${encodeURIComponent(location)}`);

    if (!response.ok) {
      throw new Error("Failed to fetch pollen data");
    }

    // Parse the JSON only once
    const data = await response.json();
    console.log("Pollen Data:", data);

    return data;
  } catch (error) {
    console.error("Error fetching pollen data:", error);
    throw error;
  }
};
