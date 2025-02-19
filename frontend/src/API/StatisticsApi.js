const API_URL = "http://localhost:5000/journal/stats"; // Ensure this matches the backend route

export const fetchStatistics = async (token, startDate, endDate) => {
    try {
        // Update the URL to use the correct backend endpoint
        const response = await fetch(`${API_URL}?start=${startDate}&end=${endDate}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            const errorData = await response.json(); // Handle detailed error response from the backend
            throw new Error(errorData.message || "Fehler beim Abrufen der Statistik");
        }

        return await response.json(); // Return the response data (an array of journal entries)
    } catch (error) {
        console.error("Fehler beim Abrufen der Statistik:", error);
        return null;
    }
};

export const exportStatistics = async (token, format, startDate, endDate) => {
    try {
        const response = await fetch(`${API_URL}/export?format=${format}&start=${startDate}&end=${endDate}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            const errorData = await response.json(); // Handle detailed error response from the backend
            throw new Error(errorData.message || "Fehler beim Export");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `journal-statistics.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (error) {
        console.error("Fehler beim Export:", error);
    }
};
