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

function LeaveApplicaton() {
  const API_URL = import.meta.env.VITE_API_URL; // url for host
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentLeave, setCurrentLeave] = useState(null);
  const [currentLeaveName, setCurrentLeaveName] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const pageSize = 10;
  const navigate = useNavigate();
  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        `${API_URL}/api/get_leaveapplicationlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setStaffs(response.data.data);
      setPageCount(Math.ceil(response.data.data.length / pageSize));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  console.log("the response of the stafflist", staffs);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setCurrentLeave(null);
  };

  const handleSubmitEdit = (leave) => {
    console.log("this is the inside handle submit", leave.leave_app_id);
    navigate(`/leaveApplication/edit/${leave.leave_app_id}`, {
      state: { staffleave: leave },
    });
  };

  const handleDelete = (leaveCurrent) => {
    console.log("this is staffUe leave", leaveCurrent.leave_app_id);
    setCurrentLeave(leaveCurrent.leave_app_id);
    setCurrentLeaveName(leaveCurrent.name);
    setShowDeleteModal(true);
  };

  const handleView = async (leave) => {
    console.log("handleview is running on");
    navigate(`/leaveApplication/view/${leave.leave_app_id}`, {
      state: { staffleave: leave },
    });
  };

  const handleSubmitDelete = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token || !currentLeave) {
        throw new Error("Leave Id is missing");
      }

      const response = await axios.delete(
        `${API_URL}/api/delete_leaveapplication/${currentLeave}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      fetchLeaves();
      if (response.status === 200) {
        handleCloseModal();
        toast.success(`${currentLeaveName} deleted successfully!`);
      } else {
        toast.error("Leave Application not found");
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error("Failed to delete staff");
      toast.error(error.response.data.error);
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
      setShowDeleteModal(false);
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2); // Last 2 digits of the year
    return `${day}-${month}-${year}`;
  };

  const filteredStaffs = Array.isArray(staffs)
    ? staffs.filter((leave) => {
        const search = String(searchTerm).toLowerCase();
        return (
          String(leave.name).toLowerCase().includes(search) || // Leave Type
          String(formatDate(leave.leave_start_date))
            .toLowerCase()
            .includes(search) || // Leave Start Date
          String(formatDate(leave.leave_end_date))
            .toLowerCase()
            .includes(search) || // Leave End Date
          String(leave.no_of_days).toLowerCase().includes(search) || // No. of Days
          String(leave.status).toLowerCase().includes(search) // Status
        );
      })
    : [];

  console.log("filetred staff leave", filteredStaffs);

  const displayedStaffs = filteredStaffs.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  return (
    <>
      <ToastContainer />
      <div className="md:container w-full md:w-2/3 md:mx-auto md:mt-4">
        <div className="card mx-auto lg:w-full shadow-lg mt-4">
          <div className="p-2 px-3 bg-gray-100 flex justify-between items-center">
            <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
              Leave Application
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
                onClick={() => navigate("/createLeaveApplication")}
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
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Sr.No
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Leave Type
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Leave Start Date
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Leave End Date
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        No. of Days
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Status
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
                      displayedStaffs.map((leave, index) => (
                        <tr
                          key={leave.leave_app_id}
                          className={`${
                            index % 2 === 0 ? "bg-white" : "bg-gray-100"
                          } hover:bg-gray-50`}
                        >
                          {console.log("leave", leave)}
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {currentPage * pageSize + index + 1}
                            </p>
                          </td>
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2 ">
                              {leave.name}
                            </p>
                          </td>
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {formatDate(leave.leave_start_date)}
                            </p>
                          </td>
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {formatDate(leave.leave_end_date)}
                            </p>
                          </td>

                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2 ">
                              {leave.no_of_days || "-"}
                            </p>
                          </td>
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <p className="text-gray-900 whitespace-no-wrap relative top-2">
                              {leave.status || "-"}
                            </p>
                          </td>
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            {/* {console.log("leave.status",(leave.status)} */}
                            {leave.status === "Apply" && (
                              <button
                                className="text-blue-600 hover:text-blue-800 hover:bg-transparent"
                                onClick={() => handleSubmitEdit(leave)}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                            )}
                          </td>
                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            {leave.status === "Apply" && (
                              <button
                                className="text-red-600 hover:text-red-800 hover:bg-transparent"
                                onClick={() => handleDelete(leave)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            )}
                          </td>

                          <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                            <button
                              className="text-blue-600 hover:text-blue-800 hover:bg-transparent "
                              onClick={() => handleView(leave)}
                            >
                              <MdOutlineRemoveRedEye className="font-bold text-xl" />
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
            </div>
            {/* <div className=" flex justify-center  pt-2 -mb-3  box-border  overflow-hidden"> */}
            {filteredStaffs.length > pageSize && (
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
            )}
            {/* </div> */}
          </div>
        </div>
      </div>
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
                  <p>Are you sure you want to delete: {currentLeaveName}?</p>
                  {console.log("currestStaffDelete", currentLeave)}
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

export default LeaveApplicaton;
