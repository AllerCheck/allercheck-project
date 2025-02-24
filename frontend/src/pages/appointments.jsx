import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:5000/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();

          // Ensure appointment dates are properly converted to Date objects
          const formattedAppointments = data.map((appt) => ({
            ...appt,
            appointment_date: new Date(appt.appointment_date),
          }));

          setAppointments(formattedAppointments);
        }
      } catch (error) {
        console.error("❌ Fehler beim Laden der Termine:", error);
      }
    };

    fetchAppointments();
  }, [token]);

  const formatDateForBackend = (date) => {
    // Convert the date to a string that can be saved
    return new Date(date).toISOString().slice(0, 19).replace("T", " ");
  };

  // Ensure the selected date is set correctly for the input (only date part, no time)
  const formatDateForInput = (date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0); // Normalize to midnight of the selected day
    return normalizedDate.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:MM
  };

  // Combine the date from the calendar and the selected time from the input field
  const combineDateAndTime = (date, time) => {
    const combinedDate = new Date(date);
    const [hours, minutes] = time.split(":");
    combinedDate.setHours(hours, minutes, 0, 0); // Set the time part
    return combinedDate;
  };

  const handleSaveAppointment = async () => {
    const combinedDate = combineDateAndTime(selectedDate, appointmentTime || "00:00");

    const formattedDate = formatDateForBackend(combinedDate);

    const response = await fetch("http://localhost:5000/appointments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        appointment_date: formattedDate,
        category,
        description,
      }),
    });

    if (response.ok) {
      alert("✅ Termin gespeichert!");

      const newAppointment = {
        id: Math.random(), // Temporary ID for UI update
        appointment_date: combinedDate,
        title,
        category,
        description,
      };

      setAppointments([...appointments, newAppointment]);
      setTitle("");
      setCategory("");
      setDescription("");
      setAppointmentTime("");
      setSelectedDate(new Date());
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

  // Display fetched appointments on the calendar
  const tileContent = ({ date }) => {
    const dateStr = date.toISOString().split("T")[0];

    const currentAppointments = appointments.filter((appt) => {
      const apptDateStr = appt.appointment_date.toISOString().split("T")[0];
      return apptDateStr === dateStr;
    });

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
      <h2 className="text-2xl font-semibold text-center mb-4">My Appointments</h2>

      <div className="w-full max-w-md flex justify-center mb-10">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={tileContent} // Display fetched appointments
        />
      </div>

      <div className="w-full max-w-md px-4">
        <input
          type="text"
          placeholder="Titel des Termins"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-4 py-2 mb-4 rounded-md"
        />

        {/* <input
          type="date"
          value={formatDateForInput(selectedDate)} // Only date, no time
          readOnly
          className="w-full border px-4 py-2 mb-4 rounded-md"
        /> */}

        <input
          type="time"
          value={appointmentTime}
          onChange={(e) => setAppointmentTime(e.target.value)}
          className="w-full border px-4 py-2 mb-4 rounded-md"
        />

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
            {appt.appointment_date.toLocaleString()}
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
