import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { } from "../API/appointmentsApi";
import NavigationButtons from "../components/NavigationButtons";

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);

  // State to hold appointment information
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
    const month = String(d.getMonth() + 1).padStart(2, '0'); // months are 0-based, so +1
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // Format: '2025-03-21 00:00:00'
  };

  // 🟢 Termin speichern
  const handleSaveAppointment = async () => {
    const formattedDate = formatDateForBackend(appointmentDate || selectedDate); // Use the input date or calendar date
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
    const response = await fetch(`http://localhost:5000/appointments/${appointmentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      alert("✅ Termin gelöscht!");
      setAppointments(appointments.filter((appt) => appt.id !== appointmentId));
    } else {
      alert("❌ Fehler beim Löschen des Termins.");
    }
  };

  return (
    
    <div className="flex flex-col items-center py-10">
      <div className="mb-10">
        <NavigationButtons />
      </div>
      <h2 className="text-2xl font-semibold text-center mb-4">My Appointments</h2>
      <Calendar
        onChange={setSelectedDate} // Sets selected date
        value={selectedDate} // Bind the selected date value
      />

      {/* Input fields for appointment details */}
      <div className="input-fields">
        <input
          type="text"
          placeholder="Titel des Termins"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-2 py-1 mb-2"
        />
        
        {/* New input field for date selection */}
        <input
          type="datetime-local" // For selecting both date and time
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          className="border px-2 py-1 mb-2"
        />
        
        {/* Dropdown for category selection */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-2 py-1 mb-2"
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
          className="border px-2 py-1 mb-2"
        />
      </div>

      <button
        onClick={handleSaveAppointment}
        className="bg-blue-500 text-white px-4 py-2 mt-4"
      >
        Termin speichern
      </button>

      <h3>Gespeicherte Termine:</h3>
      <ul>
        {appointments.map((appt) => (
          <li key={appt.id}>
            <strong>{appt.title}</strong><br />
            {new Date(appt.appointment_date).toLocaleDateString()}<br />
            Kategorie: {appt.category}<br />
            Beschreibung: {appt.description}
            <button
              onClick={() => handleDeleteAppointment(appt.id)}
              className="bg-red-500 text-white ml-2"
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
