import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import NavigationButtons from "../components/NavigationButtons";

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [appointmentDate, setAppointmentDate] = useState(""); // New state for the input field

  const token = localStorage.getItem("token");

  // 🟢 Termine aus dem Backend laden
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:5000/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        }
      } catch (error) {
        console.error("❌ Fehler beim Laden der Termine:", error);
      }
    };

    fetchAppointments();
  }, [token]);

  // 🟢 Format the date to match 'YYYY-MM-DD HH:MM:SS'
  const formatDateForBackend = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // months are 0-based, so +1
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // Format: '2025-03-21 00:00:00'
  };

  // 🟢 Format date for `datetime-local` input
  const formatDateForInput = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`; // Format: '2025-03-21T14:30'
  };

  // 🟢 Termin speichern
  const handleSaveAppointment = async () => {
    // Use formatted date for the backend
    const formattedDate = formatDateForBackend(appointmentDate || selectedDate);
    const limitedCategory = category.slice(0, 255); // Truncate category to max 255 characters

    const response = await fetch("http://localhost:5000/appointments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        appointment_date: formattedDate,
        category: limitedCategory, // Send truncated category
        description: description,
      }),
    });

    if (response.ok) {
      alert("✅ Termin gespeichert!");
      setAppointments([
        ...appointments,
        { appointment_date: formattedDate, title, category, description },
      ]);
      // Reset form fields after saving
      setTitle("");
      setCategory("");
      setDescription("");
      setAppointmentDate(""); // Reset appointment date input
      setSelectedDate(new Date()); // Reset calendar date selection
    } else {
      alert("❌ Fehler beim Speichern des Termins.");
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    const response = await fetch(
      `http://localhost:5000/appointments/${appointmentId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.ok) {
      alert("✅ Termin gelöscht!");
      setAppointments(appointments.filter((appt) => appt.id !== appointmentId));
    } else {
      alert("❌ Fehler beim Löschen des Termins.");
    }
  };

  // 🟢 Display appointments on the calendar
  const tileContent = ({ date, view }) => {
    const dateStr = date.toISOString().split("T")[0]; // Format: '2025-03-21'
    const currentAppointments = appointments.filter(
      (appt) => appt.appointment_date.split(" ")[0] === dateStr
    );

    return currentAppointments.length > 0 ? (
      <div className="bg-blue-200 text-xs text-gray-700 rounded p-1">
        {currentAppointments.map((appt, index) => (
          <div key={index} className="truncate">
            {appt.title}
          </div>
        ))}
      </div>
    ) : null;
  };

  return (
    <div className="flex flex-col items-center py-10">
      <h2 className="text-2xl font-semibold text-center mb-4">
        My Appointments
      </h2>

      {/* Centering the calendar */}
      <div className="w-full max-w-md flex justify-center mb-10">
        <Calendar
          onChange={setSelectedDate} // Sets selected date
          value={selectedDate} // Bind the selected date value
          tileContent={tileContent} // Display appointments on the calendar
        />
      </div>

      {/* Input fields for appointment details */}
      <div className="w-full max-w-md px-4">
        <input
          type="text"
          placeholder="Titel des Termins"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-4 py-2 mb-4 rounded-md"
        />

        {/* New input field for date selection */}
        <input
          type="datetime-local" // For selecting both date and time
          value={appointmentDate || formatDateForInput(selectedDate)} // Set default value from selected date if empty
          onChange={(e) => setAppointmentDate(e.target.value)}
          className="w-full border px-4 py-2 mb-4 rounded-md"
        />

        {/* Dropdown for category selection */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border px-4 py-2 mb-4 rounded-md"
        >
          <option value="">Kategorie wählen</option>
          <option value="Arztbesuch">Arztbesuch</option>
          <option value="Medikamente">Medikamente</option>
          <option value="Kontrolle">Kontrolle</option>
          <option value="Sonstiges">Sonstiges</option>
        </select>

        <textarea
          placeholder="Beschreibung"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-4 py-2 mb-4 rounded-md"
        />
      </div>

      <button
        onClick={handleSaveAppointment}
        className="bg-blue-500 text-white px-6 py-2 rounded-md mt-4"
      >
        Save Appointment
      </button>

      <h3 className="mt-6 font-bold mb-2">The list of your appointments:</h3>
      <ul>
        {appointments.map((appt) => (
          <li key={appt.id} className="mb-4">
            <strong>{appt.title}</strong>
            <br />
            {new Date(appt.appointment_date).toLocaleDateString()}
            <br />
            Kategorie: {appt.category}
            <br />
            Beschreibung: {appt.description}
            <button
              onClick={() => handleDeleteAppointment(appt.id)}
              className="bg-red-500 text-white ml-2 px-3 py-1 rounded-md"
            >
              Löschen
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Appointments;
