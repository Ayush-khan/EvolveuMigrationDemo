import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ManageRoleAccess() {
  const { roleId } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;
  const [role, setRole] = useState({});
  const navigate = useNavigate();
  const [menuList, setMenuList] = useState([]);
  const [selectedMenus, setSelectedMenus] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoleAndMenus = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get(
          `${API_URL}/api/show_access/${roleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log("roleid in the access role", roleId);

        setRole(response.data.role);
        setMenuList(response.data.menuList);
        setSelectedMenus(new Set(response.data.assignedMenuIds)); // Set initial selected menus
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleAndMenus();
  }, [roleId]);

  const handleCheckboxChange = (menuId) => {
    setSelectedMenus((prevSelectedMenus) => {
      const updatedSelectedMenus = new Set(prevSelectedMenus);
      if (updatedSelectedMenus.has(menuId)) {
        updatedSelectedMenus.delete(menuId);
      } else {
        updatedSelectedMenus.add(menuId);
      }
      return updatedSelectedMenus;
    });
  };

  const handleSelectAllChange = (event) => {
    if (event.target.checked) {
      setSelectedMenus(new Set(menuList.map((menu) => menu.menu_id)));
    } else {
      setSelectedMenus(new Set());
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.post(
        `${API_URL}/api/update_access/${roleId}`,
        {
          role_id: role.id,
          menu_ids: Array.from(selectedMenus),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Access updated successfully!");
      navigate("/show_roles");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <ToastContainer />
      <div className="container mt-4">
        <div className="card mx-auto lg:w-3/4 shadow-lg">
          <div className="card-header">
            <h3 className="text-gray-700 mt-1 text-md lg:text-xl">
              Role: {role.rolename} Access Details
            </h3>
          </div>
          <div className="card-body">
            <h5 className="text-center mb-4">List of URLs</h5>
            <form onSubmit={handleSubmit}>
              <div className="table-responsive">
                <table className="table table-bordered table-hover text-left align-middle">
                  <thead>
                    <tr>
                      <th style={{ width: "15%" }}>ID</th>
                      <th style={{ width: "50%" }}>Name</th>
                      <th style={{ width: "20%" }}>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="select_all"
                            onChange={handleSelectAllChange}
                            checked={
                              menuList.length > 0 &&
                              menuList.every((menu) =>
                                selectedMenus.has(menu.menu_id)
                              )
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="select_all"
                          >
                            Select All
                          </label>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuList.map((menu) => (
                      <tr key={menu.menu_id}>
                        <td>{menu.menu_id}</td>
                        <td
                          style={{
                            fontWeight:
                              menu.parent_id === 0 ? "bold" : "normal",
                            paddingLeft: menu.parent_id !== 0 ? "30px" : "0",
                          }}
                        >
                          {menu.name}
                        </td>
                        <td>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="selected_access[]"
                              id={`access_${menu.menu_id}`}
                              value={menu.menu_id}
                              checked={selectedMenus.has(menu.menu_id)}
                              onChange={() =>
                                handleCheckboxChange(menu.menu_id)
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`access_${menu.menu_id}`}
                            ></label>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageRoleAccess;
