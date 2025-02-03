import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ShowRolesWithMenu() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const pageSize = 10;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get(`${API_URL}/api/show_roles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setRoles(response.data);
        setPageCount(Math.ceil(response.data.length / pageSize));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const message = query.get("message");
    if (message) {
      toast.success(message);
    }
  }, [location.search]);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleManage = (role) => {
    navigate(`/manage-role-access/${role.role_id}`);
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

      <div className="container mt-4">
        <div className="card mx-auto lg:w-3/4 shadow-lg">
          <div className="card-header flex justify-between items-center">
            <h3 className="text-gray-700 mt-1 text-md lg:text-xl">
              Manage Role Access
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
                        Role Name
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Manage Role Access
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedRoles.map((role, index) => (
                      <tr key={role.id}>
                        <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                          {currentPage * pageSize + index + 1}
                        </td>
                        <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                          {role.rolename}
                        </td>
                        <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                          <button
                            className="text-blue-600 hover:text-blue-800 hover:bg-transparent"
                            onClick={() => handleManage(role)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination Container */}
              <div className="flex justify-center mt-4">
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  breakLabel={"..."}
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages pagination"}
                  activeClassName={"active"}
                  previousClassName={"page-item"}
                  nextClassName={"page-item"}
                  pageClassName={"page-item"}
                  breakClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextLinkClassName={"page-link"}
                  pageLinkClassName={"page-link"}
                  breakLinkClassName={"page-link"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShowRolesWithMenu;
