import { useNavigate } from "react-router-dom";
import Button from "./Button";

const HomeButtons = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center space-x-20 mt-6">
      <Button
        label="Barcode Scanner"
        onClick={() => navigate("/scanner")}
        className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-orange-500 transition text-center max-w-32 inline-block cursor-pointer"
      />
      <Button
        label="Allergy Journal"
        onClick={() => navigate("/journal")}
        className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-orange-500 transition cursor-pointer max-w-32 inline-block"
      />
      <Button
        label="Appointments"
        onClick={() => navigate("/appointments")}
        className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-orange-500 transition cursor-pointer max-w-32 inline-block"
      />
    </div>
  );
};

export default HomeButtons;
