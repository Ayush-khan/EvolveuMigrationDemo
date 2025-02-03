// // 100% working old code for download csv....
// import { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { faEdit, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import ReactPaginate from "react-paginate";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { TbFileCertificate } from "react-icons/tb";
// import { RxCross1 } from "react-icons/rx";
// import Select from "react-select";
// import { MdLockReset, MdOutlineRemoveRedEye } from "react-icons/md";
// import { FaCheck } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import "@fortawesome/fontawesome-free/css/all.min.css";

// function NewStudentList() {
//   const API_URL = import.meta.env.VITE_API_URL; // URL for host
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [sectionIdForStudentList, setSectionIdForStudentList] = useState("");
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showDActiveModal, setShowDActiveModal] = useState(false);
//   const [currentSection, setCurrentSection] = useState(null);
//   const [currestSubjectNameForDelete, setCurrestSubjectNameForDelete] =
//     useState("");
//   const [classIdForManage, setclassIdForManage] = useState("");
//   const [classNameForBulkUpload, setClassNameForBulkUpload] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(0);
//   const [pageCount, setPageCount] = useState(0);
//   //   variable to store the respone of the allot subject tab
//   const [nameError, setNameError] = useState(null);
//   //   const [selectedFile, setSelectedFile] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const pageSize = 10;

//   // for react-search of manage tab teacher Edit and select class
//   const [selectedClass, setSelectedClass] = useState(null);
//   const navigate = useNavigate();
//   // State for form fields and validation errors
//   const [userIdset, setUserIdset] = useState("");
//   const [passwordError, setPasswordError] = useState(""); // For password error
//   const [userIdError, setUserIdError] = useState(""); // For userId error
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState(""); // For success message
//   const [errorMessage, setErrorMessage] = useState(""); // For error message
//   const [errorMessageUrl, setErrorMessageUrl] = useState(""); // For error message
//   const [loading, setLoading] = useState(false); // For loader
//   const [showDisplayUpload, setShowDisplayUpload] = useState(false);
//   const [isFileUploaded, setIsFileUploaded] = useState(false); // Track upload status
//   const [isDataPosted, setIsDataPosted] = useState(false); // Flag for tracking successful post

//   // Custom styles for the close button

//   const classOptions = useMemo(
//     () =>
//       classes.map((cls) => ({
//         value: cls.section_id,
//         label: `${cls?.get_class?.name} ${cls.name} `,
//       })),
//     [classes]
//   );

//   const handleClassSelect = (selectedOption) => {
//     setNameError("");
//     setSelectedClass(selectedOption);
//     setclassIdForManage(selectedOption ? selectedOption.value : null); // Set to null if cleared

//     // setclassIdForManage(selectedOption.value); // Assuming value is the class ID
//     setClassNameForBulkUpload(selectedOption.label);
//     console.log("selected class name", selectedOption);
//     setSectionIdForStudentList(selectedOption.value); //
//   };

//   // Fetch initial data (classes with student count) and display loader while loading
//   const fetchInitialData = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("authToken");
//       const classResponse = await axios.get(
//         `${API_URL}/api/getallClassWithStudentCount`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setClasses(classResponse.data || []);
//     } catch (error) {
//       toast.error("Error fetching initial data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = async () => {
//     if (isSubmitting) return; // Prevent re-submitting
//     setIsSubmitting(true);
//     if (!classIdForManage) {
//       setNameError("Please select Class.");
//       setIsSubmitting(false);

//       //   toast.error("Please select Class!");
//       return;
//     }
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("authToken");
//       let response;
//       if (selectedClass) {
//         response = await axios.get(
//           `${API_URL}/api/get_newstudent_by_sectionId/${selectedClass.value}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             // params: { section_id: selectedClass.value },
//           }
//         );
//       }

//       const studentList = response?.data || [];
//       setSubjects(studentList);
//       setPageCount(Math.ceil(studentList.length / pageSize)); // Set page count based on response size
//       setShowDisplayUpload(true);
//     } catch (error) {
//       toast.error("Error fetching student details.");
//     } finally {
//       setLoading(false);
//       setIsSubmitting(false);
//     }
//   };

//   const fetchAllStudents = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       setLoading(true);

//       const response = await axios.get(
//         `${API_URL}/api/get_all_newstudentlist`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       const allStudentList = response?.data || [];
//       setSubjects(allStudentList); // Store in `students`
//       setPageCount(Math.ceil(allStudentList.length / pageSize));
//       setShowDisplayUpload(false);
//     } catch (error) {
//       toast.error("Error fetching the student list.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Re-fetch data when the component mounts or after successful post
//   useEffect(() => {
//     fetchInitialData();
//     fetchAllStudents();
//     // If data is posted successfully, reset the flag and refetch
//     if (isDataPosted) {
//       fetchAllStudents();
//       setIsDataPosted(false); // Reset the flag after refresh
//     }
//   }, [isDataPosted]);
//   // Handle pagination
//   const handlePageClick = (data) => {
//     setCurrentPage(data.selected);
//   };

//   const handleEdit = (section) => {
//     setCurrentSection(section);
//     navigate(
//       `/newStudetEdit/edit/${section.student_id}`,

//       {
//         state: { student: section },
//       }
//     );
//   };

//   const handleDelete = (Subject) => {
//     console.log(
//       "inside delete of subjectallotmenbt____The ClassToDelete",
//       Subject
//     );
//     console.log(
//       "inside delete of subjectallotmenbt the Id is",
//       Subject.student_id
//     );

//     // Find the class to delete (you already have this in the Subject parameter)
//     const classToDelete = subjects.find(
//       (cls) => cls.student_id === Subject.student_id
//     );

//     // Directly use the data from `Subject` instead of waiting for `currentSection` state update
//     setCurrestSubjectNameForDelete(Subject.student_name);

//     // Log the values for debugging
//     // console.log("Class to delete:", classToDelete);
//     // console.log("Current subject name for delete:", Subject.student_name);

//     // Set the state with class to delete and show the delete modal
//     setCurrentSection({ classToDelete }); // Optional, if you still need to store this
//     setShowDeleteModal(true);
//   };

//   // Handle Reset Password form submission
//   const handleSubmitResetPassword = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       console.log("toekn", token);
//       if (!token) {
//         toast.error("Authentication token missing");
//         return;
//       }
//       await axios.put(`${API_URL}/api/students/${userIdset}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         withCredentials: true,
//       });
//       // API call to reset the password

//       toast.success("Password updated successfully!");
//       setShowEditModal(false); // Close modal after success
//     } catch (error) {
//       console.error("Error resetting password:", error);

