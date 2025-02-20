// src/api/PollenApi.jsx
export const fetchPollenData = async (location) => {
  try {
    const response = await fetch(`/api/pollen-forecast?location=${location}`);
    if (!response.ok) {
      throw new Error("Failed to fetch pollen data");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching pollen data:", error);
    throw error;
  }
};
