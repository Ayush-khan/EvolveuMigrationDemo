// import axios from "axios";
// import ReactPaginate from "react-paginate";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { useState, useEffect } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function StaffList() {
//   const API_URL = import.meta.env.VITE_API_URL; // url for host
//   const [classes, setClasses] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [currentClass, setCurrentClass] = useState(null);
//   const [newClassName, setNewClassName] = useState("");
//   const [newDepartmentId, setNewDepartmentId] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(0);
//   const [pageCount, setPageCount] = useState(0);
//   const pageSize = 10;

//   const fetchClasses = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const academicYr = localStorage.getItem("academicYear");

//       if (!token || !academicYr) {
//         throw new Error("No authentication token or academic year found");
//       }

//       const response = await axios.get(`${API_URL}/api/classes`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "X-Academic-Year": academicYr,
//         },
//         withCredentials: true,
//       });

//       setClasses(response.data);
//       setPageCount(Math.ceil(response.data.length / pageSize));
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDepartments = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const academicYr = localStorage.getItem("academicYear");

//       if (!token || !academicYr) {
//         throw new Error("No authentication token or academic year found");
//       }

//       const response = await axios.get(`${API_URL}/api/sections`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "X-Academic-Year": academicYr,
//         },
//         withCredentials: true,
//       });

