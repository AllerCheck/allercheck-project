const API_URL = "http://localhost:5000"; // Falls das Backend online läuft, ersetze die URL.

export const getProfile = async (token) => {
    const response = await fetch(`${API_URL}/profile`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });
    return response.json();
};

export const updateProfile = async (token, profileData) => {
    const response = await fetch(`${API_URL}/profile/update`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
    });
    return response.json();
};

export const updateEmail = async (token, newEmail) => {
    const response = await fetch(`${API_URL}/profile/update-email`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ email: newEmail }),
    });
    return response.json();
};

export const updatePassword = async (token, oldPassword, newPassword) => {
    const response = await fetch(`${API_URL}/profile/update-password`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword }),
    });
    return response.json();
};

export const deleteProfile = async (token) => {
    const response = await fetch(`${API_URL}/profile`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Fehler beim Löschen des Profils");
    return response.json();
};

export const getAllergies = async () => {
    const response = await fetch("http://localhost:5000/profile/allergies");
    return response.json();
};

export const getMedications = async () => {
    const response = await fetch("http://localhost:5000/profile/medications");
    return response.json();
};