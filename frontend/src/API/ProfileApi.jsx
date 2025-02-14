const API_URL = "http://localhost:5000"; // Falls das Backend online läuft, ersetze die URL.

export const getProfile = async (token) => {
    const response = await fetch(`${API_URL}/profile`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
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

export const updateAuth = async (token, authData) => {
    const response = await fetch(`${API_URL}/profile/update-auth`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(authData),
    });
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