//       // Reset previous errors
//       setPasswordError("");
//       setUserIdError("");

//       if (error.response && error.response.data && error.response.data.errors) {
//         const backendErrors = error.response.data.errors;

//         // Display each error message for specific fields

//         if (backendErrors.user_id) {
//           setUserIdError(backendErrors.user_id.join(", "));
//         }
//       } else {
//         toast.error("Server error. Please try again later.");
//       }
//     }
//   };
//   // Handle input change for User ID
//   const handleUserIdChange = (e) => {
//     setUserIdset(e.target.value);
//   };
//   const handleSubmitDelete = async () => {
//     if (isSubmitting) return; // Prevent re-submitting
//     setIsSubmitting(true);
//     // Handle delete submission logic
//     try {
//       const token = localStorage.getItem("authToken");
//       console.log(
//         "the currecnt section inside the delte___",
//         currentSection?.classToDelete?.student_id
//       );
//       console.log("the classes inside the delete", classes);
//       console.log(
//         "the current section insde the handlesbmitdelete",
//         currentSection.classToDelete
//       );
//       if (
//         !token ||
//         !currentSection ||
//         !currentSection?.classToDelete?.student_id
//       ) {
//         throw new Error("Student ID is missing");
//       }

//       await axios.delete(
//         `${API_URL}/api/deleteNewstudent/${currentSection?.classToDelete?.student_id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           withCredentials: true,
//         }
//       );

//       // fetchClassNames();

//       fetchAllStudents();
//       setShowDeleteModal(false);
//       // setSubjects([]);
//       toast.success("Student deleted successfully!");
//     } catch (error) {
//       if (error.response && error.response.data) {
//         toast.error(`Error deleting Student: ${error.response.data.message}`);
//       } else {
//         toast.error(`Error deleting Student: ${error.message}`);
//       }
//       console.error("Error deleting Student:", error);
//       // setError(error.message);
//     } finally {
//       setIsSubmitting(false); // Re-enable the button after the operation
//       setShowDeleteModal(false);
//     }
//   };

//   const handleCloseModal = () => {
//     //  fetchInitialData();

//     setShowEditModal(false);
//     setShowDeleteModal(false);
//     setShowDActiveModal(false);
//   };
//   const handleCloseModalForBulkUpload = () => {
//     setShowDisplayUpload(false);
//     setclassIdForManage(null);
//     setSelectedClass(null); // Clear the dropdown value
//     fetchAllStudents();
//   };

//   // for uplode portions
//   // Function to download the CSV template
//   const handleDownloadTemplate = async () => {
//     try {
//       // Adjust classIdForManage dynamically if needed
//       const response = await axios.get(
//         `${API_URL}/api/students/download-template/${classIdForManage}`,
//         {
//           responseType: "blob", // Important for handling binary data
//         }
//       );

//       // Trigger download using a hidden link element
//       triggerFileDownload(response.data, "student_list_template.csv");
//     } catch (error) {
//       console.error("Error downloading template:", error);
//     }
//   };

//   // Helper function to trigger file download
//   const triggerFileDownload = (blobData, fileName) => {
//     const url = window.URL.createObjectURL(new Blob([blobData]));
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", fileName); // Set the file name
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link); // Cleanup after download
//   };

//   // Handle file selection
//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setSelectedFile(file); // Set the selected file to state
//     setErrorMessage(""); // Clear any previous error
//     setUploadStatus(""); // Clear any previous success
//     setErrorMessageUrl("");
//   };
//   const downloadCsv = async (relativeUrl) => {
//     try {
//       // Use the provided relativeUrl directly
//       const response = await fetch(relativeUrl);

//       // Handle HTTP errors
//       if (!response.ok) {
//         throw new Error(`HTTP Error! Status: ${response.status}`);
//       }

//       // Convert response to Blob
//       const blob = await response.blob();
//       const filename = "rejected_rows.csv"; // Desired file name

//       // Create a temporary link and trigger download
//       const link = document.createElement("a");
//       link.href = window.URL.createObjectURL(blob);
//       link.setAttribute("download", filename);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       // Clean up the URL object
//       window.URL.revokeObjectURL(link.href);
//     } catch (error) {
//       console.error("Error downloading the file:", error.message);
//       alert(
//         "Failed to download the file. Please check the URL or your network connection."
//       );
//     }
//   };

//   // Function to upload the selected CSV file
//   const handleUpload = async () => {
//     if (!selectedFile) {
//       setErrorMessage("Please select a file first.");
//       return;
//     }

//     setLoading(true); // Show loader
//     const formData = new FormData();
//     formData.append("file", selectedFile); // Append the selected file

//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }
//       console.log("file is csv", formData);
//       console.log("this is post of the csv", selectedClass.value);
//       const response = await axios.post(
//         `${API_URL}/api/update-students-csv/${selectedClass.value}`, // Pass sectionId in the URL
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log("the response of post bulk upload", response);
//       if (response.status === 200) {
//         toast.success("Data posted successfully!");
//         setIsDataPosted(true); // Set the flag to true after a successful post
//         setSelectedFile(null);
//       }
//     } catch (error) {
//       setLoading(false); // Hide loader

//       const showErrorForUploading = error?.response?.data?.message;
//       const showErrorForUploadingUrl = error?.response?.data?.invalid_rows;
//       console.log("showErrorForUploadingURL", showErrorForUploading);
//       setErrorMessage(
//         !showErrorForUploading
//           ? "Failed to upload file. Please try again..."
//           : `Error-Message: ${showErrorForUploading}.`
//       );
//       // const fullURLFOrErrorMessage = `${API_URL}${showErrorForUploadingUrl}`;
//       const fullURLFOrErrorMessage = `${showErrorForUploadingUrl}`;

//       setErrorMessageUrl(fullURLFOrErrorMessage);
//       console.log("showerrormessage Full url", errorMessageUrl);

//       toast.error(
//         !showErrorForUploading
//           ? "Error uploading file."
//           : error?.response?.data?.message
//       );

//       console.error("Error uploading file:", showErrorForUploading);
//     }
//   };
//   const filteredSections = subjects.filter((section) => {
//     // Convert the search term to lowercase for case-insensitive comparison
//     const searchLower = searchTerm.toLowerCase();

//     // Get the student's full name, class name, and user ID for filtering
//     const studentName =
//       `${section?.first_name} ${section?.mid_name} ${section?.last_name}`?.toLowerCase() ||
//       "";
//     const studentClass = section?.get_class?.name?.toLowerCase() || "";

//     // Check if the search term is present in Roll No, Name, Class, or UserId
//     return (
//       studentName.includes(searchLower) || studentClass.includes(searchLower)
//     );
//   });

