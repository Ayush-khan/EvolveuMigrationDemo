import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link component from react-router-dom
import axios from "axios";
import "../componants/studentstyle.css";
// Base URL for your API
function CreateStudent() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    house: "",
    admitted_in_class: "",
    gender: "",
    blood_group: "",
    nationality: "",
    birth_place: "",
    mother_tongue: "",
    emergency_name: "",
    date_of_birth: "",
    date_of_admission: "",
    grn_no: "",
    student_id_no: "",
    student_aadhaar_no: "",
    class: "",
    division: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    religion: "",
    caste: "",
    emergency_address: "",
    emergency_contact: "",
    transport_mode: "",
    vehicle_no: "",
    allergies: "",
    height: "",
    roll_no: "",
    category: "",
    weight: "",
    has_spectacles: "0",
  });

  const navigate = useNavigate();
  const token = "your-auth-token";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.post(`${API_URL}/api/students`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(response.data.message);
      navigate("/student-list");
    } catch (error) {
      console.error("Error creating student:", error);
      alert("There was an error creating the student.");
    }
  };

  return (
    <div className="container-fluid mt-4">
      this is empty form and domy created by nikhil bhai
    </div>
  );
}

export default CreateStudent;
