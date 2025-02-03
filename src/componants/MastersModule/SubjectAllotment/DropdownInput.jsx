import React, { useState, useRef, useEffect } from "react";
// not used it
function DropdownInput({
  departments, // Array of departments
  newDepartmentId, // Selected department name (for input value)
  setNewDepartmentId, // Setter function for the input value
  setSelectedDepartment, // Setter function for the selected department reg_id
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleInputChange = (e) => {
    setNewDepartmentId(e.target.value);
    setIsDropdownOpen(true); // Open the dropdown when typing
  };

  const handleOptionSelect = (regId) => {
    const selectedDept = departments.find((dept) => dept.reg_id === regId);
    if (selectedDept) {
      setNewDepartmentId(selectedDept.name);
      setSelectedDepartment(regId);
    }
    setIsDropdownOpen(false);
  };

  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(newDepartmentId.toLowerCase())
  );

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false); // Close the dropdown if clicked outside
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="dropdown-input">
      <input
        type="text"
        value={newDepartmentId}
        onChange={handleInputChange}
        placeholder="Enter department name"
        className="form-control"
      />
      {isDropdownOpen && (
        <ul className="dropdown-menu">
          {filteredDepartments.map((department) => (
            <li
              key={department.reg_id}
              onClick={() => handleOptionSelect(department.reg_id)}
            >
              {department.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DropdownInput;
