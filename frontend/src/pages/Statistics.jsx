import { useState } from "react";
import { fetchStatistics, exportStatistics } from "../api/StatisticsApi";
import NavigationButtons from "../components/NavigationButtons";

const Statistics = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [statistics, setStatistics] = useState(null);
    const token = localStorage.getItem("token");

    const handleFetchStatistics = async () => {
        if (!startDate || !endDate) {
            alert("Bitte Start- und Enddatum eingeben.");
            return;
        }
        const data = await fetchStatistics(token, startDate, endDate);
        if (data) {
            // Calculate the statistics from the data
            const totalEntries = data.length;
            const avgSymptoms = {
                nose: calculateAverage(data, "nose"),
                lungs: calculateAverage(data, "lungs"),
                skin: calculateAverage(data, "skin"),
                eyes: calculateAverage(data, "eyes"),
            };
            const totalMedications = data.filter(entry => entry.medication_taken === 1).length;

            setStatistics({
                total_entries: totalEntries,
                avg_nose: avgSymptoms.nose,
                avg_lungs: avgSymptoms.lungs,
                avg_skin: avgSymptoms.skin,
                avg_eyes: avgSymptoms.eyes,
                total_medications: totalMedications,
            });
        }
    };

    const calculateAverage = (data, field) => {
        const total = data.reduce((sum, entry) => sum + parseInt(entry[field]), 0);
        return total / data.length;
    };

    return (
        <div className="flex flex-col items-center py-10">
            <NavigationButtons />
            <h2 className="text-2xl font-semibold text-center mb-4">Journal-Statistik</h2>
            <div className="flex space-x-2">
                <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    className="border p-2 rounded" 
                />
                <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    className="border p-2 rounded" 
                />
                <button 
                    onClick={handleFetchStatistics} 
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Abrufen
                </button>
            </div>

            {statistics && (
                <div className="mt-4 p-4 border rounded shadow-lg">
                    <h3 className="text-lg font-semibold">Ergebnisse</h3>
                    <p><strong>Gesamtanzahl Einträge:</strong> {statistics.total_entries}</p>
                    <p><strong>Durchschnittliche Symptome:</strong></p>
                    <ul>
                        <li>Nase: {statistics.avg_nose}</li>
                        <li>Lunge: {statistics.avg_lungs}</li>
                        <li>Haut: {statistics.avg_skin}</li>
                        <li>Augen: {statistics.avg_eyes}</li>
                    </ul>
                    <p><strong>Medikamenteneinnahmen:</strong> {statistics.total_medications}</p>
                    <div className="flex space-x-2 mt-4">
                        <button 
                            onClick={() => exportStatistics(token, "csv", startDate, endDate)} 
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Export als CSV
                        </button>
                        <button 
                            onClick={() => exportStatistics(token, "pdf", startDate, endDate)} 
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Export als PDF
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Statistics;
