import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
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

    console.log(journal.medications);
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
    <div className="flex flex-col items-center py-10 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
      <h2 className="p-2 mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 font-extrabold text-5xl">
        My Allergy Journal
      </h2>
      <div className="max-w-5xl min-w-96 mx-auto p-6 bg-white shadow-lg rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-12">
            <div className="flex flex-col items-center space-y-6 w-full md:w-1/2">
              {["nose", "eyes", "lungs", "skin"].map((area) => (
                <div key={area} className="text-center">
                  <label className="block text-lg font-semibold capitalize text-gray-700 mb-2">
                    {area}
                  </label>
                  <div className="flex justify-center gap-3">
                    {[0, 1, 2, 3].map((num) => (
                     <button
                     key={num}
                     type="button"
                     className={`w-10 h-10 rounded-full font-semibold transition ${
                       journal[area] === num
                         ? "bg-gradient-to-r from-yellow-300 to-yellow-600 text-gray-700" // Selected state with gray-700 text
                         : "bg-gray-300 hover:bg-gradient-to-r from-yellow-300 to-yellow-600 hover:text-gray-700 text-white" // Default state
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

          <div className="flex justify-center w-full flex-col items-center space-y-4">
            <div className="text-center">
              <label className="block text-lg font-semibold capitalize text-gray-700 mb-2">
                Medications
              </label>
              <input
                type="checkbox"
                checked={journal.medications}
                onChange={() =>
                  handleChange("medications", !journal.medications)
                }
                className="w-6 h-6 rounded border-gray-300 focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          <div className="w-full">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
              rows="2"
              value={journal.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Additional notes..."
            ></textarea>

            <button
              type="submit"
              className="w-full py-3 bg-gray-700 text-white hover:text-gray-700 text-lg font-semibold rounded-md hover:bg-gradient-to-r hover:from-yellow-300 hover:to-yellow-600 mt-6 transition-all cursor-pointer"
            >
              Save Entry
            </button>
          </div>
        </form>

        <div className="mt-8 text-sm text-gray-600 flex space-x-4 justify-center">
          <p>
            <span className="font-bold">0</span> = no symptoms
          </p>
          <p>
            <span className="font-bold">1</span> = little
          </p>
          <p>
            <span className="font-bold">2</span> = moderate
          </p>
          <p>
            <span className="font-bold">3</span> = strong
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyJournal;
