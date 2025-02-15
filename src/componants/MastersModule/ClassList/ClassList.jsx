import axios from "axios";
import ReactPaginate from "react-paginate";
import NavBar from "../../../Layouts/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RxCross1 } from "react-icons/rx";

function ClassList() {
  const API_URL = import.meta.env.VITE_API_URL; // url for host
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);

  const [newClassName, setNewClassName] = useState("");
  const [newDepartmentId, setNewDepartmentId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageSize = 10;
  const [validationErrors, setValidationErrors] = useState({});

  // validations state for unique name
  const [nameAvailable, setNameAvailable] = useState(true);
  const [nameError, setNameError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({}); // For field-specific errors
  const [sectionNameis, newSectionNameis] = useState({});
  const [backendErrors, setBackendErrors] = useState({});
  const [roleId, setRoleId] = useState("");
  const fetchClasses = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const academicYr = localStorage.getItem("academicYear");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${API_URL}/api/classes`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Academic-Year": academicYr,
        },
        withCredentials: true,
      });

      setClasses(response.data);
      setPageCount(Math.ceil(response?.data?.length / pageSize));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("authToken");
      // const academicYr = localStorage.getItem("academicYear");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${API_URL}/api/sections`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setDepartments(response.data);
    } catch (error) {
      setError(error.message);
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
  useEffect(() => {
    fetchClasses();
    fetchDepartments();
    fetchDataRoleId();
  }, []);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // const validateClassData = (name, departmentId) => {
  //   const errors = {};
  //   if (!name || name.trim() === "") {
  //     errors.name = "Please enter class name.";
  //   } else if (!/^[A-Za-z0-9]+$/.test(name)) {
  //     errors.name = "The name field only contain alphabets and numbers.";
  //   } else if (name.length > 30) {
  //     errors.name = "The name field must not exceed 30 characters.";
  //   }
  //   if (!departmentId || isNaN(departmentId)) {
  //     errors.department_id = "Please select section.";
  //   }
  //   return errors;
  // };

  // const handleInputChange = (setter, validator) => (e) => {
  //   const { value } = e.target;
  //   setter(value);
  //   // Perform validation based on the field that triggered the change
  //   const errors = validateClassData(newClassName, newDepartmentId);
  //   setValidationErrors(errors);
  // };

  const validateSectionName = (name, departmentId) => {
    const errors = {};

    // Regular expression to match only alphabets
    // const alphabetRegex = /^[A-Za-z]+$/;

    if (!name || name.trim() === "") {
      errors.name = "Please enter class name.";
    } else if (!/^[A-Za-z0-9]+$/.test(name)) {
      errors.name = "The name field only contain alphabets and numbers.";
    } else if (name.length > 30) {
      errors.name = "The name field must not exceed 30 character.";
    }

    if (!departmentId) {
      errors.department_id = "Please Select section.";
    }

    return errors;
  };

  // APi calling for check unique name
  const handleBlur = async () => {
    try {
      const token = localStorage.getItem("authToken");
      console.log("the response of the namechack api____");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${API_URL}/api/check_class_name`,
        { name: newClassName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log("the response of the namechack api", response.data);
      if (response.data?.exists === true) {
        console.log("the EXI NAME IS  ");

        setNameError("Name is already taken.");
        setNameAvailable(false);
        return;
      } else {
        console.log("the EXI NAME IS NO  ");

        setNameError("");
        setNameAvailable(true);
      }
    } catch (error) {
      console.error("Error checking class name:", error);
    }
  };

  const handleEdit = (classItem) => {
    setCurrentClass(classItem);
    console.log("the edit ", classItem);
    newSectionNameis(classItem?.get_department?.name);
    setNewClassName(classItem.name);
    setNewDepartmentId(classItem.department_id);
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setNewClassName("");
    setNewDepartmentId("");
    setCurrentClass(null);
    setValidationErrors({});
    setNameError("");
    setFieldErrors({});
    setBackendErrors("");
  };

  // const handleSubmitAdd = async () => {
  //   const validationErrors = validateSectionName(newClassName, newDepartmentId);
  //   if (Object.keys(validationErrors).length > 0) {
  //     setFieldErrors(validationErrors);
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem("authToken");
  //     // const academicYr = localStorage.getItem("academicYear");

  //     if (!token) {
  //       throw new Error("No authentication token found");
  //     }

  //     if (!nameAvailable) {
  //       return;
  //     }

  //     await axios.post(
  //       `${API_URL}/api/classes`,
  //       { name: newClassName, department_id: newDepartmentId },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         withCredentials: true,
  //       }
  //     );

  //     fetchClasses();
  //     handleCloseModal();
  //     toast.success("Class added successfully!");
  //   } catch (error) {
  //     if (error.response && error.response.data) {
  //       toast.error(`Error adding class: ${error.response.data.message}`);
  //     } else {
  //       toast.error(`Error adding class: ${error.message}`);
  //     }
  //     console.error("Error adding class:", error);
  //   }
  // };
  const handleSubmitAdd = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    // Perform validation first
    const validationErrors = validateSectionName(newClassName, newDepartmentId);
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

      // Step 1: Check if the class name is available using the same logic from handleBlur
      const checkNameResponse = await axios.post(
        `${API_URL}/api/check_class_name`,
        { name: newClassName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // Step 2: If the name already exists, stop the submission
      if (checkNameResponse.data?.exists) {
        setNameError("Name is already taken.");
        setNameAvailable(false);
        setIsSubmitting(false);
        return;
      } else {
        setNameError("");
        setNameAvailable(true);
      }

      // Step 3: Continue with form submission if name is available
      await axios.post(
        `${API_URL}/api/classes`,
        { name: newClassName, department_id: newDepartmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // Step 4: Post-submission actions
      fetchClasses();
      handleCloseModal();
      toast.success("Class added successfully!");
    } catch (error) {
      // Handle errors
      if (error.response && error.response.data) {
        toast.error(`Error adding class: ${error.response.data.message}`);
      } else {
        toast.error(`Error adding class: ${error.message}`);
      }
      console.error("Error adding class:", error);
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
    }
  };

  // const handleSubmitEdit = async () => {
  //   const validationErrors = validateSectionName(newClassName, newDepartmentId);
  //   if (Object.keys(validationErrors).length > 0) {
  //     setFieldErrors(validationErrors);
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem("authToken");

  //     if (!token || !currentClass || !currentClass.class_id) {
  //       throw new Error("Class ID is missing");
  //     }
  //     console.log("the EXI NAME IS  ", currentClass);
  //     console.log("The name is  ", newClassName);

  //     // Step 1: Check if the class name is available using the same logic from handleBlur
  //     // const checkNameResponse = await axios.post(
  //     //   `${API_URL}/api/check_class_name`,
  //     //   { name: newClassName },
  //     //   {
  //     //     headers: {
  //     //       Authorization: `Bearer ${token}`,
  //     //     },
  //     //     withCredentials: true,
  //     //   }
  //     // );

  //     // Step 2: If the name already exists, stop the submission
  //     // if (checkNameResponse.data?.exists) {
  //     //   setNameError("Name is already taken.");
  //     //   setNameAvailable(false);
  //     //   return;
  //     // } else {
  //     //   setNameError("");
  //     //   setNameAvailable(true);
  //     // }

  //     console.log("className:", newClassName, "deparment_id", newDepartmentId);
  //     const response = await axios.put(
  //       `${API_URL}/api/classes/${currentClass.class_id}`,
  //       { name: newClassName, department_id: newDepartmentId },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         withCredentials: true,
  //       }
  //     );

  //     fetchClasses();
  //     handleCloseModal();
  //     toast.success("Class updated successfully!");
  //   } catch (error) {
  //     if (error.response && error.response.data) {
  //       toast.error(`Error updating class: ${error.response.data.message}`);
  //     } else {
  //       toast.error(`Error updating class: ${error.message}`);
  //     }
  //     console.error("Error editing class:", error);
  //   }
  // };
  const handleSubmitEdit = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    const validationErrors = validateSectionName(newClassName, newDepartmentId);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setIsSubmitting(false); // Reset submitting state if validation fails

      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      if (!token || !currentClass || !currentClass.class_id) {
        throw new Error("Class ID is missing");
      }

      console.log("Existing Class:", currentClass);
      console.log("New Class Name:", newClassName);

      const response = await axios.put(
        `${API_URL}/api/classes/${currentClass.class_id}`,
        { name: newClassName, department_id: newDepartmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      fetchClasses();
      handleCloseModal();
      toast.success("Class updated successfully!");

      // Reset backend errors on successful submission
      setBackendErrors({});
    } catch (error) {
      if (error.response && error.response.data) {
        const backendErrors = error.response.data.errors;
        if (backendErrors) {
          // Store backend validation errors in the state
          setBackendErrors(backendErrors);

          // Optionally show a toast with error messages
          toast.error(`Error: ${backendErrors.name?.join(", ")}`);
        } else {
          toast.error(`Error updating class: ${error.response.data.message}`);
        }
      } else {
        toast.error(`Error updating class: ${error.message}`);
      }
      console.error("Error editing class:", error);
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
    }
  };

  const handleDelete = (id) => {
    // console.log("inside delete of subjectallotmenbt", id);
    // console.log("inside delete of subjectallotmenbt", classes);

    const classToDelete = classes.find((cls) => cls.class_id === id);
    console.log("the classto didlete", classToDelete);
    setCurrentClass(classToDelete);
    setShowDeleteModal(true);
  };
  const handleSubmitDelete = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await axios.delete(
        `${API_URL}/api/classes/${currentClass.class_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // Handle successful deletion
      if (response.data && response.data.status === 400) {
        const errorMessage = response.data.message || "Delete failed.";
        toast.error(errorMessage);
      } else {
        toast.success("Class deleted successfully!");
        fetchClasses(); // Refresh the classes list
      }

      setShowDeleteModal(false); // Close the modal
    } catch (error) {
      console.error("Error deleting class:", error);

      // Handle error responses
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.message || "Delete failed.";
        toast.error(errorMessage);
      } else {
        toast.error("Server error. Please try again later.");
      }
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
      setShowDeleteModal(false);
    }
  };

  // const handleSubmitDelete = async () => {
  //   try {
  //     const token = localStorage.getItem("authToken");

  //     if (!token || !currentClass || !currentClass.class_id) {
  //       throw new Error("Class ID is missing");
  //     }

  //     await axios.delete(`${API_URL}/api/classes/${currentClass.class_id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       withCredentials: true,
  //     });

  //     fetchClasses();
  //     setShowDeleteModal(false);
  //     setCurrentClass(null);
  //     toast.success("Class deleted successfully!");
  //   } catch (error) {
  //     if (error.response && error.response.data) {
  //       toast.error(`Error deleting class: ${error.response.data.message}`);
  //     } else {
  //       toast.error(`Error deleting class: ${error.message}`);
  //     }
  //     console.error("Error deleting class:", error);
  //     // setError(error.message);
  //   }
  // };
  // Handle focus event

  // const filteredClasses = classes.filter(
  //   (cls) =>
  //     cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     cls?.get_department?.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const filteredClasses = classes.filter((cls, index) => {
    const searchLower = searchTerm.toLowerCase();

    return (
      cls.name.toLowerCase().includes(searchLower) || // Filter by name
      cls?.students_count?.toString().includes(searchLower) || // Filter by students_count
      cls?.get_department?.name.toLowerCase().includes(searchLower) // Filter by department name
    );
  });

  const displayedClasses = filteredClasses.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );
  const handleChangeSectionName = (e) => {
    const { value } = e.target;
    setNameError("");
    console.log("sectionNameis", sectionNameis, "value is", e.target.value);

    // setNameError("");
    setBackendErrors("");
    setNewClassName(value);
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      name: validateSectionName(value, newDepartmentId).name,
    }));
  };

  const handleChangeDepartmentId = (e) => {
    const { value } = e.target;

    // setNewClassName(value);
    console.log(
      "sectionNameis",
      sectionNameis,
      "reatValue",
      value,
      "value is",
      e.target.value
    );
    setNewDepartmentId(value);
    // console.log("departmentId", department_id);
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      department_id: validateSectionName(value, e.target.value).department_id,
    }));
  };

  return (
    <>
      {/* <NavBar /> */}
      <ToastContainer />
      <div className="container mt-4">
        <div className="card mx-auto lg:w-3/4 shadow-lg">
          <div className="p-2 px-3 bg-gray-100 flex justify-between items-center">
            <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
              Class
            </h3>
            <div className="box-border flex md:gap-x-2 justify-end md:h-10">
              <div className=" w-1/2 md:w-fit mr-1">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
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
          </div>
          <div
            className=" relative w-[97%]   mb-3 h-1  mx-auto bg-red-700"
            style={{
              backgroundColor: "#C03078",
            }}
          ></div>
          <div className="card-body w-full">
            <div className="h-96 lg:h-96 overflow-y-scroll lg:overflow-x-hidden w-full md:w-[84%] mx-auto">
              <div className="bg-white rounded-lg shadow-xs">
                <table className="min-w-full leading-normal table-auto">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-2 text-center w-full md:w-[10%] lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Sr.No
                      </th>
                      <th className="px-2 text-center w-full md:w-[14%]  lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Class
                      </th>
                      <th className="px-2 w-full md:w-[19%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Total student
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Section
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
                    {console.log("classLIst module api", displayedClasses)}
                    {loading ? (
                      <div className=" absolute left-[4%] w-[100%]  text-center flex justify-center items-center mt-14">
                        <div className=" text-center text-xl text-blue-700">
                          Please wait while data is loading...
                        </div>
                      </div>
                    ) : displayedClasses.length ? (
                      displayedClasses.map((classItem, index) => (
                        <tr
                          key={classItem.class_id}
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
                              {classItem.name}
                            </p>
                          </td>
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {classItem.students_count}
                            </p>
                          </td>
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {
                                departments.find(
                                  (dep) =>
                                    dep.department_id ===
                                    classItem.department_id
                                )?.name
                              }
                            </p>
                          </td>
                          {roleId === "M" ? (
                            <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                              <button
                                className="text-pink-600 hover:text-pink-800 hover:bg-transparent "
                                // onClick={() => handleEdit(classItem)}
                              >
                                {/* <FontAwesomeIcon icon={faEdit} /> */}
                              </button>
                            </td>
                          ) : (
                            <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                              <button
                                className="text-blue-600 hover:text-blue-800 hover:bg-transparent "
                                onClick={() => handleEdit(classItem)}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                            </td>
                          )}

                          {roleId === "M" ? (
                            <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                              <button
                                className="text-green-600 hover:text-green-800 hover:bg-transparent "
                                // onClick={() => handleDelete(classItem.class_id)}
                              >
                                {/* <FontAwesomeIcon icon={faTrash} /> */}
                              </button>
                            </td>
                          ) : (
                            <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                              <button
                                className="text-red-600 hover:text-red-800 hover:bg-transparent "
                                onClick={() => handleDelete(classItem.class_id)}
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
                containerClassName={"pagination"}
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title">Create New Class</h5>
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
                    <label htmlFor="newClassName" className="w-1/2 mt-2">
                      Class Name <span className="text-red-500">*</span>{" "}
                    </label>
                    <input
                      type="text"
                      maxLength={30}
                      className="form-control shadow-md mb-2"
                      // placeholder="e.g 1,2"
                      id="newClassName"
                      value={newClassName}
                      // onChange={handleInputChange(setNewClassName)}
                      // onChange={handleChangeSectionName}
                      // onChange={handleChangeDepartmentId}
                      onChange={handleChangeSectionName}
                      onBlur={handleBlur}

                      // onChange={(e) => setNewClassName(e.target.value)}
                    />
                    <div className="absolute  top-9 left-1/3">
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
                  <div className=" relative -top-1 mb-3 flex justify-center  mx-4">
                    <label htmlFor="newDepartmentId" className="w-1/2 mt-2">
                      Section <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="form-control"
                      id="newDepartmentId shadow-md"
                      value={newDepartmentId}
                      // onChange={handleInputChange(setNewDepartmentId)}

                      // onChange={(e) => setNewDepartmentId(e.target.value)}
                      onChange={handleChangeDepartmentId}
                    >
                      <option value="">Select</option>
                      {departments.map((department) => (
                        <option
                          key={department.department_id}
                          value={department.department_id}
                        >
                          {department.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute top-9 left-1/3">
                      {fieldErrors.department_id && (
                        <span className="text-danger text-xs">
                          {fieldErrors.department_id}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className=" flex justify-end p-3">
                  <button
                    type="button"
                    className="btn btn-primary px-3 mb-2 "
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal show " style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title">Edit Class</h5>
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
                    <label htmlFor="newClassName" className="w-1/2 mt-2">
                      Class Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={30}
                      className="form-control shadow-md mb-2"
                      id="newClassName"
                      value={newClassName}
                      // placeholder="e.g 1,2"
                      // onChange={handleInputChange(setNewClassName)}
                      onBlur={handleBlur}
                      // onChange={handleChangeSectionName}
                      // onChange={handleChangeDepartmentId}
                      onChange={handleChangeSectionName}

                      // onChange={(e) => setNewClassName(e.target.value)}
                    />
                    <div className="absolute top-9 left-1/3 ">
                      {backendErrors.name && (
                        <span className="text-danger text-xs">
                          {backendErrors.name.join(", ")}
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
                    <label htmlFor="newDepartmentId" className="w-1/2 mt-2">
                      Section <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="form-control"
                      id="newDepartmentId shadow-md"
                      value={newDepartmentId}
                      // onChange={handleInputChange(setNewDepartmentId)}

                      // onChange={(e) => setNewDepartmentId(e.target.value)}
                      onChange={handleChangeDepartmentId}
                    >
                      <option value="">Select</option>
                      {departments.map((department) => (
                        <option
                          key={department.department_id}
                          value={department.department_id}
                        >
                          {department.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute top-9 left-1/3">
                      {fieldErrors.department_id && (
                        <span className="text-danger text-xs">
                          {fieldErrors.department_id}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className=" flex justify-end p-3">
                  {/* <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button> */}
                  <button
                    type="button"
                    className="btn btn-primary  px-3 mb-2"
                    onClick={handleSubmitEdit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal show " style={{ display: "block" }}>
            <div className="modal-dialog  modal-dialog-centered">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title">Delete Class</h5>
                  <RxCross1
                    className="float-end relative mt-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                    type="button"
                    // className="btn-close text-red-600"
                    onClick={handleCloseModal}
                  />
                </div>
                <div
                  className=" relative  mb-3 h-1 w-[100%] mx-auto bg-red-700"
                  style={{
                    backgroundColor: "#C03078",
                  }}
                ></div>
                <div className="modal-body">
                  <p>
                    Are you sure you want to delete this class{" "}
                    {currentClass?.name}?
                  </p>
                </div>
                <div className=" flex justify-end p-3">
                  {/* <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button> */}
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
        </div>
      )}
    </>
  );
}

export default ClassList;

// For correct seaching

//
