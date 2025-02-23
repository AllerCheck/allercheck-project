import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import NavigationButtons from "../components/NavigationButtons";
import axios from "axios";

const DailyJournal = () => {
  const [journal, setJournal] = useState({
    nose: 0,
    eyes: 0,
    lungs: 0,
    skin: 0,
    medications: false,
    notes: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Update state for journal entries
  const handleChange = (field, value) => {
    setJournal({ ...journal, [field]: value });
  };

  // Handle form submission to save journal entry to backend
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Journal Entry:", journal);

    if (!token) {
      alert("User is not authenticated.");
      return;
    }

    axios
      .post(
        "http://localhost:5000/journal",
        {
          nose: journal.nose,
          eyes: journal.eyes,
          lungs: journal.lungs,
          skin: journal.skin,
          medication_taken: journal.medications,
          notes: journal.notes,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        console.log("Entry Saved:", response.data);
        alert("Entry Saved!");
      })
      .catch((error) => {
        console.error("Error saving journal entry:", error);
        alert("Error saving entry");
      });
  };

  return (
    <div className="flex flex-col items-center py-10">
      <div className="mb-10">
        {/* <NavigationButtons /> */}
      </div>
      <div className="max-w-5xl min-w-96 mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Personal Allergy Journal</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-12">
            <div className="flex flex-col items-center space-y-6 w-full md:w-1/2">
              {["nose", "eyes", "lungs", "skin"].map((area) => (
                <div key={area} className="text-center">
                  <label className="block text-lg font-semibold capitalize text-gray-700 mb-2">{area}</label>
                  <div className="flex justify-center gap-3">
                    {[0, 1, 2, 3].map((num) => (
                      <button
                        key={num}
                        type="button"
                        className={`w-10 h-10 rounded-full text-white font-semibold transition ${
                          journal[area] === num ? "bg-red-400" : "bg-gray-300 hover:bg-red-400"
                        }`}
                        onClick={() => handleChange(area, num)}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center w-full flex-col items-center space-y-4 mt-6">
            <div className="text-center">
              <label className="block text-lg font-semibold capitalize text-gray-700 mb-2">Medications</label>
              <input
                type="checkbox"
                checked={journal.medications}
                onChange={() => handleChange("medications", !journal.medications)}
                className="w-6 h-6 rounded border-gray-300 focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          <div className="w-full">
            <label className="block text-lg font-semibold text-gray-700 mb-2">Notes</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
              rows="2"
              value={journal.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Additional notes..."
            ></textarea>

            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white text-lg font-semibold rounded-md hover:bg-green-700 transition mt-6"
            >
              Save Entry
            </button>
          </div>
        </form>

        <div className="mt-8 text-sm text-gray-600 flex space-x-4 justify-center">
          <p><span className="font-bold">0</span> = no symptoms</p>
          <p><span className="font-bold">1</span> = little</p>
          <p><span className="font-bold">2</span> = moderate</p>
          <p><span className="font-bold">3</span> = strong</p>
        </div>
      </div>
    </div>
  );
};

export default DailyJournal;
