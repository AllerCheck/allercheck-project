export const fetchAppointments = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:5000/appointments", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.ok ? response.json() : [];
};
export const saveAppointment = async (appointment) => {
  const token = localStorage.getItem("token");
  return await fetch("http://localhost:5000/appointments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointment),
  });
};
