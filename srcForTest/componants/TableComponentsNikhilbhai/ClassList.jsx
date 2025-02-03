// // // // // // // // // import React, { useEffect, useState } from 'react';
// // // // // // // // // import axios from 'axios';

// // // // // // // // // const ClassList = () => {
// // // // // // // // //     const [classes, setClasses] = useState([]);
// // // // // // // // //     const [loading, setLoading] = useState(true);
// // // // // // // // //     const [error, setError] = useState(null);

// // // // // // // // //     useEffect(() => {
// // // // // // // // //         const fetchClasses = async () => {
// // // // // // // // //             try {
// // // // // // // // //                 const token = localStorage.getItem('authToken');
// // // // // // // // //                 if (!token) {
// // // // // // // // //                     throw new Error('No authentication token found');
// // // // // // // // //                 }
// // // // // // // // //                 const response = await axios.get('http://127.0.0.1:8000/api/classes', {
// // // // // // // // //                     headers: {
// // // // // // // // //                         Authorization: `Bearer ${token}`,
// // // // // // // // //                     },
// // // // // // // // //                     withCredentials: true,
// // // // // // // // //                 });
// // // // // // // // //                 setClasses(response.data);
// // // // // // // // //             } catch (error) {
// // // // // // // // //                 console.error('Error fetching classes:', error);
// // // // // // // // //                 setError(error.response ? error.response.data.message : error.message);
// // // // // // // // //             } finally {
// // // // // // // // //                 setLoading(false);
// // // // // // // // //             }
// // // // // // // // //         };

// // // // // // // // //         fetchClasses();
// // // // // // // // //     }, []);

// // // // // // // // //     if (loading) {
// // // // // // // // //         return <div>Loading...</div>;
// // // // // // // // //     }

// // // // // // // // //     if (error) {
// // // // // // // // //         return <div>Error: {error}</div>;
// // // // // // // // //     }

// // // // // // // // //     return (
// // // // // // // // //         <div>
// // // // // // // // //             <h1>Class List</h1>
// // // // // // // // //             {classes.length > 0 ? (
// // // // // // // // //                 <table>
// // // // // // // // //                     <thead>
// // // // // // // // //                         <tr>
// // // // // // // // //                             <th>Class Name</th>
// // // // // // // // //                             <th>Department Name</th>
// // // // // // // // //                         </tr>
// // // // // // // // //                     </thead>
// // // // // // // // //                     <tbody>
// // // // // // // // //                         {classes.map((classItem) => (
// // // // // // // // //                             <tr key={classItem.class_id}>
// // // // // // // // //                                 <td>{classItem.name}</td>
// // // // // // // // //                                 <td>{classItem.get_department ? classItem.get_department.name : 'N/A'}</td>
// // // // // // // // //                             </tr>
// // // // // // // // //                         ))}
// // // // // // // // //                     </tbody>
// // // // // // // // //                 </table>
// // // // // // // // //             ) : (
// // // // // // // // //                 <div>No classes found.</div>
// // // // // // // // //             )}
// // // // // // // // //         </div>
// // // // // // // // //     );
// // // // // // // // // };

// // // // // // // // // export default ClassList;

// // // // // // // // import React, { useEffect, useState } from 'react';
// // // // // // // // import axios from 'axios';

// // // // // // // // const ClassList = () => {
// // // // // // // //     const [classes, setClasses] = useState([]);
// // // // // // // //     const [loading, setLoading] = useState(true);
// // // // // // // //     const [error, setError] = useState(null);

// // // // // // // //     useEffect(() => {
// // // // // // // //         const fetchClasses = async () => {
// // // // // // // //             try {
// // // // // // // //                 const token = localStorage.getItem('authToken');
// // // // // // // //                 const academicYr = localStorage.getItem('academicYear');

// // // // // // // //                 if (!token) {
// // // // // // // //                     throw new Error('No authentication token found');
// // // // // // // //                 }

// // // // // // // //                 if (!academicYr) {
// // // // // // // //                     throw new Error('No academic year found');
// // // // // // // //                 }

// // // // // // // //                 const response = await axios.get('http://127.0.0.1:8000/api/classes', {
// // // // // // // //                     headers: {
// // // // // // // //                         Authorization: `Bearer ${token}`,
// // // // // // // //                         'X-Academic-Year': academicYr,
// // // // // // // //                     },
// // // // // // // //                     withCredentials: true,
// // // // // // // //                 });
// // // // // // // //                 setClasses(response.data);
// // // // // // // //                 console.log('Token:', token);
// // // // // // // //                 console.log('Academic Year:', academicYr);

// // // // // // // //             } catch (error) {
// // // // // // // //                 console.error('Error fetching classes:', error);
// // // // // // // //                 setError(error.response ? error.response.data.message : error.message);
// // // // // // // //             } finally {
// // // // // // // //                 setLoading(false);
// // // // // // // //             }
// // // // // // // //         };

// // // // // // // //         fetchClasses();
// // // // // // // //     }, []);

// // // // // // // //     if (loading) {
// // // // // // // //         return <div>Loading...</div>;
// // // // // // // //     }

// // // // // // // //     if (error) {
// // // // // // // //         return <div>Error: {error}</div>;
// // // // // // // //     }

// // // // // // // //     return (
// // // // // // // //         <div>
// // // // // // // //             <h1>Class List</h1>
// // // // // // // //             {classes.length > 0 ? (
// // // // // // // //                 <table>
// // // // // // // //                     <thead>
// // // // // // // //                         <tr>
// // // // // // // //                             <th>Class Name</th>
// // // // // // // //                             <th>Department Name</th>
// // // // // // // //                         </tr>
// // // // // // // //                     </thead>
// // // // // // // //                     <tbody>
// // // // // // // //                         {classes.map((classItem) => (
// // // // // // // //                             <tr key={classItem.class_id}>
// // // // // // // //                                 <td>{classItem.name}</td>
// // // // // // // //                                 <td>{classItem.get_department ? classItem.get_department.name : 'N/A'}</td>
// // // // // // // //                             </tr>
// // // // // // // //                         ))}
// // // // // // // //                     </tbody>
// // // // // // // //                 </table>
// // // // // // // //             ) : (
// // // // // // // //                 <div>No classes found.</div>
// // // // // // // //             )}
// // // // // // // //         </div>
// // // // // // // //     );
// // // // // // // // };

// // // // // // // // export default ClassList;

// // // // // // // import React, { useEffect, useState } from 'react';
// // // // // // // import axios from 'axios';
// // // // // // // import ReactPaginate from 'react-paginate';
// // // // // // // import NavBar from '../Header/NavBar';
// // // // // // // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // // // // // // import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
// // // // // // // import { ToastContainer, toast } from 'react-toastify';
// // // // // // // import 'react-toastify/dist/ReactToastify.css';
// // // // // // // import 'bootstrap/dist/css/bootstrap.min.css';

// // // // // // // function Classes() {
// // // // // // //     const [classes, setClasses] = useState([]);
// // // // // // //     const [loading, setLoading] = useState(true);
// // // // // // //     const [error, setError] = useState(null);
// // // // // // //     const [showAddModal, setShowAddModal] = useState(false);
// // // // // // //     const [showEditModal, setShowEditModal] = useState(false);
// // // // // // //     const [showDeleteModal, setShowDeleteModal] = useState(false);
// // // // // // //     const [currentClass, setCurrentClass] = useState(null);
// // // // // // //     const [newClassName, setNewClassName] = useState('');
// // // // // // //     const [newClassNumericName, setNewClassNumericName] = useState('');
// // // // // // //     const [newDepartmentId, setNewDepartmentId] = useState('');
// // // // // // //     const [searchTerm, setSearchTerm] = useState('');
// // // // // // //     const [currentPage, setCurrentPage] = useState(0);
// // // // // // //     const [pageCount, setPageCount] = useState(0);
// // // // // // //     const pageSize = 10;

// // // // // // //     // Fetch classes from backend
// // // // // // //     const fetchClasses = async () => {
// // // // // // //         try {
// // // // // // //             const token = localStorage.getItem('authToken');
// // // // // // //             const academicYr = localStorage.getItem('academicYear');

// // // // // // //             if (!token || !academicYr) {
// // // // // // //                 throw new Error('No authentication token or academic year found');
// // // // // // //             }

// // // // // // //             const response = await axios.get('http://127.0.0.1:8000/api/classes', {
// // // // // // //                 headers: {
// // // // // // //                     Authorization: `Bearer ${token}`,
// // // // // // //                     'X-Academic-Year': academicYr,
// // // // // // //                 },
// // // // // // //                 withCredentials: true,
// // // // // // //             });

// // // // // // //             setClasses(response.data);
// // // // // // //             setPageCount(Math.ceil(response.data.length / pageSize));
// // // // // // //         } catch (error) {
// // // // // // //             setError(error.message);
// // // // // // //         } finally {
// // // // // // //             setLoading(false);
// // // // // // //         }
// // // // // // //     };

// // // // // // //     useEffect(() => {
// // // // // // //         fetchClasses();
// // // // // // //     }, []);

// // // // // // //     // Pagination handling
// // // // // // //     const handlePageClick = (data) => {
// // // // // // //         setCurrentPage(data.selected);
// // // // // // //     };

// // // // // // //     // Edit class modal handling
// // // // // // //     const handleEdit = (classObj) => {
// // // // // // //         setCurrentClass(classObj);
// // // // // // //         setNewClassName(classObj.name);
// // // // // // //         setNewClassNumericName(classObj.name_numeric);
// // // // // // //         setNewDepartmentId(classObj.department_id);
// // // // // // //         setShowEditModal(true);
// // // // // // //     };

// // // // // // //     // Add class modal handling
// // // // // // //     const handleAdd = () => {
// // // // // // //         setShowAddModal(true);
// // // // // // //     };

// // // // // // //     // Close all modals
// // // // // // //     const handleCloseModal = () => {
// // // // // // //         setShowAddModal(false);
// // // // // // //         setShowEditModal(false);
// // // // // // //         setShowDeleteModal(false);
// // // // // // //         setCurrentClass(null);
// // // // // // //         setNewClassName('');
// // // // // // //         setNewClassNumericName('');
// // // // // // //         setNewDepartmentId('');
// // // // // // //     };

// // // // // // //     // Submit add class form
// // // // // // //     const handleSubmitAdd = async () => {
// // // // // // //         try {
// // // // // // //             const token = localStorage.getItem('authToken');
// // // // // // //             const academicYr = localStorage.getItem('academicYear');

// // // // // // //             if (!token || !academicYr) {
// // // // // // //                 throw new Error('No authentication token or academic year found');
// // // // // // //             }

// // // // // // //             await axios.post(
// // // // // // //                 'http://127.0.0.1:8000/api/classes',
// // // // // // //                 {
// // // // // // //                     name: newClassName,
// // // // // // //                     name_numeric: newClassNumericName,
// // // // // // //                     department_id: newDepartmentId,
// // // // // // //                 },
// // // // // // //                 {
// // // // // // //                     headers: {
// // // // // // //                         Authorization: `Bearer ${token}`,
// // // // // // //                         'X-Academic-Year': academicYr,
// // // // // // //                     },
// // // // // // //                     withCredentials: true,
// // // // // // //                 }
// // // // // // //             );

// // // // // // //             fetchClasses();
// // // // // // //             handleCloseModal();
// // // // // // //             toast.success('Class added successfully!');
// // // // // // //         } catch (error) {
// // // // // // //             console.error('Error adding class:', error);
// // // // // // //         }
// // // // // // //     };

// // // // // // //     // Submit edit class form
// // // // // // //     const handleSubmitEdit = async () => {
// // // // // // //         try {
// // // // // // //             const token = localStorage.getItem('authToken');
// // // // // // //             const academicYr = localStorage.getItem('academicYear');

// // // // // // //             if (!token || !academicYr || !currentClass || !currentClass.class_id) {
// // // // // // //                 throw new Error('Class ID is missing');
// // // // // // //             }

// // // // // // //             await axios.put(
// // // // // // //                 `http://127.0.0.1:8000/api/classes/${currentClass.class_id}`,
// // // // // // //                 {
// // // // // // //                     name: newClassName,
// // // // // // //                     name_numeric: newClassNumericName,
// // // // // // //                     department_id: newDepartmentId,
// // // // // // //                 },
// // // // // // //                 {
// // // // // // //                     headers: {
// // // // // // //                         Authorization: `Bearer ${token}`,
// // // // // // //                         'X-Academic-Year': academicYr,
// // // // // // //                     },
// // // // // // //                     withCredentials: true,
// // // // // // //                 }
// // // // // // //             );

// // // // // // //             fetchClasses();
// // // // // // //             handleCloseModal();
// // // // // // //             toast.success('Class updated successfully!');
// // // // // // //         } catch (error) {
// // // // // // //             console.error('Error updating class:', error);
// // // // // // //         }
// // // // // // //     };

// // // // // // //     // Delete class handling
// // // // // // //     const handleDelete = (id) => {
// // // // // // //         const classToDelete = classes.find(cls => cls.class_id === id);
// // // // // // //         setCurrentClass(classToDelete);
// // // // // // //         setShowDeleteModal(true);
// // // // // // //     };

// // // // // // //     // Submit delete class form
// // // // // // //     const handleSubmitDelete = async () => {
// // // // // // //         try {
// // // // // // //             const token = localStorage.getItem('authToken');
// // // // // // //             const academicYr = localStorage.getItem('academicYear');

// // // // // // //             if (!token || !academicYr || !currentClass || !currentClass.class_id) {
// // // // // // //                 throw new Error('Class ID is missing');
// // // // // // //             }

// // // // // // //             await axios.delete(
// // // // // // //                 `http://127.0.0.1:8000/api/classes/${currentClass.class_id}`,
// // // // // // //                 {
// // // // // // //                     headers: {
// // // // // // //                         Authorization: `Bearer ${token}`,
// // // // // // //                         'X-Academic-Year': academicYr,
// // // // // // //                     },
// // // // // // //                     withCredentials: true,
// // // // // // //                 }
// // // // // // //             );

// // // // // // //             fetchClasses();
// // // // // // //             setShowDeleteModal(false);
// // // // // // //             setCurrentClass(null);
// // // // // // //             toast.success('Class deleted successfully!');
// // // // // // //         } catch (error) {
// // // // // // //             console.error('Error deleting class:', error);
// // // // // // //             setError(error.message);
// // // // // // //         }
// // // // // // //     };

// // // // // // //     // Filter classes by name
// // // // // // //     const filteredClasses = classes.filter(cls =>
// // // // // // //         cls.name.toLowerCase().includes(searchTerm.toLowerCase())
// // // // // // //     );

// // // // // // //     // Paginated classes
// // // // // // //     const displayedClasses = filteredClasses.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

// // // // // // //     if (loading) return <p>Loading...</p>;
// // // // // // //     if (error) return <p>Error: {error}</p>;

