// // This is the 100% working
// import { useState, useEffect, useRef } from "react";
// import { IoSettingsSharp } from "react-icons/io5";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import ReactPaginate from "react-paginate";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "react-toastify/dist/ReactToastify.css";
// import { IoMdAdd } from "react-icons/io";
// import { CgAddR } from "react-icons/cg";
// import { FaRegSquarePlus } from "react-icons/fa6";
// import { RxCross1 } from "react-icons/rx";
// import AllotSubjectTab from "./AllotSubjectTab"; // Import the new component
// import ManageSubjectsTab from "./ManageSubjectsTab.jsx";
// import AllotTeachersForCLass from "./AllotTeachersForCLass.jsx";
// import AllotTeachersTab from "./AllotTeachersTab.jsx";
// function ManageSubjectList() {
//   const API_URL = import.meta.env.VITE_API_URL; // URL for host
//   // const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [classSection, setClassSection] = useState("");
//   const [activeTab, setActiveTab] = useState("Manage");
//   const [classes, setClasses] = useState([]);
//   const [classesforsubjectallot, setclassesforsubjectallot] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [currentSection, setCurrentSection] = useState(null);
//   const [newSectionName, setNewSectionName] = useState("");
//   const [newClassName, setNewClassName] = useState("");
//   const [newSection, setnewSectionName] = useState("");
//   const [newSubject, setnewSubjectnName] = useState("");
//   const [newclassnames, setnewclassnames] = useState("");
//   const [newTeacherAssign, setnewTeacherAssign] = useState("");
//   const [ClassNameDropdown, setClassNameDropdown] = useState("");
//   const [classId, setclassId] = useState("");
//   // This is hold the allot subjet api response
//   //   This is for the subject id in the dropdown
//   const [newDepartmentId, setNewDepartmentId] = useState("");
//   const [selectedDepartment, setSelectedDepartment] = useState("");
//   //   For the dropdown of Teachers name api
//   const [departments, setDepartments] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(0);
//   const [pageCount, setPageCount] = useState(0);
//   const [fieldErrors, setFieldErrors] = useState({}); // For field-specific errors
//   // validations state for unique name
//   const [nameAvailable, setNameAvailable] = useState(true);
//   //   variable to store the respone of the allot subject tab
//   const [allotSubjectTabData, setAllotSubjectTabData] = useState([]); //
//   // const [nameError, setNameError] = useState("");
//   //   for dropdown seletect
//   //   const [newDepartmentId, setNewDepartmentId] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const [countSN, setCountSN0] = useState(0);
//   //   for allot subject checkboxes
//   const [selectedDivisions, setSelectedDivisions] = useState([]);
//   const [selectedSubjects, setSelectedSubjects] = useState([]);
//   const [error, setError] = useState(null);
//   const [nameError, setNameError] = useState(null);

//   //   Sorting logic state

//   const pageSize = 10;
//   const handleInputChange = (e) => {
//     setNewDepartmentId(e.target.value);
//     setIsDropdownOpen(true); // Open the dropdown when typing
//   };

//   // const handleOptionSelect = (value) => {
//   //   console.log("45555555555", value);
//   //   setNewDepartmentId(value);
//   //   setTeacherId(value);
//   //   setIsDropdownOpen(false); // Close the dropdown when an option is selected
//   // };
//   const handleOptionSelect = (regId) => {
//     const selectedDept = departments.find((dept) => dept.reg_id === regId);
//     if (selectedDept) {
//       setNewDepartmentId(selectedDept.name);
//       setSelectedDepartment(regId);
//     }
//     setIsDropdownOpen(false);
//   };

//   const filteredDepartments = departments.filter((department) =>
//     department.name.toLowerCase().includes(newDepartmentId.toLowerCase())
//   );

//   const handleClickOutside = (event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setIsDropdownOpen(false); // Close the dropdown if clicked outside
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);
//   //   FOr serial number
//   const generateSerialNumbers = (data) => {
//     const sortedData = [...data].sort((a, b) => a.section_id - b.section_id); // Optional: sort based on section_id or any other criteria
//     return sortedData.map((item, index) => ({
//       ...item,
//       serialNumber: index + 1,
//     }));
//   };
//   const fetchClassNames = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(`${API_URL}/api/get_class_section`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (Array.isArray(response.data)) {
//         setClasses(response.data);
//         console.log("the name and section", response.data);
//       } else {
//         setError("Unexpected data format");
//       }
//     } catch (error) {
//       console.error("Error fetching class and section names:", error);
//       setError("Error fetching class and section names");
//     }
//   };
//   const fetchClassNamesForAllotSubject = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(`${API_URL}/api/getClassList`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (Array.isArray(response.data)) {
//         setclassesforsubjectallot(response.data);
//         console.log(
//           "this is the dropdown of the allot subject tab for class",
//           response.data
//         );
//       } else {
//         setError("Unexpected data format");
//       }
//     } catch (error) {
//       console.error("Error fetching class names:", error);
//       setError("Error fetching class names");
//     }
//   };
//   // THis is for the ALlotTeacherFOrACLaSS tAB FECTH class
//   //   This is the api for get teacher list in the manage tab edit
//   const fetchDepartments = async () => {
//     try {
//       const token = localStorage.getItem("authToken");

//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await axios.get(`${API_URL}/api/get_teacher_list`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         withCredentials: true,
//       });

