import { useState, useEffect } from "react";
import {
  getProfile,
  getAllergies,
  getMedications,
  updateProfile,
  updateEmail,
  updatePassword,
  deleteProfile,
} from "../api/ProfileApi";
import { Navigate } from "react-router-dom";
import NavigationButtons from "../components/NavigationButtons";

const ProfilePage = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found, redirecting to login");
    Navigate("/login");
  }

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

        const allergiesData = await getAllergies();
        setFormData((prevData) => ({
          ...prevData,
          allergies:
            allergiesData.length > 0
              ? allergiesData.map((allergy) => allergy.name).join(", ")
              : "Not listed", // Check if allergies are listed
        }));

        const medicationsData = await getMedications();
        setFormData((prevData) => ({
          ...prevData,
          medications:
            medicationsData.length > 0
              ? medicationsData.map((med) => med.name).join(", ")
              : "Not listed", // Check if medications are listed
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

  // Format date for input field
  const formatDateForInput = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
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
  const handleDeleteProfile = async () => {
    try {
      await deleteProfile(token);
      localStorage.removeItem("token"); // Remove token upon deletion
      Navigate("/login"); // Redirect to login after profile deletion
    } catch (error) {
      console.error("Error deleting profile:", error);
      setError("Failed to delete profile.");
    }
  };

  return (
    <div className="flex flex-col items-center py-10">
      <div className="mb-10">
        <NavigationButtons />
      </div>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Profile Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            placeholder="First Name"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            placeholder="Last Name"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="dob"
            value={formData.dob ? formatDateForInput(formData.dob) : ""}
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />

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

          {/* Editable Allergies Field */}
          <div>
            <label className="block font-medium">Allergies:</label>
            <input
              type="text"
              name="allergies"
              value={formData.allergies}
              placeholder="Enter your allergies"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
          </div>

          {/* Editable Medications Field */}
          <div>
            <label className="block font-medium">Medications:</label>
            <input
              type="text"
              name="medications"
              value={formData.medications}
              placeholder="Enter your medications"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
          </div>

          {/* Password fields */}
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
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-4"
          >
            Save Profile
          </button>

          {/* Delete profile button */}
          <button
            type="button"
            onClick={handleDeleteProfile}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 mt-4"
          >
            Delete Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export { ProfilePage };
