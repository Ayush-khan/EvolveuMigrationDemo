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
import Loader from "../../common/Loader";
import LoadingSpinner from "../../common/LoadingSpinner";

function Sections() {
  const API_URL = import.meta.env.VITE_API_URL; // url for host
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [newSectionName, setNewSectionName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [fieldErrors, setFieldErrors] = useState({}); // For field-specific errors
  // validations state for unique name
  const [nameAvailable, setNameAvailable] = useState(true);
  const [nameError, setNameError] = useState("");
  const [roleId, setRoleId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageSize = 10;

  const fetchSections = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${API_URL}/api/sections`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setSections(response.data);
      setPageCount(Math.ceil(response.data.length / pageSize));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
    fetchDataRoleId();
  }, []);

  const validateSectionName = (name) => {
    const regex = /^[a-zA-Z]+$/;
    let errors = {};

    // Check if the name is empty
    if (!name) {
      errors.name = "Please enter the section name.";
    } else {
      // Additional validations if the name is not empty
      if (name.length > 255) {
        errors.name = "The name field must not exceed 255 characters.";
      } else if (!regex.test(name)) {
        errors.name = "Please enter alphabets without spaces.";
      }
    }

    return errors;
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
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

  // // APi calling for check unique name
  // const handleBlur = async () => {
  //   try {
  //     const token = localStorage.getItem("authToken");
  //     console.log("the response of the namechack api____", newSectionName);

  //     if (!token) {
  //       throw new Error("No authentication token found");
  //     }

  //     const response = await axios.post(
  //       `${API_URL}/api/check_section_name`,
  //       { name: newSectionName },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         withCredentials: true,
  //       }
  //     );
  //     console.log("the response of the namechack api", response.data);
  //     if (response.data?.exists === true) {
  //       setNameError("Name is already taken.");
  //       setNameAvailable(false);
  //     } else {
  //       setNameError("");
  //       setNameAvailable(true);
  //     }
  //   } catch (error) {
  //     console.error("Error checking class name:", error);
  //   }
  // };
  const handleEdit = (section) => {
    setCurrentSection(section);
    setNewSectionName(section.name);
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
    setCurrentSection(null);
    setFieldErrors({}); // Clear field-specific errors when closing the modal
    setNameError("");
  };
  const handleSubmitAdd = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);

    const validationErrors = validateSectionName(newSectionName);
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

      const checkNameResponse = await axios.post(
        `${API_URL}/api/check_section_name`,
        { name: newSectionName },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (checkNameResponse.data?.exists === true) {
        setNameError("Name is already taken.");
        setNameAvailable(false);
        setIsSubmitting(false);
        return;
      } else {
        setNameError("");
        setNameAvailable(true);
      }

      await axios.post(
        `${API_URL}/api/sections`,
        { name: newSectionName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      fetchSections();
      handleCloseModal();
      toast.success("Section added successfully!");
    } catch (error) {
      console.error("Error adding section:", error);
      toast.error("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
    }
  };

  // const handleSubmitAdd = async () => {
  //   const validationErrors = validateSectionName(newSectionName);
  //   if (Object.keys(validationErrors).length > 0) {
  //     setFieldErrors(validationErrors);
  //     return;
  //   }
  //   try {
  //     const token = localStorage.getItem("authToken");

  //     if (!token) {
  //       throw new Error("No authentication token or academic year found");
  //     }
  //     console.log("Name is:", newSectionName);

  //     const checkNameResponse = await axios.post(
  //       `${API_URL}/api/check_section_name`,
  //       { name: newSectionName },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //         withCredentials: true,
  //       }
  //     );

  //     if (checkNameResponse.data?.exists === true) {
  //       setNameError("Name is already taken.");
  //       setNameAvailable(false);
  //       return;
  //     } else {
  //       setNameError("");
  //       setNameAvailable(true);
  //     }
  //     await axios.post(
  //       `${API_URL}/api/sections`,
  //       { name: newSectionName },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         withCredentials: true,
  //       }
  //     );

  //     fetchSections();
  //     handleCloseModal();
  //     toast.success("Section added successfully!");
  //   } catch (error) {
  //     console.error("Error adding section:", error);
  //     if (error.response && error.response.data && error.response.data.errors) {
  //       Object.values(error.response.data.errors).forEach((err) =>
  //         toast.error(err)
  //       );
  //     } else {
  //       toast.error("Server error. Please try again later.");
  //     }
  //   }
  // };

  const handleSubmitEdit = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);

    // Validate the new section name locally
    const validationErrors = validateSectionName(newSectionName);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setIsSubmitting(false); // Reset submitting state if validation fails
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token or academic year found");
      }

      // Send PUT request to update the section
      await axios.put(
        `${API_URL}/api/sections/${currentSection.department_id}`,
        { name: newSectionName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // Handle success response
      fetchSections(); // Refresh section list
      handleCloseModal(); // Close modal
      toast.success("Section updated successfully!"); // Show success toast
      setNameError(""); // Clear any previous name errors
    } catch (error) {
      console.error("Error editing section:", error);

      // Handle validation errors from the server response
      if (
        error.response &&
        error.response.status === 422 &&
        error.response.data.errors
      ) {
        const errors = error.response.data.errors;

        // Display error in toast and on-screen
        if (errors.name) {
          console.log("eroor", errors.name);
          setNameError(errors.name); // Show the first error message on-screen
          errors.name.forEach((err) => toast.error(err)); // Show all name errors in the toast
        }

        // Handle other field errors (if necessary)
        // For example: Display description or other field errors in the UI
      } else {
        // Handle other errors
        toast.error("Server error. Please try again later.");
      }
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
    }
  };

  const handleDelete = (id) => {
    const sectionToDelete = sections.find((sec) => sec.department_id === id);
    setCurrentSection(sectionToDelete);
    setShowDeleteModal(true);
  };

  const handleSubmitDelete = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token || !currentSection || !currentSection.department_id) {
        throw new Error("Section ID is missing");
      }

      const response = await axios.delete(
        `${API_URL}/api/sections/${currentSection.department_id}`,
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
        toast.success("Section deleted successfully!");
      } else {
        toast.error(response.data.message || "Failed to delete section");
      }
      // setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting section:", error);
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
  const handleChangeSectionName = (e) => {
    const { value } = e.target;
    setNameError("");

    setNewSectionName(value);
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      name: validateSectionName(value).name,
    }));
  };

  const filteredSections = sections.filter((section) =>
    section.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              Section
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
            <div className="h-96 lg:h-96 overflow-y-auto lg:overflow-x-hidden">
              {" "}
              <div className="bg-white rounded-lg shadow-xs  w-full md:w-[80%] mx-auto">
                <table className="min-w-full  leading-normal table-auto">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-2 text-center  lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Sr.No
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Section name
                      </th>

                      <th className="px-2  text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Edit
                      </th>
                      <th className="px-2  text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
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
                      displayedSections.map((section, index) => (
                        <tr
                          key={section?.department_id}
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
                              {section?.name}
                            </p>
                          </td>
                          {roleId === "M" ? (
                            <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                              <button
                                className="text-pink-600 hover:text-pink-800 hover:bg-transparent "
                                // onClick={() => handleEdit(section)}
                              >
                                {/* <FontAwesomeIcon icon={faEdit} /> */}
                              </button>
                            </td>
                          ) : (
                            <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                              <button
                                className="text-blue-600 hover:text-blue-800 hover:bg-transparent "
                                onClick={() => handleEdit(section)}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                            </td>
                          )}
                          {roleId === "M" ? (
                            <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                              <button
                                className="text-green-600 hover:green-red-800 hover:bg-transparent "
                                // onClick={() =>
                                //   handleDelete(section.department_id)
                                // }
                              >
                                {/* <FontAwesomeIcon icon={faTrash} /> */}
                              </button>
                            </td>
                          ) : (
                            <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                              <button
                                className="text-red-600 hover:text-red-800 hover:bg-transparent "
                                onClick={() =>
                                  handleDelete(section.department_id)
                                }
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center text-red-700 text-xl py-10"
                        >
                          Oops! No data found.
                        </td>
                      </tr>
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
                  <h5 className="modal-title">Create New Section</h5>
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
                <div className="modal-body">
                  <div className=" relative mb-3 flex justify-center  mx-4">
                    <label htmlFor="sectionName" className="w-1/2 mt-2">
                      Section Name <span className="text-red-500">*</span>
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
                      {!nameAvailable && (
                        <small className=" block text-danger text-xs ">
                          {nameError}
                        </small>
                      )}
                      {fieldErrors.name && (
                        <small className="text-danger text-xs">
                          {fieldErrors.name}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
                <div className=" flex justify-end p-3">
                  {/* <button type="button" className="btn btn-secondary me-2" onClick={handleCloseModal}>Cancel</button> */}
                  {/* <button
                    type="button"
                    className="btn btn-primary  px-3 mb-2"
                    style={{}}
                    onClick={handleSubmitAdd}
                  >
                    Add
                  </button> */}
                  <button
                    type="button"
                    className="btn btn-primary px-3 mb-2"
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
                <h5 className="modal-title">Edit Section</h5>
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
                    Section Name <span className="text-red-500">*</span>
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
                    {nameError && (
                      <small className=" block text-danger text-xs">
                        {nameError}
                      </small>
                    )}
                    {fieldErrors.name && (
                      <small className="text-danger text-xs">
                        {fieldErrors.name}
                      </small>
                    )}
                  </div>
                </div>
              </div>
              <div className=" flex justify-end p-3">
                {/* <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button> */}
                {/* <button
                  type="button"
                  className="btn btn-primary px-3 mb-2 "
                  style={{}}
                  onClick={handleSubmitEdit}
                >
                  Update
                </button> */}
                <button
                  type="button"
                  className="btn btn-primary px-3 mb-2"
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
                  Are you sure you want to delete section: {currentSection.name}
                  ?
                </p>
              </div>
              <div className=" flex justify-end p-3">
                {/* <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button> */}
                <button
                  type="button"
                  className="btn btn-danger px-3 mb-2"
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

export default Sections;
