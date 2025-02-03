// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import ReactPaginate from "react-paginate";
// import NavBar from "../Header/NavBar";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function Sections() {
//     const [sections, setSections] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [showAddModal, setShowAddModal] = useState(false);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [currentSection, setCurrentSection] = useState(null);
//     const [newSectionName, setNewSectionName] = useState('');
//     const [searchTerm, setSearchTerm] = useState('');
//     const [currentPage, setCurrentPage] = useState(0);
//     const [pageCount, setPageCount] = useState(0);
//     const pageSize = 20;

//     const fetchSections = async () => {
//         try {
//             const token = localStorage.getItem('authToken');
//             const academicYr = localStorage.getItem('academicYear');

//             if (!token || !academicYr) {
//                 throw new Error('No authentication token or academic year found');
//             }

//             const response = await axios.get('http://127.0.0.1:8000/api/sections', {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'X-Academic-Year': academicYr,
//                 },
//                 withCredentials: true,
//             });

//             setSections(response.data);
//             setPageCount(Math.ceil(response.data.length / pageSize));
//         } catch (error) {
//             setError(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchSections();
//     }, []);

//     const handlePageClick = (data) => {
//         setCurrentPage(data.selected);
//     };

//     const handleEdit = (section) => {
//         setCurrentSection(section);
//         setNewSectionName(section.name);
//         setShowEditModal(true);
//     };

//     const handleAdd = () => {
//         setShowAddModal(true);
//     };

//     const handleCloseModal = () => {
//         setShowAddModal(false);
//         setShowEditModal(false);
//         setShowDeleteModal(false);
//         setNewSectionName('');
//         setCurrentSection(null);
//     };

//     const handleSubmitAdd = async () => {
//         try {
//             const token = localStorage.getItem('authToken');
//             const academicYr = localStorage.getItem('academicYear');

//             if (!token || !academicYr) {
//                 throw new Error('No authentication token or academic year found');
//             }

//             await axios.post(
//                 'http://127.0.0.1:8000/api/sections',
//                 { name: newSectionName },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'X-Academic-Year': academicYr,
//                     },
//                     withCredentials: true,
//                 }
//             );

//             fetchSections();
//             handleCloseModal();
//             toast.success('Section added successfully!');

//         } catch (error) {
//             console.error('Error adding section:', error);
//         }
//     };

//     const handleSubmitEdit = async () => {
//         try {
//             const token = localStorage.getItem('authToken');
//             const academicYr = localStorage.getItem('academicYear');

//             if (!token || !academicYr) {
//                 throw new Error('No authentication token or academic year found');
//             }

//             await axios.put(
//                 `http://127.0.0.1:8000/api/sections/${currentSection.department_id}`,
//                 { name: newSectionName },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'X-Academic-Year': academicYr,
//                     },
//                     withCredentials: true,
//                 }
//             );

//             fetchSections();
//             handleCloseModal();
//         } catch (error) {
//             console.error('Error editing section:', error);
//         }
//     };

//     const handleDelete = (id) => {
//         const sectionToDelete = sections.find(sec => sec.department_id === id);
//         setCurrentSection(sectionToDelete);
//         setShowDeleteModal(true);
//     };

//     const handleSubmitDelete = async () => {
//         try {
//             const token = localStorage.getItem('authToken');
//             const academicYr = localStorage.getItem('academicYear');

//             if (!token || !academicYr || !currentSection || !currentSection.department_id) {
//                 throw new Error('Section ID is missing');
//             }

//             await axios.delete(
//                 `http://127.0.0.1:8000/api/sections/${currentSection.department_id}`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'X-Academic-Year': academicYr,
//                     },
//                     withCredentials: true,
//                 }
//             );

//             fetchSections();
//             setShowDeleteModal(false);
//             setCurrentSection(null);
//             toast.success('Section deleted successfully!');

//         } catch (error) {
//             console.error('Error deleting section:', error);
//             setError(error.message);
//         }
//     };

//     const filteredSections = sections.filter(section =>
//         section.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const displayedSections = filteredSections.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>Error: {error}</p>;

//     return (
//         <>
//             <NavBar />
//             <ToastContainer />

