import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RxCross1 } from "react-icons/rx";

// The is the divisionlist module
function LeaveType() {
  const API_URL = import.meta.env.VITE_API_URL; // URL for host
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  // const [newSectionName, setNewSectionName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [className, setClassName] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  // const [newDepartmentId, setNewDepartmentId] = useState("");
  const [fieldErrors, setFieldErrors] = useState({}); // For field-specific errors
  const [nameError, setNameError] = useState("");
  const [nameAvailable, setNameAvailable] = useState(true);
  const [roleId, setRoleId] = useState("");
  const [classes, setClasses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSetLateTime, setNewSetLateTime] = useState("");
  const [newTeacherId, setNewTeacherId] = useState("");
  const [newLeaveType, setNewLeaveType] = useState("");

  const pageSize = 10;

  // for role_id

  const fetchSections = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get(`${API_URL}/api/get_allleavetype`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data.data || [];
      setSections(data);
      // console.log("datta",sections)
      setPageCount(Math.ceil(data.length / pageSize));
    } catch (error) {
      setError(error.message || "Error fetching data");
      toast.error(error.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const fetchDataRoleId = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      // Fetch session data
      const sessionResponse = await axios.get(`${API_URL}/api/sessionData`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoleId(sessionResponse?.data?.user.role_id); // Store role_id
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchSections();
    fetchDataRoleId();
  }, []);

  const filteredSections = sections.filter((leave) => {
    const searchLower = searchTerm.toLowerCase();

    return leave.name.toLowerCase().includes(searchLower); // Filter by name
  });

  //   console.log("filteredSections", filteredSections);

  const displayedSections = filteredSections.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );
  //   console.log("displayed leave Type", displayedSections);

  const validateSectionName = (name) => {
    const errors = {};
    // console.log("xcfgvbhnj")

    if (!name || name.trim() === "") {
      errors.name = "Please Select Leave Type.";
    }

    return errors;
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleEdit = (leave) => {
    setCurrentSection(leave);
    console.log("leave_type_id", leave);
    setNewLeaveType(leave.name);
    // console.log("",setNewLeaveType)
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setClassName("");

    setNewLeaveType("");
    setCurrentSection(null);
    setFieldErrors({});
    setNameError("");
  };

  const handleSubmitAdd = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const validationErrors = validateSectionName(newLeaveType); //newleaveType
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }
    console.log("newLeave type", newLeaveType);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      // console.log("Token:", token);

      const checkleaveType = await axios.post(
        `${API_URL}/api/save_leavetype`,
        { name: newLeaveType },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      console.log("API Response (checkSetLateTime):", checkleaveType);
      const { data } = checkleaveType;

      console.log("API Response Data:", data);

      if (!data.success) {
        console.error(
          "Error: The Name field must contain a unique value.",
          data
        );
        setNameError("The Name field must contain a unique value..");
        toast.error("The Name field must contain a unique value..");
        setNameAvailable(false);
        setIsSubmitting(false);
        return;
      }

      console.log("Data saved successfully.", data);
      setNameError("");
      toast.success("Leave Type added successfully!");
      setNameAvailable(true);

      fetchSections(); // Fetch updated data
      handleCloseModal(); // Close the modal
    } catch (error) {
      console.error("Error adding Leave Type:", error);
      toast.error("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);

    const validationErrors = validateSectionName(newLeaveType);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setIsSubmitting(false); // Reset submitting state if validation fails
      return;
    }

    console.log("Current Section:", currentSection);
    console.log(
      "Current Section ID (leave type id):",
      currentSection ? currentSection.leave_type_id : null
    );

    try {
      const token = localStorage.getItem("authToken");
      console.log("Token:", token);

      if (!token || !currentSection) {
        throw new Error("No authentication token or leave type ID found.");
      }
      console.log("Current Section:", currentSection);

      const response = await axios.put(
        `${API_URL}/api/update_leavetype/${currentSection.leave_type_id}`,
        { name: newLeaveType },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      // Validate the response success field
      console.log("response.data.success", response.data.success);
      if (response.data.success === false) {
        toast.error("Leave type name already exists for another leave type");
      } else {
        toast.success("Leave Type updated successfully!");
      }

      fetchSections();
      handleCloseModal();
    } catch (error) {
      if (error.response) {
        if (error.response) {
          console.error("Error Response:", error.response);
          console.error("Error Response Data:", error.response.data);
        }

        const { status, message } = error.res;

        if (
          status === 400 &&
          message === "Leave type name already exists for another leave type."
        ) {
          toast.error(message);
          setFieldErrors((prevErrors) => ({
            ...prevErrors,
            name: message,
          }));
        } else {
          toast.error("Server error. Please try again later.");
        }
      } else {
        // Handle unexpected errors (network or other issues)
        console.error("Unexpected Error:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  const handleDelete = (id) => {
    console.log("id", id);
    setCurrentSection("");
    const sectionToDelete = sections.find(
      (leave) => leave.leave_type_id === id
    );

    setCurrentSection(sectionToDelete);
    setShowDeleteModal(true);
  };

  const handleSubmitDelete = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      const academicYr = localStorage.getItem("academicYear");

      if (!token || !currentSection || !currentSection.leave_type_id) {
        throw new Error("Leave Type is missing");
      }

      const response = await axios.delete(
        `${API_URL}/api/delete_leavetype/${currentSection.leave_type_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      fetchSections();
      if (response.data.success) {
        setShowDeleteModal(false);
        setCurrentSection(null);
        toast.success("Leave Type deleted successfully!");
      } else {
        toast.error(response.data.message || "Failed to delete Leave Type");
      }
    } catch (error) {
      console.error("Error deleting Leave Type:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Server error. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
      setShowDeleteModal(false);
    }
  };

  const handleChangeSectionName = (e) => {
    console.log(setNewLeaveType);
    const { value } = e.target;

    setNewLeaveType(value); //
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      name: validateSectionName(value).name,
    }));
  };

  return (
    <>
      <ToastContainer />

      <div className="container  mt-4">
        <div className="card mx-auto lg:w-[70%] shadow-lg">
          <div className="p-2 px-3 bg-gray-100 flex justify-between items-center">
            <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
              Leave Type
            </h3>{" "}
            <div className="box-border flex md:gap-x-2 justify-end md:h-10">
              <div className=" w-1/2 md:w-fit mr-1">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search "
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary btn-sm md:h-9 text-xs md:text-sm"
                onClick={handleAdd}
              >
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }} />
                Add
              </button>
            </div>
          </div>
          <div
            className=" relative w-[97%]   mb-3 h-1  mx-auto bg-red-700"
            style={{
              backgroundColor: "#C03078",
            }}
          ></div>

          <div className="card-body w-full">
            <div className="h-96 lg:h-96 w-full md:w-[80%] mx-auto  overflow-y-scroll lg:overflow-x-hidden ">
              <div className="bg-white  rounded-lg shadow-xs ">
                <table className="min-w-full leading-normal table-auto ">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-2 w-full md:w-[12%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Sr.No
                      </th>
                      <th className=" -px-2  w-full md:w-[25%] text-center py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Leave Type
                      </th>
                      <th className="px-2 w-full md:w-[14%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Edit
                      </th>
                      <th className="px-2 w-full md:w-[14%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center text-blue-700 text-xl py-10"
                        >
                          Please wait while data is loading...
                        </td>
                      </tr>
                    ) : displayedSections.length ? (
                      displayedSections.map((leave, index) => (
                        <tr
                          key={leave.section_id}
                          className={`${
                            index % 2 === 0 ? "bg-white" : "bg-gray-100"
                          } hover:bg-gray-50`}
                        >
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {currentPage * pageSize + index + 1}
                            </p>
                          </td>
                          <td className="text-center px-2  border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {leave.name}
                            </p>
                          </td>
                          {roleId === "M" ? (
                            <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                              <button
                                className="text-pink-600 hover:text-pink-800 hover:bg-transparent "
                                // onClick={() => handleEdit(section)}
                              >
                                {/* <FontAwesomeIcon icon={faEdit} /> */}
                              </button>{" "}
                            </td>
                          ) : (
                            <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                              <button
                                className="text-blue-600 hover:text-blue-800 hover:bg-transparent "
                                onClick={() => handleEdit(leave)}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>{" "}
                            </td>
                          )}
                          {roleId === "M" ? (
                            <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                              <button className="text-green-600 hover:text-green-800 hover:bg-transparent "></button>
                            </td>
                          ) : (
                            <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                              <button
                                className="text-red-600 hover:text-red-800 hover:bg-transparent "
                                onClick={() =>
                                  handleDelete(leave.leave_type_id)
                                }
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <div className=" absolute left-[1%] w-[100%]  text-center flex justify-center items-center mt-14">
                        <div className=" text-center text-xl text-red-700">
                          Oops! No data found..
                        </div>
                      </div>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {filteredSections.length > pageSize && (
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={1}
                pageRangeDisplayed={1}
                onPageChange={handlePageClick}
                containerClassName={"pagination justify-content-center"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                activeClassName={"active"}
              />
            )}
          </div>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
            <div
              className="modal"
              style={{
                display: "block",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <div className="modal-dialog modal-dialog-centered ">
                <div className="modal-content">
                  <div className="flex justify-between p-3">
                    <h5 className="modal-title">Create Leave Type</h5>

                    <RxCross1
                      className="float-end relative top-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                      type="button"
                      onClick={handleCloseModal}
                    />
                  </div>
                  <div
                    className=" relative  mb-3 h-1 w-[97%] mx-auto bg-red-700"
                    style={{
                      backgroundColor: "#C03078",
                    }}
                  ></div>
                  {/* <hr className="font-bold"></hr> */}
                  <div className="modal-body">
                    {" "}
                    {/* <div className="form-group"> */}
                    <div className=" relative mb-3 flex justify-center  mx-4">
                      <label htmlFor="sectionName" className="w-3/4 mt-2">
                        Leave Type<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={30}
                        className="form-control shadow-md mb-2"
                        id="sectionName"
                        value={newLeaveType}
                        onChange={handleChangeSectionName}
                      />
                      <div className="absolute top-9 left-[42%]">
                        {fieldErrors.name && (
                          <span className="text-danger text-xs">
                            {fieldErrors.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* <div className="modal-footer d-flex justify-content-end"> */}
                  {/* modified code by divyani mam guidance */}
                  <div className=" flex justify-end p-3">
                    {/* <button type="button" className="btn btn-secondary me-2" onClick={handleCloseModal}>Cancel</button> */}
                    <button
                      type="button"
                      className="btn btn-primary px-3 mb-2 mr-2 "
                      style={{}}
                      onClick={handleSubmitAdd}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Add"}
                    </button>

                    {/* <button
                      type="button"
                      className="btn btn-danger px-3 mb-2 "
                      style={{}}
                    //   onClick={handleSubmitAdd}
                    //   disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Reset"}
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showEditModal && (
          <div
            className="modal"
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title">Edit Leave Type</h5>
                  <RxCross1
                    className="float-end relative  mt-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                    type="button"
                    // className="btn-close text-red-600"
                    onClick={handleCloseModal}
                  />
                </div>
                <div
                  className=" relative  mb-3 h-1 w-[97%] mx-auto bg-red-700"
                  style={{
                    backgroundColor: "#C03078",
                  }}
                ></div>
                <div className="modal-body">
                  <div className=" relative mb-3 flex justify-center  mx-4">
                    <label htmlFor="editSectionName" className="w-3/4 mt-2">
                      Leave Type<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={30}
                      className="form-control shadow-md mb-2"
                      id="editSectionName"
                      value={newLeaveType}
                      onChange={handleChangeSectionName}
                    />
                    <div className="absolute top-9 left-[42%] ">
                      {fieldErrors.name && (
                        <span className="text-danger text-xs">
                          {fieldErrors.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className=" flex justify-end p-3">
                  <button
                    type="button"
                    className="btn btn-primary px-3 mb-2 "
                    style={{}}
                    onClick={handleSubmitEdit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div
            className="modal"
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title">Confirm Deletion</h5>
                  <RxCross1
                    className="float-end relative mt-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                    type="button"
                    // className="btn-close text-red-600"
                    onClick={handleCloseModal}
                  />
                </div>
                <div
                  className=" relative  mb-3 h-1 w-[97%] mx-auto bg-red-700"
                  style={{
                    backgroundColor: "#C03078",
                  }}
                ></div>
                <div className="modal-body">
                  <p>
                    Are you sure you want to delete leave type:{" "}
                    {currentSection.name}?
                  </p>
                </div>
                <div className=" flex justify-end p-3">
                  {/* <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button> */}
                  <button
                    type="button"
                    className="btn btn-danger px-3 mb-2"
                    style={{}}
                    onClick={handleSubmitDelete}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default LeaveType;