// // // // // // //     return (
// // // // // // //         <>
// // // // // // //             <NavBar />
// // // // // // //             <ToastContainer />

// // // // // // //             <div className="container mt-4">
// // // // // // //                 <div className="card" style={{ margin: '0 auto', width: '70%' }}>
// // // // // // //                     <div className="card-header d-flex justify-content-between align-items-center">
// // // // // // //                         <h3>Classes</h3>
// // // // // // //                         <button className="btn btn-primary btn-sm" style={{ width: '80px' }} onClick={handleAdd}>
// // // // // // //                             <FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />
// // // // // // //                             Add
// // // // // // //                         </button>
// // // // // // //                     </div>

// // // // // // //                     <div className="card-body">
// // // // // // //                         <div className="d-flex justify-content-end mb-2">
// // // // // // //                             <input
// // // // // // //                                 type="text"
// // // // // // //                                 className="form-control w-25"
// // // // // // //                                 placeholder="Search by name"
// // // // // // //                                 value={searchTerm}
// // // // // // //                                 onChange={(e) => setSearchTerm(e.target.value)}
// // // // // // //                             />
// // // // // // //                         </div>
// // // // // // //                         <div className="table-responsive">
// // // // // // //                             <table className="table table-bordered table-striped">
// // // // // // //                                 <thead>
// // // // // // //                                     <tr>
// // // // // // //                                         <th>Name</th>
// // // // // // //                                         <th>Numeric Name</th>
// // // // // // //                                         <th>Department</th>
// // // // // // //                                         <th>Edit</th>
// // // // // // //                                         <th>Delete</th>
// // // // // // //                                     </tr>
// // // // // // //                                 </thead>
// // // // // // //                                 <tbody>
// // // // // // //                                     {displayedClasses.map((cls) => (
// // // // // // //                                         <tr key={cls.class_id}>
// // // // // // //                                             <td>{cls.name}</td>
// // // // // // //                                             <td>{cls.name_numeric}</td>
// // // // // // //                                             <td>{cls.get_department.name}</td>
// // // // // // //                                             <td className="text-center">
// // // // // // //                                                 <FontAwesomeIcon
// // // // // // //                                                     icon={faEdit}
// // // // // // //                                                     className="text-warning"
// // // // // // //                                                     onClick={() => handleEdit(cls)}
// // // // // // //                                                     style={{ cursor: 'pointer', fontSize: '1.5em' }}
// // // // // // //                                                 />
// // // // // // //                                             </td>
// // // // // // //                                             <td className="text-center">
// // // // // // //                                                 <FontAwesomeIcon
// // // // // // //                                                     icon={faTrash}
// // // // // // //                                                     className="text-danger"
// // // // // // //                                                     onClick={() => handleDelete(cls.class_id)}
// // // // // // //                                                     style={{ cursor: 'pointer', fontSize: '1.5em' }}
// // // // // // //                                                 />
// // // // // // //                                             </td>
// // // // // // //                                         </tr>
// // // // // // //                                     ))}
// // // // // // //                                 </tbody>
// // // // // // //                             </table>
// // // // // // //                         </div>
// // // // // // //                         <div className="d-flex justify-content-center mt-3">
// // // // // // //                             <ReactPaginate
// // // // // // //                                 previousLabel={'previous'}
// // // // // // //                                 nextLabel={'next'}
// // // // // // //                                 breakLabel={'...'}
// // // // // // //                                 breakClassName={'page-item'}
// // // // // // //                                 breakLinkClassName={'page-link'}
// // // // // // //                                 pageCount={pageCount}
// // // // // // //                                 marginPagesDisplayed={2}
// // // // // // //                                 pageRangeDisplayed={5}
// // // // // // //                                 onPageChange={handlePageClick}
// // // // // // //                                 containerClassName={'pagination justify-content-center'}
// // // // // // //                                 pageClassName={'page-item'}
// // // // // // //                                 pageLinkClassName={'page-link'}
// // // // // // //                                 previousClassName={'page-item'}
// // // // // // //                                 previousLinkClassName={'page-link'}
// // // // // // //                                 nextClassName={'page-item'}
// // // // // // //                                 nextLinkClassName={'page-link'}
// // // // // // //                                 activeClassName={'active'}
// // // // // // //                             />
// // // // // // //                         </div>
// // // // // // //                     </div>
// // // // // // //                 </div>
// // // // // // //             </div>

// // // // // // //             {/* Modal for adding a new class */}
// // // // // // //             {showAddModal && (
// // // // // // //                 <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
// // // // // // //                     <div className="modal-dialog modal-lg">
// // // // // // //                         <div className="modal-content">
// // // // // // //                             <div className="modal-header">
// // // // // // //                                 <h5 className="modal-title">Add New Class</h5>
// // // // // // //                                 <button type="button" className="close" onClick={handleCloseModal}>
// // // // // // //                                     <span>&times;</span>
// // // // // // //                                 </button>
// // // // // // //                             </div>
// // // // // // //                             <div className="modal-body">
// // // // // // //                                 <form onSubmit={(e) => {
// // // // // // //                                     e.preventDefault();
// // // // // // //                                     handleSubmitAdd();
// // // // // // //                                 }}>
// // // // // // //                                     <div className="form-group">
// // // // // // //                                         <label htmlFor="newClassName">Name</label>
// // // // // // //                                         <input
// // // // // // //                                             type="text"
// // // // // // //                                             className="form-control"
// // // // // // //                                             id="newClassName"
// // // // // // //                                             value={newClassName}
// // // // // // //                                             onChange={(e) => setNewClassName(e.target.value)}
// // // // // // //                                             required
// // // // // // //                                         />
// // // // // // //                                     </div>
// // // // // // //                                     <div className="form-group">
// // // // // // //                                         <label htmlFor="newClassNumericName">Numeric Name</label>
// // // // // // //                                         <input
// // // // // // //                                             type="text"
// // // // // // //                                             className="form-control"
// // // // // // //                                             id="newClassNumericName"
// // // // // // //                                             value={newClassNumericName}
// // // // // // //                                             onChange={(e) => setNewClassNumericName(e.target.value)}
// // // // // // //                                             required
// // // // // // //                                         />
// // // // // // //                                     </div>
// // // // // // //                                     <div className="form-group">
// // // // // // //                                         <label htmlFor="newDepartmentId">Department ID</label>
// // // // // // //                                         <input
// // // // // // //                                             type="text"
// // // // // // //                                             className="form-control"
// // // // // // //                                             id="newDepartmentId"
// // // // // // //                                             value={newDepartmentId}
// // // // // // //                                             onChange={(e) => setNewDepartmentId(e.target.value)}
// // // // // // //                                             required
// // // // // // //                                         />
// // // // // // //                                     </div>
// // // // // // //                                     <button type="submit" className="btn btn-primary">Submit</button>
// // // // // // //                                     <button type="button" className="btn btn-secondary ml-2" onClick={handleCloseModal}>Cancel</button>
// // // // // // //                                 </form>
// // // // // // //                             </div>
// // // // // // //                         </div>
// // // // // // //                     </div>
// // // // // // //                 </div>
// // // // // // //             )}
// // // // // // //             {/* Modal for editing a class */}
// // // // // // //             {showEditModal && (
// // // // // // //                 <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
// // // // // // //                     <div className="modal-dialog modal-lg">
// // // // // // //                         <div className="modal-content">
// // // // // // //                             <div className="modal-header">
// // // // // // //                                 <h5 className="modal-title">Edit Class</h5>
// // // // // // //                                 <button type="button" className="close" onClick={handleCloseModal}>
// // // // // // //                                     <span>&times;</span>
// // // // // // //                                 </button>
// // // // // // //                             </div>
// // // // // // //                             <div className="modal-body">
// // // // // // //                                 <form onSubmit={(e) => {
// // // // // // //                                     e.preventDefault();
// // // // // // //                                     handleSubmitEdit();
// // // // // // //                                 }}>
// // // // // // //                                     <div className="form-group">
// // // // // // //                                         <label htmlFor="editClassName">Name</label>
// // // // // // //                                         <input
// // // // // // //                                             type="text"
// // // // // // //                                             className="form-control"
// // // // // // //                                             id="editClassName"
// // // // // // //                                             value={newClassName}
// // // // // // //                                             onChange={(e) => setNewClassName(e.target.value)}
// // // // // // //                                             required
// // // // // // //                                         />
// // // // // // //                                     </div>
// // // // // // //                                     <div className="form-group">
// // // // // // //                                         <label htmlFor="editClassNumericName">Numeric Name</label>
// // // // // // //                                         <input
// // // // // // //                                             type="text"
// // // // // // //                                             className="form-control"
// // // // // // //                                             id="editClassNumericName"
// // // // // // //                                             value={newClassNumericName}
// // // // // // //                                             onChange={(e) => setNewClassNumericName(e.target.value)}
// // // // // // //                                             required
// // // // // // //                                         />
// // // // // // //                                     </div>
// // // // // // //                                     <div className="form-group">
// // // // // // //                                         <label htmlFor="editDepartmentId">Department ID</label>
// // // // // // //                                         <input
// // // // // // //                                             type="text"
// // // // // // //                                             className="form-control"
// // // // // // //                                             id="editDepartmentId"
// // // // // // //                                             value={newDepartmentId}
// // // // // // //                                             onChange={(e) => setNewDepartmentId(e.target.value)}
// // // // // // //                                             required
// // // // // // //                                         />
// // // // // // //                                     </div>
// // // // // // //                                     <button type="submit" className="btn btn-primary">Submit</button>
// // // // // // //                                     <button type="button" className="btn btn-secondary ml-2" onClick={handleCloseModal}>Cancel</button>
// // // // // // //                                 </form>
// // // // // // //                             </div>
// // // // // // //                         </div>
// // // // // // //                     </div>
// // // // // // //                 </div>
// // // // // // //             )}
// // // // // // //             {/* Modal for deleting a class */}
// // // // // // //             {showDeleteModal && (
// // // // // // //                 <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
// // // // // // //                     <div className="modal-dialog modal-lg">
// // // // // // //                         <div className="modal-content">
// // // // // // //                             <div className="modal-header">
// // // // // // //                                 <h5 className="modal-title">Delete Class</h5>
// // // // // // //                                 <button type="button" className="close" onClick={handleCloseModal}>
// // // // // // //                                     <span>&times;</span>
// // // // // // //                                 </button>
// // // // // // //                             </div>
// // // // // // //                             <div className="modal-body">
// // // // // // //                                 <p>Are you sure you want to delete this class?</p>
// // // // // // //                                 <button type="button" className="btn btn-danger" onClick={handleSubmitDelete}>Delete</button>
// // // // // // //                                 <button type="button" className="btn btn-secondary ml-2" onClick={handleCloseModal}>Cancel</button>
// // // // // // //                             </div>
// // // // // // //                         </div>
// // // // // // //                     </div>
// // // // // // //                 </div>
// // // // // // //             )}
// // // // // // //         </>
// // // // // // //     );
// // // // // // // }

// // // // // // // export default Classes;

// // // // // // import React, { useEffect, useState } from 'react';
// // // // // // import axios from 'axios';
// // // // // // import ReactPaginate from 'react-paginate';
// // // // // // import NavBar from '../Header/NavBar';
// // // // // // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // // // // // import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
// // // // // // import { ToastContainer, toast } from 'react-toastify';
// // // // // // import 'react-toastify/dist/ReactToastify.css';
// // // // // // import 'bootstrap/dist/css/bootstrap.min.css';

// // // // // // function Classes() {
// // // // // //     const [classes, setClasses] = useState([]);
// // // // // //     const [loading, setLoading] = useState(true);
// // // // // //     const [error, setError] = useState(null);
// // // // // //     const [showAddModal, setShowAddModal] = useState(false);
// // // // // //     const [showEditModal, setShowEditModal] = useState(false);
// // // // // //     const [showDeleteModal, setShowDeleteModal] = useState(false);
// // // // // //     const [currentClass, setCurrentClass] = useState(null);
// // // // // //     const [newClassName, setNewClassName] = useState('');
// // // // // //     const [newDepartmentId, setNewDepartmentId] = useState('');
// // // // // //     const [searchTerm, setSearchTerm] = useState('');
// // // // // //     const [currentPage, setCurrentPage] = useState(0);
// // // // // //     const [pageCount, setPageCount] = useState(0);
// // // // // //     const pageSize = 10;

// // // // // //     // Fetch classes from backend
// // // // // //     const fetchClasses = async () => {
// // // // // //         try {
// // // // // //             const token = localStorage.getItem('authToken');
// // // // // //             const academicYr = localStorage.getItem('academicYear');

// // // // // //             if (!token || !academicYr) {
// // // // // //                 throw new Error('No authentication token or academic year found');
// // // // // //             }

// // // // // //             const response = await axios.get('http://127.0.0.1:8000/api/classes', {
// // // // // //                 headers: {
// // // // // //                     Authorization: `Bearer ${token}`,
// // // // // //                     'X-Academic-Year': academicYr,
// // // // // //                 },
// // // // // //                 withCredentials: true,
// // // // // //             });

// // // // // //             setClasses(response.data);
// // // // // //             setPageCount(Math.ceil(response.data.length / pageSize));
// // // // // //         } catch (error) {
// // // // // //             setError(error.message);
// // // // // //         } finally {
// // // // // //             setLoading(false);
// // // // // //         }
// // // // // //     };

// // // // // //     useEffect(() => {
// // // // // //         fetchClasses();
// // // // // //     }, []);

// // // // // //     // Pagination handling
// // // // // //     const handlePageClick = (data) => {
// // // // // //         setCurrentPage(data.selected);
// // // // // //     };

// // // // // //     // Edit class modal handling
// // // // // //     const handleEdit = (classObj) => {
// // // // // //         setCurrentClass(classObj);
// // // // // //         setNewClassName(classObj.name);
// // // // // //         setNewDepartmentId(classObj.department_id);
// // // // // //         setShowEditModal(true);
// // // // // //     };

// // // // // //     // Add class modal handling
// // // // // //     const handleAdd = () => {
// // // // // //         setShowAddModal(true);
// // // // // //     };

// // // // // //     // Close all modals
// // // // // //     const handleCloseModal = () => {
// // // // // //         setShowAddModal(false);
// // // // // //         setShowEditModal(false);
// // // // // //         setShowDeleteModal(false);
// // // // // //         setCurrentClass(null);
// // // // // //         setNewClassName('');
// // // // // //         setNewDepartmentId('');
// // // // // //     };

// // // // // //     // Submit add class form
// // // // // //     const handleSubmitAdd = async () => {
// // // // // //         try {
// // // // // //             const token = localStorage.getItem('authToken');
// // // // // //             const academicYr = localStorage.getItem('academicYear');

// // // // // //             if (!token || !academicYr) {
// // // // // //                 throw new Error('No authentication token or academic year found');
// // // // // //             }