//             <div className="container mt-4">
//                 <div className="card" style={{ margin: '0 auto', width: '70%' }}>
//                     <div className="card-header d-flex justify-content-between align-items-center">
//                         <h3>Sections</h3>
//                         <button className="btn btn-primary btn-sm" style={{ width: '80px' }} onClick={handleAdd}>
//                             <FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />
//                             Add
//                         </button>
//                     </div>
//                     <div className="card-body">
//                         <div className="d-flex justify-content-end mb-3">
//                             <input
//                                 type="text"
//                                 className="form-control w-50"
//                                 placeholder="Search by name"
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                             />
//                         </div>
//                         <div className="table-responsive">
//                             <table className="table table-bordered table-striped">
//                                 <thead>
//                                     <tr>
//                                         <th>Name</th>
//                                         <th>Edit</th>
//                                         <th>Delete</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {displayedSections.map((section) => (
//                                         <tr key={section.department_id}>
//                                             <td>{section.name}</td>
//                                             <td className="text-center">
//                                                 <FontAwesomeIcon
//                                                     icon={faEdit}
//                                                     className="text-warning"
//                                                     onClick={() => handleEdit(section)}
//                                                     style={{ cursor: 'pointer', fontSize: '1.5em' }}
//                                                 />
//                                             </td>
//                                             <td className="text-center">
//                                                 <FontAwesomeIcon
//                                                     icon={faTrash}
//                                                     className="text-danger"
//                                                     onClick={() => handleDelete(section.department_id)}
//                                                     style={{ cursor: 'pointer', fontSize: '1.5em' }}
//                                                 />
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                         <div className="d-flex justify-content-center mt-3">
//                             <ReactPaginate
//                                 previousLabel={'previous'}
//                                 nextLabel={'next'}
//                                 breakLabel={'...'}
//                                 breakClassName={'page-item'}
//                                 breakLinkClassName={'page-link'}
//                                 pageCount={pageCount}
//                                 marginPagesDisplayed={2}
//                                 pageRangeDisplayed={5}
//                                 onPageChange={handlePageClick}
//                                 containerClassName={'pagination justify-content-center'}
//                                 pageClassName={'page-item'}
//                                 pageLinkClassName={'page-link'}
//                                 previousClassName={'page-item'}
//                                 previousLinkClassName={'page-link'}
//                                 nextClassName={'page-item'}
//                                 nextLinkClassName={'page-link'}
//                                 activeClassName={'active'}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Modal for adding a new section */}
//             {showAddModal && (
//                 <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//                     <div className="modal-dialog modal-dialog-centered">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h5 className="modal-title">Add New Section</h5>
//                                 <button type="button" className="btn-close" onClick={handleCloseModal}></button>
//                             </div>
//                             <div className="modal-body">
//                                 <div className="mb-3">
//                                     <label htmlFor="sectionName" className="form-label">Section Name</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         id="sectionName"
//                                         value={newSectionName}
//                                         onChange={(e) => setNewSectionName(e.target.value)}
//                                     />
//                                 </div>
//                             </div>
//                             <div className="modal-footer d-flex justify-content-end">
//                                 {/* <button type="button" className="btn btn-secondary me-2" onClick={handleCloseModal}>Cancel</button> */}
//                                 <button type="button" className="btn btn-primary" style={{ marginRight: '40px' }} onClick={handleSubmitAdd}>Add</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Modal for editing a section */}
//             {showEditModal && (
//                 <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//                     <div className="modal-dialog modal-dialog-centered">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h5 className="modal-title">Edit Section</h5>
//                                 <button type="button" className="btn-close" onClick={handleCloseModal}></button>
//                             </div>
//                             <div className="modal-body">
//                                 <div className="mb-3">
//                                     <label htmlFor="editSectionName" className="form-label">New Section Name</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         id="editSectionName"
//                                         value={newSectionName}
//                                         onChange={(e) => setNewSectionName(e.target.value)}
//                                     />
//                                 </div>
//                             </div>
//                             <div className="modal-footer">
//                                 {/* <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button> */}
//                                 <button type="button" className="btn btn-primary" style={{ marginRight: '40px' }} onClick={handleSubmitEdit}>Update</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Modal for confirming deletion */}
//             {showDeleteModal && (
//                 <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//                     <div className="modal-dialog modal-dialog-centered">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h5 className="modal-title">Confirm Deletion</h5>
//                                 <button type="button" className="btn-close" onClick={handleCloseModal}></button>
//                             </div>
//                             <div className="modal-body">
//                                 <p>Are you sure you want to delete section: <strong>{currentSection.name}</strong>?</p>
//                             </div>
//                             <div className="modal-footer">
//                                 {/* <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button> */}
//                                 <button type="button" className="btn btn-danger" style={{ marginRight: '40px' }} onClick={handleSubmitDelete}>Delete</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     )
// }
// export default Sections;
import { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import NavBar from "../../Layouts/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Sections() {
  const API_URL = import.meta.env.VITE_API_URL; // url for host
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [newSectionName, setNewSectionName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const pageSize = 10;

  const fetchSections = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const academicYr = localStorage.getItem("academicYear");

      if (!token || !academicYr) {
        throw new Error("No authentication token or academic year found");
      }

      const response = await axios.get(`${API_URL}/api/sections`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Academic-Year": academicYr,
        },
        withCredentials: true,
      });

      setSections(response.data);
      setPageCount(Math.ceil(response.data.length / pageSize));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleEdit = (section) => {
    setCurrentSection(section);
    setNewSectionName(section.name);
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setNewSectionName("");
    setCurrentSection(null);
  };

  const handleSubmitAdd = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const academicYr = localStorage.getItem("academicYear");

      if (!token || !academicYr) {
        throw new Error("No authentication token or academic year found");
      }

      await axios.post(
        `${API_URL}/api/sections`,
        { name: newSectionName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Academic-Year": academicYr,
          },
          withCredentials: true,
        }
      );

      fetchSections();
      handleCloseModal();
      toast.success("Section added successfully!");
    } catch (error) {
      console.error("Error adding section:", error);
    }
  };

  const handleSubmitEdit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const academicYr = localStorage.getItem("academicYear");

      if (!token || !academicYr) {
        throw new Error("No authentication token or academic year found");
      }

      await axios.put(
        `${API_URL}/api/sections/${currentSection.department_id}`,
        { name: newSectionName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Academic-Year": academicYr,
          },
          withCredentials: true,
        }
      );

      fetchSections();
      handleCloseModal();
      toast.success("Section Updated successfully!");
    } catch (error) {
      console.error("Error editing section:", error);
    }
  };

  const handleDelete = (id) => {
    const sectionToDelete = sections.find((sec) => sec.department_id === id);
    setCurrentSection(sectionToDelete);
    setShowDeleteModal(true);
  };

  const handleSubmitDelete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const academicYr = localStorage.getItem("academicYear");

      if (
        !token ||
        !academicYr ||
        !currentSection ||
        !currentSection.department_id
      ) {
        throw new Error("Section ID is missing");
      }

      await axios.delete(
        `${API_URL}/api/sections/${currentSection.department_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Academic-Year": academicYr,
          },
          withCredentials: true,
        }
      );

      fetchSections();
      setShowDeleteModal(false);
      setCurrentSection(null);
      toast.success("Section deleted successfully!");
    } catch (error) {
      console.error("Error deleting section:", error);
      setError(error.message);
    }
  };

  const filteredSections = sections.filter((section) =>
    section.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedSections = filteredSections.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      {/* <NavBar /> */}
      <ToastContainer />

      <div className="container mt-4">
        <div className="card mx-auto lg:w-3/4 shadow-lg">
          <div className="card-header flex justify-between items-center">
            <h3 className="text-gray-700 mt-1 text-md lg:text-xl">
              Department
            </h3>
            <div className=" box-border flex gap-x-2  justify-end md:h-10 ">
              <div className="">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search "
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary btn-sm h-9"
                // style={{ width: "80px" }}
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
                        Edit
                      </th>
                      <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedSections.map((section, index) => (
                      <tr
                        key={section.department_id}
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
                            {section.name}
                          </p>
                        </td>

                        <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                          <button
                            className="text-blue-600 hover:text-blue-800 hover:bg-transparent "
                            onClick={() => handleEdit(section)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        </td>

                        <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                          <button
                            className="text-red-600 hover:text-red-800 hover:bg-transparent "
                            onClick={() => handleDelete(section.department_id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className=" flex justify-center  pt-2 -mb-3">
              <ReactPaginate
                previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel={"..."}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
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

      {/* Modal for adding a new section */}
      {showAddModal && (
        <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="modal"
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered ">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Section</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="sectionName" className="form-label">
                      Section Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="sectionName"
                      value={newSectionName}
                      onChange={(e) => setNewSectionName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer d-flex justify-content-end">
                  {/* <button type="button" className="btn btn-secondary me-2" onClick={handleCloseModal}>Cancel</button> */}
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{}}
                    onClick={handleSubmitAdd}
                  >
                    Add
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
              <div className="modal-header">
                <h5 className="modal-title">Edit Section</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="editSectionName" className="form-label">
                    New Section Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="editSectionName"
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                {/* <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button> */}
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{}}
                  onClick={handleSubmitEdit}
                >
                  Update
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
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete section:{" "}
                  <strong>{currentSection.name}</strong>?
                </p>
              </div>
              <div className="modal-footer">
                {/* <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button> */}
                <button
                  type="button"
                  className="btn btn-danger"
                  style={{}}
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

export default Sections;
