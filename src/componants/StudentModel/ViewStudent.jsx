import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserGroup } from "react-icons/fa6";

function ViewStudent() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const { student } = location.state || {};
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  console.log("student data for view", student);
  // Fetch class names
  useEffect(() => {
    const fetchClassNames = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${API_URL}/api/getClassList`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(response.data);
      } catch (error) {
        toast.error("Error fetching class names");
      }
    };
    fetchClassNames();
  }, [API_URL]);

  const [formData, setFormData] = useState({
    // Student fields
    first_name: "",
    mid_name: "",
    last_name: "",
    house: "",
    student_name: "",
    dob: "",
    admission_date: "",
    stud_id_no: "",
    stu_aadhaar_no: "",
    gender: "",
    category: " ",
    blood_group: " ",
    mother_tongue: "",
    permant_add: " ",
    birth_place: "",
    admission_class: "",
    city: "",
    state: "",
    roll_no: "",
    class_id: "",
    section_id: "",
    religion: "",
    caste: "",
    subcaste: "",
    vehicle_no: "",
    emergency_name: "",
    emergency_contact: "",
    emergency_add: "",
    transport_mode: " ",
    height: "",
    weight: "",
    allergies: "",
    nationality: "",
    pincode: "",
    image_name: null,
    student_id: "",
    reg_no: " ",
    // Parent fields
    father_name: "",
    father_occupation: "",
    f_office_add: "",
    f_office_tel: "",
    f_mobile: "",
    f_email: "",
    f_dob: " ",
    m_dob: " ",
    parent_adhar_no: "",
    mother_name: "",
    mother_occupation: "",
    m_office_add: "",
    m_office_tel: "",
    m_mobile: "",
    m_emailid: "",
    m_adhar_no: "",
    m_blood_group: "",
    f_blood_group: "",
    has_specs: "",
    udise_pen_no: "",
    user_id: "",
    // Preferences
    SetToReceiveSMS: "",
    SetEmailIDAsUsername: "",
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  // // Convert class change and division change to non-functional
  // const handleClassChange = async (e) => {}; // Disable handler
  // const handleDivisionChange = (e) => {}; // Disable handler

  useEffect(() => {
    if (student) {
      setFormData({
        first_name: student.first_name || " ",
        mid_name: student.mid_name || "",
        last_name: student.last_name || "",
        house: student.house || "",
        student_name: student.student_name || "",
        dob: student.dob || "",
        admission_date: student.admission_date || "",
        stud_id_no: student.stud_id_no || "",
        stu_aadhaar_no: student.stu_aadhaar_no || "",
        gender: student.gender || "",
        permant_add: student.permant_add || " ",
        mother_tongue: student.mother_tongue || "",
        birth_place: student.birth_place || "",
        admission_class: student.admission_class || " ",
        city: student.city || " ",
        state: student.state || "",
        roll_no: student.roll_no || "",
        student_id: student.student_id || " ",
        reg_no: student.reg_no || " ",
        blood_group: student.blood_group || " ",
        category: student.category || " ",
        class_id: student?.get_class?.name || "",
        section_id: student?.get_division?.name || "",
        religion: student.religion || "",
        caste: student.caste || "",
        subcaste: student.subcaste || "",
        transport_mode: student.transport_mode || " ",
        vehicle_no: student.vehicle_no || "",
        emergency_name: student.emergency_name || " ",
        emergency_contact: student.emergency_contact || "",
        emergency_add: student.emergency_add || "",
        height: student.height || "",
        weight: student.weight || "",
        allergies: student.allergies || "",
        nationality: student.nationality || "",
        pincode: student.pincode || "",
        image_name: student.image_name || null,
        // Parent information
        father_name: student?.parents?.father_name || " ",
        father_occupation: student?.parents?.father_occupation || "",
        f_office_add: student?.parents?.f_office_add || "  ",
        f_blood_group: student?.parents?.f_blood_group || "",

        f_office_tel: student?.parents?.f_office_tel || "",
        f_mobile: student?.parents?.f_mobile || "",
        f_email: student?.parents?.f_email || "",
        f_dob: student?.parents?.f_dob || " ",
        m_dob: student?.parents?.m_dob || " ",
        m_blood_group: student?.parents?.m_blood_group || "",
        has_specs: student.has_specs || " ",

        parent_adhar_no: student?.parents?.parent_adhar_no || "",
        mother_name: student?.parents?.mother_name || " ",
        mother_occupation: student?.parents?.mother_occupation || "",
        m_office_add: student?.parents?.m_office_add || " ",
        m_office_tel: student?.parents?.m_office_tel || "",
        m_mobile: student?.parents?.m_mobile || "",
        m_emailid: student?.parents?.m_emailid || "",
        m_adhar_no: student?.parents?.m_adhar_no || "",
        udise_pen_no: student.udise_pen_no || " ",
        user_id: student?.user_master?.user_id || " ",
        SetToReceiveSMS: student.SetToReceiveSMS || "",
        SetEmailIDAsUsername: student.SetEmailIDAsUsername || "",
      });
      if (student?.image_name) {
        setPhotoPreview(
          // `${API_URL}/path/to/images/${student.teacher_image_name}`
          `https://sms.evolvu.in/storage/app/public/student_images/${student.image_name}`
        );
      }
    }
  }, [student]);
  console.log("setPhotoPreview", photoPreview);
  return (
    // <div>
    //   <h2>View Student</h2>
    //   <form>
    //     <div>
    //       <label>First Name:</label>
    //       <input type="text" value={formData.first_name} disabled />
    //     </div>
    //     <div>
    //       <label>Middle Name:</label>
    //       <input type="text" value={formData.mid_name} disabled />
    //     </div>
    //     <div>
    //       <label>Last Name:</label>
    //       <input type="text" value={formData.last_name} disabled />
    //     </div>
    //     {/* Add the rest of the form fields in a similar way */}
    //   </form>
    // </div>
    <div className=" w-[95%] mx-auto p-4">
      <ToastContainer />
      <div className="card p-3  rounded-md">
        <div className="card-header mb-4 flex justify-between items-center">
          <h5 className="text-gray-700 mt-1 text-md lg:text-lg">
            View Student Information
          </h5>
          <RxCross1
            className="float-end relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
            onClick={() => navigate("/manageStudent")}
          />
        </div>
        <div
          className="relative w-full -top-6 h-1 mx-auto bg-red-700"
          style={{ backgroundColor: "#C03078" }}
        ></div>

        <form className="md:mx-2 overflow-x-hidden shadow-md py-1 bg-gray-50">
          <div className="flex flex-col gap-y-3 p-2 md:grid md:grid-cols-4 md:gap-x-14 md:mx-10 ">
            <h5 className="col-span-4 text-blue-400  relative top-2">
              {" "}
              Personal Information
            </h5>
            <div className="row-span-2">
              <label
                htmlFor="teacher_image_name"
                className="block font-bold text-xs mb-2"
              >
                Photo
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Photo Preview"
                    className="h-20 w-20 rounded-[50%] mx-auto border-1 border-black object-cover"
                  />
                ) : (
                  <FaUserCircle className="mt-2 h-20 w-20 object-cover mx-auto text-gray-300" />
                )}
              </label>
            </div>
            {/* <div className=" row-span-2  ">
              <ImageCropper
                photoPreview={photoPreview}
                onImageCropped={handleImageCropped}
              />
            </div> */}
            <div className="mt-2">
              <label
                htmlFor="first_name"
                className="block font-bold text-xs mb-0.5"
              >
                First Name
              </label>
              <input
                type="text"
                disabled
                value={formData.first_name}
                className="  block w-full  rounded-md py-1 px-3 bg-gray-300 "
              />
            </div>
            {/* Add other form fields similarly */}
            <div className="mt-2">
              <label
                htmlFor="mid_name"
                className="block font-bold text-xs mb-0.5"
              >
                Middle Name
              </label>
              <input
                type="text"
                disabled
                value={formData.mid_name}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="lastName"
                className="block font-bold text-xs mb-0.5"
              >
                Last Name
              </label>
              <input
                type="text"
                disabled
                value={formData.last_name}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="dateOfBirth"
                className="block font-bold text-xs mb-0.5"
              >
                Date of Birth
              </label>
              <input
                type="date"
                disabled
                value={formData.dob}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="gender"
                className="block font-bold text-xs mb-0.5"
              >
                Gender
              </label>
              <input
                type="text"
                disabled
                value={
                  formData.gender === "F"
                    ? "Female"
                    : formData.gender === "M"
                    ? "Male"
                    : ""
                }
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              ></input>
            </div>
            <div className="mt-2">
              <label
                htmlFor="bloodGroup"
                className="block font-bold text-xs mb-0.5"
              >
                Blood group
              </label>
              <input
                type="text"
                disabled
                value={formData.blood_group}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              ></input>
            </div>
            <div className="mt-2">
              <label
                htmlFor="religion"
                className="block font-bold text-xs mb-0.5"
              >
                Religion
              </label>
              <input
                type="text"
                disabled
                value={formData.religion}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              ></input>
            </div>
            <div className="mt-2">
              <label htmlFor="caste" className="block font-bold text-xs mb-0.5">
                Caste
              </label>
              <input
                type="text"
                disabled
                value={formData.caste}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="category"
                className="block font-bold text-xs mb-0.5"
              >
                Category
              </label>
              <input
                type="text"
                disabled
                value={formData.category}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              ></input>
            </div>
            <div className="mt-2">
              <label
                htmlFor="birthPlace"
                className="block font-bold text-xs mb-0.5"
              >
                Birth Place
              </label>
              <input
                type="text"
                disabled
                value={formData.birth_place}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="nationality"
                className="block font-bold text-xs mb-0.5"
              >
                Nationality
              </label>
              <input
                type="text"
                disabled
                value={formData.nationality}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="motherTongue"
                className="block font-bold text-xs mb-0.5"
              >
                Mother Tongue
              </label>
              <input
                type="text"
                disabled
                value={formData.mother_tongue}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              />
            </div>
            {/* Student Details */}
            {/* <div className="w-[120%] mx-auto h-2 bg-white col-span-4"></div> */}
            <h5 className="col-span-4 text-blue-400 mt-2 relative top-4">
              {" "}
              Student Details
            </h5>
            <div className="mt-2">
              <label
                htmlFor="studentName"
                className="block font-bold text-xs mb-0.5"
              >
                Student Name
              </label>
              <input
                type="text"
                disabled
                value={formData.student_name}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="studentClass"
                className="block font-bold text-xs mb-0.5"
              >
                Class
              </label>
              <input
                type="text"
                disabled
                value={formData.class_id}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "
              ></input>
            </div>
            {/* Division Dropdown */}
            <div className="mt-2">
              <label
                htmlFor="division"
                className="block font-bold text-xs mb-0.5"
              >
                Division
              </label>
              <input
                type="text"
                disabled
                value={formData.section_id}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "
                // Disable division until class is selected
              ></input>
            </div>
            <div className="mt-2">
              <label
                htmlFor="rollNumber"
                className="block font-bold text-xs mb-0.5"
              >
                Roll No.
              </label>
              <input
                type="text"
                disabled
                value={formData.roll_no}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="grnNumber"
                className="block font-bold text-xs mb-0.5"
              >
                GRN No.
              </label>
              <input
                type="text"
                disabled
                value={formData.reg_no}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              />
            </div>{" "}
            <div className="mt-2">
              <label htmlFor="house" className="block font-bold text-xs mb-0.5">
                House
              </label>
              <input
                type="text"
                disabled
                value={
                  formData.house === "D"
                    ? "Diamond"
                    : formData.house === "E"
                    ? "Emerald"
                    : formData.house === "R"
                    ? "Ruby"
                    : formData.house === "S"
                    ? "Sapphire"
                    : ""
                }
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              ></input>
            </div>
            <div className="mt-2">
              <label
                htmlFor="admittedInClass"
                className="block font-bold text-xs mb-0.5"
              >
                Admitted In Class
              </label>
              <input
                type="text"
                disabled
                value={formData.admission_class}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              ></input>
            </div>
            <div className="mt-2">
              <label
                htmlFor="dataOfAdmission"
                className="block font-bold text-xs mb-0.5"
              >
                Date of Admission
              </label>
              <input
                type="date"
                disabled
                value={formData.admission_date}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="studentIdNumber"
                className="block font-bold text-xs mb-0.5"
              >
                Student ID No.
              </label>
              <input
                type="text"
                disabled
                value={formData.student_id}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="studentAadharNumber"
                className="block font-bold text-xs mb-0.5"
              >
                Student Aadhar No.
              </label>
              <input
                type="text"
                disabled
                value={formData.stu_aadhaar_no}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              />
            </div>{" "}
            {selectedClass > 99 && (
              <div className="mt-2">
                <label
                  htmlFor="studentAadharNumber"
                  className="block font-bold text-xs mb-0.5"
                >
                  Udise Pen No.
                </label>
                <input
                  type="text"
                  disabled
                  maxLength={14}
                  value={formData.udise_pen_no}
                  className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                  // onBlur={handleBlur}
                />
              </div>
            )}
            {/* Address Information */}
            <h5 className="col-span-4 text-blue-400 mt-2 relative top-4">
              {" "}
              Address Information
            </h5>
            <div className="mt-2">
              <label
                htmlFor="address"
                className="block font-bold text-xs mb-0.5"
              >
                Address
              </label>
              <textarea
                id="address"
                disabled
                rows={2}
                value={formData.permant_add}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              />
            </div>
            <div className="mt-2">
              <label htmlFor="city" className="block font-bold text-xs mb-0.5">
                City
              </label>
              <input
                type="text"
                disabled
                maxLength={100}
                value={formData.city}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              />
            </div>
            <div className="mt-2">
              <label htmlFor="state" className="block font-bold text-xs mb-0.5">
                State
              </label>
              <input
                type="text"
                disabled
                value={formData.state}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="pincode"
                className="block font-bold text-xs mb-0.5"
              >
                Pincode
              </label>
              <input
                type="text"
                disabled
                value={formData.pincode}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              />
            </div>
            {/* </div> */}
            {/*  */}
            {/* <div className="w-full sm:max-w-[30%]"> */}
            {/* Emergency Contact */}
            <h5 className="col-span-4 text-blue-400 mt-2 relative top-4">
              {" "}
              Emergency Contact
            </h5>
            <div className="mt-2">
              <label
                htmlFor="emergencyName"
                className="block font-bold text-xs mb-0.5"
              >
                Emergency Name
              </label>
              <input
                type="text"
                id="emergencyName"
                disabled
                value={formData.emergency_name}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="emergencyAddress"
                className=" font-bold text-xs mb-0.5"
              >
                Emergency Address
              </label>
              <textarea
                id="emergencyAddress"
                disabled
                value={formData.emergency_add}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "
              />
              <div className="flex flex-row items-center gap-2 -mt-1 w-full">
                <input
                  type="checkbox"
                  disabled
                  className="border h-[26px] border-[#ccc] px-3 py-[6px] text-[14px] leading-4 outline-none"
                  onChange={(event) => {
                    if (event.target.checked) {
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        emergency_add: prevFormData.permant_add,
                      }));
                    } else {
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        emergency_add: "",
                      }));
                    }
                  }}
                />
                <label htmlFor="sameAs" className="text-xs">
                  Same as permanent address
                </label>
              </div>
            </div>
            <div className="mt-2">
              <label
                htmlFor="emergencyContact"
                className="block font-bold text-xs mb-0.5"
              >
                Emergency Contact{" "}
              </label>
              <div className="w-full flex flex-row items-center">
                <span className="w-[15%] h-[34px] text-[14px] text-[#555] text-center border border-[#ccc] border-r-0 flex items-center justify-center p-1">
                  +91
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  id="emergencyContact"
                  disabled
                  maxLength={10}
                  value={formData.emergency_contact}
                  className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "
                />
              </div>
            </div>
            {/* Transport Information */}
            {/* <h5 className="col-span-4 text-gray-500 mt-2 relative top-2"> Transport Information</h5> */}
            <div className="mt-2">
              <label
                htmlFor="transportMode"
                className="block font-bold text-xs mb-0.5"
              >
                Transport Mode
              </label>
              <input
                type="text"
                disabled
                value={formData.transport_mode}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "
                // onChange={handleChange}
                // onBlur={handleBlur}
              >
                {/* <option>Select</option>
                <option value="School Bus">School Bus</option>
                <option value="Private Van">Private Van</option>
                <option value="Self">Self</option> */}
              </input>
              <input
                type="text"
                id="vehicleNumber"
                disabled
                maxLength={13}
                placeholder="Vehicle No."
                value={formData.vehicle_no}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              />
            </div>
            {/* Health Information */}
            <h5 className="col-span-4 text-blue-400 mt-2 relative top-4">
              {" "}
              Health Information
            </h5>
            <div className="mt-2">
              <label
                htmlFor="allergies"
                className="block font-bold text-xs mb-0.5"
              >
                Allergies(if any)
              </label>
              <input
                type="text"
                disabled
                maxLength={200}
                value={formData.allergies}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="height"
                className="block font-bold text-xs mb-0.5"
              >
                Height
              </label>
              <input
                type="text"
                id="height"
                maxLength={4.1}
                disabled
                value={formData.height}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="weight"
                className="block font-bold text-xs mb-0.5"
              >
                Weight
              </label>
              <input
                type="text"
                id="weight"
                disabled
                maxLength={4.1}
                value={formData.weight}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              />
            </div>
            <div className="  flex gap-4 pt-[7px]">
              <div
                htmlFor="weight"
                className="block font-bold text-[.9em] mt-4 "
              >
                Has Spectacles
              </div>
              <div className="flex items-center gap-6 mt-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="yes"
                    checked={formData.has_specs == "Y"}
                    value="Y"

                    // onBlur={handleBlur}
                  />
                  <label htmlFor="yes" className="ml-1">
                    Yes
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="no"
                    checked={formData.has_specs == "N"}
                    value="N"
                    // onBlur={handleBlur}
                  />
                  <label htmlFor="no" className="ml-1">
                    No
                  </label>
                </div>
              </div>
            </div>
            {/* ... */}
            {/* Add other form fields similarly */}
            {/* ... */}
            <div className="w-full col-span-4 relative top-4">
              <div className="w-full mx-auto">
                <h3 className="text-blue-500 w-full mx-auto text-center  md:text-[1.2em] text-nowrap font-bold">
                  {" "}
                  <FaUserGroup className="text-[1.4em] text-blue-700 inline" />{" "}
                  Parent's Information :{" "}
                </h3>
              </div>
            </div>
            <h5 className="col-span-4 text-blue-400 mt-2 relative top-4">
              {" "}
              Father Details
            </h5>
            <div className="mt-2">
              <label htmlFor="email" className="block font-bold text-xs mb-0.5">
                Name
              </label>
              <input
                type="text"
                id="email"
                disabled
                maxLength={100}
                value={formData.father_name}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "
              />
            </div>
            <div className="mt-2">
              <label htmlFor="email" className="block font-bold text-xs mb-0.5">
                Occupation
              </label>
              <input
                type="text"
                id="email"
                maxLength={100}
                disabled
                value={formData.father_occupation}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="bloodGroup"
                className="block font-bold text-xs mb-0.5"
              >
                Blood group
              </label>
              <input
                type="text"
                disabled
                value={formData.f_blood_group}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "

                // onBlur={handleBlur}
              ></input>
            </div>
            <div className="mt-2">
              <label htmlFor="email" className="block font-bold text-xs mb-0.5">
                Father Aadhaar Card No.
              </label>
              <input
                type="text"
                id="email"
                disabled
                maxLength={12}
                value={formData.parent_adhar_no}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "
              />
            </div>
            <div className="mt-2">
              <label htmlFor="email" className="block font-bold text-xs mb-0.5">
                Office Address
              </label>
              <textarea
                id="email"
                rows={2}
                maxLength={200}
                disabled
                value={formData.f_office_add}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="telephone"
                className="block font-bold text-xs mb-0.5"
              >
                Telephone
              </label>
              <input
                type="text"
                maxLength={11}
                id="telephone"
                disabled
                value={formData.f_office_tel}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "
              />
            </div>
            <div>
              <label htmlFor="phone" className="block font-bold text-xs mb-0.5">
                Mobile Number
              </label>
              <div className="flex">
                <span className="w-[15%] h-[34px] text-[14px] text-[#555] text-center border border-[#ccc] border-r-0 flex items-center justify-center p-1">
                  +91
                </span>
                <input
                  type="tel"
                  id="phone"
                  disabled
                  pattern="\d{10}"
                  maxLength="10"
                  value={formData.f_mobile}
                  className=" block w-full  outline-none rounded-r-md py-1 px-3 bg-gray-300 "
                  required
                />
              </div>

              {/* <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="setusernameFatherMob"
                  name="setUsername"
                  checked={formData.SetEmailIDAsUsername === "FatherMob"}
                />
                <label htmlFor="setusernameFatherMob">
                  Set this as username
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  value="FatherMob"
                  id="receiveSmsmob"
                  checked={formData.SetToReceiveSMS === "Father"}
                />
                <label htmlFor="receiveSmsmob">
                  Set to receive SMS at this no.
                </label>
              </div> */}
            </div>
            <div className="mt-2">
              <label htmlFor="email" className="block font-bold text-xs mb-0.5">
                Email Id
              </label>
              <input
                type="text"
                disabled
                value={formData.f_email}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "
              />

              {/* <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="setUserNameFather"
                  checked={formData.SetEmailIDAsUsername === "Father"}
                />
                <label htmlFor="setUserNameFather">Set this as username</label>
              </div> */}
            </div>
            <div className="mt-2">
              <label
                htmlFor="dataOfAdmission"
                className="block font-bold text-xs mb-0.5"
              >
                Father Date Of Birth
              </label>
              <input
                type="date"
                id="dataOfAdmission"
                disabled
                value={formData.f_dob}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "
                // onBlur={handleBlur}
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="UserID"
                className="block font-bold text-xs mb-0.5"
              >
                User Id
              </label>
              <input
                type="text"
                disabled
                value={formData.user_id}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "
              />
            </div>
            {/* Mother information */}
            <h5 className="col-span-4 text-blue-400 mt-2 relative top-4">
              {" "}
              Mother Details
            </h5>
            <div className="mt-2">
              <label htmlFor="email" className="block font-bold text-xs mb-0.5">
                Name
              </label>
              <input
                type="text"
                disabled
                value={formData.mother_name}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "
              />
            </div>
            <div className="mt-2">
              <label htmlFor="email" className="block font-bold text-xs mb-0.5">
                Occupation
              </label>
              <input
                type="text"
                id="email"
                maxLength={100}
                disabled
                value={formData.mother_occupation}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="bloodGroup"
                className="block font-bold text-xs mb-0.5"
              >
                Blood group
              </label>
              <input
                type="text"
                disabled
                value={formData.m_blood_group}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "
                // onBlur={handleBlur}
              ></input>
            </div>
            <div className="mt-2">
              <label htmlFor="email" className="block font-bold text-xs mb-0.5">
                Mother Aadhaar Card No.
              </label>
              <input
                type="text"
                id="email"
                disabled
                maxLength={12}
                value={formData.m_adhar_no}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "
              />
            </div>
            <div className="mt-2">
              <label htmlFor="email" className="block font-bold text-xs mb-0.5">
                Office Address
              </label>
              <textarea
                id="email"
                disabled
                rows={2}
                value={formData.m_office_add}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="m_office_tel"
                className="block font-bold text-xs mb-0.5"
              >
                Telephone
              </label>
              <input
                type="text"
                maxLength={11}
                id="m_office_tel"
                disabled
                value={formData.m_office_tel}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "
              />
            </div>
            {/* <div className="mt-2">
            
              <label htmlFor="email" className="block font-bold text-xs mb-0.5">
                Telephone
              </label>
              <input
                type="text"
                maxLength={11}
                id="email"
                name="m_office_tel"
                value={formData.m_office_tel}
                onChange={handleChange}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "
              />
            </div> */}
            <div>
              <label htmlFor="phone" className="block font-bold text-xs mb-0.5">
                Mobile Number
              </label>
              <div className="flex">
                <span className="w-[15%] h-[34px] text-[14px] text-[#555] text-center border border-[#ccc] border-r-0 flex items-center justify-center p-1">
                  +91
                </span>
                <input
                  type="tel"
                  id="phone"
                  disabled
                  value={formData.m_mobile}
                  className=" block w-full  outline-none rounded-r-md py-1 px-3 bg-gray-300 "
                  required
                />
              </div>

              {/* <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="setusernameMotherMob"
                  name="setUsername"
                  checked={formData.SetEmailIDAsUsername === "MotherMob"}
                />
                <label htmlFor="setusernameMotherMob">
                  Set this as username
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  disabled
                  value="MotherMob"
                  id="receiveSmsmobMother"
                  checked={formData.SetToReceiveSMS === "Mother"}
                />
                <label htmlFor="receiveSmsmobMother">
                  Set to receive SMS at this no.
                </label>
              </div> */}
            </div>
            <div className="mt-2">
              <label htmlFor="email" className="block font-bold text-xs mb-0.5">
                Email Id
              </label>
              <input
                type="email"
                id="email"
                disabled
                maxLength={50}
                value={formData.m_emailid}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "
              />

              {/* <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="emailuser"
                  disabled
                  checked={formData.SetEmailIDAsUsername === "Mother"}
                />
                <label htmlFor="emailuser">Set this as username</label>
              </div> */}
            </div>
            <div className="mt-2">
              <label
                htmlFor="dataOfAdmission"
                className="block font-bold text-xs mb-0.5"
              >
                Mother Date Of Birth
              </label>
              <input
                type="date"
                id="dataOfAdmission"
                disabled
                value={formData.f_dob}
                className=" block w-full  rounded-md py-1 px-3 bg-gray-300 "
                // onBlur={handleBlur}
              />
            </div>
            {/*  */}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ViewStudent;
