import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PiCertificateBold } from "react-icons/pi";
import { LuFileBadge2 } from "react-icons/lu";
import { FaUndoAlt } from "react-icons/fa";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import { RxCross1 } from "react-icons/rx";
// import AllotSubjectTab from "./AllotMarksHeadingTab";
import Select from "react-select";
import { MdDescription, MdOutlineRemoveRedEye } from "react-icons/md";
// import CreateSimpleBonafied from "./CreateSimpleBonafied";
function DeleteStudent() {
  const API_URL = import.meta.env.VITE_API_URL; // URL for host
  const [activeTab, setActiveTab] = useState("Manage");
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  // for allot subject tab
  const [showDownloadModal, setShowDownloadModal] = useState(false);

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
  const [leavingCertificate, setLeavingCertificate] = useState({
    last_date: "",
    slc_no: "",
    slc_issue_date: "",
    leaving_remark: "",
  });
  const navigate = useNavigate();
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

    // setclassIdForManage(selectedOption.value); // Assuming value is the class ID
  };

  const classOptions = classes.map((cls) => ({
    value: `${cls?.section_id}`,
    label: `${cls?.get_class?.name} ${cls.name}`,
  }));
  const teacherOptions = departments.map((dept) => ({
    value: dept.reg_id,
    label: dept.name,
  }));
  console.log("teacherOptions", teacherOptions);
  const fetchClassNames = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/get_class_section`, {
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
    // Clear any existing error messages
    setNameError("");
    setSearchTerm("");
    try {
      const token = localStorage.getItem("authToken");
      const params = classIdForManage ? { section_id: classIdForManage } : {};

      // Perform the API call
      const response = await axios.get(
        `${API_URL}/api/get_deletedstudentlist`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      // Check if response data is valid
      if (response?.data?.status === 200 && response?.data?.data.length > 0) {
        const studentData = response.data.data;
        setSubjects(studentData);
        setPageCount(Math.ceil(studentData.length / 10)); // Adjust per your pagination requirements
        console.log("Subjects data:", studentData); // Debugging output
      } else {
        setSubjects([]);
        toast.error("No Deleted Students List found for the selected Class.");
      }
    } catch (error) {
      console.error("Error fetching Deleted Students List:", error);
      setError("Error fetching data. Please try again later.");
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
    }
  };

  // Handle division checkbox change

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    // Handle page change logic
  };

  const handleView = (subjectIsPassForView) => {
    console.log("HandleView-->", subjectIsPassForView);
    setCurrentSection(subjectIsPassForView);
    navigate(
      `/deletedStudent/view/${subjectIsPassForView?.student_id}`,

      {
        state: { student: subjectIsPassForView },
      }
    );
  };
  const handleDelete = (sectionId) => {
    const classToDelete = subjects.find((cls) => cls.student_id === sectionId);
    console.log("classsToDelete", classToDelete);
    // Set the current section and subject name for deletion
    if (classToDelete) {
      setCurrentSection(classToDelete); // Set the current section directly
      setCurrestSubjectNameForDelete(classToDelete?.student_name); // Set subject name for display
      setShowDeleteModal(true); // Show the delete modal
    } else {
      console.error("Deleted student not found");
    }
  };

  const handleAddStudent = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      const subReportCardId = currentSection?.student_id; // Get the correct ID

      if (!token || !subReportCardId) {
        throw new Error("Token or Student ID is missing");
      }

      // API call to update_adddeletedstudent
      await axios.put(
        `${API_URL}/api/update_adddeletedstudent/${subReportCardId}`,
        {}, // No body needed for this request
        {
          headers: { Authorization: `Bearer ${token}` },

          withCredentials: true,
        }
      );

      // Success actions
      handleSearch(); // Refresh the data
      setShowDeleteModal(false); // Close the modal
      toast.success("Student added successfully!");
    } catch (error) {
      // Error handling
      if (error.response && error.response.data) {
        toast.error(`Error adding student: ${error.response.data.message}`);
      } else {
        toast.error(`Error in adding student: ${error.message}`);
      }
      console.error("Error in adding student:", error);
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
    }
  };

  const handleEditForm = (section) => {
    setCurrentSection(section);
    navigate(
      `/deletedStudent/edit/${section?.student_id}`,

      {
        state: { student: section },
      }
    );
    // console.log("the currecne t section", currentSection);
  };

  const handleLCDetails = async (section) => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    setCurrentSection(section);
    console.log("currentedit", section);

    // Fetch Leaving Certificate Data using token
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/get_leavingcertificatedetailstudent/${section.student_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Assuming the response data structure remains the same
      const data = response.data.data[0] || {}; // Extract the first item from the data array

      // Set the leaving certificate details into state
      setLeavingCertificate({
        last_date: data.last_date || "",
        slc_no: data.slc_no || "",
        slc_issue_date: data.slc_issue_date || "",
        leaving_remark: data.leaving_remark || "",
      });
    } catch (error) {
      console.error("Error fetching leaving certificate details:", error);
      setError("Error fetching leaving certificate details");
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation

      // Show the edit modal
      setShowEditModal(true);
    }
  };
  const handleCloseModal = () => {
    setShowDownloadModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
  };

  const filteredSections = subjects.filter((section) => {
    // Convert the fields to lowercase for case-insensitive comparison
    const subjectNameIs = section?.student_name?.toLowerCase() || "";
    const slcNoIs = section?.roll_no?.toString() || ""; // Convert roll_no to a string
    const searchTermLower = searchTerm.toLowerCase();

    // Check if the search term is present in student_name or slc_no
    return (
      subjectNameIs.includes(searchTermLower) ||
      slcNoIs.includes(searchTermLower)
    );
  });

  const displayedSections = filteredSections.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  return (
    <>
      {/* <ToastContainer /> */}
      <div className="md:mx-auto md:w-[80%] p-4 bg-white mt-4 ">
        <h3 className=" mt-1 text-[1.2em] lg:text-xl text-nowrap">
          Deleted Students
        </h3>
        <div
          className=" relative  mb-8   h-1  mx-auto bg-red-700"
          style={{
            backgroundColor: "#C03078",
          }}
        ></div>

        <div className="bg-white  rounded-md -mt-5">
          <div className="mt-4 border-1 border-gray-50 ">
            <ToastContainer />
            <div className="mb-4  ">
              <div className="md:w-[90%] mx-auto">
                <div className="form-group  relative  left-0 md:left-[10%] mt-3 md:mt-5 w-full  md:w-[60%] flex justify-start gap-x-1 md:gap-x-6">
                  <label
                    htmlFor="classSection"
                    className="w-1/3 pt-2 items-center text-center"
                  >
                    Select Class
                  </label>
                  <div className="w-full">
                    <Select
                      value={selectedClass}
                      onChange={handleClassSelect}
                      options={classOptions}
                      placeholder="Class"
                      isSearchable
                      isClearable
                      className=" text-sm w-full md:w-[60%] item-center relative left-0 md:left-4"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    type="button"
                    className="btn h-10  w-18 md:w-auto relative  right-0 md:right-[15%] btn-primary"
                    disabled={isSubmitting}
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
                    <h3 className=" mt-1 text-[1.2em] lg:text-xl text-nowrap">
                      Manage Deleted Student
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
                            </th>{" "}
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Roll No
                            </th>
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Photo
                            </th>
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Name
                            </th>
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Class
                            </th>
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Generate LC / LC No.
                            </th>
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              LC Details
                            </th>
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              RC & Certificates
                            </th>
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              View
                            </th>
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Add Student
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayedSections.length ? (
                            displayedSections.map((subject, index) => {
                              // Determine the status text and button visibility based on conditions

                              // let showDeleteButton = subject.IsDelete === "N"; // Show delete button if IsDelete is "N"

                              return (
                                <tr
                                  key={subject.sr_no}
                                  className=" text-sm font-light"
                                >
                                  <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                    {currentPage * pageSize + index + 1}
                                  </td>
                                  <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                    {subject.roll_no}
                                  </td>
                                  <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm py-1">
                                    {console.log(
                                      "the teacher image",
                                      `${subject?.image_name}`
                                    )}

                                    <img
                                      src={
                                        subject?.image_name
                                          ? `${subject?.image_name}`
                                          : "https://via.placeholder.com/50"
                                      }
                                      alt={subject?.name}
                                      className="rounded-full w-8 h-8 lg:w-10 lg:h-10 object-cover"
                                    />
                                  </td>
                                  <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                    {`${subject?.first_name || ""} ${
                                      subject?.mid_name || ""
                                    } ${subject?.last_name || ""}`
                                      .trim()
                                      .replace(/\s+/g, " ")}
                                  </td>
                                  <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                    {`${subject?.classname} ${subject?.sectionname}`}
                                  </td>
                                  <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                    <button
                                      onClick={() => handleEditForm(subject)}
                                      className="text-blue-700 hover:text-blue-900 hover:bg-transparent "
                                    >
                                      <LuFileBadge2 className="font-bold text-xl" />
                                    </button>
                                  </td>{" "}
                                  <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                    <button
                                      onClick={() => handleLCDetails(subject)}
                                      className="text-blue-600 hover:text-blue-800 hover:bg-transparent "
                                    >
                                      <MdDescription className="font-bold text-xl" />
                                    </button>
                                  </td>
                                  <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                    <button
                                      // onClick={() => handleView(subject)}
                                      className="text-green-600 hover:text-green-800 hover:bg-transparent "
                                    >
                                      <PiCertificateBold className="font-bold text-xl" />
                                    </button>
                                  </td>
                                  <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                    <button
                                      onClick={() => handleView(subject)}
                                      className="text-blue-600 hover:text-blue-800 hover:bg-transparent "
                                    >
                                      <MdOutlineRemoveRedEye className="font-bold text-xl" />
                                    </button>
                                  </td>
                                  {/* Delete button */}
                                  <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                    <button
                                      onClick={() =>
                                        handleDelete(subject?.student_id)
                                      }
                                      className="text-pink-500 hover:text-pink-700 hover:bg-transparent"
                                    >
                                      <FaUndoAlt icon={faTrash} />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
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
        </div>
      </div>

      {/* Edit Modal */}
      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[90%] md:w-[44%] max-w-3xl bg-white rounded-md shadow-lg border border-gray-300">
            <div className="flex justify-between items-center px-3 bg-gray-50 border-b border-gray-300">
              <h5 className="text-lg font-semibold pt-2">
                School Leaving Details
              </h5>
              <RxCross1
                className="text-lg h-5 w-5 text-red-600 hover:cursor-pointer hover:bg-red-100  rounded-full"
                onClick={handleCloseModal}
              />
            </div>
            <div
              className="relative h-1 w-[97%] mx-auto bg-red-700"
              style={{ backgroundColor: "#C03078" }}
            ></div>
            <div className="p-5">
              <div className="flex items-center gap-x-5 mb-4">
                <label htmlFor="newClassName" className="w-[90%]">
                  Last Date Of School
                </label>
                <div className="w-full bg-gray-200 p-2 h-8 rounded-md shadow-sm">
                  {leavingCertificate.last_date}
                </div>
              </div>

              <div className="flex items-center gap-x-5 mb-4">
                <label htmlFor="newSubjectName" className="w-[90%]">
                  School Leaving Certificate No.
                </label>
                <div className="w-full bg-gray-200 p-2 h-8 rounded-md shadow-sm">
                  {leavingCertificate.slc_no}
                </div>
              </div>

              <div className="flex items-center gap-x-5 mb-4">
                <label htmlFor="newExamName" className="w-[90%]">
                  School Leaving Certificate Issue Date
                </label>
                <div className="w-full bg-gray-200 p-2  h-8 rounded-md shadow-sm">
                  {leavingCertificate.slc_issue_date}
                </div>
              </div>

              <div className="flex items-center gap-x-5">
                <label htmlFor="newMarksHeading" className="w-[90%]">
                  Leaving Remark
                </label>
                <div className="w-full bg-gray-200 p-2 h-8 rounded-md shadow-sm">
                  {leavingCertificate.leaving_remark}
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
                  <h5 className="modal-title">Confirm Add Student</h5>
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
                  Are you sure you want to add this Student:{" "}
                  {` ${currestSubjectNameForDelete} `} ?
                </div>
                <div className=" flex justify-end p-3">
                  <button
                    type="button"
                    className="btn btn-primary px-3 mb-2"
                    onClick={handleAddStudent}
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
    </>
  );
}

export default DeleteStudent;
