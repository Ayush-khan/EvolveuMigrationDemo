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
// function SetLateTime() {
//   const API_URL = import.meta.env.VITE_API_URL; // URL for host
//   const [sections, setSections] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [currentSection, setCurrentSection] = useState(null);
//   const [newSectionName, setNewSectionName] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [className, setClassName] = useState("");
//   const [currentPage, setCurrentPage] = useState(0);
//   const [pageCount, setPageCount] = useState(0);
//   const [newDepartmentId, setNewDepartmentId] = useState("");
//   const [fieldErrors, setFieldErrors] = useState({}); // For field-specific errors
//   const [nameError, setNameError] = useState("");
//   const [nameAvailable, setNameAvailable] = useState(true);
//   const [roleId, setRoleId] = useState("");
//   const [classes, setClasses] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchClassNames = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         const response = await axios.get(`${API_URL}/api/get_teachercategory`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (Array.isArray(response?.data?.data)) {
//           setClasses(response?.data?.data);
//         } else {
//           setError("Unexpected data format");
//         }
//       } catch (error) {
//         console.error("Error fetching Teachers Category:", error?.message);
//       }
//     };

//     fetchClassNames();
//   }, []);

//   const pageSize = 10;

//   const fetchSections = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("authToken");

//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await axios.get(`${API_URL}/api/getDivision`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         withCredentials: true,
//       });

//       setSections(response.data);
//       setPageCount(Math.ceil(response.data.length / pageSize));
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // for role_id
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
//     const searchLower = searchTerm.trim().toLowerCase();

//     return (
//       section?.get_class?.name?.toLowerCase().includes(searchLower) || // Filter by class name
//       section?.name?.toLowerCase().includes(searchLower) // Filter by division name
//     );
//   });
//   console.log("filteredSections", filteredSections);

//   const displayedSections = filteredSections.slice(
//     currentPage * pageSize,
//     (currentPage + 1) * pageSize
//   );
//   console.log("displayed Late Time", displayedSections);
//   const validateSectionName = (name, departmentId) => {
//     const errors = {};

//     if (!name || name.trim() === "") {
//       errors.name = "Please Select Late Time.";
//     }

//     if (!departmentId) {
//       errors.department_id = "Please Select Teacher Category.";
//     }

//     return errors;
//   };

//   const handlePageClick = (data) => {
//     setCurrentPage(data.selected);
//   };

//   const handleEdit = (section) => {
//     setCurrentSection(section);
//     setNewSectionName(section.name);
//     setClassName(section.get_class.class_id);
//     setNewDepartmentId(section.get_class.class_id);
//     setShowEditModal(true);
//   };

//   const handleAdd = () => {
//     setShowAddModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowAddModal(false);
//     setShowEditModal(false);
//     setShowDeleteModal(false);
//     setNewSectionName("");
//     setNewDepartmentId("");
//     setCurrentSection(null);
//     setFieldErrors({});
//     setNameError("");
//   };

