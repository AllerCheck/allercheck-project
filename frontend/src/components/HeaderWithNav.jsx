import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import NavigationButtons from "./NavigationButtons";

const HeaderWithNav = () => {
  const navigate = useNavigate();
  const { token, first_name, logout } = useAuthStore();

  const handleLoginClick = () => {
    navigate(token ? "/profile" : "/login");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex justify-between h-16">
      {/* Main Header */}
      <header className="bg-teal-200 p-4 px-12 flex items-center justify-between w-full">
        {/* Logo */}
        <Link to="/" className="font-bold text-xl">
          AllerCheck
        </Link>

        {/* Navigation Buttons Below Header */}
        {token && (
          <nav className="p-4 px-12 mt-4">
            <NavigationButtons />
          </nav>
        )}
        {/* User Info / Login / Logout Button */}
        <div className="flex items-center gap-4">
          <span
            onClick={handleLoginClick}
            className="cursor-pointer flex items-center gap-2"
          >
            {token ? (<span className="text-lg font-bold mr-4">
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

          {/* Logout Button */}
          {token && (
            <span
              onClick={handleLogout}
              className="cursor-pointer text-red-500"
            >
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
                className="lucide lucide-log-out"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
            </span>
          )}
        </div>
      </header>
    </div>
  );
};

export default HeaderWithNav;
