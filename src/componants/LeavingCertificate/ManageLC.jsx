import { useState, useEffect, useRef } from "react";
import { ImCheckboxChecked, ImDownload } from "react-icons/im";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import { RxCross1 } from "react-icons/rx";
// import AllotSubjectTab from "./AllotMarksHeadingTab";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import LeavingCertificate from "./LeavingCertificate";
function ManageLC() {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const [srNo, setSrNo] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");
  const navigate = useNavigate();
  const pageSize = 10;
  useEffect(() => {
    fetchClassNames();
    fetchDepartments();
  }, []);
  const handleClassSelect = (selectedOption) => {
    setNameError("");
    setSelectedClass(selectedOption);
    setclassIdForManage(selectedOption.value); // Assuming value is the class ID
  };

  const teacherOptions = departments.map((dept) => ({
    value: dept.reg_id,
    label: dept.name,
  }));
  console.log("teacherOptions", teacherOptions);
  const classOptions = classes.map((cls) => ({
    // value: `${cls?.get_class?.name}-${cls.name}`,
    value: `${cls.class_id}`,
    label: `${cls?.name}`,
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

  const handleSearch = async () => {
    const token = localStorage.getItem("authToken");
    // const currentAcademicYear = localStorage.getItem("ac");

    // const currentAcademicYear = "2023-2024"; // example, replace with dynamic value if available
    // const params = {};
    let params = null; // Initialize params as null
    // Conditional logic for API query parameters
    if (srNo && selectedClass) {
      params = { sr_no: srNo, class_id: classIdForManage };
    } else if (srNo) {
      params = { sr_no: srNo };
    } else if (selectedClass) {
      params = { class_id: classIdForManage };
    }

    // API call
    setSearchTerm("");
    try {
      const response = await axios.get(
        `${API_URL}/api/get_leavingcertificatelist`,
        {
          headers: { Authorization: `Bearer ${token}` },
          ...(params ? { params } : {}), // Only include params if they are defined
        }
      );

      if (response?.data?.data?.length > 0) {
        setSubjects(response.data.data);
        setPageCount(Math.ceil(response.data.data.length / 10));
      } else {
        setSubjects([]);
        toast.error("No Leaving Certificate records found.");
      }
    } catch (error) {
      toast.error("Error in fetching certificates Listing");
      console.error("Error fetching Leaving Certificate records:", error);
      setError("Error fetching Leaving Certificate records");
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    // Handle page change logic
  };

  const handleEdit = (section) => {
    setCurrentSection(section);
    console.log("currentedit", section);
    setShowEditModal(true);
  };

  const handleEditForm = (section) => {
    setCurrentSection(section);
    navigate(
      `/studentLC/edit/${section?.sr_no}`,

      {
        state: { student: section },
      }
    );
    // console.log("the currecne t section", currentSection);
  };

  const handleDownload = (section) => {
    setCurrentSection(section);
    console.log("currentedit", section);

    setShowDownloadModal(true);
  };

  const handleDownloadSumbit = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    try {
      //  setLoading(true); // Show loading indicator if you have one
      const token = localStorage.getItem("authToken");
      console.log("the sr for download", currentSection.sr_no);
      if (!token || !currentSection || !currentSection.sr_no) {
        throw new Error("Token or Serial Number is missing");
      }

      const response = await axios.get(
        `${API_URL}/api/get_pdfleavingcertificate/${currentSection.sr_no}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob", // Important for downloading files
        }
      );

      if (response.status === 200) {
        toast.success("Leaving certificate downloaded successfully!");

        // Extract filename from Content-Disposition header if available
        const contentDisposition = response.headers["content-disposition"];
        let filename = "DownloadedCertificate.pdf"; // Default name if not specified

        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+?)"/);
          if (match && match[1]) {
            filename = match[1];
          }
        }

        // Create a blob URL for the PDF file
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Create a link to initiate the download
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(pdfUrl); // Clean up the object URL
        handleSearch(); // Optionally refresh your data
        handleCloseModal(); // Optionally close modal if applicable
      } else {
        throw new Error("Failed to download the file");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(
          `Error in Downloading Leaving Certificate: ${error.response.data.error}`
        );
      } else {
        toast.error(
          `Error in Downloading Leaving Certificate: ${error.message}`
        );
      }
      console.error("Error in Downloading Leaving Certificate:", error);
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
    }
    //    finally {
    //      setLoading(false); // Stop loading indicator
    //    }
  };

  const handleDelete = (sectionId) => {
    const classToDelete = subjects.find((cls) => cls.sr_no === sectionId);
    console.log("classsToDelete", classToDelete);
    // Set the current section and subject name for deletion
    if (classToDelete) {
      setCurrentSection(classToDelete); // Set the current section directly
      setCurrestSubjectNameForDelete(classToDelete?.stud_name); // Set subject name for display
      setShowDeleteModal(true); // Show the delete modal
    } else {
      console.error("Cast certificate not found for deletion");
    }
  };

  const handleSubmitEdit = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token || !currentSection || !currentSection.sr_no) {
        throw new Error("Token or Serial Number is missing");
      }

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

      await axios.put(
        `${API_URL}/api/update_leavingcertificateisIssued/${currentSection.sr_no}`,
        {}, // Pass empty object for no payload
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      handleSearch(); // Refresh the list or data
      toast.success("Leaving certificate issue status updated successfully!");
      handleCloseModal(); // Close the modal
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(
          `Error updating Leaving Certificate issue status: ${error.response.data.error}`
        );
      } else {
        toast.error(
          `Error updating Leaving Certificate issue status: ${error.message}`
        );
      }
      console.error("Error Leaving Certificate issue status:", error);
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
    }
  };

  const handleSubmitDelete = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      const subReportCardId = currentSection?.sr_no; // Get the correct ID

      if (!token || !subReportCardId) {
        throw new Error("Token or Serial Number is missing");
      }

      // Send the delete request to the backend
      await axios.delete(
        `${API_URL}/api/delete_leavingcertificateisDeleted/${subReportCardId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            cancel_reason: cancellationReason, // Pass reason in the body
          },
          withCredentials: true,
        }
      );

      handleSearch(); // Refresh the data (this seems like the method to refetch data)
      setShowDeleteModal(false); // Close the modal
      toast.success("Leaving Certificate deleted successfully!");
      setCancellationReason("");
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(
          `Error deleting Leaving Certificate: ${error.response.data.message}`
        );
      } else {
        toast.error(`Error deleting Leaving Certificate: ${error.message}`);
      }
      console.error("Error deleting Leaving Certificate:", error);
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
      setShowDeleteModal(false);
    }
  };

  const handleCloseModal = () => {
    setCancellationReason("");
    setShowDownloadModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
  };

  const filteredSections = subjects.filter((section) => {
    // Convert the teacher's name and subject's name to lowercase for case-insensitive comparison
    const subjectNameIs = section?.stud_name.toLowerCase() || "";

    // Check if the search term is present in either the teacher's name or the subject's name
    return subjectNameIs.includes(searchTerm.toLowerCase());
  });
  const displayedSections = filteredSections.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "Manage") {
      handleSearch();
    }
  };
  return (
    <>
      {/* <ToastContainer /> */}
      <div className="md:mx-auto md:w-[90%] p-4 bg-white mt-4 ">
        <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
          Leaving Certificate
        </h3>
        <div
          className=" relative  mb-8   h-1  mx-auto bg-red-700"
          style={{
            backgroundColor: "#C03078",
          }}
        ></div>
        <ul className=" w-full md:w-[30%]   grid grid-cols-2 -gap-x-4 px- md:px-10  md:gap-x-2 relative   md:flex md:flex-row  -top-4">
          {/* Tab Navigation */}
          {["Manage", "CreateLeavingCertificate"].map((tab) => (
            <li
              key={tab}
              className={` shadow-md ${
                activeTab === tab ? "text-blue-500 font-bold" : ""
              }`}
            >
              <button
                onClick={() => handleTabChange(tab)}
                className="px-1 md:px-4 py-1 hover:bg-gray-200 text-[1em] md:text-sm text-nowrap"
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
                  <div className="w-full md:w-[80%] flex md:flex-row justify-between items-center">
                    {/* LC Number Input */}
                    <div className="w-full md:w-[98%] mt-4    gap-x-0 md:gap-x-12 mx-auto   flex flex-col gap-y-2 md:gap-y-0 md:flex-row ">
                      <div className="w-full md:w-[30%] gap-x-14 md:gap-x-6 md:justify-start my-1 md:my-4 flex md:flex-row">
                        <label
                          className="text-md mt-1.5 mr-1 md:mr-0 w-[40%] md:w-[29%]"
                          htmlFor="classSelect"
                        >
                          LC No.
                        </label>{" "}
                        <div className="w-full md:w-[50%]">
                          <input
                            type="text"
                            value={srNo}
                            onChange={(e) => {
                              // Allow only positive numbers
                              const value = e.target.value;
                              if (/^\d*$/.test(value)) {
                                setSrNo(value);
                              }
                            }}
                            placeholder="Enter LC No."
                            className="text-sm w-full h-9 mr-0 md:mr-8 px-2 py-1 border-1 border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="w-full md:w-[50%]   gap-x-4  justify-between  my-1 md:my-4 flex md:flex-row">
                        <label
                          className=" ml-0 md:ml-2 relative left-0 md:left-4  w-full md:w-[35%]  text-md mt-1.5 "
                          htmlFor="studentSelect"
                        >
                          Select Class
                        </label>{" "}
                        <div className="w-full md:w-[60%] ">
                          <Select
                            value={selectedClass}
                            onChange={handleClassSelect}
                            options={classOptions}
                            placeholder="Select Class"
                            isSearchable
                            isClearable
                            className="text-sm w-full item-center relative left-0 md:left-4"
                          />
                          {nameError && (
                            <div className="relative top-0.5 left-3 ml-1 text-danger text-xs">
                              {nameError}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={handleSearch}
                        type="button"
                        className="btn h-10 w-18 mt-0.5 md:w-auto relative  btn-primary "
                      >
                        Search
                      </button>
                    </div>{" "}
                  </div>
                </div>
              </div>

              {subjects.length > 0 && (
                <div className="w-full md:w-[85%] mx-auto mt-4">
                  <div className="card mx-auto lg:w-full shadow-lg">
                    <div className="p-2 px-3 bg-gray-100 border-none flex justify-between items-center">
                      <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
                        Manage Leaving Certificate
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

                    <div className="card-body   w-full">
                      <div className="h-96 lg:h-96 overflow-y-scroll lg:overflow-x-hidden">
                        <table className="min-w-full leading-normal table-auto">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="px-2 w-full md:w-[8%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                Sr.No
                              </th>
                              <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                LC No.
                              </th>
                              <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                Student Name
                              </th>

                              <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                Class/Division
                              </th>
                              <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                Status
                              </th>
                              <th className="px-2 w-full md:w-[8%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                Download
                              </th>
                              <th className="px-2 w-full md:w-[8%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                Edit
                              </th>
                              <th className="px-2 w-full md:w-[8%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                Delete
                              </th>
                              <th className="px-2 w-full md:w-[8%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                Issue
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {displayedSections.length ? (
                              displayedSections.map((subject, index) => {
                                // Determine the status text and button visibility based on conditions
                                let statusText = "";
                                let showIssueButton = false;
                                let showDeleteButton = false;
                                let showEditButton = false;
                                let showDownloadButton = false;

                                if (subject.IsDelete === "Y") {
                                  statusText = "Deleted";
                                } else if (subject.IsIssued === "Y") {
                                  statusText = "Issued";
                                  showEditButton = true;
                                  showDownloadButton = true;
                                } else if (subject.IsGenerated === "Y") {
                                  statusText = "Generated";
                                  showIssueButton = true;
                                  showDeleteButton = true;
                                  showEditButton = true;
                                  showDownloadButton = true;
                                }

                                return (
                                  <tr key={subject.sr_no} className=" text-sm ">
                                    <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                      {currentPage * pageSize + index + 1}
                                    </td>
                                    <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                      {subject?.sr_no}
                                    </td>
                                    <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                      {subject?.stud_name}
                                    </td>
                                    <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                      {subject?.classname}{" "}
                                      {subject?.sectionname}
                                    </td>
                                    {/* Status column */}
                                    <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                      {statusText}
                                    </td>{" "}
                                    {/* Download button */}
                                    <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                      {showDownloadButton && (
                                        <button
                                          onClick={() =>
                                            handleDownload(subject)
                                          }
                                          className="text-blue-600 hover:text-blue-800 hover:bg-transparent"
                                        >
                                          <ImDownload />
                                        </button>
                                      )}
                                    </td>
                                    {/* Edit button */}
                                    <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                      {showEditButton && (
                                        <button
                                          onClick={() =>
                                            handleEditForm(subject)
                                          }
                                          className="text-blue-600 hover:text-blue-800 hover:bg-transparent"
                                        >
                                          <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                      )}
                                    </td>
                                    {/* Delete button */}
                                    <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                      {showDeleteButton && (
                                        <button
                                          onClick={() =>
                                            handleDelete(subject?.sr_no)
                                          }
                                          className="text-red-600 hover:text-red-800 hover:bg-transparent"
                                        >
                                          <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                      )}
                                    </td>
                                    {/* Issue button */}
                                    <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                      {showIssueButton && (
                                        <button
                                          onClick={() => handleEdit(subject)}
                                          className="text-green-600 hover:text-green-800 hover:bg-transparent"
                                        >
                                          <ImCheckboxChecked />
                                        </button>
                                      )}
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
          )}
          {activeTab === "CreateLeavingCertificate" && (
            <div>
              <LeavingCertificate />
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title">Confirm Issue</h5>
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
                  Are you sure you want to issue this certificate{" "}
                  {` ${currentSection?.stud_name} `} ?
                </div>
                <div className=" flex justify-end p-3">
                  <button
                    type="button"
                    style={{ backgroundColor: "#2196F3" }}
                    className="btn text-white px-3 mb-2"
                    onClick={handleSubmitEdit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Issuing..." : "Issue"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title">Confirm Download</h5>
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
                  Are you sure you want to Download this certificate{" "}
                  {` ${currentSection?.stud_name} `} ?
                </div>
                <div className=" flex justify-end p-3">
                  <button
                    type="button"
                    style={{ backgroundColor: "#2196F3" }}
                    className="btn text-white px-3 mb-2"
                    onClick={handleDownloadSumbit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Downloading..." : "Download"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title">Confirm Delete</h5>
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
                  {/* <p>
                    Are you sure you want to delete this certificate of{" "}
                    {` ${currestSubjectNameForDelete} `}?
                  </p> */}

                  {/* Reason for Cancellation Input */}
                  <div className="">
                    <label
                      className="block text-md font-semibold mb-1"
                      htmlFor="reason"
                    >
                      Reason For Cancellation:{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="reason"
                      value={cancellationReason}
                      maxLength={200}
                      onChange={(e) => setCancellationReason(e.target.value)}
                      placeholder="Enter reason for cancellation"
                      className="text-sm w-full h-20 px-2 py-1 border rounded-md"
                      required
                    />
                    {!cancellationReason && (
                      <p className="text-red-500 text-sm mt-1">
                        Reason for cancellation is required.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end p-3">
                  <button
                    type="button"
                    className="btn btn-danger px-3 mb-2"
                    onClick={handleSubmitDelete}
                    disabled={!cancellationReason} // Disable button if reason is empty
                  >
                    Delete
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

export default ManageLC;
