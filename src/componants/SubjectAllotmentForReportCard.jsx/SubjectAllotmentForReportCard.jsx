import { useState, useEffect, useRef } from "react";
// import { IoSettingsSharp } from "react-icons/io5";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import { RxCross1 } from "react-icons/rx";
import AllotSubjectTab from "./AllotSubjectTab.jsx";
import Select from "react-select";
function SubjectAllotmentForReportCard() {
  const API_URL = import.meta.env.VITE_API_URL; // URL for host
  const [activeTab, setActiveTab] = useState("Manage");
  const [classes, setClasses] = useState([]);
  const [classesforsubjectallot, setclassesforsubjectallot] = useState([]);
  const [subjects, setSubjects] = useState([]);
  // for allot subject tab

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [currestSubjectNameForDelete, setCurrestSubjectNameForDelete] =
    useState("");
  const [newSubject, setnewSubjectnName] = useState("");
  const [newclassnames, setnewclassnames] = useState("");
  const [teacherNameIs, setTeacherNameIs] = useState("");

  // This is hold the allot subjet api response
  const [classIdForManage, setclassIdForManage] = useState("");
  //   This is for the subject id in the dropdown
  const [newDepartmentId, setNewDepartmentId] = useState("");
  //   For the dropdown of Teachers name api
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingForSearch, setIsSubmittingForSearch] = useState(false);

  const dropdownRef = useRef(null);
  //   for allot subject checkboxes

  const [error, setError] = useState(null);
  const [nameError, setNameError] = useState(null);

  // for react-search of manage tab teacher Edit and select class
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const handleTeacherSelect = (selectedOption) => {
    setSelectedTeacher(selectedOption);
    console.log("selectedTeacher", selectedTeacher);
    setNewDepartmentId(selectedOption.value); // Assuming value is the teacher's ID
    console.log("setNewDepartmentId", newDepartmentId);
  };

  const handleClassSelect = (selectedOption) => {
    setNameError("");
    setSelectedClass(selectedOption);
    setclassIdForManage(selectedOption ? selectedOption.value : null); // Set to null if cleared
  };

  const teacherOptions = departments.map((dept) => ({
    value: dept.reg_id,
    label: dept.name,
  }));
  console.log("teacherOptions", teacherOptions);
  const classOptions = classes.map((cls) => ({
    value: cls.class_id,
    label: `${cls?.name}  `,
  }));

  //   Sorting logic state

  const pageSize = 10;

  const fetchClassNames = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/getClassList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(response.data)) {
        setClasses(response.data);
        console.log("the name and section", response.data);
      } else {
        setError("Unexpected data format");
      }
    } catch (error) {
      console.error("Error fetching class and section names:", error);
      setError("Error fetching class and section names");
    }
  };
  const fetchClassNamesForAllotSubject = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/getClassList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(response.data)) {
        setclassesforsubjectallot(response.data);
        console.log(
          "this is the dropdown of the allot subject tab for class",
          response.data
        );
      } else {
        setError("Unexpected data format");
      }
    } catch (error) {
      console.error("Error fetching class names:", error);
      setError("Error fetching class names");
    }
  };

  //   This is the api for get teacher list in the manage tab edit
  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${API_URL}/api/get_teacher_list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setDepartments(response.data);
      console.log(
        "888888888888888888888888 this is the edit of get_teacher list in the subject allotement tab",
        response.data
      );
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchClassNames();
    fetchDepartments();
    // fetchClassNamesForAllotSubject();
  }, []);
  // Listing tabs data for diffrente tabs
  const handleSearch = async () => {
    if (isSubmittingForSearch) return; // Prevent re-submitting
    setIsSubmittingForSearch(true);
    if (!classIdForManage) {
      setIsSubmittingForSearch(false);
      setNameError("Please select the class.");

      return;
    }
    setSearchTerm("");
    try {
      console.log(
        "for this sectiong id in seaching inside subjectallotment",
        classIdForManage
      );
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/get_subject_Alloted_for_report_card/${classIdForManage}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          // params: { section_id: classSection },
          //   params: { class_id: classIdForManage },
        }
      );
      console.log(
        "the response of the subjectallotment is *******",
        response.data?.subjectAllotments
      );
      if (response?.data?.subjectAllotments.length > 0) {
        setSubjects(response.data?.subjectAllotments);
        setPageCount(Math.ceil(response?.data?.subjectAllotments.length / 10)); // Example pagination logic
      } else {
        setSubjects([]);
        toast.error("No subjects found for the selected class.");
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setError("Error fetching subjects");
    } finally {
      setIsSubmittingForSearch(false); // Re-enable the button after the operation
    }
  };

  // Handle division checkbox change

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    // Handle page change logic
  };

  const handleEdit = (section) => {
    setCurrentSection(section);
    console.log("curentedit", section);
    setnewclassnames(section?.get_clases?.name);
    setnewSubjectnName(section?.get_subjects_for_report_card?.name);
    setTeacherNameIs(section?.subject_type || ""); // Ensure subject_type is set

    setShowEditModal(true);
  };

  const handleDelete = (sectionId) => {
    const classToDelete = subjects.find(
      (cls) => cls.sub_reportcard_id === sectionId
    );

    // Set the current section and subject name for deletion
    if (classToDelete) {
      setCurrentSection(classToDelete); // Set the current section directly
      setCurrestSubjectNameForDelete(
        classToDelete.get_subjects_for_report_card?.name
      ); // Set subject name for display
      setShowDeleteModal(true); // Show the delete modal
    } else {
      console.error("Section not found for deletion");
    }
  };

  //   const handleDelete = (sectionId) => {
  //     // const sectionId = section.sub_reportcard_id;
  //     console.log("currest section", sectionId);
  //     console.log("inside delete of subjectallotmenbt____", sectionId);
  //     // console.log("inside delete of subjectallotmenbt", classes);
  //     const classToDelete = subjects.find(
  //       (cls) => cls.sub_reportcard_id === sectionId
  //     );
  //     // setCurrentClass(classToDelete);
  //     setCurrentSection({ classToDelete });
  //     console.log("the currecnet section", currentSection);
  //     setCurrestSubjectNameForDelete(
  //       currentSection?.classToDelete?.get_subjects_for_report_card?.name
  //     );
  //     console.log(
  //       "cureendtsungjeg",
  //       currentSection?.classToDelete?.get_subjects_for_report_card?.name
  //     );
  //     console.log("currestSubjectNameForDelete", currestSubjectNameForDelete);
  //     setShowDeleteModal(true);
  //   };

  const handleSubmitEdit = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");

      if (!token || !currentSection || !currentSection.sub_reportcard_id) {
        throw new Error("Subject ID is missing");
      }

      // Ensure that the subject type is not empty
      if (!teacherNameIs) {
        toast.error("Please select a subject type.");
        setIsSubmitting(false); // Reset submitting state if validation fails

        return;
      }

      // Make the PUT request to update the subject type
      await axios.put(
        `${API_URL}/api/get_sub_report_allotted/${currentSection.sub_reportcard_id}`,
        { subject_type: teacherNameIs }, // Send the selected subject type
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      handleSearch(); // Refresh the list or data
      handleCloseModal(); // Close the modal
      toast.success("Subject record updated successfully!");
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(
          `Error updating subject record: ${error.response.data.error}`
        );
      } else {
        toast.error(`Error updating subject record: ${error.message}`);
      }
      console.error("Error editing subject record:", error);
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
      setShowEditModal(false);
    }
  };

  const handleSubmitDelete = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      const subReportCardId = currentSection?.sub_reportcard_id; // Get the correct ID

      if (!token || !subReportCardId) {
        throw new Error("Subject Allotment ID is missing");
      }

      // Send the delete request to the backend
      const response = await axios.delete(
        `${API_URL}/api/get_sub_report_allotted/${subReportCardId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // Handle successful deletion
      console.log("responsedata", response.data);
      if (response.data && response.data.status == 400) {
        const errorMessage = response.data.message || "Delete failed.";
        console.log("inside the delete", response.data);
        toast.error(errorMessage);
      } else {
        toast.success("Subject deleted successfully!");
        handleSearch(); // Refresh the data (this seems like the method to refetch data)
      }

      setShowDeleteModal(false); // Close the modal

      setShowDeleteModal(false); // Close the modal
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error(`Error deleting subject: ${error.message}`);
      }
      console.error("Error deleting subject:", error);
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
      setShowDeleteModal(false);
    }
  };

  //   const handleSubmitDelete = async () => {
  //     // Handle delete submission logic
  //     try {
  //       const token = localStorage.getItem("authToken");
  //       console.log(
  //         "the currecnt section inside the delte___",
  //         currentSection?.classToDelete?.subject_id
  //       );
  //       console.log("the classes inside the delete", classes);
  //       console.log(
  //         "the current section insde the handlesbmitdelete",
  //         currentSection.classToDelete
  //       );
  //       if (
  //         !token ||
  //         !currentSection ||
  //         !currentSection?.classToDelete?.sub_reportcard_id
  //       ) {
  //         throw new Error("Subject ID is missing");
  //       }

  //       await axios.delete(
  //         `${API_URL}/api/get_sub_report_allotted/${currentSection?.classToDelete?.sub_reportcard_id}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //           withCredentials: true,
  //         }
  //       );

  //       // fetchClassNames();
  //       handleSearch();

  //       setShowDeleteModal(false);
  //       // setSubjects([]);
  //       toast.success("subject deleted successfully!");
  //     } catch (error) {
  //       if (error.response && error.response.data) {
  //         toast.error(`Error deleting subject: ${error.response.data.message}`);
  //       } else {
  //         toast.error(`Error deleting subject: ${error.message}`);
  //       }
  //       console.error("Error deleting subject:", error);
  //       // setError(error.message);
  //     }
  //     setShowDeleteModal(false);
  //   };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
  };

  const filteredSections = subjects.filter((section) => {
    // Convert values to lowercase for case-insensitive comparison
    const className = section?.get_clases?.name?.toLowerCase() || ""; // Class name
    const subjectName =
      section?.get_subjects_for_report_card?.name?.toLowerCase() || ""; // Subject name
    const subjectType = section?.subject_type?.toLowerCase() || ""; // Subject type

    // Check if the search term matches any of the fields
    return (
      className.includes(searchTerm.toLowerCase()) ||
      subjectName.includes(searchTerm.toLowerCase()) ||
      subjectType.includes(searchTerm.toLowerCase())
    );
  });

  const displayedSections = filteredSections.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab); // Update the active tab state

    // Call handleSearch only if the tab is "Manage"
    if (tab === "Manage") {
      handleSearch();
    }
  };

  return (
    <>
      {/* <ToastContainer /> */}
      <div className="md:mx-auto md:w-3/4 p-4 bg-white mt-4 ">
        <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
          Subject Allotment For Report Card
        </h3>
        <div
          className=" relative  mb-8   h-1  mx-auto bg-red-700"
          style={{
            backgroundColor: "#C03078",
          }}
        ></div>
        <ul className="grid grid-cols-2 gap-x-10 relative -left-6 md:left-0 md:flex md:flex-row relative -top-4">
          {/* Tab Navigation */}
          {["Manage", "AllotSubject"].map((tab) => (
            <li
              key={tab}
              className={`md:-ml-7 shadow-md ${
                activeTab === tab ? "text-blue-500 font-bold" : ""
              }`}
            >
              <button
                onClick={() => handleTabChange(tab)}
                className="px-2 md:px-4 py-1 hover:bg-gray-200 text-[1em] md:text-sm text-nowrap"
              >
                {tab.replace(/([A-Z])/g, " $1")}
              </button>
            </li>
          ))}
        </ul>

        <div className="bg-white  rounded-md -mt-5">
          {activeTab === "Manage" && (
            <div>
              <ToastContainer />
              <div className="mb-4">
                <div className="md:w-[80%] mx-auto">
                  <div className="form-group mt-4 w-full md:w-[80%] flex justify-start gap-x-1 md:gap-x-6">
                    <label
                      htmlFor="classSection"
                      className="w-1/4 pt-2 items-center text-center"
                    >
                      Select Class <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full">
                      <Select
                        value={selectedClass}
                        onChange={handleClassSelect}
                        options={classOptions}
                        placeholder="Select Class"
                        isSearchable
                        isClearable
                        className=" text-sm w-full md:w-[60%] item-center relative left-0 md:left-4"
                      />
                      {nameError && (
                        <div className=" relative top-0.5 left-3 ml-1 text-danger text-xs">
                          {nameError}
                        </div>
                      )}{" "}
                    </div>
                    <button
                      onClick={handleSearch}
                      type="button"
                      className="btn h-10  w-18 md:w-auto relative  right-0 md:right-[15%] btn-primary"
                      disabled={isSubmittingForSearch}
                    >
                      {isSubmittingForSearch ? "Searching..." : "Search"}
                    </button>
                  </div>
                </div>
              </div>
              {subjects.length > 0 && (
                <div className="container mt-4">
                  <div className="card mx-auto lg:w-full shadow-lg">
                    <div className="p-2 px-3 bg-gray-100 border-none flex justify-between items-center">
                      <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
                        Manage Subjects Allotment List
                      </h3>
                      <div className="w-1/2 md:w-fit mr-1 ">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search "
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div
                      className=" relative w-[97%]   mb-3 h-1  mx-auto bg-red-700"
                      style={{
                        backgroundColor: "#C03078",
                      }}
                    ></div>

                    <div className="card-body w-full">
                      <div className="h-96 lg:h-96 overflow-y-scroll lg:overflow-x-hidden">
                        <table className="min-w-full leading-normal table-auto">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="px-2 w-full md:w-[10%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                Sr.No
                              </th>
                              <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                Class
                              </th>
                              {/* <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                Division
                              </th> */}
                              <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                Subject
                              </th>
                              <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                Subject Type
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
                            {displayedSections.length ? (
                              displayedSections.map((subject, index) => (
                                <tr
                                  key={subject.sub_rc_master_id}
                                  className=" text-sm "
                                >
                                  <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                    {currentPage * pageSize + index + 1}
                                  </td>
                                  <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                    {subject?.get_clases?.name}
                                  </td>
                                  {/* <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  {subject?.get_division?.name}
                                </td> */}
                                  <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                    {
                                      subject?.get_subjects_for_report_card
                                        ?.name
                                    }
                                  </td>
                                  <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                    {subject?.subject_type}
                                  </td>
                                  <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                    <button
                                      onClick={() => handleEdit(subject)}
                                      className="text-blue-600 hover:text-blue-800 hover:bg-transparent "
                                    >
                                      <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                  </td>
                                  <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                    <button
                                      onClick={() =>
                                        handleDelete(subject?.sub_reportcard_id)
                                      }
                                      className="text-red-600 hover:text-red-800 hover:bg-transparent "
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
                      <div className=" flex justify-center pt-2 -mb-3">
                        <ReactPaginate
                          previousLabel={"Previous"}
                          nextLabel={"Next"}
                          breakLabel={"..."}
                          pageCount={pageCount}
                          onPageChange={handlePageClick}
                          marginPagesDisplayed={1}
                          pageRangeDisplayed={1}
                          containerClassName={"pagination"}
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
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === "AllotSubject" && (
            <div>
              <AllotSubjectTab />
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
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
                  style={{
                    backgroundColor: "#C03078",
                  }}
                ></div>
                <div className="modal-body">
                  {/* Modal content for editing */}
                  <div className="relative flex justify-center mx-4 gap-x-7">
                    <label htmlFor="newClassName" className="w-1/2 mt-2">
                      Class:
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      readOnly
                      className="bg-gray-200 w-full p-2 rounded-md outline-none shadow-md mb-3"
                      id="class"
                      value={newclassnames}
                    />{" "}
                  </div>

                  <div className="relative flex justify-start mx-4 gap-x-7">
                    <label htmlFor="newSubjectName" className="w-1/2 mt-2">
                      Subject:
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      readOnly
                      className="bg-gray-200 w-full p-2 rounded-md outline-none shadow-md "
                      // style={{ background: "#F8F8F8" }}
                      id="class"
                      value={newSubject}
                      // onChange={handleChangeSectionName}
                      // onChange={}
                      // onBlur={handleBlur}
                    />{" "}
                  </div>

                  <div className="modal-body">
                    <div
                      ref={dropdownRef}
                      className="relative mb-3 flex justify-center mx-2 gap-4"
                    >
                      <label
                        htmlFor="subjectType"
                        className="w-1/2 mt-2 text-nowrap"
                      >
                        Subject Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        className=" rounded-md border-1  text-black w-full text-[1em] shadow-md p-2 "
                        value={teacherNameIs} // Prefilled value from state
                        onChange={(e) => setTeacherNameIs(e.target.value)} // Update state on change
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        <option value="Scholastic">Scholastic</option>
                        <option value="Co-Scholastic">Co-Scholastic</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end p-3">
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
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <RxCross1
                    className="float-end relative mt-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                    type="button"
                    // className="btn-close text-red-600"
                    onClick={handleCloseModal}
                  />
                  {console.log(
                    "the currecnt section inside delete of the managesubjhect",
                    currentSection
                  )}
                </div>
                <div
                  className=" relative  mb-3 h-1 w-[97%] mx-auto bg-red-700"
                  style={{
                    backgroundColor: "#C03078",
                  }}
                ></div>
                <div className="modal-body">
                  Are you sure you want to delete this subject{" "}
                  {` ${currestSubjectNameForDelete} `} ?
                </div>
                <div className=" flex justify-end p-3">
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

export default SubjectAllotmentForReportCard;
