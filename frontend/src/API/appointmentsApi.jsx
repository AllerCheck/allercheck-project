const API_URL = "http://localhost:5000/appointments";

// 🟢 Fetch all appointments
export const getAppointments = async (token) => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok)
      throw new Error(`Failed to fetch appointments: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw new Error("Error fetching appointments. Please try again later.");
  }
};

// 🟢 Add a new appointment
export const addAppointment = async (token, appointmentData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(appointmentData),
    });
    if (!response.ok)
      throw new Error(`Failed to add appointment: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("Error adding appointment:", error);
    throw new Error("Error adding appointment. Please try again later.");
  }
};

// 🟠 Update an existing appointment
export const updateAppointment = async (token, id, appointmentData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(appointmentData),
    });
    if (!response.ok)
      throw new Error(`Failed to update appointment: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw new Error("Error updating appointment. Please try again later.");
  }
};

// 🔴 Delete an appointment
export const deleteAppointment = async (token, id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok)
      throw new Error(`Failed to delete appointment: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw new Error("Error deleting appointment. Please try again later.");
  }
};
