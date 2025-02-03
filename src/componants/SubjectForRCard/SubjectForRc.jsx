import { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
// import NavBar from "../../../Layouts/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RxCross1 } from "react-icons/rx";

function SubjectForRc() {
  const API_URL = import.meta.env.VITE_API_URL; // url for host
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  // State for handling the edit and add forms
  const [newSectionName, setNewSectionName] = useState("");
  const [newSequenceNumber, setNewSequenceNumber] = useState("");
  const [newSubjectType, setNewSubjectType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [fieldErrors, setFieldErrors] = useState({}); // For field-specific errors
  // validations state for unique name
  const [nameAvailable, setNameAvailable] = useState(true);
  const [nameError, setNameError] = useState("");
  const pageSize = 10;
  const [backendErrors, setBackendErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameErrorforName, setNameErrorforName] = useState("");

  const fetchSections = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        `${API_URL}/api/subject_for_reportcard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setSections(response?.data?.subjects);
      console.log("subject_for_reportcard", response.data?.subjects);
      setPageCount(Math.ceil(response?.data?.subjects.length / pageSize));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const validateSectionName = (name, sequenceNumber) => {
    const errors = {};

    // Validate subject name
    if (!name || name.trim() === "") {
      errors.name = "Subject name is required.";
    }

    // Validate sequence number
    if (!sequenceNumber) {
      errors.sequenceNumber = "Sequence number is required.";
    } else if (!/^\d+$/.test(sequenceNumber)) {
      errors.sequenceNumber = "Please enter a valid whole number.";
    }

    return errors;
  };

  // const validateSectionName = (name) => {
  //   const regex = /^[a-zA-Z]+$/;
  //   let errors = {};
  //   if (!name) errors.name = "Please enter section name.";
  //   if (name.length > 255)
  //     errors.name = "The name field must not exceed 255 characters.";
  //   if (!regex.test(name))
  //     errors.name = "Please enter alphabets without space.";
  //   return errors;
  // };
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // APi calling for check unique name
  const handleBlur = async () => {
    try {
      const token = localStorage.getItem("authToken");
      console.log("the response of the namechack api____", newSectionName);

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${API_URL}/api/check_section_name`,
        { name: newSectionName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log("the response of the namechack api", response.data);
      if (response.data?.exists === true) {
        setNameError("Name is already taken.");
        setNameAvailable(false);
      } else {
        setNameError("");
        setNameAvailable(true);
      }
    } catch (error) {
      console.error("Error checking class name:", error);
    }
  };
  // Function to open the Edit modal with pre-filled data
  const handleEdit = (section) => {
    setCurrentSection(section); // Store the section being edited
    setNewSectionName(section.name); // Pre-fill the section name
    setNewSequenceNumber(section.sequence); // Pre-fill the sequence number
    setShowEditModal(true); // Show the Edit modal
  };
  // Function to open the Add modal and clear the form fields
  const handleAdd = () => {
    setNewSectionName(""); // Reset section name for Add form
    setNewSequenceNumber(""); // Reset sequence number for Add form
    setFieldErrors({}); // Clear any existing field errors
    setNameError(""); // Clear name error
    setShowAddModal(true); // Show the Add modal
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setNewSectionName("");
    setBackendErrors("");
    setCurrentSection(null);
    setFieldErrors({}); // Clear field-specific errors when closing the modal
    setNameError("");
  };

  const handleSubmitAdd = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);

    // Validate both subject name and sequence number
    const validationErrors = validateSectionName(
      newSectionName,
      newSequenceNumber
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

      console.log("Name is:", newSectionName);

      const checkNameResponse = await axios.post(
        `${API_URL}/api/check_subject_name_for_report_card`,
        { sequence: newSequenceNumber },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (checkNameResponse.data?.exists === true) {
        setNameError("The sequence has already been taken.");
        setNameAvailable(false);
        setIsSubmitting(false);
        return;
      } else {
        setNameError("");
        setNameAvailable(true);
      }

      await axios.post(
        `${API_URL}/api/subject_for_reportcard`,
        { name: newSectionName, sequence: newSequenceNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      fetchSections();
      handleCloseModal();
      toast.success("Subject added successfully!");
    } catch (error) {
      console.error("Error adding subject:", error);

      if (error.response?.status === 422 && error.response?.data?.errors) {
        const errors = error.response.data.errors;
        console.log("errors", errors);

        if (errors?.name && errors?.name?.length > 0) {
          // toast.error(errors.name[0]); // Display the specific "name should be unique" error
          setNameErrorforName(errors.name[0]);
        }
        //  else {
        //   // Handle other validation errors if they exist
        //   // Object.values(errors).forEach((err) => toast.error(err[0]));
        // }
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
    // Validate both subject name and sequence number
    const validationErrors = validateSectionName(
      newSectionName,
      newSequenceNumber
    );
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token or academic year found");
      }

      const response = await axios.put(
        `${API_URL}/api/subject_for_reportcard/${currentSection.sub_rc_master_id}`,
        { name: newSectionName, sequence: newSequenceNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      fetchSections();
      handleCloseModal();
      toast.success("Subject Updated successfully!");
    } catch (error) {
      console.error("Error editing Subject:", error);
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const errors = error.response.data.errors;
        console.log("errors", errors);

        if (errors?.name && errors?.name?.length > 0) {
          // toast.error(errors.name[0]); // Display the specific "name should be unique" error
          setNameErrorforName(errors.name[0]);
        }
        // else {
        //   // Handle other validation errors if they exist
        //   Object.values(errors).forEach((err) => toast.error(err[0]));
        // }
      }
      if (error.response && error.response.data && error.response.data.errors) {
        // Store the errors in backendErrors state
        setBackendErrors(error.response.data.errors);
      } else {
        toast.error("Server error. Please try again later.");
      }
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
    }
  };

  // const handleSubmitEdit = async () => {
  //   // Validate both subject name and sequence number
  //   const validationErrors = validateSectionName(
  //     newSectionName,
  //     newSequenceNumber
  //   );
  //   if (Object.keys(validationErrors).length > 0) {
  //     setFieldErrors(validationErrors);
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem("authToken");

  //     if (!token) {
  //       throw new Error("No authentication token or academic year found");
  //     }
  //     //   const nameCheckResponse = await axios.post(
  //     //     `${API_URL}/api/check_subject_name`,
  //     //     { name: newSectionName },
  //     //     {
  //     //       headers: { Authorization: `Bearer ${token}` },
  //     //       withCredentials: true,
  //     //     }
  //     //   );

  //     //   if (nameCheckResponse.data?.exists === true) {
  //     //     setNameError("Name already taken.");
  //     //     setNameAvailable(false);
  //     //     return;
  //     //   } else {
  //     //     setNameError("");
  //     //     setNameAvailable(true);
  //     //   }
  //     const response = await axios.put(
  //       `${API_URL}/api/subject_for_reportcard/${currentSection.sub_rc_master_id}`,
  //       { name: newSectionName, sequence: newSequenceNumber },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         withCredentials: true,
  //       }
  //     );

  //     fetchSections();
  //     handleCloseModal();
  //     toast.success("Subject Updated successfully!");
  //   } catch (error) {
  //     console.error("Error editing Subject:", error);

  //     if (error.response && error.response.data && error.response.data.errors) {
  //       Object.values(error.response.data.errors).forEach((err) =>
  //         toast.error(err)
  //       );
  //     } else {
  //       toast.error("Server error. Please try again later.");
  //     }
  //   }
  // };

  const handleDelete = (id) => {
    const sectionToDelete = sections.find((sec) => sec.sub_rc_master_id === id);
    console.log("sectionToDelete", sectionToDelete, "subjectId", id);
    setCurrentSection(sectionToDelete);
    setShowDeleteModal(true);
  };

  const handleSubmitDelete = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token || !currentSection || !currentSection.sub_rc_master_id) {
        throw new Error("Subject_rc_master_id  is missing");
      }

      const response = await axios.delete(
        `${API_URL}/api/subject_for_reportcard/${currentSection.sub_rc_master_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        fetchSections();
        setShowDeleteModal(false);
        setCurrentSection(null);
        toast.success("Subject deleted successfully!");
      } else {
        toast.error(response.data.message || "Failed to delete subject");
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
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
  const handleChangeSequenceNumber = (e) => {
    const { value } = e.target;
    setBackendErrors("");
    setNameError("");
    setNewSequenceNumber(value);

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      sequenceNumber: /^\d+$/.test(value)
        ? ""
        : "Please enter a valid whole number for the sequence.",
    }));
  };

  const handleChangeSectionName = (e) => {
    const { value } = e.target;
    setNewSectionName(value);
    setNameErrorforName("");

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      name: value ? "" : "Subject name is required.",
    }));
  };

  const filteredSections = sections.filter((section) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      section.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      section.sequence.toString().toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  const displayedSections = filteredSections.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error}</p>;

  return (
    <>
      {/* <NavBar /> */}
      <ToastContainer />

      <div className="container mt-4">
        <div className="card mx-auto lg:w-3/4 shadow-lg">
          <div className="p-2 px-3 bg-gray-100 flex justify-between items-center">
            <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
              Subject for report card
            </h3>
            <div className="box-border flex md:gap-x-2 justify-end md:h-10">
              <div className=" w-1/2 md:w-fit mr-1">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search "
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary btn-sm md:h-9 text-xs md:text-sm"
                onClick={handleAdd}
                // onClick={() => navigate("/CreateStaff")}
              >
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }} />
                Add
              </button>
            </div>
          </div>{" "}
          <div
            className=" relative w-[97%]   mb-3 h-1  mx-auto bg-red-700"
            style={{
              backgroundColor: "#C03078",
            }}
          ></div>
          {/* <div className="card-header flex justify-between items-center">
            <h3 className="text-gray-700 mt-1 text-md lg:text-xl">
              Department
            </h3>
            <div className=" box-border flex gap-x-2  justify-end md:h-10 ">
              <div className="">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search "
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary btn-sm h-9"
                // style={{ width: "80px" }}
                onClick={handleAdd}
              >
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }} />
                Add
              </button>
            </div>
          </div> */}
          <div className="card-body w-full">
            <div className="h-96 lg:h-96 w-full md:w-[83%] mx-auto overflow-y-scroll lg:overflow-x-hidden">
              <div className="bg-white rounded-lg shadow-xs">
                <table className="min-w-full leading-normal table-auto">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-2 w-full md:w-[10%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Sr.No
                      </th>
                      <th className="px-2 w-full md:w-[20%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Sequence No
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Subject for report card
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
                          key={section.department_id}
                          className={`${
                            index % 2 === 0 ? "bg-white" : "bg-gray-100"
                          } hover:bg-gray-50`}
                        >
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {currentPage * pageSize + index + 1}
                            </p>
                          </td>
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {section.sequence}
                            </p>
                          </td>
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {section.name}
                            </p>
                          </td>

                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <button
                              className="text-blue-600 hover:text-blue-800 hover:bg-transparent "
                              onClick={() => handleEdit(section)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                          </td>

                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <button
                              className="text-red-600 hover:text-red-800 hover:bg-transparent "
                              onClick={() =>
                                handleDelete(section.sub_rc_master_id)
                              }
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
            <div className=" flex justify-center  pt-2 -mb-3">
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
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
                activeClassName={"active"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding a new section */}
      {showAddModal && (
        <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="modal"
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered ">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title">
                    Create Subject for report card
                  </h5>
                  <RxCross1
                    className="float-end relative top-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                    type="button"
                    // className="btn-close text-red-600"
                    onClick={handleCloseModal}
                  />
                </div>
                <div
                  className=" relative  mb-3 h-1 w-[99%] mx-auto bg-red-700"
                  style={{
                    backgroundColor: "#C03078",
                  }}
                ></div>
                <div className="modal-body">
                  <div className=" relative mb-3 flex justify-center  mx-4">
                    <label htmlFor="sectionName" className="w-1/2 mt-2">
                      Subject Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={30}
                      className="form-control shadow-md mb-2"
                      id="sectionName"
                      value={newSectionName}
                      onChange={handleChangeSectionName}
                      // onChange={(e) => setNewSectionName(e.target.value)}
                      // onBlur={handleBlur}
                    />
                    <div className="absolute top-9 left-1/3">
                      {/* {!nameAvailable && (
                        <small className=" block text-danger text-xs ">
                          {nameError}
                        </small>
                      )} */}
                      {fieldErrors.name && (
                        <small className="text-danger text-xs">
                          {fieldErrors.name}
                        </small>
                      )}

                      <small className=" block text-danger text-xs ">
                        {nameErrorforName}
                      </small>
                    </div>
                  </div>
                  <div className=" relative mb-3 flex justify-center  mx-4">
                    <label htmlFor="sequenceNumber" className="w-1/2 mt-2">
                      Sequence No <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      className="form-control shadow-md mb-2"
                      id="sequenceNumber"
                      value={newSequenceNumber}
                      onChange={handleChangeSequenceNumber}
                      // onChange={(e) => setNewSectionName(e.target.value)}
                      // onBlur={handleBlur}
                    />
                    <div className="absolute top-9 left-1/3">
                      {!nameAvailable && (
                        <small className=" block text-danger text-xs ">
                          {nameError}
                        </small>
                      )}

                      {fieldErrors.sequenceNumber && (
                        <small className="text-danger text-xs">
                          {fieldErrors.sequenceNumber}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
                <div className=" flex justify-end p-3">
                  {/* <button type="button" className="btn btn-secondary me-2" onClick={handleCloseModal}>Cancel</button> */}
                  <button
                    type="button"
                    className="btn btn-primary  px-3 mb-2"
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
                <h5 className="modal-title">Edit Subject for report card</h5>
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
                <div className=" relative mb-3 flex justify-center  mx-4">
                  <label htmlFor="editSectionName" className="w-1/2 mt-2">
                    Subject Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={30}
                    className="form-control shadow-md mb-2"
                    id="editSectionName"
                    value={newSectionName}
                    onChange={handleChangeSectionName}
                    // onChange={(e) => setNewSectionName(e.target.value)}
                    // onBlur={handleBlur}
                  />
                  <div className="absolute top-9 left-1/3 ">
                    {/* {!nameAvailable && (
                      <small className=" block text-danger text-xs">
                        {nameError}
                      </small>
                    )} */}
                    {fieldErrors.name && (
                      <small className="text-danger text-xs">
                        {fieldErrors.name}
                      </small>
                    )}
                    <small className=" block text-danger text-xs ">
                      {nameErrorforName}
                    </small>
                  </div>
                </div>
                <div className=" relative mb-3 flex justify-center  mx-4">
                  <label htmlFor="sequenceNumber" className="w-1/2 mt-2">
                    Sequence No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    className="form-control shadow-md mb-2"
                    id="sequenceNumber"
                    value={newSequenceNumber}
                    onChange={handleChangeSequenceNumber}
                    // onChange={(e) => setNewSectionName(e.target.value)}
                    // onBlur={handleBlur}
                  />
                  <div className="absolute top-9 left-1/3">
                    {backendErrors.sequence && (
                      <span className="block text-danger text-xs">
                        {backendErrors.sequence[0]}
                      </span>
                    )}
                    {/* {!nameAvailable && (
                      <small className=" block text-danger text-xs ">
                        {nameError}
                      </small>
                    )} */}
                    {fieldErrors.sequenceNumber && (
                      <small className="text-danger text-xs">
                        {fieldErrors.sequenceNumber}
                      </small>
                    )}
                  </div>
                </div>
              </div>
              <div className=" flex justify-end p-3">
                {/* <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button> */}
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
                  Are you sure you want to delete Subject:{" "}
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
    </>
  );
}

export default SubjectForRc;
