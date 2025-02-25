import { useState, useEffect } from "react";
import { fetchStatistics } from "../api/StatisticsApi";
import Papa from "papaparse"; // For CSV export
import { jsPDF } from "jspdf"; // For PDF export
import "jspdf-autotable"; // Import autoTable plugin

const Statistics = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statistics, setStatistics] = useState(null);
  const [entries, setEntries] = useState([]);
  const [noEntriesMessage, setNoEntriesMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const today = new Date();
    const defaultStartDate = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const defaultEndDate = today.toISOString().split("T")[0];
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
      console.log("Statistics Data:", data);
      const filteredEntries = data
        .filter((entry) => {
          const entryDate = new Date(entry.entry_date);
          const start = new Date(startDate);
          const end = new Date(endDate);

          entryDate.setHours(0, 0, 0, 0);
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);

          return entryDate >= start && entryDate <= end;
        })
        .sort((a, b) => new Date(b.entry_date) - new Date(a.entry_date));

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
        const totalMedications = filteredEntries.filter(
          (entry) => entry.medication_taken === 1
        ).length;

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
    if (data.length === 0) return 0;
    const total = data.reduce((sum, entry) => sum + parseInt(entry[field]), 0);
    return total / data.length;
  };

  const handleExport = (format) => {
    if (format === "csv") {
      // Extract the table data to export as CSV
      const csvData = entries.map((entry) => ({
        Date: new Date(entry.entry_date).toLocaleDateString(),
        Nose: entry.nose,
        Lungs: entry.lungs,
        Skin: entry.skin,
        Eyes: entry.eyes,
        Medications: entry.medication_taken === 1 ? "Yes" : "No",
        Notes: entry.notes || "",
      }));

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `statistics_${startDate}_to_${endDate}.csv`;
      link.click();
    } else if (format === "pdf") {
      // Generate PDF with table and summary data
      const doc = new jsPDF();
      let yOffset = 10;

      // Title
      doc.setFontSize(16);
      doc.text("Allergy Statistics", 10, yOffset);
      yOffset += 10;

      // Table Header
      const tableColumns = [
        "Date",
        "Nose",
        "Lungs",
        "Skin",
        "Eyes",
        "Medications",
        "Notes",
      ];
      const tableData = entries.map((entry) => [
        new Date(entry.entry_date).toLocaleDateString(),
        entry.nose,
        entry.lungs,
        entry.skin,
        entry.eyes,
        entry.medication_taken === 1 ? "Yes" : "No",
        entry.notes || "",
      ]);

      doc.autoTable({
        head: [tableColumns],
        body: tableData,
        startY: yOffset,
        margin: { top: 10 },
        theme: "grid",
      });

      yOffset = doc.lastAutoTable.finalY + 10;

      // Summary
      doc.setFontSize(12);
      doc.text(`Total Entries: ${statistics.total_entries}`, 10, yOffset);
      yOffset += 6;
      doc.text(`Average of Symptoms:`, 10, yOffset);
      yOffset += 6;
      doc.text(`Nose: ${statistics.avg_nose}`, 10, yOffset);
      yOffset += 6;
      doc.text(`Lungs: ${statistics.avg_lungs}`, 10, yOffset);
      yOffset += 6;
      doc.text(`Skin: ${statistics.avg_skin}`, 10, yOffset);
      yOffset += 6;
      doc.text(`Eyes: ${statistics.avg_eyes}`, 10, yOffset);
      yOffset += 6;
      doc.text(
        `Medications taken: ${statistics.total_medications}`,
        10,
        yOffset
      );

      // Save the PDF
      doc.save(`statistics_${startDate}_to_${endDate}.pdf`);
    }
  };

  return (
    <div className="flex flex-col items-center py-10 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
      <h2 className="p-2 mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 font-extrabold text-5xl">
        My Allergy Report
      </h2>
      <div className="max-w-5xl min-w-96 mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="flex space-x-2 flex-wrap justify-center">
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
            className="bg-gray-600 hover:bg-gradient-to-r from-yellow-300 to-yellow-600 text-white hover:text-gray-700 text-lg font-semibold px-4 py-2 rounded cursor-pointer w-24"
          >
            Search
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
                {entries.map((entry) => {
                  const entryDate = new Date(entry.entry_date);
                  const formattedDate = `${entryDate
                    .getDate()
                    .toString()
                    .padStart(2, "0")}-${(entryDate.getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}-${entryDate.getFullYear()}`;
                  return (
                    <tr key={entry.id}>
                      <td className="px-4 py-2 text-center">{formattedDate}</td>
                      <td className="px-4 py-2 text-center">{entry.nose}</td>
                      <td className="px-4 py-2 text-center">{entry.lungs}</td>
                      <td className="px-4 py-2 text-center">{entry.skin}</td>
                      <td className="px-4 py-2 text-center">{entry.eyes}</td>
                      <td className="px-4 py-2 text-center">
                        {entry.medication_taken === 1 ? "yes" : "no"}
                      </td>
                      <td className="px-4 py-2 text-center break-words">
                        {entry.notes || " "}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="mt-4 p-4 border rounded shadow-lg text-center">
              <h3 className="text-lg font-semibold">Summary</h3>
              <p>
                <strong>Total Entries:</strong> {statistics.total_entries}
              </p>
              <p>
                <strong>Average of Symptoms:</strong>
              </p>
              <ul>
                <li>Nose: {statistics.avg_nose}</li>
                <li>Lungs: {statistics.avg_lungs}</li>
                <li>Skin: {statistics.avg_skin}</li>
                <li>Eyes: {statistics.avg_eyes}</li>
              </ul>
              <p>
                <strong>Medications taken:</strong>{" "}
                {statistics.total_medications}
              </p>
              <div className="flex space-x-2 mt-4 justify-center">
                <button
                  onClick={() => handleExport("csv")}
                  className="bg-gray-600 hover:bg-gradient-to-r from-yellow-300 to-yellow-600 text-white hover:text-gray-700 text-lg font-semibold px-4 py-2 rounded cursor-pointer w-24"
                >
                  CSV
                </button>
                <button
                  onClick={() => handleExport("pdf")}
                  className="bg-gray-600 hover:bg-gradient-to-r from-yellow-300 to-yellow-600 text-white hover:text-gray-700 text-lg font-semibold px-4 py-2 rounded cursor-pointer w-24"
                >
                  PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;
