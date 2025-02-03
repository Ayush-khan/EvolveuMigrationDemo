// perfect working but the edit functionality will not wrork is
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
import { RxCross1 } from "react-icons/rx";

function StaffList() {
  const API_URL = import.meta.env.VITE_API_URL; // url for host
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [currentStaffName, setCurrentStaffName] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newStaffName, setNewStaffName] = useState("");
  const [newDesignation, setNewDesignation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const pageSize = 10;
  const navigate = useNavigate();
  const fetchStaffs = async () => {
    setLoading(true);
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
  console.log("the response of the stafflist", staffs);
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // const handleEdit = (staffItem) => {
  //   setCurrentStaff(staffItem);
  //   setNewStaffName(staffItem.get_teacher.name);
  //   setNewDesignation(staffItem.get_teacher.designation);
  //   setShowEditModal(true);
  // };

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

  const handleSubmitEdit = (staffItem) => {
    console.log("this is the )))))))))", staffItem.get_teacher);
    // navigate(`/editStaff/${staffItem.user_id}`
    navigate(
      `/staff/edit/${staffItem.teacher_id}`,

      {
        state: { staff: staffItem },
      }
    );
  };

  //  Code for show the model but i don't want to show the model
  // const handleSubmitEdit = async () => {
  //   try {
  //     const token = localStorage.getItem("authToken");

  //     if (!token || !currentStaff || !currentStaff.get_teacher.employee_id) {
  //       throw new Error("Employee ID is missing");
  //     }

  //     const response = await axios.put(
  //       `${API_URL}/api/teachers/${currentStaff.get_teacher.employee_id}`,
  //       {
  //         name: newStaffName,
  //         designation: newDesignation,
  //         // Add other required fields according to your backend validation
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         withCredentials: true,
  //       }
  //     );

  //     if (response.status === 200) {
  //       fetchStaffs(); // Refresh staff list after successful update
  //       handleCloseModal();
  //       toast.success("Staff updated successfully!");
  //     } else {
  //       toast.error("Failed to update staff");
  //     }
  //   } catch (error) {
  //     console.error("Error editing staff:", error);
  //     toast.error("Failed to update staff");
  //   }
  // };

  const handleDelete = (staffCurrent) => {
    console.log("insise detelt");
    // const staffToDelete = staffs.find((staff) => staff.user_id === id);
    console.log("this is staffUersid", staffCurrent.teacher_id);
    setCurrentStaff(staffCurrent.teacher_id);
    setCurrentStaffName(staffCurrent.name);
    setShowDeleteModal(true);
  };
  const handleView = async (staffItem) => {
    console.log("handleview is running on");
    navigate(
      `/staff/view/${staffItem.teacher_id}`,

      {
        state: { staff: staffItem },
      }
    );
  };

  const handleSubmitDelete = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token || !currentStaff) {
        throw new Error("Teacher ID is missing");
      }

      const response = await axios.delete(
        `${API_URL}/api/teachers/${currentStaff}`,
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
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
      setShowDeleteModal(false);
    }
  };

  const filteredStaffs = staffs.filter((staff) =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedStaffs = filteredStaffs.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error}</p>;

  return (
    <>
      <ToastContainer />
      <div className="container md:mt-4">
        <div className="card mx-auto lg:w-full shadow-lg">
          <div className="p-2 px-3 bg-gray-100 flex justify-between items-center">
            <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
              Staff List
            </h3>
            <div className="box-border flex md:gap-x-2 justify-end md:h-10">
              <div className=" w-1/2 md:w-fit mr-1">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary btn-sm md:h-9 text-xs md:text-sm"
                onClick={() => navigate("/CreateStaff")}
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

          <div className="card-body w-full box-border">
            <div className="h-96 lg:h-96 overflow-y-scroll lg:overflow-x-hidden">
              <div className="bg-white rounded-lg shadow-xs">
                <table className="min-w-full leading-normal table-auto">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Sr.No
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Photo
                      </th>
                      <th className="px-2 w-full md:w-[8%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
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
                    {loading ? (
                      <div className=" absolute left-[4%] w-[100%]  text-center flex justify-center items-center mt-14">
                        <div className=" text-center text-xl text-blue-700">
                          Please wait while data is loading...
                        </div>
                      </div>
                    ) : displayedStaffs.length ? (
                      displayedStaffs.map((staffItem, index) => (
                        <tr
                          key={staffItem.user_id}
                          className={`${
                            index % 2 === 0 ? "bg-white" : "bg-gray-100"
                          } hover:bg-gray-50`}
                        >
                          {console.log(
                            "this is inside the staflist component in the table",
                            staffItem
                          )}
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {currentPage * pageSize + index + 1}
                            </p>
                          </td>
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm py-1">
                            {console.log(
                              "the teacher image",
                              `https://sms.evolvu.in/storage/app/public/teacher_images/${staffItem?.teacher_image_name}`
                            )}

                            <img
                              src={
                                staffItem?.teacher_image_name
                                  ? `https://sms.evolvu.in/storage/app/public/teacher_images/${staffItem?.teacher_image_name}`
                                  : "https://via.placeholder.com/50"
                              }
                              alt={staffItem?.name}
                              className="rounded-full w-8 h-8 lg:w-10 lg:h-10 object-cover"
                            />
                          </td>
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {staffItem?.employee_id}
                            </p>
                          </td>
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {staffItem?.name}{" "}
                              {staffItem?.isDelete == "Y" && (
                                <span className="text-red-500">
                                  (Left school)
                                </span>
                              )}
                            </p>
                          </td>
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {staffItem?.email}
                            </p>
                          </td>
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {staffItem?.phone}
                            </p>
                          </td>
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {staffItem?.designation}
                            </p>
                          </td>

                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <button
                              className="text-blue-600 hover:text-blue-800 hover:bg-transparent "
                              onClick={() => handleSubmitEdit(staffItem)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                          </td>
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <button
                              className="text-red-600 hover:text-red-800 hover:bg-transparent "
                              onClick={() => handleDelete(staffItem)}
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
            {/* <div className="flex justify-center py-4 md:w-full">
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
                containerClassName={"flex space-x-1"}
                pageClassName={"page-item"}
                pageLinkClassName={
                  "page-link px-1 md:px-3 py-1 text-blue-500 border border-gray-300 rounded-md hover:bg-blue-500 hover:text-white"
                }
                previousClassName={"page-item"}
                previousLinkClassName={
                  "page-link px-1 md:px-3 py-1 text-blue-500 border border-gray-300 rounded-md hover:bg-blue-500 hover:text-white"
                }
                nextClassName={"page-item"}
                nextLinkClassName={
                  "page-link  px-1 md:px-3 py-1 text-blue-500 border border-gray-300 rounded-md hover:bg-blue-500 hover:text-white"
                }
                activeClassName={"bg-blue-500 text-white"}
              />
            </div> */}
            <div className=" flex justify-center  pt-2 -mb-3  box-border  overflow-hidden">
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
                containerClassName={"pagination justify-content-center"}
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

      {/* {showEditModal && (
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
      )} */}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal show " style={{ display: "block" }}>
            <div className="modal-dialog  modal-dialog-centered">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title  ">Delete Staff</h5>

                  <RxCross1
                    className="float-end relative mt-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
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
                  <p>Are you sure you want to delete: {currentStaffName}?</p>
                  {console.log("currestStaffDelete", currentStaff)}
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

export default StaffList;

// // for edit functionality
// import axios from "axios";
// import ReactPaginate from "react-paginate";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { useState, useEffect } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { MdOutlineRemoveRedEye } from "react-icons/md";
// import { useNavigate } from "react-router-dom";

// function StaffList() {
//   const API_URL = import.meta.env.VITE_API_URL; // url for host
//   const [staffs, setStaffs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [currentStaff, setCurrentStaff] = useState(null);
//   const [newStaffName, setNewStaffName] = useState("");
//   const [newDesignation, setNewDesignation] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(0);
//   const [pageCount, setPageCount] = useState(0);
//   const pageSize = 10;
//   const navigate = useNavigate();

//   const fetchStaffs = async () => {
//     try {
//       const token = localStorage.getItem("authToken");

//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await axios.get(`${API_URL}/api/staff_list`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         withCredentials: true,
//       });

//       setStaffs(response.data);
//       setPageCount(Math.ceil(response.data.length / pageSize));
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStaffs();
//   }, []);

//   const handlePageClick = (data) => {
//     setCurrentPage(data.selected);
//   };

//   const handleEdit = (staffItem) => {
//     // navigate(`/editStaff/${staffItem.user_id}`
//     navigate(
//       `/staff/${staffItem.user_id}/edit`,

//       {
//         state: { staff: staffItem },
//       }
//     );
//   };

//   const handleAdd = () => {
//     setShowAddModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowAddModal(false);
//     setShowDeleteModal(false);
//     setNewStaffName("");
//     setNewDesignation("");
//     setCurrentStaff(null);
//   };

//   const handleSubmitAdd = async () => {
//     try {
//       const token = localStorage.getItem("authToken");

//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await axios.post(
//         `${API_URL}/api/store_staff`,
//         {
//           name: newStaffName,
//           designation: newDesignation,
//           // Add other required fields according to your backend validation
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           withCredentials: true,
//         }
//       );

//       if (response.status === 201) {
//         fetchStaffs(); // Refresh staff list after successful addition
//         handleCloseModal();
//         toast.success("Staff added successfully!");
//       } else {
//         toast.error("Failed to add staff");
//       }
//     } catch (error) {
//       console.error("Error adding staff:", error);
//       toast.error("Failed to add staff");
//     }
//   };

//   const handleSubmitDelete = async () => {
//     try {
//       const token = localStorage.getItem("authToken");

//       if (!token || !currentStaff || !currentStaff.user_id) {
//         throw new Error("Staff ID is missing");
//       }
//       console.log("cureesentstaffId", currentStaff.get_teacher.teacher_id);
//       const response = await axios.delete(
//         `${API_URL}/api/teachers/${currentStaff.get_teacher.teacher_id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           withCredentials: true,
//         }
//       );

//       if (response.status === 200) {
//         fetchStaffs(); // Refresh staff list after successful deletion
//         handleCloseModal();
//         toast.success("Staff deleted successfully!");
//       } else {
//         toast.error("Failed to delete staff");
//       }
//     } catch (error) {
//       console.error("Error deleting staff:", error);
//       toast.error("Failed to delete staff");
//     }
//   };

//   const handleDelete = (id) => {
//     const staffToDelete = staffs.find((staff) => staff.user_id === id);
//     setCurrentStaff(staffToDelete);
//     setShowDeleteModal(true);
//   };

//   const handleView = () => {
//     console.log("handleview is running on");
//   };

//   const filteredStaffs = staffs.filter((staff) =>
//     staff.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const displayedStaffs = filteredStaffs.slice(
//     currentPage * pageSize,
//     (currentPage + 1) * pageSize
//   );

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <>
//       <ToastContainer />
//       <div className="container md:mt-4">
//         <div className="card mx-auto lg:w-full shadow-lg">
//           <div className="card-header flex justify-between items-center">
//             <h3 className="text-gray-700 mt-1 text-md lg:text-xl">
//               Staff List
//             </h3>
//             <div className="box-border flex gap-x-2 justify-end md:h-10">
//               <div>
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Search"
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//               <button
//                 className="btn btn-primary btn-sm h-9"
//                 onClick={() => navigate("/CreateStaff")}
//               >
//                 <FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }} />
//                 Add
//               </button>
//             </div>
//           </div>

//           <div className="card-body w-full box-border">
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
//                         Employee Id
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
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {displayedStaffs.map((staffItem, index) => (
//                       <tr key={staffItem.user_id}>
//                         <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
//                           {currentPage * pageSize + index + 1}
//                         </td>
//                         <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
//                           <img
//                             src={staffItem.photo}
//                             alt="Staff"
//                             className="w-8 h-8 rounded-full mx-auto"
//                           />
//                         </td>
//                         <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
//                           {staffItem.emp_id}
//                         </td>
//                         <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
//                           {staffItem.name}
//                         </td>
//                         <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
//                           {staffItem.email}
//                         </td>
//                         <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
//                           {staffItem.phone}
//                         </td>
//                         <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
//                           {staffItem.designation}
//                         </td>
//                         <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
//                           <button
//                             className="btn btn-sm btn-outline-primary"
//                             onClick={() => handleEdit(staffItem)}
//                           >
//                             <FontAwesomeIcon icon={faEdit} />
//                           </button>
//                         </td>
//                         <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
//                           <button
//                             className="btn btn-sm btn-outline-danger"
//                             onClick={() => handleDelete(staffItem.user_id)}
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
//           </div>

//           <div className="flex justify-end mt-4">
//             <ReactPaginate
//               previousLabel={"Previous"}
//               nextLabel={"Next"}
//               breakLabel={"..."}
//               breakClassName={"break-me"}
//               pageCount={pageCount}
//               marginPagesDisplayed={2}
//               pageRangeDisplayed={5}
//               onPageChange={handlePageClick}
//               containerClassName={"pagination"}
//               subContainerClassName={"pages pagination"}
//               activeClassName={"active"}
//             />
//           </div>
//         </div>
//       </div>

//       {showAddModal && (
//         <div
//           className="modal fade show"
//           style={{ display: "block" }}
//           tabIndex="-1"
//           role="dialog"
//         >
//           <div className="modal-dialog" role="document">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Add Staff</h5>
//                 <button
//                   type="button"
//                   className="close"
//                   onClick={handleCloseModal}
//                 >
//                   <span>&times;</span>
//                 </button>
//               </div>
//               <div className="modal-body">
//                 <form>
//                   <div className="form-group">
//                     <label>Staff Name</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={newStaffName}
//                       onChange={(e) => setNewStaffName(e.target.value)}
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label>Designation</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={newDesignation}
//                       onChange={(e) => setNewDesignation(e.target.value)}
//                     />
//                   </div>
//                   {/* Add other fields as needed */}
//                 </form>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={handleCloseModal}
//                 >
//                   Close
//                 </button>
//                 <button
//                   type="button"
//                   className="btn btn-primary"
//                   onClick={handleSubmitAdd}
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showDeleteModal && (
//         <div
//           className="modal fade show"
//           style={{ display: "block" }}
//           tabIndex="-1"
//           role="dialog"
//         >
//           <div className="modal-dialog" role="document">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Delete Staff</h5>
//                 <button
//                   type="button"
//                   className="close"
//                   onClick={handleCloseModal}
//                 >
//                   <span>&times;</span>
//                 </button>
//               </div>
//               <div className="modal-body">
//                 <p>Are you sure you want to delete this staff?</p>
//                 <p>{currentStaff?.name}</p>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={handleCloseModal}
//                 >
//                   Close
//                 </button>
//                 <button
//                   type="button"
//                   className="btn btn-danger"
//                   onClick={handleSubmitDelete}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default StaffList;
