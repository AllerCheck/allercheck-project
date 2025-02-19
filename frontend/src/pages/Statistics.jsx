import { useState, useEffect } from "react";
import { fetchStatistics, exportStatistics } from "../api/StatisticsApi";
import NavigationButtons from "../components/NavigationButtons";

const Statistics = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [statistics, setStatistics] = useState(null);
    const [entries, setEntries] = useState([]);
    const [noEntriesMessage, setNoEntriesMessage] = useState("");
    const token = localStorage.getItem("token");

    // Set default dates on initial load
    useEffect(() => {
        const today = new Date();
        const defaultStartDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]; // First day of the current month
        const defaultEndDate = today.toISOString().split('T')[0]; // Today's date
        setStartDate(defaultStartDate);
        setEndDate(defaultEndDate);
    }, []);

    const handleFetchStatistics = async () => {
        if (!startDate || !endDate) {
            alert("Bitte Start- und Enddatum eingeben.");
            return;
        }

        const data = await fetchStatistics(token, startDate, endDate);
        if (data) {
            const filteredEntries = data.filter(entry => {
                const entryDate = new Date(entry.entry_date);
                const start = new Date(startDate);
                const end = new Date(endDate);

                // Normalize all dates to ensure only date part is considered
                entryDate.setHours(0, 0, 0, 0);
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999); // Include the full end date

                return entryDate >= start && entryDate <= end;
            });

            setEntries(filteredEntries);

            if (filteredEntries.length === 0) {
                setNoEntriesMessage("No entry found in this period of time.");
                setStatistics(null);
            } else {
                setNoEntriesMessage("");
                const avgSymptoms = {
                    nose: calculateAverage(filteredEntries, "nose"),
                    lungs: calculateAverage(filteredEntries, "lungs"),
                    skin: calculateAverage(filteredEntries, "skin"),
                    eyes: calculateAverage(filteredEntries, "eyes"),
                };
                const totalMedications = filteredEntries.filter(entry => entry.medication_taken === 1).length;

                setStatistics({
                    total_entries: filteredEntries.length,
                    avg_nose: avgSymptoms.nose.toFixed(1),
                    avg_lungs: avgSymptoms.lungs.toFixed(1),
                    avg_skin: avgSymptoms.skin.toFixed(1),
                    avg_eyes: avgSymptoms.eyes.toFixed(1),
                    total_medications: totalMedications,
                });
            }
        }
    };

    const calculateAverage = (data, field) => {
        const total = data.reduce((sum, entry) => sum + parseInt(entry[field]), 0);
        return total / data.length;
    };

    const handleExport = (format) => {
        exportStatistics(token, format, startDate, endDate);
    };

    return (
        <div className="flex flex-col items-center py-10">
            <NavigationButtons />
            <h2 className="text-2xl font-semibold text-center mb-4">Records</h2>
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
                    Enter
                </button>
            </div>

            {noEntriesMessage && (
                <div className="mt-4 text-red-600 text-center">
                    {noEntriesMessage}
                </div>
            )}

            {entries.length > 0 && (
                <div className="mt-4 p-6 border rounded shadow-lg w-full max-w-4xl">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr>
                                <th className="px-2 py-4 text-center">Date</th>
                                <th className="px-4 py-4 text-center">Nose</th>
                                <th className="px-4 py-4 text-center">Lungs</th>
                                <th className="px-4 py-4 text-center">Skin</th>
                                <th className="px-4 py-4 text-center">Eyes</th>
                                <th className="px-4 py-4 text-center">Medications</th>
                                <th className="px-4 py-4 text-center">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map(entry => {
                                const entryDate = new Date(entry.entry_date);
                                const formattedDate = `${entryDate.getDate().toString().padStart(2, "0")}-${(entryDate.getMonth() + 1).toString().padStart(2, "0")}-${entryDate.getFullYear()}`;
                                return (
                                    <tr key={entry.id}>
                                        <td className="px-4 py-2 text-center">{formattedDate}</td>
                                        <td className="px-4 py-2 text-center">{entry.nose}</td>
                                        <td className="px-4 py-2 text-center">{entry.lungs}</td>
                                        <td className="px-4 py-2 text-center">{entry.skin}</td>
                                        <td className="px-4 py-2 text-center">{entry.eyes}</td>
                                        <td className="px-4 py-2 text-center">{entry.medication_taken === 1 ? "yes" : "no"}</td>
                                        <td className="px-4 py-2 text-center break-words">{entry.notes || " "}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="mt-4 p-4 border rounded shadow-lg text-center">
                        <h3 className="text-lg font-semibold">Summary</h3>
                        <p><strong>Total Entries:</strong> {statistics.total_entries}</p>
                        <p><strong>Average of Symptoms:</strong></p>
                        <ul>
                            <li>Nose: {statistics.avg_nose}</li>
                            <li>Lungs: {statistics.avg_lungs}</li>
                            <li>Skin: {statistics.avg_skin}</li>
                            <li>Eyes: {statistics.avg_eyes}</li>
                        </ul>
                        <p><strong>Medications taken:</strong> {statistics.total_medications}</p>
                        <div className="flex space-x-2 mt-4 justify-center">
                            <button 
                                onClick={() => handleExport("csv")} 
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Export als CSV
                            </button>
                            <button 
                                onClick={() => handleExport("pdf")} 
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Export als PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Statistics;
