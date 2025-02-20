// src/pages/Appointments.jsx
import React, { useState, useEffect } from "react";
import {
  getAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
} from "../API/appointmentsApi";
import NavigationButtons from "../components/NavigationButtons";

const Appointments = ({ token }) => {
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    date: "",
    time: "09:00", // Default suggested time
    description: "",
  });
  const [editAppointment, setEditAppointment] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch appointments when the component mounts
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const appointmentsData = await getAppointments(token);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error("Fehler beim Abrufen der Termine:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [token]);

  // Automatically suggest a time based on selected date
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setNewAppointment({
      ...newAppointment,
      date: selectedDate,
      time: "09:00", // Suggested time (e.g., morning)
    });
  };

  // Handle form submission for adding a new appointment
  const handleAddAppointment = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const newAppointmentData = await addAppointment(token, newAppointment);
      setAppointments((prev) => [...prev, newAppointmentData]);
      setNewAppointment({ date: "", time: "", description: "" }); // Clear form
    } catch (error) {
      console.error("Fehler beim Hinzufügen des Termins:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle updating an appointment
  const handleUpdateAppointment = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const updatedData = await updateAppointment(
        token,
        editAppointment.id,
        editAppointment
      );
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === updatedData.id ? updatedData : appointment
        )
      );
      setEditAppointment(null); // Clear the edit form
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Termins:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting an appointment
  const handleDeleteAppointment = async (id) => {
    try {
      setLoading(true);
      await deleteAppointment(token, id);
      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== id)
      );
    } catch (error) {
      console.error("Fehler beim Löschen des Termins:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-10 bg-gray-100 min-h-screen">
      <div className="mb-10">
        <NavigationButtons />
      </div>
      <h1 className="text-4xl font-bold mb-6">Your Appointments</h1>

      {/* Loading state */}
      {loading && <p className="text-lg text-gray-600">Loading...</p>}

      {/* Add new appointment form */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Add a New Appointment</h2>
        <form onSubmit={handleAddAppointment} className="space-y-4">
          <input
            type="date"
            value={newAppointment.date}
            onChange={handleDateChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
          <input
            type="time"
            value={newAppointment.time}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, time: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
          <textarea
            placeholder="Description"
            value={newAppointment.description}
            onChange={(e) =>
              setNewAppointment({
                ...newAppointment,
                description: e.target.value,
              })
            }
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Appointment
          </button>
        </form>
      </div>

      {/* Edit appointment form */}
      {editAppointment && (
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Edit Appointment</h2>
          <form onSubmit={handleUpdateAppointment} className="space-y-4">
            <input
              type="date"
              value={editAppointment.date}
              onChange={(e) =>
                setEditAppointment({ ...editAppointment, date: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
            <input
              type="time"
              value={editAppointment.time}
              onChange={(e) =>
                setEditAppointment({ ...editAppointment, time: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
            <textarea
              value={editAppointment.description}
              onChange={(e) =>
                setEditAppointment({
                  ...editAppointment,
                  description: e.target.value,
                })
              }
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
            <div className="flex gap-4">
              <button
                type="submit"
                className="w-1/2 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Update Appointment
              </button>
              <button
                type="button"
                onClick={() => setEditAppointment(null)}
                className="w-1/2 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Display list of appointments */}
      <h2 className="text-2xl font-semibold mb-4">Upcoming Appointments</h2>
      <div className="space-y-4 w-full max-w-md">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white p-6 shadow-lg rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="text-xl font-semibold">
                {appointment.date} at {appointment.time}
              </p>
              <p className="text-gray-600">{appointment.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditAppointment(appointment)}
                className="py-2 px-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteAppointment(appointment.id)}
                className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Appointments;
