import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    emailConfirm: "",
    password: "",
    passwordConfirm: "",
    dob: "",
    medications: "",
    allergies: "",
    acceptPolicy: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registration successful!");
      navigate("/login");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name *</label>
            <input 
              type="text" 
              name="firstName" 
              value={formData.firstName} 
              onChange={handleChange} 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name *</label>
            <input 
              type="text" 
              name="lastName" 
              value={formData.lastName} 
              onChange={handleChange} 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" 
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email *</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Repeat Email *</label>
            <input 
              type="email" 
              name="emailConfirm" 
              value={formData.emailConfirm} 
              onChange={handleChange} 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" 
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Password *</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Repeat Password *</label>
            <input 
              type="password" 
              name="passwordConfirm" 
              value={formData.passwordConfirm} 
              onChange={handleChange} 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" 
            />
          </div>
        </div>
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700">D.O.B</label>
          <input 
            type="date" 
            name="dob" 
            value={formData.dob} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" 
          />
        </div>
        <div className="flex items-center mt-3">
          <input 
            type="checkbox" 
            name="acceptPolicy" 
            checked={formData.acceptPolicy} 
            onChange={handleChange} 
            className="mr-2" 
          />
          <label className="text-sm font-medium text-gray-700">Accept Policy *</label>
        </div>
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700">Medications:</label>
          <input 
            type="text" 
            name="medications" 
            value={formData.medications} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" 
          />
        </div>
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700">Allergies:</label>
          <input 
            type="text" 
            name="allergies" 
            value={formData.allergies} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" 
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 mt-4">
          Register now
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
