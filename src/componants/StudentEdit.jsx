import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "../Layouts/NavBar";

function StudentEdit() {
  let { id } = useParams();
  const navigate = useNavigate(); // Move useNavigate to the correct place
  // const token = "your-auth-token"; // Replace with actual token or fetch from context/state
  const API_URL = import.meta.env.VITE_API_URL; // Base URL for your API
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
    house: "",
    nationality: "",
    birth_place: "",
    mother_tongue: "",
    emergency_name: "",
    date_of_birth: "",
    student_aadhaar_no: "",
    religion: "",
    caste: "",
    category: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    emergency_address: "",
    emergency_contact: "",
    transport_mode: "",
    vehicle_no: "",
    weight: "",
    blood_group: "",
    allergies: "",
    has_spectacles: false,
    admitted_in_class: "",
    date_of_admission: "",
    grn_no: "",
    student_id_no: "",
    class: "",
    division: "",
    height: "",
    roll_no: "",
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace 'your_token_here' with the actual token retrieval logic
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login"); // Navigate to login page if no token is found
      return;
    }

    axios
      .get(`${API_URL}/api/students/${id}/edit`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setFormData(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          navigate("/login");
        } else {
          setError("An error occurred while fetching student data.");
        }
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    axios
      .put(`${API_URL}/api/students/${id}/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        navigate("/student-list");
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          navigate("/login");
        } else {
          setError("An error occurred while updating student data.");
        }
      });
  };

  return (
    <>
      {/* <NavBar /> */}

      <div className="container-fluid mt-4">
        <div className="row">
          <div className="row justify-content-center">
            <div className="col-md-11">
              <div className="card">
                <div className="card-header">
                  <h4>Update Student Information</h4>
                  <p>In this page you can update student information</p>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <h4>Personal Information</h4>
                    <div className="form-group row">
                      <div className="col-md-3 mb-2">
                        <label htmlFor="first_name">First Name</label>
                        <input
                          type="text"
                          id="first_name"
                          name="first_name"
                          placeholder="eg. John"
                          className="form-control"
                          required
                          onChange={handleChange}
                          value={formData.first_name}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <label htmlFor="middle_name">Middle Name</label>
                        <input
                          type="text"
                          id="middle_name"
                          name="middle_name"
                          placeholder="eg. A."
                          className="form-control"
                          onChange={handleChange}
                          value={formData.middle_name}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <label htmlFor="last_name">Last Name</label>
                        <input
                          type="text"
                          id="last_name"
                          name="last_name"
                          placeholder="eg. Doe"
                          className="form-control"
                          required
                          onChange={handleChange}
                          value={formData.last_name}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <label htmlFor="gender">Gender</label>
                        <select
                          id="gender"
                          name="gender"
                          className="form-control"
                          required
                          onChange={handleChange}
                          value={formData.gender}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="col-md-3 mb-2">
                        <label htmlFor="house">House</label>
                        <input
                          type="text"
                          id="house"
                          name="house"
                          placeholder="eg. Green House"
                          className="form-control"
                          onChange={handleChange}
                          value={formData.house}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <label htmlFor="nationality">Nationality</label>
                        <input
                          type="text"
                          id="nationality"
                          name="nationality"
                          placeholder="eg. Indian"
                          className="form-control"
                          onChange={handleChange}
                          value={formData.nationality}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <label htmlFor="birth_place">Birth Place</label>
                        <input
                          type="text"
                          id="birth_place"
                          name="birth_place"
                          placeholder="eg. Mumbai"
                          className="form-control"
                          onChange={handleChange}
                          value={formData.birth_place}
                        />
                      </div>

                      <div className="col-md-3 mb-2">
                        <label htmlFor="mother_tongue">Mother Tongue</label>
                        <select
                          id="mother_tongue"
                          name="mother_tongue"
                          className="form-control"
                          required
                          onChange={handleChange}
                          value={formData.mother_tongue}
                        >
                          <option value="Assamese">Assamese</option>
                          <option value="Bengali">Bengali</option>
                          <option value="Gujarati">Gujarati</option>
                          <option value="Hindi">Hindi</option>
                          <option value="Kannada">Kannada</option>
                          <option value="Kashmiri">Kashmiri</option>
                          <option value="Konkani">Konkani</option>
                          <option value="Malayalam">Malayalam</option>
                          <option value="Manipuri">Manipuri</option>
                          <option value="Marathi">Marathi</option>
                          <option value="Nepali">Nepali</option>
                          <option value="Odia">Odia</option>
                          <option value="Punjabi">Punjabi</option>
                          <option value="Sanskrit">Sanskrit</option>
                          <option value="Sindhi">Sindhi</option>
                          <option value="Tamil">Tamil</option>
                          <option value="Telugu">Telugu</option>
                          <option value="Urdu">Urdu</option>
                        </select>
                      </div>

                      <div className="col-md-3 mb-2">
                        <label htmlFor="emergency_name">Emergency Name</label>
                        <input
                          type="text"
                          id="emergency_name"
                          name="emergency_name"
                          placeholder="eg. Jane Doe"
                          className="form-control"
                          onChange={handleChange}
                          value={formData.emergency_name}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <label htmlFor="date_of_birth">Date of Birth</label>
                        <input
                          type="date"
                          id="date_of_birth"
                          name="date_of_birth"
                          className="form-control"
                          required
                          onChange={handleChange}
                          value={formData.date_of_birth}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <label htmlFor="student_aadhaar_no">
                          Student Aadhaar No
                        </label>
                        <input
                          type="text"
                          id="student_aadhaar_no"
                          name="student_aadhaar_no"
                          placeholder="eg. 9876-5432-1234"
                          className="form-control"
                          onChange={handleChange}
                          value={formData.student_aadhaar_no}
                        />
                      </div>

                      <div className="col-md-3 mb-2">
                        <label htmlFor="religion">Religion</label>
                        <select
                          id="religion"
                          name="religion"
                          className="form-control"
                          required
                          onChange={handleChange}
                          value={formData.religion}
                        >
                          <option value="Hinduism">Hinduism</option>
                          <option value="Islam">Islam</option>
                          <option value="Christianity">Christianity</option>
                          <option value="Jain">Jain</option>
                          <option value="Buddhist">Buddhist</option>
                        </select>
                      </div>
                      <div className="col-md-3 mb-2">
                        <label htmlFor="caste">Caste</label>
                        <input
                          type="text"
                          id="caste"
                          name="caste"
                          placeholder="eg. Brahmin"
                          className="form-control"
                          onChange={handleChange}
                          value={formData.caste}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <label htmlFor="category">Category</label>
                        <select
                          id="category"
                          name="category"
                          className="form-control"
                          required
                          onChange={handleChange}
                          value={formData.category}
                        >
                          <option value="General">General</option>
                          <option value="OBC">OBC</option>
                          <option value="SC">SC</option>
                          <option value="ST">ST</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <h4>Contact Information</h4>
                    <div className="form-group row">
                      <div className="col-md-3 mb-2">
                        <label htmlFor="address">Address</label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          placeholder="eg. 123 Main St"
                          className="form-control"
                          onChange={handleChange}
                          value={formData.address}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <label htmlFor="city">City</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          placeholder="eg. Mumbai"
                          className="form-control"
                          onChange={handleChange}
                          value={formData.city}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <label htmlFor="state">State</label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          placeholder="eg. Maharashtra"
                          className="form-control"
                          onChange={handleChange}
                          value={formData.state}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <label htmlFor="pincode">Pincode</label>
                        <input
                          type="text"
                          id="pincode"
                          name="pincode"
                          placeholder="eg. 400001"
                          className="form-control"
                          onChange={handleChange}
                          value={formData.pincode}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <label htmlFor="emergency_address">
                          Emergency Address
                        </label>
                        <input
                          type="text"
                          id="emergency_address"
                          name="emergency_address"
                          placeholder="eg. 456 Another St"
                          className="form-control"
                          onChange={handleChange}
                          value={formData.emergency_address}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <label htmlFor="emergency_contact">
                          Emergency Contact
                        </label>
                        <input
                          type="text"
                          id="emergency_contact"
                          name="emergency_contact"
                          placeholder="eg. 9876543210"
                          className="form-control"
                          onChange={handleChange}
                          value={formData.emergency_contact}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <label htmlFor="transport_mode">Transport Mode</label>
                        <select
                          id="transport_mode"
                          name="transport_mode"
                          className="form-control"
                          required
                          onChange={handleChange}
                          value={formData.transport_mode}
                        >
                          <option value="Bus">Bus</option>
                          <option value="Car">Car</option>
                          <option value="Bike">Bike</option>
                          <option value="Walk">Walk</option>
                        </select>
                      </div>
                      <div className="col-md-3 mb-2">
                        <label htmlFor="vehicle_no">Vehicle No</label>
                        <input
                          type="text"
                          id="vehicle_no"
                          name="vehicle_no"
                          placeholder="eg. MH-12-3456"
                          className="form-control"
                          onChange={handleChange}
                          value={formData.vehicle_no}
                        />
                      </div>
                    </div>

                    <h4>Medical Information</h4>
                    <div className="form-group row">
                      <div className="col-md-3 mb-2">
                        <label htmlFor="weight">Weight</label>
                        <input
                          type="text"
                          id="weight"
                          name="weight"
                          placeholder="eg. 60kg"
                          className="form-control"
                          onChange={handleChange}
                          value={formData.weight}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <label htmlFor="blood_group">Blood Group</label>
                        <input
                          type="text"
                          id="blood_group"
                          name="blood_group"
                          placeholder="eg. O+"
                          className="form-control"
                          onChange={handleChange}
                          value={formData.blood_group}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <label htmlFor="allergies">Allergies</label>
                        <input
                          type="text"
                          id="allergies"
                          name="allergies"
                          placeholder="eg. Peanuts"
                          className="form-control"
                          onChange={handleChange}
                          value={formData.allergies}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <label>Has Spectacles</label>
                        <div>
                          <input
                            type="radio"
                            id="has_spectacles_yes"
                            name="has_spectacles"
                            value="true"
                            checked={formData.has_spectacles}
                            onChange={() =>
                              setFormData({ ...formData, has_spectacles: true })
                            }
                          />
                          <label htmlFor="has_spectacles_yes" className="mr-2">
                            Yes
                          </label>
                          <input
                            type="radio"
                            id="has_spectacles_no"
                            name="has_spectacles"
                            value="false"
                            checked={!formData.has_spectacles}
                            onChange={() =>
                              setFormData({
                                ...formData,
                                has_spectacles: false,
                              })
                            }
                          />
                          <label htmlFor="has_spectacles_no">No</label>
                        </div>
                      </div>
                    </div>

                    <h4>Admission Information</h4>
                    <div className="form-group row">
                      <div className="col-md-3 mb-2">
                        <label htmlFor="admitted_in_class">
                          Admitted In Class
                        </label>
                        <input
                          type="text"
                          id="admitted_in_class"
                          name="admitted_in_class"
                          placeholder="eg. 10"
                          className="form-control"
                          onChange={handleChange}
                          value={formData.admitted_in_class}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <label htmlFor="date_of_admission">
                          Date of Admission
                        </label>
                        <input
                          type="date"
                          id="date_of_admission"
                          name="date_of_admission"
                          className="form-control"
                          required
                          onChange={handleChange}
                          value={formData.date_of_admission}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <label htmlFor="grn_no">GRN No</label>
                        <input
                          type="text"
                          id="grn_no"
                          name="grn_no"
                          placeholder="eg. 12345"
                          className="form-control"
                          onChange={handleChange}
                          value={formData.grn_no}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <label htmlFor="student_id_no">Student ID No</label>
                        <input
                          type="text"
                          id="student_id_no"
                          name="student_id_no"
                          placeholder="eg. 67890"
                          className="form-control"
                          onChange={handleChange}
                          value={formData.student_id_no}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <label htmlFor="class">Class</label>
                        <input
                          type="text"
                          id="class"
                          name="class"
                          placeholder="eg. 10"
                          className="form-control"
                          onChange={handleChange}
                          value={formData.class}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <label htmlFor="division">Division</label>
                        <input
                          type="text"
                          id="division"
                          name="division"
                          placeholder="eg. A"
                          className="form-control"
                          onChange={handleChange}
                          value={formData.division}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <label htmlFor="height">Height</label>
                        <input
                          type="text"
                          id="height"
                          name="height"
                          placeholder="eg. 170cm"
                          className="form-control"
                          onChange={handleChange}
                          value={formData.height}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <label htmlFor="roll_no">Roll No</label>
                        <input
                          type="text"
                          id="roll_no"
                          name="roll_no"
                          placeholder="eg. 10"
                          className="form-control"
                          onChange={handleChange}
                          value={formData.roll_no}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-md-12 text-right">
                        <button type="submit" className="btn btn-primary">
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="card-footer">
                  <Link to="/student-list" className="btn btn-secondary">
                    Back to Student List
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentEdit;