//   // const filteredSections = subjects.filter((section) => {
//   //   // Convert the teacher's name and subject's name to lowercase for case-insensitive comparison
//   //   const studentFullName =
//   //     `${section?.first_name} ${section?.mid_name} ${section?.last_name}`?.toLowerCase() ||
//   //     "";
//   //   const UserId =
//   //     `${section?.get_class?.name} ${section?.get_division?.name}`?.toLowerCase() ||
//   //     "";

//   //   // Check if the search term is present in either the teacher's name or the subject's name
//   //   return (
//   //     studentFullName.includes(searchTerm.toLowerCase()) ||
//   //     UserId.includes(searchTerm.toLowerCase())
//   //   );
//   // });
//   const displayedSections = filteredSections.slice(
//     currentPage * pageSize,
//     (currentPage + 1) * pageSize
//   );
//   // handle allot subject close model
//   console.log("displayedSections", displayedSections);
//   return (
//     <>
//       {/* <ToastContainer /> */}
//       {/* <div className="md:mx-auto md:w-3/4 p-4 bg-white mt-4 "> */}
//       <div className="md:mx-auto md:w-[85%] p-4 bg-white mt-4 ">
//         <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
//           New Students List
//         </h3>
//         <div
//           className=" relative  mb-8   h-1  mx-auto bg-red-700"
//           style={{
//             backgroundColor: "#C03078",
//           }}
//         ></div>
//         {/* <hr className="relative -top-3" /> */}
//         {/* dfsk */}

//         <div className="bg-white w-full md:w-[95%] mx-auto rounded-md ">
//           <div className="w-full  mx-auto">
//             <ToastContainer />

//             <div className="mb-4  ">
//               <div className="  w-[100%]  mx-auto ">
//                 {showDisplayUpload ? (
//                   <div className="max-w-full bg-white shadow-md rounded-lg border border-gray-300 mx-auto mt-10 p-6">
//                     <RxCross1
//                       className="float-end relative mt-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
//                       onClick={handleCloseModalForBulkUpload}
//                     />
//                     <h2 className="text-center text-2xl font-semibold mb-8 text-blue-600">
//                       Upload Student Data from Excel Sheet
//                     </h2>

//                     <h5 className="  text-center mx-auto font-semibold mb-3 text-gray-500 ">
//                       Class: {classNameForBulkUpload}
//                     </h5>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
//                       {/* Download Student List Template */}
//                       <div className="flex flex-col items-center p-4 bg-gray-100 rounded-md">
//                         <h5 className="font-semibold mb-3 text-gray-800">
//                           Download Template
//                         </h5>
//                         <p className="text-sm text-gray-600 mb-4">
//                           # Please download the template by clicking below.
//                           <br />
//                           # Enter student details in the downloaded file.
//                           <br /># Do not add new students.
//                         </p>
//                         <button
//                           onClick={handleDownloadTemplate}
//                           className="bg-blue-600 text-white text-xs rounded-full px-6 py-3 hover:bg-blue-700 transition duration-200"
//                         >
//                           <i className="fas fa-download text-lg"></i> Download
//                           Template
//                         </button>
//                       </div>

//                       {/* File Upload dfgs  gdg*/}
//                       <div className="flex flex-col items-center p-4 bg-gray-100 rounded-md">
//                         <h5 className="font-semibold mb-3 text-gray-800">
//                           Select a file to upload
//                         </h5>

//                         <p className="text-sm text-gray-600 mb-4">
//                           # Do not change the file name or contents of the first
//                           4 columns.
//                           <br /># Do not change the name of the file. Do not
//                           change the contents of first 4 columns in the
//                           downloaded excelsheet.
//                         </p>

//                         <label className="bg-blue-600 md:w-[45%] overflow-hidden text-white rounded-full text-xs  px-6 py-3 hover:bg-blue-700 cursor-pointer transition duration-200 whitespace-nowrap">
//                           <i className="fas fa-upload text-lg "></i>{" "}
//                           {selectedFile
//                             ? selectedFile.name.length > 20
//                               ? `${selectedFile.name.substring(0, 10)}...`
//                               : selectedFile.name
//                             : "Choose File"}
//                           <input
//                             type="file"
//                             accept=".csv"
//                             onChange={handleFileChange}
//                             className="hidden"
//                           />
//                         </label>
//                       </div>

//                       {/* Register New Students */}
//                       <div className="flex flex-col items-center p-4 bg-gray-100 rounded-md">
//                         <h5 className="font-semibold mb-3 text-gray-800">
//                           Register New Students
//                         </h5>
//                         <p className="text-sm text-gray-600 mb-4">
//                           # Click upload to register students.
//                           <br /># Students will be registered in the
//                           application. Their userid and password will be sent as
//                           email at the email id's provided.
//                         </p>
//                         {/* <div className="text-xs  flex flex-col justify-around  ">
//                           <span>
//                             {errorMessage && (
//                               <p style={{ color: "red" }}>{errorMessage}</p>
//                             )}
//                           </span>
//                           <span className="mb-2">
//                             {" "}
//                             {errorMessageUrl && (
//                               <a
//                                 href="#"
//                                 style={{ color: "red" }}
//                                 className="text-xs"
//                                 onClick={() => {
//                                   const link = document.createElement("a");
//                                   link.href = errorMessageUrl;
//                                   link.setAttribute("download", "data.csv"); // Name the file as data.csv
//                                   document.body.appendChild(link);
//                                   link.click();
//                                   document.body.removeChild(link);
//                                 }}
//                               >
//                                 <span className="underline text-blue-500 hover:text-blue-800 mr-2">
//                                   Download CSV to see errors.
//                                 </span>
//                               </a>
//                             )}
//                           </span>
//                         </div> */}
//                         <div className="text-xs flex flex-col justify-around">
//                           <span>
//                             {errorMessage && (
//                               <p style={{ color: "red" }}>{errorMessage}</p>
//                             )}
//                           </span>
//                           <span className="mb-2">
//                             {errorMessageUrl && (
//                               <a
//                                 href="#"
//                                 style={{ color: "red" }}
//                                 className="text-xs"
//                                 onClick={(e) => {
//                                   e.preventDefault(); // Prevent the default link behavior
//                                   downloadCsv(errorMessageUrl); // Call the function to download the file
//                                 }}
//                               >
//                                 <span className="underline text-blue-500 hover:text-blue-800 mr-2">
//                                   Download CSV to see errors.
//                                 </span>
//                               </a>
//                             )}
//                           </span>
//                         </div>

