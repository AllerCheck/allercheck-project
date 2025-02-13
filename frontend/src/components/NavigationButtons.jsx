import React from "react";
import Button from "../components/Button"; // Adjust the path if needed

const NavigationButtons = ({ navigate }) => {
  return (
    <div className="flex gap-4 mb-4">
      <Button label="Journal" onClick={() => navigate('/journal')} />
      <Button label="Statistics" onClick={() => navigate('/statistics')} />
      <Button label="Appointments" onClick={() => navigate('/appointments')} />
      <Button label="Find a Doctor" onClick={() => navigate('/find')} />
      <Button label="Profile" onClick={() => navigate('/profile')} />
    </div>
  );
};

export default NavigationButtons;
