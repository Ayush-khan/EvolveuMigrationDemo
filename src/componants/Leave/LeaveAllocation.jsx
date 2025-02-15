// // with unique name validations on server api complete for testing.
// import { useEffect, useState } from "react";
// import axios from "axios";
// import ReactPaginate from "react-paginate";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { RxCross1 } from "react-icons/rx";

// // The is the divisionlist module
// function LeaveAllocation() {
//   const API_URL = import.meta.env.VITE_API_URL; // URL for host
//   const [sections, setSections] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [currentSection, setCurrentSection] = useState(null);
//   const [newSectionName, setNewSectionName] = useState(""); //
//   const [searchTerm, setSearchTerm] = useState("");
//   const [className, setClassName] = useState(""); //
//   const [currentPage, setCurrentPage] = useState(0);
//   const [pageCount, setPageCount] = useState(0);
//   const [newDepartmentId, setNewDepartmentId] = useState(""); //
//   const [fieldErrors, setFieldErrors] = useState({}); // For field-specific errors
//   const [nameError, setNameError] = useState("");
//   const [nameAvailable, setNameAvailable] = useState(true);
//   const [roleId, setRoleId] = useState("");
//   const [classes, setClasses] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [staffNames, setStaffNames] = useState([]);
//   const [newStaffName, setNewStaffName] = useState("");
//   const [leaveType, setLeaveType] = useState([]);
//   const [newLeaveAllocated, setNewLeaveAllocated] = useState("");
//   const [newLeaveType, setNewLeaveType] = useState("");

//   const fetchStaffNames = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(`${API_URL}/api/get_allstaff`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log(" all staff names", response.data);

//       if (Array.isArray(response.data.data)) {
//         setStaffNames(response.data.data);
//       } else {
//         setError("Unexpected data format.");
//       }
//     } catch (error) {
//       toast.error("Error fetching Staff Names.", error);
//     }
//   };

//   const fetchLeaveType = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("authToken");

//       if (!token) {
//         throw new Error("No Authentication token found.");
//       }

//       const response = await axios.get(`${API_URL}/api/get_leavetype`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         withCredentials: true,
//       });
//       console.log("leave type", response.data);
//       if (Array.isArray(response.data.data)) {
//         setLeaveType(response.data.data);
//       } else {
//         setError("Unexpected data format.");
//       }
//     } catch (error) {
//       setError(error.message);
//       toast.error("Error to fetching leave type");
//       console.log("Error to fetching error.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStaffNames();
//     fetchLeaveType();
//   }, []);

//   const pageSize = 10;

//   const fetchSections = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("authToken");

//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await axios.get(
//         `${API_URL}/api/get_leaveallocationall`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           withCredentials: true,
//         }
//       );

//       console.log("API Response:", response.data);

