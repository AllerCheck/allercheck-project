import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {} from "../API/appointmentsApi";

const AppointmentCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  
  // State to hold appointment information
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

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

  // 🟢 Termin speichern
  const handleSaveAppointment = async () => {
    const response = await fetch("http://localhost:5000/appointments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,          // use the input field value for title
        appointment_date: selectedDate,
        category: category,    // use the input field value for category
        description: description, // use the input field value for description
      }),
    });

    if (response.ok) {
      alert("✅ Termin gespeichert!");
      setAppointments([...appointments, { appointment_date: selectedDate, title, category, description }]);
      setTitle("");          // Reset fields
      setCategory("");       // Reset fields
      setDescription("");    // Reset fields
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
      setAppointments(appointments.filter(appt => appt.id !== appointmentId));
    } else {
      alert("❌ Fehler beim Löschen des Termins.");
    }
  };
  
  return (
    <div className="calendar-container">
      <h2>Meine Termine</h2>
      <Calendar onChange={setSelectedDate} value={selectedDate} />
      
      {/* Input fields for appointment details */}
      <div className="input-fields">
        <input
          type="text"
          placeholder="Titel des Termins"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-2 py-1 mb-2"
        />
        <input
          type="text"
          placeholder="Kategorie"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-2 py-1 mb-2"
        />
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
      
      {/* Delete appointment (if needed) */}
      <button
        onClick={handleDeleteAppointment}
        className="bg-red-500 text-white px-4 py-2 mt-4"
      >
        Termin löschen
      </button>

      <h3>Gespeicherte Termine:</h3>
      <ul>
        {appointments.map((appt, index) => (
          <li key={index}>
            <strong>{appt.title}</strong><br />
            {new Date(appt.appointment_date).toLocaleDateString()}<br />
            Kategorie: {appt.category}<br />
            Beschreibung: {appt.description}
            <button onClick={() => handleDeleteAppointment(appt.id)} className="bg-red-500 text-white ml-2">
              Löschen
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentCalendar;
