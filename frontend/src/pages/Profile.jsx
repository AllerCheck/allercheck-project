import React, { useState } from "react";

const Button = ({ label, onClick }) => {
  return (
    <button
      className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
      onClick={onClick}
    >
      {label}
    </button>
  );
};

const NavigationButtons = ({ navigate }) => {
  return (
    <div className="flex gap-4 mb-4">
      <Button label="Journal" onClick={() => navigate('/journal')} />
      <Button label="Statistics" onClick={() => navigate('/statistics')} />
      <Button label="Appointments" onClick={() => navigate('/appointments')} />
      <Button label="Find a Doctor" onClick={() => navigate('/find')} />
      <Button label="Profile" onClick={() => navigate('/profile')} />
    </div>
  );
};

const ProfilePage = ({ navigate }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    medications: "",
    allergies: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile Data Submitted:", formData);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <NavigationButtons navigate={navigate} />
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Profile Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="firstName" placeholder="First Name" className="w-full p-2 border rounded" onChange={handleChange} required />
          <input type="text" name="lastName" placeholder="Last Name" className="w-full p-2 border rounded" onChange={handleChange} required />
          <input type="date" name="dob" className="w-full p-2 border rounded" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" className="w-full p-2 border rounded" onChange={handleChange} required />
          <input type="text" name="medications" placeholder="Medications" className="w-full p-2 border rounded" onChange={handleChange} />
          <input type="text" name="allergies" placeholder="Allergies" className="w-full p-2 border rounded" onChange={handleChange} />
          <input type="password" name="password" placeholder="New Password" className="w-full p-2 border rounded" onChange={handleChange} required />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Save Profile</button>
        </form>
      </div>
    </div>
  );
};

export { ProfilePage, Button, NavigationButtons };

