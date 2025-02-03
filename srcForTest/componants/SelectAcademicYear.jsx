import React, { useEffect, useState } from "react";

const SelectAcademicYear = () => {
  const [settings, setSettings] = useState({});
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    // Retrieve settings from local storage
    const storedSettings = JSON.parse(localStorage.getItem("settings")) || {};
    setSettings(storedSettings);

    // Log the settings to debug
    console.log("Retrieved settings:", storedSettings);

    // Extract academic_yr from settings if it exists
    if (storedSettings.academic && storedSettings.academic.academic_yr) {
      setAcademicYears(storedSettings.academic.academic_yr);
    }
  }, []);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  return (
    <div>
      <h2>Select Academic Year</h2>
      <div>
        <label htmlFor="academicYearSelect">
          <strong>Academic Year:</strong>
        </label>
        <select
          id="academicYearSelect"
          value={selectedYear}
          onChange={handleYearChange}
        >
          <option value="">Select a year</option>
          {academicYears.map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      {selectedYear && (
        <div>
          <strong>Selected Year:</strong> {selectedYear}
        </div>
      )}
    </div>
  );
};

export default SelectAcademicYear;
