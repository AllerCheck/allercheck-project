import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {} from "../API/appointmentsApi";

const AppointmentCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);

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
        title: "Neuer Termin",
        appointment_date: selectedDate,
        category: "Allergie-Test",
        description: "Testbesuch beim Arzt",
      }),
    });

    if (response.ok) {
      alert("✅ Termin gespeichert!");
      setAppointments([...appointments, { appointment_date: selectedDate }]);
    } else {
      alert("❌ Fehler beim Speichern des Termins.");
    }
  };

  return (
    <div className="calendar-container">
      <h2>Meine Termine</h2>
      <Calendar onChange={setSelectedDate} value={selectedDate} />
      <button
        onClick={handleSaveAppointment}
        className="bg-blue-500 text-white px-4 py-2 mt-4"
      >
        Termin speichern
      </button>

      <h3>Gespeicherte Termine:</h3>
      <ul>
        {appointments.map((appt, index) => (
          <li key={index}>
            {new Date(appt.appointment_date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentCalendar;
