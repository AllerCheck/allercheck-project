import { useState } from "react";
import { jsPDF } from "jspdf"; // For PDF export
import Papa from "papaparse"; // For CSV export

export default function AllergyJournal() {
  const [medications, setMedications] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  ); // Format: YYYY-MM
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  ); // Format: YYYY-MM-DD
  const [severity, setSeverity] = useState({
    nase: "",
    augen: "",
    lunge: "",
    haut: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEntry = {
      medications,
      date: selectedDate,
      month: selectedMonth,
      severity,
    };

    setJournalEntries([newEntry, ...journalEntries]);
    setMedications([]);
    setSeverity({ nase: "", augen: "", lunge: "", haut: "" });
  };

  const handleMedicationChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setMedications(selectedOptions);
  };

  const filterEntriesByMonth = journalEntries.filter(
    (entry) => entry.month === selectedMonth
  );

  const calculateSummary = () => {
    if (filterEntriesByMonth.length === 0) return null;

    let totalSeverity = { nase: 0, augen: 0, lunge: 0, haut: 0 };
    let count = 0;

    filterEntriesByMonth.forEach((entry) => {
      Object.keys(entry.severity).forEach((key) => {
        totalSeverity[key] += Number(entry.severity[key]);
      });
      count++;
    });

    return {
      nase: (totalSeverity.nase / count).toFixed(1),
      augen: (totalSeverity.augen / count).toFixed(1),
      lunge: (totalSeverity.lunge / count).toFixed(1),
      haut: (totalSeverity.haut / count).toFixed(1),
    };
  };

  const summary = calculateSummary();

  // CSV Export Function
  const exportCSV = () => {
    const summaryData = [
      ["Month", "Nase", "Augen", "Lunge", "Haut"],
      [selectedMonth, summary.nase, summary.augen, summary.lunge, summary.haut],
    ];

    const csv = Papa.unparse(summaryData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Allergy_Summary_${selectedMonth}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // PDF Export Function
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Allergy Summary for ${selectedMonth}`, 20, 20);
    doc.setFontSize(12);

    doc.text(`Nase: ${summary.nase}`, 20, 30);
    doc.text(`Augen: ${summary.augen}`, 20, 40);
    doc.text(`Lunge: ${summary.lunge}`, 20, 50);
    doc.text(`Haut: ${summary.haut}`, 20, 60);

    doc.save(`Allergy_Summary_${selectedMonth}.pdf`);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-6 text-center">Allergy Journal</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="mb-6">
          {["nase", "augen", "lunge", "haut"].map((key) => (
            <div key={key} className="mb-2">
              <label className="block capitalize">{key} (0-3):</label>
              <select
                value={severity[key]}
                onChange={(e) =>
                  setSeverity({ ...severity, [key]: e.target.value })
                }
                className="p-2 border rounded w-full"
              >
                <option value="">Select</option>
                <option value="0">0 - None</option>
                <option value="1">1 - Mild</option>
                <option value="2">2 - Moderate</option>
                <option value="3">3 - Severe</option>
              </select>
            </div>
          ))}
        </div>

        <div>
          <label className="block font-semibold">Medications Taken:</label>
          <select
            multiple
            value={medications}
            onChange={handleMedicationChange}
            className="p-2 border rounded w-full"
          >
            <option value="Antihistamine">Antihistamine</option>
            <option value="Nasal Spray">Nasal Spray</option>
            <option value="Inhaler">Inhaler</option>
            <option value="Eye Drops">Eye Drops</option>
          </select>
          <p className="text-sm text-gray-500">
            Hold Ctrl (Windows) or Command (Mac) to select multiple.
          </p>
        </div>

        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded w-full"
        >
          Save Entry
        </button>
      </form>

      {/* Journal Entries Table */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">
          Journal Entries for {selectedMonth}
        </h3>
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Datum</th>
              <th className="border border-gray-300 p-2">Medikamente</th>
              <th className="border border-gray-300 p-2">Nase</th>
              <th className="border border-gray-300 p-2">Augen</th>
              <th className="border border-gray-300 p-2">Lunge</th>
              <th className="border border-gray-300 p-2">Haut</th>
            </tr>
          </thead>
          <tbody>
            {filterEntriesByMonth.map((entry, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">{entry.date}</td>
                <td className="border border-gray-300 p-2">
                  {entry.medications.join(", ")}
                </td>
                <td className="border border-gray-300 p-2">
                  {entry.severity.nase}
                </td>
                <td className="border border-gray-300 p-2">
                  {entry.severity.augen}
                </td>
                <td className="border border-gray-300 p-2">
                  {entry.severity.lunge}
                </td>
                <td className="border border-gray-300 p-2">
                  {entry.severity.haut}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Select Month Moved to Bottom */}
      <div className="mb-6">
        <label className="block font-semibold">Select Month:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Monthly Analysis Summary */}
      {summary && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <h3 className="text-lg font-bold mb-2">
            Analysis Summary for {selectedMonth}
          </h3>
          <p>
            <strong>Average Severity:</strong>
          </p>
          <ul>
            <li>Nase: {summary.nase}</li>
            <li>Augen: {summary.augen}</li>
            <li>Lunge: {summary.lunge}</li>
            <li>Haut: {summary.haut}</li>
          </ul>

          {/* Export and Share Options */}
          <div className="mt-4 flex space-x-4">
            <button
              onClick={exportCSV}
              className="p-2 bg-green-500 text-white rounded"
            >
              Export as CSV
            </button>
            <button
              onClick={exportPDF}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Export as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