//       setDepartments(response.data);
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   useEffect(() => {
//     fetchClasses();
//     fetchDepartments();
//   }, []);

//   const handlePageClick = (data) => {
//     setCurrentPage(data.selected);
//   };

//   const handleEdit = (classItem) => {
//     setCurrentClass(classItem);
//     setNewClassName(classItem.name);
//     setNewDepartmentId(classItem.department_id);
//     setShowEditModal(true);
//   };

//   const handleAdd = () => {
//     setShowAddModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowAddModal(false);
//     setShowEditModal(false);
//     setShowDeleteModal(false);
//     setNewClassName("");
//     setNewDepartmentId("");
//     setCurrentClass(null);
//   };

//   const handleSubmitAdd = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const academicYr = localStorage.getItem("academicYear");

//       if (!token || !academicYr) {
//         throw new Error("No authentication token or academic year found");
//       }

//       await axios.post(
//         `${API_URL}/api/classes`,
//         { name: newClassName, department_id: newDepartmentId },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "X-Academic-Year": academicYr,
//           },
//           withCredentials: true,
//         }
//       );

//       fetchClasses();
//       handleCloseModal();
//       toast.success("Class added successfully!");
//     } catch (error) {
//       console.error("Error adding class:", error);
//     }
//   };

//   const handleSubmitEdit = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const academicYr = localStorage.getItem("academicYear");

//       if (!token || !academicYr || !currentClass || !currentClass.class_id) {
//         throw new Error("Class ID is missing");
//       }

//       await axios.put(
//         `${API_URL}/api/classes/${currentClass.class_id}`,
//         { name: newClassName, department_id: newDepartmentId },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "X-Academic-Year": academicYr,
//           },
//           withCredentials: true,
//         }
//       );

//       fetchClasses();
//       handleCloseModal();
//       toast.success("Class updated successfully!");
//     } catch (error) {
//       console.error("Error editing class:", error);
//     }
//   };

//   const handleDelete = (id) => {
//     const classToDelete = classes.find((cls) => cls.class_id === id);
//     setCurrentClass(classToDelete);
//     setShowDeleteModal(true);
//   };

//   const handleSubmitDelete = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const academicYr = localStorage.getItem("academicYear");

//       if (!token || !academicYr || !currentClass || !currentClass.class_id) {
//         throw new Error("Class ID is missing");
//       }

//       await axios.delete(`${API_URL}/api/classes/${currentClass.class_id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "X-Academic-Year": academicYr,
//         },
//         withCredentials: true,
//       });

//       fetchClasses();
//       setShowDeleteModal(false);
//       setCurrentClass(null);
//       toast.success("Class deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting class:", error);
//       setError(error.message);
//     }
//   };

//   const filteredClasses = classes.filter((cls) =>
//     cls.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const displayedClasses = filteredClasses.slice(
//     currentPage * pageSize,
//     (currentPage + 1) * pageSize
//   );

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <>
//       {/* <NavBar /> */}
//       <ToastContainer />
//       <div className="container mt-4">
//         <div className="card mx-auto lg:w-3/4 shadow-lg">
//           <div className="card-header flex justify-between items-center">
//             <h3 className="text-gray-700 mt-1 text-md lg:text-xl">Classes</h3>
//             <div className=" box-border flex gap-x-2  justify-end md:h-10 ">
//               <div className=" ">
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Search"
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//               <button
//                 className="btn btn-primary btn-sm h-9"
//                 onClick={handleAdd}
//               >
//                 <FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }} />
//                 Add
//               </button>
//             </div>
//           </div>

//           <div className="card-body w-full">
//             <div className="h-96 lg:h-96 overflow-y-scroll lg:overflow-x-hidden">
//               <div className="bg-white rounded-lg shadow-xs">
//                 <table className="min-w-full leading-normal table-auto">
//                   <thead>
//                     <tr className="bg-gray-100">
//                       <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//                         S.No
//                       </th>
//                       <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//                         Photo
//                       </th>
//                       <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//                         Staff Name
//                       </th>
//                       <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//                         Email
//                       </th>
//                       <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//                         Phone no.
//                       </th>
//                       <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//                         Designation
//                       </th>

//                       <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//                         Edit
//                       </th>
//                       <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//                         Delete
//                       </th>
//                       <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
//                         View
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {displayedClasses.map((classItem, index) => (
//                       <tr
//                         key={classItem.class_id}
//                         className={`${
//                           index % 2 === 0 ? "bg-white" : "bg-gray-100"
//                         } hover:bg-gray-50`}
//                       >
//                         <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
//                           <p className="text-gray-900 whitespace-no-wrap relative top-2">
//                             {index + 1}
//                           </p>
//                         </td>
//                         <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
//                           <p className="text-gray-900 whitespace-no-wrap relative top-2">
//                             {classItem.name}
//                           </p>
//                         </td>
//                         <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
//                           <p className="text-gray-900 whitespace-no-wrap relative top-2">
//                             {
//                               departments.find(
//                                 (dep) =>
//                                   dep.department_id === classItem.department_id
//                               )?.name
//                             }
//                           </p>
//                         </td>
//                         <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
//                           <button
//                             className="text-blue-600 hover:text-blue-800 hover:bg-transparent "
//                             onClick={() => handleEdit(classItem)}
//                           >
//                             <FontAwesomeIcon icon={faEdit} />
//                           </button>
//                         </td>
//                         <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
//                           <button
//                             className="text-red-600 hover:text-red-800 hover:bg-transparent "
//                             onClick={() => handleDelete(classItem.class_id)}
//                           >
//                             <FontAwesomeIcon icon={faTrash} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//             <div className=" flex justify-center  pt-2 -mb-3">
//               <ReactPaginate
//                 previousLabel={"Previous"}
//                 nextLabel={"Next"}
//                 breakLabel={"..."}
//                 breakClassName={"page-item"}
//                 breakLinkClassName={"page-link"}
//                 pageCount={pageCount}
//                 marginPagesDisplayed={2}
//                 pageRangeDisplayed={5}
//                 onPageChange={handlePageClick}
//                 containerClassName={"pagination"}
//                 pageClassName={"page-item"}
//                 pageLinkClassName={"page-link"}
//                 previousClassName={"page-item"}
//                 previousLinkClassName={"page-link"}
//                 nextClassName={"page-item"}
//                 nextLinkClassName={"page-link"}
//                 activeClassName={"active"}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Add Modal */}
//       {showAddModal && (
//         <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
//           <div className="modal show" style={{ display: "block" }}>
//             <div className="modal-dialog modal-dialog-centered">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title">Add Class</h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={handleCloseModal}
//                   ></button>
//                 </div>
//                 <div className="modal-body">
//                   <div className="form-group">
//                     <label htmlFor="newClassName">Class Name</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       id="newClassName"
//                       value={newClassName}
//                       onChange={(e) => setNewClassName(e.target.value)}
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="newDepartmentId">Department</label>
//                     <select
//                       className="form-control"
//                       id="newDepartmentId"
//                       value={newDepartmentId}
//                       onChange={(e) => setNewDepartmentId(e.target.value)}
//                     >
//                       <option value="">Select Department</option>
//                       {departments.map((department) => (
//                         <option
//                           key={department.department_id}
//                           value={department.department_id}
//                         >
//                           {department.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   <button
//                     type="button"
//                     className="btn btn-secondary"
//                     onClick={handleCloseModal}
//                   >
//                     Close
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-primary"
//                     onClick={handleSubmitAdd}
//                   >
//                     Add
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
//           <div className="modal show " style={{ display: "block" }}>
//             <div className="modal-dialog modal-dialog-centered">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title">Edit Class</h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={handleCloseModal}
//                   ></button>
//                 </div>
//                 <div className="modal-body">
//                   <div className="form-group">
//                     <label htmlFor="newClassName">Class Name</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       id="newClassName"
//                       value={newClassName}
//                       onChange={(e) => setNewClassName(e.target.value)}
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="newDepartmentId">Department</label>
//                     <select
//                       className="form-control"
//                       id="newDepartmentId"
//                       value={newDepartmentId}
//                       onChange={(e) => setNewDepartmentId(e.target.value)}
//                     >
//                       <option value="">Select Department</option>
//                       {departments.map((department) => (
//                         <option
//                           key={department.department_id}
//                           value={department.department_id}
//                         >
//                           {department.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   {/* <button
//                     type="button"
//                     className="btn btn-secondary"
//                     onClick={handleCloseModal}
//                   >
//                     Close
//                   </button> */}
//                   <button
//                     type="button"
//                     className="btn btn-primary"
//                     onClick={handleSubmitEdit}
//                   >
//                     Save Changes
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
//           <div className="modal show " style={{ display: "block" }}>
//             <div className="modal-dialog  modal-dialog-centered">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title">Delete Class</h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={() => setShowDeleteModal(false)}
//                   ></button>
//                 </div>
//                 <div className="modal-body">
//                   <p>Are you sure you want to delete this class?</p>
//                   <p>
//                     <strong>{currentClass?.name}</strong>
//                   </p>
//                 </div>
//                 <div className="modal-footer">
//                   {/* <button
//                     type="button"
//                     className="btn btn-secondary"
//                     onClick={() => setShowDeleteModal(false)}
//                   >
//                     Cancel
//                   </button> */}
//                   <button
//                     type="button"
//                     className="btn btn-danger"
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

// export default StaffList;

import axios from "axios";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function StaffList() {
  const API_URL = import.meta.env.VITE_API_URL; // url for host
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [newStaffName, setNewStaffName] = useState("");
  const [newDesignation, setNewDesignation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const pageSize = 10;
  const navigate = useNavigate();
  const fetchStaffs = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${API_URL}/api/staff_list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setStaffs(response.data);
      setPageCount(Math.ceil(response.data.length / pageSize));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleEdit = (staffItem) => {
    setCurrentStaff(staffItem);
    setNewStaffName(staffItem.get_teacher.name);
    setNewDesignation(staffItem.get_teacher.designation);
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setNewStaffName("");
    setNewDesignation("");
    setCurrentStaff(null);
  };

  //   const handleSubmitAdd = async () => {
  //     try {
  //       const token = localStorage.getItem("authToken");

  //       if (!token) {
  //         throw new Error("No authentication token found");
  //       }

  //       await axios.post(
  //         `${API_URL}/api/store_staff`,
  //         { name: newStaffName, designation: newDesignation },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //           withCredentials: true,
  //         }
  //       );

  //       fetchStaffs();
  //       handleCloseModal();
  //       toast.success("Staff added successfully!");
  //     } catch (error) {
  //       console.error("Error adding staff:", error);
  //     }
  //   };

  const handleSubmitAdd = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${API_URL}/api/store_staff`,
        {
          name: newStaffName,
          designation: newDesignation,
          // Add other required fields according to your backend validation
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        fetchStaffs(); // Refresh staff list after successful addition
        handleCloseModal();
        toast.success("Staff added successfully!");
      } else {
        toast.error("Failed to add staff");
      }
    } catch (error) {
      console.error("Error adding staff:", error);
      toast.error("Failed to add staff");
    }
  };

  //   const handleSubmitEdit = async () => {
  //     try {
  //       const token = localStorage.getItem("authToken");

  //       if (!token || !currentStaff || !currentStaff.user_id) {
  //         throw new Error("Staff ID is missing");
  //       }

  //       await axios.put(
  //         `${API_URL}/api/teachers/${currentStaff.user_id}`,
  //         { name: newStaffName, designation: newDesignation },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //           withCredentials: true,
  //         }
  //       );

  //       fetchStaffs();
  //       handleCloseModal();
  //       toast.success("Staff updated successfully!");
  //     } catch (error) {
  //       console.error("Error editing staff:", error);
  //     }
  //   };

  const handleSubmitEdit = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token || !currentStaff || !currentStaff.user_id) {
        throw new Error("Staff ID is missing");
      }

      const response = await axios.put(
        `${API_URL}/api/teachers/${currentStaff.user_id}`,
        {
          name: newStaffName,
          designation: newDesignation,
          // Add other required fields according to your backend validation
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        fetchStaffs(); // Refresh staff list after successful update
        handleCloseModal();
        toast.success("Staff updated successfully!");
      } else {
        toast.error("Failed to update staff");
      }
    } catch (error) {
      console.error("Error editing staff:", error);
      toast.error("Failed to update staff");
    }
  };

  const handleDelete = (id) => {
    const staffToDelete = staffs.find((staff) => staff.user_id === id);
    setCurrentStaff(staffToDelete);
    setShowDeleteModal(true);
  };
  const handleView = () => {
    console.log("handleview is running on");
  };
  //   const handleSubmitDelete = async () => {
  //     try {
  //       const token = localStorage.getItem("authToken");

  //       if (!token || !currentStaff || !currentStaff.user_id) {
  //         throw new Error("Staff ID is missing");
  //       }

  //       await axios.delete(`${API_URL}/api/teachers/${currentStaff.user_id}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         withCredentials: true,
  //       });

  //       fetchStaffs();
  //       setShowDeleteModal(false);
  //       setCurrentStaff(null);
  //       toast.success("Staff deleted successfully!");
  //     } catch (error) {
  //       console.error("Error deleting staff:", error);
  //       setError(error.message);
  //     }
  //   };
  const handleSubmitDelete = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token || !currentStaff || !currentStaff.user_id) {
        throw new Error("Staff ID is missing");
      }

      const response = await axios.delete(
        `${API_URL}/api/teachers/${currentStaff.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        fetchStaffs(); // Refresh staff list after successful deletion
        handleCloseModal();
        toast.success("Staff deleted successfully!");
      } else {
        toast.error("Failed to delete staff");
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error("Failed to delete staff");
    }
  };

  const filteredStaffs = staffs.filter((staff) =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedStaffs = filteredStaffs.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <ToastContainer />
      <div className="container md:mt-4">
        <div className="card mx-auto lg:w-full shadow-lg">
          <div className="card-header flex justify-between items-center">
            <h3 className="text-gray-700 mt-1 text-md lg:text-xl">
              Staff List
            </h3>
            <div className="box-border flex gap-x-2 justify-end md:h-10">
              <div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary btn-sm h-9"
                onClick={() => navigate("/CreateStaff")}
              >
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }} />
                Add
              </button>
            </div>
          </div>

          <div className="card-body w-full box-border">
            <div className="h-96 lg:h-96 overflow-y-scroll lg:overflow-x-hidden">
              <div className="bg-white rounded-lg shadow-xs">
                <table className="min-w-full leading-normal table-auto">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        S.No
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Photo
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Employee Id
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Staff Name
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Email
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Phone no.
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Designation
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Edit
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Delete
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        View
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedStaffs.map((staffItem, index) => (
                      <tr
                        key={staffItem.user_id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-100"
                        } hover:bg-gray-50`}
                      >
                        <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                          <p className="text-gray-900 whitespace-no-wrap relative top-2">
                            {index + 1}
                          </p>
                        </td>
                        <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                          <img
                            src={
                              staffItem.get_teacher.teacher_image_name
                                ? `${API_URL}/uploads/${staffItem.get_teacher.teacher_image_name}`
                                : "https://via.placeholder.com/50"
                            }
                            alt={staffItem.get_teacher.name}
                            className="rounded-full w-8 h-8 lg:w-10 lg:h-10 object-cover"
                          />
                          {console.log(
                            "this is staffitems",
                            staffItem.get_teacher.employee_id
                          )}
                          {console.log("this is staffitems", staffItem)}
                        </td>
                        <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                          <p className="text-gray-900 whitespace-no-wrap relative top-2">
                            {staffItem.get_teacher?.employee_id}
                          </p>
                        </td>
                        <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                          <p className="text-gray-900 whitespace-no-wrap relative top-2">
                            {staffItem.get_teacher.name}
                          </p>
                        </td>
                        <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                          <p className="text-gray-900 whitespace-no-wrap relative top-2">
                            {staffItem.get_teacher.email}
                          </p>
                        </td>
                        <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                          <p className="text-gray-900 whitespace-no-wrap relative top-2">
                            {staffItem.get_teacher.phone}
                          </p>
                        </td>
                        <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                          <p className="text-gray-900 whitespace-no-wrap relative top-2">
                            {staffItem.get_teacher.designation}
                          </p>
                        </td>

                        <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                          <button
                            className="text-blue-600 hover:text-blue-800 hover:bg-transparent "
                            onClick={() => handleEdit(staffItem)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        </td>
                        <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                          <button
                            className="text-red-600 hover:text-red-800 hover:bg-transparent "
                            onClick={() => handleDelete(staffItem.user_id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>

                        {/* <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleEdit(staffItem)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        </td>
                        <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(staffItem.user_id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td> */}
                        <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                          <button
                            className="text-blue-600 hover:text-blue-800 hover:bg-transparent "
                            onClick={() => handleView(staffItem)}
                          >
                            <MdOutlineRemoveRedEye className="font-bold text-xl" />
                            {/* <FontAwesomeIcon icon={faEdit} /> */}
                          </button>
                        </td>

                        {/* <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleView(staffItem)}
                          >
                            <MdOutlineRemoveRedEye />
                          </button>
                        </td> */}
                      </tr>
                    ))}
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
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
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

      {/* {showAddModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Staff</h5>
                <button
                  type="button"
                  className="close"
                  onClick={handleCloseModal}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Staff Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Designation</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newDesignation}
                    onChange={(e) => setNewDesignation(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmitAdd}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {showEditModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Staff</h5>
                <button
                  type="button"
                  className="close"
                  onClick={handleCloseModal}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Staff Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Designation</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newDesignation}
                    onChange={(e) => setNewDesignation(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmitEdit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Staff</h5>
                <button
                  type="button"
                  className="close"
                  onClick={handleCloseModal}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete{" "}
                  {currentStaff && currentStaff.get_teacher.name}?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleSubmitDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StaffList;
