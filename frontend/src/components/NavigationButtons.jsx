import { useNavigate } from "react-router-dom";
import Button from "./Button"; // Adjust the path if needed

const NavigationButtons = () => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-4 mb-4">
      <Button label="Journal" onClick={() => navigate("/journal")} />
      <Button label="Records" onClick={() => navigate("/statistics")} />
      <Button label="Appointments" onClick={() => navigate("/appointments")} />
      <Button label="Find a Doctor" onClick={() => navigate("/find")} />
      <Button label="Profile" onClick={() => navigate("/profile")} />
    </div>
  );
};

export default NavigationButtons;