// // // // // //             await axios.post(
// // // // // //                 'http://127.0.0.1:8000/api/classes',
// // // // // //                 {
// // // // // //                     name: newClassName,
// // // // // //                     department_id: newDepartmentId,
// // // // // //                 },
// // // // // //                 {
// // // // // //                     headers: {
// // // // // //                         Authorization: `Bearer ${token}`,
// // // // // //                         'X-Academic-Year': academicYr,
// // // // // //                     },
// // // // // //                     withCredentials: true,
// // // // // //                 }
// // // // // //             );

// // // // // //             fetchClasses();
// // // // // //             handleCloseModal();
// // // // // //             toast.success('Class added successfully!');
// // // // // //         } catch (error) {
// // // // // //             console.error('Error adding class:', error);
// // // // // //         }
// // // // // //     };

// // // // // //     // Submit edit class form
// // // // // //     const handleSubmitEdit = async () => {
// // // // // //         try {
// // // // // //             const token = localStorage.getItem('authToken');
// // // // // //             const academicYr = localStorage.getItem('academicYear');

// // // // // //             if (!token || !academicYr || !currentClass || !currentClass.class_id) {
// // // // // //                 throw new Error('Class ID is missing');
// // // // // //             }

// // // // // //             await axios.put(
// // // // // //                 `http://127.0.0.1:8000/api/classes/${currentClass.class_id}`,
// // // // // //                 {
// // // // // //                     name: newClassName,
// // // // // //                     department_id: newDepartmentId,
// // // // // //                 },
// // // // // //                 {
// // // // // //                     headers: {
// // // // // //                         Authorization: `Bearer ${token}`,
// // // // // //                         'X-Academic-Year': academicYr,
// // // // // //                     },
// // // // // //                     withCredentials: true,
// // // // // //                 }
// // // // // //             );

// // // // // //             fetchClasses();
// // // // // //             handleCloseModal();
// // // // // //             toast.success('Class updated successfully!');
// // // // // //         } catch (error) {
// // // // // //             console.error('Error updating class:', error);
// // // // // //         }
// // // // // //     };

// // // // // //     // Delete class handling
// // // // // //     const handleDelete = (id) => {
// // // // // //         const classToDelete = classes.find(cls => cls.class_id === id);
// // // // // //         setCurrentClass(classToDelete);
// // // // // //         setShowDeleteModal(true);
// // // // // //     };

// // // // // //     // Submit delete class form
// // // // // //     const handleSubmitDelete = async () => {
// // // // // //         try {
// // // // // //             const token = localStorage.getItem('authToken');
// // // // // //             const academicYr = localStorage.getItem('academicYear');

// // // // // //             if (!token || !academicYr || !currentClass || !currentClass.class_id) {
// // // // // //                 throw new Error('Class ID is missing');
// // // // // //             }

// // // // // //             await axios.delete(
// // // // // //                 `http://127.0.0.1:8000/api/classes/${currentClass.class_id}`,
// // // // // //                 {
// // // // // //                     headers: {
// // // // // //                         Authorization: `Bearer ${token}`,
// // // // // //                         'X-Academic-Year': academicYr,
// // // // // //                     },
// // // // // //                     withCredentials: true,
// // // // // //                 }
// // // // // //             );

// // // // // //             fetchClasses();
// // // // // //             setShowDeleteModal(false);
// // // // // //             setCurrentClass(null);
// // // // // //             toast.success('Class deleted successfully!');
// // // // // //         } catch (error) {
// // // // // //             console.error('Error deleting class:', error);
// // // // // //             setError(error.message);
// // // // // //         }
// // // // // //     };

// // // // // //     // Filter classes by name
// // // // // //     const filteredClasses = classes.filter(cls =>
// // // // // //         cls.name.toLowerCase().includes(searchTerm.toLowerCase())
// // // // // //     );

// // // // // //     // Paginated classes
// // // // // //     const displayedClasses = filteredClasses.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

// // // // // //     if (loading) return <p>Loading...</p>;
// // // // // //     if (error) return <p>Error: {error}</p>;

// // // // // //     return (
// // // // // //         <>
// // // // // //             <NavBar />
// // // // // //             <ToastContainer />

// // // // // //             <div className="container mt-4">
// // // // // //                 <div className="card" style={{ margin: '0 auto', width: '70%' }}>
// // // // // //                     <div className="card-header d-flex justify-content-between align-items-center">
// // // // // //                         <h3>Classes</h3>
// // // // // //                         <button className="btn btn-primary btn-sm" style={{ width: '80px' }} onClick={handleAdd}>
// // // // // //                             <FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />
// // // // // //                             Add
// // // // // //                         </button>
// // // // // //                     </div>

// // // // // //                     <div className="card-body">
// // // // // //                         <div className="d-flex justify-content-end mb-2">
// // // // // //                             <input
// // // // // //                                 type="text"
// // // // // //                                 className="form-control w-25"
// // // // // //                                 placeholder="Search by name"
// // // // // //                                 value={searchTerm}
// // // // // //                                 onChange={(e) => setSearchTerm(e.target.value)}
// // // // // //                             />
// // // // // //                         </div>
// // // // // //                         <div className="table-responsive">
// // // // // //                             <table className="table table-bordered table-striped">
// // // // // //                                 <thead>
// // // // // //                                     <tr>
// // // // // //                                         <th>Name</th>
// // // // // //                                         <th>Department</th>
// // // // // //                                         <th>Edit</th>
// // // // // //                                         <th>Delete</th>
// // // // // //                                     </tr>
// // // // // //                                 </thead>
// // // // // //                                 <tbody>
// // // // // //                                     {displayedClasses.map((cls) => (
// // // // // //                                         <tr key={cls.class_id}>
// // // // // //                                             <td>{cls.name}</td>
// // // // // //                                             <td>{cls.get_department.name}</td>
// // // // // //                                             <td className="text-center">
// // // // // //                                                 <FontAwesomeIcon
// // // // // //                                                     icon={faEdit}
// // // // // //                                                     className="text-warning"
// // // // // //                                                     onClick={() => handleEdit(cls)}
// // // // // //                                                     style={{ cursor: 'pointer', fontSize: '1.5em' }}
// // // // // //                                                 />
// // // // // //                                             </td>
// // // // // //                                             <td className="text-center">
// // // // // //                                                 <FontAwesomeIcon
// // // // // //                                                     icon={faTrash}
// // // // // //                                                     className="text-danger"
// // // // // //                                                     onClick={() => handleDelete(cls.class_id)}
// // // // // //                                                     style={{ cursor: 'pointer', fontSize: '1.5em' }}
// // // // // //                                                 />
// // // // // //                                             </td>
// // // // // //                                         </tr>
// // // // // //                                     ))}
// // // // // //                                 </tbody>
// // // // // //                             </table>
// // // // // //                         </div>
// // // // // //                         <div className="d-flex justify-content-center mt-3">
// // // // // //                             <ReactPaginate
// // // // // //                                 previousLabel={'previous'}
// // // // // //                                 nextLabel={'next'}
// // // // // //                                 breakLabel={'...'}
// // // // // //                                 breakClassName={'page-item'}
// // // // // //                                 breakLinkClassName={'page-link'}
// // // // // //                                 pageCount={pageCount}
// // // // // //                                 marginPagesDisplayed={2}
// // // // // //                                 pageRangeDisplayed={5}
// // // // // //                                 onPageChange={handlePageClick}
// // // // // //                                 containerClassName={'pagination justify-content-center'}
// // // // // //                                 pageClassName={'page-item'}
// // // // // //                                 pageLinkClassName={'page-link'}
// // // // // //                                 previousClassName={'page-item'}
// // // // // //                                 previousLinkClassName={'page-link'}
// // // // // //                                 nextClassName={'page-item'}
// // // // // //                                 nextLinkClassName={'page-link'}
// // // // // //                                 activeClassName={'active'}
// // // // // //                             />
// // // // // //                         </div>
// // // // // //                     </div>
// // // // // //                 </div>
// // // // // //             </div>

// // // // // //             {/* Modal for adding a new class */}
// // // // // //             {showAddModal && (
// // // // // //                 <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
// // // // // //                     <div className="modal-dialog modal-lg">
// // // // // //                         <div className="modal-content">
// // // // // //                             <div className="modal-header">
// // // // // //                                 <h5 className="modal-title">Add New Class</h5>
// // // // // //                                 <button type="button" className="close" onClick={handleCloseModal}>
// // // // // //                                     <span>&times;</span>
// // // // // //                                 </button>
// // // // // //                             </div>
// // // // // //                             <div className="modal-body">
// // // // // //                                 <form onSubmit={(e) => {
// // // // // //                                     e.preventDefault();
// // // // // //                                     handleSubmitAdd();
// // // // // //                                 }}>
// // // // // //                                     <div className="form-group">
// // // // // //                                         <label htmlFor="newClassName">Name</label>
// // // // // //                                         <input
// // // // // //                                             type="text"
// // // // // //                                             className="form-control"
// // // // // //                                             id="newClassName"
// // // // // //                                             value={newClassName}
// // // // // //                                             onChange={(e) => setNewClassName(e.target.value)}
// // // // // //                                             required
// // // // // //                                         />
// // // // // //                                     </div>
// // // // // //                                     <div className="form-group">
// // // // // //                                         <label htmlFor="newDepartmentId">Department ID</label>
// // // // // //                                         <input
// // // // // //                                             type="text"
// // // // // //                                             className="form-control"
// // // // // //                                             id="newDepartmentId"
// // // // // //                                             value={newDepartmentId}
// // // // // //                                             onChange={(e) => setNewDepartmentId(e.target.value)}
// // // // // //                                             required
// // // // // //                                         />
// // // // // //                                     </div>
// // // // // //                                     <button type="submit" className="btn btn-primary">Submit</button>
// // // // // //                                     <button type="button" className="btn btn-secondary ml-2" onClick={handleCloseModal}>Cancel</button>
// // // // // //                                 </form>
// // // // // //                             </div>
// // // // // //                         </div>
// // // // // //                     </div>
// // // // // //                 </div>
// // // // // //             )}
// // // // // //             {/* Modal for editing a class */}
// // // // // //             {showEditModal && (
// // // // // //                 <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
// // // // // //                     <div className="modal-dialog modal-lg">
// // // // // //                         <div className="modal-content">
// // // // // //                             <div className="modal-header">
// // // // // //                                 <h5 className="modal-title">Edit Class</h5>
// // // // // //                                 <button type="button" className="close" onClick={handleCloseModal}>
// // // // // //                                     <span>&times;</span>
// // // // // //                                 </button>
// // // // // //                             </div>
// // // // // //                             <div className="modal-body">
// // // // // //                                 <form onSubmit={(e) => {
// // // // // //                                     e.preventDefault();
// // // // // //                                     handleSubmitEdit();
// // // // // //                                 }}>
// // // // // //                                     <div className="form-group">
// // // // // //                                         <label htmlFor="editClassName">Name</label>
// // // // // //                                         <input
// // // // // //                                             type="text"
// // // // // //                                             className="form-control"
// // // // // //                                             id="editClassName"
// // // // // //                                             value={newClassName}
// // // // // //                                             onChange={(e) => setNewClassName(e.target.value)}
// // // // // //                                             required
// // // // // //                                         />
// // // // // //                                     </div>
// // // // // //                                     <div className="form-group">
// // // // // //                                         <label htmlFor="editDepartmentId">Department ID</label>
// // // // // //                                         <input
// // // // // //                                             type="text"
// // // // // //                                             className="form-control"
// // // // // //                                             id="editDepartmentId"
// // // // // //                                             value={newDepartmentId}
// // // // // //                                             onChange={(e) => setNewDepartmentId(e.target.value)}
// // // // // //                                             required
// // // // // //                                         />
// // // // // //                                     </div>
// // // // // //                                     <button type="submit" className="btn btn-primary">Submit</button>
// // // // // //                                     <button type="button" className="btn btn-secondary ml-2" onClick={handleCloseModal}>Cancel</button>
// // // // // //                                 </form>
// // // // // //                             </div>
// // // // // //                         </div>
// // // // // //                     </div>
// // // // // //                 </div>
// // // // // //             )}
// // // // // //             {/* Modal for deleting a class */}
// // // // // //             {showDeleteModal && (
// // // // // //                 <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
// // // // // //                     <div className="modal-dialog modal-lg">
// // // // // //                         <div className="modal-content">
// // // // // //                             <div className="modal-header">
// // // // // //                                 <h5 className="modal-title">Delete Class</h5>
// // // // // //                                 <button type="button" className="close" onClick={handleCloseModal}>
// // // // // //                                     <span>&times;</span>
// // // // // //                                 </button>
// // // // // //                             </div>
// // // // // //                             <div className="modal-body">
// // // // // //                                 <p>Are you sure you want to delete this class?</p>
// // // // // //                                 <button type="button" className="btn btn-danger" onClick={handleSubmitDelete}>Delete</button>
// // // // // //                                 <button type="button" className="btn btn-secondary ml-2" onClick={handleCloseModal}>Cancel</button>
// // // // // //                             </div>
// // // // // //                         </div>
// // // // // //                     </div>
// // // // // //                 </div>
// // // // // //             )}
// // // // // //         </>
// // // // // //     );
// // // // // // }

// // // // // // export default Classes;
// // // // // import React, { useEffect, useState } from 'react';
// // // // // import axios from 'axios';
// // // // // import ReactPaginate from 'react-paginate';
// // // // // import NavBar from '../Header/NavBar';
// // // // // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // // // // import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
// // // // // import { ToastContainer, toast } from 'react-toastify';
// // // // // import 'react-toastify/dist/ReactToastify.css';
// // // // // import 'bootstrap/dist/css/bootstrap.min.css';

// // // // // function Classes() {
// // // // //     const [classes, setClasses] = useState([]);
// // // // //     const [departments, setDepartments] = useState([]);
// // // // //     const [loading, setLoading] = useState(true);
// // // // //     const [error, setError] = useState(null);
// // // // //     const [showAddModal, setShowAddModal] = useState(false);
// // // // //     const [showEditModal, setShowEditModal] = useState(false);
// // // // //     const [showDeleteModal, setShowDeleteModal] = useState(false);
// // // // //     const [currentClass, setCurrentClass] = useState(null);
// // // // //     const [newClassName, setNewClassName] = useState('');
// // // // //     const [newDepartmentId, setNewDepartmentId] = useState('');
// // // // //     const [searchTerm, setSearchTerm] = useState('');
// // // // //     const [currentPage, setCurrentPage] = useState(0);
// // // // //     const [pageCount, setPageCount] = useState(0);
// // // // //     const pageSize = 10;

// // // // //     // Fetch classes and departments from backend
// // // // //     const fetchClasses = async () => {
// // // // //         try {
// // // // //             const token = localStorage.getItem('authToken');
// // // // //             const academicYr = localStorage.getItem('academicYear');

// // // // //             if (!token || !academicYr) {
// // // // //                 throw new Error('No authentication token or academic year found');
// // // // //             }

