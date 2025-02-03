// EditModal.js
import React from "react";
import { RxCross1 } from "react-icons/rx";

function EditModal({
  showEditModal,
  handleCloseModal,
  newclassnames,
  newSection,
  newSubject,
  dropdownRef,
  newDepartmentId,
  handleInputChange,
  isDropdownOpen,
  departments,
  handleOptionSelect,
  handleSubmitEdit,
}) {
  return (
    showEditModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="flex justify-between p-3">
                <h5 className="modal-title">Edit Allotment</h5>
                <RxCross1
                  className="float-end relative mt-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                  type="button"
                  onClick={handleCloseModal}
                />
              </div>
              <div
                className="relative mb-3 h-1 w-[97%] mx-auto bg-red-700"
                style={{ backgroundColor: "#C03078" }}
              ></div>
              <div className="modal-body">
                <div className="relative mb-3 flex justify-center mx-4 gap-x-7">
                  <label htmlFor="newSectionName" className="w-1/2 mt-2">
                    Class :{" "}
                  </label>
                  <div className="font-bold form-control shadow-md mb-2">
                    {newclassnames}
                  </div>
                </div>
                <div className="relative mb-3 flex justify-center mx-4 gap-x-7">
                  <label htmlFor="newSectionName" className="w-1/2 mt-2">
                    Section:{" "}
                  </label>
                  <span className="font-semibold form-control shadow-md mb-2">
                    {newSection}
                  </span>
                </div>
                <div className="relative flex justify-start mx-4 gap-x-7">
                  <label htmlFor="newSectionName" className="w-1/2 mt-2">
                    Subject:{" "}
                  </label>{" "}
                  <span className="font-semibold form-control shadow-md mb-2">
                    {newSubject}
                  </span>
                </div>
                <div className="modal-body">
                  <div
                    ref={dropdownRef}
                    className="relative mb-3 flex justify-center mx-2 gap-4"
                  >
                    <label
                      htmlFor="newDepartmentId"
                      className="w-1/2 mt-2 text-nowrap"
                    >
                      Teacher assigned <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="newDepartmentId"
                      value={newDepartmentId}
                      onChange={handleInputChange}
                      onFocus={() => setIsDropdownOpen(true)} // Open dropdown on input focus
                      className="form-control shadow-md"
                    />
                    {isDropdownOpen && (
                      <select
                        size={10}
                        className="absolute -top-5 left-[44%] w-[50%] text-xs md:text-sm p-1 border rounded-md mt-1 bg-white z-10 max-h-48 overflow-auto"
                        onChange={(e) => handleOptionSelect(e.target.value)}
                        onBlur={() => setIsDropdownOpen(false)} // Close dropdown on blur
                        value={newDepartmentId}
                      >
                        {departments
                          .filter((department) =>
                            department.name
                              .toLowerCase()
                              .includes(newDepartmentId.toLowerCase())
                          )
                          .map((department) => (
                            <option
                              key={department.department_id}
                              value={department.department_id}
                            >
                              {department.name}
                            </option>
                          ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer justify-center">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmitEdit}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default EditModal;
