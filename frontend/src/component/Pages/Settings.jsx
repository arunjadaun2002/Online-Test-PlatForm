import React from "react";
 // Import the CSS file
import './Settings.css'

export function Settings() {
  const options = [
    "Advance Setting",
    "Reviews",
    "About Us",
    "Notifications",
    "Dark Mode",
    "Report Bug",
    "Language",
    "Social Links",
  ];

  return (
    <div className="settings-container">
      <div className="settings-box">
        {options.map((option, index) => (
          <button key={index} className="settings-button">
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Settings;