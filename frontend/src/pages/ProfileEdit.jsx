// src/components/ProfileEdit.jsx
import React, { useState } from "react";
import { updateProfile } from "../api/Profile";

const ProfileEdit = () => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        dob: "",
        medications: "",
        allergies: ""
    });

    const token = localStorage.getItem("token"); // Retrieve token from local storage

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            console.error("No token found!");
            return;
        }
        const response = await updateProfile(token, formData);
        console.log("Server Response:", response);
        alert("Profile Updated Successfully!");
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-center mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        className="w-full p-2 border rounded"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        className="w-full p-2 border rounded"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="date"
                        name="dob"
                        className="w-full p-2 border rounded"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="medications"
                        placeholder="Medications"
                        className="w-full p-2 border rounded"
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="allergies"
                        placeholder="Allergies"
                        className="w-full p-2 border rounded"
                        onChange={handleChange}
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Save Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileEdit;
