import { useEffect, useState } from "react";
import {
  getAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
} from "../API/appointmentsApi"; // Ensure correct path
import NavigationButtons from "../components/NavigationButtons"; // Ensure correct path

const Appointments = ({ token }) => {
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    title: "",
    appointment_date: "",
    category: "",
    description: "",
  });
  const [editAppointment, setEditAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await getAppointments(token);
      setAppointments(data);
    } catch (error) {
      console.error("Error loading appointments", error);
    }
  };

  const handleAdd = async () => {
    try {
      await addAppointment(token, {
        title: newAppointment.title,
        appointment_date: newAppointment.appointment_date,
        category: newAppointment.category,
        description: newAppointment.description,
      });
      setNewAppointment({
        title: "",
        appointment_date: "",
        category: "",
        description: "",
      });
      fetchAppointments();
    } catch (error) {
      console.error("Error adding appointment", error);
    }
  };

  const handleUpdate = async () => {
    if (!editAppointment) return;
    try {
      await updateAppointment(token, editAppointment.id, editAppointment);
      setEditAppointment(null);
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAppointment(token, id);
      fetchAppointments();
    } catch (error) {
      console.error("Error deleting appointment", error);
    }
  };

  return (
    <div className="flex flex-col items-center py-10 bg-gray-100 min-h-screen">
      {/* Navigation Buttons */}
      <div className="mb-10">
        <NavigationButtons />
      </div>

      <h1 className="text-3xl font-bold mb-6 text-blue-600">Appointments</h1>

      {/* Add Appointment */}
      <div className="mb-6 flex flex-wrap gap-4 justify-center">
        <input
          type="text"
          placeholder="Title"
          value={newAppointment.title}
          onChange={(e) =>
            setNewAppointment({ ...newAppointment, title: e.target.value })
          }
          className="border p-3 rounded-md shadow-md w-72"
        />
        <input
          type="date"
          value={newAppointment.appointment_date}
          onChange={(e) =>
            setNewAppointment({
              ...newAppointment,
              appointment_date: e.target.value,
            })
          }
          className="border p-3 rounded-md shadow-md w-72"
        />
        <input
          type="text"
          placeholder="Category"
          value={newAppointment.category}
          onChange={(e) =>
            setNewAppointment({ ...newAppointment, category: e.target.value })
          }
          className="border p-3 rounded-md shadow-md w-72"
        />
        <input
          type="text"
          placeholder="Description"
          value={newAppointment.description}
          onChange={(e) =>
            setNewAppointment({
              ...newAppointment,
              description: e.target.value,
            })
          }
          className="border p-3 rounded-md shadow-md w-72"
        />
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-green-600 transition"
        >
          Add Appointment
        </button>
      </div>

      {/* Appointments List */}
      <ul className="w-full max-w-4xl bg-white rounded-lg shadow-md">
        {appointments.map((appointment) => (
          <li
            key={appointment.id}
            className="mb-4 p-4 border-b last:border-0 flex justify-between items-center"
          >
            {editAppointment && editAppointment.id === appointment.id ? (
              <div className="flex gap-4">
                <input
                  type="text"
                  value={editAppointment.title}
                  onChange={(e) =>
                    setEditAppointment({
                      ...editAppointment,
                      title: e.target.value,
                    })
                  }
                  className="border p-3 rounded-md w-72"
                />
                <input
                  type="date"
                  value={editAppointment.appointment_date}
                  onChange={(e) =>
                    setEditAppointment({
                      ...editAppointment,
                      appointment_date: e.target.value,
                    })
                  }
                  className="border p-3 rounded-md w-72"
                />
                <input
                  type="text"
                  value={editAppointment.category}
                  onChange={(e) =>
                    setEditAppointment({
                      ...editAppointment,
                      category: e.target.value,
                    })
                  }
                  className="border p-3 rounded-md w-72"
                />
                <input
                  type="text"
                  value={editAppointment.description}
                  onChange={(e) =>
                    setEditAppointment({
                      ...editAppointment,
                      description: e.target.value,
                    })
                  }
                  className="border p-3 rounded-md w-72"
                />
                <button
                  onClick={handleUpdate}
                  className="bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-600 transition"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div>
                <span className="font-semibold">{appointment.title}</span> -{" "}
                <span>{appointment.appointment_date}</span> -{" "}
                <span className="italic">{appointment.category}</span> -{" "}
                {appointment.description}
              </div>
            )}
            <div className="flex gap-4">
              <button
                onClick={() => setEditAppointment(appointment)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(appointment.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Appointments;
