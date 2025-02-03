// second try
import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
function CreateStaff() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    dateOfJoining: "",
    designation: "",
    academicQualification: [],
    professionalQualification: "",
    trainingStatus: "",
    experience: "",
    gender: "",
    bloodGroup: "",
    religion: "",
    address: "",
    phone: "",
    email: "",
    aadhaarCardNo: "",
    role: "",
    employeeId: "",
    photo: null,
    specialSubject: "",
  });
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of Birth is required";
    if (!formData.dateOfJoining)
      newErrors.dateOfJoining = "Date of Joining is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 10 digits";
    if (!formData.email) newErrors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email address is invalid";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.employeeId) newErrors.employeeId = "Employee ID is required";
    return newErrors;
  };

  const handleChange = (event) => {
    const { name, value, checked } = event.target;

    if (name === "academicQualification") {
      setFormData((prevData) => {
        if (checked) {
          return {
            ...prevData,
            academicQualification: [...prevData.academicQualification, value],
          };
        } else {
          return {
            ...prevData,
            academicQualification: prevData.academicQualification.filter(
              (qualification) => qualification !== value
            ),
          };
        }
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData((prevState) => ({
      ...prevState,
      photo: file,
    }));
    setPhotoPreview(URL.createObjectURL(file));
  };

  const formatDateString = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // api calling
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token is found");
      }
      const response = await axios.post(
        `${API_URL}/api/store_staff`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response:", response.data);
      if (response.status === 201) {
        alert("Teacher created successfully!");
        navigate("/StaffList");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("An error occurred while creating the teacher.");
    }
    // Format dates before submitting
    const formattedFormData = {
      ...formData,
      dateOfBirth: formatDateString(formData.dateOfBirth),
      dateOfJoining: formatDateString(formData.dateOfJoining),
    };
    console.log(formattedFormData);
  };

 

  return (
    <div className="container mx-auto p-4 ">
      <ToastContainer/>
      <div className="card p-4 rounded-md ">
        <div className=" card-header mb-4 flex justify-between items-center ">
          <h5 className="text-gray-700 mt-1 text-md lg:text-lg">
            Staff Registration Form
          </h5>

          <RxCross1
            className="float-end relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
            onClick={() => {
              navigate("/StaffList");
            }}
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className="  md:mx-5 overflow-x-hidden shadow-md p-2 bg-gray-50"
        >
          <div className=" flex flex-col gap-4 md:grid  md:grid-cols-3 md:gap-x-14 md:mx-10 gap-y-1">
            <div className=" mx-auto      ">
              <label htmlFor="photo" className="block font-bold  text-xs mb-2">
                Photo
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Photo Preview"
                    className="   h-20 w-20 rounded-[50%] mx-auto border-1  border-black object-cover"
                  />
                ) : (
                  <FaUserCircle className="mt-2 h-20 w-20 object-cover mx-auto text-gray-300" />
                )}
              </label>
              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/*"
                onChange={handleFileChange}
                className="input-field text-xs box-border mt-2 bg-black text-white  "
              />
            </div>
            <div className="col-span-1">
              <label
                htmlFor="academicQualification"
                className="block font-bold  text-xs mb-2"
              >
                Academic Qualification
              </label>
              <div className="flex flex-wrap ">
                {[
                  "Hsc",
                  "DCE",
                  "B.A",
                  "B.Com",
                  "B.Sc",
                  "BCS",
                  "BCA",
                  "B.LIS",
                  "BPharm",
                  "BE",
                  "B.Music n Dance",
                  "M.A",
                  "MSE",
                  "M.Com",
                  "M.Sc",
                  "MCA",
                  "M.LIS",
                  "M.Phil",
                  "MBA",
                  "PGDBM",
                ].map((qualification) => (
                  <label
                    key={qualification}
                    className="flex items-center mr-4 text-sm font-md"
                  >
                    <input
                      type="checkbox"
                      name="academicQualification"
                      value={qualification}
                      checked={formData.academicQualification.includes(
                        qualification
                      )}
                      onChange={handleChange}
                      className="mr-1 "
                    />
                    {qualification}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="address"
                className="block font-bold  text-xs mb-2"
              >
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input-field resize block w-full border border-gray-300 rounded-md py-1 px-3 bg-white shadow-inner"
                rows="4"
                required
              />
            </div>

            <div className=" ">
              <label
                htmlFor="staffName"
                className="block font-bold  text-xs mb-2"
              >
                Staff Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="staffName"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="block  border w-full border-gray-300 rounded-md py-1 px-3  bg-white shadow-inner"
                required
              />
            </div>

            <div>
              <label
                htmlFor="trainingStatus"
                className="block font-bold  text-xs mb-2"
              >
                Training Status
              </label>
              <select
                id="trainingStatus"
                name="trainingStatus"
                value={formData.trainingStatus}
                onChange={handleChange}
                className="input-field block w-full border border-gray-300 rounded-md py-1 px-3 bg-white shadow-inner"
              >
                <option className="bg-gray-300" value="">
                  Select
                </option>{" "}
                <option value="Trained-PGT">Trained-PGT</option>
                <option value="Trained-TGT">Trained-TGT</option>{" "}
                <option value="Trained-PRT">Trained-PRT</option>
                <option value="NTT">NTT</option>
                <option value="ECCE">ECCE</option>
                <option value="Untrained">Untrained</option>
                <option value="NA">NA</option>
                {/* Add training status options here */}
              </select>
            </div>
            <div>
              <label htmlFor="phone" className="block font-bold  text-xs mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <div className="flex ">
                <span className=" rounded-l-md pt-1 bg-gray-200 text-black font-bold px-2 pointer-events-none ml-1">
                  +91
                </span>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  pattern="\d{10}"
                  maxLength="10"
                  title="Please enter only 10 digit number "
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field block w-full border border-gray-300 outline-none  rounded-r-md py-1 px-3 bg-white shadow-inner "
                  required
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs">{errors.phone}</p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block font-bold  text-xs mb-2"
              >
                Date Of Birth <span className="text-red-500">*</span>
              </label>
              <input
                // type="date"
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                placeholder="dd/MM/yyyy"
                onChange={handleChange}
                className="input-field block w-full border border-gray-300 rounded-md py-1 px-3 bg-white shadow-inner"
                required
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-xs">{errors.dateOfBirth}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="experience"
                className="block font-bold  text-xs mb-2"
              >
                Experience
              </label>
              <input
                type="text"
                id="experience"
                name="experience"
                value={formData.experience}
                placeholder="In year"
                onChange={handleChange}
                className="input-field block w-full border border-gray-300 rounded-md py-1 px-3 bg-white shadow-inner"
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-bold  text-xs mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field block w-full border border-gray-300 rounded-md py-1 px-3 bg-white shadow-inner"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="dateOfJoining"
                className="block font-bold  text-xs mb-2"
              >
                Date Of Joining <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="dateOfJoining"
                name="dateOfJoining"
                value={formData.dateOfJoining}
                onChange={handleChange}
                className="input-field block w-full border border-gray-300 rounded-md py-1 px-3 bg-white shadow-inner"
                required
              />
              {errors.dateOfJoining && (
                <p className="text-red-500 text-xs">{errors.dateOfJoining}</p>
              )}
            </div>
            <div className="">
              <label htmlFor="gender" className="block font-bold  text-xs mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="input-field block w-full border border-gray-300 rounded-md py-1 px-3 bg-white shadow-inner"
                required
              >
                <option className=" bg-gray-300" value="">
                  Select
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs">{errors.gender}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="aadhaarCardNo"
                className="block font-bold  text-xs mb-2"
              >
                Aadhaar Card No.
              </label>
              <input
                type="text"
                id="aadhaarCardNo"
                name="aadhaarCardNo"
                value={formData.aadhaarCardNo}
                pattern="\d{12}"
                title="Aadhaar Card Number must be exactly 12 digits"
                onChange={handleChange}
                className="input-field block w-full border border-gray-300 rounded-md py-1 px-3 bg-white shadow-inner"
              />
            </div>
            <div>
              <label
                htmlFor="designation"
                className="block font-bold  text-xs mb-2"
              >
                Designation
              </label>
              <input
                type="text"
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="input-field block w-full border border-gray-300 rounded-md py-1 px-3 bg-white shadow-inner"
              />
            </div>
            <div>
              <label
                htmlFor="bloodGroup"
                className="block font-bold  text-xs mb-2"
              >
                Blood Group
              </label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="input-field block w-full border border-gray-300 rounded-md py-1 px-3 bg-white shadow-inner"
              >
                <option className="bg-gray-300" value="">
                  Select
                </option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            <div>
              <label htmlFor="role" className="block font-bold  text-xs mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field block w-full border border-gray-300 rounded-md py-1 px-3 bg-white shadow-inner"
                required
              >
                <option className="bg-gray-300" value="">
                  Select
                </option>
                <option value="Admin">Admin</option>
                <option value="Bus">Bus</option>
                <option value="Data Entry">Data Entry</option>
                <option value="Finance">Finance</option>
                <option value="Librarian">Librarian</option>
                <option value="Management">Management</option>
                <option value="Printer">Printer</option>
                <option value="owner">owner</option>
                <option value="Support">Support</option>
                <option value="Teacher">Teacher</option>
                <option value="Support Staff">Support Staff</option>
                <option value="Security">Security</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-xs">{errors.role}</p>
              )}
            </div>
            <div>
              <div>
                <label
                  htmlFor="professionalQualification"
                  className="block font-bold  text-xs mb-2"
                >
                  Professional Qualification
                </label>
                <select
                  id="professionalQualification"
                  name="professionalQualification"
                  value={formData.professionalQualification}
                  onChange={handleChange}
                  className="input-field block w-full border border-gray-300 rounded-md py-1 px-3 bg-white shadow-inner"
                >
                  <option className="bg-gray-300" value="">
                    Select
                  </option>
                  <option value="D.Ed">D.Ed</option>
                  <option value="B.Ed">B.Ed</option>
                  <option value="B.P.Ed">B.P.Ed</option>
                  <option value="M.P.Ed">M.P.Ed</option>
                  <option value="M.Ed">M.Ed</option>
                  <option value="NA">NA</option>
                  {/* Add professional qualification options here */}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="religion"
                className="block font-bold  text-xs mb-2"
              >
                Religion
              </label>
              <input
                type="text"
                id="religion"
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                className="input-field block w-full border border-gray-300 rounded-md py-1 px-3 bg-white shadow-inner"
              />
            </div>
            <div>
              <label
                htmlFor="employeeId"
                className="block font-bold  text-xs mb-2"
              >
                Employee ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="input-field block w-full border border-gray-300 rounded-md py-1 px-3 bg-white shadow-inner"
                required
              />
              {errors.employeeId && (
                <p className="text-red-500 text-xs">{errors.employeeId}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="specialSubject"
                className="block font-bold  text-xs mb-2"
              >
                Special Subject
              </label>
              <input
                type="text"
                id="specialSubject"
                name="specialSubject"
                value={formData.specialSubject}
                onChange={handleChange}
                placeholder="Special Subject for D.Ed/B.Ed"
                className="input-field block w-full border border-gray-300 rounded-md py-1 px-3 bg-white shadow-inner"
              />
            </div>

            <div className="col-span-3  text-right">
              <button
                type="submit"
                style={{ backgroundColor: "#2196F3" }}
                className=" text-white font-bold py-1 border-1 border-blue-500 px-4 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateStaff;

// // second try
// import React, { useState } from "react";
// import axios from "axios";
// import { FaUserCircle } from "react-icons/fa";
// import { RxCross1 } from "react-icons/rx";
// import { useNavigate } from "react-router-dom";
// // const API_URL = import.meta.env.VITE_API_URL;
// function CreateStaff() {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const [formData, setFormData] = useState({
//     name: "",
//     dateOfBirth: "",
//     dateOfJoining: "",
//     designation: "",
//     academicQualification: [],
//     professionalQualification: "",
//     trainingStatus: "",
//     experience: "",
//     gender: "",
//     bloodGroup: "",
//     religion: "",
//     address: "",
//     phone: "",
//     email: "",
//     aadhaarCardNo: "",
//     role: "",
//     employeeId: "",
//     photo: null,
//     specialSubject: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [photoPreview, setPhotoPreview] = useState(null);
//   const navigate = useNavigate();

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.name) newErrors.name = "Name is required";
//     if (!formData.dateOfBirth)
//       newErrors.dateOfBirth = "Date of Birth is required";
//     if (!formData.dateOfJoining)
//       newErrors.dateOfJoining = "Date of Joining is required";
//     if (!formData.gender) newErrors.gender = "Gender is required";
//     if (!formData.address) newErrors.address = "Address is required";
//     if (!formData.phone) newErrors.phone = "Phone number is required";
//     if (!/^\d{10}$/.test(formData.phone))
//       newErrors.phone = "Phone number must be 10 digits";
//     if (!formData.email) newErrors.email = "Email is required";
//     if (!/\S+@\S+\.\S+/.test(formData.email))
//       newErrors.email = "Email address is invalid";
//     if (!formData.role) newErrors.role = "Role is required";
//     if (!formData.employeeId) newErrors.employeeId = "Employee ID is required";
//     return newErrors;
//   };

//   const handleChange = (event) => {
//     const { name, value, checked } = event.target;

//     if (name === "academicQualification") {
//       setFormData((prevData) => {
//         if (checked) {
//           return {
//             ...prevData,
//             academicQualification: [...prevData.academicQualification, value],
//           };
//         } else {
//           return {
//             ...prevData,
//             academicQualification: prevData.academicQualification.filter(
//               (qualification) => qualification !== value
//             ),
//           };
//         }
//       });
//     } else {
//       setFormData((prevData) => ({
//         ...prevData,
//         [name]: value,
//       }));
//     }
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setFormData((prevState) => ({
//       ...prevState,
//       photo: file,
//     }));
//     setPhotoPreview(URL.createObjectURL(file));
//   };

//   const formatDateString = (dateString) => {
//     if (!dateString) return "";
//     const [year, month, day] = dateString.split("-");
//     return `${day}/${month}/${year}`;
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     // Format dates before submitting
//     const formattedFormData = {
//       ...formData,
//       dateOfBirth: formatDateString(formData.dateOfBirth),
//       dateOfJoining: formatDateString(formData.dateOfJoining),
//     };

//     // const token = localStorage.getItem("");
//     const token = localStorage.getItem("authToken");

//     const data = new FormData();
//     for (const key in formattedFormData) {
//       if (key === "academicQualification") {
//         data.append(key, formattedFormData[key].join(","));
//       } else {
//         data.append(key, formattedFormData[key]);
//       }
//     }

//     if (formData.photo) {
//       data.append("photo", formData.photo);
//     }

//     try {
//       if (!token) {
//         throw new Error("No authentication token is found");
//       }
//       const response = await axios.post(
//         `${API_URL}/api/store_staff`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       console.log("Response:", response.data);
//       if (response.status === 201) {
//         alert("Teacher created successfully!");
//         navigate("/StaffList");
//       }
//     } catch (error) {
//       console.error("Error:", error.response?.data || error.message);
//       alert("An error occurred while creating the teacher.");
//     }
//   };

//   return (
//     <div className="container mx-auto p-4 ">
//       <div className="card p-4 rounded-md ">
//         <div className=" card-header mb-4 flex justify-between items-center ">
//           <h5 className="text-gray-700 mt-1 text-md lg:text-lg">
//             Staff Registration Form
//           </h5>
//           <RxCross1
//             className="float-end relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
//             onClick={() => {
//               navigate("/StaffList");
//             }}
//           />
//         </div>
//         <form
//           onSubmit={handleSubmit}
//           className="  md:mx-5 overflow-x-hidden shadow-md p-2 bg-gray-50"
//         >
//           <div className=" flex flex-col gap-4 md:grid  md:grid-cols-3 md:gap-x-14 md:mx-10 gap-y-1">
//             <div className=" mx-auto      ">
//               <label htmlFor="photo" className="block font-bold  text-xs mb-2">
//                 Photo
//                 {photoPreview ? (
//                   <img
//                     src={photoPreview}
//                     alt="Photo Preview"
//                     className="   h-20 w-20 rounded-[50%] mx-auto border-1  border-black object-cover"
//                   />
//                 ) : (
//                   <FaUserCircle className="mt-2 h-20 w-20 object-cover mx-auto text-gray-300" />
//                 )}
//               </label>
//               <input
//                 type="file"
//                 id="photo"
//                 name="photo"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 className="input-field text-xs box-border mt-2 bg-black text-white  "
//               />
//             </div>
//             <div className="col-span-1">
//               <label
//                 htmlFor="academicQualification"
//                 className="block font-bold  text-xs mb-2"
//               >
//                 Academic Qualification
//               </label>
//               <div className="flex flex-wrap ">
//                 {[
//                   "Hsc",
//                   "DCE",
//                   "B.A",
//                   "B.Com",
//                   "B.Sc",
//                   "BCS",
//                   "BCA",
//                   "B.LIS",
//                   "BPharm",
//                   "BE",
//                   "B.Music n Dance",
//                   "M.A",
//                   "MSE",
//                   "M.Com",
//                   "M.Sc",
//                   "MCA",
//                   "M.LIS",
//                   "M.Phil",
//                   "MBA",
//                   "PGDBM",
//                 ].map((qualification) => (
//                   <label
//                     key={qualification}
//                     className="flex items-center mr-4 text-sm font-md"
//                   >
//                     <input
//                       type="checkbox"
//                       name="academicQualification"
//                       value={qualification}
//                       checked={formData.academicQualification.includes(
//                         qualification
//                       )}
//                       onChange={handleChange}
//                       className="mr-1 "
//                     />
//                     {qualification}
//                   </label>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <label
//                 htmlFor="address"
//                 className="block font-bold  text-xs mb-2"
//               >
//                 Address <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 id="address"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 className="input-field resize block w-full border border-gray-300 rounded-md py-1 px-3 bg-white shadow-inner"
//                 rows="4"
//                 required
//               />
//             </div>
//             <div className=" ">
//               <label
//                 htmlFor="staffName"
//                 className="block font-bold  text-xs mb-2"
//               >
//                 Staff Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 id="staffName"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Name"
//                 className="block  border w-full border-gray-300 rounded-md py-1 px-3  bg-white shadow-inner"
//                 required
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="trainingStatus"
//                 className="block font-bold  text-xs mb-2"
//               >
//                 Training Status
//               </label>
//               <select
//                 id="trainingStatus"
//                 name="trainingStatus"
//                 value={formData.trainingStatus}
//                 onChange={handleChange}
//                 className="input-field"
//               >
//                 <option value="">Select Training Status</option>
//                 <option value="Trained">Trained</option>
//                 <option value="Untrained">Untrained</option>
//               </select>
//             </div>
//             <div>
//               <label htmlFor="gender" className="block font-bold  text-xs mb-2">
//                 Gender <span className="text-red-500">*</span>
//               </label>
//               <select
//                 id="gender"
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 className="input-field"
//                 required
//               >
//                 <option value="">Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>
//             <div>
//               <label
//                 htmlFor="professionalQualification"
//                 className="block font-bold  text-xs mb-2"
//               >
//                 Professional Qualification
//               </label>
//               <select
//                 id="professionalQualification"
//                 name="professionalQualification"
//                 value={formData.professionalQualification}
//                 onChange={handleChange}
//                 className="input-field"
//               >
//                 <option value="">Select Qualification</option>
//                 <option value="DCE">DCE</option>
//                 <option value="DELEd">DELEd</option>
//                 <option value="BEd">BEd</option>
//                 <option value="MEd">MEd</option>
//               </select>
//             </div>
//             <div>
//               <label
//                 htmlFor="religion"
//                 className="block font-bold  text-xs mb-2"
//               >
//                 Religion
//               </label>
//               <input
//                 type="text"
//                 id="religion"
//                 name="religion"
//                 value={formData.religion}
//                 onChange={handleChange}
//                 placeholder="Religion"
//                 className="input-field"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="dateOfBirth"
//                 className="block font-bold  text-xs mb-2"
//               >
//                 Date of Birth <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="date"
//                 id="dateOfBirth"
//                 name="dateOfBirth"
//                 value={formData.dateOfBirth}
//                 onChange={handleChange}
//                 className="input-field"
//                 required
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="experience"
//                 className="block font-bold  text-xs mb-2"
//               >
//                 Experience
//               </label>
//               <input
//                 type="text"
//                 id="experience"
//                 name="experience"
//                 value={formData.experience}
//                 onChange={handleChange}
//                 placeholder="Experience"
//                 className="input-field"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="bloodGroup"
//                 className="block font-bold  text-xs mb-2"
//               >
//                 Blood Group
//               </label>
//               <select
//                 id="bloodGroup"
//                 name="bloodGroup"
//                 value={formData.bloodGroup}
//                 onChange={handleChange}
//                 className="input-field"
//               >
//                 <option value="">Select Blood Group</option>
//                 <option value="A+">A+</option>
//                 <option value="A-">A-</option>
//                 <option value="B+">B+</option>
//                 <option value="B-">B-</option>
//                 <option value="AB+">AB+</option>
//                 <option value="AB-">AB-</option>
//                 <option value="O+">O+</option>
//                 <option value="O-">O-</option>
//               </select>
//             </div>
//             <div>
//               <label
//                 htmlFor="dateOfJoining"
//                 className="block font-bold  text-xs mb-2"
//               >
//                 Date of Joining <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="date"
//                 id="dateOfJoining"
//                 name="dateOfJoining"
//                 value={formData.dateOfJoining}
//                 onChange={handleChange}
//                 className="input-field"
//                 required
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="specialSubject"
//                 className="block font-bold  text-xs mb-2"
//               >
//                 Special Subject
//               </label>
//               <input
//                 type="text"
//                 id="specialSubject"
//                 name="specialSubject"
//                 value={formData.specialSubject}
//                 onChange={handleChange}
//                 placeholder="Special Subject"
//                 className="input-field"
//               />
//             </div>
//             <div>
//               <label htmlFor="phone" className="block font-bold  text-xs mb-2">
//                 Phone Number <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="tel"
//                 id="phone"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 placeholder="Phone"
//                 className="input-field"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="role" className="block font-bold  text-xs mb-2">
//                 Role <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 id="role"
//                 name="role"
//                 value={formData.role}
//                 onChange={handleChange}
//                 placeholder="Role"
//                 className="input-field"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="email" className="block font-bold  text-xs mb-2">
//                 Email <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Email"
//                 className="input-field"
//                 required
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="aadhaarCardNo"
//                 className="block font-bold  text-xs mb-2"
//               >
//                 Aadhaar Card Number
//               </label>
//               <input
//                 type="text"
//                 id="aadhaarCardNo"
//                 name="aadhaarCardNo"
//                 value={formData.aadhaarCardNo}
//                 onChange={handleChange}
//                 placeholder="Aadhaar Card Number"
//                 className="input-field"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="employeeId"
//                 className="block font-bold  text-xs mb-2"
//               >
//                 Employee ID <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 id="employeeId"
//                 name="employeeId"
//                 value={formData.employeeId}
//                 onChange={handleChange}
//                 placeholder="Employee ID"
//                 className="input-field"
//                 required
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="designation"
//                 className="block font-bold  text-xs mb-2"
//               >
//                 Designation
//               </label>
//               <input
//                 type="text"
//                 id="designation"
//                 name="designation"
//                 value={formData.designation}
//                 onChange={handleChange}
//                 placeholder="Designation"
//                 className="input-field"
//               />
//             </div>
//           </div>
//           <div className="  w-full mt-10 md:mb-10 flex justify-end">
//             <button
//               type="submit"
//               className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
//             >
//               Register
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default CreateStaff;
