import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav className="bg-gray-800 py-4 text-center w-full flex justify-between px-6">
      <div>
        <Link to="/" className="mr-4 text-white hover:text-blue-700">
          Home
        </Link>
        <Link to="/profile" className="mr-4 text-white hover:text-blue-700">
          Profile
        </Link>
        <Link to="/journal" className="mr-4 text-white hover:text-blue-700">
          Journal
        </Link>
      </div>

      <Link to="/login">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
          Login
        </button>
      </Link>
    </nav>
  );
}
