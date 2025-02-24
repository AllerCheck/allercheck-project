
const Button = ({ label, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2  text-blue rounded hover:bg-gradient-to-r from-yellow-300 to-yellow-600 hover:text-white hover:font-semibold cursor-pointer ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
