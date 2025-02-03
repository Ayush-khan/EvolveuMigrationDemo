import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import { RxCross1 } from "react-icons/rx";
import AllotSubjectTab from "./AllotMarksHeadingTab";
import Select from "react-select";
function AllotMarksHeading() {
  const API_URL = import.meta.env.VITE_API_URL; // URL for host
  const [activeTab, setActiveTab] = useState("Manage");
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  // for allot subject tab
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [currestSubjectNameForDelete, setCurrestSubjectNameForDelete] =
    useState("");

  // This is hold the allot subjet api response
  const [classIdForManage, setclassIdForManage] = useState("");
  //   For the dropdown of Teachers name api
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  //   for allot subject checkboxes
  const [error, setError] = useState(null);
  const [nameError, setNameError] = useState(null);
  // for react-search of manage tab teacher Edit and select class
  const [selectedClass, setSelectedClass] = useState(null);
  // for Edit model
  const [newClassName, setNewClassName] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newExamName, setNewExamName] = useState("");
  const [newMarksHeading, setNewMarksHeading] = useState("");
  const [highestMarks, setHighestMarks] = useState("");
  const [marksError, setMarksError] = useState(""); // Error for validation
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageSize = 10;
  useEffect(() => {
    fetchClassNames();
    fetchDepartments();
  }, []);
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

  // Listing tabs data for diffrente tabs
  const handleSearch = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    if (!classIdForManage) {
      setNameError("Please select the class.");
      setIsSubmitting(false);

      return;
    }
    setSearchTerm("");
    try {
      console.log(
        "for this sectiong id in seaching inside AllotMarksHeadingTab",
        classIdForManage
      );
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        // `${API_URL}/api/get_AllotMarkheadingslist`,

        `${API_URL}/api/get_AllotMarkheadingslist/${classIdForManage}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          // params: { section_id: classSection },
          //   params: { class_id: classIdForManage },
        }
      );
      console.log(
        "the response of the AllotMarksHeadingTab is *******",
        response.data
      );
      if (response?.data.length > 0) {
        setSubjects(response.data);
        setPageCount(Math.ceil(response?.data.length / 10)); // Example pagination logic
      } else {
        setSubjects([]);
        toast.error("No Allot Markheadings are found for the selected class.");
      }
    } catch (error) {
      console.error("Error fetching Allot Markheadings:", error);
      setError("Error fetching Allot Markheadings");
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
    }
  };

  // Handle division checkbox change

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    // Handle page change logic
  };

  const handleEdit = (section) => {
    setCurrentSection(section);
    console.log("currentedit", section);

    // Set values for the edit modal
    setNewClassName(section?.get_class?.name);
    setNewSubjectName(section?.get_subject?.name);
    setNewExamName(section?.get_exam?.name); // Assuming exam details are available
    setNewMarksHeading(section?.get_marksheading?.name || ""); // Set marks heading if available

    setHighestMarks(section?.highest_marks || ""); // Set highest marks or empty
    setMarksError(""); // Reset the error message when opening the modal

    setShowEditModal(true);
  };
  // Handle the highest marks change with validation
  const handleMarksChange = (e) => {
    const value = e.target.value;

    // Check if the input is empty
    if (value === "") {
      setMarksError("Highest Marks is required."); // Set error for empty field
      setHighestMarks(""); // Clear the value in the state
    }
    // Allow only numbers
    else if (/^\d*$/.test(value)) {
      setHighestMarks(value);
      setMarksError(""); // Clear error if input is valid
    }
    // Handle invalid input (non-numeric)
  };

  const handleDelete = (sectionId) => {
    const classToDelete = subjects.find(
      (cls) => cls.allot_markheadings_id === sectionId
    );
    console.log("classsToDelete", classToDelete);
    // Set the current section and subject name for deletion
    if (classToDelete) {
      setCurrentSection(classToDelete); // Set the current section directly
      setCurrestSubjectNameForDelete(classToDelete.get_marksheading?.name); // Set subject name for display
      setShowDeleteModal(true); // Show the delete modal
    } else {
      console.error("Section not found for deletion");
    }
  };

  const handleSubmitEdit = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token || !currentSection || !currentSection.allot_markheadings_id) {
        throw new Error("Allot Markheadings ID is missing");
      }

      // Ensure that the subject type is not empty
      // Clear previous errors
      setMarksError("");
      console.log(
        "class_name:",
        newClassName,
        "subject_name:",
        newSubjectName,
        "exam_name:",
        newExamName,
        "marks_heading:",
        newMarksHeading,
        "highest_marks:",
        highestMarks
      );
      // Validate Highest Marks
      // if (highestMarks.trim() === "") {
      //   setMarksError("Highest Marks is required.");
      //   return;
      // }
      if (!highestMarks) {
        setMarksError("Highest Marks is required.");
        setIsSubmitting(false);

        return;
      }
      // If there's still an error message, stop the submission
      if (marksError) {
        setIsSubmitting(false);

        return; // Halt submission if error exists
      }
      // Make the PUT request to update the subject type
      await axios.put(
        `${API_URL}/api/update_AllotMarkheadings/${currentSection.allot_markheadings_id}`,
        {
          class_name: newClassName,
          subject_name: newSubjectName,
          exam_name: newExamName,
          marks_heading: newMarksHeading,
          highest_marks: highestMarks,
        }, // Send the selected subject type
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      handleSearch(); // Refresh the list or data

      toast.success("Allot Markheadings record updated successfully!");
      handleCloseModal(); // Close the modal
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(
          `Error updating Allot Markheadings record: ${error.response.data.error}`
        );
      } else {
        toast.error(
          `Error updating Allot Markheadings record: ${error.message}`
        );
      }
      console.error("Error editing Allot Markheadings record:", error);
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
    }
  };

  const handleSubmitDelete = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      const subReportCardId = currentSection?.allot_markheadings_id; // Get the correct ID

      if (!token || !subReportCardId) {
        throw new Error("Allot Markheadings  ID is missing");
      }

      // Send the delete request to the backend
      await axios.delete(
        `${API_URL}/api/delete_AllotMarkheadings/${subReportCardId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      handleSearch(); // Refresh the data (this seems like the method to refetch data)
      setShowDeleteModal(false); // Close the modal
      toast.success("Allot Markheadings deleted successfully!");
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(
          `Error deleting Allot Markheadings: ${error.response.data.message}`
        );
      } else {
        toast.error(`Error deleting Allot Markheadings: ${error.message}`);
      }
      console.error("Error deleting Allot Markheadings:", error);
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
      setShowDeleteModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
  };

  const filteredSections = subjects.filter((section) => {
    // Extract relevant fields from each section
    const className = section?.get_class?.name?.toLowerCase() || ""; // Class name
    const subjectName = section?.get_subject?.name?.toLowerCase() || ""; // Subject name
    const examName = section?.get_exam?.name?.toLowerCase() || ""; // Exam name
    const marksHeading = section?.get_marksheading?.name?.toLowerCase() || ""; // Marks Heading
    const highestMarks = section?.highest_marks?.toString() || ""; // Highest Marks (convert to string for search)

    // Check if the search term matches any of the fields
    return (
      className.includes(searchTerm.toLowerCase()) ||
      subjectName.includes(searchTerm.toLowerCase()) ||
      examName.includes(searchTerm.toLowerCase()) ||
      marksHeading.includes(searchTerm.toLowerCase()) ||
      highestMarks.includes(searchTerm)
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
          Allot Marks Headings
        </h3>
        <div
          className=" relative  mb-8   h-1  mx-auto bg-red-700"
          style={{
            backgroundColor: "#C03078",
          }}
        ></div>
        <ul className="grid grid-cols-2 gap-x-10 relative -left-6 md:left-0 md:flex md:flex-row relative -top-4">
          {/* Tab Navigation */}
          {["Manage", "AllotMarksHeadings"].map((tab) => (
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
                      disabled={isSubmitting}
                      className="btn h-10  w-18 md:w-auto relative  right-0 md:right-[15%] btn-primary"
                    >
                      {isSubmitting ? "Searching..." : "Search"}
                    </button>
                  </div>
                </div>
              </div>
              {subjects.length > 0 && (
                <div className="container mt-4">
                  <div className="card mx-auto lg:w-full shadow-lg">
                    <div className="p-2 px-3 bg-gray-100 border-none flex justify-between items-center">
                      <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
                        Manage Marks Heading Allotment
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
                              <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                Sr.No
                              </th>
                              <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                Class
                              </th>

                              <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                Subject
                              </th>
                              <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                Exam
                              </th>
                              <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                Marks Heading
                              </th>
                              <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                Highest Marks
                              </th>
                              <th className="px-2 w-full md:w-[8%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                Edit
                              </th>
                              <th className="px-2 w-full md:w-[8%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                Delete
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {displayedSections.length ? (
                              displayedSections.map((subject, index) => (
                                <tr
                                  key={subject.allot_markheadings_id}
                                  className="text-sm "
                                >
                                  <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                    {currentPage * pageSize + index + 1}
                                  </td>
                                  <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                    {subject?.get_class?.name}
                                  </td>

                                  <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                    {subject?.get_subject?.name}
                                  </td>
                                  <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                    {subject?.get_exam?.name}
                                  </td>
                                  <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                    {subject?.get_marksheading?.name}
                                  </td>
                                  <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                    {subject?.highest_marks}
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
                                        handleDelete(
                                          subject?.allot_markheadings_id
                                        )
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
          {activeTab === "AllotMarksHeadings" && (
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
                  style={{ backgroundColor: "#C03078" }}
                ></div>
                <div className="modal-body">
                  <div className="relative mb-3 flex justify-center mx-4 gap-x-7">
                    <label htmlFor="newClassName" className="w-1/2 mt-2">
                      Class:
                    </label>
                    <div className="w-full bg-gray-200 p-2 rounded-md shadow-md ">
                      {newClassName}
                    </div>
                  </div>

                  <div className="relative flex justify-start mx-4 gap-x-7 mb-2">
                    <label htmlFor="newSubjectName" className="w-1/2 mt-2">
                      Subject:
                    </label>
                    <div className="w-full bg-gray-200 p-2 rounded-md shadow-md mb-2">
                      {newSubjectName}
                    </div>
                  </div>

                  <div className="relative flex justify-start mx-4 gap-x-7 mb-2">
                    <label htmlFor="newExamName" className="w-1/2 mt-2">
                      Exam:
                    </label>
                    <div className="w-full bg-gray-200 p-2 rounded-md shadow-md mb-2">
                      {newExamName}
                    </div>
                  </div>

                  <div className="relative flex justify-start mx-4 gap-x-7 mb-2">
                    <label htmlFor="newMarksHeading" className="w-1/2 mt-2">
                      Marks Heading Assigned:
                    </label>
                    <div className="w-full bg-gray-200 p-2 rounded-md shadow-md mb-2">
                      {newMarksHeading}
                    </div>
                  </div>

                  {/* Highest Marks Input */}
                  <div className="relative flex justify-start mx-4 gap-x-7">
                    <label htmlFor="highestMarks" className="w-1/2 mt-2">
                      Highest Marks <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={3}
                      className="rounded-md border-1 text-black w-full text-[1em] shadow-md p-2"
                      value={highestMarks}
                      onChange={handleMarksChange}
                      placeholder="Enter highest marks"
                    />
                  </div>
                  <div className="w-[60%] relative h-4 left-[40%]">
                    {marksError && (
                      <span className="text-red-500 text-xs">{marksError}</span>
                    )}
                  </div>
                  {/* Display error message if any */}
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
                  Are you sure you want to delete this alloted Marks heading{" "}
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

export default AllotMarksHeading;