//   const handleSubmitAdd = async () => {
//     if (isSubmitting) return; // Prevent re-submitting
//     setIsSubmitting(true);
//     const validationErrors = validateSectionName(
//       newSectionName,
//       newDepartmentId
//     );
//     if (Object.keys(validationErrors).length > 0) {
//       setFieldErrors(validationErrors);
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const checkNameResponse = await axios.post(
//         `${API_URL}/api/check_division_name`,
//         { name: newSectionName, class_id: newDepartmentId },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }
//       );

//       if (checkNameResponse.data?.exists === true) {
//         setNameError("Name already taken.");
//         setNameAvailable(false);
//         setIsSubmitting(false);
//         return;
//       } else {
//         setNameError("");
//         setNameAvailable(true);
//       }

//       await axios.post(
//         `${API_URL}/api/store_division`,
//         { name: newSectionName, class_id: newDepartmentId },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }
//       );

//       fetchSections();
//       handleCloseModal();
//       toast.success("Late Time added successfully!");
//     } catch (error) {
//       console.error("Error adding Late Time:", error);
//       if (error.response && error.response.data && error.response.data.errors) {
//         Object.values(error.response.data.errors).forEach((err) =>
//           toast.error(err)
//         );
//       } else {
//         toast.error("Server error. Please try again later.");
//       }
//     } finally {
//       setIsSubmitting(false); // Re-enable the button after the operation
//     }
//   };

//   const handleSubmitEdit = async () => {
//     if (isSubmitting) return; // Prevent re-submitting
//     setIsSubmitting(true);

//     const validationErrors = validateSectionName(
//       newSectionName,
//       newDepartmentId
//     );
//     if (Object.keys(validationErrors).length > 0) {
//       setFieldErrors(validationErrors);
//       setIsSubmitting(false); // Reset submitting state if validation fails
//       return;
//     }

//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token || !currentSection || !currentSection.section_id) {
//         throw new Error("No authentication token or teacher ID found");
//       }

//       await axios.put(
//         `${API_URL}/api/getDivision/${currentSection.section_id}`,
//         { name: newSectionName, class_id: newDepartmentId },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }
//       );

//       fetchSections();
//       handleCloseModal();
//       toast.success("Late Time updated successfully!");
//     } catch (error) {
//       console.error("Error editing Late Time:", error);
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
//           errors.name.forEach((err) => toast.error(err)); // Show all errors in toast
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

//   const handleDelete = (id) => {
//     const sectionToDelete = sections.find((sec) => sec.section_id === id);
//     setCurrentSection(sectionToDelete);
//     setShowDeleteModal(true);
//   };

//   const handleSubmitDelete = async () => {
//     if (isSubmitting) return; // Prevent re-submitting
//     setIsSubmitting(true);
//     try {
//       const token = localStorage.getItem("authToken");
//       const academicYr = localStorage.getItem("academicYear");

//       if (!token || !currentSection || !currentSection.section_id) {
//         throw new Error("Teacher ID is missing");
//       }

//       const response = await axios.delete(
//         `${API_URL}/api/getDivision/${currentSection.section_id}`,
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
//         toast.success("Late Time deleted successfully!");
//       } else {
//         toast.error(response.data.message || "Failed to delete Late Time");
//       }
//     } catch (error) {
//       console.error("Error deleting Late Time:", error);
//       if (error.response && error.response.data && error.response.data.error) {
//         toast.error(error.response.data.error);
//       } else {
//         toast.error("Server error. Please try again later.");
//       }
//     } finally {
//       setIsSubmitting(false);
//       setShowDeleteModal(false);
//     }
//   };

//   const handleChangeSectionName = (e) => {
//     const { value } = e.target;
//     setNameError("");
//     setNewSectionName(value);
//     setFieldErrors((prevErrors) => ({
//       ...prevErrors,
//       name: validateSectionName(value, newDepartmentId).name,
//     }));
//   };

//   const handleChangeDepartmentId = (e) => {
//     const { value } = e.target;
//     setClassName(value);
//     setNewDepartmentId(value);
//     setFieldErrors((prevErrors) => ({
//       ...prevErrors,
//       department_id: validateSectionName(newSectionName, e.target.value)
//         .department_id,
//     }));
//   };

//   return (
//     <>
//       <ToastContainer />

//       <div className="container  mt-4">
//         <div className="card mx-auto lg:w-[70%] shadow-lg">
//           <div className="p-2 px-3 bg-gray-100 flex justify-between items-center">
//             <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
//               Set Late Time
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
//             <div className="h-96 lg:h-96 w-full md:w-[80%] mx-auto  overflow-y-scroll lg:overflow-x-hidden ">
//               <div className="bg-white  rounded-lg shadow-xs ">
//                 <table className="min-w-full leading-normal table-auto ">
//                   <thead>
//                     <tr className="bg-gray-200">
//                       <th className="px-2 w-full md:w-[12%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//                         Sr.No
//                       </th>
//                       <th className=" -px-2  w-full md:w-[25%] text-center py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//                         Teacher Category
//                       </th>
//                       <th className="px-2 text-center lg:px-5 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//                         Late Time
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
//                               {section.name}
//                             </p>
//                           </td>
//                           <td className="text-center px-2 lg:px-5 border border-gray-950 text-sm">
//                             <p className="text-gray-900 whitespace-no-wrap relative top-2">
//                               {section?.get_class?.name}
//                             </p>
//                           </td>

//                           {roleId === "M" ? (
//                             <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
//                               <button
//                                 className="text-pink-600 hover:text-pink-800 hover:bg-transparent "
//                                 // onClick={() => handleEdit(section)}
//                               >
//                                 {/* <FontAwesomeIcon icon={faEdit} /> */}
//                               </button>{" "}
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
//                               <button
//                                 className="text-green-600 hover:text-green-800 hover:bg-transparent "
//                                 // onClick={() => handleDelete(section.section_id)}
//                               >
//                                 {/* <FontAwesomeIcon icon={faTrash} /> */}
//                               </button>
//                             </td>
//                           ) : (
//                             <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
//                               <button
//                                 className="text-red-600 hover:text-red-800 hover:bg-transparent "
//                                 onClick={() => handleDelete(section.section_id)}
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
//                     <h5 className="modal-title">Create And Set Late Time</h5>

//                     <RxCross1
//                       className="float-end relative top-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
//                       type="button"
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
//                     {" "}
//                     {/* <div className="form-group"> */}
//                     <div className=" relative mb-3 flex justify-center  mx-4">
//                       <label htmlFor="departmentId" className="w-3/4 mt-2">
//                         Teacher Category <span className="text-red-500">*</span>
//                       </label>
//                       <select
//                         id="departmentId"
//                         className="form-control shadow-md"
//                         value={newDepartmentId}
//                         onChange={handleChangeDepartmentId}
//                       >
//                         <option value="">Select </option>

//                         {classes.length === 0 ? (
//                           <option value="">
//                             No Teacher Category Available
//                           </option>
//                         ) : (
//                           classes.map((category) => (
//                             <option
//                               key={category.tc_id}
//                               value={category.tc_id}
//                               className="max-h-20 overflow-y-scroll "
//                             >
//                               {category.name}
//                             </option>
//                           ))
//                         )}
//                       </select>
//                       <div className="absolute top-9 left-[42%]">
//                         {fieldErrors.department_id && (
//                           <span className="text-danger text-xs">
//                             {fieldErrors.department_id}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     <div className=" relative mb-3 flex justify-center  mx-4">
//                       <label htmlFor="sectionName" className="w-3/4 mt-2">
//                         Late Time <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="time"
//                         maxLength={30}
//                         className="form-control shadow-md mb-2"
//                         // style={{ background: "#F8F8F8" }}
//                         id="sectionName"
//                         value={newSectionName}
//                         // placeholder="e.g A, B, C, D"
//                         onChange={handleChangeSectionName}
//                         // onChange={}
//                         // onBlur={handleBlur}
//                       />
//                       <div className="absolute top-9 left-[42%]">
//                         {!nameAvailable && (
//                           <span className=" block text-danger text-xs">
//                             {nameError}
//                           </span>
//                         )}
//                         {fieldErrors.name && (
//                           <span className="text-danger text-xs">
//                             {fieldErrors.name}
//                           </span>
//                         )}
//                       </div>
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

//         {showEditModal && (
//           <div
//             className="modal"
//             style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
//           >
//             <div className="modal-dialog modal-dialog-centered">
//               <div className="modal-content">
//                 <div className="flex justify-between p-3">
//                   <h5 className="modal-title">Edit And Set Late Time</h5>
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
//                     <label htmlFor="editDepartmentId" className="w-3/4 mt-2">
//                       Teacher Category <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       id="editDepartmentId"
//                       className="form-control shadow-md"
//                       value={className}
//                       onChange={handleChangeDepartmentId}
//                     >
//                       <option value="">Select</option>
//                       {/* {classes.map((cls, index) => (
//                         <option key={index} value={cls}>
//                           {cls}
//                         </option>
//                       ))} */}
//                       {/* <option value="">--Please choose a class--</option> */}
//                       {console.log("the classes", classes)}
//                       {classes.length === 0 ? (
//                         <option value="">No Teacher Category available</option>
//                       ) : (
//                         classes.map((category) => (
//                           <option key={category.tc_id} value={category.tc_id}>
//                             {category.name}
//                           </option>
//                         ))
//                       )}
//                     </select>
//                     <div className="absolute top-9 left-[42%]">
//                       {fieldErrors.department_id && (
//                         <span className="text-danger text-xs">
//                           {fieldErrors.department_id}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                   <div className=" relative mb-3 flex justify-center  mx-4">
//                     <label htmlFor="editSectionName" className="w-3/4 mt-2">
//                       Late Time <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="time"
//                       maxLength={30}
//                       className="form-control shadow-md mb-2"
//                       id="editSectionName"
//                       value={newSectionName}
//                       onChange={handleChangeSectionName}
//                       // onBlur={handleBlur}
//                     />
//                     <div className="absolute top-9 left-[42%] ">
//                       {!nameAvailable && (
//                         <span className=" block text-red-500 text-xs">
//                           {nameError}
//                         </span>
//                       )}

//                       {fieldErrors.name && (
//                         <span className="text-danger text-xs">
//                           {fieldErrors.name}
//                         </span>
//                       )}
//                     </div>
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
//                     Are you sure you want to delete late time for this teacher:{" "}
//                     {currentSection.name}?
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

// export default SetLateTime;

// with unique name validations on server api complete for testing.
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RxCross1 } from "react-icons/rx";