// // // // //             const response = await axios.get('http://127.0.0.1:8000/api/classes', {
// // // // //                 headers: {
// // // // //                     Authorization: `Bearer ${token}`,
// // // // //                     'X-Academic-Year': academicYr,
// // // // //                 },
// // // // //                 withCredentials: true,
// // // // //             });

// // // // //             setClasses(response.data);
// // // // //             setPageCount(Math.ceil(response.data.length / pageSize));
// // // // //         } catch (error) {
// // // // //             setError(error.message);
// // // // //         } finally {
// // // // //             setLoading(false);
// // // // //         }
// // // // //     };

// // // // //     const fetchDepartments = async () => {
// // // // //         try {
// // // // //             const token = localStorage.getItem('authToken');
// // // // //             const academicYr = localStorage.getItem('academicYear');

// // // // //             if (!token || !academicYr) {
// // // // //                 throw new Error('No authentication token or academic year found');
// // // // //             }

// // // // //             const response = await axios.get('http://127.0.0.1:8000/api/sections', {
// // // // //                 headers: {
// // // // //                     Authorization: `Bearer ${token}`,
// // // // //                     'X-Academic-Year': academicYr,
// // // // //                 },
// // // // //                 withCredentials: true,
// // // // //             });

// // // // //             setDepartments(response.data);
// // // // //         } catch (error) {
// // // // //             setError(error.message);
// // // // //         }
// // // // //     };

// // // // //     useEffect(() => {
// // // // //         fetchClasses();
// // // // //         fetchDepartments();
// // // // //     }, []);

// // // // //     // Pagination handling
// // // // //     const handlePageClick = (data) => {
// // // // //         setCurrentPage(data.selected);
// // // // //     };

// // // // //     // Edit class modal handling
// // // // //     const handleEdit = (classObj) => {
// // // // //         setCurrentClass(classObj);
// // // // //         setNewClassName(classObj.name);
// // // // //         setNewDepartmentId(classObj.department_id);
// // // // //         setShowEditModal(true);
// // // // //     };

// // // // //     // Add class modal handling
// // // // //     const handleAdd = () => {
// // // // //         setShowAddModal(true);
// // // // //     };

// // // // //     // Close all modals
// // // // //     const handleCloseModal = () => {
// // // // //         setShowAddModal(false);
// // // // //         setShowEditModal(false);
// // // // //         setShowDeleteModal(false);
// // // // //         setCurrentClass(null);
// // // // //         setNewClassName('');
// // // // //         setNewDepartmentId('');
// // // // //     };

// // // // //     // Submit add class form
// // // // //     const handleSubmitAdd = async () => {
// // // // //         try {
// // // // //             const token = localStorage.getItem('authToken');
// // // // //             const academicYr = localStorage.getItem('academicYear');

// // // // //             if (!token || !academicYr) {
// // // // //                 throw new Error('No authentication token or academic year found');
// // // // //             }

// // // // //             await axios.post(
// // // // //                 'http://127.0.0.1:8000/api/classes',
// // // // //                 {
// // // // //                     name: newClassName,
// // // // //                     department_id: newDepartmentId,
// // // // //                 },
// // // // //                 {
// // // // //                     headers: {
// // // // //                         Authorization: `Bearer ${token}`,
// // // // //                         'X-Academic-Year': academicYr,
// // // // //                     },
// // // // //                     withCredentials: true,
// // // // //                 }
// // // // //             );

// // // // //             fetchClasses();
// // // // //             handleCloseModal();
// // // // //             toast.success('Class added successfully!');
// // // // //         } catch (error) {
// // // // //             console.error('Error adding class:', error);
// // // // //         }
// // // // //     };

// // // // //     // Submit edit class form
// // // // //     const handleSubmitEdit = async () => {
// // // // //         try {
// // // // //             const token = localStorage.getItem('authToken');
// // // // //             const academicYr = localStorage.getItem('academicYear');

// // // // //             if (!token || !academicYr || !currentClass || !currentClass.class_id) {
// // // // //                 throw new Error('Class ID is missing');
// // // // //             }

// // // // //             await axios.put(
// // // // //                 `http://127.0.0.1:8000/api/classes/${currentClass.class_id}`,
// // // // //                 {
// // // // //                     name: newClassName,
// // // // //                     department_id: newDepartmentId,
// // // // //                 },
// // // // //                 {
// // // // //                     headers: {
// // // // //                         Authorization: `Bearer ${token}`,
// // // // //                         'X-Academic-Year': academicYr,
// // // // //                     },
// // // // //                     withCredentials: true,
// // // // //                 }
// // // // //             );

// // // // //             fetchClasses();
// // // // //             handleCloseModal();
// // // // //             toast.success('Class updated successfully!');
// // // // //         } catch (error) {
// // // // //             console.error('Error updating class:', error);
// // // // //         }
// // // // //     };

// // // // //     // Delete class handling
// // // // //     const handleDelete = (id) => {
// // // // //         const classToDelete = classes.find(cls => cls.class_id === id);
// // // // //         setCurrentClass(classToDelete);
// // // // //         setShowDeleteModal(true);
// // // // //     };

// // // // //     // Submit delete class form
// // // // //     const handleSubmitDelete = async () => {
// // // // //         try {
// // // // //             const token = localStorage.getItem('authToken');
// // // // //             const academicYr = localStorage.getItem('academicYear');

// // // // //             if (!token || !academicYr || !currentClass || !currentClass.class_id) {
// // // // //                 throw new Error('Class ID is missing');
// // // // //             }

// // // // //             await axios.delete(
// // // // //                 `http://127.0.0.1:8000/api/classes/${currentClass.class_id}`,
// // // // //                 {
// // // // //                     headers: {
// // // // //                         Authorization: `Bearer ${token}`,
// // // // //                         'X-Academic-Year': academicYr,
// // // // //                     },
// // // // //                     withCredentials: true,
// // // // //                 }
// // // // //             );

// // // // //             fetchClasses();
// // // // //             setShowDeleteModal(false);
// // // // //             setCurrentClass(null);
// // // // //             toast.success('Class deleted successfully!');
// // // // //         } catch (error) {
// // // // //             console.error('Error deleting class:', error);
// // // // //             setError(error.message);
// // // // //         }
// // // // //     };

// // // // //     // Filter classes by name
// // // // //     const filteredClasses = classes.filter(cls =>
// // // // //         cls.name.toLowerCase().includes(searchTerm.toLowerCase())
// // // // //     );

// // // // //     // Paginated classes
// // // // //     const displayedClasses = filteredClasses.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

// // // // //     if (loading) return <p>Loading...</p>;
// // // // //     if (error) return <p>Error: {error}</p>;

// // // // //     return (
// // // // //         <>
// // // // //             <NavBar />
// // // // //             <ToastContainer />

// // // // //             <div className="container mt-4">
// // // // //                 <div className="card" style={{ margin: '0 auto', width: '70%' }}>
// // // // //                     <div className="card-header d-flex justify-content-between align-items-center">
// // // // //                         <h3>Classes</h3>
// // // // //                         <button className="btn btn-primary btn-sm" style={{ width: '80px' }} onClick={handleAdd}>
// // // // //                             <FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />
// // // // //                             Add
// // // // //                         </button>
// // // // //                     </div>

// // // // //                     <div className="card-body">
// // // // //                         <div className="d-flex justify-content-end mb-2">
// // // // //                             <input
// // // // //                                 type="text"
// // // // //                                 className="form-control w-25"
// // // // //                                 placeholder="Search by name"
// // // // //                                 value={searchTerm}
// // // // //                                 onChange={(e) => setSearchTerm(e.target.value)}
// // // // //                             />
// // // // //                         </div>
// // // // //                         <div className="table-responsive">
// // // // //                             <table className="table table-bordered table-striped">
// // // // //                                 <thead>
// // // // //                                     <tr>
// // // // //                                         <th>Name</th>
// // // // //                                         <th>Department</th>
// // // // //                                         <th>Edit</th>
// // // // //                                         <th>Delete</th>
// // // // //                                     </tr>
// // // // //                                 </thead>
// // // // //                                 <tbody>
// // // // //                                     {displayedClasses.map((cls) => (
// // // // //                                         <tr key={cls.class_id}>
// // // // //                                             <td>{cls.name}</td>
// // // // //                                             <td>{cls.get_department.name}</td>
// // // // //                                             <td className="text-center">
// // // // //                                                 <FontAwesomeIcon
// // // // //                                                     icon={faEdit}
// // // // //                                                     className="text-warning"
// // // // //                                                     onClick={() => handleEdit(cls)}
// // // // //                                                     style={{ cursor: 'pointer', fontSize: '1.5em' }}
// // // // //                                                 />
// // // // //                                             </td>
// // // // //                                             <td className="text-center">
// // // // //                                                 <FontAwesomeIcon
// // // // //                                                     icon={faTrash}
// // // // //                                                     className="text-danger"
// // // // //                                                     onClick={() => handleDelete(cls.class_id)}
// // // // //                                                     style={{ cursor: 'pointer', fontSize: '1.5em' }}
// // // // //                                                 />
// // // // //                                             </td>
// // // // //                                         </tr>
// // // // //                                     ))}
// // // // //                                 </tbody>
// // // // //                             </table>
// // // // //                         </div>
// // // // //                         <div className="d-flex justify-content-center mt-3">
// // // // //                             <ReactPaginate
// // // // //                                 previousLabel={'previous'}
// // // // //                                 nextLabel={'next'}
// // // // //                                 breakLabel={'...'}
// // // // //                                 breakClassName={'page-item'}
// // // // //                                 breakLinkClassName={'page-link'}
// // // // //                                 pageCount={pageCount}
// // // // //                                 marginPagesDisplayed={2}
// // // // //                                 pageRangeDisplayed={5}
// // // // //                                 onPageChange={handlePageClick}
// // // // //                                 containerClassName={'pagination justify-content-center'}
// // // // //                                 pageClassName={'page-item'}
// // // // //                                 pageLinkClassName={'page-link'}
// // // // //                                 previousClassName={'page-item'}
// // // // //                                 previousLinkClassName={'page-link'}
// // // // //                                 nextClassName={'page-item'}
// // // // //                                 nextLinkClassName={'page-link'}
// // // // //                                 activeClassName={'active'}
// // // // //                             />
// // // // //                         </div>
// // // // //                     </div>
// // // // //                 </div>
// // // // //             </div>

// // // // //             {/* Modal for adding a new class */}
// // // // //             {showAddModal && (
// // // // //                 <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
// // // // //                     <div className="modal-dialog modal-lg">
// // // // //                         <div className="modal-content">
// // // // //                             <div className="modal-header">
// // // // //                                 <h5 className="modal-title">Add New Class</h5>
// // // // //                                 <button type="button" className="close" onClick={handleCloseModal}>
// // // // //                                     <span>&times;</span>
// // // // //                                 </button>
// // // // //                             </div>
// // // // //                             <div className="modal-body">
// // // // //                                 <form onSubmit={(e) => {
// // // // //                                     e.preventDefault();
// // // // //                                     handleSubmitAdd();
// // // // //                                 }}>
// // // // //                                     <div className="form-group">
// // // // //                                         <label htmlFor="newClassName">Name</label>
// // // // //                                         <input
// // // // //                                             type="text"
// // // // //                                             className="form-control"
// // // // //                                             id="newClassName"
// // // // //                                             value={newClassName}
// // // // //                                             onChange={(e) => setNewClassName(e.target.value)}
// // // // //                                             required
// // // // //                                         />
// // // // //                                     </div>
// // // // //                                     <div className="form-group">
// // // // //                                         <label htmlFor="newDepartmentId">Department</label>
// // // // //                                         <select
// // // // //                                             className="form-control"
// // // // //                                             id="newDepartmentId"
// // // // //                                             value={newDepartmentId}
// // // // //                                             onChange={(e) => setNewDepartmentId(e.target.value)}
// // // // //                                             required
// // // // //                                         >
// // // // //                                             <option value="">Select Department</option>
// // // // //                                             {departments.map((dept) => (
// // // // //                                                 <option key={dept.id} value={dept.id}>
// // // // //                                                     {dept.name}
// // // // //                                                 </option>
// // // // //                                             ))}
// // // // //                                         </select>
// // // // //                                     </div>
// // // // //                                     <button type="submit" className="btn btn-primary">Submit</button>
// // // // //                                     <button type="button" className="btn btn-secondary ml-2" onClick={handleCloseModal}>Cancel</button>
// // // // //                                 </form>
// // // // //                             </div>
// // // // //                         </div>
// // // // //                     </div>
// // // // //                 </div>
// // // // //             )}
// // // // //             {/* Modal for editing a class */}
// // // // //             {showEditModal && (
// // // // //                 <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
// // // // //                     <div className="modal-dialog modal-lg">
// // // // //                         <div className="modal-content">
// // // // //                             <div className="modal-header">
// // // // //                                 <h5 className="modal-title">Edit Class</h5>
// // // // //                                 <button type="button" className="close" onClick={handleCloseModal}>
// // // // //                                     <span>&times;</span>
// // // // //                                 </button>
// // // // //                             </div>
// // // // //                             <div className="modal-body">
// // // // //                                 <form onSubmit={(e) => {
// // // // //                                     e.preventDefault();
// // // // //                                     handleSubmitEdit();
// // // // //                                 }}>
// // // // //                                     <div className="form-group">
// // // // //                                         <label htmlFor="editClassName">Name</label>
// // // // //                                         <input
// // // // //                                             type="text"
// // // // //                                             className="form-control"
// // // // //                                             id="editClassName"
// // // // //                                             value={newClassName}
// // // // //                                             onChange={(e) => setNewClassName(e.target.value)}
// // // // //                                             required
// // // // //                                         />
// // // // //                                     </div>
// // // // //                                     <div className="form-group">
// // // // //                                         <label htmlFor="editDepartmentId">Department</label>
// // // // //                                         <select
// // // // //                                             className="form-control"
// // // // //                                             id="editDepartmentId"
// // // // //                                             value={newDepartmentId}
// // // // //                                             onChange={(e) => setNewDepartmentId(e.target.value)}
// // // // //                                             required
// // // // //                                         >
// // // // //                                             <option value="">Select Department</option>
// // // // //                                             {departments.map((dept) => (
// // // // //                                                 <option key={dept.id} value={dept.id}>
// // // // //                                                     {dept.name}
// // // // //                                                 </option>
// // // // //                                             ))}
// // // // //                                         </select>
// // // // //                                     </div>
// // // // //                                     <button type="submit" className="btn btn-primary">Submit</button>
// // // // //                                     <button type="button" className="btn btn-secondary ml-2" onClick={handleCloseModal}>Cancel</button>
// // // // //                                 </form>
// // // // //                             </div>
// // // // //                         </div>
// // // // //                     </div>
// // // // //                 </div>
// // // // //             )}
// // // // //             {/* Modal for deleting a class */}
// // // // //             {showDeleteModal && (
// // // // //                 <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
// // // // //                     <div className="modal-dialog modal-lg">
// // // // //                         <div className="modal-content">
// // // // //                             <div className="modal-header">
// // // // //                                 <h5 className="modal-title">Delete Class</h5>
// // // // //                                 <button type="button" className="close" onClick={handleCloseModal}>
// // // // //                                     <span>&times;</span>
// // // // //                                 </button>
// // // // //                             </div>
// // // // //                             <div className="modal-body">
// // // // //                                 <p>Are you sure you want to delete this class?</p>
// // // // //                                 <button type="button" className="btn btn-danger" onClick={handleSubmitDelete}>Delete</button>
// // // // //                                 <button type="button" className="btn btn-secondary ml-2" onClick={handleCloseModal}>Cancel</button>
// // // // //                             </div>
// // // // //                         </div>
// // // // //                     </div>
// // // // //                 </div>
// // // // //             )}
// // // // //         </>
// // // // //     );
// // // // // }