//                         <button
//                           onClick={handleUpload}
//                           className="bg-blue-600 text-white text-xs rounded-full px-6 py-3 hover:bg-blue-700 transition duration-200"
//                           disabled={loading} // Disable button during loading
//                         >
//                           {" "}
//                           <i className="fas fa-cloud-upload-alt text-lg"></i>{" "}
//                           {loading ? "Uploading..." : "Upload"}
//                         </button>

//                         {uploadStatus && (
//                           <p style={{ color: "green" }}>{uploadStatus}</p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="max-w-full bg-white shadow-md rounded-lg border border-gray-300 mx-auto mt-10 p-6">
//                     <h2 className="text-center text-2xl font-semibold mb-8 text-blue-600">
//                       Upload Student Data from Excel Sheet
//                     </h2>

//                     {/* <div className="w-full  grid grid-cols-1 md:grid-cols-3 gap-6 text-center"> */}
//                     {/* Download Student List Template */}
//                     <div className=" w-full md:w-[49%]  mx-auto flex justify-center flex-col md:flex-row gap-x-1 md:gap-x-4 ">
//                       <div className="w-full  gap-x-3 md:justify-center justify-around  my-1 md:my-4 flex  md:flex-row  ">
//                         <label
//                           htmlFor="classSection"
//                           className=" mr-2 pt-2 items-center text-center"
//                         >
//                           Class <span className="text-red-500">*</span>
//                         </label>
//                         <div className="w-[65%] md:w-[55%] ">
//                           <Select
//                             value={selectedClass}
//                             onChange={handleClassSelect}
//                             options={classOptions}
//                             placeholder="Select "
//                             isSearchable
//                             isClearable
//                             className="text-sm"
//                           />
//                           {nameError && (
//                             <div className=" relative top-0.5 ml-1 text-danger text-xs">
//                               {nameError}
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       <button
//                         onClick={handleSearch}
//                         type="button"
//                         disabled={isSubmitting}
//                         className="mr-0 md:mr-4 my-1 md:my-4 btn h-10  w-18 md:w-auto btn-primary "
//                       >
//                         {isSubmitting ? "Searching..." : "Search"}
//                       </button>
//                     </div>
//                   </div>
//                   // </div>
//                 )}
//               </div>
//             </div>
//             {subjects.length > 0 && (
//               <div className="w-full  mt-4">
//                 <div className="card mx-auto lg:w-full shadow-lg">
//                   <div className="p-2 px-3 bg-gray-100 border-none flex justify-between items-center">
//                     <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
//                       Student List
//                     </h3>
//                     <div className="w-1/2 md:w-fit mr-1 ">
//                       <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Search "
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                       />
//                     </div>
//                   </div>
//                   <div
//                     className=" relative w-[97%]   mb-3 h-1  mx-auto bg-red-700"
//                     style={{
//                       backgroundColor: "#C03078",
//                     }}
//                   ></div>

//                   <div className="card-body w-full">
//                     <div className="h-96 lg:h-96 overflow-y-scroll lg:overflow-x-hidden w-full  md:w-[80%] mx-auto">
//                       <table className="min-w-full leading-normal table-auto">
//                         <thead>
//                           <tr className="bg-gray-200">
//                             <th className="px-2 w-full md:w-[10%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//                               Sr.No
//                             </th>

//                             <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//                               Student Name
//                             </th>
//                             <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//                               Class
//                             </th>

