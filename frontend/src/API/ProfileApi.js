const API_URL = "http://localhost:5000"; // Replace with your actual API URL

// Fetch profile data
export const getProfile = async (token) => {
  const response = await fetch(`${API_URL}/profile`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

// Fetch allergies data
export const getAllergies = async () => {
  const response = await fetch(`${API_URL}/profile/allergies`);
  return response.json();
};

// Fetch medications data
export const getMedications = async () => {
  const response = await fetch(`${API_URL}/profile/medications`);
  return response.json();
};

// Fetch allergies and medications data
export const medicsandallergies = async () => {
  const response = await fetch(`${API_URL}/auth/profile/allergies-medications`);
  return response.json();
}

// Update profile data
export const updateProfile = async (token, profileData) => {
  const response = await fetch(`${API_URL}/profile/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
  return response.json();
};

// Update email address
export const updateEmail = async (token, newEmail) => {
  const response = await fetch(`${API_URL}/profile/update-email`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email: newEmail }),
  });
  return response.json();
};

// Update password
export const updatePassword = async (token, oldPassword, newPassword) => {
  const response = await fetch(`${API_URL}/profile/update-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  });
  return response.json();
};

// Delete profile
export const deleteProfile = async (token) => {
  const response = await fetch(`${API_URL}/profile`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to delete profile");
  return response.json();
};
