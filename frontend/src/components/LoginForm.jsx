import { Link } from "react-router-dom";

function LoginForm() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
      <form className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="text"
          id="email"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        />

        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Login
        </button>

        <p className="text-sm text-center mt-3">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </form>

      <div className="mt-20 bg-white p-6 rounded-lg shadow-md text-gray-700 text-sm w-auto justify-center">
        <h3 className="text-lg font-semibold text-center mb-3">
          Why Register for Allercheck?
        </h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Unlimited Scans</strong> – Instantly check food and products
            for allergens.
          </li>
          <li>
            <strong>Daily Allergy Journal</strong> – Log symptoms, intensity,
            and duration for better tracking.
          </li>
          <li>
            <strong>Detailed Statistics & Monthly Summaries</strong> – Gain
            insights into patterns and triggers.
          </li>
          <li>
            <strong>Export Reports (PDF & CSV)</strong> – Easily share data with
            doctors or keep records.
          </li>
          <li>
            <strong>Appointment & Medication Reminders</strong> – Never miss a
            doctor’s visit or medication intake.
          </li>
          <li>
            <strong>Doctor & Allergy Specialist Finder</strong> – Locate
            professionals near you.
          </li>
          <li>
            <strong>Personal Allergy Profile</strong> – Store details about
            allergies, medications, and symptoms.
          </li>
        </ul>
        <p className="text-center mt-3 font-medium">
          Sign up today and take control of your health with Allercheck!
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