//                             <th className="px-2 w-full md:w-[10%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//                               Edit
//                             </th>
//                             <th className="px-2 w-full md:w-[10%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//                               Delete
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {displayedSections.length ? (
//                             displayedSections.map((subject, index) => (
//                               <tr
//                                 key={subject.student_id}
//                                 className=" text-sm "
//                               >
//                                 <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
//                                   {currentPage * pageSize + index + 1}
//                                 </td>

//                                 <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
//                                   {`${subject?.first_name ?? ""} ${
//                                     subject?.mid_name
//                                       ? subject.mid_name + " "
//                                       : ""
//                                   }${subject?.last_name ?? ""}`.trim()}
//                                 </td>

//                                 <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm text-nowrap">
//                                   {`${subject?.get_class?.name ?? ""}${
//                                     subject?.get_division?.name
//                                       ? " " + subject.get_division.name
//                                       : ""
//                                   }`.trim()}
//                                 </td>

//                                 <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
//                                   <button
//                                     onClick={() => handleEdit(subject)}
//                                     className="text-blue-600 hover:text-blue-800 hover:bg-transparent "
//                                   >
//                                     <FontAwesomeIcon icon={faEdit} />
//                                   </button>
//                                 </td>

//                                 <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
//                                   <button
//                                     onClick={() => handleDelete(subject)}
//                                     className="text-red-600 hover:text-red-800 hover:bg-transparent "
//                                   >
//                                     <FontAwesomeIcon icon={faTrash} />
//                                   </button>
//                                 </td>
//                               </tr>
//                             ))
//                           ) : (
//                             <div className=" absolute left-[1%] w-[100%]  text-center flex justify-center items-center mt-14">
//                               <div className=" text-center text-xl text-red-700">
//                                 Oops! No data found..
//                               </div>
//                             </div>
//                           )}
//                         </tbody>
//                       </table>
//                     </div>
//                     <div className=" flex justify-center pt-2 -mb-3">
//                       <ReactPaginate
//                         previousLabel={"Previous"}
//                         nextLabel={"Next"}
//                         breakLabel={"..."}
//                         breakClassName={"page-item"}
//                         breakLinkClassName={"page-link"}
//                         pageCount={pageCount}
//                         marginPagesDisplayed={1}
//                         pageRangeDisplayed={1}
//                         onPageChange={handlePageClick}
//                         containerClassName={"pagination"}
//                         pageClassName={"page-item"}
//                         pageLinkClassName={"page-link"}
//                         previousClassName={"page-item"}
//                         previousLinkClassName={"page-link"}
//                         nextClassName={"page-item"}
//                         nextLinkClassName={"page-link"}
//                         activeClassName={"active"}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Delete Modal */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
//           <div className="modal fade show" style={{ display: "block" }}>
//             <div className="modal-dialog modal-dialog-centered">
//               <div className="modal-content">
//                 <div className="flex justify-between p-3">
//                   <h5 className="modal-title">Confirm Delete</h5>
//                   <RxCross1
//                     className="float-end relative mt-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
//                     type="button"
//                     // className="btn-close text-red-600"
//                     onClick={handleCloseModal}
//                   />
//                   {console.log(
//                     "the currecnt section inside delete of the managesubjhect",
//                     currentSection
//                   )}
//                 </div>
//                 <div
//                   className=" relative  mb-3 h-1 w-[97%] mx-auto bg-red-700"
//                   style={{
//                     backgroundColor: "#C03078",
//                   }}
//                 ></div>
//                 <div className="modal-body">
//                   Are you sure you want to delete this student{" "}
//                   {` ${currestSubjectNameForDelete} `} ?
//                 </div>
//                 <div className=" flex justify-end p-3">
//                   <button
//                     type="button"
//                     className="btn btn-danger px-3 mb-2"
//                     onClick={handleSubmitDelete}
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? "Deleting..." : "Delete"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {showEditModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="modal show" style={{ display: "block" }}>
//             <div className="modal-dialog modal-dialog-centered">
//               <div className="modal-content">
//                 <div className="flex justify-between p-3">
//                   <h5 className="modal-title">Reset Password</h5>
//                   <RxCross1
//                     className="float-end relative mt-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
//                     onClick={handleCloseModal}
//                   />
//                 </div>
//                 <div
//                   className="relative mb-3 h-1 w-[97%] mx-auto bg-red-700"
//                   style={{ backgroundColor: "#C03078" }}
//                 ></div>

//                 <div className="modal-body">
//                   {/* User ID Input */}
//                   <div className="relative mb-3 flex justify-center mx-4">
//                     <label htmlFor="userId" className="w-1/2 mt-2">
//                       User ID <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       maxLength={30}
//                       className="form-control shadow-md mb-2"
//                       id="userId"
//                       value={userIdset} // Prefill userId
//                       onChange={handleUserIdChange}
//                     />
//                     {userIdError && (
//                       <span className="text-danger text-xs">{userIdError}</span>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-end p-3">
//                   <button
//                     type="button"
//                     className="btn btn-primary px-3 mb-2"
//                     onClick={handleSubmitResetPassword}
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? "Updating..." : "Update"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default NewStudentList;

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faEdit, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import { TbFileCertificate } from "react-icons/tb";
import { RxCross1 } from "react-icons/rx";
import Select from "react-select";
import { MdLockReset, MdOutlineRemoveRedEye } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

function NewStudentList() {
  const API_URL = import.meta.env.VITE_API_URL; // URL for host
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sectionIdForStudentList, setSectionIdForStudentList] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDActiveModal, setShowDActiveModal] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [currestSubjectNameForDelete, setCurrestSubjectNameForDelete] =
    useState("");
  const [classIdForManage, setclassIdForManage] = useState("");
  const [classNameForBulkUpload, setClassNameForBulkUpload] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  //   variable to store the respone of the allot subject tab
  const [nameError, setNameError] = useState(null);
  //   const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageSize = 10;

  // for react-search of manage tab teacher Edit and select class
  const [selectedClass, setSelectedClass] = useState(null);
  const navigate = useNavigate();
  // State for form fields and validation errors
  const [userIdset, setUserIdset] = useState("");
  const [passwordError, setPasswordError] = useState(""); // For password error
  const [userIdError, setUserIdError] = useState(""); // For userId error
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(""); // For success message
  const [errorMessage, setErrorMessage] = useState(""); // For error message
  const [errorMessageUrl, setErrorMessageUrl] = useState(""); // For error message
  const [loading, setLoading] = useState(false); // For loader
  const [showDisplayUpload, setShowDisplayUpload] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false); // Track upload status
  const [isDataPosted, setIsDataPosted] = useState(false); // Flag for tracking successful post

  // Custom styles for the close button

  const classOptions = useMemo(
    () =>
      classes.map((cls) => ({
        value: cls.section_id,
        label: `${cls?.get_class?.name} ${cls.name} `,
      })),
    [classes]
  );

  const handleClassSelect = (selectedOption) => {
    setNameError("");
    setSelectedClass(selectedOption);
    setclassIdForManage(selectedOption ? selectedOption.value : null); // Set to null if cleared

    // setclassIdForManage(selectedOption.value); // Assuming value is the class ID
    setClassNameForBulkUpload(selectedOption.label);
    console.log("selected class name", selectedOption);
    setSectionIdForStudentList(selectedOption.value); //
  };

  // Fetch initial data (classes with student count) and display loader while loading
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const classResponse = await axios.get(
        `${API_URL}/api/getallClassWithStudentCount`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClasses(classResponse.data || []);
    } catch (error) {
      toast.error("Error fetching initial data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    if (!classIdForManage) {
      setNameError("Please select Class.");
      setIsSubmitting(false);

      //   toast.error("Please select Class!");
      return;
    }
    setLoading(true);
    setSearchTerm("");
    try {
      const token = localStorage.getItem("authToken");
      let response;
      if (selectedClass) {
        response = await axios.get(
          `${API_URL}/api/get_newstudent_by_sectionId/${selectedClass.value}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            // params: { section_id: selectedClass.value },
          }
        );
      }

      const studentList = response?.data || [];
      setSubjects(studentList);
      setPageCount(Math.ceil(studentList.length / pageSize)); // Set page count based on response size
      setShowDisplayUpload(true);
    } catch (error) {
      toast.error("Error fetching student details.");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const fetchAllStudents = async () => {
    try {
      const token = localStorage.getItem("authToken");
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/api/get_all_newstudentlist`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const allStudentList = response?.data || [];
      setSubjects(allStudentList); // Store in `students`
      setPageCount(Math.ceil(allStudentList.length / pageSize));
      setShowDisplayUpload(false);
    } catch (error) {
      toast.error("Error fetching the student list.");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch data when the component mounts or after successful post
  useEffect(() => {
    fetchInitialData();
    fetchAllStudents();
    // If data is posted successfully, reset the flag and refetch
    if (isDataPosted) {
      fetchAllStudents();
      setIsDataPosted(false); // Reset the flag after refresh
    }
  }, [isDataPosted]);
  // Handle pagination
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleEdit = (section) => {
    setCurrentSection(section);
    navigate(
      `/newStudetEdit/edit/${section.student_id}`,

      {
        state: { student: section },
      }
    );
  };

  const handleDelete = (Subject) => {
    console.log(
      "inside delete of subjectallotmenbt____The ClassToDelete",
      Subject
    );
    console.log(
      "inside delete of subjectallotmenbt the Id is",
      Subject.student_id
    );

    // Find the class to delete (you already have this in the Subject parameter)
    const classToDelete = subjects.find(
      (cls) => cls.student_id === Subject.student_id
    );

    // Directly use the data from `Subject` instead of waiting for `currentSection` state update
    setCurrestSubjectNameForDelete(Subject.student_name);

    // Log the values for debugging
    // console.log("Class to delete:", classToDelete);
    // console.log("Current subject name for delete:", Subject.student_name);

    // Set the state with class to delete and show the delete modal
    setCurrentSection({ classToDelete }); // Optional, if you still need to store this
    setShowDeleteModal(true);
  };

  // Handle Reset Password form submission
  const handleSubmitResetPassword = async () => {
    try {
      const token = localStorage.getItem("authToken");
      console.log("toekn", token);
      if (!token) {
        toast.error("Authentication token missing");
        return;
      }
      await axios.put(`${API_URL}/api/students/${userIdset}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      // API call to reset the password

      toast.success("Password updated successfully!");
      setShowEditModal(false); // Close modal after success
    } catch (error) {
      console.error("Error resetting password:", error);

      // Reset previous errors
      setPasswordError("");
      setUserIdError("");

      if (error.response && error.response.data && error.response.data.errors) {
        const backendErrors = error.response.data.errors;

        // Display each error message for specific fields

        if (backendErrors.user_id) {
          setUserIdError(backendErrors.user_id.join(", "));
        }
      } else {
        toast.error("Server error. Please try again later.");
      }
    }
  };
  // Handle input change for User ID
  const handleUserIdChange = (e) => {
    setUserIdset(e.target.value);
  };
  const handleSubmitDelete = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    // Handle delete submission logic
    try {
      const token = localStorage.getItem("authToken");
      console.log(
        "the currecnt section inside the delte___",
        currentSection?.classToDelete?.student_id
      );
      console.log("the classes inside the delete", classes);
      console.log(
        "the current section insde the handlesbmitdelete",
        currentSection.classToDelete
      );
      if (
        !token ||
        !currentSection ||
        !currentSection?.classToDelete?.student_id
      ) {
        throw new Error("Student ID is missing");
      }

      await axios.delete(
        `${API_URL}/api/deleteNewstudent/${currentSection?.classToDelete?.student_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // fetchClassNames();

      fetchAllStudents();
      setShowDeleteModal(false);
      // setSubjects([]);
      toast.success("Student deleted successfully!");
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(`Error deleting Student: ${error.response.data.message}`);
      } else {
        toast.error(`Error deleting Student: ${error.message}`);
      }
      console.error("Error deleting Student:", error);
      // setError(error.message);
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
      setShowDeleteModal(false);
    }
  };

  const handleCloseModal = () => {
    //  fetchInitialData();

    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowDActiveModal(false);
  };
  const handleCloseModalForBulkUpload = () => {
    setShowDisplayUpload(false);
    setclassIdForManage(null);
    setSelectedClass(null); // Clear the dropdown value
    fetchAllStudents();
    setSelectedFile(null);
    setErrorMessage(""); // Clear any previous error
    setUploadStatus(""); // Clear any previous success
    setErrorMessageUrl("");
  };

  // for uplode portions
  // Function to download the CSV template
  const handleDownloadTemplate = async () => {
    try {
      const token = localStorage.getItem("authToken");
      console.log("the response of the namechack api____");

      if (!token) {
        throw new Error("No authentication token found");
      }
      // Adjust classIdForManage dynamically if needed
      const response = await axios.get(
        `${API_URL}/api/students/download-template/${classIdForManage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        {
          responseType: "blob", // Important for handling binary data
        }
      );

      // Trigger download using a hidden link element
      triggerFileDownload(
        response.data,
        `${classNameForBulkUpload}_template.csv`
      );
    } catch (error) {
      console.error("Error downloading template:", error);
    }
  };

  // Helper function to trigger file download
  const triggerFileDownload = (blobData, fileName) => {
    const url = window.URL.createObjectURL(new Blob([blobData]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName); // Set the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Cleanup after download
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file); // Set the selected file to state
    setErrorMessage(""); // Clear any previous error
    setUploadStatus(""); // Clear any previous success
    setErrorMessageUrl("");
  };
  // const downloadCsv = async (relativeUrl) => {
  //   console.log("relativeUrl", relativeUrl);
  //   try {
  //     // Use the provided relativeUrl directly
  //     const response = await fetch(relativeUrl);

  //     // Handle HTTP errors
  //     if (!response.ok) {
  //       throw new Error(`HTTP Error! Status: ${response.status}`);
  //     }

  //     // Convert response to Blob
  //     const blob = await response.blob();
  //     const filename = "rejected_rows.csv"; // Desired file name

  //     // Create a temporary link and trigger download
  //     const link = document.createElement("a");
  //     link.href = window.URL.createObjectURL(blob);
  //     link.setAttribute("download", filename);
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);

  //     // Clean up the URL object
  //     window.URL.revokeObjectURL(link.href);
  //   } catch (error) {
  //     console.error("Error downloading the file:", error.message);
  //     alert(
  //       "Failed to download the file. Please check the URL or your network connection."
  //     );
  //   }
  // };

  const downloadCsv = async (fileUrl) => {
    try {
      const token = localStorage.getItem("authToken");
      console.log("the response of the namechack api____");

      if (!token) {
        throw new Error("No authentication token found");
      }
      // Adjust classIdForManage dynamically if needed
      const response = await axios.get(
        `${API_URL}/api/download_csv_rejected/${fileUrl}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        {
          responseType: "blob", // Important for handling binary data
        }
      );

      // Trigger download using a hidden link element
      triggerFileDownload(
        response.data,
        `${classNameForBulkUpload}_rejected_template.csv`
      );
    } catch (error) {
      console.error("Error downloading template:", error);
    }
  };

  //  const downloadCsv = (fileUrl, fileName = "download.csv") => {
  //    console.log("fileUrl", fileUrl);

  //    // Base URL for the file
  //    const baseUrl = "https://sms.evolvu.in/storage/app/public/csv_rejected/";
  //    const fullUrl = `${baseUrl}${fileUrl}`; // Construct the full file URL

  //    // Fetch the file contents using fetch API
  //    fetch(fullUrl)
  //      .then((response) => {
  //        if (!response.ok) {
  //          throw new Error(`HTTP error! Status: ${response.status}`);
  //        }
  //        return response.blob(); // Get the file content as a blob
  //      })
  //      .then((blob) => {
  //        // Create a temporary download link
  //        const link = document.createElement("a");
  //        link.href = URL.createObjectURL(blob); // Create a blob URL for the file
  //        link.download = fileName; // Set the file name for download
  //        document.body.appendChild(link); // Add the link to the DOM
  //        link.click(); // Programmatically click the link
  //        document.body.removeChild(link); // Clean up by removing the link
  //      })
  //      .catch((error) => {
  //        console.error("Error downloading the file:", error);
  //      });
  //  };

  // Function to upload the selected CSV file

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a file first.");
      return;
    }

    // Extract the trimmed class name from the file name (assuming the format is "12 A.csv")
    const fileNameWithoutExtension = selectedFile.name.split("_")[0].trim(); // Remove extension and trim spaces
    // Remove extension and trim spaces
    const classNameForBulkUploadForCheck = classNameForBulkUpload.trim(); // Trim the class name for comparison
    console.log(
      "fileNameWithoutExtension",
      fileNameWithoutExtension,
      "classNameForBulkUploadForCheck",
      classNameForBulkUploadForCheck
    );
    // Check if the file name matches the selected class name
    if (fileNameWithoutExtension !== classNameForBulkUploadForCheck) {
      // toast.error(
      //   "Invalid file! Select a valid file without renaming it or modifying the first four columns."
      // );
      toast.warning(
        "⚠️Invalid file! Please select a valid file without renaming it or modifying the first four columns."
      );
      return;
    }
    // if (fileNameWithoutExtension !== classNameForBulkUploadForCheck) {
    //   toast.error("Do not change the file name please");
    //   return;
    // }
    setLoading(true); // Show loader
    const formData = new FormData();
    formData.append("file", selectedFile); // Append the selected file

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }
      console.log("file is csv", formData);
      console.log("this is post of the csv", selectedClass.value);
      const response = await axios.post(
        `${API_URL}/api/update-students-csv/${selectedClass.value}`, // Pass sectionId in the URL
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("the response of post bulk upload", response);
      if (response.status === 200) {
        toast.success("Data posted successfully!");
        setIsDataPosted(true); // Set the flag to true after a successful post
        setSelectedFile(null);
      }
    } catch (error) {
      setLoading(false); // Hide loader

      const showErrorForUploading = error?.response?.data?.message;
      const showErrorForUploadingUrl = error?.response?.data?.invalid_rows;
      console.log("showErrorForUploadingURL", showErrorForUploading);
      setErrorMessage(
        !showErrorForUploading
          ? "Failed to upload file. Please try again..."
          : `Error-Message: ${showErrorForUploading}.`
      );
      // const fullURLFOrErrorMessage = `${API_URL}${showErrorForUploadingUrl}`;
      const fullURLFOrErrorMessage = `${showErrorForUploadingUrl}`;

      setErrorMessageUrl(fullURLFOrErrorMessage);
      console.log("showerrormessage Full url", errorMessageUrl);

      toast.error(
        !showErrorForUploading
          ? "Error uploading file."
          : error?.response?.data?.message
      );

      console.error("Error uploading file:", showErrorForUploading);
    }
  };
  const filteredSections = subjects.filter((section) => {
    // Convert the search term to lowercase for case-insensitive comparison
    const searchLower = searchTerm.toLowerCase();

    // Get the student's full name, class name, and user ID for filtering
    const studentName =
      `${section?.first_name} ${section?.mid_name} ${section?.last_name}`?.toLowerCase() ||
      "";
    const studentClass = section?.get_class?.name?.toLowerCase() || "";

    // Check if the search term is present in Roll No, Name, Class, or UserId
    return (
      studentName.includes(searchLower) || studentClass.includes(searchLower)
    );
  });

  // const filteredSections = subjects.filter((section) => {
  //   // Convert the teacher's name and subject's name to lowercase for case-insensitive comparison
  //   const studentFullName =
  //     `${section?.first_name} ${section?.mid_name} ${section?.last_name}`?.toLowerCase() ||
  //     "";
  //   const UserId =
  //     `${section?.get_class?.name} ${section?.get_division?.name}`?.toLowerCase() ||
  //     "";

  //   // Check if the search term is present in either the teacher's name or the subject's name
  //   return (
  //     studentFullName.includes(searchTerm.toLowerCase()) ||
  //     UserId.includes(searchTerm.toLowerCase())
  //   );
  // });
  const displayedSections = filteredSections.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );
  // handle allot subject close model
  console.log("displayedSections", displayedSections);
  return (
    <>
      {/* <ToastContainer /> */}
      {/* <div className="md:mx-auto md:w-3/4 p-4 bg-white mt-4 "> */}
      <div className="md:mx-auto md:w-[85%] p-4 bg-white mt-4 ">
        <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
          New Students List
        </h3>
        <div
          className=" relative  mb-8   h-1  mx-auto bg-red-700"
          style={{
            backgroundColor: "#C03078",
          }}
        ></div>
        {/* <hr className="relative -top-3" /> */}
        {/* dfsk */}

        <div className="bg-white w-full md:w-[95%] mx-auto rounded-md ">
          <div className="w-full  mx-auto">
            <ToastContainer />

            <div className="mb-4  ">
              <div className="  w-[100%]  mx-auto ">
                {showDisplayUpload ? (
                  <div className="max-w-full bg-white shadow-md rounded-lg border border-gray-300 mx-auto mt-10 p-6">
                    <RxCross1
                      className="float-end relative mt-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                      onClick={handleCloseModalForBulkUpload}
                    />
                    <h2 className="text-center text-2xl font-semibold mb-8 text-blue-600">
                      Upload Student Data from Excel Sheet
                    </h2>

                    <h5 className="  text-center mx-auto font-semibold mb-3 text-gray-500 ">
                      Class: {classNameForBulkUpload}
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                      {/* Download Student List Template */}
                      <div className="flex flex-col items-center p-4 bg-gray-100 rounded-md">
                        <h5 className="font-semibold mb-3 text-gray-800">
                          Download Template
                        </h5>
                        <p className="text-sm text-gray-600 mb-4">
                          # Please download the template by clicking below.
                          <br />
                          # Enter student details in the downloaded file.
                          <br /># Do not add new students.
                        </p>
                        <button
                          onClick={handleDownloadTemplate}
                          className="bg-blue-600 text-white text-xs rounded-full px-6 py-3 hover:bg-blue-700 transition duration-200"
                        >
                          <i className="fas fa-download text-lg"></i> Download
                          Template
                        </button>
                      </div>

                      {/* File Upload dfgs  gdg*/}
                      <div className="flex flex-col items-center p-4 bg-gray-100 rounded-md">
                        <h5 className="font-semibold mb-3 text-gray-800">
                          Select a file to upload
                        </h5>

                        <p className="text-sm text-gray-600 mb-4">
                          # Do not change the file name or contents of the first
                          4 columns.
                          <br /># Do not change the name of the file. Do not
                          change the contents of first 4 columns in the
                          downloaded excelsheet.
                        </p>

                        <label className="bg-blue-600 md:w-[45%] overflow-hidden text-white rounded-full text-xs  px-6 py-3 hover:bg-blue-700 cursor-pointer transition duration-200 whitespace-nowrap">
                          <i className="fas fa-upload text-lg "></i>{" "}
                          {selectedFile
                            ? selectedFile.name.length > 20
                              ? `${selectedFile.name.substring(0, 10)}...`
                              : selectedFile.name
                            : "Choose File"}
                          <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Register New Students */}
                      <div className="flex flex-col items-center p-4 bg-gray-100 rounded-md">
                        <h5 className="font-semibold mb-3 text-gray-800">
                          Register New Students
                        </h5>
                        <p className="text-sm text-gray-600 mb-4">
                          # Click upload to register students.
                          <br /># Students will be registered in the
                          application. Their userid and password will be sent as
                          email at the email id's provided.
                        </p>
                        {/* <div className="text-xs  flex flex-col justify-around  ">
                          <span>
                            {errorMessage && (
                              <p style={{ color: "red" }}>{errorMessage}</p>
                            )}
                          </span>
                          <span className="mb-2">
                            {" "}
                            {errorMessageUrl && (
                              <a
                                href="#"
                                style={{ color: "red" }}
                                className="text-xs"
                                onClick={() => {
                                  const link = document.createElement("a");
                                  link.href = errorMessageUrl;
                                  link.setAttribute("download", "data.csv"); // Name the file as data.csv
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                }}
                              >
                                <span className="underline text-blue-500 hover:text-blue-800 mr-2">
                                  Download CSV to see errors.
                                </span>
                              </a>
                            )}
                          </span>
                        </div> */}
                        <div className="text-xs flex flex-col justify-around">
                          <span>
                            {errorMessage && (
                              <p style={{ color: "red" }}>{errorMessage}</p>
                            )}
                          </span>
                          <span className="mb-2">
                            {errorMessageUrl && (
                              <a
                                href="#"
                                style={{ color: "red" }}
                                className="text-xs"
                                onClick={(e) => {
                                  e.preventDefault(); // Prevent the default link behavior
                                  downloadCsv(errorMessageUrl); // Call the function to download the file
                                }}
                              >
                                <span className="underline text-blue-500 hover:text-blue-800 mr-2">
                                  Download CSV to see errors.
                                </span>
                              </a>
                            )}
                          </span>
                        </div>

                        <button
                          onClick={handleUpload}
                          className="bg-blue-600 text-white text-xs rounded-full px-6 py-3 hover:bg-blue-700 transition duration-200"
                          disabled={loading} // Disable button during loading
                        >
                          {" "}
                          <i className="fas fa-cloud-upload-alt text-lg"></i>{" "}
                          {loading ? "Uploading..." : "Upload"}
                        </button>

                        {uploadStatus && (
                          <p style={{ color: "green" }}>{uploadStatus}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-full bg-white shadow-md rounded-lg border border-gray-300 mx-auto mt-10 p-6">
                    <h2 className="text-center text-2xl font-semibold mb-8 text-blue-600">
                      Upload Student Data from Excel Sheet
                    </h2>

                    {/* <div className="w-full  grid grid-cols-1 md:grid-cols-3 gap-6 text-center"> */}
                    {/* Download Student List Template */}
                    <div className=" w-full md:w-[49%]  mx-auto flex justify-center flex-col md:flex-row gap-x-1 md:gap-x-4 ">
                      <div className="w-full  gap-x-3 md:justify-center justify-around  my-1 md:my-4 flex  md:flex-row  ">
                        <label
                          htmlFor="classSection"
                          className=" mr-2 pt-2 items-center text-center"
                        >
                          Class <span className="text-red-500">*</span>
                        </label>
                        <div className="w-[65%] md:w-[55%] ">
                          <Select
                            value={selectedClass}
                            onChange={handleClassSelect}
                            options={classOptions}
                            placeholder="Select "
                            isSearchable
                            isClearable
                            className="text-sm"
                          />
                          {nameError && (
                            <div className=" relative top-0.5 ml-1 text-danger text-xs">
                              {nameError}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={handleSearch}
                        type="button"
                        disabled={isSubmitting}
                        className="mr-0 md:mr-4 my-1 md:my-4 btn h-10  w-18 md:w-auto btn-primary "
                      >
                        {isSubmitting ? "Searching..." : "Search"}
                      </button>
                    </div>
                  </div>
                  // </div>
                )}
              </div>
            </div>
            {subjects.length > 0 && (
              <div className="w-full  mt-4">
                <div className="card mx-auto lg:w-full shadow-lg">
                  <div className="p-2 px-3 bg-gray-100 border-none flex justify-between items-center">
                    <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
                      Student List
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
                    <div className="h-96 lg:h-96 overflow-y-scroll lg:overflow-x-hidden w-full  md:w-[80%] mx-auto">
                      <table className="min-w-full leading-normal table-auto">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="px-2 w-full md:w-[10%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Sr.No
                            </th>

                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Student Name
                            </th>
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Class
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
                                key={subject.student_id}
                                className=" text-sm "
                              >
                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  {currentPage * pageSize + index + 1}
                                </td>

                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  {`${subject?.first_name ?? ""} ${
                                    subject?.mid_name
                                      ? subject.mid_name + " "
                                      : ""
                                  }${subject?.last_name ?? ""}`.trim()}
                                </td>

                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm text-nowrap">
                                  {`${subject?.get_class?.name ?? ""}${
                                    subject?.get_division?.name
                                      ? " " + subject.get_division.name
                                      : ""
                                  }`.trim()}
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
                                    onClick={() => handleDelete(subject)}
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
            )}
          </div>
        </div>
      </div>

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
                  Are you sure you want to delete this student{" "}
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
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title">Reset Password</h5>
                  <RxCross1
                    className="float-end relative mt-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                    onClick={handleCloseModal}
                  />
                </div>
                <div
                  className="relative mb-3 h-1 w-[97%] mx-auto bg-red-700"
                  style={{ backgroundColor: "#C03078" }}
                ></div>

                <div className="modal-body">
                  {/* User ID Input */}
                  <div className="relative mb-3 flex justify-center mx-4">
                    <label htmlFor="userId" className="w-1/2 mt-2">
                      User ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={30}
                      className="form-control shadow-md mb-2"
                      id="userId"
                      value={userIdset} // Prefill userId
                      onChange={handleUserIdChange}
                    />
                    {userIdError && (
                      <span className="text-danger text-xs">{userIdError}</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end p-3">
                  <button
                    type="button"
                    className="btn btn-primary px-3 mb-2"
                    onClick={handleSubmitResetPassword}
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
    </>
  );
}

export default NewStudentList;