// The is the divisionlist module
function SetLateTime() {
  const API_URL = import.meta.env.VITE_API_URL; // URL for host
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  // const [newSectionName, setNewSectionName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [className, setClassName] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  // const [newDepartmentId, setNewDepartmentId] = useState("");
  const [fieldErrors, setFieldErrors] = useState({}); // For field-specific errors
  const [nameError, setNameError] = useState("");
  const [nameAvailable, setNameAvailable] = useState(true);
  const [roleId, setRoleId] = useState("");
  const [classes, setClasses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSetLateTime, setNewSetLateTime] = useState("");
  const [newTeacherId, setNewTeacherId] = useState("");

  const formatTo12Hour = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const intHours = parseInt(hours, 10);
    const isPM = intHours >= 12;
    const formattedHours = intHours % 12 === 0 ? 12 : intHours % 12;
    const ampm = isPM ? "PM" : "AM";
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    const fetchClassNames = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${API_URL}/api/get_teachercategory`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(response?.data?.data)) {
          setClasses(response?.data?.data);
        } else {
          setError("Unexpected data format");
        }
      } catch (error) {
        console.error("Error fetching Teachers Category:", error?.message);
      }
    };

    fetchClassNames();
  }, []);

  const pageSize = 10;

  // for role_id

  const fetchSections = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get(`${API_URL}/api/get_listlatetime`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data.data || [];
      setSections(data);
      // console.log("datta",sections)
      setPageCount(Math.ceil(data.length / pageSize));
    } catch (error) {
      setError(error.message || "Error fetching data");
      toast.error(error.message || "Error fetching data");
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
      // console.log("roleIDis:", roleId);
      // Fetch academic year data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchSections();
    fetchDataRoleId();
  }, []);

  const filteredSections = sections.filter((section) => {
    const searchLower = searchTerm.toLowerCase();

    return (
      section.name.toLowerCase().includes(searchLower) || // Filter by name
      formatTo12Hour(section?.late_time?.toString()).includes(searchLower)
    );
  });

  console.log("filteredSections", filteredSections);

  const displayedSections = filteredSections.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );
  console.log("displayed Late Time", displayedSections);

  const validateSectionName = (latetime, tc_id) => {
    const errors = {};
    // console.log("xcfgvbhnj")

    if (!latetime || latetime.trim() === "") {
      errors.latetime = "Please Select Late Time.";
    }

    if (!tc_id) {
      errors.tc_id = "Please Select Teacher Category.";
    }

    return errors;
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleEdit = (section) => {
    setCurrentSection(section);
    console.log("section", section);
    setNewSetLateTime(section.late_time);
    setClassName(section.tc_id);
    console.log("section tc", section.tc_id);
    setNewTeacherId(section.tc_id);
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setClassName("");

    setNewSetLateTime(""); //
    setNewTeacherId(""); //
    setCurrentSection(null);
    setFieldErrors({});
    setNameError("");
  };

  const handleSubmitAdd = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const validationErrors = validateSectionName(newSetLateTime, newTeacherId);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }
    // console.log("Function started.");
    // console.log("New Set Late Time:", newSetLateTime);
    // console.log("New Teacher ID:", newTeacherId);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      // console.log("Token:", token);

      const checkSetLateTime = await axios.post(
        `${API_URL}/api/save_setlatetime`,
        { latetime: newSetLateTime, tc_id: newTeacherId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      // console.log("API Response (checkSetLateTime):", checkSetLateTime);
      const { data } = checkSetLateTime;

      // console.log("API Response Data:", data);

      if (!data.success) {
        // console.error("Error: Teacher Category already exists",data);
        setNameError("Teacher Category already taken.");
        toast.error("Teacher Category already exist.");
        setNameAvailable(false);
        setIsSubmitting(false);
        return;
      }

      console.log("Data saved successfully.", data);
      setNameError("");
      toast.success("Late Time added successfully!");
      setNameAvailable(true);

      fetchSections(); // Fetch updated data
      handleCloseModal(); // Close the modal
    } catch (error) {
      console.error("Error adding Late Time:", error);
      toast.error("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);

    const validationErrors = validateSectionName(newSetLateTime, newTeacherId);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setIsSubmitting(false); // Reset submitting state if validation fails
      return;
    }
    console.log("Current Section:", currentSection);
    console.log(
      "Current Section ID (lt_id):",
      currentSection ? currentSection : null
    );

    try {
      const token = localStorage.getItem("authToken");
      console.log("token", token);

      if (!token || !currentSection) {
        throw new Error("No authentication token or teacher ID found");
      }
      console.log("currentSection", currentSection);

      await axios.put(
        `${API_URL}/api/update_latetime/${currentSection?.lt_id}`,
        { latetime: newSetLateTime, tc_id: newTeacherId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      fetchSections();
      handleCloseModal();
      toast.success("Late Time updated successfully!");
    } catch (error) {
      // console.error("Error editing Late Time:", error);
      // console.log("erroris", error.response);
      if (error.response && error.response.data.status === 422) {
        toast.error("Teacher Category already taken");
        setNameError("Teacher Category already taken");
        setNameAvailable(false);
        const errors = error.response.data.errors;
        console.log("error", errors);

        // Handle name field error
        if (errors.name) {
          setFieldErrors((prev) => ({
            ...prev,
            name: errors.name, // Show the first error message for the name field
          }));
          errors.name.forEach((err) => toast.error(err)); // Show all errors in toast
        }

        // Handle other field errors if necessary
        // Add similar handling for other fields if included in the backend error response
      } else {
        // Handle other errors
        toast.error("Server error. Please try again later.");
      }
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
    }
  };

  const handleDelete = (id) => {
    console.log("id", id);
    setCurrentSection("");
    // setSections(prevSections =>
    //   prevSections.filter(section => section.lt_id !== currentSection)
    // );
    const sectionToDelete = sections.find((sec) => sec.lt_id === id);

    setCurrentSection(sectionToDelete);
    setShowDeleteModal(true);
  };

  const handleSubmitDelete = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      const academicYr = localStorage.getItem("academicYear");

      if (!token || !currentSection || !currentSection.lt_id) {
        throw new Error("Teacher ID is missing");
      }

      const response = await axios.delete(
        `${API_URL}/api/delete_latetime/${currentSection.lt_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      fetchSections();
      if (response.data.success) {
        // fetchSections();
        setShowDeleteModal(false);
        setCurrentSection(null);
        toast.success("Late Time deleted successfully!");
      } else {
        toast.error(response.data.message || "Failed to delete Late Time");
      }
    } catch (error) {
      console.error("Error deleting Late Time:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Server error. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
      setShowDeleteModal(false);
    }
  };

  const handleChangeSectionName = (e) => {
    console.log(setNewSetLateTime);
    const { value } = e.target;

    setNewSetLateTime(value); //
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      latetime: validateSectionName(value, newTeacherId).latetime,
    }));
  };

  const handleChangeDepartmentId = (e) => {
    console.log(setNewTeacherId);
    setNameError("");
    const { value } = e.target;
    setClassName(value);
    setNewTeacherId(value); //
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      tc_id: validateSectionName(newSetLateTime, e.target.value).tc_id,
    }));
  };

  return (
    <>
      <ToastContainer />

      <div className="container  mt-4">
        <div className="card mx-auto lg:w-[70%] shadow-lg">
          <div className="p-2 px-3 bg-gray-100 flex justify-between items-center">
            <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
              Set Late Time
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
            <div className="h-96 lg:h-96 w-full md:w-[80%] mx-auto  overflow-y-scroll lg:overflow-x-hidden ">
              <div className="bg-white  rounded-lg shadow-xs ">
                <table className="min-w-full leading-normal table-auto ">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-2 w-full md:w-[12%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Sr.No
                      </th>
                      <th className=" -px-2  w-full md:w-[25%] text-center py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Teacher Category
                      </th>
                      <th className="px-2 text-center lg:px-5 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Late Time
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
                              {section.name}
                            </p>
                          </td>
                          <td className="text-center px-2 lg:px-5 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {/* {section.late_time || "no late time"} */}

                              {formatTo12Hour(
                                section.late_time || "no late time"
                              )}
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
                                onClick={() => handleDelete(section.lt_id)}
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
                    <h5 className="modal-title">Create And Set Late Time</h5>

                    <RxCross1
                      className="float-end relative top-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
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
                  {/* <hr className="font-bold"></hr> */}
                  <div className="modal-body">
                    {" "}
                    {/* <div className="form-group"> */}
                    <div className=" relative mb-3 flex justify-center  mx-4">
                      <label htmlFor="editDepartmentId" className="w-3/4 mt-2">
                        Teacher Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="editDepartmentId"
                        className="form-control shadow-md"
                        value={className}
                        onChange={handleChangeDepartmentId}
                      >
                        {console.log("the tecaher name", className)}
                        <option value="">Select</option>
                        {/* {classes.map((cls, index) => (
                        <option key={index} value={cls}>
                          {cls}
                        </option>
                      ))} */}
                        {/* <option value="">--Please choose a class--</option> */}
                        {console.log("the classes", classes)}
                        {classes.length === 0 ? (
                          <option value="">
                            No Teacher Category available
                          </option>
                        ) : (
                          classes.map((category) => (
                            <option key={category.tc_id} value={category.tc_id}>
                              {category.name}
                            </option>
                          ))
                        )}
                      </select>
                      <div className="absolute top-9 left-[42%]">
                        {!nameAvailable && (
                          <span className=" block text-danger text-xs">
                            {nameError}
                          </span>
                        )}
                        {fieldErrors.tc_id && (
                          <span className="text-danger text-xs">
                            {fieldErrors.tc_id}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className=" relative mb-3 flex justify-center  mx-4">
                      <label htmlFor="sectionName" className="w-3/4 mt-2">
                        Late Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        maxLength={30}
                        className="form-control shadow-md mb-2"
                        // style={{ background: "#F8F8F8" }}
                        id="sectionName"
                        value={newSetLateTime}
                        // placeholder="e.g A, B, C, D"
                        onChange={handleChangeSectionName}
                        // onChange={}
                        // onBlur={handleBlur}
                      />
                      <div className="absolute top-9 left-[42%]">
                        {fieldErrors.latetime && (
                          <span className="text-danger text-xs">
                            {fieldErrors.latetime}
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

        {showEditModal && (
          <div
            className="modal"
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title">Edit And Set Late Time</h5>
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
                    <label htmlFor="editDepartmentId" className="w-3/4 mt-2">
                      Teacher Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="editDepartmentId"
                      className="form-control shadow-md"
                      value={className}
                      onChange={handleChangeDepartmentId}
                    >
                      {console.log("the tecaher name", className)}
                      <option value="">Select</option>
                      {/* {classes.map((cls, index) => (
                        <option key={index} value={cls}>
                          {cls}
                        </option>
                      ))} */}
                      {/* <option value="">--Please choose a class--</option> */}
                      {console.log("the classes", classes)}
                      {classes.length === 0 ? (
                        <option value="">No Teacher Category available</option>
                      ) : (
                        classes.map((category) => (
                          <option key={category.tc_id} value={category.tc_id}>
                            {category.name}
                          </option>
                        ))
                      )}
                    </select>
                    <div className="absolute top-9 left-[42%]">
                      {!nameAvailable && (
                        <span className=" block text-red-500 text-xs">
                          {nameError}
                        </span>
                      )}

                      {fieldErrors.tc_id && (
                        <span className="text-danger text-xs">
                          {fieldErrors.tc_id}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className=" relative mb-3 flex justify-center  mx-4">
                    <label htmlFor="editSectionName" className="w-3/4 mt-2">
                      Late Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      maxLength={30}
                      className="form-control shadow-md mb-2"
                      id="editSectionName"
                      value={newSetLateTime}
                      onChange={handleChangeSectionName}
                      // onBlur={handleBlur}
                    />

                    {/* {console.log("the time",newSetLateTime)} */}
                    <div className="absolute top-9 left-[42%] ">
                      {fieldErrors.latetime && (
                        <span className="text-danger text-xs">
                          {fieldErrors.latetime}
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
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
                    Are you sure you want to delete late time for:{" "}
                    {currentSection.name}?
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

export default SetLateTime;