// // // // // export default Classes;

// // // // import React, { useEffect, useState } from 'react';
// // // // import axios from 'axios';
// // // // import ReactPaginate from 'react-paginate';
// // // // import NavBar from '../Header/NavBar';
// // // // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // // // import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
// // // // import { ToastContainer, toast } from 'react-toastify';
// // // // import 'react-toastify/dist/ReactToastify.css';
// // // // import 'bootstrap/dist/css/bootstrap.min.css';

// // // // function Classes() {
// // // //     const [classes, setClasses] = useState([]);
// // // //     const [departments, setDepartments] = useState([]);
// // // //     const [loading, setLoading] = useState(true);
// // // //     const [error, setError] = useState(null);
// // // //     const [showAddModal, setShowAddModal] = useState(false);
// // // //     const [showEditModal, setShowEditModal] = useState(false);
// // // //     const [showDeleteModal, setShowDeleteModal] = useState(false);
// // // //     const [currentClass, setCurrentClass] = useState(null);
// // // //     const [newClassName, setNewClassName] = useState('');
// // // //     const [newDepartmentId, setNewDepartmentId] = useState('');
// // // //     const [searchTerm, setSearchTerm] = useState('');
// // // //     const [currentPage, setCurrentPage] = useState(0);
// // // //     const [pageCount, setPageCount] = useState(0);
// // // //     const pageSize = 10;

// // // //     // Fetch classes and departments from backend
// // // //     const fetchClasses = async () => {
// // // //         try {
// // // //             const token = localStorage.getItem('authToken');
// // // //             const academicYr = localStorage.getItem('academicYear');

// // // //             if (!token || !academicYr) {
// // // //                 throw new Error('No authentication token or academic year found');
// // // //             }

// // // //             const response = await axios.get('http://127.0.0.1:8000/api/classes', {
// // // //                 headers: {
// // // //                     Authorization: `Bearer ${token}`,
// // // //                     'X-Academic-Year': academicYr,
// // // //                 },
// // // //                 withCredentials: true,
// // // //             });

// // // //             setClasses(response.data);
// // // //             setPageCount(Math.ceil(response.data.length / pageSize));
// // // //         } catch (error) {
// // // //             setError(error.message);
// // // //         } finally {
// // // //             setLoading(false);
// // // //         }
// // // //     };

// // // //     const fetchDepartments = async () => {
// // // //         try {
// // // //             const token = localStorage.getItem('authToken');
// // // //             const academicYr = localStorage.getItem('academicYear');

// // // //             if (!token || !academicYr) {
// // // //                 throw new Error('No authentication token or academic year found');
// // // //             }

// // // //             const response = await axios.get('http://127.0.0.1:8000/api/sections', {
// // // //                 headers: {
// // // //                     Authorization: `Bearer ${token}`,
// // // //                     'X-Academic-Year': academicYr,
// // // //                 },
// // // //                 withCredentials: true,
// // // //             });

// // // //             setDepartments(response.data);
// // // //         } catch (error) {
// // // //             setError(error.message);
// // // //         }
// // // //     };

// // // //     useEffect(() => {
// // // //         fetchClasses();
// // // //         fetchDepartments();
// // // //     }, []);

// // // //     // Pagination handling
// // // //     const handlePageClick = (data) => {
// // // //         setCurrentPage(data.selected);
// // // //     };

// // // //     // Edit class modal handling
// // // //     const handleEdit = (classObj) => {
// // // //         setCurrentClass(classObj);
// // // //         setNewClassName(classObj.name);
// // // //         setNewDepartmentId(classObj.department_id);
// // // //         setShowEditModal(true);
// // // //     };

// // // //     // Add class modal handling
// // // //     const handleAdd = () => {
// // // //         setShowAddModal(true);
// // // //     };

// // // //     // Close all modals
// // // //     const handleCloseModal = () => {
// // // //         setShowAddModal(false);
// // // //         setShowEditModal(false);
// // // //         setShowDeleteModal(false);
// // // //         setCurrentClass(null);
// // // //         setNewClassName('');
// // // //         setNewDepartmentId('');
// // // //     };

// // // //     // Submit add class form
// // // //     const handleSubmitAdd = async () => {
// // // //         try {
// // // //             const token = localStorage.getItem('authToken');
// // // //             const academicYr = localStorage.getItem('academicYear');

// // // //             if (!token || !academicYr) {
// // // //                 throw new Error('No authentication token or academic year found');
// // // //             }

// // // //             await axios.post(
// // // //                 'http://127.0.0.1:8000/api/classes',
// // // //                 {
// // // //                     name: newClassName,
// // // //                     department_id: newDepartmentId,
// // // //                 },
// // // //                 {
// // // //                     headers: {
// // // //                         Authorization: `Bearer ${token}`,
// // // //                         'X-Academic-Year': academicYr,
// // // //                     },
// // // //                     withCredentials: true,
// // // //                 }
// // // //             );

// // // //             fetchClasses();
// // // //             handleCloseModal();
// // // //             toast.success('Class added successfully!');
// // // //         } catch (error) {
// // // //             console.error('Error adding class:', error);
// // // //         }
// // // //     };

// // // //     // Submit edit class form
// // // //     const handleSubmitEdit = async () => {
// // // //         try {
// // // //             const token = localStorage.getItem('authToken');
// // // //             const academicYr = localStorage.getItem('academicYear');

// // // //             if (!token || !academicYr || !currentClass || !currentClass.class_id) {
// // // //                 throw new Error('Class ID is missing');
// // // //             }

// // // //             await axios.put(
// // // //                 `http://127.0.0.1:8000/api/classes/${currentClass.class_id}`,
// // // //                 {
// // // //                     name: newClassName,
// // // //                     department_id: newDepartmentId,
// // // //                 },
// // // //                 {
// // // //                     headers: {
// // // //                         Authorization: `Bearer ${token}`,
// // // //                         'X-Academic-Year': academicYr,
// // // //                     },
// // // //                     withCredentials: true,
// // // //                 }
// // // //             );

// // // //             fetchClasses();
// // // //             handleCloseModal();
// // // //             toast.success('Class updated successfully!');
// // // //         } catch (error) {
// // // //             console.error('Error updating class:', error);
// // // //         }
// // // //     };

// // // //     // Delete class handling
// // // //     const handleDelete = (id) => {
// // // //         const classToDelete = classes.find(cls => cls.class_id === id);
// // // //         setCurrentClass(classToDelete);
// // // //         setShowDeleteModal(true);
// // // //     };

// // // //     // Submit delete class form
// // // //     const handleSubmitDelete = async () => {
// // // //         try {
// // // //             const token = localStorage.getItem('authToken');
// // // //             const academicYr = localStorage.getItem('academicYear');

// // // //             if (!token || !academicYr || !currentClass || !currentClass.class_id) {
// // // //                 throw new Error('Class ID is missing');
// // // //             }

// // // //             await axios.delete(
// // // //                 `http://127.0.0.1:8000/api/classes/${currentClass.class_id}`,
// // // //                 {
// // // //                     headers: {
// // // //                         Authorization: `Bearer ${token}`,
// // // //                         'X-Academic-Year': academicYr,
// // // //                     },
// // // //                     withCredentials: true,
// // // //                 }
// // // //             );

// // // //             fetchClasses();
// // // //             setShowDeleteModal(false);
// // // //             setCurrentClass(null);
// // // //             toast.success('Class deleted successfully!');
// // // //         } catch (error) {
// // // //             console.error('Error deleting class:', error);
// // // //             setError(error.message);
// // // //         }
// // // //     };

// // // //     // Filter classes by name
// // // //     const filteredClasses = classes.filter(cls =>
// // // //         cls.name.toLowerCase().includes(searchTerm.toLowerCase())
// // // //     );

// // // //     // Paginated classes
// // // //     const displayedClasses = filteredClasses.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

// // // //     if (loading) return <p>Loading...</p>;
// // // //     if (error) return <p>Error: {error}</p>;

// // // //     return (
// // // //         <>
// // // //             <NavBar />
// // // //             <ToastContainer />

// // // //             <div className="container mt-4">
// // // //                 <div className="card" style={{ margin: '0 auto', width: '70%' }}>
// // // //                     <div className="card-header d-flex justify-content-between align-items-center">
// // // //                         <h3>Classes</h3>
// // // //                         <button className="btn btn-primary btn-sm" style={{ width: '80px' }} onClick={handleAdd}>
// // // //                             <FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />
// // // //                             Add
// // // //                         </button>
// // // //                     </div>

// // // //                     <div className="card-body">
// // // //                         <div className="d-flex justify-content-end mb-2">
// // // //                             <input
// // // //                                 type="text"
// // // //                                 className="form-control w-25"
// // // //                                 placeholder="Search by name"
// // // //                                 value={searchTerm}
// // // //                                 onChange={(e) => setSearchTerm(e.target.value)}
// // // //                             />
// // // //                         </div>
// // // //                         <div className="table-responsive">
// // // //                             <table className="table table-bordered table-striped">
// // // //                                 <thead>
// // // //                                     <tr>
// // // //                                         <th>Name</th>
// // // //                                         <th>Department</th>
// // // //                                         <th>Edit</th>
// // // //                                         <th>Delete</th>
// // // //                                     </tr>
// // // //                                 </thead>
// // // //                                 <tbody>
// // // //                                     {displayedClasses.map((cls) => (
// // // //                                         <tr key={cls.class_id}>
// // // //                                             <td>{cls.name}</td>
// // // //                                             <td>{cls.get_department.name}</td>
// // // //                                             <td className="text-center">
// // // //                                                 <FontAwesomeIcon
// // // //                                                     icon={faEdit}
// // // //                                                     className="text-warning"
// // // //                                                     onClick={() => handleEdit(cls)}
// // // //                                                     style={{ cursor: 'pointer', fontSize: '1.5em' }}
// // // //                                                 />
// // // //                                             </td>
// // // //                                             <td className="text-center">
// // // //                                                 <FontAwesomeIcon
// // // //                                                     icon={faTrash}
// // // //                                                     className="text-danger"
// // // //                                                     onClick={() => handleDelete(cls.class_id)}
// // // //                                                     style={{ cursor: 'pointer', fontSize: '1.5em' }}
// // // //                                                 />
// // // //                                             </td>
// // // //                                         </tr>
// // // //                                     ))}
// // // //                                 </tbody>
// // // //                             </table>
// // // //                         </div>
// // // //                         <div className="d-flex justify-content-center mt-3">
// // // //                             <ReactPaginate
// // // //                                 previousLabel={'previous'}
// // // //                                 nextLabel={'next'}
// // // //                                 breakLabel={'...'}
// // // //                                 breakClassName={'page-item'}
// // // //                                 breakLinkClassName={'page-link'}
// // // //                                 pageCount={pageCount}
// // // //                                 marginPagesDisplayed={2}
// // // //                                 pageRangeDisplayed={5}
// // // //                                 onPageChange={handlePageClick}
// // // //                                 containerClassName={'pagination justify-content-center'}
// // // //                                 pageClassName={'page-item'}
// // // //                                 pageLinkClassName={'page-link'}
// // // //                                 previousClassName={'page-item'}
// // // //                                 previousLinkClassName={'page-link'}
// // // //                                 nextClassName={'page-item'}
// // // //                                 nextLinkClassName={'page-link'}
// // // //                                 activeClassName={'active'}
// // // //                             />
// // // //                         </div>
// // // //                     </div>
// // // //                 </div>
// // // //             </div>

// // // //             {/* Modal for adding a new class */}
// // // //             {showAddModal && (
// // // //                 <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
// // // //                     <div className="modal-dialog modal-lg">
// // // //                         <div className="modal-content">
// // // //                             <div className="modal-header">
// // // //                                 <h5 className="modal-title">Add New Class</h5>
// // // //                                 <button type="button" className="close" onClick={handleCloseModal}>
// // // //                                     <span>&times;</span>
// // // //                                 </button>
// // // //                             </div>
// // // //                             <div className="modal-body">
// // // //                                 <form onSubmit={(e) => {
// // // //                                     e.preventDefault();
// // // //                                     handleSubmitAdd();
// // // //                                 }}>
// // // //                                     <div className="form-group">
// // // //                                         <label htmlFor="newClassName">Name</label>
// // // //                                         <input
// // // //                                             type="text"
// // // //                                             className="form-control"
// // // //                                             id="newClassName"
// // // //                                             value={newClassName}
// // // //                                             onChange={(e) => setNewClassName(e.target.value)}
// // // //                                             required
// // // //                                         />
// // // //                                     </div>
// // // //                                     <div className="form-group">
// // // //                                         <label htmlFor="newDepartmentId">Department</label>
// // // //                                         <select
// // // //                                             className="form-control"
// // // //                                             id="newDepartmentId"
// // // //                                             value={newDepartmentId}
// // // //                                             onChange={(e) => setNewDepartmentId(e.target.value)}
// // // //                                             required
// // // //                                         >
// // // //                                             <option value="">Select Department</option>
// // // //                                             {departments.map((dept) => (
// // // //                                                 <option key={dept.id} value={dept.id}>
// // // //                                                     {dept.name}
// // // //                                                 </option>
// // // //                                             ))}
// // // //                                         </select>
// // // //                                     </div>
// // // //                                     <button type="submit" className="btn btn-primary">Submit</button>
// // // //                                     <button type="button" className="btn btn-secondary ml-2" onClick={handleCloseModal}>Cancel</button>
// // // //                                 </form>
// // // //                             </div>
// // // //                         </div>
// // // //                     </div>
// // // //                 </div>
// // // //             )}
// // // //             {/* Modal for editing a class */}
// // // //             {showEditModal && (
// // // //                 <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
// // // //                     <div className="modal-dialog modal-lg">
// // // //                         <div className="modal-content">
// // // //                             <div className="modal-header">
// // // //                                 <h5 className="modal-title">Edit Class</h5>
// // // //                                 <button type="button" className="close" onClick={handleCloseModal}>
// // // //                                     <span>&times;</span>
// // // //                                 </button>
// // // //                             </div>
// // // //                             <div className="modal-body">
// // // //                                 <form onSubmit={(e) => {
// // // //                                     e.preventDefault();
// // // //                                     handleSubmitEdit();
// // // //                                 }}>
// // // //                                     <div className="form-group">
// // // //                                         <label htmlFor="editClassName">Name</label>
// // // //                                         <input
// // // //                                             type="text"
// // // //                                             className="form-control"
// // // //                                             id="editClassName"
// // // //                                             value={newClassName}
// // // //                                             onChange={(e) => setNewClassName(e.target.value)}
// // // //                                             required
// // // //                                         />
// // // //                                     </div>
// // // //                                     <div className="form-group">
// // // //                                         <label htmlFor="editDepartmentId">Department</label>
// // // //                                         <select
// // // //                                             className="form-control"
// // // //                                             id="editDepartmentId"
// // // //                                             value={newDepartmentId}
// // // //                                             onChange={(e) => setNewDepartmentId(e.target.value)}
// // // //                                             required
// // // //                                         >
// // // //                                             <option value="">Select Department</option>
// // // //                                             {departments.map((dept) => (
// // // //                                                 <option key={dept.id} value={dept.id}>
// // // //                                                     {dept.name}
// // // //                                                 </option>
// // // //                                             ))}
// // // //                                         </select>
// // // //                                     </div>
// // // //                                     <button type="submit" className="btn btn-primary">Submit</button>
// // // //                                     <button type="button" className="btn btn-secondary ml-2" onClick={handleCloseModal}>Cancel</button>
// // // //                                 </form>
// // // //                             </div>
// // // //                         </div>
// // // //                     </div>
// // // //                 </div>
// // // //             )}
// // // //             {/* Modal for deleting a class */}
// // // //             {showDeleteModal && (
// // // //                 <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
// // // //                     <div className="modal-dialog modal-lg">
// // // //                         <div className="modal-content">
// // // //                             <div className="modal-header">
// // // //                                 <h5 className="modal-title">Delete Class</h5>
// // // //                                 <button type="button" className="close" onClick={handleCloseModal}>
// // // //                                     <span>&times;</span>
// // // //                                 </button>
// // // //                             </div>
// // // //                             <div className="modal-body">
// // // //                                 <p>Are you sure you want to delete this class?</p>
// // // //                                 <button type="button" className="btn btn-danger" onClick={handleSubmitDelete}>Delete</button>
// // // //                                 <button type="button" className="btn btn-secondary ml-2" onClick={handleCloseModal}>Cancel</button>
// // // //                             </div>
// // // //                         </div>
// // // //                     </div>
// // // //                 </div>
// // // //             )}
// // // //         </>
// // // //     );
// // // // }

