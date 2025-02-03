import { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RxCross1 } from "react-icons/rx";

// The is the divisionlist module
function Exam() {
  const API_URL = import.meta.env.VITE_API_URL; // URL for host
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [newSectionName, setNewSectionName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [className, setClassName] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [newDepartmentId, setNewDepartmentId] = useState("");
  const [fieldErrors, setFieldErrors] = useState({}); // For field-specific errors
  const [nameError, setNameError] = useState("");
  const [nameAvailable, setNameAvailable] = useState(true);
  const [roleId, setRoleId] = useState("");
  const [termsName, setTermsName] = useState([]);
  const [startDate, setStartDate] = useState(""); // New state for Start Date
  const [endDate, setEndDate] = useState(""); // New state for End Date
  const [openDay, setOpenDay] = useState(""); // New state for Open Day
  const [comment, setComment] = useState(""); // New state for Comment
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    fetchExams();
    fetchDataRoleId();
    fetchTermsName();
  }, []);

  const fetchTermsName = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/get_Term`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data); // Debugging line
      if (Array.isArray(response.data)) {
        setTermsName(response.data);
      } else {
        setError("Unexpected data format");
      }
    } catch (error) {
      console.error("Error fetching term names:", error);
    }
  };

  // Fetching all exams list
  const fetchExams = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${API_URL}/api/get_Examslist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setSections(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // for role_id
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
      // setRoleId("A"); // Store role_id
      console.log("roleIDis:", roleId);
      // Fetch academic year data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Filter and paginate sections
  const filteredSections = sections.filter(
    (section) =>
      section?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section?.comment?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const displayedSections = filteredSections.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  useEffect(() => {
    setPageCount(Math.ceil(filteredSections.length / pageSize));
  }, [filteredSections]);

  const validateFormFields = (
    name,
    departmentId,
    startDate,
    endDate,
    openDay
  ) => {
    const errors = {};

    // Validation for name
    if (!name || name.trim() === "") {
      errors.name = "Please enter exam name";
    } else if (name.length > 50) {
      errors.name = "The name field must not exceed 50 characters";
    }

    // Validation for departmentId
    if (!departmentId) {
      errors.department_id = "Please select a terms";
    }

    // Validation for startDate
    if (!startDate) {
      errors.startDate = "Start date is required";
    }

    // Validation for endDate
    if (!endDate) {
      errors.endDate = "End date is required";
    } else if (startDate && new Date(endDate) < new Date(startDate)) {
      errors.endDate = "End date should not be before the start date";
    }

    // Validation for openDay
    if (!openDay) {
      errors.openDay = "Open day is required";
    } else if (startDate && new Date(openDay) < new Date(startDate)) {
      errors.openDay = "Open day should not be before the start date";
    }

    return errors;
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleEdit = (section) => {
    console.log("edit", section);
    setCurrentSection(section);
    setNewSectionName(section?.name);
    // setClassName(section.get_class.class_id);
    setStartDate(section?.start_date);
    setEndDate(section?.end_date);
    setOpenDay(section?.open_day);
    setComment(section?.comment);
    setNewDepartmentId(section?.term_id);
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setNewSectionName(" ");
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setNewSectionName("");
    setNewDepartmentId("");
    setCurrentSection(null);
    setNameError("");
    setStartDate("");
    setEndDate("");
    setOpenDay("");
    setComment("");
    setFieldErrors({});
  };

  const handleSubmitAdd = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    const validationErrors = validateFormFields(
      newSectionName,
      newDepartmentId,
      startDate,
      endDate,
      openDay
    );
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }
    console.log("terId for add", newDepartmentId);

    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${API_URL}/api/save_Exams`,
        {
          name: newSectionName,
          term_id: newDepartmentId,
          start_date: startDate,
          end_date: endDate,
          open_day: openDay,
          comment: comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      fetchExams();
      handleCloseModal();
      toast.success("Exam added successfully!");
    } catch (error) {
      console.error("Error adding Exam:", error);
      toast.error("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
    }
  };

  const handleSubmitEdit = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    const validationErrors = validateFormFields(
      newSectionName,
      newDepartmentId,
      startDate,
      endDate,
      openDay
    );
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }
    console.log("terId for edit", newDepartmentId);
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `${API_URL}/api/update_Exams/${currentSection?.exam_id}`,
        {
          name: newSectionName,
          term_id: newDepartmentId,
          start_date: startDate,
          end_date: endDate,
          open_day: openDay,
          comment: comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      fetchExams();
      handleCloseModal();
      toast.success("Exam updated successfully!");
    } catch (error) {
      console.error("Error editing Exam:", error);
      toast.error("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
    }
  };

  const handleDelete = (id) => {
    const sectionToDelete = sections.find((sec) => sec.exam_id === id);
    setCurrentSection(sectionToDelete);
    setShowDeleteModal(true);
  };

  const handleSubmitDelete = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token || !currentSection || !currentSection.exam_id) {
        throw new Error("Exam ID is missing");
      }

      const response = await axios.delete(
        `${API_URL}/api/delete_Exams/${currentSection.exam_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        fetchExams();
        setShowDeleteModal(false);
        setCurrentSection(null);
        toast.success("Exam deleted successfully!");
      } else {
        toast.error(response.data.message || "Failed to delete Exam");
      }
    } catch (error) {
      console.error("Error deleting Exam:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Server error. Please try again later.");
      }
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
      setShowDeleteModal(false);
    }
  };

  const handleChange = (field, value) => {
    switch (field) {
      case "startDate":
        setStartDate(value);
        break;
      case "endDate":
        setEndDate(value);
        break;
      case "openDay":
        setOpenDay(value);
        break;
      case "comment":
        setComment(value);
        break;
      default:
        break;
    }

    // Clear error when field changes
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };
  const handleChangeSectionName = (e) => {
    const { value } = e.target;
    setNewSectionName(value);
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      name: validateFormFields(value, newDepartmentId).name,
    }));
  };

  const handleChangeDepartmentId = (e) => {
    const { value } = e.target;
    setClassName(value);
    setNewDepartmentId(value);
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      department_id: validateFormFields(newSectionName, e.target.value)
        .department_id,
    }));
  };

  return (
    <>
      <ToastContainer />

      <div className="container  mt-4">
        <div className="card mx-auto lg:w-3/4 shadow-lg">
          <div className="p-2 px-3 bg-gray-100 flex justify-between items-center">
            <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
              Exams
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
            <div className="h-96 lg:h-96 overflow-y-scroll overflow-x-scroll">
              <div className="bg-white rounded-lg shadow-xs ">
                <table className="min-w-full leading-normal table-auto ">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Sr.No
                      </th>
                      <th className=" -px-2  text-center py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Exams List
                      </th>
                      <th className="px-2 text-center lg:px-5 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Comment
                      </th>
                      <th className="px-2 w-full md:w-[10%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Edit
                      </th>
                      <th className="px-2 w-full md:w-[10%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <div className=" absolute left-[4%] w-[100%]  text-center flex justify-center items-center mt-14">
                        <div className=" text-center text-xl text-blue-700">
                          Please wait while data is loading...
                        </div>
                      </div>
                    ) : displayedSections.length ? (
                      displayedSections.map((section, index) => (
                        <tr
                          key={section.section_id}
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
                            <p className="text-gray-900 whitespace-no-wrap   md:text-nowrap  relative top-2">
                              {section?.name}
                            </p>
                          </td>
                          <td className="text-center border border-gray-950 text-sm">
                            <div className="overflow-x-auto overflow-y-auto max-h-[90px] whitespace-pre-wrap break-all">
                              <p className="px-1 relative top-1 text-gray-900">
                                {section?.comment}
                              </p>
                            </div>
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
                                onClick={() => handleEdit(section)}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>{" "}
                            </td>
                          )}
                          {roleId === "M" ? (
                            <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                              <button
                                className="text-green-600 hover:text-green-800 hover:bg-transparent "
                                // onClick={() => handleDelete(section.section_id)}
                              >
                                {/* <FontAwesomeIcon icon={faTrash} /> */}
                              </button>
                            </td>
                          ) : (
                            <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                              <button
                                className="text-red-600 hover:text-red-800 hover:bg-transparent "
                                onClick={() => handleDelete(section?.exam_id)}
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
        {/* Modal for adding a new section */}
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
                    <h5 className="modal-title"> Create New Exam</h5>

                    <RxCross1
                      className="float-end relative top-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
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
                  {/* <hr className="font-bold"></hr> */}
                  <div className="modal-body">
                    <div className=" relative mb-3 flex justify-center  mx-4">
                      <label htmlFor="sectionName" className="w-1/2 mt-2">
                        Exam Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={50}
                        className="form-control shadow-md mb-2"
                        // style={{ background: "#F8F8F8" }}
                        id="sectionName"
                        value={newSectionName}
                        // placeholder="e.g A, B, C, D"
                        onChange={handleChangeSectionName}
                        // onChange={}
                        // onBlur={handleBlur}
                      />
                      <div className="absolute top-9 left-1/3">
                        {!nameAvailable && (
                          <span className=" block text-danger text-xs">
                            {nameError}
                          </span>
                        )}
                        {fieldErrors.name && (
                          <span className="text-danger text-xs">
                            {fieldErrors.name}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* <div className="form-group"> */}
                    <div className="relative mb-3 flex justify-center mx-4">
                      <label htmlFor="departmentId" className="w-1/2 mt-2">
                        Term <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="departmentId"
                        className="form-control shadow-md"
                        value={newDepartmentId}
                        onChange={handleChangeDepartmentId}
                      >
                        <option value="">Select Term</option>
                        {termsName.length === 0 ? (
                          <option value="">No Terms available</option>
                        ) : (
                          termsName.map((term) => (
                            <option
                              key={term.term_id}
                              value={term.term_id}
                              className="max-h-20 overflow-y-scroll"
                            >
                              {term.name}
                            </option>
                          ))
                        )}
                      </select>
                      <div className="absolute top-9 left-1/3">
                        {fieldErrors.department_id && (
                          <span className="text-danger text-xs">
                            {fieldErrors.department_id}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 relative mb-3 flex justify-center  mx-4">
                      <label htmlFor="startDate" className="w-1/2 mt-2">
                        Start Date <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="date"
                        id="startDate"
                        className="form-control shadow-md"
                        value={startDate}
                        onChange={(e) =>
                          handleChange("startDate", e.target.value)
                        }
                      />
                      <div className="absolute top-9 left-1/3">
                        {fieldErrors.startDate && (
                          <span className="text-danger text-xs">
                            {fieldErrors.startDate}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 relative mb-3 flex justify-center  mx-4">
                      <label htmlFor="endDate" className="w-1/2 mt-2">
                        End Date <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="date"
                        id="endDate"
                        className="form-control shadow-md"
                        value={endDate}
                        onChange={(e) =>
                          handleChange("endDate", e.target.value)
                        }
                      />
                      <div className="absolute top-9 left-1/3 ">
                        {fieldErrors.endDate && (
                          <span className=" block text-red-500 text-xs">
                            {fieldErrors.endDate}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 relative mb-3 flex justify-center  mx-4">
                      <label htmlFor="openDay" className="w-1/2 mt-2">
                        Open Day <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="openDay"
                        className="form-control shadow-md mb-2"
                        value={openDay}
                        onChange={(e) =>
                          handleChange("openDay", e.target.value)
                        }
                      />
                      <div className="absolute top-9 left-1/3 ">
                        {fieldErrors.openDay && (
                          <span className=" block text-red-500 text-xs">
                            {fieldErrors.openDay}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className=" relative mb-3 flex justify-center  mx-4">
                      <label htmlFor="comment" className="w-1/2 mt-2">
                        Comment
                      </label>
                      <textarea
                        className="form-control shadow-md mb-2"
                        id="comment"
                        maxLength={500}
                        value={comment}
                        onChange={(e) =>
                          handleChange("comment", e.target.value)
                        }
                      />{" "}
                    </div>
                    {/* <div className="relative  -top-6 left-[36%]">
                      {fieldErrors.comment && (
                        <span className=" block text-red-500 text-xs">
                          {fieldErrors.comment}
                        </span>
                      )}
                    </div> */}
                  </div>
                  {/* <div className="modal-footer d-flex justify-content-end"> */}
                  {/* modified code by divyani mam guidance */}
                  <div className=" flex justify-end p-3">
                    {/* <button type="button" className="btn btn-secondary me-2" onClick={handleCloseModal}>Cancel</button> */}
                    <button
                      type="button"
                      className="btn btn-primary px-3 mb-2 "
                      style={{}}
                      onClick={handleSubmitAdd}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Modal for editing a section */}
        {showEditModal && (
          <div
            className="modal"
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title">Edit Exams</h5>
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
                    <label htmlFor="editSectionName" className="w-1/2 mt-2">
                      Exam Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={50}
                      className="form-control shadow-md mb-2"
                      id="editSectionName"
                      value={newSectionName}
                      onChange={handleChangeSectionName}
                      // onBlur={handleBlur}
                    />
                    <div className="absolute top-9 left-1/3 ">
                      {!nameAvailable && (
                        <span className=" block text-red-500 text-xs">
                          {nameError}
                        </span>
                      )}

                      {fieldErrors.name && (
                        <span className="text-danger text-xs">
                          {fieldErrors.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className=" relative mb-3 flex justify-center  mx-4">
                    <label htmlFor="editDepartmentId" className="w-1/2 mt-2">
                      Term <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="editDepartmentId"
                      className="form-control shadow-md"
                      value={newDepartmentId}
                      onChange={handleChangeDepartmentId}
                    >
                      <option value="">Select</option>
                      {/* {classes.map((cls, index) => (
                        <option key={index} value={cls}>
                          {cls}
                        </option>
                      ))} */}
                      {/* <option value="">--Please choose a class--</option> */}
                      {console.log("the termsName", termsName)}
                      {termsName.length === 0 ? (
                        <option value="">No Terms available</option>
                      ) : (
                        termsName.map((terms) => (
                          <option key={terms.term_id} value={terms.term_id}>
                            {terms.name}
                          </option>
                        ))
                      )}
                    </select>
                    <div className="absolute top-9 left-1/3">
                      {fieldErrors.department_id && (
                        <span className="text-danger text-xs">
                          {fieldErrors.department_id}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 relative mb-3 flex justify-center  mx-4">
                    <label htmlFor="startDate" className="w-1/2 mt-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="date"
                      id="startDate"
                      className="form-control shadow-md"
                      value={startDate}
                      onChange={(e) =>
                        handleChange("startDate", e.target.value)
                      }
                    />
                    <div className="absolute top-9 left-1/3">
                      {fieldErrors.startDate && (
                        <span className="text-danger text-xs">
                          {fieldErrors.startDate}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 relative mb-3 flex justify-center  mx-4">
                    <label htmlFor="endDate" className="w-1/2 mt-2">
                      End Date <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="date"
                      id="endDate"
                      className="form-control shadow-md"
                      value={endDate}
                      onChange={(e) => handleChange("endDate", e.target.value)}
                    />
                    <div className="absolute top-9 left-1/3 ">
                      {fieldErrors.endDate && (
                        <span className=" block text-red-500 text-xs">
                          {fieldErrors.endDate}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 relative mb-3 flex justify-center  mx-4">
                    <label htmlFor="openDay" className="w-1/2 mt-2">
                      Open Day <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="openDay"
                      className="form-control shadow-md mb-2"
                      value={openDay}
                      onChange={(e) => handleChange("openDay", e.target.value)}
                    />
                    <div className="absolute top-9 left-1/3 ">
                      {fieldErrors.openDay && (
                        <span className=" block text-red-500 text-xs">
                          {fieldErrors.openDay}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className=" relative mb-3 flex justify-center  mx-4">
                    <label htmlFor="comment" className="w-1/2 mt-2">
                      Comment
                    </label>
                    <textarea
                      className="form-control shadow-md mb-2"
                      id="comment"
                      maxLength={500}
                      value={comment}
                      onChange={(e) => handleChange("comment", e.target.value)}
                    />{" "}
                  </div>
                  {/* <div className="relative  -top-6 left-[36%]">
                    {fieldErrors.comment && (
                      <span className=" block text-red-500 text-xs">
                        {fieldErrors.comment}
                      </span>
                    )}
                  </div> */}
                </div>
                <div className=" flex justify-end p-3">
                  {/* <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button> */}
                  <button
                    type="button"
                    // className="btn btn-primary"
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
        {/* Modal for confirming deletion */}
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
                    Are you sure you want to delete Exam: {currentSection.name}?
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

export default Exam;
