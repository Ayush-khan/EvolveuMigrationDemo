// 100% correct working model.
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
function Grade() {
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
  const [termsName, setTermsName] = useState(["Scholastic", "Co-Scholastic"]);
  const [startDate, setStartDate] = useState(""); // New state for Start Date
  const [endDate, setEndDate] = useState(""); // New state for End Date
  const [openDay, setOpenDay] = useState(""); // New state for Open Day
  const [comment, setComment] = useState(""); // New state for Comment
  const pageSize = 10;
  const [nameErrorForGrade, setNameErrorForGrade] = useState(""); // New state for
  const [classes, setClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]); // Store selected class_ids
  const [errorMessage, setErrorMessage] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [classIdFor, setClassIdFor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchGrades();
    fetchClassNames();
    fetchDataRoleId();
    // fetchTermsName();
  }, []);
  const [classNamesFor, setClassNameFor] = useState("");
  const fetchClassNames = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/get_class_for_division`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (Array.isArray(response.data)) {
        setClasses(response.data);
      } else {
        setError("Unexpected data format");
      }
    } catch (error) {
      console.error("Error fetching class names:", error);
    }
  };
  //   const fetchTermsName = async () => {
  //     try {
  //       const token = localStorage.getItem("authToken");
  //       const response = await axios.get(
  //         `${API_URL}/api/get_class_for_division`,
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );
  //       if (Array.isArray(response.data)) {
  //         setTermsName(response.data);
  //       } else {
  //         setError("Unexpected data format");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching class names:", error);
  //     }
  //   };
  // Handle checkbox change

  // Fetching all exams list
  const fetchGrades = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${API_URL}/api/get_Gradeslist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      console.log("the Grades data", sections);
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
      setAcademicYear(sessionResponse?.data?.custom_claims?.academic_yr);

      // setRoleId("A"); // Store role_id
      console.log("roleIDis:", roleId);
      // Fetch academic year data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Filter by both class_name and subject_type
  const filteredSections = sections.filter((section) => {
    const gradeName = section?.name?.toLowerCase() || "";
    const className = section?.class?.name?.toLowerCase() || "";
    const subjectType = section?.subject_type?.toLowerCase() || "";
    const marksFrom = section?.mark_from?.toString() || "";
    const marksUpto = section?.mark_upto?.toString() || "";
    const comment = section?.comment?.toLowerCase() || "";

    // Combine all fields for search
    return (
      gradeName.includes(searchTerm.toLowerCase()) ||
      className.includes(searchTerm.toLowerCase()) ||
      subjectType.includes(searchTerm.toLowerCase()) ||
      marksFrom.includes(searchTerm) || // Numeric fields can be searched as strings
      marksUpto.includes(searchTerm) || // Numeric fields can be searched as strings
      comment.includes(searchTerm.toLowerCase())
    );
  });

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
    selectedClasses
  ) => {
    const errors = {};

    // if (!name || name.trim() === "") {
    //   errors.name = "Please enter Grade name.";
    // } else if (name.length > 3) {
    //   errors.name = "The name field must not exceed 3 characters.";
    // }
    // Validate Grade Name (Only capital letters allowed)
    // Validate Grade Name (Only uppercase letters and '+' allowed)
    if (!name || name.trim() === "") {
      errors.name = "Please enter Grade name";
    } else if (name.length > 3) {
      errors.name = "The name field must not exceed 3 characters";
    } else if (!/^[A-Z0-9\+\-]+$/.test(name)) {
      // Regex to check for uppercase letters, digits, '+' and '-'
      errors.name =
        "The name field must contain only capital letters, digits, '+' or '-'.";
    }

    if (!departmentId) {
      errors.department_id = "Please select a Subject Type";
    }

    if (!startDate) {
      errors.startDate = "Marks from is required";
    } else if (parseFloat(startDate) > 100) {
      errors.startDate = "Marks from cannot be greater than 100";
    }

    if (!endDate) {
      errors.endDate = "Marks upto is required";
    } else if (parseFloat(endDate) > 100) {
      errors.endDate = "Marks upto cannot be greater than 100";
    }

    if (startDate && endDate && parseFloat(startDate) > parseFloat(endDate)) {
      errors.startDate = "Marks from cannot be greater than Marks upto";
    }
    // Validate if at least one class is selected
    if (!selectedClasses || selectedClasses.length === 0) {
      errors.selectedClasses = "Please select at least one class";
    }

    return errors;
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleEdit = (section) => {
    setCurrentSection(section);
    setNewSectionName(section.name);
    // setClassName(section?.class?.name);
    setClassNameFor(section?.class?.name);
    setClassIdFor(section?.class?.class_id);
    setNewDepartmentId(section?.subject_type);
    setStartDate(section?.mark_from);
    setEndDate(section?.mark_upto);
    setComment(section?.comment);
    // Ensure that selectedClasses is always an array, even if class_id is a single value
    // setSelectedClasses(
    //   Array.isArray(section?.class_id) ? section.class_id : [section.class_id]
    // );

    setShowEditModal(true);
  };

  const handleAdd = () => {
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
    setSelectedClasses("");
    setFieldErrors({});
    setErrorMessage("");
  };

  // Handle form submit (Add)
  const handleSubmitAdd = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);

    const validationErrors = validateFormFields(
      newSectionName,
      newDepartmentId,
      startDate,
      endDate,
      selectedClasses
    );

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    if (selectedClasses.length === 0) {
      setErrorMessage("Please select at least one class.");
      setIsSubmitting(false);
      return;
    }

    setErrorMessage("");
    console.log("Form submitted with selected classes:", selectedClasses);

    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        `${API_URL}/api/save_Grades`,
        {
          name: newSectionName,
          subject_type: newDepartmentId,
          mark_from: startDate,
          mark_upto: endDate,
          comment: comment,
          class_id: selectedClasses,
          academic_yr: academicYear,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchGrades();

      console.log("this is response", response);
      console.log("this is response", response?.data?.status);
      if (response?.data?.status === 400 && response?.data?.message) {
        // Handle the "Grade already exists" error
        const error = response?.data?.message;
        console.log("error", error);
        setNameErrorForGrade(error);

        toast.error(response.data.message); // Display the specific error message
      } else {
        handleCloseModal();
        toast.success("Grade added successfully!");
      }
    } catch (error) {
      console.error("Error adding Grade:", error);

      if (error.response?.status === 400 && error.response?.data?.message) {
        // Handle the "Grade already exists" error
        console.log("nameErrorForGrade", nameErrorForGrade);

        const error = error?.response?.data?.message;
        console.log("error is that", error);
        console.log("nameErrorForGrade", nameErrorForGrade);
        toast.error(error); // Display the specific error message
      } else {
        toast.error("Server error. Please try again later.");
      }
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
    }
  };

  console.log("selectedClasses", selectedClasses);
  const handleSubmitEdit = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    const validationErrors = validateFormFields(
      newSectionName,
      newDepartmentId,
      startDate,
      endDate,
      classIdFor
    );

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setIsSubmitting(false);

      return;
    }

    if (!setClassIdFor) {
      setIsSubmitting(false);

      setErrorMessage("Please select at least one class.");
      return;
    }

    setErrorMessage("");
    console.log("Form submitted with selected classes:", classIdFor);

    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `${API_URL}/api/update_Grades/${currentSection.grade_id}`,
        {
          name: newSectionName,
          subject_type: newDepartmentId,
          mark_from: startDate,
          mark_upto: endDate,
          comment: comment,
          class_id: classIdFor,
          academic_yr: academicYear,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      fetchGrades();
      handleCloseModal();
      toast.success("Grade updated successfully!");
    } catch (error) {
      console.error("Error editing Grade:", error);
      toast.error("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
    }
  };

  const handleDelete = (id) => {
    const sectionToDelete = sections.find((sec) => sec.grade_id === id);
    setCurrentSection(sectionToDelete);
    setShowDeleteModal(true);
  };

  const handleSubmitDelete = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token || !currentSection || !currentSection.grade_id) {
        throw new Error("Grade ID is missing");
      }

      const response = await axios.delete(
        `${API_URL}/api/delete_Grades/${currentSection.grade_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        fetchGrades();
        setShowDeleteModal(false);
        setCurrentSection(null);
        toast.success("Grade deleted successfully!");
      } else {
        toast.error(response.data.message || "Failed to delete Division");
      }
    } catch (error) {
      console.error("Error deleting Grade:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Server error. Please try again later.");
      }
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
      setShowDeleteModal(false);
    }
  };
  // Handle checkbox change
  const handleCheckboxChange = (classId) => {
    setSelectedClasses((prevSelectedClasses) => {
      // Toggle selection: add or remove the selected class
      const updatedSelection = prevSelectedClasses.includes(classId)
        ? prevSelectedClasses.filter((id) => id !== classId)
        : [...prevSelectedClasses, classId];

      // Clear the class selection error if at least one class is selected
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        selectedClasses:
          updatedSelection.length > 0 ? "" : prevErrors.selectedClasses,
      }));

      return updatedSelection;
    });
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

    // Clear the validation error for the changed field
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleChangeSectionName = (e) => {
    const { value } = e.target;
    setNameErrorForGrade("");
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
              Grades
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
              <div className="bg-white rounded-lg shadow-xs">
                <table className="min-w-full leading-normal table-auto">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Sr.No
                      </th>
                      <th className="px-2 text-center py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Grade Name
                      </th>
                      <th className="px-2 text-center py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Class
                      </th>
                      <th className="px-2 text-center lg:px-5 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Subject Type
                      </th>
                      <th className="px-2 text-center lg:px-5 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Marks From
                      </th>
                      <th className="px-2 text-center lg:px-5 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Marks Upto
                      </th>
                      <th className="px-2 text-center lg:px-5 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Comment
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Edit
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
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
                          key={section?.grade_id}
                          className={`${
                            index % 2 === 0 ? "bg-white" : "bg-gray-100"
                          } hover:bg-gray-50`}
                        >
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {currentPage * pageSize + index + 1}
                            </p>
                          </td>
                          <td className="text-center px-2 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {section?.name}
                            </p>
                          </td>
                          <td className="text-center px-2 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {`${section?.class?.name || ""} `}
                            </p>
                          </td>
                          <td className="text-center px-2 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {section?.subject_type}
                            </p>
                          </td>
                          <td className="text-center px-2 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {section?.mark_from}
                            </p>
                          </td>
                          <td className="text-center px-2 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {section?.mark_upto}
                            </p>
                          </td>
                          <td className="text-center border border-gray-950 text-sm">
                            <div className="overflow-x-auto overflow-y-auto max-h-[90px] whitespace-pre-wrap break-all">
                              <p className="px-1 relative top-1 text-gray-900">
                                {section?.comment}
                              </p>
                            </div>
                          </td>
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <button
                              className="text-blue-600 hover:text-blue-800 hover:bg-transparent"
                              onClick={() => handleEdit(section)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                          </td>
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <button
                              className="text-red-600 hover:text-red-800 hover:bg-transparent"
                              onClick={() => handleDelete(section?.grade_id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </td>
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
                    <h5 className="modal-title"> Create New Grade</h5>

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
                    <div className=" relative  flex justify-center  mx-4">
                      <label htmlFor="sectionName" className="w-1/2 mt-2">
                        Grade Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={2}
                        className="form-control shadow-md mb-2"
                        // style={{ background: "#F8F8F8" }}
                        id="sectionName"
                        value={newSectionName}
                        onChange={handleChangeSectionName}
                        // onChange={}
                        // onBlur={handleBlur}
                      />{" "}
                    </div>
                    <div className=" w-[60%] relative h-4 -top-2 left-[35%] ">
                      {!nameAvailable && (
                        <span className=" block text-danger text-xs">
                          {nameError}
                        </span>
                      )}

                      <span className=" block text-danger text-xs">
                        {nameErrorForGrade}
                      </span>

                      {fieldErrors.name && (
                        <span className="text-danger text-xs">
                          {fieldErrors.name}
                        </span>
                      )}
                    </div>
                    {/* <div className="form-group"> */}
                    <div className=" relative  flex justify-center  mx-4">
                      <label htmlFor="departmentId" className="w-1/2 mt-2">
                        Subject Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="departmentId"
                        className="form-control shadow-md"
                        value={newDepartmentId}
                        onChange={handleChangeDepartmentId}
                      >
                        <option value="">Select </option>
                        {/* {classes.map((cls, index) => (
                          <option key={index} value={cls}>
                            {cls}
                          </option>
                        ))} */}
                        {termsName.length === 0 ? (
                          <option value="">No Subject Type available</option>
                        ) : (
                          termsName.map((cls, index) => (
                            <option
                              key={index}
                              value={cls}
                              className="max-h-20 overflow-y-scroll "
                            >
                              {cls}
                            </option>
                          ))
                        )}
                      </select>{" "}
                    </div>
                    <div className=" w-[60%] relative h-4 -top-2 left-[35%] ">
                      {fieldErrors.department_id && (
                        <span className="text-danger text-xs">
                          {fieldErrors.department_id}
                        </span>
                      )}
                    </div>

                    <div className="relative flex justify-center mx-4">
                      <label htmlFor="marksFrom" className="w-1/2 mt-2">
                        Marks from <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="marksFrom"
                        className="form-control shadow-md"
                        maxLength={3}
                        value={startDate || ""} // Ensure startDate is not undefined
                        onChange={(e) => {
                          const value = e.target.value;

                          // Allow only numbers
                          if (/^\d{0,3}$/.test(value)) {
                            handleChange("startDate", value);
                          }
                        }}
                      />{" "}
                    </div>
                    <div className="w-[60%] relative -top-2 h-4 left-[35%]">
                      {fieldErrors.startDate && (
                        <span className="text-danger text-xs">
                          {fieldErrors.startDate}
                        </span>
                      )}
                    </div>

                    <div className="relative flex justify-center mx-4">
                      <label htmlFor="marksUpto" className="w-1/2 mt-2">
                        Marks upto <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="marksUpto"
                        maxLength={3} // Ensure a valid maxLength
                        className="form-control shadow-md"
                        value={endDate || ""} // Ensure endDate is not undefined
                        onChange={(e) => {
                          const value = e.target.value;

                          // Allow only numbers
                          if (/^\d{0,3}$/.test(value)) {
                            handleChange("endDate", value);
                          }
                        }}
                      />{" "}
                    </div>
                    <div className="w-[60%] relative h-4 left-[35%]">
                      {fieldErrors.endDate && (
                        <span className="block text-red-500 text-xs">
                          {fieldErrors.endDate}
                        </span>
                      )}
                    </div>

                    <div className=" relative  flex justify-center  mx-4">
                      <label htmlFor="classCheckboxes" className="w-1/2 mt-2">
                        Class <span className="text-red-500">*</span>
                      </label>

                      <div className="flex flex-wrap gap-x-4 md:gap-x-2 w-full mt-2 md:mt-0 md:w-[150%]   ">
                        {classes.length === 0 ? (
                          <span>No Classes Available</span>
                        ) : (
                          classes.map((cls) => (
                            <div
                              key={cls.class_id}
                              className="relative left-0 md:left-8 mb-2"
                            >
                              <label>
                                {" "}
                                <input
                                  type="checkbox"
                                  id={`class-${cls.class_id}`}
                                  checked={selectedClasses.includes(
                                    cls.class_id
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange(cls.class_id)
                                  }
                                />
                                <span className=" text-gray-800 ml-1 ">
                                  {cls.name}
                                </span>
                              </label>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    <div className=" w-[60%] relative h-4 -top-2 left-[35%] ">
                      {fieldErrors.selectedClasses && (
                        <span className=" block text-red-500 text-xs">
                          {fieldErrors.selectedClasses}
                        </span>
                      )}
                      {errorMessage && (
                        <span className=" block text-red-500 text-xs">
                          {errorMessage}
                        </span>
                      )}
                    </div>

                    <div className=" relative  flex justify-center  mx-4">
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
                  <h5 className="modal-title">Edit Grade</h5>
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
                <div className="modal-body ">
                  <div className=" relative  flex justify-center  mx-4">
                    <label htmlFor="class" className="w-1/2 mt-2">
                      Class <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      readOnly
                      className="bg-gray-200 w-full p-2 rounded-md outline-none shadow-md mb-3"
                      // style={{ background: "#F8F8F8" }}
                      id="class"
                      value={classNamesFor}
                      onChange={handleChangeSectionName}
                      // onChange={}
                      // onBlur={handleBlur}
                    />{" "}
                  </div>
                  <div className=" relative  flex justify-center  mx-4">
                    <label htmlFor="sectionName" className="w-1/2 mt-2">
                      Grade Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      className="form-control shadow-md mb-2"
                      // style={{ background: "#F8F8F8" }}
                      id="sectionName"
                      value={newSectionName}
                      onChange={handleChangeSectionName}
                      // onChange={}
                      // onBlur={handleBlur}
                    />{" "}
                  </div>
                  <div className=" w-[60%] relative h-4 -top-2 left-[35%] ">
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
                  {/* <div className="form-group"> */}
                  <div className=" relative  flex justify-center  mx-4">
                    <label htmlFor="departmentId" className="w-1/2 mt-2">
                      Subject Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="departmentId"
                      className="form-control shadow-md"
                      value={newDepartmentId}
                      onChange={handleChangeDepartmentId}
                    >
                      <option value="">Select </option>
                      {/* {classes.map((cls, index) => (
                          <option key={index} value={cls}>
                            {cls}
                          </option>
                        ))} */}
                      {termsName.length === 0 ? (
                        <option value="">No Subject Type available</option>
                      ) : (
                        termsName.map((cls, index) => (
                          <option
                            key={index}
                            value={cls}
                            className="max-h-20 overflow-y-scroll "
                          >
                            {cls}
                          </option>
                        ))
                      )}
                    </select>{" "}
                  </div>
                  <div className=" w-[60%] relative h-4 -top-2 left-[35%] ">
                    {fieldErrors.department_id && (
                      <span className="text-danger text-xs">
                        {fieldErrors.department_id}
                      </span>
                    )}
                  </div>

                  <div className="relative flex justify-center mx-4">
                    <label htmlFor="marksFrom" className="w-1/2 mt-2">
                      Marks from <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="marksFrom"
                      className="form-control shadow-md"
                      maxLength={3}
                      value={startDate}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleChange("startDate", value); // Allow any input
                        if (!/^\d*$/.test(value)) {
                          setFieldErrors((prevErrors) => ({
                            ...prevErrors,
                            startDate: "Only numbers are allowed.",
                          }));
                        } else {
                          setFieldErrors((prevErrors) => ({
                            ...prevErrors,
                            startDate: "", // Clear error when valid input
                          }));
                        }
                      }}
                    />
                  </div>
                  <div className="w-[60%] relative -top-1 h-4 left-[35%]">
                    {fieldErrors.startDate && (
                      <span className="text-red-500 text-xs">
                        {fieldErrors.startDate}
                      </span>
                    )}
                  </div>

                  <div className="relative top-1 flex justify-center mx-4">
                    <label htmlFor="marksUpto" className="w-1/2 mt-2">
                      Marks upto <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="marksUpto"
                      maxLength={3}
                      className="form-control shadow-md"
                      value={endDate}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleChange("endDate", value); // Allow any input
                        if (!/^\d*$/.test(value)) {
                          setFieldErrors((prevErrors) => ({
                            ...prevErrors,
                            endDate: "Only numbers are allowed.",
                          }));
                        } else {
                          setFieldErrors((prevErrors) => ({
                            ...prevErrors,
                            endDate: "", // Clear error when valid input
                          }));
                        }
                      }}
                    />
                  </div>
                  <div className="w-[60%] relative  h-4 left-[35%]">
                    {fieldErrors.endDate && (
                      <span className="text-red-500 text-xs">
                        {fieldErrors.endDate}
                      </span>
                    )}
                  </div>

                  <div className=" relative top-2  flex justify-center  mx-4">
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
                    Are you sure you want to delete Grade: {currentSection.name}
                    ?
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

export default Grade;
