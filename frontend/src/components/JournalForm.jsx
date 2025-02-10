import { useState } from "react";

export default function JournalForm({ onSubmit }) {
  const [symptoms, setSymptoms] = useState("");
  const [intensity, setIntensity] = useState(1);
  const [duration, setDuration] = useState(1);
  const [medications, setMedications] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ symptoms, intensity, duration, medications });
    // Reset form
    setSymptoms("");
    setIntensity(1);
    setDuration(1);
    setMedications("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Symptoms</label>
        <input
          type="text"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Symptom Intensity (1–10)</label>
        <input
          type="number"
          min="1"
          max="10"
          value={intensity}
          onChange={(e) => setIntensity(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Duration (hours)</label>
        <input
          type="number"
          min="1"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Medications Taken</label>
        <input
          type="text"
          value={medications}
          onChange={(e) => setMedications(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <button type="submit" className="bg-blue-500 text-white p-2 mt-4">
        Save Journal Entry
      </button>
    </form>
  );
}
