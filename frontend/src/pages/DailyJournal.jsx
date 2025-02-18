import React, { useState } from "react";
import NavigationButtons from "../components/NavigationButtons";

const DailyJournal = () => {
  const [journal, setJournal] = useState({
    nose: 0,
    eyes: 0,
    lungs: 0,
    skin: 0,
    medications: [], // Changed to an array for multiple selections
    notes: "",
  });

  const handleChange = (field, value) => {
    if (field === "medications") {
      // Toggle medication selection
      setJournal((prev) => {
        const newMedications = prev.medications.includes(value)
          ? prev.medications.filter((med) => med !== value)
          : [...prev.medications, value];
        return { ...prev, medications: newMedications };
      });
    } else {
      setJournal({ ...journal, [field]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Journal Entry:", journal);
    alert("Entry Saved!");
  };

  return (
    <div className="flex flex-col items-center py-10">
      <div className="mb-10">
        <NavigationButtons />
      </div>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Personal Allergy Journal</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-wrap gap-12">
            {/* Left Side (Symptoms) */}
            <div className="flex flex-col items-start space-y-6 w-full md:w-1/3">
              {["nose", "eyes", "lungs", "skin"].map((area) => (
                <div key={area} className="text-center">
                  <label className="block text-lg font-semibold capitalize text-gray-700 mb-2">{area}</label>
                  <div className="flex justify-center gap-3">
                    {[0, 1, 2, 3].map((num) => (
                      <button
                        key={num}
                        type="button"
                        className={`w-10 h-10 rounded-full text-white font-semibold transition ${
                          journal[area] === num ? "bg-red-500" : "bg-gray-300 hover:bg-gray-400"
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

            {/* Right Side (Medications) */}
            <div className="w-full md:w-1/3 flex flex-col items-start space-y-4 justify-start">
              <div className="text-center">
                <label className="block text-lg font-semibold capitalize text-gray-700 mb-2">Medications</label>
                <div className="flex justify-start gap-6"> {/* Added more space between buttons */}
                  {[0, 1, 2, 3].map((num) => (
                    <div key={num} className="flex flex-col items-center">
                      <button
                        type="button"
                        className={`w-10 h-10 rounded-full text-white font-semibold transition ${
                          journal.medications.includes(num) ? "bg-blue-500" : "bg-gray-300 hover:bg-gray-400"
                        }`}
                        onClick={() => handleChange("medications", num)}
                      >
                        {num}
                      </button>
                      <span className="text-lg font-semibold text-gray-700 mt-1">
                        {num === 0 && "Citzirizine"}
                        {num === 1 && "Loratadine"}
                        {num === 2 && "Nose Spray"}
                        {num === 3 && "Eye Drops"}
                        {num === 4 && "Asthma Inhaler"}

                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side (Notes Input) */}
            <div className="w-full">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">Notes</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                  rows="3"
                  value={journal.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Additional notes..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-green-600 text-white text-lg font-semibold rounded-md hover:bg-green-700 transition mt-6"
              >
                Save Entry
              </button>
            </div>
          </div>
        </form>

        {/* Intensity Legend */}
        <div className="mt-8 text-sm text-gray-600">
          <p className="font-semibold">Intensity:</p>
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
