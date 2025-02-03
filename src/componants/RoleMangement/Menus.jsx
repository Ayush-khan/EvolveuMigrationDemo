import { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Menus() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [menus, setMenus] = useState([]);
  const [allMenus, setAllMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    parent_id: "",
    sequence: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const pageSize = 10;

  const fetchMenus = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) throw new Error("No authentication token found");

      const [allMenusResponse, paginatedResponse] = await Promise.all([
        axios.get(`${API_URL}/api/menus`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }),
        axios.get(`${API_URL}/api/menus`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }),
      ]);

      setAllMenus(allMenusResponse.data);
      setMenus(paginatedResponse.data);
      setPageCount(Math.ceil(paginatedResponse.data.length / pageSize));
    } catch (error) {
      console.error("Error fetching menus:", error);
      setErrors({ fetch: error.message });
    } finally {
      setLoading(false);
    }
  };

  const getParentName = (parentId) => {
    const parentMenu = allMenus.find((menu) => menu.menu_id === parentId);
    return parentMenu ? parentMenu.name : "None";
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleEdit = (menu) => {
    setCurrentMenu(menu);
    setFormData({
      name: menu.name,
      url: menu.url,
      parent_id: menu.parent_id,
      sequence: menu.sequence,
    });
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setFormData({ name: "", url: "", parent_id: "", sequence: "" });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setCurrentMenu(null);
    setErrors({});
  };

  const handleSubmitAdd = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      await axios.post(`${API_URL}/api/menus`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      fetchMenus();
      handleCloseModal();
      toast.success("Menu added successfully!");
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error adding menu:", error);
        setErrors({ add: error.message });
      }
    }
  };

  const handleSubmitEdit = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) throw new Error("No authentication token found");

      await axios.put(`${API_URL}/api/menus/${currentMenu.menu_id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      fetchMenus();
      handleCloseModal();
      toast.success("Menu updated successfully!");
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error editing menu:", error);
        setErrors({ edit: error.message });
      }
    }
  };

  const handleDelete = (id) => {
    const menuToDelete = menus.find((menu) => menu.menu_id === id);
    setCurrentMenu(menuToDelete);
    setShowDeleteModal(true);
  };

  const handleSubmitDelete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const academicYr = localStorage.getItem("academicYear");

      if (!token || !currentMenu || !currentMenu.menu_id)
        throw new Error("Menu ID is missing");

      await axios.delete(`${API_URL}/api/menus/${currentMenu.menu_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Academic-Year": academicYr,
        },
        withCredentials: true,
      });

      fetchMenus();
      setShowDeleteModal(false);
      setCurrentMenu(null);
      toast.success("Menu deleted successfully!");
    } catch (error) {
      console.error("Error deleting menu:", error);
      setErrors({ delete: error.message });
    }
  };

  const filteredMenus = menus.filter((menu) =>
    menu.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedMenus = filteredMenus.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  if (loading) return <p>Loading...</p>;
  if (errors.fetch) return <p>Error: {errors.fetch}</p>;

  return (
    <>
      <ToastContainer />

      <div className="container mt-4">
        <div className="card mx-auto lg:w-3/4 shadow-lg">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3 className="text-lg font-semibold">Menus</h3>
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control me-3"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="btn btn-primary btn-sm"
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "36px",
                }}
                onClick={handleAdd}
              >
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }} />
                Add
              </button>
            </div>
          </div>

          <div className="card-body">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>URL</th>
                  <th>Parent</th>
                  <th>Sequence</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedMenus.map((menu) => (
                  <tr key={menu.menu_id}>
                    <td>{menu.name}</td>
                    <td>{menu.url}</td>
                    <td>{getParentName(menu.parent_id)}</td>
                    <td>{menu.sequence}</td>
                    <td>
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEdit(menu)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      {/* <button
                                                className="text-red-600 hover:text-red-800 ms-2"
                                                onClick={() => handleDelete(menu.menu_id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card-footer">
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
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

      {/* Add Menu Modal */}
      <div
        className={`modal fade ${showAddModal ? "show" : ""}`}
        style={{ display: showAddModal ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="addMenuModalLabel"
        aria-hidden={!showAddModal}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addMenuModalLabel">
                Add Menu
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="menuName" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="menuName"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  {errors.name && (
                    <small className="text-danger">{errors.name}</small>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="menuUrl" className="form-label">
                    URL
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="menuUrl"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                  />
                  {errors.url && (
                    <small className="text-danger">{errors.url}</small>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="parentId" className="form-label">
                    Parent
                  </label>
                  <select
                    className="form-control"
                    id="parentId"
                    value={formData.parent_id}
                    onChange={(e) =>
                      setFormData({ ...formData, parent_id: e.target.value })
                    }
                  >
                    <option value="">None</option>
                    {allMenus
                      .filter((menu) => menu.parent_id === 0)
                      .map((menu) => (
                        <option key={menu.menu_id} value={menu.menu_id}>
                          {menu.name}
                        </option>
                      ))}
                  </select>
                  {errors.parent_id && (
                    <small className="text-danger">{errors.parent_id}</small>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="menuSequence" className="form-label">
                    Sequence
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="menuSequence"
                    value={formData.sequence}
                    onChange={(e) =>
                      setFormData({ ...formData, sequence: e.target.value })
                    }
                  />
                  {errors.sequence && (
                    <small className="text-danger">{errors.sequence}</small>
                  )}
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmitAdd}
                >
                  Add Menu
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Menu Modal */}
      <div
        className={`modal fade ${showEditModal ? "show" : ""}`}
        style={{ display: showEditModal ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="editMenuModalLabel"
        aria-hidden={!showEditModal}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editMenuModalLabel">
                Edit Menu
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="editMenuName" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="editMenuName"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  {errors.name && (
                    <small className="text-danger">{errors.name}</small>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="editMenuUrl" className="form-label">
                    URL
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="editMenuUrl"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                  />
                  {errors.url && (
                    <small className="text-danger">{errors.url}</small>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="editParentId" className="form-label">
                    Parent
                  </label>
                  <select
                    className="form-control"
                    id="editParentId"
                    value={formData.parent_id}
                    onChange={(e) =>
                      setFormData({ ...formData, parent_id: e.target.value })
                    }
                  >
                    <option value="">None</option>
                    {allMenus
                      .filter((menu) => menu.parent_id === 0)
                      .map((menu) => (
                        <option key={menu.menu_id} value={menu.menu_id}>
                          {menu.name}
                        </option>
                      ))}
                  </select>
                  {errors.parent_id && (
                    <small className="text-danger">{errors.parent_id}</small>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="editMenuSequence" className="form-label">
                    Sequence
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="editMenuSequence"
                    value={formData.sequence}
                    onChange={(e) =>
                      setFormData({ ...formData, sequence: e.target.value })
                    }
                  />
                  {errors.sequence && (
                    <small className="text-danger">{errors.sequence}</small>
                  )}
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmitEdit}
                >
                  Update Menu
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Menu Modal */}
      <div
        className={`modal fade ${showDeleteModal ? "show" : ""}`}
        style={{ display: showDeleteModal ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="deleteMenuModalLabel"
        aria-hidden={!showDeleteModal}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteMenuModalLabel">
                Delete Menu
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete the menu "{currentMenu?.name}"?
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Cancel
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
    </>
  );
}

export default Menus;
