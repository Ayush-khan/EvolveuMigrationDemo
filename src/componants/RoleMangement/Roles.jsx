import { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RxCross1 } from "react-icons/rx";

function Roles() {
  const API_URL = import.meta.env.VITE_API_URL; // URL for host
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleID, setNewnewRoleID] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [newStatus, setNewStatus] = useState("Active");

  const [pageCount, setPageCount] = useState(0);
  const pageSize = 10;

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${API_URL}/api/roles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setRoles(response.data.data);
      setPageCount(Math.ceil(response.data.data.length / pageSize));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleEdit = (role) => {
    setCurrentRole(role);
    setNewRoleName(role.rolename);
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setNewRoleName("");
    setCurrentRole(null);
  };

  const handleSubmitAdd = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.post(
        `${API_URL}/api/roles`,
        { rolename: newRoleName, role_id: newRoleID },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      fetchRoles();
      handleCloseModal();
      toast.success("Role added successfully!");
    } catch (error) {
      console.error("Error adding role:", error);
      toast.error("Error adding role.");
    }
  };

  const handleSubmitEdit = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token or academic year found");
      }

      await axios.put(
        `${API_URL}/api/roles/${currentRole.role_id}`,
        {
          rolename: newRoleName,
          is_active: newStatus === "Active" ? "Y" : "N",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      fetchRoles();
      handleCloseModal();
      toast.success("Role updated successfully!");
    } catch (error) {
      console.error("Error editing role:", error);
      toast.error("Error updating role.");
    }
  };

  const handleDelete = (id) => {
    const roleToDelete = roles.find((role) => role.id === id);
    setCurrentRole(roleToDelete);
    setShowDeleteModal(true);
  };

  const handleSubmitDelete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const academicYr = localStorage.getItem("academicYear");

      if (!token || !currentRole || !currentRole.role_id) {
        throw new Error("Role ID is missing");
      }

      await axios.delete(`${API_URL}/api/roles/${currentRole.role_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Academic-Year": academicYr,
        },
        withCredentials: true,
      });

      fetchRoles();
      setShowDeleteModal(false);
      setCurrentRole(null);
      toast.success("Role deleted successfully!");
    } catch (error) {
      console.error("Error deleting role:", error);
      setError(error.message);
      toast.error("Error deleting role.");
    }
  };

  const filteredRoles = roles.filter((role) =>
    role.rolename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedRoles = filteredRoles.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <ToastContainer />

      <div className="container md:mt-4">
        <div className="card mx-auto lg:w-3/4 shadow-lg">
          <div className="card-header flex justify-between items-center">
            <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
              Roles
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
                onClick={handleAdd}
              >
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }} />
                Add
              </button>
            </div>
          </div>

          <div className="card-body w-full">
            <div className="h-96 lg:h-96 overflow-y-scroll lg:overflow-x-hidden">
              <div className="bg-white rounded-lg shadow-xs">
                <table className="min-w-full leading-normal table-auto">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        S.No
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Name
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Role Id
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Status
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Edit
                      </th>
                      {/* <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                                Delete
                                            </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {displayedRoles.map((role, index) => (
                      <tr
                        key={role.id}
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
                          <p className="text-gray-900 whitespace-no-wrap relative top-2">
                            {role.rolename}
                          </p>
                        </td>
                        <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                          <p className="text-gray-900 whitespace-no-wrap relative top-2">
                            {role.role_id}
                          </p>
                        </td>
                        <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                          <p className="text-gray-900 whitespace-no-wrap relative top-2">
                            {role.is_active === "Y" ? "Active" : "Inactive"}
                          </p>
                        </td>
                        <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                          <button
                            className="text-blue-600 hover:text-blue-800 hover:bg-transparent"
                            onClick={() => handleEdit(role)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        </td>
                        {/* <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                                                    <button
                                                        className="text-red-600 hover:text-red-800 hover:bg-transparent"
                                                        onClick={() => handleDelete(role.id)}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <ReactPaginate
                previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel={"..."}
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
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                activeClassName={"active"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className=" modal-header flex justify-between items-center">
                  <h5 className="modal-title ">Add Role</h5>
                  <RxCross1
                    className=" float-right  text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                    onClick={handleCloseModal}
                  />
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="role_id">Role ID</label>
                    <input
                      type="text"
                      className="form-control"
                      id="role_id"
                      value={newRoleID}
                      onChange={(e) => setNewnewRoleID(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="roleName">Role Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="roleName"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmitAdd}
                  >
                    Add Role
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditModal && currentRole && (
        <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div
              className="modal-dialog  modal-dialog-centered"
              role="document"
            >
              <div className="modal-content">
                <div className="modal-header flex justify-between items-center">
                  <h5 className="modal-title">Edit Role</h5>
                  <RxCross1
                    className=" float-right  text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                    onClick={handleCloseModal}
                  />
                </div>
                <div className="modal-body">
                  <div className="form-group" style={{ marginBottom: "-15px" }}>
                    <label htmlFor="roleName">Role Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="roleName"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="roleStatus">Status</label>
                    <select
                      className="form-control"
                      id="roleStatus"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      <option value="Y">Active</option>
                      <option value="N">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmitEdit}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Role Modal */}
      {showDeleteModal && currentRole && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Role</h5>
                <button
                  type="button"
                  className="close"
                  onClick={handleCloseModal}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete the role{" "}
                  <strong>{currentRole.rolename}</strong>?
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

export default Roles;
