import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMedications, getAllergies } from "/src/api/PollenApi";

function RegisterForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    emailConfirm: "",
    password: "",
    passwordConfirm: "",
    dob: "",
    medications: [],
    allergies: [],
    acceptPolicy: false,
  });

  const [allergiesList, setAllergiesList] = useState([]);
  const [medicationsList, setMedicationsList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllergies = async () => {
      try {
        const response = await getAllergies();
        setAllergiesList(response);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchMedications = async () => {
      try {
        const response = await getMedications();
        setMedicationsList(response);
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
    const selectedId = e.target.value;
    const selectedAllergy = allergiesList.find((a) => String(a.id) === selectedId);

    if (selectedAllergy && !formData.allergies.some(a => a.id === selectedAllergy.id)) {
        setFormData({
            ...formData,
            allergies: [...formData.allergies, { id: selectedAllergy.id, name: selectedAllergy.name }],
        });
    }
  };

  const handleMedicationSelect = (e) => {
    const selectedId = e.target.value;
    const selectedMedication = medicationsList.find((m) => String(m.id) === selectedId);

    if (selectedMedication && !formData.medications.some(m => m.id === selectedMedication.id)) {
        setFormData({
            ...formData,
            medications: [...formData.medications, { id: selectedMedication.id, name: selectedMedication.name }],
        });
    }
  };

  const handleRemoveAllergy = (id) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter((a) => a.id !== id),
    });
  };

  const handleRemoveMedication = (id) => {
    setFormData({
      ...formData,
      medications: formData.medications.filter((m) => m.id !== id),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.email !== formData.emailConfirm) {
      alert("Email and Confirm Email do not match.");
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      alert("Password and Confirm Password do not match.");
      return;
    }

    if (!formData.acceptPolicy) {
      alert("You must accept the Terms and Conditions.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          allergies: formData.allergies.map((a) => a.id),
          medications: formData.medications.map((m) => m.id),
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
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>

        {/* First and Last Name */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name *</label>
            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name *</label>
            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
          </div>
        </div>

        {/* Email */}
        <label className="block text-sm font-medium text-gray-700 mt-3">Email *</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />

        {/* Confirm Email */}
        <label className="block text-sm font-medium text-gray-700 mt-3">Confirm Email *</label>
        <input type="email" name="emailConfirm" value={formData.emailConfirm} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />

        {/* Password */}
        <label className="block text-sm font-medium text-gray-700 mt-3">Password *</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />

        {/* Confirm Password */}
        <label className="block text-sm font-medium text-gray-700 mt-3">Confirm Password *</label>
        <input type="password" name="passwordConfirm" value={formData.passwordConfirm} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />

        {/* Date of Birth */}
        <label className="block text-sm font-medium text-gray-700 mt-3">Date of Birth *</label>
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />

 {/* Allergien Auswahl */}
 <label className="block text-sm font-medium text-gray-700">Allergies</label>
        <select onChange={handleAllergySelect} className="w-full p-2 border border-gray-300 rounded-md">
          <option value="">Select an allergy</option>
          {allergiesList.map((allergy) => (
            <option key={allergy.id} value={allergy.id}>
              {allergy.name}
            </option>
          ))}
        </select>

        <div className="mt-2">
          {formData.allergies.map((allergy) => (
            <span key={allergy.id} className="inline-flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded m-1">
              {allergy.name}
              <button onClick={() => handleRemoveAllergy(allergy.id)} className="ml-2 text-red-500">&times;</button>
            </span>
          ))}
        </div>

        {/* Medikamente Auswahl */}
        <label className="block text-sm font-medium text-gray-700 mt-4">Medications</label>
        <select onChange={handleMedicationSelect} className="w-full p-2 border border-gray-300 rounded-md">
          <option value="">Select a medication</option>
          {medicationsList.map((medication) => (
            <option key={medication.id} value={medication.id}>
              {medication.name}
            </option>
          ))}
        </select>

        <div className="mt-2">
          {formData.medications.map((medication) => (
            <span key={medication.id} className="inline-flex items-center bg-green-100 text-green-700 px-2 py-1 rounded m-1">
              {medication.name}
              <button onClick={() => handleRemoveMedication(medication.id)} className="ml-2 text-red-500">&times;</button>
            </span>
          ))}
        </div>


        {/* Accept Terms */}
        <div className="mt-3">
          <label className="inline-flex items-center">
            <input type="checkbox" name="acceptPolicy" checked={formData.acceptPolicy} onChange={handleChange} className="form-checkbox" required />
            <span className="ml-2 text-sm">I accept the Terms and Conditions</span>
          </label>
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 mt-4">
          Register now
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
