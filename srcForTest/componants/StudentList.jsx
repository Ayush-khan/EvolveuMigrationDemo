import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../Layouts/NavBar";
const API_URL = import.meta.env.VITE_API_URL; // Base URL for your API
function StudentList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const res = await axios.get(`${API_URL}/api/students`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setStudents(res.data);
        } catch (error) {
          console.error("Error fetching students:", error);
        }
      }
    };
    fetchStudents();
  }, []);

  const deleteStudent = async (e, id) => {
    e.preventDefault();

    const isConfirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (isConfirmed) {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          await axios.delete(`${API_URL}/api/students/${id}/delete`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setStudents((prevStudents) =>
            prevStudents.filter((student) => student.id !== id)
          );
        } catch (error) {
          console.error("Error deleting student:", error);
        }
      }
    }
  };

  const studentDetails = students.map((student, index) => (
    <tr key={index}>
      <td>{student.id}</td>
      <td>{`${student.first_name} ${student.middle_name} ${student.last_name}`}</td>
      <td>{student.student_aadhaar_no}</td>
      <td>{student.class}</td>
      <td>{student.state}</td>
      <td>{student.city}</td>
      <td>{student.pincode}</td>
      <td>{student.religion}</td>
      <td>{student.caste}</td>
      <td>{student.emergency_address}</td>
      <td>
        <Link to={`/student/${student.id}/edit`}>
          <button className="btn btn-primary">Edit</button>
        </Link>
      </td>
      <td>
        <button
          type="button"
          onClick={(e) => deleteStudent(e, student.id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <>
      {/* <NavBar /> */}

      <div className="container mt-5">
        <div className="row">
          <div className="card">
            <div className="card-header bg-dark">
              <h4 style={{ color: "white" }}>Students List</h4>
              <p style={{ color: "white" }}>
                Here you see all the student list
              </p>
            </div>
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Aadhaar No</th>
                    <th>Class</th>
                    <th>State</th>
                    <th>City</th>
                    <th>Pin Code</th>
                    <th>Religion</th>
                    <th>Caste</th>
                    <th>Emergency Address</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>{studentDetails}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentList;