//       if (Array.isArray(response.data.data)) {
//         setSections(response.data.data);
//         setPageCount(Math.ceil(response.data.data.length / pageSize));
//       } else {
//         throw new Error("Response data is not an array.");
//       }
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDataRoleId = async () => {
//     const token = localStorage.getItem("authToken");

//     if (!token) {
//       console.error("No authentication token found");
//       return;
//     }

//     try {
//       // Fetch session data
//       const sessionResponse = await axios.get(`${API_URL}/api/sessionData`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setRoleId(sessionResponse?.data?.user.role_id); // Store role_id
//       // setRoleId("A"); // Store role_id
//       console.log("roleIDis:", roleId);
//       // Fetch academic year data
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchSections();
//     fetchDataRoleId();
//   }, []);

//   const filteredSections = sections.filter((section) => {
//     const searchLower = searchTerm.toLowerCase();
//     return (
//       section.teachername.toLowerCase().includes(searchLower) || // Filter by teacher name
//       section.leavename.toLowerCase().includes(searchLower) // Filter by leave type
//     );
//   });

//   const displayedSections = filteredSections.slice(
//     currentPage * pageSize,
//     (currentPage + 1) * pageSize
//   );

//   const validateSectionName = (name, leave_type_id, leaves_allocated) => {
//     const errors = {};

//     // Validate Staff Name
//     if (!name || name.trim() === "") { //name.trim()
//       errors.name = "Please enter a valid Staff name.";
//       // toast.error("Name is required.")
//     }

//     // Validate Leave Type ID
//     if (!leave_type_id || isNaN(Number(leave_type_id))) {
//       errors.leave_type_id = "Please select a valid Leave Type.";
//       // toast.error("Leave type is required.")
//     }

//     // Validate Leaves Allocated
//     if (!leaves_allocated || isNaN(Number(leaves_allocated))) {
//       errors.leaves_allocated =
//         "Please enter a valid number of allocated leaves.";
//       // toast.error("Leave allocated is requied.")
//     } else if (Number(leaves_allocated) <= 0) {
//       errors.leaves_allocated = "Allocated leaves must be greater than zero.";
//       // toast.error("Leave allocation greater than 0.")
//     }

//     // if(!name || !leave_type_id || !leaves_allocated)
//     // {
//     //   toast.error("All field required")
//     // }
//     return errors;
//   };

//   const handlePageClick = (data) => {
//     setCurrentPage(data.selected);
//   };

//   const handleEdit = (section) => {
//     setCurrentSection(section);
//     setNewStaffName(section.staff_id);
//     setLeaveType(section.leave_type_id);
//     console.log("set staf leave",section.leave_type_id)
//     setNewLeaveAllocated(section.leaves_allocated);
//     setShowEditModal(true);
//   };

//   const handleAdd = () => {
//     setShowAddModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowAddModal(false);
//     setShowEditModal(false);
//     setShowDeleteModal(false);
//     setCurrentSection(null);
//     setFieldErrors({});
//     setNameError("");
//   };

//   const handleSubmitAdd = async () => {
//     if (isSubmitting) return;
//     setIsSubmitting(true);
//     const validationErrors = validateSectionName(
//       newStaffName,
//       newLeaveType,
//       newLeaveAllocated
//     );
//     if (Object.keys(validationErrors).length > 0) {
//       setFieldErrors(validationErrors);
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         console.error("No authentication token found");
//         return;
//       }

//       // console.log("Token:", token);

//       const checkLeave = await axios.post(
//         `${API_URL}/api/save_leaveallocated`,
//         {
//           staff_id: newStaffName,
//           leave_type_id: newLeaveType,
//           leaves_allocated: newLeaveAllocated,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }
//       );
//       const { data } = checkLeave;

//       // console.log("API Response Data:", data);

//       if (!data.success) {
//         console.error("Leave Allocation for the staff already done..", data);
//         setNameError("Leave Allocation for the staff already done.");
//         toast.error("Leave Allocation for the staff already done.");
//         setNameAvailable(false);
//         setIsSubmitting(false);
//         return;
//       }

//       console.log("Data saved successfully.", data);
//       setNameError("");
//       toast.success("Leave added successfully!");
//       setNameAvailable(true);

//       fetchSections(); // Fetch updated data
//       handleCloseModal(); // Close the modal
//     } catch (error) {
//       console.error("Error adding Leave Allocation:", error);
//       toast.error("Server error. Please try again later.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSubmitEdit = async () => {
//     if (isSubmitting) return; // Prevent re-submitting
//     setIsSubmitting(true);

//     const validationErrors = validateSectionName(
//       newStaffName,
//       newLeaveType,
//       newLeaveAllocated
//     );
//     if (Object.keys(validationErrors).length > 0) {
//       setFieldErrors(validationErrors);
//       setIsSubmitting(false); // Reset submitting state if validation fails
//       return;
//     }

//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token || !currentSection || !currentSection.staff_id) {
//         throw new Error("No authentication token or section ID found");
//       }

//       await axios.put(
//         `${API_URL}/api/update_leaveallocation/${currentSection.staff_id}/${currentSection.leave_type_id}`,
//         {
//           staff_id: newStaffName,
//           leave_type_id: newLeaveType,
//           leaves_allocated: newLeaveAllocated,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }
//       );

//       fetchSections();
//       handleCloseModal();
//       toast.success("Staff Leave updated successfully!");
//     } catch (error) {
//       console.error("Error editing Staff Leave:", error);
//       console.log("erroris", error.response);
//       if (error.response && error.response.data.status === 422) {
//         const errors = error.response.data.errors;
//         console.log("error", errors);
//         // Handle name field error
//         if (errors.name) {
//           setFieldErrors((prev) => ({
//             ...prev,
//             name: errors.name, // Show the first error message for the name field
//           }));
//           errors.staff_id.forEach((err) => toast.error(err)); // Show all errors in toast
//         }

//         // Handle other field errors if necessary
//         // Add similar handling for other fields if included in the backend error response
//       } else {
//         // Handle other errors
//         toast.error("Server error. Please try again later.");
//       }
//     } finally {
//       setIsSubmitting(false); // Re-enable the button after the operation
//     }
//   };

//   const handleDelete = (staffId, leaveTypeId) => {
//     const sectionToDelete = sections.find(
//       (sec) => sec.staff_id === staffId && sec.leave_type_id === leaveTypeId
//     );

//     if (!sectionToDelete) {
//       toast.error("Unable to find the leave allocation to delete.");
//       return;
//     }

//     setCurrentSection(sectionToDelete); // Store the section to be deleted
//     setShowDeleteModal(true); // Show the confirmation modal
//   };

//   const handleSubmitDelete = async () => {
//     if (isSubmitting) return; // Prevent re-submitting
//     setIsSubmitting(true);
//     try {
//       const token = localStorage.getItem("authToken");
//       const academicYr = localStorage.getItem("academicYear");

//       if (!token || !currentSection || !currentSection.staff_id) {
//         throw new Error("Staff ID is missing");
//       }

//       const response = await axios.delete(
//         `${API_URL}/api/delete_leaveallocation/${currentSection.staff_id}/${currentSection.leave_type_id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "X-Academic-Year": academicYr,
//           },
//           withCredentials: true,
//         }
//       );

//       if (response.data.success) {
//         fetchSections();
//         setShowDeleteModal(false);
//         setCurrentSection(null);
//         toast.success("Leave deleted successfully!");
//       } else {
//         toast.error(
//           response.data.message || "Failed to delete leave allocation."
//         );
//       }
//     } catch (error) {
//       console.error("Error deleting Leave:", error);
//       if (error.response && error.response.data && error.response.data.error) {
//         toast.error(error.response.data.error);
//       } else {
//         toast.error("Server error. Please try again later.");
//       }
//     } finally {
//       setIsSubmitting(false); // Re-enable the button after the operation
//       setShowDeleteModal(false);
//     }
//   };

//   const handleChangeStaffName = (e) => {
//     const { value } = e.target;
//     setNameError(""); // Clear any previous name error
//     setNewStaffName(value); // Update staff name state
//     setFieldErrors((prevErrors) => ({
//       ...prevErrors,
//       name: validateSectionName(value, newLeaveType, newLeaveAllocated).name, // Validate name when staff name changes
//     }));
//   };

//   const handleChangeLeaveType = (e) => {
//     const { value } = e.target;
//     setNewLeaveType(value); // Update leave type state
//     console.log("set leave type",setNewLeaveType)
//     setFieldErrors((prevErrors) => ({
//       ...prevErrors,
//       leave_type_id: validateSectionName(newStaffName, value, newLeaveAllocated)
//         .leave_type_id, // Validate leave type when it changes
//     }));
//   };

//   const handleChangeLeaveAllocated = (e) => {
//     const { value } = e.target;
//     setNewLeaveAllocated(value); // Update allocated leave state
//     setFieldErrors((prevErrors) => ({
//       ...prevErrors,
//       leaves_allocated: validateSectionName(newStaffName, newLeaveType, value)
//         .leaves_allocated, // Validate allocated leaves when it changes
//     }));
//   };

//   return (
//     <>
//       <ToastContainer />

//       <div className="container  mt-4">
//         <div className="card mx-auto lg:w-[90%] shadow-lg">
//           <div className="p-2 px-3 bg-gray-100 flex justify-between items-center">
//             <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
//               Leave Allocation
//             </h3>{" "}
//             <div className="box-border flex md:gap-x-2 justify-end md:h-10">
//               <div className=" w-1/2 md:w-fit mr-1">
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Search "
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//               <button
//                 className="btn btn-primary btn-sm md:h-9 text-xs md:text-sm"
//                 onClick={handleAdd}
//               >
//                 <FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }} />
//                 Add
//               </button>
//             </div>
//           </div>
//           <div
//             className=" relative w-[97%]   mb-3 h-1  mx-auto bg-red-700"
//             style={{
//               backgroundColor: "#C03078",
//             }}
//           ></div>

//           <div className="card-body w-full">
//             <div className="h-96 lg:h-96 w-full md:w-[90%] mx-auto  overflow-y-scroll lg:overflow-x-hidden ">
//               <div className="bg-white  rounded-lg shadow-xs ">
//                 <table className="min-w-full leading-normal table-auto ">
//                   <thead>
//                     <tr className="bg-gray-200">
//                       <th className="px-2 w-full md:w-[8%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//                         Sr.No
//                       </th>
//                       <th className=" -px-2  w-full md:w-[30%] text-center py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//                         Staff Name
//                       </th>
//                       <th className="px-2 text-center md:w-[18%] lg:px-5 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//                         Leave Type
//                       </th>
//                       <th className="px-2 w-full md:w-[18%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//                         Leave Allocated
//                       </th>
//                       <th className="px-2 w-full md:w-[18%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//                         Balance Leave
//                       </th>
//                       <th className="px-2 w-full md:w-[14%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//                         Edit
//                       </th>
//                       <th className="px-2 w-full md:w-[14%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//                         Delete
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {loading ? (
//                       <tr>
//                         <td
//                           colSpan="6"
//                           className="text-center text-blue-700 text-xl py-10"
//                         >
//                           Please wait while data is loading...
//                         </td>
//                       </tr>
//                     ) : displayedSections.length ? (
//                       displayedSections.map((section, index) => (
//                         <tr
//                           key={section.section_id}
//                           className={`${
//                             index % 2 === 0 ? "bg-white" : "bg-gray-100"
//                           } hover:bg-gray-50`}
//                         >
//                           <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
//                             <p className="text-gray-900 whitespace-no-wrap relative top-2">
//                               {/* {index + 1} */}
//                               {currentPage * pageSize + index + 1}
//                             </p>
//                           </td>
//                           <td className="text-center px-2  border border-gray-950 text-sm">
//                             <p className="text-gray-900 whitespace-no-wrap relative top-2">
//                               {section.teachername}
//                             </p>
//                           </td>
//                           <td className="text-center px-2 lg:px-5 border border-gray-950 text-sm">
//                             <p className="text-gray-900 whitespace-no-wrap relative top-2">
//                               {section.leavename}
//                             </p>
//                           </td>

//                           <td className="text-center px-2 lg:px-5 border border-gray-950 text-sm">
//                             <p className="text-gray-900 whitespace-no-wrap relative top-2">
//                               {section.leaves_allocated}
//                             </p>
//                           </td>

//                           <td className="text-center px-2 lg:px-5 border border-gray-950 text-sm">
//                             <p className="text-gray-900 whitespace-no-wrap relative top-2">
//                               {section.balance_leave}
//                             </p>
//                           </td>

//                           {roleId === "M" ? (
//                             <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
//                               <button className="text-pink-600 hover:text-pink-800 hover:bg-transparent "></button>{" "}
//                             </td>
//                           ) : (
//                             <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
//                               <button
//                                 className="text-blue-600 hover:text-blue-800 hover:bg-transparent "
//                                 onClick={() => handleEdit(section)}
//                               >
//                                 <FontAwesomeIcon icon={faEdit} />
//                               </button>{" "}
//                             </td>
//                           )}
//                           {roleId === "M" ? (
//                             <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
//                               <button className="text-green-600 hover:text-green-800 hover:bg-transparent "></button>
//                             </td>
//                           ) : (
//                             <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
//                               <button
//                                 className="text-red-600 hover:text-red-800 hover:bg-transparent "
//                                 onClick={() =>
//                                   handleDelete(
//                                     section.staff_id,
//                                     section.leave_type_id
//                                   )
//                                 }
//                               >
//                                 <FontAwesomeIcon icon={faTrash} />
//                               </button>
//                             </td>
//                           )}
//                         </tr>
//                       ))
//                     ) : (
//                       <div className=" absolute left-[1%] w-[100%]  text-center flex justify-center items-center mt-14">
//                         <div className=" text-center text-xl text-red-700">
//                           Oops! No data found..
//                         </div>
//                       </div>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//             {filteredSections.length > pageSize && (
//               <ReactPaginate
//                 previousLabel={"Previous"}
//                 nextLabel={"Next"}
//                 breakLabel={"..."}
//                 pageCount={pageCount}
//                 marginPagesDisplayed={1}
//                 pageRangeDisplayed={1}
//                 onPageChange={handlePageClick}
//                 containerClassName={"pagination justify-content-center"}
//                 pageClassName={"page-item"}
//                 pageLinkClassName={"page-link"}
//                 previousClassName={"page-item"}
//                 previousLinkClassName={"page-link"}
//                 nextClassName={"page-item"}
//                 nextLinkClassName={"page-link"}
//                 breakClassName={"page-item"}
//                 breakLinkClassName={"page-link"}
//                 activeClassName={"active"}
//               />
//             )}
//           </div>
//         </div>

//         {/* Modal for adding a new section */}
//         {showAddModal && (
//           <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
//             <div
//               className="modal"
//               style={{
//                 display: "block",
//                 backgroundColor: "rgba(0, 0, 0, 0.5)",
//               }}
//             >
//               <div className="modal-dialog modal-dialog-centered ">
//                 <div className="modal-content">
//                   <div className="flex justify-between p-3">
//                     <h5 className="modal-title">Create New Leave</h5>

//                     <RxCross1
//                       className="float-end relative top-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
//                       type="button"
//                       // className="btn-close text-red-600"
//                       onClick={handleCloseModal}
//                     />
//                   </div>
//                   <div
//                     className=" relative  mb-3 h-1 w-[97%] mx-auto bg-red-700"
//                     style={{
//                       backgroundColor: "#C03078",
//                     }}
//                   ></div>
//                   {/* <hr className="font-bold"></hr> */}
//                   <div className="modal-body">
//                     <div className="relative mb-3 flex justify-center mx-4">
//                       <label htmlFor="staffName" className="w-1/2 mt-2">
//                         Staff Name<span className="text-red-500">*</span>
//                       </label>
//                       <select
//                         id="staffName"
//                         className="form-control shadow-md"
//                         value={newStaffName}
//                         onChange={handleChangeStaffName}
//                       >
//                         <option value="">Select</option>
//                         {staffNames.length === 0 ? (
//                           <option value="">No Staff Available</option>
//                         ) : (
//                           staffNames.map((staff) => (
//                             <option
//                               key={staff.teacher_id}
//                               value={staff.teacher_id}
//                               className="max-h-20 overflow-y-scroll"
//                             >
//                               {staff.name}
//                             </option>
//                           ))
//                         )}
//                       </select>
//                     </div>

//                     <div className="relative mb-3 flex justify-center mx-4">
//                       <label htmlFor="leaveType" className="w-1/2 mt-2">
//                         Leave Type<span className="text-red-500">*</span>
//                       </label>
//                       <select
//                         id="leaveType"
//                         className="form-control shadow-md"
//                         value={newLeaveType}
//                         onChange={handleChangeLeaveType}
//                       >
//                         <option value="">Select</option>
//                         {leaveType.length === 0 ? (
//                           <option>No Leave Type Available</option>
//                         ) : (
//                           leaveType.map((leave) => (
//                             <option
//                               key={leave.leave_type_id}
//                               value={leave.leave_type_id}
//                               className="max-h-20 overflow-y-scroll"
//                             >
//                               {leave.name}
//                             </option>
//                           ))
//                         )}
//                       </select>
//                     </div>

//                     <div className=" relative mb-3 flex justify-center  mx-4">
//                       <label htmlFor="leaveAllocated" className="w-1/2 mt-2">
//                         Leave Allocated<span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         id="leaveAllocated"
//                         className="form-control shadow-md"
//                         value={newLeaveAllocated}
//                         onChange={handleChangeLeaveAllocated}
//                       />
//                     </div>
//                   </div>

//                   {/* <div className="modal-footer d-flex justify-content-end"> */}
//                   {/* modified code by divyani mam guidance */}
//                   <div className=" flex justify-end p-3">
//                     {/* <button type="button" className="btn btn-secondary me-2" onClick={handleCloseModal}>Cancel</button> */}
//                     <button
//                       type="button"
//                       className="btn btn-primary px-3 mb-2 "
//                       style={{}}
//                       onClick={handleSubmitAdd}
//                       disabled={isSubmitting}
//                     >
//                       {isSubmitting ? "Saving..." : "Add"}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Modal for editing a section */}
//         {showEditModal && (
//           <div
//             className="modal"
//             style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
//           >
//             <div className="modal-dialog modal-dialog-centered">
//               <div className="modal-content">
//                 <div className="flex justify-between p-3">
//                   <h5 className="modal-title">Edit Staff Leave</h5>
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
//                   <div className=" relative mb-3 flex justify-center  mx-4">
//                     <label htmlFor="editStaffName" className="w-1/2 mt-2">
//                       Staff Name <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       id="editStaffName"
//                       className="form-control shadow-md"
//                       value={newStaffName}
//                       onChange={handleChangeStaffName}
//                     >
//                       {Array.isArray(staffNames) && staffNames.length > 0 ? (
//                         staffNames.map((staff) => (
//                           <option
//                             key={staff.teacher_id}
//                             value={staff.teacher_id}
//                           >
//                             {staff.name}
//                           </option>
//                         ))
//                       ) : (
//                         <option>No Staff Available</option>
//                       )}
//                     </select>
//                     <div className="absolute top-9 left-1/3 ">
//                       {!nameAvailable && (
//                         <span className=" block text-red-500 text-xs">
//                           {nameError}
//                         </span>
//                       )}

//                       {fieldErrors.teacher_id && (
//                         <span className="text-danger text-xs">
//                           {fieldErrors.teacher_id}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                   <div className="relative mb-3 flex justify-center mx-4">
//                     <label htmlFor="editLeaveType" className="w-1/2 mt-2">
//                       Leave Type<span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       id="editLeaveType"
//                       className="form-control shadow-md"
//                       value={newLeaveType}
//                       onChange={handleChangeLeaveType}
//                     >
//                       {console.log("leave new ttype",newLeaveType)}
//                       <option value="">Select</option>
//                       {console.log("leave type",leaveType)}
//                       {Array.isArray(leaveType) && leaveType.length > 0 ? (
//                         leaveType.map((leave) => (
//                           <option
//                             key={leave.leave_type_id}
//                             value={leave.leave_type_id || ""}

//                           >
//                             {leave.name}
//                           </option>
//                         ))
//                       ) : (
//                         <option>No Leave Type Available</option>
//                       )}
//                     </select>
//                     <div className="absolute top-9 left-1/3">
//                       {fieldErrors.leave_type_id && (
//                         <span className="text-danger text-xs">
//                           {fieldErrors.leave_type_id}
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   <div className=" relative mb-3 flex justify-center  mx-4">
//                     <label htmlFor="editLeaveAllocated" className="w-1/2 mt-2">
//                       Leave Allocated <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       id="leaveAllocated"
//                       className="form-control shadow-md"
//                       value={newLeaveAllocated}
//                       onChange={handleChangeLeaveAllocated}
//                     />
//                   </div>
//                 </div>
//                 <div className=" flex justify-end p-3">
//                   {/* <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button> */}
//                   <button
//                     type="button"
//                     // className="btn btn-primary"
//                     className="btn btn-primary px-3 mb-2 "
//                     style={{}}
//                     onClick={handleSubmitEdit}
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? "Updating..." : "Update"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Modal for confirming deletion */}
//         {showDeleteModal && (
//           <div
//             className="modal"
//             style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
//           >
//             <div className="modal-dialog modal-dialog-centered">
//               <div className="modal-content">
//                 <div className="flex justify-between p-3">
//                   <h5 className="modal-title">Confirm Deletion</h5>
//                   <RxCross1
//                     className="float-end relative mt-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
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
//                   <p>
//                     Are you sure you want to delete staff:{" "}
//                     {currentSection.teachername}?
//                   </p>
//                 </div>
//                 <div className=" flex justify-end p-3">
//                   {/* <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button> */}
//                   <button
//                     type="button"
//                     className="btn btn-danger px-3 mb-2"
//                     style={{}}
//                     onClick={handleSubmitDelete}
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? "Deleting..." : "Delete"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// export default LeaveAllocation;

// with unique name validations on server api complete for testing.
import { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RxCross1 } from "react-icons/rx";

// The is the divisionlist module
function LeaveAllocation() {
  const API_URL = import.meta.env.VITE_API_URL; // URL for host
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [newSectionName, setNewSectionName] = useState(""); //
  const [searchTerm, setSearchTerm] = useState("");
  const [className, setClassName] = useState(""); //
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [newDepartmentId, setNewDepartmentId] = useState(""); //
  const [fieldErrors, setFieldErrors] = useState({}); // For field-specific errors
  const [nameError, setNameError] = useState("");
  const [nameAvailable, setNameAvailable] = useState(true);
  const [roleId, setRoleId] = useState("");
  const [classes, setClasses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [staffNames, setStaffNames] = useState([]);
  const [newStaffName, setNewStaffName] = useState("");
  const [leaveType, setLeaveType] = useState([]);
  const [newLeaveAllocated, setNewLeaveAllocated] = useState("");
  const [newLeaveType, setNewLeaveType] = useState("");
  const pageSize = 10;
  useEffect(() => {
    fetchStaffNames();
    fetchLeaveType();
    fetchSections();
    fetchDataRoleId();
  }, []);

  const fetchStaffNames = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/get_allstaff`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(" all staff names", response.data);

      if (Array.isArray(response.data.data)) {
        setStaffNames(response.data.data);
      } else {
        setError("Unexpected data format.");
      }
    } catch (error) {
      toast.error("Error fetching Staff Names.", error);
    }
  };

  const fetchLeaveType = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No Authentication token found.");
      }

      const response = await axios.get(`${API_URL}/api/get_leavetype`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      console.log("leave type", response.data);
      if (Array.isArray(response.data.data)) {
        setLeaveType(response.data.data);
      } else {
        setError("Unexpected data format.");
      }
    } catch (error) {
      setError(error.message);
      toast.error("Error to fetching leave type");
      console.log("Error to fetching error.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        `${API_URL}/api/get_leaveallocationall`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("API Response:", response.data);

      if (Array.isArray(response.data.data)) {
        setSections(response.data.data);
        setPageCount(Math.ceil(response.data.data.length / pageSize));
      } else {
        throw new Error("Response data is not an array.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredSections = sections.filter((section) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      section.teachername.toLowerCase().includes(searchLower) || // Filter by teacher name
      section.leavename.toLowerCase().includes(searchLower) // Filter by leave type
    );
  });

  const displayedSections = filteredSections.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  const validateSectionName = (name, leave_type_id, leaves_allocated) => {
    const errors = {};

    // Validate Staff Name
    if (!name) {
      //name.trim()
      errors.name = "Please enter a valid Staff name.";
      // toast.error("Name is required.")
    }

    // Validate Leave Type ID
    if (!leave_type_id || isNaN(Number(leave_type_id))) {
      errors.leave_type_id = "Please select a valid Leave Type.";
      // toast.error("Leave type is required.")
    }

    // Validate Leaves Allocated
    if (!leaves_allocated || isNaN(Number(leaves_allocated))) {
      errors.leaves_allocated =
        "Please enter a valid number of allocated leaves.";
      // toast.error("Leave allocated is requied.")
    } else if (Number(leaves_allocated) <= 0) {
      errors.leaves_allocated = "Allocated leaves must be greater than zero.";
      // toast.error("Leave allocation greater than 0.")
    }

    return errors;
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleEdit = (section) => {
    setCurrentSection(section);
    setNewStaffName(section.staff_id);
    console.log("set stff ", section.staff_id);
    setNewLeaveType(section.leave_type_id);
    console.log("set staf leave", section.leave_type_id);
    setNewLeaveAllocated(section.leaves_allocated);
    console.log("set leave alloctaed", section.leaves_allocated);
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setCurrentSection(null);
    setNewStaffName();
    setNewLeaveType();
    setNewLeaveAllocated();
    setFieldErrors({});
    setNameError("");
  };

  const handleSubmitAdd = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const validationErrors = validateSectionName(
      newStaffName,
      newLeaveType,
      newLeaveAllocated
    );

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      // console.log("Token:", token);

      const checkLeave = await axios.post(
        ` ${API_URL}/api/save_leaveallocated`,
        {
          staff_id: newStaffName,
          leave_type_id: newLeaveType,
          leaves_allocated: newLeaveAllocated,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      const { data } = checkLeave;

      // console.log("API Response Data:", data);

      if (!data.success) {
        console.error("Leave Allocation for the staff already done..", data);
        setNameError("Leave Allocation for the staff already done.");
        toast.error("Leave Allocation for the staff already done.");
        setNameAvailable(false);
        setIsSubmitting(false);
        return;
      }

      console.log("Data saved successfully.", data);
      setNameError("");
      toast.success("Leave added successfully!");
      setNameAvailable(true);

      fetchSections(); // Fetch updated data
      handleCloseModal(); // Close the modal
    } catch (error) {
      console.error("Error adding Leave Allocation:", error);
      toast.error("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);

    const validationErrors = validateSectionName(
      newStaffName,
      newLeaveType,
      newLeaveAllocated
    );
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setIsSubmitting(false); // Reset submitting state if validation fails
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (
        !token ||
        !currentSection ||
        !currentSection.staff_id ||
        !currentSection.leave_type_id
      ) {
        throw new Error("No authentication token or required IDs found");
      }

      console.log("Preparing to update with:", {
        staff_id: newStaffName,
        leave_type_id: newLeaveType,
        leaves_allocated: newLeaveAllocated,
      });

      const response = await axios.put(
        `${API_URL}/api/update_leaveallocation/${currentSection?.staff_id}/${currentSection?.leave_type_id}`,
        {
          leaves_allocated: newLeaveAllocated,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      console.log("Update response:", response.data);
      console.log("Sections fetched after update:", sections);

      fetchSections();
      handleCloseModal();
      toast.success("Staff Leave updated successfully!");
    } catch (error) {
      console.error("Error editing Staff Leave:", error);
      console.log("Error details:", error.response?.data || error.message);
      if (error.response && error.response.data.status === 422) {
        const errors = error.response.data.errors;
        if (errors.staff_id) {
          setFieldErrors((prev) => ({
            ...prev,
            staff_id: errors.staff_id,
          }));
          errors.staff_id.forEach((err) => toast.error(err));
        }
      } else {
        toast.error("Server error. Please try again later.");
      }
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
    }
  };

  const handleDelete = (staffId, leaveTypeId) => {
    const sectionToDelete = sections.find(
      (sec) => sec.staff_id === staffId && sec.leave_type_id === leaveTypeId
    );

    if (!sectionToDelete) {
      toast.error("Unable to find the leave allocation to delete.");
      return;
    }

    setCurrentSection(sectionToDelete); // Store the section to be deleted
    setShowDeleteModal(true); // Show the confirmation modal
  };

  const handleSubmitDelete = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token || !currentSection || !currentSection.staff_id) {
        throw new Error("Staff ID is missing");
      }

      const response = await axios.delete(
        `${API_URL}/api/delete_leaveallocation/${currentSection.staff_id}/${currentSection.leave_type_id}`,
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
        toast.success("Leave deleted successfully!");
      } else {
        toast.error(
          response.data.message || "Failed to delete leave allocation."
        );
      }
    } catch (error) {
      console.error("Error deleting Leave:", error);
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

  const handleChangeStaffName = (e) => {
    const { value } = e.target;
    setNameError(""); // Clear any previous name error
    setNewStaffName(value); // Update staff name state
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      name: validateSectionName(value, newLeaveType, newLeaveAllocated).name, // Validate name when staff name changes
    }));
  };

  const handleChangeLeaveType = (e) => {
    const { value } = e.target;
    setNewLeaveType(value); // Update leave type state
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      leave_type_id: validateSectionName(newStaffName, value, newLeaveAllocated)
        .leave_type_id, // Validate leave type when it changes
    }));
  };

  const handleChangeLeaveAllocated = (e) => {
    const { value } = e.target;
    setNewLeaveAllocated(value); // Update allocated leave state
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      leaves_allocated: validateSectionName(newStaffName, newLeaveType, value)
        .leaves_allocated, // Validate allocated leaves when it changes
    }));
  };

  return (
    <>
      <ToastContainer />

      <div className="container  mt-4">
        <div className="card mx-auto lg:w-[90%] shadow-lg">
          <div className="p-2 px-3 bg-gray-100 flex justify-between items-center">
            <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
              Leave Allocation
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
            <div className="h-96 lg:h-96 w-full md:w-[90%] mx-auto  overflow-y-scroll lg:overflow-x-hidden ">
              <div className="bg-white  rounded-lg shadow-xs ">
                <table className="min-w-full leading-normal table-auto ">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-2 w-full md:w-[8%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Sr.No
                      </th>
                      <th className=" -px-2  w-full md:w-[30%] text-center py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Staff Name
                      </th>
                      <th className="px-2 text-center md:w-[18%] lg:px-5 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Leave Type
                      </th>
                      <th className="px-2 w-full md:w-[18%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Leave Allocated
                      </th>
                      <th className="px-2 w-full md:w-[18%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Balance Leave
                      </th>
                      <th className="px-2 w-full md:w-[14%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Edit
                      </th>
                      <th className="px-2 w-full md:w-[14%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
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
                          key={section.section_id}
                          className={`${
                            index % 2 === 0 ? "bg-white" : "bg-gray-100"
                          } hover:bg-gray-50`}
                        >
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {/* {index + 1} */}
                              {currentPage * pageSize + index + 1}
                            </p>
                          </td>
                          <td className="text-center px-2  border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {section.teachername}
                            </p>
                          </td>
                          <td className="text-center px-2 lg:px-5 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {section.leavename}
                            </p>
                          </td>

                          <td className="text-center px-2 lg:px-5 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {section.leaves_allocated}
                            </p>
                          </td>

                          <td className="text-center px-2 lg:px-5 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {section.balance_leave}
                            </p>
                          </td>

                          {roleId === "M" ? (
                            <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                              <button className="text-pink-600 hover:text-pink-800 hover:bg-transparent "></button>{" "}
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
                              <button className="text-green-600 hover:text-green-800 hover:bg-transparent "></button>
                            </td>
                          ) : (
                            <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                              <button
                                className="text-red-600 hover:text-red-800 hover:bg-transparent "
                                onClick={() =>
                                  handleDelete(
                                    section.staff_id,
                                    section.leave_type_id
                                  )
                                }
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
                    <h5 className="modal-title">Create New Leave</h5>

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
                    <div className="relative mb-4 flex justify-center mx-4">
                      <label htmlFor="staffName" className="w-1/2 mt-2">
                        Staff Name<span className="text-red-500">*</span>
                      </label>
                      <Select
                        id="staffName"
                        options={staffNames}
                        value={staffNames.find(
                          (staff) => staff.value === newStaffName
                        )}
                        onChange={handleChangeStaffName}
                        placeholder="Select"
                        className=" shadow-md w-full"
                        isSearchable
                        isClearable
                      />
                      <div className="absolute top-9 left-1/3">
                        {!nameAvailable && (
                          <span className="block text-danger text-xs">
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

                    <div className="relative mb-4 flex justify-center mx-4">
                      <label htmlFor="leaveType" className="w-1/2 mt-2">
                        Leave Type<span className="text-red-500">*</span>
                      </label>
                      <select
                        id="leaveType"
                        className="form-control shadow-md"
                        value={newLeaveType}
                        onChange={handleChangeLeaveType}
                      >
                        <option value="">Select</option>
                        {leaveType.length === 0 ? (
                          <option>No Leave Type Available</option>
                        ) : (
                          leaveType.map((leave) => (
                            <option
                              key={leave.leave_type_id}
                              value={leave.leave_type_id}
                              className="max-h-20 overflow-y-scroll"
                            >
                              {leave.name}
                            </option>
                          ))
                        )}
                      </select>
                      <div className="absolute top-9 left-1/3">
                        {fieldErrors.leave_type_id && (
                          <span className="text-danger text-xs">
                            {fieldErrors.leave_type_id}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className=" relative mb-3 flex justify-center  mx-4">
                      <label htmlFor="leaveAllocated" className="w-1/2 mt-2">
                        Leave Allocated<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="leaveAllocated"
                        className="form-control shadow-md"
                        value={newLeaveAllocated}
                        onChange={handleChangeLeaveAllocated}
                      />
                      <div className="absolute top-9 left-1/3">
                        {fieldErrors.leaves_allocated && (
                          <span className="text-danger text-xs">
                            {fieldErrors.leaves_allocated}
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
                  <h5 className="modal-title">Edit Staff Leave</h5>
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
                    <label htmlFor="editStaffName" className="w-1/2 mt-2">
                      Staff Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="editStaffName"
                      className="form-control shadow-md"
                      value={newStaffName}
                      onChange={handleChangeStaffName}
                      disabled
                    >
                      {Array.isArray(staffNames) && staffNames.length > 0 ? (
                        staffNames.map((staff) => (
                          <option
                            key={staff.teacher_id}
                            value={staff.teacher_id}
                          >
                            {staff.name}
                          </option>
                        ))
                      ) : (
                        <option>No Staff Available</option>
                      )}
                    </select>
                    <div className="absolute top-9 left-1/3 ">
                      {!nameAvailable && (
                        <span className=" block text-red-500 text-xs">
                          {nameError}
                        </span>
                      )}

                      {fieldErrors.teacher_id && (
                        <span className="text-danger text-xs">
                          {fieldErrors.teacher_id}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="relative mb-3 flex justify-center mx-4">
                    <label htmlFor="leaveType" className="w-1/2 mt-2">
                      Leave Type<span className="text-red-500">*</span>
                    </label>
                    <select
                      id="leaveType"
                      className="form-control shadow-md"
                      value={newLeaveType}
                      onChange={handleChangeLeaveType}
                      disabled
                    >
                      <option value="">Select</option>
                      {leaveType.length === 0 ? (
                        <option>No Leave Type Available</option>
                      ) : (
                        leaveType.map((leave) => (
                          <option
                            key={leave.leave_type_id}
                            value={leave.leave_type_id}
                            className="max-h-20 overflow-y-scroll"
                          >
                            {leave.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className=" relative mb-3 flex justify-center  mx-4">
                    <label htmlFor="editLeaveAllocated" className="w-1/2 mt-2">
                      Leave Allocated <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="leaveAllocated"
                      className="form-control shadow-md"
                      value={newLeaveAllocated}
                      onChange={handleChangeLeaveAllocated}
                    />
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
                    Are you sure you want to delete staff:{" "}
                    {currentSection.teachername}?
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
      </div>
    </>
  );
}

export default LeaveAllocation;
