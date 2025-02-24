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
    <div className="flex flex-col items-center py-10 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
    <h2 className="p-2 mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 font-extrabold text-5xl">
      My Calendar
    </h2>
      <div style={{ width: "0%", height: "500px" }} className="min-w-96 p-6 bg-white shadow-lg rounded-lg flex justify-center mb-6 ">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={tileContent} // Display fetched appointments
        />
      </div>
  
    <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 font-extrabold text-5xl mb-2 p-2">New Appointment</h3>
    <div className="max-w-5xl min-w-96 mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="w-full max-w-md px-4">
        <input
          type="text"
          placeholder="Titel des Termins"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-4 py-2 mb-4 rounded-md"
        />
  
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
          className="w-full border px-4 py-2 mb-2 rounded-md"
        />
      </div>
  
      <button
        onClick={handleSaveAppointment}
        className="w-full bg-gray-700 text-white hover:text-gray-700 text-lg font-semibold rounded-md hover:bg-gradient-to-r hover:from-yellow-300 hover:to-yellow-600 mt-4 transition-all cursor-pointer p-2"
      >
        Save Appointment
      </button>
      </div>
      <div>
      <h3 className="mt-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 font-extrabold text-5xl mb-2 p-2">My Appointments</h3>
      <ul>
  {appointments.map((appt) => (
    <li key={appt.id} className="mb-4 p-4 bg-gray-100 shadow rounded-md flex justify-between items-center">
      <div>
        <strong>{appt.title}</strong>
        <br />
        Date and Time: {appt.appointment_date.toLocaleString()}
        <br />
        Category: {appt.category}
        <br />
        Description: {appt.description}
      </div>
      <button
        onClick={() => handleDeleteAppointment(appt.id)}
        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-gradient-to-r hover:from-yellow-300 hover:to-yellow-600 hover:font-bold hover:text-red-500 transition ml-4"
      >
        Delete
      </button>
    </li>
  ))}
</ul>
      </div>
  </div>
  
  );
};

export default Appointments;