// // // // export default Classes;

// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import ReactPaginate from 'react-paginate';
// // import NavBar from '../Header/NavBar';
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
// // import { ToastContainer, toast } from 'react-toastify';
// // import 'react-toastify/dist/ReactToastify.css';
// // import 'bootstrap/dist/css/bootstrap.min.css';

// // function ClassList() {
// //     const [classes, setClasses] = useState([]);
// //     const [departments, setDepartments] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState(null);
// //     const [showAddModal, setShowAddModal] = useState(false);
// //     const [showEditModal, setShowEditModal] = useState(false);
// //     const [showDeleteModal, setShowDeleteModal] = useState(false);
// //     const [currentClass, setCurrentClass] = useState(null);
// //     const [newClassName, setNewClassName] = useState('');
// //     const [newDepartmentId, setNewDepartmentId] = useState('');
// //     const [searchTerm, setSearchTerm] = useState('');
// //     const [currentPage, setCurrentPage] = useState(0);
// //     const [pageCount, setPageCount] = useState(0);
// //     const pageSize = 10;

// //     // Fetch classes and departments from backend
// //     const fetchClasses = async () => {
// //         try {
// //             const token = localStorage.getItem('authToken');
// //             const academicYr = localStorage.getItem('academicYear');

// //             if (!token || !academicYr) {
// //                 throw new Error('No authentication token or academic year found');
// //             }

// //             const response = await axios.get('http://127.0.0.1:8000/api/classes', {
// //                 headers: {
// //                     Authorization: `Bearer ${token}`,
// //                     'X-Academic-Year': academicYr,
// //                 },
// //                 withCredentials: true,
// //             });

// //             setClasses(response.data);
// //             setPageCount(Math.ceil(response.data.length / pageSize));
// //         } catch (error) {
// //             setError(error.message);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const fetchDepartments = async () => {
// //         try {
// //             const token = localStorage.getItem('authToken');
// //             const academicYr = localStorage.getItem('academicYear');

// //             if (!token || !academicYr) {
// //                 throw new Error('No authentication token or academic year found');
// //             }

// //             const response = await axios.get('http://127.0.0.1:8000/api/sections', {
// //                 headers: {
// //                     Authorization: `Bearer ${token}`,
// //                     'X-Academic-Year': academicYr,
// //                 },
// //                 withCredentials: true,
// //             });

// //             setDepartments(response.data);
// //         } catch (error) {
// //             setError(error.message);
// //         }
// //     };

// //     useEffect(() => {
// //         fetchClasses();
// //         fetchDepartments();
// //     }, []);

// //     // Edit class modal handling
// //     const handleEdit = (classObj) => {
// //         setCurrentClass(classObj);
// //         setNewClassName(classObj.name);
// //         // Find the department ID from departments array based on the name
// //         const department = departments.find(dep => dep.name === classObj.department_id);
// //         if (department) {
// //             setNewDepartmentId(department.id);
// //         }
// //         setShowEditModal(true);
// //     };

// //     // Add class modal handling
// //     const handleAdd = () => {
// //         setShowAddModal(true);
// //     };

// //     // Close all modals
// //     const handleCloseModal = () => {
// //         setShowAddModal(false);
// //         setShowEditModal(false);
// //         setShowDeleteModal(false);
// //         setCurrentClass(null);
// //         setNewClassName('');
// //         setNewDepartmentId('');
// //     };

// //     // Submit add class form
// //     const handleSubmitAdd = async () => {
// //         try {
// //             const token = localStorage.getItem('authToken');
// //             const academicYr = localStorage.getItem('academicYear');

// //             if (!token || !academicYr) {
// //                 throw new Error('No authentication token or academic year found');
// //             }

// //             await axios.post(
// //                 'http://127.0.0.1:8000/api/classes',
// //                 {
// //                     name: newClassName,
// //                     department_id: newDepartmentId,
// //                 },
// //                 {
// //                     headers: {
// //                         Authorization: `Bearer ${token}`,
// //                         'X-Academic-Year': academicYr,
// //                     },
// //                     withCredentials: true,
// //                 }
// //             );

// //             fetchClasses();
// //             handleCloseModal();
// //             toast.success('Class added successfully!');
// //         } catch (error) {
// //             console.error('Error adding class:', error);
// //         }
// //     };

// //     // Submit edit class form
// //     const handleSubmitEdit = async () => {
// //         try {
// //             const token = localStorage.getItem('authToken');
// //             const academicYr = localStorage.getItem('academicYear');

// //             if (!token || !academicYr || !currentClass || !currentClass.class_id) {
// //                 throw new Error('Class ID is missing');
// //             }

// //             await axios.put(
// //                 `http://127.0.0.1:8000/api/classes/${currentClass.class_id}`,
// //                 {
// //                     name: newClassName,
// //                     department_id: newDepartmentId,
// //                 },
// //                 {
// //                     headers: {
// //                         Authorization: `Bearer ${token}`,
// //                         'X-Academic-Year': academicYr,
// //                     },
// //                     withCredentials: true,
// //                 }
// //             );

// //             fetchClasses();
// //             handleCloseModal();
// //             toast.success('Class updated successfully!');
// //         } catch (error) {
// //             console.error('Error updating class:', error);
// //         }
// //     };

// //     // Delete class handling
// //     const handleDelete = (id) => {
// //         const classToDelete = classes.find(cls => cls.class_id === id);
// //         setCurrentClass(classToDelete);
// //         setShowDeleteModal(true);
// //     };

// //     // Submit delete class form
// //     const handleSubmitDelete = async () => {
// //         try {
// //             const token = localStorage.getItem('authToken');
// //             const academicYr = localStorage.getItem('academicYear');

// //             if (!token || !academicYr || !currentClass || !currentClass.class_id) {
// //                 throw new Error('Class ID is missing');
// //             }

// //             await axios.delete(
// //                 `http://127.0.0.1:8000/api/classes/${currentClass.class_id}`,
// //                 {
// //                     headers: {
// //                         Authorization: `Bearer ${token}`,
// //                         'X-Academic-Year': academicYr,
// //                     },
// //                     withCredentials: true,
// //                 }
// //             );

// //             fetchClasses();
// //             setShowDeleteModal(false);
// //             setCurrentClass(null);
// //             toast.success('Class deleted successfully!');
// //         } catch (error) {
// //             console.error('Error deleting class:', error);
// //             setError(error.message);
// //         }
// //     };

// //     // Filter classes by name
// //     const filteredClasses = classes.filter(cls =>
// //         cls.name.toLowerCase().includes(searchTerm.toLowerCase())
// //     );

// //     // Paginated classes
// //     const displayedClasses = filteredClasses.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

// //     if (loading) return <p>Loading...</p>;
// //     if (error) return <p>Error: {error}</p>;

// //     return (
// //         <>
// //             <NavBar />
// //             <ToastContainer />

// //             <div className="container mt-4">
// //                 <div className="card" style={{ margin: '0 auto', width: '70%' }}>
// //                     <div className="card-header d-flex justify-content-between align-items-center">
// //                         <h3>Classes</h3>
// //                         <button className="btn btn-primary btn-sm" style={{ width: '80px' }} onClick={handleAdd}>
// //                             <FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />
// //                             Add
// //                         </button>
// //                     </div>

// //                     <div className="card-body">
// //                         <div className="d-flex justify-content-end mb-2">
// //                             <input
// //                                 type="text"
// //                                 className="form-control w-25"
// //                                 placeholder="Search by name"
// //                                 value={searchTerm}
// //                                 onChange={(e) => setSearchTerm(e.target.value)}
// //                             />
// //                         </div>
// //                         <div className="table-responsive">
// //                             <table className="table table-bordered table-striped">
// //                                 <thead>
// //                                     <tr>
// //                                         <th>Name</th>
// //                                         <th>Department</th>
// //                                         <th>Edit</th>
// //                                         <th>Delete</th>
// //                                     </tr>
// //                                 </thead>
// //                                 <tbody>
// //                                     {displayedClasses.map((cls) => (
// //                                         <tr key={cls.class_id}>
// //                                             <td>{cls.name}</td>
// //                                             <td>{cls.get_department.name}</td>
// //                                             <td className="text-center">
// //                                                 <FontAwesomeIcon
// //                                                     icon={faEdit}
// //                                                     className="text-warning"
// //                                                     onClick={() => handleEdit(cls)}
// //                                                     style={{ cursor: 'pointer', fontSize: '1.5em' }}
// //                                                 />
// //                                             </td>
// //                                             <td className="text-center">
// //                                                 <FontAwesomeIcon
// //                                                     icon={faTrash}
// //                                                     className="text-danger"
// //                                                     onClick={() => handleDelete(cls.class_id)}
// //                                                     style={{ cursor: 'pointer', fontSize: '1.5em' }}
// //                                                 />
// //                                             </td>
// //                                         </tr>
// //                                     ))}
// //                                 </tbody>
// //                             </table>
// //                         </div>
// //                         <div className="d-flex justify-content-center mt-3">
// //                             <ReactPaginate
// //                                 previousLabel={'previous'}
// //                                 nextLabel={'next'}
// //                                 breakLabel={'...'}
// //                                 breakClassName={'page-item'}
// //                                 breakLinkClassName={'page-link'}
// //                                 pageCount={pageCount}
// //                                 marginPagesDisplayed={2}
// //                                 pageRangeDisplayed={5}
// //                                 onPageChange={(data) => setCurrentPage(data.selected)}
// //                                 containerClassName={'pagination'}
// //                                 activeClassName={'active'}
// //                                 pageClassName={'page-item'}
// //                                 pageLinkClassName={'page-link'}
// //                                 previousClassName={'page-item'}
// //                                 nextClassName={'page-item'}
// //                                 previousLinkClassName={'page-link'}
// //                                 nextLinkClassName={'page-link'}
// //                             />
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* Add Class Modal */}
// //             <div className={`modal ${showAddModal ? 'show d-block' : ''}`} id="addModal" tabIndex="-1" role="dialog">
// //                 <div className="modal-dialog" role="document">
// //                     <div className="modal-content">
// //                         <div className="modal-header">
// //                             <h5 className="modal-title">Add Class</h5>
// //                             <button type="button" className="close" onClick={handleCloseModal}>
// //                                 <span>&times;</span>
// //                             </button>
// //                         </div>
// //                         <div className="modal-body">
// //                             <form>
// //                                 <div className="form-group">
// //                                     <label htmlFor="className">Name</label>
// //                                     <input
// //                                         type="text"
// //                                         className="form-control"
// //                                         id="className"
// //                                         value={newClassName}
// //                                         onChange={(e) => setNewClassName(e.target.value)}
// //                                     />
// //                                 </div>
// //                                 <div className="form-group">
// //                                     <label htmlFor="departmentId">Department</label>
// //                                     <select
// //                                         className="form-control"
// //                                         id="departmentId"
// //                                         value={newDepartmentId}
// //                                         onChange={(e) => setNewDepartmentId(e.target.value)}
// //                                     >
// //                                         <option value="">Select Department</option>
// //                                         {departments.map((department) => (
// //                                             <option key={department.id} value={department.id}>
// //                                                 {department.name}
// //                                             </option>
// //                                         ))}
// //                                     </select>
// //                                 </div>
// //                             </form>
// //                         </div>
// //                         <div className="modal-footer">
// //                             <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
// //                                 Close
// //                             </button>
// //                             <button type="button" className="btn btn-primary" onClick={handleSubmitAdd}>
// //                                 Add Class
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* Edit Class Modal */}
// //             <div className={`modal ${showEditModal ? 'show d-block' : ''}`} id="editModal" tabIndex="-1" role="dialog">
// //                 <div className="modal-dialog" role="document">
// //                     <div className="modal-content">
// //                         <div className="modal-header">
// //                             <h5 className="modal-title">Edit Class</h5>
// //                             <button type="button" className="close" onClick={handleCloseModal}>
// //                                 <span>&times;</span>
// //                             </button>
// //                         </div>
// //                         <div className="modal-body">
// //                             <form>
// //                                 <div className="form-group">
// //                                     <label htmlFor="editClassName">Name</label>
// //                                     <input
// //                                         type="text"
// //                                         className="form-control"
// //                                         id="editClassName"
// //                                         value={newClassName}
// //                                         onChange={(e) => setNewClassName(e.target.value)}
// //                                     />
// //                                 </div>
// //                                 <div className="form-group">
// //                                     <label htmlFor="editDepartmentId">Department</label>
// //                                     <select
// //                                         className="form-control"
// //                                         id="editDepartmentId"
// //                                         value={newDepartmentId}
// //                                         onChange={(e) => setNewDepartmentId(e.target.value)}
// //                                     >
// //                                         <option value="">Select Department</option>
// //                                         {departments.map((department) => (
// //                                             <option key={department.id} value={department.id}>
// //                                                 {department.name}
// //                                             </option>
// //                                         ))}
// //                                     </select>
// //                                 </div>
// //                             </form>
// //                         </div>
// //                         <div className="modal-footer">
// //                             <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
// //                                 Close
// //                             </button>
// //                             <button type="button" className="btn btn-primary" onClick={handleSubmitEdit}>
// //                                 Save Changes
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* Delete Class Modal */}
// //             <div className={`modal ${showDeleteModal ? 'show d-block' : ''}`} id="deleteModal" tabIndex="-1" role="dialog">
// //                 <div className="modal-dialog" role="document">
// //                     <div className="modal-content">
// //                         <div className="modal-header">
// //                             <h5 className="modal-title">Confirm Delete</h5>
// //                             <button type="button" className="close" onClick={handleCloseModal}>
// //                                 <span>&times;</span>
// //                             </button>
// //                         </div>
// //                         <div className="modal-body">
// //                             <p>Are you sure you want to delete class: {currentClass?.name}?</p>
// //                         </div>
// //                         <div className="modal-footer">
// //                             <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
// //                                 Cancel
// //                             </button>
// //                             <button type="button" className="btn btn-danger" onClick={handleSubmitDelete}>
// //                                 Delete
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </>
// //     );
// // }

