const API_URL = "http://localhost:5000/appointments";

// 🟢 Alle Termine abrufen
export const getAppointments = async (token) => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error("Fehler beim Abrufen der Termine");
    }

    return await response.json();
  } catch (error) {
    console.error("Fehler beim Abrufen der Termine:", error);
    throw error;
  }
};

// 🟢 Neuen Termin hinzufügen
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

    if (!response.ok) {
      // Log the response body to help with debugging
      const errorData = await response.json();
      console.error("API error response:", errorData);
      throw new Error("Fehler beim Hinzufügen des Termins");
    }

    return await response.json();
  } catch (error) {
    console.error("Fehler beim Hinzufügen des Termins:", error);
    throw error;
  }
};

// 🟠 Termin aktualisieren
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
    if (!response.ok) throw new Error("Fehler beim Aktualisieren des Termins");
    return await response.json();
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Termins:", error);
    throw error;
  }
};

// 🔴 Termin löschen
export const deleteAppointment = async (token, id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Fehler beim Löschen des Termins");
    return await response.json();
  } catch (error) {
    console.error("Fehler beim Löschen des Termins:", error);
    throw error;
  }
};
