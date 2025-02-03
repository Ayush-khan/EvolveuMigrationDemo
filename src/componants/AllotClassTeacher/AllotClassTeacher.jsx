import { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RxCross1 } from "react-icons/rx";
import Select from "react-select";

// The Division List component
function AllotClassTeacher() {
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
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [teacherId, setTeacherId] = useState(""); // State for selected teacher
  const [roleId, setRoleId] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const pageSize = 10;

  useEffect(() => {
    fetchClassTeacher();
    fetchTeachers();
    fetchClassNames();
    fetchDataRoleId();
  }, []);
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
      setAcademicYear(sessionResponse?.data?.custom_claims?.academic_yr);
      console.log("roleIDis:", sessionResponse.data);
      // Fetch academic year data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // const fetchClassNames = async () => {
  //   try {
  //     const token = localStorage.getItem("authToken");
  //     const response = await axios.get(`${API_URL}/api/get_class_section`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     console.log("the classes are ", response.data);
  //     setClasses(
  //       response.data.map((classItem) => ({
  //         value: classItem.section_id,
  //         label: `${classItem?.get_class?.name}${" "}${classItem.name}`,
  //       }))
  //     );
  //   } catch (error) {
  //     toast.error("Error fetching class names");
  //   }
  // };
  const fetchClassNames = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/get_class_section`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("the classes are ", response.data);
      setClasses(
        response.data.map((classItem) => ({
          value: {
            class_id: classItem?.class_id,
            section_id: classItem?.section_id,
          },
          label: `${classItem?.get_class?.name}${" "}${classItem?.name}`,
        }))
      );
    } catch (error) {
      toast.error("Error fetching class names");
    }
  };

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/get_teacher_list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(
        response.data.map((teacher) => ({
          value: teacher.reg_id,
          label: teacher.name,
        }))
      );
    } catch (error) {
      toast.error("Error fetching teachers");
    }
  };

  const fetchClassTeacher = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/get_Classteacherslist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Allot Teacher tab", response.data);
      setSections(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateFields = (departmentId, teacherId) => {
    const errors = {};

    if (!departmentId) {
      errors.department_id = "Please select a class."; // Error message for class dropdown
    }

    if (!teacherId) {
      errors.teacher_id = "Please select a teacher."; // Error message for teacher dropdown
    }

    return errors;
  };

  const handleAdd = () => {
    setShowAddModal(true);
    setFieldErrors({});
    setNewSectionName("");
    setNewDepartmentId("");
  };
  const handleDelete = (id) => {
    console.log("Deleting teacher with ID:", id);
    console.log("Available sections:", sections);

    // Find the section related to the teacher
    const sectionToDelete = sections.find((sec) => sec.teacher_id === id);

    if (sectionToDelete) {
      setCurrentSection(sectionToDelete); // Set the section to delete in state
      setShowDeleteModal(true); // Show the delete modal
      console.log("Section to be deleted:", sectionToDelete);
    } else {
      console.log("No section found for the given teacher_id");
    }
  };

  const handleEdit = (section) => {
    setCurrentSection(section);
    setNewSectionName(section?.section_id);
    setClassName(
      `${section?.get_class?.name}${" "} ${section?.get_division?.name}`
    ); // Readonly class field
    setNewDepartmentId(section?.get_class?.class_id);
    setTeacherId(section?.get_teacher?.teacher_id);
    console.log("the handleEdit ", section);
    // setTeacherId(" ");
    // Set the teacher object for prefill (value and label)
    // Set the teacher object for prefill (value and label)
    if (section?.get_teacher?.teacher_id && section?.get_teacher?.name) {
      setSelectedTeacher({
        value: section?.get_teacher?.teacher_id,
        label: section?.get_teacher?.name,
      });
    } else {
      setSelectedTeacher(null); // Handle cases where teacher is not assigned
    }

    // setSelectedTeacher({
    //   value: section?.get_teacher?.teacher_id,
    //   label: section?.get_teacher?.name, // Ensure the name field is available
    // });

    setShowEditModal(true);
    setFieldErrors({});
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setNewSectionName("");
    setNewDepartmentId("");
    setCurrentSection(null);
    setFieldErrors({});
    setTeacherId("");
    setNameError("");
  };

  const handleSubmitAdd = async () => {
    const validationErrors = validateFields(newDepartmentId, teacherId);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }
    console.log(
      "Edit Form",
      "name:",
      newSectionName,
      "class_id:",
      newDepartmentId?.class_id,
      "section_id:",
      newDepartmentId?.section_id, // Pass class ID
      "teacher_id:",
      teacherId,
      "academicYear:",
      academicYear
    );
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${API_URL}/api/save_ClassTeacher`,
        {
          name: newSectionName,
          class_id: newDepartmentId?.class_id, // Pass class ID
          section_id: newDepartmentId?.section_id,
          teacher_id: teacherId, // Pass teacher ID
          academic_yr: academicYear,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchClassTeacher();
      handleCloseModal();
      toast.success(" Class Teacher added successfully!");
    } catch (error) {
      console.log("error:", error?.response?.data?.message);
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  const handleSubmitEdit = async () => {
    const validationErrors = validateFields(newDepartmentId, teacherId);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }
    console.log(
      "Edit Form",
      "name:",
      newSectionName,
      "class_id:",
      newDepartmentId, // Pass class ID
      "teacher_id:",
      teacherId
    );
    console.log("new start checking the teacheID");
    if (!teacherId) {
      console.log("check teacherId is here");
      setFieldErrors({ teacher_id: "Please select a teacher." });
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      console.log("currentSectionissss", currentSection);
      await axios.put(
        `${API_URL}/api/update_ClassTeacher/${currentSection.class_id}/${currentSection.section_id}`,
        {
          section_id: newSectionName,
          class_id: newDepartmentId, // Pass class ID
          teacher_id: teacherId, // Pass teacher ID
          // academic_yr: academicYear,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchClassTeacher();
      setTeacherId("");
      handleCloseModal();
      toast.success("Allot class teacher updated successfully!");
    } catch (error) {
      toast.error("Error updating Class teacher. Please try again.");
    }
  };

  const handleSubmitDelete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const academicYr = localStorage.getItem("academicYear");

      if (!token || !currentSection || !currentSection.section_id) {
        throw new Error("Class Teacher ID is missing");
      }

      const response = await axios.delete(
        `${API_URL}/api/delete_ClassTeacher/${currentSection.class_id}/${currentSection.section_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Academic-Year": academicYr,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        fetchClassTeacher();
        setShowDeleteModal(false);
        setCurrentSection(null);
        toast.success("Allot Class Teacher deleted successfully!");
      } else {
        toast.error(response.data.message || "Failed to delete Division");
      }
    } catch (error) {
      console.error("Error deleting Allot Class Teacher:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Server error. Please try again later.");
      }
    }
  };
  // Filter and paginate sections
  const filteredSections = sections.filter((section) =>
    section?.get_teacher?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the total number of pages
  useEffect(() => {
    setPageCount(Math.ceil(filteredSections.length / pageSize));
  }, [filteredSections.length]);

  // Get the sections for the current page
  const displayedSections = filteredSections.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  // Handle page change
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleClassChange = (selectedOption) => {
    setNewDepartmentId(selectedOption ? selectedOption.value : "");
    // Clear class error if it was previously set
    setFieldErrors((prevErrors) => ({ ...prevErrors, department_id: "" }));
  };

  const handleTeacherChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedTeacher({
        value: selectedOption.value,
        label: selectedOption.label,
      });
    } else {
      setSelectedTeacher(null); // Clear the selection if no option is selected
    }
    setTeacherId(selectedOption ? selectedOption.value : "");
    // Clear teacher error if it was previously set
    setFieldErrors((prevErrors) => ({ ...prevErrors, teacher_id: "" }));
  };

  return (
    <>
      <ToastContainer />

      <div className="container  mt-4">
        <div className="card mx-auto lg:w-3/4 shadow-lg">
          <div className="p-2 px-3 bg-gray-100 flex justify-between items-center">
            <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
              Class Teacher
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
            <div className="h-96 lg:h-96 overflow-y-scroll lg:overflow-x-hidden ">
              <div className="bg-white rounded-lg shadow-xs ">
                <table className="min-w-full leading-normal table-auto ">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Sr.No
                      </th>
                      <th className=" -px-2  text-center py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Class
                      </th>
                      <th className="px-2 text-center lg:px-5 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Teacher
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
                              {section?.get_class?.name}{" "}
                              {section?.get_division?.name}
                            </p>
                          </td>
                          <td className="text-center px-2 lg:px-5 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {section?.get_teacher?.name}
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
                                onClick={() => handleDelete(section.teacher_id)}
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
                    <h5 className="modal-title">
                      Create Class Teacher Allotment
                    </h5>

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
                    <div className="relative mb-3 flex justify-center mx-4">
                      <label htmlFor="sectionName" className="w-1/2 mt-2">
                        Class Name <span className="text-red-500">*</span>
                      </label>
                      <Select
                        className="w-full text-sm"
                        options={classes}
                        isClearable
                        value={classes.find(
                          (option) => option.value === newDepartmentId
                        )}
                        onChange={handleClassChange}
                      />
                      <div className="absolute top-8 left-1/3">
                        {fieldErrors.department_id && (
                          <span className="text-danger text-xs">
                            {fieldErrors.department_id}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* <div className="form-group"> */}
                    <div className="relative mb-3 flex justify-center mx-4 mt-2">
                      <label htmlFor="departmentId" className="w-1/2 mt-2">
                        Teacher <span className="text-red-500">*</span>
                      </label>
                      <Select
                        className="w-full text-sm"
                        options={teachers}
                        isClearable
                        onChange={handleTeacherChange}
                      />
                      <div className="absolute top-9 left-1/3">
                        {fieldErrors.teacher_id && (
                          <span className="text-danger text-xs">
                            {fieldErrors.teacher_id}
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
                      className="btn btn-primary px-3 mb-2 "
                      style={{}}
                      onClick={handleSubmitAdd}
                    >
                      Add
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
                  <h5 className="modal-title">Edit Class Teacher Allotment</h5>
                  <RxCross1
                    className="float-end relative  mt-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
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
                <div className="modal-body">
                  <div className=" relative mb-3 flex justify-center  mx-4">
                    <label htmlFor="editSectionName" className="w-1/2 mt-2">
                      Class <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className=" w-full shadow-md border-1 border-gray-300 outline-none rounded-md pl-3 bg-gray-200"
                      value={className}
                      readOnly
                    />
                  </div>
                  <div className="relative mb-3 flex justify-center mx-4 mt-2">
                    <label htmlFor="departmentId" className="w-1/2 mt-2">
                      Teacher <span className="text-red-500">*</span>
                    </label>
                    {console.log("selectedTeachers", selectedTeacher)}
                    <Select
                      className="w-full text-sm"
                      options={teachers}
                      value={selectedTeacher} // Pre-fill with the selected teacher
                      isClearable
                      onChange={handleTeacherChange}
                    />

                    <div className="absolute top-9 left-1/3">
                      {fieldErrors.teacher_id && (
                        <span className="text-danger text-xs">
                          {fieldErrors.teacher_id}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className=" flex justify-end p-3">
                  {/* <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button> */}
                  <button
                    type="button"
                    // className="btn btn-primary"
                    className="btn btn-primary px-3 mb-2 "
                    style={{}}
                    onClick={handleSubmitEdit}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5>Edit Class Teacher Allotment</h5>
                  <RxCross1 onClick={handleCloseModal} />
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Division Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newSectionName}
                      onChange={(e) => setNewSectionName(e.target.value)}
                    />
                    {fieldErrors.name && (
                      <span className="text-danger">{fieldErrors.name}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Class</label>
                    <input
                      type="text"
                      className="form-control"
                      value={className}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label>Select Teacher</label>
                    <Select
                      options={teachers}
                      onChange={(selectedOption) =>
                        console.log("Edit teacher logic here")
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    onClick={handleSubmitEdit}
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )} */}

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
                    Are you sure you want to delete Class Teacher:{" "}
                    {currentSection?.get_teacher?.name}?
                  </p>
                </div>
                <div className=" flex justify-end p-3">
                  {/* <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button> */}
                  <button
                    type="button"
                    className="btn btn-danger px-3 mb-2"
                    style={{}}
                    onClick={handleSubmitDelete}
                  >
                    Delete
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

export default AllotClassTeacher;
