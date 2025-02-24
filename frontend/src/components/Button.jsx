
const Button = ({ label, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2  text-blue rounded hover:bg-orange-500 hover:text-white hover:font-semibold cursor-pointer ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