// // export default ClassList;

// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import ReactPaginate from 'react-paginate';
// // import NavBar from '../Header/NavBar';
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
// // import { ToastContainer, toast } from 'react-toastify';
// // import 'react-toastify/dist/ReactToastify.css';
// // import 'bootstrap/dist/css/bootstrap.min.css';

// // function ClassList() {
// //     const [classes, setClasses] = useState([]);
// //     const [departments, setDepartments] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState(null);
// //     const [showAddModal, setShowAddModal] = useState(false);
// //     const [showEditModal, setShowEditModal] = useState(false);
// //     const [showDeleteModal, setShowDeleteModal] = useState(false);
// //     const [currentClass, setCurrentClass] = useState(null);
// //     const [newClassName, setNewClassName] = useState('');
// //     const [newDepartmentId, setNewDepartmentId] = useState('');
// //     const [searchTerm, setSearchTerm] = useState('');
// //     const [currentPage, setCurrentPage] = useState(0);
// //     const [pageCount, setPageCount] = useState(0);
// //     const pageSize = 10;

// //     // Fetch classes and departments from backend
// //     const fetchClasses = async () => {
// //         try {
// //             const token = localStorage.getItem('authToken');
// //             const academicYr = localStorage.getItem('academicYear');

// //             if (!token || !academicYr) {
// //                 throw new Error('No authentication token or academic year found');
// //             }

// //             const response = await axios.get('http://127.0.0.1:8000/api/classes', {
// //                 headers: {
// //                     Authorization: `Bearer ${token}`,
// //                     'X-Academic-Year': academicYr,
// //                 },
// //                 withCredentials: true,
// //             });

// //             setClasses(response.data);
// //             setPageCount(Math.ceil(response.data.length / pageSize));
// //         } catch (error) {
// //             setError(error.message);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const fetchDepartments = async () => {
// //         try {
// //             const token = localStorage.getItem('authToken');
// //             const academicYr = localStorage.getItem('academicYear');

// //             if (!token || !academicYr) {
// //                 throw new Error('No authentication token or academic year found');
// //             }

// //             const response = await axios.get('http://127.0.0.1:8000/api/sections', {
// //                 headers: {
// //                     Authorization: `Bearer ${token}`,
// //                     'X-Academic-Year': academicYr,
// //                 },
// //                 withCredentials: true,
// //             });

// //             setDepartments(response.data);
// //         } catch (error) {
// //             setError(error.message);
// //         }
// //     };

// //     useEffect(() => {
// //         fetchClasses();
// //         fetchDepartments();
// //     }, []);

// //     // Edit class modal handling
// //     const handleEdit = (classObj) => {
// //         setCurrentClass(classObj);
// //         setNewClassName(classObj.name);
// //         setNewDepartmentId(classObj.department_id);
// //         setShowEditModal(true);
// //     };

// //     // Add class modal handling
// //     const handleAdd = () => {
// //         setShowAddModal(true);
// //     };

// //     // Close all modals
// //     const handleCloseModal = () => {
// //         setShowAddModal(false);
// //         setShowEditModal(false);
// //         setShowDeleteModal(false);
// //         setCurrentClass(null);
// //         setNewClassName('');
// //         setNewDepartmentId('');
// //     };

// //     // Submit add class form
// //     const handleSubmitAdd = async () => {
// //         try {
// //             const token = localStorage.getItem('authToken');
// //             const academicYr = localStorage.getItem('academicYear');

// //             if (!token || !academicYr) {
// //                 throw new Error('No authentication token or academic year found');
// //             }

// //             await axios.post(
// //                 'http://127.0.0.1:8000/api/classes',
// //                 {
// //                     name: newClassName,
// //                     department_id: parseInt(newDepartmentId), // Ensure department_id is an integer
// //                 },
// //                 {
// //                     headers: {
// //                         Authorization: `Bearer ${token}`,
// //                         'X-Academic-Year': academicYr,
// //                     },
// //                     withCredentials: true,
// //                 }
// //             );

// //             fetchClasses();
// //             handleCloseModal();
// //             toast.success('Class added successfully!');
// //         } catch (error) {
// //             console.error('Error adding class:', error);
// //         }
// //     };

// //     // Submit edit class form
// //     const handleSubmitEdit = async () => {
// //         try {
// //             const token = localStorage.getItem('authToken');
// //             const academicYr = localStorage.getItem('academicYear');

// //             if (!token || !academicYr || !currentClass || !currentClass.class_id) {
// //                 throw new Error('Class ID is missing');
// //             }

// //             await axios.put(
// //                 `http://127.0.0.1:8000/api/classes/${currentClass.class_id}`,
// //                 {
// //                     name: newClassName,
// //                     department_id: parseInt(newDepartmentId), // Ensure department_id is an integer
// //                 },
// //                 {
// //                     headers: {
// //                         Authorization: `Bearer ${token}`,
// //                         'X-Academic-Year': academicYr,
// //                     },
// //                     withCredentials: true,
// //                 }
// //             );

// //             fetchClasses();
// //             handleCloseModal();
// //             toast.success('Class updated successfully!');
// //         } catch (error) {
// //             console.error('Error updating class:', error);
// //         }
// //     };

// //     // Delete class handling
// //     const handleDelete = (id) => {
// //         const classToDelete = classes.find(cls => cls.class_id === id);
// //         setCurrentClass(classToDelete);
// //         setShowDeleteModal(true);
// //     };

// //     // Submit delete class form
// //     const handleSubmitDelete = async () => {
// //         try {
// //             const token = localStorage.getItem('authToken');
// //             const academicYr = localStorage.getItem('academicYear');

// //             if (!token || !academicYr || !currentClass || !currentClass.class_id) {
// //                 throw new Error('Class ID is missing');
// //             }

// //             await axios.delete(
// //                 `http://127.0.0.1:8000/api/classes/${currentClass.class_id}`,
// //                 {
// //                     headers: {
// //                         Authorization: `Bearer ${token}`,
// //                         'X-Academic-Year': academicYr,
// //                     },
// //                     withCredentials: true,
// //                 }
// //             );

// //             fetchClasses();
// //             setShowDeleteModal(false);
// //             setCurrentClass(null);
// //             toast.success('Class deleted successfully!');
// //         } catch (error) {
// //             console.error('Error deleting class:', error);
// //             setError(error.message);
// //         }
// //     };

// //     // Filter classes by name
// //     const filteredClasses = classes.filter(cls =>
// //         cls.name.toLowerCase().includes(searchTerm.toLowerCase())
// //     );

// //     // Paginated classes
// //     const displayedClasses = filteredClasses.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

// //     if (loading) return <p>Loading...</p>;
// //     if (error) return <p>Error: {error}</p>;

// //     return (
// //         <>
// //             <NavBar />
// //             <ToastContainer />

// //             <div className="container mt-4">
// //                 <div className="card" style={{ margin: '0 auto', width: '70%' }}>
// //                     <div className="card-header d-flex justify-content-between align-items-center">
// //                         <h3>Classes</h3>
// //                         <button className="btn btn-primary btn-sm" style={{ width: '80px' }} onClick={handleAdd}>
// //                             <FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />
// //                             Add
// //                         </button>
// //                     </div>

// //                     <div className="card-body">
// //                         <div className="d-flex justify-content-end mb-2">
// //                             <input
// //                                 type="text"
// //                                 className="form-control w-25"
// //                                 placeholder="Search by name"
// //                                 value={searchTerm}
// //                                 onChange={(e) => setSearchTerm(e.target.value)}
// //                             />
// //                         </div>
// //                         <div className="table-responsive">
// //                             <table className="table table-bordered table-striped">
// //                                 <thead>
// //                                     <tr>
// //                                         <th>Name</th>
// //                                         <th>Department</th>
// //                                         <th>Edit</th>
// //                                         <th>Delete</th>
// //                                     </tr>
// //                                 </thead>
// //                                 <tbody>
// //                                     {displayedClasses.map((cls) => (
// //                                         <tr key={cls.class_id}>
// //                                             <td>{cls.name}</td>
// //                                             <td>{cls.get_department.name}</td>
// //                                             <td className="text-center">
// //                                                 <FontAwesomeIcon
// //                                                     icon={faEdit}
// //                                                     className="text-warning"
// //                                                     onClick={() => handleEdit(cls)}
// //                                                     style={{ cursor: 'pointer', fontSize: '1.5em' }}
// //                                                 />
// //                                             </td>
// //                                             <td className="text-center">
// //                                                 <FontAwesomeIcon
// //                                                     icon={faTrash}
// //                                                     className="text-danger"
// //                                                     onClick={() => handleDelete(cls.class_id)}
// //                                                     style={{ cursor: 'pointer', fontSize: '1.5em' }}
// //                                                 />
// //                                             </td>
// //                                         </tr>
// //                                     ))}
// //                                 </tbody>
// //                             </table>
// //                         </div>

// //                         <div className="d-flex justify-content-end">
// //                             <ReactPaginate
// //                                 previousLabel={'previous'}
// //                                 nextLabel={'next'}
// //                                 breakLabel={'...'}
// //                                 pageCount={pageCount}
// //                                 marginPagesDisplayed={2}
// //                                 pageRangeDisplayed={5}
// //                                 onPageChange={({ selected }) => setCurrentPage(selected)}
// //                                 containerClassName={'pagination'}
// //                                 activeClassName={'active'}
// //                             />
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>

// //             {showAddModal && (
// //                 <div className="modal show" style={{ display: 'block' }}>
// //                     <div className="modal-dialog">
// //                         <div className="modal-content">
// //                             <div className="modal-header">
// //                                 <h5 className="modal-title">Add Class</h5>
// //                                 <button type="button" className="close" onClick={handleCloseModal}>
// //                                     <span>&times;</span>
// //                                 </button>
// //                             </div>
// //                             <div className="modal-body">
// //                                 <form onSubmit={(e) => { e.preventDefault(); handleSubmitAdd(); }}>
// //                                     <div className="form-group">
// //                                         <label>Name</label>
// //                                         <input
// //                                             type="text"
// //                                             className="form-control"
// //                                             value={newClassName}
// //                                             onChange={(e) => setNewClassName(e.target.value)}
// //                                             required
// //                                         />
// //                                     </div>
// //                                     <div className="form-group">
// //                                         <label>Department</label>
// //                                         <select
// //                                             className="form-control"
// //                                             value={newDepartmentId}
// //                                             onChange={(e) => setNewDepartmentId(e.target.value)}
// //                                             required
// //                                         >
// //                                             <option value="">Select Department</option>
// //                                             {departments.map((dept) => (
// //                                                 <option key={dept.department_id} value={dept.department_id}>
// //                                                     {dept.name}
// //                                                 </option>
// //                                             ))}
// //                                         </select>
// //                                     </div>
// //                                     <button type="submit" className="btn btn-primary">Add</button>
// //                                 </form>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}

// //             {showEditModal && (
// //                 <div className="modal show" style={{ display: 'block' }}>
// //                     <div className="modal-dialog">
// //                         <div className="modal-content">
// //                             <div className="modal-header">
// //                                 <h5 className="modal-title">Edit Class</h5>
// //                                 <button type="button" className="close" onClick={handleCloseModal}>
// //                                     <span>&times;</span>
// //                                 </button>
// //                             </div>
// //                             <div className="modal-body">
// //                                 <form onSubmit={(e) => { e.preventDefault(); handleSubmitEdit(); }}>
// //                                     <div className="form-group">
// //                                         <label>Name</label>
// //                                         <input
// //                                             type="text"
// //                                             className="form-control"
// //                                             value={newClassName}
// //                                             onChange={(e) => setNewClassName(e.target.value)}
// //                                             required
// //                                         />
// //                                     </div>
// //                                     <div className="form-group">
// //                                         <label>Department</label>
// //                                         <select
// //                                             className="form-control"
// //                                             value={newDepartmentId}
// //                                             onChange={(e) => setNewDepartmentId(e.target.value)}
// //                                             required
// //                                         >
// //                                             <option value="">Select Department</option>
// //                                             {departments.map((dept) => (
// //                                                 <option key={dept.department_id} value={dept.department_id}>
// //                                                     {dept.name}
// //                                                 </option>
// //                                             ))}
// //                                         </select>
// //                                     </div>
// //                                     <button type="submit" className="btn btn-primary">Save</button>
// //                                 </form>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}

// //             {showDeleteModal && (
// //                 <div className="modal show" style={{ display: 'block' }}>
// //                     <div className="modal-dialog">
// //                         <div className="modal-content">
// //                             <div className="modal-header">
// //                                 <h5 className="modal-title">Delete Class</h5>
// //                                 <button type="button" className="close" onClick={handleCloseModal}>
// //                                     <span>&times;</span>
// //                                 </button>
// //                             </div>
// //                             <div className="modal-body">
// //                                 <p>Are you sure you want to delete this class?</p>
// //                                 <p><strong>{currentClass && currentClass.name}</strong></p>
// //                             </div>
// //                             <div className="modal-footer">
// //                                 <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
// //                                 <button type="button" className="btn btn-danger" onClick={handleSubmitDelete}>Delete</button>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}
// //         </>
// //     );
// // }

// // export default ClassList;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import ReactPaginate from 'react-paginate';
// import NavBar from '../Header/NavBar';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

