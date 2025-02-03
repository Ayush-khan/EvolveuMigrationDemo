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
function MarksHeading() {
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
  const [classes, setClasses] = useState([]);
  const [sequence, setSequence] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameErrorforName, setNameErrorforName] = useState("");

  const pageSize = 10;
  //   useEffect(() => {
  //     const fetchClassNames = async () => {
  //       try {
  //         const token = localStorage.getItem("authToken");
  //         const response = await axios.get(
  //           `${API_URL}/api/get_class_for_division`,
  //           {
  //             headers: { Authorization: `Bearer ${token}` },
  //           }
  //         );
  //         if (Array.isArray(response.data)) {
  //           setClasses(response.data);
  //         } else {
  //           setError("Unexpected data format");
  //         }
  //       } catch (error) {
  //         console.error("Error fetching class names:", error);
  //       }
  //     };

  //     fetchClassNames();
  //   }, []);

  useEffect(() => {
    fetchMarksHeading();
    fetchDataRoleId();
  }, []);

  const fetchMarksHeading = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${API_URL}/api/get_Markheadingslist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setSections(response.data);
      setPageCount(Math.ceil(response.data.length / pageSize));

      console.log("this is the markheading get", sections);
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
  const filteredSections = sections.filter((section) => {
    const gradeName = section?.name?.toLowerCase() || ""; // Convert grade name to lowercase
    const marksHeadingsId = section?.marks_headings_id?.toString() || ""; // Convert ID to string
    const sequence = section?.sequence?.toString() || ""; // Convert sequence to string
    const writtenExam = section?.written_exam?.toLowerCase() || ""; // Convert written_exam to lowercase

    // Combine all fields for search
    return (
      gradeName.includes(searchTerm.toLowerCase()) || // Search by grade name
      marksHeadingsId.includes(searchTerm) || // Search by marks_heading_id
      sequence.includes(searchTerm) || // Search by sequence
      writtenExam.includes(searchTerm.toLowerCase()) // Search by written_exam
    );
  });

  // Calculate pagination
  const displayedSections = filteredSections.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  // useEffect(() => {
  //   setPageCount(Math.ceil(filteredSections.length / pageSize));
  // }, [filteredSections]);

  // const validateSectionName = (name, writtenExam) => {
  //   const errors = {};

  //   // Regular expression to match only alphabets
  //   //    const alphabetRegex = /^[A-Za-z]+$/;

  //   if (!name || name.trim() === "") {
  //     errors.name = "Please enter marks heading name.";
  //   } else if (name.length > 50) {
  //     errors.name = "The name field must not exceed 50 character.";
  //   }

  //   if (!writtenExam) {
  //     // Only show error if writtenExam is not selected
  //     errors.written_exam = "Please select whether it's a written exam.";
  //   }
  //   return errors;
  // };

  const validateSectionName = (name, writtenExam, sequence) => {
    const errors = {};

    // Name validation
    if (!name || name.trim() === "") {
      errors.name = "Please enter marks heading name.";
    } else if (name.length > 50) {
      errors.name = "The name field must not exceed 50 characters.";
    }

    // Written Exam validation
    if (!writtenExam) {
      errors.written_exam = "Please select whether it's a written exam.";
    }

    // Sequence validation
    const sequenceRegex = /^[0-9]{1,2}$/; // Ensure 1 or 2 digit numbers only
    if (!sequence) {
      errors.sequence = "Please enter sequence number.";
    } else if (!sequenceRegex.test(sequence)) {
      errors.sequence = "Sequence must be a number with a maximum of 2 digits.";
    }

    return errors;
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleEdit = (section) => {
    setCurrentSection(section);
    setNewSectionName(section?.name);
    setClassName(section?.marks_headings_id);
    setSequence(section?.sequence);
    // i have to select this
    setNewDepartmentId(section?.written_exam);
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setSequence("");
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setNewSectionName("");
    setNewDepartmentId("");
    setCurrentSection(null);
    setFieldErrors({});
    setNameError("");
    setNameErrorforName("");
  };

  const handleSubmitAdd = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);

    // Validate input fields
    const validationErrors = validateSectionName(
      newSectionName,
      newDepartmentId,
      sequence
    );
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log(
        "name:",
        newSectionName,
        "written_exam:",
        newDepartmentId,
        "sequence:",
        sequence
      );

      await axios.post(
        `${API_URL}/api/save_Markheadings`,
        {
          name: newSectionName,
          written_exam: newDepartmentId,
          sequence: sequence,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      fetchMarksHeading();
      handleCloseModal();
      toast.success("Marks headings added successfully!");
    } catch (error) {
      console.error("Error adding Marks headings:", error);

      if (error.response?.status === 422 && error.response?.data?.errors) {
        const errors = error.response.data.errors;
        console.log("errors", errors);

        if (errors?.sequence && errors?.sequence?.length > 0) {
          console.log("errors", errors.sequence);
          setNameError(errors.sequence[0]); // Update state with the specific error
        }
      } else if (
        error.response?.status === 404 &&
        error.response?.data?.message === "Marksheading already exists."
      ) {
        // Handle the case where the markheading name already exists
        setNameErrorforName("Marksheading already exists.");
        // toast.error("Marksheading name already exists."); // Display error to user
      } else {
        toast.error("Server error. Please try again later.");
      }
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
    }
  };

  const handleSubmitEdit = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);

    // Validate input fields
    const validationErrors = validateSectionName(
      newSectionName,
      newDepartmentId,
      sequence
    );
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token || !currentSection || !currentSection?.marks_headings_id) {
        throw new Error("No authentication token or section ID found");
      }

      console.log(
        "name:",
        newSectionName,
        "written_exam:",
        newDepartmentId,
        "sequence:",
        sequence
      );

      await axios.put(
        `${API_URL}/api/update_Markheadings/${currentSection?.marks_headings_id}`,
        {
          name: newSectionName,
          written_exam: newDepartmentId,
          sequence: sequence,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      fetchMarksHeading();
      handleCloseModal();
      toast.success("Marks headings updated successfully!");
    } catch (error) {
      console.error("Error editing Marks headings:", error);

      if (error.response?.status === 422 && error.response?.data?.errors) {
        const errors = error.response.data.errors;
        console.log("errors", errors);

        // Handle "sequence" error
        if (errors?.sequence && errors?.sequence?.length > 0) {
          console.log("errors", errors.sequence);
          setNameError(errors.sequence[0]); // Update state with the specific "sequence" error
        }

        // Handle "name" field error (unique name validation)
        else if (errors?.name && errors?.name?.length > 0) {
          console.log("errors", errors.name);
          setNameErrorforName(errors.name[0]); // Update state with the specific "name" field error
        }
      } else {
        toast.error("Server error. Please try again later.");
      }
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
    }
  };

  const handleDelete = (id) => {
    const sectionToDelete = sections.find(
      (sec) => sec.marks_headings_id === id
    );
    setCurrentSection(sectionToDelete);
    setShowDeleteModal(true);
  };

  const handleSubmitDelete = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      // const academicYr = localStorage.getItem("academicYear");

      if (!token || !currentSection || !currentSection?.marks_headings_id) {
        throw new Error("Marks headings ID is missing");
      }

      const response = await axios.delete(
        `${API_URL}/api/delete_Markheadings/${currentSection.marks_headings_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        fetchMarksHeading();
        setShowDeleteModal(false);
        setCurrentSection(null);
        toast.success("Marks headings deleted successfully!");
      } else {
        toast.error(response.data.message || "Failed to delete Marks headings");
      }
    } catch (error) {
      console.error("Error deleting Marks headings:", error);
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

  const handleChangeSectionName = (e) => {
    const { value } = e.target;
    setNameErrorforName("");
    setNewSectionName(value);
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      name: validateSectionName(value, newDepartmentId).name,
    }));
  };
  const handleChangeDepartmentId = (e) => {
    const { value } = e.target;

    setClassName(value); // Update class name
    setNewDepartmentId(value); // Update department (written exam selection)

    // Remove the written exam error if a valid option is selected
    setFieldErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (value) {
        delete newErrors.written_exam; // Clear error if valid
      }
      return newErrors;
    });
  };
  const handleChangeSequence = (e) => {
    const { value } = e.target;
    setNameError("");
    // Only allow numbers with max length 2
    if (/^[0-9]{0,2}$/.test(value)) {
      setSequence(value);

      // Clear sequence error if input is valid
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        sequence: value ? "" : "Please enter a sequence.", // Clear error if value is valid
      }));
    }
  };

  //   const handleChangeDepartmentId = (e) => {
  //     const { value } = e.target;
  //     setClassName(value);
  //     setNewDepartmentId(value);
  //     setFieldErrors((prevErrors) => ({
  //       ...prevErrors,
  //       department_id: validateSectionName(newSectionName, e.target.value)
  //         .department_id,
  //     }));
  //   };

  return (
    <>
      <ToastContainer />

      <div className="container  mt-4">
        <div className="card mx-auto lg:w-3/4 shadow-lg">
          <div className="p-2 px-3 bg-gray-100 flex justify-between items-center">
            <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
              Marks Headings
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
            <div className="h-96 lg:h-96 overflow-y-scroll lg:overflow-x-hidden w-full md:w-[94%] mx-auto ">
              <div className="bg-white rounded-lg shadow-xs ">
                <table className="min-w-full leading-normal table-auto ">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Sr.No
                      </th>
                      <th className=" -px-2  text-center py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Marks Heading
                      </th>
                      <th className=" -px-2  text-center py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Sequence
                      </th>
                      <th className="px-2 w-full md:w-[15%] text-center lg:px-5 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Written Exam
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
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {section?.name}
                            </p>
                          </td>
                          <td className="text-center px-2  border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {section?.sequence}
                            </p>
                          </td>
                          <td className="text-center px-2 lg:px-5 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {section?.written_exam}
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
                                onClick={() =>
                                  handleDelete(section.marks_headings_id)
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
                    <h5 className="modal-title">Create Marks Heading</h5>

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
                        Marks Heading <span className="text-red-500">*</span>
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
                        <span className=" block text-danger text-xs">
                          {nameErrorforName}
                        </span>

                        {fieldErrors.name && (
                          <span className="text-danger text-xs">
                            {fieldErrors.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className=" relative mb-3 flex justify-center  mx-4">
                      <label htmlFor="sequence" className="w-1/2 mt-2">
                        Sequence <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        value={sequence}
                        id="sequence"
                        className="form-control shadow-md mb-2 "
                        onChange={handleChangeSequence}
                        // onChange={(e) => {
                        //   const value = e.target.value;

                        //   // Only allow numeric input with max length 2
                        //   if (/^\d{0,2}$/.test(value)) {
                        //     setSequence(value);
                        //   }
                        // }}
                      />
                    </div>
                    <div className=" w-[60%] relative h-4 -top-6 left-[35%] ">
                      <span className=" block text-danger text-xs">
                        {nameError}
                      </span>
                      {fieldErrors.sequence && (
                        <span className="block text-danger text-xs">
                          {fieldErrors.sequence}
                        </span>
                      )}
                    </div>

                    <div className=" relative mb-3 flex justify-center  mx-4">
                      <label htmlFor="departmentId" className="w-1/2 mt-2">
                        Written Exam <span className="text-red-500">*</span>
                      </label>{" "}
                      <div className="w-full  pt-2">
                        <label>
                          <input
                            type="radio"
                            name="written_exam"
                            value="Y"
                            checked={newDepartmentId === "Y"} // Replace with state for written exam
                            onChange={handleChangeDepartmentId}
                          />{" "}
                          Yes
                        </label>
                        <label className="ml-3">
                          <input
                            type="radio"
                            name="written_exam"
                            value="N"
                            checked={newDepartmentId === "N"} // Replace with state for written exam
                            onChange={handleChangeDepartmentId}
                          />{" "}
                          No
                        </label>
                      </div>{" "}
                    </div>
                    <div className=" w-[60%] relative h-4 -top-4 left-[35%] ">
                      {fieldErrors.written_exam && (
                        <span className="block text-danger text-xs">
                          {fieldErrors.written_exam}
                        </span>
                      )}
                    </div>
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
                      {isSubmitting ? "Saving..." : "Save"}
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
                  <h5 className="modal-title">Edit Marks Heading</h5>
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
                      Marks Heading <span className="text-red-500">*</span>
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
                      <span className=" block text-danger text-xs">
                        {nameErrorforName}
                      </span>

                      {fieldErrors.name && (
                        <span className="text-danger text-xs">
                          {fieldErrors.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className=" relative mb-3 flex justify-center  mx-4">
                    <label htmlFor="sequence" className="w-1/2 mt-2">
                      Sequence <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      value={sequence}
                      id="sequence"
                      className="form-control shadow-md mb-2 "
                      onChange={handleChangeSequence}
                      // onChange={(e) => {
                      //   const value = e.target.value;

                      //   // Only allow numeric input with max length 2
                      //   if (/^\d{0,2}$/.test(value)) {
                      //     setSequence(value);
                      //   }
                      // }}
                    />
                  </div>
                  <div className=" w-[60%] relative h-4 -top-6 left-[35%] ">
                    <span className=" block text-danger text-xs">
                      {nameError}
                    </span>{" "}
                    {fieldErrors.sequence && (
                      <span className="block text-danger text-xs">
                        {fieldErrors.sequence}
                      </span>
                    )}
                  </div>
                  <div className=" relative mb-3 flex justify-center  mx-4">
                    <label htmlFor="departmentId" className="w-1/2 mt-2">
                      Written Exam <span className="text-red-500">*</span>
                    </label>{" "}
                    <div className="w-full  pt-2">
                      <label>
                        <input
                          type="radio"
                          name="written_exam"
                          value="Y"
                          checked={newDepartmentId === "Y"} // Replace with state for written exam
                          onChange={handleChangeDepartmentId}
                        />{" "}
                        Yes
                      </label>
                      <label className="ml-3">
                        <input
                          type="radio"
                          name="written_exam"
                          value="N"
                          checked={newDepartmentId === "N"} // Replace with state for written exam
                          onChange={handleChangeDepartmentId}
                        />{" "}
                        No
                      </label>
                    </div>{" "}
                  </div>
                  <div className=" w-[60%] relative h-4 -top-4 left-[35%] ">
                    {fieldErrors.written_exam && (
                      <span className="block text-danger text-xs">
                        {fieldErrors.written_exam}
                      </span>
                    )}
                  </div>
                  {/* Radio buttons for Written Exam */}
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
                    Are you sure you want to delete Marks Heading:{" "}
                    {currentSection?.name}?
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

export default MarksHeading;
