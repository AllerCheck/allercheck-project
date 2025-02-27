import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProfile,
  updateProfile,
  updateEmail,
  updatePassword,
  getAllergies,
  getMedications,
} from "src/api/ProfileApi";
// import NavigationButtons from "../components/NavigationButtons";

const ProfilePage = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    email: "",
    newEmail: "",
    medications: "Not listed", // Default value for medications
    allergies: "Not listed", // Default value for allergies
    oldPassword: "",
    newPassword: "",
  });

  const [showNewEmailSheet, setShowNewEmailSheet] = useState(false); // Toggle for new email sheet
  const [showNewPasswordFields, setShowNewPasswordFields] = useState(false); // Toggle for password fields
  const [error, setError] = useState(""); // To show errors

  // Fetch profile data, allergies, and medications on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await getProfile(token);
        setFormData((prevData) => ({
          ...prevData,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          dob: profileData.dob,
          email: profileData.email,
        }));

        const allergiesData = await getAllergies(token);
        const medicationsData = await getMedications(token);

        setFormData((prevData) => ({
          ...prevData,
          allergies:
            allergiesData.length > 0
              ? allergiesData.map((allergy) => allergy.name).join(", ")
              : "Not listed", // Default if no allergies
          medications:
            medicationsData.length > 0
              ? medicationsData.map((med) => med.name).join(", ")
              : "Not listed", // Default if no medications
        }));
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Failed to load profile data.");
      }
    };

    fetchData();
  }, [token]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle new email input field
  const toggleNewEmailSheet = () => {
    setShowNewEmailSheet(!showNewEmailSheet);
  };

  // Toggle new password input fields
  const toggleNewPasswordFields = () => {
    setShowNewPasswordFields(!showNewPasswordFields);
  };

  // Handle form submission (update profile, email, and password)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // If new email is provided, update email
      if (formData.newEmail) {
        await updateEmail(token, formData.newEmail);
      }

      // If old and new password are provided, update password
      if (formData.oldPassword && formData.newPassword) {
        await updatePassword(token, formData.oldPassword, formData.newPassword);
      }

      // Update profile data (if needed)
      const profileUpdateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        dob: formData.dob,
      };
      await updateProfile(token, profileUpdateData);

      setError(""); // Reset error state on successful update
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile.");
    }
  };

  // Handle profile deletion
  // Handle profile deletion
  const handleDeleteProfile = async () => {
    try {
      const response = await fetch("http://localhost:5000/profile/delete", {
        // Correct endpoint
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete profile");
      }

      localStorage.removeItem("token");
      alert("Profile deleted successfully");
      navigate("/login"); // ✅ Correct redirection
    } catch (error) {
      console.error("Error deleting profile:", error);
      setError("Failed to delete profile.");
    }
  };

  // Format date for displaying as text
  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="flex flex-col items-center py-10">
      {/* <div className="mb-10">
        <NavigationButtons />
      </div> */}

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <h2 className="p-2 mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 font-extrabold text-5xl">
        Profile
      </h2>
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Displaying first_name and last_name as text */}
          <div className="text-lg">
            <strong>First Name: </strong>
            {formData.first_name}
          </div>
          <div className="text-lg">
            <strong>Last Name: </strong>
            {formData.last_name}
          </div>

          {/* Displaying dob as text */}
          <div className="text-lg">
            <strong>Date of Birth: </strong>
            {formatDate(formData.dob)}
          </div>

          {/* Editable email */}
          <div className="relative flex items-center">
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Email"
              className="w-full p-2 border rounded"
              onChange={handleChange}
              disabled
            />
            <span
              onClick={toggleNewEmailSheet}
              className="absolute right-2 cursor-pointer text-blue-500 hover:text-blue-700"
            >
              ✎
            </span>
          </div>

          {showNewEmailSheet && (
            <div className="mt-4">
              <input
                type="email"
                name="newEmail"
                value={formData.newEmail}
                placeholder="Enter New Email"
                className="w-full p-2 border rounded"
                onChange={handleChange}
              />
            </div>
          )}

          {/* Displaying allergies and medications as text */}
          <div className="text-lg">
            <strong>Allergies: </strong>
            {formData.allergies}
          </div>
          <div className="text-lg">
            <strong>Medications: </strong>
            {formData.medications}
          </div>

          {/* Editable password fields */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={toggleNewPasswordFields}
              className="text-blue-500 hover:text-blue-700"
            >
              Change Password
            </button>
          </div>

          {showNewPasswordFields && (
            <div>
              <input
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                placeholder="Old Password"
                className="w-full p-2 border rounded mt-2"
                onChange={handleChange}
              />
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                placeholder="New Password"
                className="w-full p-2 border rounded mt-2"
                onChange={handleChange}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gray-700 text-white hover:text-gray-700 text-lg font-semibold rounded-md hover:bg-gradient-to-r hover:from-yellow-300 hover:to-yellow-600 mt-4 transition-all cursor-pointer p-2"
          >
            Save Profile
          </button>

          {/* Delete profile button */}
          <button
            type="button"
            onClick={handleDeleteProfile}
            className="w-full bg-orange-700 text-white text-lg font-semibold rounded-md hover:bg-gradient-to-r hover:from-yellow-300 hover:to-yellow-600 hover:font-bold hover:text-red-500 mt-4 transition-all cursor-pointer p-2"
          >
            Delete Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export { ProfilePage };
