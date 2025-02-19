import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMedications, getAllergies } from "../api/ProfileApi";

function RegisterForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    emailConfirm: "",
    password: "",
    passwordConfirm: "",
    dob: "",
    medications: [], // Array for medications
    allergies: [], // Array for allergies
    acceptPolicy: false,
  });

  const [allergiesList, setAllergiesList] = useState([]);
  const [medicationsList, setMedicationsList] = useState([]);

  const [allergiesMenuOpen, setAllergiesMenuOpen] = useState(false);
  const [medicationsMenuOpen, setMedicationsMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch allergies from backend
    const fetchAllergies = async () => {
      try {
        const response = await getAllergies();
        setAllergiesList(response); // Store response directly
      } catch (error) {
        console.error(error);
      }
    };

    // Fetch medications from backend
    const fetchMedications = async () => {
      try {
        const response = await getMedications();
        setMedicationsList(response); // Store response directly
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllergies();
    fetchMedications();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAllergySelect = (e) => {
    const selectedAllergy = e.target.value;
    setFormData({
      ...formData,
      allergies: [...formData.allergies, selectedAllergy], // Add selected allergy
    });
    setAllergiesMenuOpen(false); // Close menu after selection
  };

  const handleMedicationSelect = (e) => {
    const selectedMedication = e.target.value;
    setFormData({
      ...formData,
      medications: [...formData.medications, selectedMedication], // Add selected medication
    });
    setMedicationsMenuOpen(false); // Close menu after selection
  };

  const handleRemoveAllergy = (allergy) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter((item) => item !== allergy),
    });
  };

  const handleRemoveMedication = (medication) => {
    setFormData({
      ...formData,
      medications: formData.medications.filter((item) => item !== medication),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if email and confirm email match
    if (formData.email !== formData.emailConfirm) {
      alert("Email and Confirm Email do not match.");
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.passwordConfirm) {
      alert("Password and Confirm Password do not match.");
      return;
    }

    // Check if user accepts the policy
    if (!formData.acceptPolicy) {
      alert("You must accept the Terms and Conditions.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData, // Send the entire form data
          allergies: formData.allergies, // Ensure allergies are included as an array
          medications: formData.medications, // Ensure medications are included as an array
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration.");
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>

        {/* First and Last Name */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name *
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name *
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Confirm Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm Email *
          </label>
          <input
            type="email"
            name="emailConfirm"
            value={formData.emailConfirm}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password *
          </label>
          <input
            type="password"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date of Birth *
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Allergies Dropdown */}
        <div className="relative mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Allergies (Required)
          </label>
          <button
            type="button"
            onClick={() => setAllergiesMenuOpen(!allergiesMenuOpen)}
            className="w-full p-2 border border-gray-300 rounded-md text-left focus:ring-2 focus:ring-blue-500"
          >
            {formData.allergies.length > 0
              ? `Selected Allergies (${formData.allergies.length})`
              : "Select Allergies"}
            <svg
              className="w-5 h-5 inline ml-2 transform transition-transform duration-200"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{
                transform: allergiesMenuOpen
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {allergiesMenuOpen && (
            <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-md max-h-48 overflow-y-auto z-10">
              {allergiesList.map((allergy) => (
                <button
                  key={allergy.id}
                  value={allergy.id}
                  onClick={handleAllergySelect}
                  className="w-full text-left p-2 hover:bg-gray-100"
                >
                  {allergy.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700">
            Selected Allergies:
          </h3>
          <div className="flex flex-wrap gap-2">
            {formData.allergies.map((allergy, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm"
              >
                {allergy}
                <button
                  type="button"
                  onClick={() => handleRemoveAllergy(allergy)}
                  className="ml-2 text-red-500"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Medications Dropdown */}
        <div className="relative mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Medications (Required)
          </label>
          <button
            type="button"
            onClick={() => setMedicationsMenuOpen(!medicationsMenuOpen)}
            className="w-full p-2 border border-gray-300 rounded-md text-left focus:ring-2 focus:ring-blue-500"
          >
            {formData.medications.length > 0
              ? `Selected Medications (${formData.medications.length})`
              : "Select Medications"}
            <svg
              className="w-5 h-5 inline ml-2 transform transition-transform duration-200"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{
                transform: medicationsMenuOpen
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {medicationsMenuOpen && (
            <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-md max-h-48 overflow-y-auto z-10">
              {medicationsList.map((med) => (
                <button
                  key={med.id}
                  value={med.id}
                  onClick={handleMedicationSelect}
                  className="w-full text-left p-2 hover:bg-gray-100"
                >
                  {med.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700">
            Selected Medications:
          </h3>
          <div className="flex flex-wrap gap-2">
            {formData.medications.map((medication, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm"
              >
                {medication}
                <button
                  type="button"
                  onClick={() => handleRemoveMedication(medication)}
                  className="ml-2 text-red-500"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Accept Terms */}
        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="acceptPolicy"
              checked={formData.acceptPolicy}
              onChange={handleChange}
              className="form-checkbox"
              required
            />
            <span className="ml-2 text-sm">
              I accept the Terms and Conditions
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 mt-4"
        >
          Register now
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
