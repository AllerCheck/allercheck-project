import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const Header = () => {
  const navigate = useNavigate();
  const { token, first_name } = useAuthStore();

  const handleLoginClick = () => {
    if (!token) {
      navigate("/login");
    }
  };

  return (
    <div className="flex justify-between h-16 w-full mt-2">
      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 p-4 px-12 flex items-center justify-between w-full">
        <Link
          to="/"
          className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 font-extrabold text-3xl flex items-center gap-2"
        ><img src="/logo.svg" alt="AllerCheck Logo" className="w-12" />
          AllerCheck
        </Link>

        <div className="flex gap-4 items-center">
  <span
    onClick={handleLoginClick}
    className="cursor-pointer flex items-center gap-2 text-lg font-bold"
  >
    {token ? (
      <span>{first_name || "User"}</span>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-log-in"
        stroke="url(#gradient)"  // Apply the gradient to the stroke
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FACC15" /> {/* yellow-400 */}
            <stop offset="100%" stopColor="#F59E0B" /> {/* yellow-500 */}
          </linearGradient>
        </defs>
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <polyline points="10 17 15 12 10 7" />
        <line x1="15" x2="3" y1="12" y2="12" />
      </svg>
    )}
  </span>
</div>

      </header>
    </div>
  );
};

export default Header;