// function ClassList() {
//     const [classes, setClasses] = useState([]);
//     const [departments, setDepartments] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [showAddModal, setShowAddModal] = useState(false);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [currentClass, setCurrentClass] = useState(null);
//     const [newClassName, setNewClassName] = useState('');
//     const [newDepartmentId, setNewDepartmentId] = useState('');
//     const [searchTerm, setSearchTerm] = useState('');
//     const [currentPage, setCurrentPage] = useState(0);
//     const [pageCount, setPageCount] = useState(0);
//     const pageSize = 10;

//     // Fetch classes and departments from backend
//     const fetchClasses = async () => {
//         try {
//             const token = localStorage.getItem('authToken');
//             const academicYr = localStorage.getItem('academicYear');

//             if (!token || !academicYr) {
//                 throw new Error('No authentication token or academic year found');
//             }

//             const response = await axios.get('http://127.0.0.1:8000/api/classes', {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'X-Academic-Year': academicYr,
//                 },
//                 withCredentials: true,
//             });

//             setClasses(response.data);
//             setPageCount(Math.ceil(response.data.length / pageSize));
//         } catch (error) {
//             setError(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchDepartments = async () => {
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

//             setDepartments(response.data);
//         } catch (error) {
//             setError(error.message);
//         }
//     };

//     useEffect(() => {
//         fetchClasses();
//         fetchDepartments();
//     }, []);

//     // Edit class modal handling
//     const handleEdit = (classObj) => {
//         setCurrentClass(classObj);
//         setNewClassName(classObj.name);
//         setNewDepartmentId(classObj.department_id);
//         setShowEditModal(true);
//     };

//     // Add class modal handling
//     const handleAdd = () => {
//         setShowAddModal(true);
//     };

//     // Close all modals
//     const handleCloseModal = () => {
//         setShowAddModal(false);
//         setShowEditModal(false);
//         setShowDeleteModal(false);
//         setCurrentClass(null);
//         setNewClassName('');
//         setNewDepartmentId('');
//     };

//     // Submit add class form
//     const handleSubmitAdd = async () => {
//         try {
//             const token = localStorage.getItem('authToken');
//             const academicYr = localStorage.getItem('academicYear');

//             if (!token || !academicYr) {
//                 throw new Error('No authentication token or academic year found');
//             }

//             await axios.post(
//                 'http://127.0.0.1:8000/api/classes',
//                 {
//                     name: newClassName,
//                     department_id: parseInt(newDepartmentId), // Ensure department_id is an integer
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'X-Academic-Year': academicYr,
//                     },
//                     withCredentials: true,
//                 }
//             );

//             fetchClasses();
//             handleCloseModal();
//             toast.success('Class added successfully!');
//         } catch (error) {
//             console.error('Error adding class:', error);
//         }
//     };

//     // Submit edit class form
//     const handleSubmitEdit = async () => {
//         try {
//             const token = localStorage.getItem('authToken');
//             const academicYr = localStorage.getItem('academicYear');

//             if (!token || !academicYr || !currentClass || !currentClass.class_id) {
//                 throw new Error('Class ID is missing');
//             }

//             await axios.put(
//                 `http://127.0.0.1:8000/api/classes/${currentClass.class_id}`,
//                 {
//                     name: newClassName,
//                     department_id: parseInt(newDepartmentId), // Ensure department_id is an integer
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'X-Academic-Year': academicYr,
//                     },
//                     withCredentials: true,
//                 }
//             );

//             fetchClasses();
//             handleCloseModal();
//             toast.success('Class updated successfully!');
//         } catch (error) {
//             console.error('Error updating class:', error);
//         }
//     };

//     // Delete class handling
//     const handleDelete = (id) => {
//         const classToDelete = classes.find(cls => cls.class_id === id);
//         setCurrentClass(classToDelete);
//         setShowDeleteModal(true);
//     };

//     // Submit delete class form
//     const handleSubmitDelete = async () => {
//         try {
//             const token = localStorage.getItem('authToken');
//             const academicYr = localStorage.getItem('academicYear');

//             if (!token || !academicYr || !currentClass || !currentClass.class_id) {
//                 throw new Error('Class ID is missing');
//             }

//             await axios.delete(
//                 `http://127.0.0.1:8000/api/classes/${currentClass.class_id}`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'X-Academic-Year': academicYr,
//                     },
//                     withCredentials: true,
//                 }
//             );

//             fetchClasses();
//             setShowDeleteModal(false);
//             setCurrentClass(null);
//             toast.success('Class deleted successfully!');
//         } catch (error) {
//             console.error('Error deleting class:', error);
//             setError(error.message);
//         }
//     };

//     // Filter classes by name
//     const filteredClasses = classes.filter(cls =>
//         cls.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     // Paginated classes
//     const displayedClasses = filteredClasses.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

//     const handlePageClick = (data) => {
//         setCurrentPage(data.selected);
//     };

//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>Error: {error}</p>;

//     return (
//         <>
//             <NavBar />
//             <ToastContainer />

//             <div className="container mt-4">
//                 <div className="card" style={{ margin: '0 auto', width: '70%' }}>
//                     <div className="card-header d-flex justify-content-between align-items-center">
//                         <h3>Classes</h3>
//                         <button className="btn btn-primary btn-sm" style={{ width: '80px' }} onClick={handleAdd}>
//                             <FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />
//                             Add
//                         </button>
//                     </div>

//                     <div className="card-body">
//                         <div className="d-flex justify-content-end mb-2">
//                             <input
//                                 type="text"
//                                 className="form-control w-25"
//                                 placeholder="Search by name"
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                             />
//                         </div>
//                         <div className="table-responsive">
//                             <table className="table table-bordered table-striped">
//                                 <thead>
//                                     <tr>
//                                         <th>Name</th>
//                                         <th>Department</th>
//                                         <th>Edit</th>
//                                         <th>Delete</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {displayedClasses.map((cls) => (
//                                         <tr key={cls.class_id}>
//                                             <td>{cls.name}</td>
//                                             <td>{cls.get_department.name}</td>
//                                             <td className="text-center">
//                                                 <FontAwesomeIcon
//                                                     icon={faEdit}
//                                                     className="text-warning"
//                                                     onClick={() => handleEdit(cls)}
//                                                     style={{ cursor: 'pointer', fontSize: '1.5em' }}
//                                                 />
//                                             </td>
//                                             <td className="text-center">
//                                                 <FontAwesomeIcon
//                                                     icon={faTrash}
//                                                     className="text-danger"
//                                                     onClick={() => handleDelete(cls.class_id)}
//                                                     style={{ cursor: 'pointer', fontSize: '1.5em' }}
//                                                 />
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>

//                         <div className="d-flex justify-content-end">
//                             <ReactPaginate
//                                 previousLabel={'previous'}
//                                 nextLabel={'next'}
//                                 breakLabel={'...'}
//                                 pageCount={pageCount}
//                                 marginPagesDisplayed={2}
//                                 pageRangeDisplayed={5}
//                                 onPageChange={handlePageClick}
//                                 containerClassName={'pagination'}
//                                 activeClassName={'active'}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {showAddModal && (
//                 <div className="modal show" style={{ display: 'block' }}>
//                     <div className="modal-dialog">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h5 className="modal-title">Add Class</h5>
//                                 <button type="button" className="close" onClick={handleCloseModal}>
//                                     <span>&times;</span>
//                                 </button>
//                             </div>
//                             <div className="modal-body">
//                                 <form onSubmit={(e) => { e.preventDefault(); handleSubmitAdd(); }}>
//                                     <div className="form-group">
//                                         <label>Name</label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             value={newClassName}
//                                             onChange={(e) => setNewClassName(e.target.value)}
//                                             required
//                                         />
//                                     </div>
//                                     <div className="form-group">
//                                         <label>Department</label>
//                                         <select
//                                             className="form-control"
//                                             value={newDepartmentId}
//                                             onChange={(e) => setNewDepartmentId(e.target.value)}
//                                             required
//                                         >
//                                             <option value="">Select Department</option>
//                                             {departments.map((dept) => (
//                                                 <option key={dept.department_id} value={dept.department_id}>
//                                                     {dept.name}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                     <button type="submit" className="btn btn-primary">Add</button>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {showEditModal && (
//                 <div className="modal show" style={{ display: 'block' }}>
//                     <div className="modal-dialog">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h5 className="modal-title">Edit Class</h5>
//                                 <button type="button" className="close" onClick={handleCloseModal}>
//                                     <span>&times;</span>
//                                 </button>
//                             </div>
//                             <div className="modal-body">
//                                 <form onSubmit={(e) => { e.preventDefault(); handleSubmitEdit(); }}>
//                                     <div className="form-group">
//                                         <label>Name</label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             value={newClassName}
//                                             onChange={(e) => setNewClassName(e.target.value)}
//                                             required
//                                         />
//                                     </div>
//                                     <div className="form-group">
//                                         <label>Department</label>
//                                         <select
//                                             className="form-control"
//                                             value={newDepartmentId}
//                                             onChange={(e) => setNewDepartmentId(e.target.value)}
//                                             required
//                                         >
//                                             <option value="">Select Department</option>
//                                             {departments.map((dept) => (
//                                                 <option key={dept.department_id} value={dept.department_id}>
//                                                     {dept.name}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                     <button type="submit" className="btn btn-primary">Save</button>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {showDeleteModal && (
//                 <div className="modal show" style={{ display: 'block' }}>
//                     <div className="modal-dialog">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h5 className="modal-title">Delete Class</h5>
//                                 <button type="button" className="close" onClick={handleCloseModal}>
//                                     <span>&times;</span>
//                                 </button>
//                             </div>
//                             <div className="modal-body">
//                                 <p>Are you sure you want to delete this class?</p>
//                                 <p><strong>{currentClass && currentClass.name}</strong></p>
//                             </div>
//                             <div className="modal-footer">
//                                 <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
//                                 <button type="button" className="btn btn-danger" onClick={handleSubmitDelete}>Delete</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }

// export default ClassList;import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import NavBar from "../../Layouts/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ClassList() {
  const API_URL = import.meta.env.VITE_API_URL; // url for host
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [newClassName, setNewClassName] = useState("");
  const [newDepartmentId, setNewDepartmentId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const pageSize = 10;

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const academicYr = localStorage.getItem("academicYear");

      if (!token || !academicYr) {
        throw new Error("No authentication token or academic year found");
      }

      const response = await axios.get(`${API_URL}/api/classes`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Academic-Year": academicYr,
        },
        withCredentials: true,
      });

      setClasses(response.data);
      setPageCount(Math.ceil(response.data.length / pageSize));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
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

      setDepartments(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchDepartments();
  }, []);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleEdit = (classItem) => {
    setCurrentClass(classItem);
    setNewClassName(classItem.name);
    setNewDepartmentId(classItem.department_id);
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setNewClassName("");
    setNewDepartmentId("");
    setCurrentClass(null);
  };

  const handleSubmitAdd = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const academicYr = localStorage.getItem("academicYear");

      if (!token || !academicYr) {
        throw new Error("No authentication token or academic year found");
      }

      await axios.post(
        `${API_URL}/api/classes`,
        { name: newClassName, department_id: newDepartmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Academic-Year": academicYr,
          },
          withCredentials: true,
        }
      );

      fetchClasses();
      handleCloseModal();
      toast.success("Class added successfully!");
    } catch (error) {
      console.error("Error adding class:", error);
    }
  };

  const handleSubmitEdit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const academicYr = localStorage.getItem("academicYear");

      if (!token || !academicYr || !currentClass || !currentClass.class_id) {
        throw new Error("Class ID is missing");
      }

      await axios.put(
        `${API_URL}/api/classes/${currentClass.class_id}`,
        { name: newClassName, department_id: newDepartmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Academic-Year": academicYr,
          },
          withCredentials: true,
        }
      );

      fetchClasses();
      handleCloseModal();
      toast.success("Class updated successfully!");
    } catch (error) {
      console.error("Error editing class:", error);
    }
  };

  const handleDelete = (id) => {
    const classToDelete = classes.find((cls) => cls.class_id === id);
    setCurrentClass(classToDelete);
    setShowDeleteModal(true);
  };

  const handleSubmitDelete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const academicYr = localStorage.getItem("academicYear");

      if (!token || !academicYr || !currentClass || !currentClass.class_id) {
        throw new Error("Class ID is missing");
      }

      await axios.delete(`${API_URL}/api/classes/${currentClass.class_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Academic-Year": academicYr,
        },
        withCredentials: true,
      });

      fetchClasses();
      setShowDeleteModal(false);
      setCurrentClass(null);
      toast.success("Class deleted successfully!");
    } catch (error) {
      console.error("Error deleting class:", error);
      setError(error.message);
    }
  };

  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedClasses = filteredClasses.slice(
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
            <h3 className="text-gray-700 mt-1 text-md lg:text-xl">Classes</h3>
            <div className=" box-border flex gap-x-2  justify-end md:h-10 ">
              <div className=" ">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary btn-sm h-9"
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
                        Department
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
                    {displayedClasses.map((classItem, index) => (
                      <tr
                        key={classItem.class_id}
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
                            {classItem.name}
                          </p>
                        </td>
                        <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                          <p className="text-gray-900 whitespace-no-wrap relative top-2">
                            {
                              departments.find(
                                (dep) =>
                                  dep.department_id === classItem.department_id
                              )?.name
                            }
                          </p>
                        </td>
                        <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                          <button
                            className="text-blue-600 hover:text-blue-800 hover:bg-transparent "
                            onClick={() => handleEdit(classItem)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        </td>
                        <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                          <button
                            className="text-red-600 hover:text-red-800 hover:bg-transparent "
                            onClick={() => handleDelete(classItem.class_id)}
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Class</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="newClassName">Class Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="newClassName"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newDepartmentId">Department</label>
                    <select
                      className="form-control"
                      id="newDepartmentId"
                      value={newDepartmentId}
                      onChange={(e) => setNewDepartmentId(e.target.value)}
                    >
                      <option value="">Select Department</option>
                      {departments.map((department) => (
                        <option
                          key={department.department_id}
                          value={department.department_id}
                        >
                          {department.name}
                        </option>
                      ))}
                    </select>
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
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal show " style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Class</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="newClassName">Class Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="newClassName"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newDepartmentId">Department</label>
                    <select
                      className="form-control"
                      id="newDepartmentId"
                      value={newDepartmentId}
                      onChange={(e) => setNewDepartmentId(e.target.value)}
                    >
                      <option value="">Select Department</option>
                      {departments.map((department) => (
                        <option
                          key={department.department_id}
                          value={department.department_id}
                        >
                          {department.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  {/* <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button> */}
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

      {/* Delete Modal */}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal show " style={{ display: "block" }}>
            <div className="modal-dialog  modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Delete Class</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDeleteModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this class?</p>
                  <p>
                    <strong>{currentClass?.name}</strong>
                  </p>
                </div>
                <div className="modal-footer">
                  {/* <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button> */}
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
        </div>
      )}
    </>
  );
}

export default ClassList;
