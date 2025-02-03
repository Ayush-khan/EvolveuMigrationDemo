import axios from "axios";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { FaCheck } from "react-icons/fa";

function ExamTImeTable() {
  const API_URL = import.meta.env.VITE_API_URL; // url for host
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [currentStaffName, setCurrentStaffName] = useState(null);

  const [newStaffName, setNewStaffName] = useState("");
  const [newDesignation, setNewDesignation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const pageSize = 10;
  const [showDActiveModal, setShowDActiveModal] = useState(false);
  const [currentStudentDataForActivate, setCurrentStudentDataForActivate] =
    useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    fetchStaffs();
  }, []);
  const fetchStaffs = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${API_URL}/api/get_timetablelist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setStaffs(response.data.data);
      setPageCount(Math.ceil(response?.data?.data.length / pageSize));
      console.log("pageCount", pageCount);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  console.log("the response of the stafflist", staffs);

  const handleActivateOrNot = async (staffItem) => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");

      if (!token || !staffItem?.exam_tt_id) {
        throw new Error("Exam Timetable ID is missing");
      }

      // Determine API URL based on publish status
      const apiUrl =
        staffItem.publish === "Y"
          ? `${API_URL}/api/update_unpublishtimetable/${staffItem.exam_tt_id}`
          : `${API_URL}/api/update_publishtimetable/${staffItem.exam_tt_id}`;

      // Send the PUT request
      const response = await axios.put(
        apiUrl,
        {}, // Empty data object since no body is needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh the list of staff to reflect the changes
      fetchStaffs();

      // Close the modal and show a success message
      setShowDActiveModal(false);
      toast.success(
        response?.data?.message ||
          "Exam Time Table Publish/Unpublish Operation successful"
      );
    } catch (error) {
      // Handle errors and show appropriate error messages
      if (error.response && error.response.data) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error(`Error: ${error.message}`);
      }
      console.error("Error in Publish/Unpublish operation:", error);
    } finally {
      // Re-enable the button and close the modal
      setIsSubmitting(false);
      setShowDActiveModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowDActiveModal(false);

    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setNewStaffName("");
    setNewDesignation("");
    setCurrentStaff(null);
  };

  const handleSubmitEdit = (staffItem) => {
    console.log("this is the )))))))))", staffItem.get_teacher);
    // navigate(`/editStaff/${staffItem.user_id}`
    navigate(
      `/examTImeTable/edit/${staffItem.exam_tt_id}`,

      {
        state: { staff: staffItem },
      }
    );
  };

  const handleDelete = (staffCurrent) => {
    console.log("insise detelt");
    // const staffToDelete = staffs.find((staff) => staff.user_id === id);
    console.log("this is staffUersid", staffCurrent.exam_tt_id);
    setCurrentStaff(staffCurrent.exam_tt_id);
    setCurrentStaffName(staffCurrent.name);
    setShowDeleteModal(true);
  };
  const handleView = async (staffItem) => {
    console.log("handleview is running on");
    navigate(
      `/examTImeTable/view/${staffItem.exam_tt_id}`,

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
        throw new Error("Exam Timetable ID is missing");
      }

      const response = await axios.delete(
        `${API_URL}/api/delete_timetable/${currentStaff}`,
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
        toast.success("Exam timetable deleted successfully!");
      } else {
        toast.error("Failed to delete exam timetable");
      }
    } catch (error) {
      console.error("Error deleting exam timetable:", error);
      toast.error("Failed to delete exam timetable");
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
      setShowDeleteModal(false);
    }
  };

  const filteredStaffs = staffs.filter(
    (staff) =>
      staff?.examname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedStaffs = filteredStaffs.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  // Debug logs to ensure correct pagination
  console.log("Filtered Staffs:", filteredStaffs.length);
  console.log("Displayed Staffs:", displayedStaffs.length);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <>
      <ToastContainer />
      <div className="container mx-auto md:mt-4">
        <div className="card mx-auto lg:w-3/4 shadow-lg">
          <div className="p-2 px-3 bg-gray-100 flex justify-between items-center">
            <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
              Exam Timetable
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
                onClick={() => navigate("/creaExamTimeTable")}
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
                    <tr className="bg-gray-200">
                      <th className="px-2 w-full md:w-[10%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Sr.No
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Class
                      </th>

                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Exam
                      </th>
                      <th className="px-2 w-full md:w-[10%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Edit
                      </th>
                      <th className="px-2 w-full md:w-[10%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Delete
                      </th>
                      <th className="px-2 w-full md:w-[10%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Publish
                      </th>
                      <th className="px-2 w-full md:w-[10%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
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
                          key={staffItem.exam_tt_id} // Use a unique key like `exam_id`
                          className={`${
                            index % 2 === 0 ? "bg-white" : "bg-gray-100"
                          } hover:bg-gray-50`}
                        >
                          {/* Serial Number */}
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {/* {index + 1} */}
                              {currentPage * pageSize + index + 1}
                            </p>
                          </td>

                          {/* Name */}
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {staffItem?.name}
                            </p>
                          </td>

                          {/* Exam Name */}
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {staffItem?.examname}
                            </p>
                          </td>

                          {/* Edit and Delete Buttons */}
                          {staffItem.publish === "N" ? (
                            <>
                              <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                                <button
                                  className="text-blue-600 hover:text-blue-800 hover:bg-transparent"
                                  onClick={() => handleSubmitEdit(staffItem)}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </button>
                              </td>
                              <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                                <button
                                  className="text-red-600 hover:text-red-800 hover:bg-transparent"
                                  onClick={() => handleDelete(staffItem)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </td>
                            </>
                          ) : (
                            <>
                              {/* Empty cells for alignment */}
                              <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm"></td>
                              <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm"></td>
                            </>
                          )}

                          {/* Publish Status */}
                          <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm hover:bg-none">
                            <button
                              onClick={() => {
                                setCurrentStudentDataForActivate({
                                  studentToActiveOrDeactive: staffItem,
                                });
                                setShowDActiveModal(true);
                              }}
                              className={`font-bold hover:bg-none ${
                                staffItem.publish === "Y"
                                  ? "text-green-600 hover:text-green-800 hover:bg-transparent"
                                  : "text-red-700 hover:text-red-900 hover:bg-transparent"
                              }`}
                            >
                              {staffItem.publish === "Y" ? (
                                <FaCheck className="text-xl" />
                              ) : (
                                <FontAwesomeIcon
                                  icon={faXmark}
                                  className="text-xl"
                                />
                              )}
                            </button>
                          </td>

                          {/* View Button */}
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            {staffItem.publish === "Y" ? (
                              <button
                                className="text-blue-600 hover:text-blue-800 hover:bg-transparent"
                                onClick={() => handleView(staffItem)}
                              >
                                <MdOutlineRemoveRedEye className="font-bold text-xl" />
                              </button>
                            ) : (
                              <></>
                            )}
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
            </div>

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
      {showDActiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title">Confirm Publish or Unpublish</h5>
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
                  Are you sure you want to{" "}
                  {currentStudentDataForActivate?.studentToActiveOrDeactive
                    ?.publish === "Y"
                    ? "unpublish"
                    : "publish"}{" "}
                  the exam timetable for class{" "}
                  {` ${currentStudentDataForActivate?.studentToActiveOrDeactive?.name}`}
                  ?
                </div>
                <div className="flex justify-end p-3">
                  <button
                    type="button"
                    className="btn btn-primary px-3 mb-2"
                    onClick={() =>
                      handleActivateOrNot(
                        currentStudentDataForActivate.studentToActiveOrDeactive
                      )
                    }
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Processing..."
                      : currentStudentDataForActivate?.studentToActiveOrDeactive
                          ?.publish === "Y"
                      ? "Unpublish"
                      : "Publish"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal show " style={{ display: "block" }}>
            <div className="modal-dialog  modal-dialog-centered">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title  ">Delete Exam Timetable</h5>

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
                  <p>
                    Are you sure you want to delete the exam timetable for
                    class: {currentStaffName}?
                  </p>
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

export default ExamTImeTable;
