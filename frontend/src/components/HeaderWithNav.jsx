import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import NavigationButtons from "./NavigationButtons";

const HeaderWithNav = () => {
  const navigate = useNavigate();
  const { token, first_name, logout } = useAuthStore();

  const handleLoginClick = () => {
    if (!token) {
      navigate("/login");
    }
  };
  
  /* Function to redirect to profile by clicking on First Name */
  // const handleLoginClick = () => {
  //   navigate(token ? "/profile" : "/login");
  // }; 

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex justify-between h-16">
      {/* Main Header */}
      <header className="bg-teal-200 p-4 px-12 flex items-center justify-between w-full">
        {/* Logo */}
        <Link to="/" className="font-bold text-xl flex items-center gap-2">
          <img src="/logo.svg" alt="AllerCheck Logo" className="w-10" />
          AllerCheck
        </Link>

        {/* Navigation Buttons Below Header */}
        {token && (
          <nav className="p-4 px-12 mt-4">
            <NavigationButtons />
          </nav>
        )}
        {/* User Info / Login */}
        <div className="flex items-center gap-4">
          <span
            onClick={handleLoginClick}
            className="flex items-center gap-2"
          >
            {token ? (<span className="px-4 py-2 text-blue font-semibold text-xl ">
              {"Hi" + " " + first_name || "User"}
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