//       setDepartments(response.data);
//       console.log(
//         "888888888888888888888888 this is the edit of get_teacher list in the subject allotement tab",
//         response.data
//       );
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   useEffect(() => {
//     fetchClassNames();
//     fetchDepartments();
//     fetchClassNamesForAllotSubject();
//   }, []);
//   // Listing tabs data for diffrente tabs
//   const handleSearch = async () => {
//     if (!classSection) {
//       setNameError("Please select the class.");
//       return;
//     }
//     try {
//       console.log(
//         "for this sectiong id in seaching inside subjectallotment",
//         classSection
//       );
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(`${API_URL}/api/get_subject_Alloted`, {
//         headers: { Authorization: `Bearer ${token}` },
//         // params: { section_id: classSection },
//         params: { section_id: classSection },
//       });
//       console.log(
//         "the response of the subjectallotment is *******",
//         response.data
//       );
//       if (response.data.length > 0) {
//         setSubjects(response.data);
//         setPageCount(Math.ceil(response.data.length / 10)); // Example pagination logic
//       } else {
//         setSubjects([]);
//         toast.error("No subjects found for the selected class and division.");
//       }
//     } catch (error) {
//       console.error("Error fetching subjects:", error);
//       setError("Error fetching subjects");
//     }
//   };
//   const handleSearchForsubjectAllot = async () => {
//     try {
//       console.log(
//         "for this sectiong id in seaching inside subjectallotment",
//         classId
//       );
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(
//         `${API_URL}/api/get_divisions_and_subjects/${classId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           // params: { section_id: classSection },
//         }
//       );
//       if (Array.isArray(response.data.subjectAllotments)) {
//         setAllotSubjectTabData(response.data.subjectAllotments);
//         console.log(
//           "***********the data is allotsubject tab",
//           allotSubjectTabData
//         );
//       } else {
//         console.log("the data formate", response.data.subjectAllotments);

//         setAllotSubjectTabData(response.data.subjectAllotments);
//         toast("Unexpected data format");
//       }
//       console.log("the data is allotsubjectjfdskf", allotSubjectTabData);
//     } catch (error) {
//       console.error("Error fetching subjects:", error);
//       setError("Error fetching subjects");
//     }
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//   };

//   //   Logic for ALlot subject tab
//   // Extract unique divisions
//   // Extract unique divisions with their IDs
//   // Extract unique divisions with their IDs using a Map
//   const divisionMap = new Map();
//   allotSubjectTabData.forEach((item) => {
//     if (item?.get_division?.name) {
//       divisionMap.set(item?.get_division?.name, item?.get_division?.section_id);
//     }
//   });
//   const uniqueDivisions = Array.from(divisionMap.entries()).map(
//     ([name, section_id]) => ({
//       name,
//       section_id,
//     })
//   );

//   console.log("Unique division data with IDs:", uniqueDivisions);

//   // Extract unique subjects with their IDs using a Map
//   const subjectMap = new Map();
//   allotSubjectTabData.forEach((item) => {
//     if (item?.get_subject?.name) {
//       subjectMap.set(item?.get_subject?.name, item?.sm_id);
//     }
//   });
//   const uniqueSubjects = Array.from(subjectMap.entries()).map(
//     ([name, subject_id]) => ({
//       name,
//       subject_id,
//     })
//   );

//   console.log("Unique subject data with IDs:", uniqueSubjects);
//   // Fetch the checked checkboxes according to the divisions
//   // const fetchSubjectDataForAllotSubjectTab = async (sectionId) => {
//   //   try {
//   //     console.log(
//   //       "for this sectiong id in seaching inside subjectallotment",
//   //       sectionId
//   //     );
//   //     const token = localStorage.getItem("authToken");
//   //     const response = await axios.get(
//   //       `${API_URL}/api/get_subjects/${sectionId}`,
//   //       {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //         // params: { section_id: classSection },
//   //       }
//   //     );
//   //     console.log(
//   //       "****|||*******the data is Subject tab",
//   //       response.data.subjects
//   //     );
//   //     // if (Array.isArray(response.data)) {
//   //     //   setAllotSubjectTabData(response.data.divisions);
//   //     //   console.log(
//   //     //     "***********the data is allotsubject tab",
//   //     //     allotSubjectTabData
//   //     //   );
//   //     // } else {
//   //     //   console.log("the data formate", response.data);

//   //     //   setAllotSubjectTabData(response.data.divisions);
//   //     //   toast("Unexpected data format");
//   //     // }
//   //     // console.log("the data is allotsubjectjfdskf", allotSubjectTabData);
//   //   } catch (error) {
//   //     console.error("Error fetching subjects:", error);
//   //     setError("Error fetching subjects");
//   //   }
//   // };
//   // Function to fetch subjects based on selected division
//   const fetchSubjectDataForAllotSubjectTab = async (divisionId) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(
//         `${API_URL}/api/get_subjects/${divisionId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       console.log("this is the subjectlist data", response.data.subjects);
//       const subjectIds = response.data.subjects.map((subject) => subject.sm_id);
//       setSelectedSubjects(subjectIds); // Update selected subjects based on API response
//       console.log(
//         "------->this is subjectlist checkboxes on the bases of division checkbox--->",
//         selectedSubjects
//       );
//     } catch (error) {
//       console.error("Error fetching subjects:", error);
//     }
//   };
//   // Handle division checkbox change
//   const handleDivisionChange = (event) => {
//     const sectionId = Number(event.target.value);
//     fetchSubjectDataForAllotSubjectTab(sectionId);
//     // const value = event.target.value;
//     console.log("the event=====", sectionId);
//     setSelectedDivisions((prevSelected) =>
//       prevSelected.includes(sectionId)
//         ? prevSelected.filter((id) => id !== sectionId)
//         : [...prevSelected, sectionId]
//     );
//   };

//   // Handle subject checkbox change
//   const handleSubjectChange = (event) => {
//     const subjectId = Number(event.target.value);
//     console.log("the event=====", subjectId);
//     setSelectedSubjects((prevSelected) =>
//       prevSelected.includes(subjectId)
//         ? prevSelected.filter((id) => id !== subjectId)
//         : [...prevSelected, subjectId]
//     );
//   };

//   const handleChangeClassSectionForAllotSubjectTab = (e) => {
//     setClassNameDropdown(e.target.value);
//     setclassId(e.target.value);
//     // handleSearchForsubjectAllot();
//   };
//   useEffect(() => {
//     handleSearchForsubjectAllot();
//   }, [ClassNameDropdown]);

//   const handleChangeClassSection = (e) => {
//     setNameError(null); // Reset error when user selects a class

//     setClassSection(e.target.value);
//     // handleSearchForsubjectAllot();
//   };

//   const handlePageClick = (data) => {
//     setCurrentPage(data.selected);
//     // Handle page change logic
//   };

//   const handleEdit = (section) => {
//     setCurrentSection(section);
//     // console.log("the currecne t section", currentSection);

//     console.log("fdsfsdsd handleEdit", section);
//     setnewclassnames(section?.get_class?.name);
//     setnewSectionName(section?.get_division?.name);
//     setnewSubjectnName(section?.get_subject?.name);
//     // It's used for the dropdown of the tachers
//     // setnewTeacherAssign()
//     setShowEditModal(true);
//   };

//   const handleDelete = (sectionId) => {
//     console.log("inside delete of subjectallotmenbt____", sectionId);
//     console.log("inside delete of subjectallotmenbt", classes);
//     const classToDelete = subjects.find((cls) => cls.subject_id === sectionId);
//     // setCurrentClass(classToDelete);
//     setCurrentSection({ classToDelete });
//     console.log("the currecne t section", currentSection);

//     setShowDeleteModal(true);
//   };

//   const handleSubmitEdit = async () => {
//     // Handle edit submission logic
//     console.log(
//       "inside the edit model of the subjectallotment",
//       currentSection.subject_id
//     );
//     console.log(
//       "inside the edit model of the subjectallotment",
//       currentSection
//     );

//     try {
//       const token = localStorage.getItem("authToken");

//       if (!token || !currentSection || !currentSection.subject_id) {
//         throw new Error("Subject ID is missing");
//       }
//       if (!nameAvailable) {
//         return;
//       }
//       console.log("the Subject ID***", currentSection.subject_id);
//       console.log("the teacher ID***", selectedDepartment);

//       await axios.put(
//         `${API_URL}/api/update_subject_Alloted/${currentSection.subject_id}`,
//         { teacher_id: selectedDepartment },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           withCredentials: true,
//         }
//       );
//       setSubjects([]);
//       handleSearch();
//       // fetchClassNames();
//       handleCloseModal();
//       toast.success("Subject Record updated successfully!");
//     } catch (error) {
//       if (error.response && error.response.data) {
//         toast.error(
//           `Error updating subject Record: ${error.response.data.message}`
//         );
//       } else {
//         toast.error(`Error updating subject Record: ${error.message}`);
//       }
//       console.error("Error editing subject Record:", error);
//     }
//     setShowEditModal(false);
//   };

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
//         !currentSection?.classToDelete?.subject_id
//       ) {
//         throw new Error("Subject ID is missing");
//       }

//       await axios.delete(
//         `${API_URL}/api/delete_subject_Alloted/${currentSection?.classToDelete?.subject_id}`,
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
//       setSubjects([]);
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

//   const handleCloseModal = () => {
//     setShowEditModal(false);
//     setShowDeleteModal(false);
//   };
//   // console.log("the name", subjects);
//   const filteredSections = subjects.filter((section) =>
//     section?.get_subject?.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   const displayedSections = filteredSections.slice(
//     currentPage * pageSize,
//     (currentPage + 1) * pageSize
//   );
//   // handle allot subject close model
//   const handleAllotSubjectCloseModal = () => {
//     setAllotSubjectTabData([]);
//     // setClassSection("");
//   };
//   // Post the allot subject api

//   const handleSubmitAllotment = async () => {
//     // Validate required fields
//     if (
//       ClassNameDropdown &&
//       selectedDivisions.length > 0 &&
//       selectedSubjects.length > 0
//     ) {
//       try {
//         const token = localStorage.getItem("authToken");

//         // Check if token exists
//         if (!token) {
//           throw new Error("No authentication token found");
//         }
//         console.log(
//           "[",
//           ClassNameDropdown,
//           "]",
//           selectedDivisions,
//           selectedSubjects
//         );
//         const response = await axios.post(
//           `${API_URL}/api/store_subject_allotment`,
//           {
//             class_id: ClassNameDropdown,
//             section_ids: selectedDivisions,
//             subject_ids: selectedSubjects,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json", // Ensure content type is specified
//             },
//           }
//         );

//         // Handle successful response
//         if (response.status === 201) {
//           toast.success("Subject allotment details updated successfully");
//           // toast.success("Subject allotment updated successfully!");

//           setTimeout(() => {
//             setAllotSubjectTabData([]); // Clear the form or reset state
//             setActiveTab("Manage"); // Set the active tab to "Manage" after 2 seconds
//           }, 3000); // Wait for 2 seconds
//         } else {
//           toast.error("Unexpected response from the server");
//         }
//       } catch (error) {
//         // Handle errors
//         if (error.response && error.response.data) {
//           toast.error(
//             `Error storing subject allotment: ${error.response.data.message}`
//           );
//         } else {
//           toast.error(`Error storing subject allotment: ${error.message}`);
//         }
//         console.error("Error storing subject allotment:", error);
//       }
//     } else {
//       toast.error("Please select a class, divisions, and subjects");
//     }
//   };

//   //   sorting logic
//   const sortedSubjects = () => {
//     const { key, direction } = sortConfig;
//     const sortedData = [...subjects].sort((a, b) => {
//       if (a[key] < b[key]) {
//         return direction === "asc" ? -1 : 1;
//       }
//       if (a[key] > b[key]) {
//         return direction === "asc" ? 1 : -1;
//       }
//       return 0;
//     });
//     return sortedData;
//   };

//   return (
//     <>
//       <ToastContainer />
//       <div className="md:mx-auto md:w-3/4 p-4 bg-white ">
//         <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
//           Subject Allotment
//         </h3>
//         <hr className="relative -top-3" />

//         <ul className="grid grid-cols-2 gap-x-10 relative -left-6 md:left-0 md:flex md:flex-row relative -top-4">
//           {/* Tab Navigation */}
//           {[
//             "Manage",
//             "AllotSubject",
//             "AllotTeachersForClass",
//             "AllotTeachers",
//           ].map((tab) => (
//             <li
//               key={tab}
//               className={`md:-ml-7 shadow-md ${
//                 activeTab === tab ? "text-blue-500 font-bold" : ""
//               }`}
//             >
//               <button
//                 onClick={() => handleTabChange(tab)}
//                 className="px-2 md:px-4 py-1 hover:bg-gray-200 text-[1em] md:text-sm text-nowrap"
//               >
//                 {tab.replace(/([A-Z])/g, " $1")}
//               </button>
//             </li>
//           ))}
//         </ul>

//         <div className="bg-white  rounded-md -mt-5">
//           {activeTab === "Manage" && (
//             <ManageSubjectsTab
//               classSection={classSection}
//               nameError={nameError}
//               handleChangeClassSection={handleChangeClassSection}
//               handleSearch={handleSearch}
//               classes={classes}
//               subjects={subjects}
//               displayedSections={displayedSections}
//               setSearchTerm={setSearchTerm}
//               handleEdit={handleEdit}
//               handleDelete={handleDelete}
//               pageCount={pageCount}
//               handlePageClick={handlePageClick}
//             />
//             // <div>
//             //   <div className="mb-4">
//             //     {/* <h2
//             //       className="text-gray-400 mt-1 text-[1.2em] md:text-sm text-nowrap"
//             //       style={{ color: "#D22B73" }}
//             //     >
//             //       <IoSettingsSharp className="inline mr-1 -mt-1" />
//             //       Manage Subjects
//             //     </h2> */}
//             //     <div className="md:w-[80%] mx-auto">
//             //       <div className="form-group flex justify-center gap-x-1 md:gap-x-6">
//             //         <label
//             //           htmlFor="classSection"
//             //           className="w-1/4 pt-2 items-center text-center"
//             //         >
//             //           Select Class <span className="text-red-500">*</span>
//             //         </label>
//             //         <select
//             //           id="classSection"
//             //           className="border w-[50%] h-10 md:h-auto rounded-md px-3 py-2 md:w-full mr-2"
//             //           value={classSection}
//             //           onChange={handleChangeClassSection}
//             //         >
//             //           <option value="">Select </option>
//             //           {classes.length === 0 ? (
//             //             <option value="">No classes available</option>
//             //           ) : (
//             //             classes.map((cls) => (
//             //               <option key={cls.section_id} value={cls.section_id}>
//             //                 {`${cls?.get_class?.name} ${cls?.name}`}
//             //               </option>
//             //             ))
//             //           )}
//             //         </select>
//             //         <button
//             //           onClick={handleSearch}
//             //           type="button"
//             //           className="btn h-10 md:h-auto w-18 md:w-auto btn-primary"
//             //         >
//             //           Search
//             //         </button>
//             //       </div>
//             //     </div>
//             //   </div>

//             //   {
//             //     subjects.length > 0 && (
//             //       <div className="container mt-4">
//             //         <div className="card mx-auto lg:w-full shadow-lg">
//             //           <div className="card-header flex justify-between items-center">
//             //             <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
//             //               Manage Subjects List
//             //             </h3>
//             //             <div className="w-1/2  md:w-fit mr-1 ">
//             //               <input
//             //                 type="text"
//             //                 className="form-control"
//             //                 placeholder="Search "
//             //                 onChange={(e) => setSearchTerm(e.target.value)}
//             //               />
//             //             </div>
//             //           </div>

//             //           <div className="card-body  w-full">
//             //             <div className="h-96 lg:h-96 overflow-y-scroll lg:overflow-x-hidden">
//             //               <table className="min-w-full leading-normal table-auto">
//             //                 <thead>
//             //                   <tr className="bg-gray-100">
//             //                     <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//             //                       S.No
//             //                     </th>
//             //                     <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//             //                       Class
//             //                     </th>
//             //                     <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//             //                       Division
//             //                     </th>
//             //                     <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//             //                       Subject
//             //                     </th>
//             //                     <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//             //                       Teacher
//             //                     </th>
//             //                     <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//             //                       Edit
//             //                     </th>
//             //                     <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//             //                       Delete
//             //                     </th>
//             //                   </tr>
//             //                 </thead>
//             //                 <tbody>
//             //                   {displayedSections.map((subject, index) => (
//             //                     <>
//             //                       <tr
//             //                         key={subject.section_id}
//             //                         className="text-gray-700 text-sm font-light"
//             //                       >
//             //                         <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
//             //                           {index + 1}
//             //                         </td>
//             //                         <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
//             //                           {subject?.get_class?.name}
//             //                         </td>
//             //                         <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
//             //                           {subject?.get_division?.name}
//             //                         </td>
//             //                         <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
//             //                           {subject?.get_subject?.name}
//             //                         </td>
//             //                         <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
//             //                           {subject?.get_teacher?.name}
//             //                         </td>

//             //                         <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
//             //                           <button
//             //                             onClick={() => handleEdit(subject)}
//             //                             className="text-blue-600 hover:text-blue-800 hover:bg-transparent "
//             //                           >
//             //                             <FontAwesomeIcon icon={faEdit} />
//             //                           </button>
//             //                         </td>
//             //                         <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
//             //                           <button
//             //                             onClick={() =>
//             //                               handleDelete(subject.section_id)
//             //                             }
//             //                             className="text-red-600 hover:text-red-800 hover:bg-transparent "
//             //                           >
//             //                             <FontAwesomeIcon icon={faTrash} />
//             //                           </button>
//             //                         </td>
//             //                       </tr>
//             //                     </>
//             //                   ))}
//             //                 </tbody>
//             //               </table>
//             //             </div>
//             //             <div className=" flex justify-center  pt-2 -mb-3">
//             //               <ReactPaginate
//             //                 previousLabel={"Previous"}
//             //                 nextLabel={"Next"}
//             //                 breakLabel={"..."}
//             //                 pageCount={pageCount}
//             //                 onPageChange={handlePageClick}
//             //                 containerClassName={"pagination"}
//             //                 pageClassName={"page-item"}
//             //                 pageLinkClassName={"page-link"}
//             //                 previousClassName={"page-item"}
//             //                 previousLinkClassName={"page-link"}
//             //                 nextClassName={"page-item"}
//             //                 nextLinkClassName={"page-link"}
//             //                 breakClassName={"page-item"}
//             //                 breakLinkClassName={"page-link"}
//             //                 activeClassName={"active"}
//             //               />
//             //             </div>
//             //           </div>
//             //         </div>
//             //       </div>
//             //     )
//             //     //   : (
//             //     //     // <div className="p-4">No subjects found</div>
//             //     //     <button className="bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 w-full">
//             //     //       Select a Class to See Subjects
//             //     //     </button>
//             //     //   )
//             //   }
//             // </div>
//           )}

//           {/* Other tabs content */}

//           {activeTab === "AllotSubject" && (
//             // <AllotSubjectTab
//             //   ClassNameDropdown={ClassNameDropdown}
//             //   handleChangeClassSectionForAllotSubjectTab={
//             //     handleChangeClassSectionForAllotSubjectTab
//             //   }
//             //   classesforsubjectallot={classesforsubjectallot}
//             //   allotSubjectTabData={allotSubjectTabData}
//             //   handleDivisionChange={handleDivisionChange}
//             //   selectedDivisions={selectedDivisions}
//             //   uniqueDivisions={uniqueDivisions}
//             //   handleSubjectChange={handleSubjectChange}
//             //   selectedSubjects={selectedSubjects}
//             //   uniqueSubjects={uniqueSubjects}
//             //   handleSubmitAllotment={handleSubmitAllotment}
//             //   handleAllotSubjectCloseModal={handleAllotSubjectCloseModal}
//             // />
//             <div>
//               <ToastContainer />

//               <div className="container mb-4">
//                 <div className="card-header flex justify-between items-center">
//                   {/* <h2
//                     className="text-gray-400 mt-1 text-[1.2em] md:text-sm text-nowrap"
//                     style={{ color: "#D22B73" }}
//                   >
//                     <FaRegSquarePlus className="inline mr-1 -mt-1 " />
//                     Allot Subject
//                   </h2> */}
//                 </div>
//                 <div className="w-full mx-auto">
//                   <div className="form-group flex justify-center gap-x-1 md:gap-x-6">
//                     <label
//                       htmlFor="classSection"
//                       className="w-1/4 pt-2 items-center text-center"
//                     >
//                       Select class <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       id="classSection"
//                       className="border md:w-[50%] h-10 md:h-auto rounded-md px-3 py-2 w-full mr-2"
//                       value={ClassNameDropdown}
//                       onChange={handleChangeClassSectionForAllotSubjectTab}
//                     >
//                       <option value="">Select </option>
//                       {classesforsubjectallot.length === 0 ? (
//                         <option value="">No classes available</option>
//                       ) : (
//                         classesforsubjectallot.map((cls) => (
//                           <option key={cls.classId} value={cls.class_id}>
//                             {` ${cls?.name}`}
//                           </option>
//                         ))
//                       )}
//                     </select>
//                   </div>
//                   {allotSubjectTabData.length > 0 && (
//                     <div className="container mt-4">
//                       <div className="card mx-auto relative left-1 lg:w-full shadow-lg ">
//                         <div className="card-header flex justify-between items-center">
//                           <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
//                             Allot Subjects
//                           </h3>
//                           <RxCross1
//                             className="float-end relative top-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
//                             type="button"
//                             // className="btn-close text-red-600"
//                             onClick={handleAllotSubjectCloseModal}
//                           />
//                         </div>
//                         <div className="card-body  w-full">
//                           <div className="  lg:overflow-x-hidden">
//                             <div className="mb-4 flex gap-x-4">
//                               <h5 className="px-2 mt-2 lg:px-3 py-2 text-[1em] text-gray-700">
//                                 Select divisions{" "}
//                                 <span className="text-red-500">*</span>
//                               </h5>
//                               {uniqueDivisions.length > 0 && (
//                                 <>
//                                   {uniqueDivisions.map((division) => (
//                                     <div
//                                       key={division.section_id}
//                                       className="pt-3"
//                                     >
//                                       {console.log("division is", division)}
//                                       <label>
//                                         <input
//                                           type="checkbox"
//                                           className="mr-0.5 shadow-lg"
//                                           value={
//                                             division.section_id || division.name
//                                           }
//                                           checked={
//                                             selectedDivisions.includes(
//                                               division.name
//                                             ) ||
//                                             selectedDivisions.includes(
//                                               division.section_id
//                                             )
//                                           }
//                                           onChange={handleDivisionChange}
//                                         />
//                                         <span className="font-semibold text-gray-600">
//                                           {division.name}
//                                         </span>
//                                       </label>
//                                     </div>
//                                   ))}
//                                 </>
//                               )}
//                             </div>

//                             <div className="flex">
//                               <h5 className="px-2 relative -top-2 lg:px-3 py-2 text-[1em] text-gray-700">
//                                 Select subjects{" "}
//                                 <span className="text-red-500">*</span>
//                               </h5>
//                               <div className="mb-4 grid grid-cols-5 mx-4 w-[75%]">
//                                 {uniqueSubjects.map((subject) => (
//                                   <div key={subject.subject_id}>
//                                     <label>
//                                       <input
//                                         type="checkbox"
//                                         className="mr-0.5 shadow-lg"
//                                         value={subject.subject_id}
//                                         checked={selectedSubjects.includes(
//                                           subject.subject_id
//                                         )}
//                                         onChange={handleSubjectChange}
//                                       />
//                                       <span className="font-semibold text-gray-600">
//                                         {subject.name}
//                                       </span>
//                                     </label>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className=" flex justify-end p-3">
//                           <button
//                             type="button"
//                             className="btn btn-primary px-3 mb-2 "
//                             onClick={handleSubmitAllotment}
//                           >
//                             Save
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* {activeTab === "AllotSubject" && (
//             <div>
//               <div className="mb-4">
//                 <h2
//                   className="text-gray-400 mt-1 text-[1.2em] md:text-sm text-nowrap"
//                   style={{ color: "#D22B73" }}
//                 >
//                   <FaRegSquarePlus className="inline mr-1 -mt-1 " />
//                   Allot Subjects
//                 </h2>
//                 <div className="md:w-[80%] mx-auto">
//                   <div className="form-group flex justify-center gap-x-1 md:gap-x-6">
//                     <label
//                       htmlFor="classSection"
//                       className="w-1/4 pt-2 items-center text-center"
//                     >
//                       Select Class <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       id="classSection"
//                       className="border w-[50%] h-10 md:h-auto rounded-md px-3 py-2 md:w-full mr-2"
//                       value={ClassNameDropdown}
//                       onChange={handleChangeClassSectionForAllotSubjectTab}
//                     >
//                       <option value="">Select Class</option>
//                       {classesforsubjectallot.length === 0 ? (
//                         <option value="">No classes available</option>
//                       ) : (
//                         classesforsubjectallot.map((cls) => (
//                           <option key={cls.classId} value={cls.class_id}>
//                             {` ${cls?.name}`}
//                           </option>
//                         ))
//                       )}
//                     </select>
//                   </div>
//                 </div>
//               </div>
//               {allotSubjectTabData.length > 0 && <h1> omsdof </h1>}
//             </div>
//           )} */}
//           {activeTab === "AllotTeachersForClass" && (
//             <div>
//               {/* classSection, handleChangeClassSection, classes, */}
//               <AllotTeachersForCLass />
//             </div>
//           )}
//           {activeTab === "AllotTeachers" && (
//             <div>
//               <AllotTeachersTab />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
//           <div className="modal show " style={{ display: "block" }}>
//             <div className="modal-dialog modal-dialog-centered">
//               <div className="modal-content">
//                 <div className="flex justify-between p-3">
//                   <h5 className="modal-title">Edit Allotment</h5>
//                   <RxCross1
//                     className="float-end relative  mt-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
//                     type="button"
//                     // className="btn-close text-red-600"
//                     onClick={handleCloseModal}
//                   />
//                 </div>
//                 <div
//                   className=" relative  mb-3 h-1 w-[97%] mx-auto bg-red-700"
//                   style={{
//                     backgroundColor: "#C03078",
//                   }}
//                 ></div>
//                 <div className="modal-body">
//                   {/* Modal content for editing */}
//                   <div className=" relative mb-3 flex justify-center  mx-4 gap-x-7">
//                     <label htmlFor="newSectionName" className="w-1/2 mt-2">
//                       Class :{" "}
//                     </label>
//                     <div className="font-bold form-control  shadow-md  mb-2">
//                       {newclassnames}
//                     </div>
//                     {/* <div className="font-semibol w-1/2 mt-1 relative right-1/4  shadow-md mb-2">
//                       {newclassnames}
//                     </div> */}
//                     {/* <input
//                       type="text"
//                       className="form-control"
//                       id="newSectionName"
//                       value={newClassName}
//                       readOnly
//                       onChange={(e) => setNewSectionName(e.target.value)}
//                     /> */}
//                   </div>
//                   <div className=" relative mb-3 flex justify-center  mx-4 gap-x-7">
//                     <label htmlFor="newSectionName" className="w-1/2 mt-2">
//                       Section:{" "}
//                     </label>
//                     <span className="font-semibold form-control shadow-md mb-2">
//                       {newSection}
//                     </span>
//                     {/* <input
//                       type="text"
//                       className="form-control"
//                       id="newSectionName"
//                       value={newSectionName}
//                       readOnly
//                       onChange={(e) => setNewSectionName(e.target.value)}
//                     /> */}
//                   </div>
//                   <div className=" relative  flex justify-start  mx-4 gap-x-7">
//                     <label htmlFor="newSectionName" className="w-1/2 mt-2 ">
//                       Subject:{" "}
//                     </label>{" "}
//                     <span className="font-semibold form-control shadow-md mb-2 ">
//                       {newSubject}
//                     </span>
//                     {/* <input
//                       type="text"
//                       className="form-control"
//                       id="newSectionName"
//                       value={newSectionName}
//                       readOnly
//                       onChange={(e) => setNewSectionName(e.target.value)}
//                     /> */}
//                   </div>
//                   <div className=" modal-body">
//                     <div
//                       ref={dropdownRef}
//                       className=" relative mb-3 flex justify-center mx-2 gap-4 "
//                     >
//                       <label
//                         htmlFor="newDepartmentId"
//                         className="w-1/2 mt-2 text-nowrap "
//                       >
//                         Teacher assigned <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         id="newDepartmentId"
//                         value={newDepartmentId}
//                         onChange={handleInputChange}
//                         onFocus={() => setIsDropdownOpen(true)} // Open dropdown on input focus
//                         // placeholder="Search or select"
//                         className="form-control shadow-md "

//                         // className="border w-[50%] h-10 rounded-md px-3 py-2 md:w-full mr-2 shadow-md"
//                       />

//                       {/* {isDropdownOpen && (
//                         <select
//                           size={10}
//                           className="  absolute -top-5 left-[44%]  w-[50%] text-xs md:text-sm p-1 px-1 md:px-4 md:absolute md:top-[80%] md:left-[36%] md:w-[65%] border rounded-md mt-1 bg-white z-10 max-h-48 overflow-auto"
//                           onChange={(e) => handleOptionSelect(e.target.value)}
//                           onBlur={() => setIsDropdownOpen(false)} // Close dropdown on blur
//                           value={newDepartmentId}
//                         >
//                           {departments
//                             .filter((department) =>
//                               department.name
//                                 .toLowerCase()
//                                 .includes(newDepartmentId.toLowerCase())
//                             )
//                             .map((department) => (
//                               <option
//                                 key={department.reg_id}
//                                 value={department.department_id}
//                               >
//                                 {department.name}
//                               </option>
//                             ))}
//                         </select>
//                       )} */}
//                       {isDropdownOpen && (
//                         <div className="  absolute -top-5 left-[44%]  w-[50%] text-xs md:text-sm p-1 px-1 md:px-4 md:absolute md:top-[80%] md:left-[36%] md:w-[65%] border rounded-md mt-1 bg-white z-10 max-h-48 overflow-auto">
//                           {/* // <div className="absolute mt-1 w-full border rounded-md bg-white z-10 max-h-48 overflow-auto"> */}
//                           {filteredDepartments.length === 0 && (
//                             <div className="p-2 text-gray-500">
//                               No departments found
//                             </div>
//                           )}
//                           {filteredDepartments.map((department) => (
//                             <div
//                               key={department.reg_id}
//                               className="p-2 cursor-pointer hover:bg-blue-600 hover:text-white"
//                               onClick={() =>
//                                 handleOptionSelect(department.reg_id)
//                               }
//                             >
//                               {department.name}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 <div className=" flex justify-end p-3">
//                   <button
//                     type="button"
//                     className="btn btn-primary px-3 mb-2"
//                     onClick={handleSubmitEdit}
//                   >
//                     Update
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

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
//                   Are you sure you want to delete this subject
//                   {currentSection?.get_subject?.name}?
//                 </div>
//                 <div className=" flex justify-end p-3">
//                   <button
//                     type="button"
//                     className="btn btn-danger px-3 mb-2"
//                     onClick={handleSubmitDelete}
//                   >
//                     Delete
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

// export default ManageSubjectList;

// // This is the 100% working

// // This is the 100% working
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";

import { RxCross1 } from "react-icons/rx";

import AllotTeachersForCLass from "./AllotTeachersForCLass.jsx";
import AllotTeachersTab from "./AllotTeachersTab.jsx";
import Select from "react-select";
import Loader from "../../common/LoaderFinal/LoaderStyle.jsx";
function ManageSubjectList() {
  const API_URL = import.meta.env.VITE_API_URL; // URL for host
  // const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [classSection, setClassSection] = useState("");
  const [activeTab, setActiveTab] = useState("Manage");
  const [classes, setClasses] = useState([]);
  const [classesforsubjectallot, setclassesforsubjectallot] = useState([]);
  const [subjects, setSubjects] = useState([]);
  // for allot subject tab
  const [subjectsForAllotSubject, setSubjectsForAllotSubject] = useState([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [currestSubjectNameForDelete, setCurrestSubjectNameForDelete] =
    useState("");
  const [newSectionName, setNewSectionName] = useState("");
  const [newClassName, setNewClassName] = useState("");
  const [newSection, setnewSectionName] = useState("");
  const [newSubject, setnewSubjectnName] = useState("");
  const [newclassnames, setnewclassnames] = useState("");
  const [teacherIdIs, setteacherIdIs] = useState();
  const [teacherNameIs, setTeacherNameIs] = useState("");
  const [newTeacherAssign, setnewTeacherAssign] = useState("");
  const [ClassNameDropdown, setClassNameDropdown] = useState("");
  const [classId, setclassId] = useState("");
  // This is hold the allot subjet api response
  const [classIdForManage, setclassIdForManage] = useState("");
  //   This is for the subject id in the dropdown
  const [newDepartmentId, setNewDepartmentId] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  //   For the dropdown of Teachers name api
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [fieldErrors, setFieldErrors] = useState({}); // For field-specific errors
  // validations state for unique name
  const [nameAvailable, setNameAvailable] = useState(true);
  //   variable to store the respone of the allot subject tab
  const [allotSubjectTabData, setAllotSubjectTabData] = useState([]); //
  // const [nameError, setNameError] = useState("");
  //   for dropdown seletect
  //   const [newDepartmentId, setNewDepartmentId] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [countSN, setCountSN0] = useState(0);
  //   for allot subject checkboxes
  const [selectedDivisions, setSelectedDivisions] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [error, setError] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [division, setDivisions] = useState([]);
  // errors messages for allot subject tab
  const [classError, setClassError] = useState("");
  const [divisionError, setDivisionError] = useState("");
  const [subjectError, setSubjectError] = useState("");
  // for react-search of manage tab teacher Edit and select class
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const handleTeacherSelect = (selectedOption) => {
    setSelectedTeacher(selectedOption);

    setNewDepartmentId(selectedOption.value); // Assuming value is the teacher's ID
  };
  console.log("setSelectedTeacher before", selectedTeacher);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClassSelect = (selectedOption) => {
    setNameError("");
    setSelectedClass(selectedOption);
    setclassIdForManage(selectedOption ? selectedOption.value : null); // Assuming value is the class ID
  };

  const teacherOptions = departments.map((dept) => ({
    value: dept.reg_id,
    label: dept.name,
  }));
  console.log("teacherOptions", teacherOptions);
  const classOptions = classes.map((cls) => ({
    value: cls.section_id,
    label: `${cls?.get_class?.name}  ${cls.name}`,
  }));

  //   Sorting logic state

  const pageSize = 10;
  const handleInputChange = (e) => {
    setNewDepartmentId(e.target.value);
    setIsDropdownOpen(true); // Open the dropdown when typing
  };

  // const handleOptionSelect = (value) => {
  //   console.log("45555555555", value);
  //   setNewDepartmentId(value);
  //   setTeacherId(value);
  //   setIsDropdownOpen(false); // Close the dropdown when an option is selected
  // };
  // const handleOptionSelect = (regId) => {
  //   const selectedDept = departments.find((dept) => dept.reg_id === regId);
  //   if (selectedDept) {
  //     setNewDepartmentId(selectedDept.name);
  //     setSelectedDepartment(regId);
  //   }
  //   setIsDropdownOpen(false);
  // };

  // const filteredDepartments = departments.filter((department) =>
  //   department.name.toLowerCase().includes(newDepartmentId.toLowerCase())
  // );

  // const handleClickOutside = (event) => {
  //   if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //     setIsDropdownOpen(false); // Close the dropdown if clicked outside
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);
  //   FOr serial number
  const generateSerialNumbers = (data) => {
    const sortedData = [...data].sort((a, b) => a.section_id - b.section_id); // Optional: sort based on section_id or any other criteria
    return sortedData.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
  };
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
  // THis is for the ALlotTeacherFOrACLaSS tAB FECTH class
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
    fetchClassNamesForAllotSubject();
  }, []);
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
        "for this section id in searching inside subject allotment",
        classIdForManage
      );

      const token = localStorage.getItem("authToken");

      // Clear the subjects state before making the request
      setSubjects([]);

      const response = await axios.get(`${API_URL}/api/get_subject_Alloted`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { section_id: classIdForManage },
      });

      console.log("The response of the subject allotment is: ", response.data);

      if (response.data.length > 0) {
        // After clearing the state, update with new data
        setSubjects(response.data);

        // Logging after state update
        console.log("Updated subjects data", response.data);

        setPageCount(Math.ceil(response.data.length / 10)); // Example pagination logic
      } else {
        setSubjects([]);
        toast.error("No subjects found for the selected class and division.");
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setError("Error fetching subjects");
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
    }
  };

  // const handleSearchForsubjectAllot = async () => {
  //   try {
  //     console.log(
  //       "for this sectiong id in seaching inside subjectallotment",
  //       classId
  //     );
  //     const token = localStorage.getItem("authToken");
  //     const response = await axios.get(
  //       `${API_URL}/api/get_divisions_and_subjects/${classId}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //         // params: { section_id: classSection },
  //       }
  //     );
  //     if (Array.isArray(response.data.subjectAllotments)) {
  //       setAllotSubjectTabData(response.data.subjectAllotments);
  //       console.log(
  //         "***********the data is allotsubject tab",
  //         allotSubjectTabData
  //       );
  //     } else {
  //       console.log("the data formate", response.data.subjectAllotments);

  //       setAllotSubjectTabData(response.data.subjectAllotments);
  //       toast("Unexpected data format");
  //     }
  //     console.log("the data is allotsubjectjfdskf", allotSubjectTabData);
  //   } catch (error) {
  //     console.error("Error fetching subjects:", error);
  //     setError("Error fetching subjects");
  //   }
  // };

  const handleSearchForsubjectAllot = async () => {
    if (!classId) {
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/get_divisions_and_subjects/${classId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data && response.data.divisions && response.data.subjects) {
        setDivisions(response.data.divisions);
        setSubjectsForAllotSubject(response.data.subjects);
        console.log(
          "this is get for api get_divisions_and_subjects ",
          subjectsForAllotSubject
        );
        const formattedAllotments = response.data.divisions.map((division) => ({
          section_id: division.section_id,
          name: division.name,
          subjects: response.data.subjects,
        }));
        setAllotSubjectTabData(formattedAllotments);
        console.log("formatted Allotments", formattedAllotments);
      } else {
        toast.error("Unexpected data format");
      }
    } catch (error) {
      toast.error(
        "Failed to fetch data for Allot Subjected tab. Please try again."
      );
    }
  };
  const handleTabChange = (tab) => {
    setActiveTab(tab); // Update the active tab state

    // Call handleSearch only if the tab is "Manage"
    if (tab === "Manage") {
      handleSearch();
    }
  };

  //   Logic for ALlot subject tab
  // Extract unique divisions
  // Extract unique divisions with their IDs
  // Extract unique divisions with their IDs using a Map
  // const divisionMap = new Map();
  // allotSubjectTabData.forEach((item) => {
  //   if (item?.get_division?.name) {
  //     divisionMap.set(item?.get_division?.name, item?.get_division?.section_id);
  //   }
  // });
  // const uniqueDivisions = Array.from(divisionMap.entries()).map(
  //   ([name, section_id]) => ({
  //     name,
  //     section_id,
  //   })
  // );

  // console.log("Unique division data with IDs:", uniqueDivisions);

  // Extract unique subjects with their IDs using a Map
  // const subjectMap = new Map();
  // allotSubjectTabData.forEach((item) => {
  //   if (item?.get_subject?.name) {
  //     subjectMap.set(item?.get_subject?.name, item?.sm_id);
  //   }
  // });
  // const uniqueSubjects = Array.from(subjectMap.entries()).map(
  //   ([name, subject_id]) => ({
  //     name,
  //     subject_id,
  //   })
  // );

  // console.log("Unique subject data with IDs:", uniqueSubjects);

  // Function to fetch subjects based on selected division
  // Function to fetch subjects based on selected divisions
  const fetchSubjectDataForAllotSubjectTab = async (divisionIds) => {
    try {
      const token = localStorage.getItem("authToken");
      const params = new URLSearchParams();
      divisionIds.forEach((id) => params.append("section_id[]", id));

      const response = await axios.get(
        `${API_URL}/api/get_presubjects/${classId}?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("getSUbjects data from preselected1", response.data.subjects);
      const subjectIds = response.data.subjects.map((subject) => subject.sm_id);
      setSelectedSubjects(subjectIds);
      console.log("getSUbjects data from preselected2", selectedSubjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  // Handle division checkbox change
  // Handle division checkbox change
  const handleDivisionChange = (divisionId) => {
    let updatedDivisions;
    setDivisionError("");
    if (selectedDivisions.includes(divisionId)) {
      updatedDivisions = selectedDivisions.filter((id) => id !== divisionId);
    } else {
      updatedDivisions = [...selectedDivisions, divisionId];
    }
    setSelectedDivisions(updatedDivisions);

    // Fetch and update subject checkboxes based on selected divisions
    if (updatedDivisions.length > 0) {
      fetchSubjectDataForAllotSubjectTab(updatedDivisions);
    } else {
      setSelectedSubjects([]);
    }
  };
  // const handleClassChange = (e) => {
  //   const selectedClassId = e.target.value;
  //   setclassId(selectedClassId);
  //   setSelectedDivisions([]);
  //   setSelectedSubjects([]);
  //   setDivisions([]);
  //   handleSearchForsubjectAllot(); // Fetch data based on selected class
  // };
  // const handleFormSubmit = async () => {
  //   // Add your form submission logic here

  //   // Clear form after successful submission
  //   setClassSection("");
  //   setClassNameDropdown("");
  //   setclassId("");
  //   setSelectedDivisions([]);
  //   setSelectedSubjects([]);
  //   setDivisions([]);
  // };

  // Handle subject checkbox change
  const handleSubjectChange = (subjectid) => {
    const subjectId = Number(subjectid);
    setSubjectError("");
    console.log("the event=====", subjectId);
    setSelectedSubjects((prevSelected) =>
      prevSelected.includes(subjectId)
        ? prevSelected.filter((id) => id !== subjectId)
        : [...prevSelected, subjectId]
    );
  };

  const handleChangeClassSectionForAllotSubjectTab = (e) => {
    const selectedClassId = e.target.value;
    console.log("dfsjfds", selectedClassId);
    setclassId(selectedClassId);
    setSelectedDivisions([]);
    setSelectedSubjects([]);
    setDivisions([]);
    // handleSearchForsubjectAllot(); // Fetch data based on selected classsetClassNameDropdown(e.target.value);
    // setclassId(e.target.value);
    // handleSearchForsubjectAllot();
  };
  useEffect(() => {
    handleSearchForsubjectAllot();
  }, [classId]);

  const handleChangeClassSection = (e) => {
    setNameError(null); // Reset error when user selects a class

    setClassSection(e.target.value);
    // handleSearchForsubjectAllot();
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    // Handle page change logic
  };

  const handleEdit = (section) => {
    setCurrentSection(section);
    // console.log("the currecne t section", currentSection);

    console.log("fdsfsdsd handleEdit", section);
    setnewclassnames(section?.get_class?.name);
    setnewSectionName(section?.get_division?.name);
    setnewSubjectnName(section?.get_subject?.name);
    setTeacherNameIs(section?.get_teacher?.name);
    setteacherIdIs(section?.get_teacher?.teacher_id);
    console.log("teacerId and name is", teacherIdIs, teacherNameIs);
    // It's used for the dropdown of the tachers
    // setnewTeacherAssign()

    console.log("sectionsis for teacher", section);

    if (section?.get_teacher?.teacher_id && section?.get_teacher?.name) {
      setSelectedTeacher({
        value: section?.get_teacher?.teacher_id,
        label: section?.get_teacher?.name,
      });
    } else {
      setSelectedTeacher(null); // Handle cases where teacher is not assigned
    }
    console.log("setSelectedTeacher after is----->***", selectedTeacher);
    // setSelectedTeacher(selectedOption);
    setShowEditModal(true);
  };

  const handleDelete = (sectionId) => {
    console.log("inside delete of subjectallotmenbt____", sectionId);
    console.log("inside delete of subjectallotmenbt", classes);
    const classToDelete = subjects.find((cls) => cls.subject_id === sectionId);
    // setCurrentClass(classToDelete);
    setCurrentSection(classToDelete);
    console.log("the currecne t section", currentSection);
    setCurrestSubjectNameForDelete(
      currentSection?.classToDelete?.get_subject?.name
    );
    console.log(
      "cureendtsungjeg",
      currentSection?.classToDelete?.get_subject?.name
    );
    console.log("currestSubjectNameForDelete", currestSubjectNameForDelete);
    setShowDeleteModal(true);
  };

  const handleSubmitEdit = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    console.log(
      "inside the edit model of the subjectallotment",
      currentSection.subject_id
    );
    console.log(
      "inside the edit model of the subjectallotment",
      currentSection
    );

    try {
      const token = localStorage.getItem("authToken");

      if (!token || !currentSection || !currentSection.subject_id) {
        throw new Error("Subject ID is missing");
      }
      if (!nameAvailable) {
        setIsSubmitting(false);
        return;
      }

      console.log("the Subject ID***", currentSection.subject_id);
      console.log("the teacher ID***", selectedDepartment);

      await axios.put(
        `${API_URL}/api/update_subject_Alloted/${currentSection.subject_id}`,
        { teacher_id: newDepartmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Subject Record updated successfully!");
      handleSearch();
      handleCloseModal();
      // setSubjects([]);
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(
          `Error updating subject Record: ${error.response.data.message}`
        );
      } else {
        toast.error(`Error updating subject Record: ${error.message}`);
      }
      console.error("Error editing subject Record:", error);
    } finally {
      setIsSubmitting(false);
      setShowEditModal(false);
    }
  };

  const handleSubmitDelete = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    // Handle delete submission logic
    try {
      const token = localStorage.getItem("authToken");
      console.log(
        "the currecnt section inside the delte___",
        currentSection?.classToDelete?.subject_id
      );
      console.log("the classes inside the delete", classes);
      console.log(
        "the current section insde the handlesbmitdelete",
        currentSection
      );
      if (!token || !currentSection || !currentSection?.subject_id) {
        throw new Error("Subject ID is missing");
      }

      await axios.delete(
        `${API_URL}/api/delete_subject_Alloted/${currentSection?.subject_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // fetchClassNames();
      handleSearch();

      setShowDeleteModal(false);
      // setSubjects([]);
      toast.success("subject deleted successfully!");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error(`Error deleting subject: ${error.message}`);
      }
      console.error("Error deleting subject:", error);
      // setError(error.message);
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
      setShowDeleteModal(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedTeacher(null);
    setCurrentSection(null);
    setShowEditModal(false);
    setShowDeleteModal(false);
  };
  // console.log("the name", subjects);
  // const filteredSections = subjects.filter((section) =>
  //   section?.get_subject?.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  const filteredSections = subjects.filter((section) => {
    // Convert the teacher's name and subject's name to lowercase for case-insensitive comparison
    const teacherName = section?.get_teacher?.name?.toLowerCase() || "";
    const subjectName = section?.get_subject?.name?.toLowerCase() || "";

    // Check if the search term is present in either the teacher's name or the subject's name
    return (
      teacherName.includes(searchTerm.toLowerCase()) ||
      subjectName.includes(searchTerm.toLowerCase())
    );
  });
  const displayedSections = filteredSections.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );
  // handle allot subject close model
  const handleAllotSubjectCloseModal = () => {
    setAllotSubjectTabData([]);
    // setClassSection("");
  };
  // Post the allot subject api
  // it's workilng properly but validations messages not present
  // const handleSubmitAllotment = async () => {
  //   // Validate required fields
  //   console.log('psot start')
  //   if (
  //     ClassNameDropdown &&
  //     selectedDivisions.length > 0 &&
  //     selectedSubjects.length > 0
  //   )
  //   {
  //     try {
  //       const token = localStorage.getItem("authToken");

  //       // Check if token exists
  //       if (!token) {
  //         throw new Error("No authentication token found");
  //       }
  //       console.log(
  //         "[",
  //         ClassNameDropdown,
  //         "]",
  //         selectedDivisions,
  //         selectedSubjects
  //       );
  //       const response = await axios.post(
  //         `${API_URL}/api/store_subject_allotment`,
  //         {
  //           class_id: ClassNameDropdown,
  //           section_ids: selectedDivisions,
  //           subject_ids: selectedSubjects,
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "application/json", // Ensure content type is specified
  //           },
  //         }
  //       );

  //       // Handle successful response
  //       if (response.status === 201) {
  //         toast.success("Subject allotment details updated successfully");
  //         // toast.success("Subject allotment updated successfully!");

  //         setTimeout(() => {
  //           setAllotSubjectTabData([]); // Clear the form or reset state
  //           setActiveTab("Manage"); // Set the active tab to "Manage" after 2 seconds
  //         }, 3000); // Wait for 2 seconds
  //       } else {
  //         toast.error("Unexpected response from the server");
  //       }
  //     } catch (error) {
  //       // Handle errors
  //       if (error.response && error.response.data) {
  //         toast.error(
  //           `Error storing subject allotment: ${error.response.data.message}`
  //         );
  //       } else {
  //         toast.error(`Error storing subject allotment: ${error.message}`);
  //       }
  //       console.error("Error storing subject allotment:", error);
  //     }
  //   } else {
  //     toast.error("Please select a class, divisions, and subjects");
  //   }
  // };
  const handleSubmitAllotment = async () => {
    console.log("post start fdgh");
    setLoading(true);
    // Validate required fields
    console.log("ClassNameDropdown", classId);
    let hasError = false;
    if (!classId) {
      setClassError("Please select a class");
      setLoading(false);

      hasError = true;

      // return; // Exit early if validation fails
    }
    console.log("selectedDivisions", selectedDivisions);
    if (selectedDivisions.length === 0) {
      setDivisionError("Please select at least one division");
      console.log("division not select");
      hasError = true;

      // return; // Exit early if validation fails
    }
    console.log("selectedSubjects", selectedSubjects);

    if (selectedSubjects.length === 0) {
      setSubjectError("Please select at least one subject");
      console.log("subject not select");

      hasError = true;

      // return; // Exit early if validation fails
    }
    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      // Check if token exists
      if (!token) {
        throw new Error("No authentication token found");
      }
      console.log(
        "This is the post formate of the data of allot subject ",
        "Class_id",
        ClassNameDropdown,
        "Division_selected",
        selectedDivisions,
        "Selected_subjects",
        selectedSubjects
      );
      // console.log(
      //   "[",
      //   ClassNameDropdown,
      //   "]",
      //   selectedDivisions,
      //   selectedSubjects
      // );
      console.log("fdhsh post api allot subject");
      const response = await axios.post(
        `${API_URL}/api/store_subject_allotment`,
        {
          class_id: classId,
          section_ids: selectedDivisions,
          subject_ids: selectedSubjects,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Ensure content type is specified
          },
        }
      );

      // Handle successful response
      if (response.status === 201) {
        toast.success("Subject allotment details updated successfully");
        setTimeout(() => {
          setClassSection("");
          setClassNameDropdown("");
          setclassId("");
          setSelectedDivisions([]);
          setSelectedSubjects([]);
          setDivisions([]);
          setAllotSubjectTabData([]); // Clear the form or reset state
          setActiveTab("Manage"); // Set the active tab to "Manage" after 2 seconds
        }, 500);
      } else {
        toast.error("Unexpected response from the server");
      }
    } catch (error) {
      // Handle errors
      if (error.response && error.response.data) {
        toast.error(
          `Error storing subject allotment: ${error.response.data.message}`
        );
      } else {
        toast.error(`Error storing subject allotment: ${error.message}`);
      }
      console.error("Error storing subject allotment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <ToastContainer /> */}
      <div className="md:mx-auto md:w-3/4 p-4 bg-white mt-4 ">
        <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
          Subject Allotment
        </h3>
        <div
          className=" relative  mb-8   h-1  mx-auto bg-red-700"
          style={{
            backgroundColor: "#C03078",
          }}
        ></div>
        {/* <hr className="relative -top-3" /> */}

        <ul className="grid grid-cols-2 gap-x-10 relative -left-6 md:left-0 md:flex md:flex-row relative -top-4">
          {/* Tab Navigation */}
          {[
            "Manage",
            "AllotSubject",
            "AllotTeachersForClass",
            "AllotTeachers",
          ].map((tab) => (
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
            // <ManageSubjectsTab
            //   classSection={classSection}
            //   nameError={nameError}
            //   handleChangeClassSection={handleChangeClassSection}
            //   handleSearch={handleSearch}
            //   classes={classes}
            //   subjects={subjects}
            //   displayedSections={displayedSections}
            //   setSearchTerm={setSearchTerm}
            //   handleEdit={handleEdit}
            //   handleDelete={handleDelete}
            //   pageCount={pageCount}
            //   handlePageClick={handlePageClick}
            // />
            <div>
              <ToastContainer />
              <div className="mb-4">
                <div className="md:w-[80%] mx-auto">
                  <div className="form-group mt-6 md:mt-10 w-full md:w-[80%] flex justify-start gap-x-1 md:gap-x-6">
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
                        <div className=" relative top-0.5 left-3  ml-1 text-danger text-xs">
                          {nameError}
                        </div>
                      )}{" "}
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
                      <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
                        Manage Subjects List
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
                              {/* <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                Division
                              </th> */}
                              <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                Subject
                              </th>
                              <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
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
                            {isSubmitting ? (
                              <div className=" absolute left-[4%] w-[100%]  text-center flex justify-center items-center mt-14">
                                <div className=" text-center text-xl text-blue-700">
                                  Please wait while data is loading...
                                </div>
                              </div>
                            ) : displayedSections.length ? (
                              displayedSections.map((subject, index) => (
                                <tr
                                  key={subject?.subject_id}
                                  className=" text-sm "
                                >
                                  <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                    {currentPage * pageSize + index + 1}
                                  </td>
                                  <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                    {`${subject?.get_class?.name} ${subject?.get_division?.name}`}
                                  </td>
                                  {/* <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  {subject?.get_division?.name}
                                </td> */}
                                  <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                    {subject?.get_subject?.name}
                                  </td>
                                  <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                    {subject?.get_teacher?.name}
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
                                        handleDelete(subject?.subject_id)
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

          {/* Other tabs content */}

          {activeTab === "AllotSubject" && (
            <div>
              <ToastContainer />

              <div className="container mb-4">
                <div className="card-header flex justify-between items-center"></div>
                <div className="w-full mx-auto">
                  <div className="form-group  w-full  md:w-[80%] mt-2 flex justify-start gap-x-1 ml-0 md:ml-10 md:gap-x-4">
                    <label
                      htmlFor="classSection"
                      className="w-1/4 pt-2 items-center text-center"
                    >
                      Select class <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="classSection"
                      className="border md:w-[35%] h-10 md:h-auto rounded-md px-3 py-2 w-full mr-2"
                      value={classId}
                      onChange={handleChangeClassSectionForAllotSubjectTab}
                    >
                      <option value="">Select </option>
                      {classesforsubjectallot.length === 0 ? (
                        <option value="">No classes available</option>
                      ) : (
                        classesforsubjectallot.map((cls) => (
                          <option key={cls.class_id} value={cls.class_id}>
                            {` ${cls?.name}`}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  {allotSubjectTabData.length > 0 && (
                    <div className="container mt-4">
                      <div className="card mx-auto relative left-1 lg:w-full shadow-lg ">
                        <div className="p-2 px-3 bg-gray-100 border-none flex justify-between items-center">
                          <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
                            Allot Subjects
                          </h3>
                          <RxCross1
                            className="float-end relative  right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                            type="button"
                            // className="btn-close text-red-600"
                            onClick={handleAllotSubjectCloseModal}
                          />
                        </div>
                        <div
                          className=" relative  -top-2 mb-3 h-1 w-[97%] mx-auto bg-red-700"
                          style={{
                            backgroundColor: "#C03078",
                          }}
                        ></div>

                        {loading ? (
                          <tr>
                            <div className=" absolute inset-0 py-8 h flex items-center justify-center bg-gray-50  z-10">
                              <Loader /> {/* Replace with your loader */}
                            </div>
                          </tr>
                        ) : (
                          <>
                            <div className="card-body  w-full">
                              <div className=" relative lg:overflow-x-hidden">
                                <div className=" relative mb-4 flex gap-x-4">
                                  <h5 className="px-2 mt-2 lg:px-3 py-2 text-[1em] text-gray-700">
                                    Select divisions{" "}
                                    <span className="text-red-500">*</span>
                                  </h5>
                                  {division.map((div) => (
                                    <div key={div.section_id} className="pt-3">
                                      <input
                                        type="checkbox"
                                        className="mr-0.5 shadow-lg "
                                        checked={selectedDivisions.includes(
                                          div.section_id
                                        )}
                                        onChange={() =>
                                          handleDivisionChange(div.section_id)
                                        }
                                      />
                                      <span className="  font-semibold text-gray-600 ">
                                        {div.name}
                                      </span>
                                    </div>
                                  ))}

                                  {divisionError && (
                                    <p className="  md:absolute md:top-9 md:left-[17%] text-red-500 text-xs">
                                      {divisionError}
                                    </p>
                                  )}
                                </div>

                                <div className="flex">
                                  <h5 className="px-2 relative -top-2 lg:px-3 py-2 text-[1em] text-gray-700">
                                    Select subjects{" "}
                                    <span className="text-red-500">*</span>
                                  </h5>
                                  {/* <div className="relative gap-x-10 top-2 border-2 border-black  grid grid-cols-3  w-full"> */}

                                  <div className=" grid grid-cols-3 mx-4 w-[78%]">
                                    {subjectsForAllotSubject.map((subject) => (
                                      <div key={subject.sm_id}>
                                        <label>
                                          <input
                                            type="checkbox"
                                            className="mr-0.5 shadow-lg"
                                            value={subject.sm_id}
                                            checked={selectedSubjects.includes(
                                              subject.sm_id
                                            )}
                                            onChange={() =>
                                              handleSubjectChange(subject.sm_id)
                                            }
                                            disabled={!selectedDivisions.length} // Disable if no division is selected
                                          />
                                          <span className="font-semibold text-gray-600">
                                            {subject.name}
                                          </span>
                                        </label>
                                      </div>
                                    ))}
                                    {/* {subjects.map((subject) => (
                                  <div key={subject.sm_id}>
                                    <input
                                      type="checkbox"
                                      className="mr-0.5 shadow-lg"
                                      value={subject.sm_id}
                                      checked={selectedSubjects.includes(
                                        subject.sm_id
                                      )}
                                      onChange={() =>
                                        handleSubjectChange(subject.sm_id)
                                      }
                                      disabled={!selectedDivisions.length} // Disable if no division is selected
                                    />
                                    {subject.name}
                                  </div>
                                ))} */}
                                  </div>
                                </div>
                                {subjectError && (
                                  <p className="absolute  left-[18%]  text-red-500 text-xs ">
                                    {subjectError}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className=" flex justify-end p-3">
                              <button
                                type="button"
                                className="btn btn-primary px-3 mb-2 "
                                onClick={handleSubmitAllotment}
                              >
                                Save
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "AllotTeachersForClass" && (
            <div>
              {/* classSection, handleChangeClassSection, classes, */}
              <AllotTeachersForCLass />
            </div>
          )}
          {activeTab === "AllotTeachers" && (
            <div>
              <AllotTeachersTab />
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal show " style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title">Edit Allotment</h5>
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
                  {/* Modal content for editing */}
                  <div className=" relative mb-3 flex justify-center  mx-4 gap-x-7">
                    <label htmlFor="newSectionName" className="w-1/2 mt-2">
                      Class :{" "}
                    </label>
                    <div className="font-bold form-control  shadow-md  mb-2">
                      {newclassnames}
                    </div>
                  </div>
                  <div className=" relative mb-3 flex justify-center  mx-4 gap-x-7">
                    <label htmlFor="newSectionName" className="w-1/2 mt-2">
                      Section:{" "}
                    </label>
                    <span className="font-semibold form-control shadow-md mb-2">
                      {newSection}
                    </span>
                  </div>
                  <div className=" relative  flex justify-start  mx-4 gap-x-7">
                    <label htmlFor="newSectionName" className="w-1/2 mt-2 ">
                      Subject:{" "}
                    </label>{" "}
                    <span className="font-semibold form-control shadow-md mb-2 ">
                      {newSubject}
                    </span>
                  </div>
                  <div className=" modal-body">
                    <div
                      ref={dropdownRef}
                      className=" relative mb-3 flex justify-center mx-2 gap-4 "
                    >
                      <label
                        htmlFor="newDepartmentId"
                        className="w-1/2 mt-2 text-nowrap "
                      >
                        Teacher assigned <span className="text-red-500">*</span>
                      </label>
                      <Select
                        className="w-full text-sm shadow-md"
                        value={selectedTeacher} // Set the selected value
                        onChange={handleTeacherSelect}
                        options={teacherOptions} // Teacher options
                        placeholder="Select"
                        isSearchable
                        isClearable
                      />
                      {/* <input
                        type="text"
                        id="newDepartmentId"
                        value={newDepartmentId}
                        onChange={handleInputChange}
                        onFocus={() => setIsDropdownOpen(true)} // Open dropdown on input focus
                        // placeholder="Search or select"
                        className="form-control shadow-md "

                        // className="border w-[50%] h-10 rounded-md px-3 py-2 md:w-full mr-2 shadow-md"
                      />

                      {isDropdownOpen && (
                        <div className="  absolute -top-5 left-[44%]  w-[50%] text-xs md:text-sm p-1 px-1 md:px-4 md:absolute md:top-[80%] md:left-[36%] md:w-[65%] border rounded-md mt-1 bg-white z-10 max-h-48 overflow-auto">
                          {/* // <div className="absolute mt-1 w-full border rounded-md bg-white z-10 max-h-48 overflow-auto"> */}
                      {/* {filteredDepartments.length === 0 && (
                            <div className="p-2 text-gray-500">
                              No departments found
                            </div>
                          )}
                          {filteredDepartments.map((department) => (
                            <div
                              key={department.reg_id}
                              className="p-2 cursor-pointer hover:bg-blue-600 hover:text-white"
                              onClick={() =>
                                handleOptionSelect(department.reg_id)
                              }
                            >
                              {department.name}
                            </div>
                          ))}
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
                <div className=" flex justify-end p-3">
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
                  {currentSection?.get_subject?.name}?
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

export default ManageSubjectList;
