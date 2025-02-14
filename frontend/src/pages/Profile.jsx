import { useState, useEffect } from "react";
import NavigationButtons from "../components/NavigationButtons";
import { getProfile } from "../api/ProfileApi";
import { Navigate } from "react-router-dom";

const ProfilePage = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found, redirecting to login");
    Navigate("/login");
  }
  useEffect(() => {
    getProfile(token).then((data) => {
      console.log("Profile Data:", data);
      setFormData(data);
    });
  }, [token]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    email: "",
    newEmail: "",
    medications: "",
    allergies: "",
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showPopup, setShowPopup] = useState(false); // State for controlling the popup

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "repeatPassword" || e.target.name === "newPassword") {
      if (formData.newPassword !== e.target.value) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError("");
      }
    }

    if (e.target.name === "newEmail") {
      if (formData.email === e.target.value) {
        setEmailError("New email must be different from current email");
      } else {
        setEmailError("");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.repeatPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (formData.email === formData.newEmail) {
      setEmailError("New email must be different from current email");
      return;
    }

    console.log("Profile Data Submitted:", formData);
    setShowPopup(true); // Show the popup when the form is successfully submitted
  };

  const formatDateForInput = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="flex flex-col items-center py-10">
      <div className="mb-10">
        <NavigationButtons />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Profile Information
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstName"
            value={formData.first_name}
            placeholder="First Name"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
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
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="newEmail"
            placeholder="New Email"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
          <input
            type="text"
            name="medications"
            value={formData.medications}
            placeholder="Medications"
            className="w-full p-2 border rounded"
            onChange={handleChange}
          />
          <input
            type="text"
            name="allergies"
            value={formData.allergies}
            placeholder="Allergies"
            className="w-full p-2 border rounded"
            onChange={handleChange}
          />
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            placeholder="Current Password"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="repeatPassword"
            placeholder="Repeat New Password"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Save Profile
          </button>
        </form>
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Success!</h2>
            <p>Your profile information has been updated.</p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { ProfilePage };
