import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const Header = () => {
  const navigate = useNavigate();
  const { token, first_name} = useAuthStore(); // Use first_name instead of username

  const handleLoginClick = () => {
    navigate(token ? "/profile" : "/login");
  };

  
  return (
    <header className="bg-teal-200 p-4 px-12 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">
        AllerCheck
      </Link>
      <div className="flex gap-4 items-center">
        <span
          onClick={handleLoginClick}
          className="cursor-pointer flex items-center gap-2 text-lg font-bold"
        >
          {token ? (
            <span className="text-lg font-bold">
              {first_name || "User"}
              {/* first_name || "User" // Show first_name if available */}
            </span>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-log-in"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" x2="3" y1="12" y2="12" />
            </svg>
          )}
        </span>
        </div>
    </header>
  );
};

export default Header;
