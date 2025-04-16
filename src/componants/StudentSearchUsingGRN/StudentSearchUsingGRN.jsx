import { useEffect, useState } from "react";
import axios from "axios";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentSearchUsingGRN = () => {
  // const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const student = location.state?.studentData || {};

  console.log("student", student);

  const message = location.state?.message;
  console.log(message);

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
    }
  }, [location.state]);

  return (
    <>
      <ToastContainer />
      <div className="W-[95%] mx-auto p-4">
        <div className="card p-3 rounded-md">
          <div className="card-header mb-4 flex justify-between items-center">
            <h5 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
              Student Personal Profile
            </h5>
            <RxCross1
              className="float-end relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
              onClick={() => navigate("/dashboard")}
            />
          </div>
          <div
            className="relative w-full -top-6 h-1 mx-auto bg-red-700"
            style={{ backgroundColor: "#C03078" }}
          ></div>

          <div className="bg-white w-full md:w-[95%] mx-2 rounded-md ">
            <div className="w-full mx-auto">
              <div className="">
                {" "}
                {/* mb-4 */}
                <div className="w-full flex gap-4">
                  {/* Profile Image Card */}
                  <div className="card p-3 w-[25%] shadow-md flex flex-col items-center h-auto min-h-full">
                    {/* Profile Image */}
                    <img
                      src=""
                      alt="Profile"
                      className="w-24 h-24 object-cover rounded-full border-2 border-gray-300 shadow-md"
                    />
                    {/* Student Name */}
                    <p className="mt-3 text-center text-gray-700 font-semibold">
                      {student.first_name}
                    </p>
                  </div>

                  {/* Student  and Prent Information Card */}
                  <div className="card p-3 w-[75%] shadow-md flex flex-col h-auto min-h-full">
                    {/* Student Information */}
                    <div className="flex flex-col gap-y-3 p-2 flex-grow">
                      {/* Title */}
                      <h3 className="text-gray-700 mt-1 mb-0 text-[1em] lg:text-xl text-nowrap">
                        Student Information
                      </h3>
                      <div
                        className="relative w-full  h-0.5 mx-auto bg-red-700"
                        style={{ backgroundColor: "#C03078" }}
                      ></div>
                      {/* Student Fields */}
                      <div className="flex flex-col gap-y-4 flex-grow mt-3">
                        {/* First Row */}
                        <div className="flex gap-x-4">
                          {/* Student Full Name */}
                          <strong>Student Full Name:</strong>
                          <p className="">
                            {`${student?.first_name || ""} ${
                              student?.mid_name || ""
                            } ${student?.last_name || ""}`.trim() || "N/A"}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 ">
                          {/* Student Details */}
                          <div>
                            {[
                              {
                                label: "Student Name",
                                value: student.student_name || "N/A",
                              },
                              {
                                label: "Date of Birth",
                                value: student.dob || "N/A",
                              },
                              {
                                label: "Admission Date",
                                value: student.admission_date || "N/A",
                              },
                              {
                                label: "GR No.",
                                value: student.reg_no || "N/A",
                              },
                              {
                                label: "Student ID",
                                value: student.student_id || "N/A",
                              },
                              {
                                label: "Udise Pen No.",
                                value: student.udise_pen_no || "N/A",
                              },
                              {
                                label: "Aadhaar no.",
                                value: student.stu_aadhaar_no || "N/A",
                              },
                              {
                                label: "Class",
                                value: student.get_class?.name || "N/A",
                              },
                              {
                                label: "Division",
                                value: student.get_division?.name || "N/A",
                              },
                              {
                                label: "Roll No.",
                                value: student.roll_no || "N/A",
                              },
                              {
                                label: "House",
                                value: student.house || "N/A",
                              },
                              {
                                label: "Admitted In Class",
                                value: student.admission_class || "N/A",
                              },
                              {
                                label: "Gender",
                                value: student.gender || "N/A",
                              },
                              {
                                label: "Blood Group",
                                value: student.blood_group || "N/A",
                              },
                              {
                                label: "Permanant Address",
                                value: student.permant_add || "N/A",
                              },
                              {
                                label: "City",
                                value: student.city || "N/A",
                              },
                            ].map((item, index) => (
                              <div key={index} className="flex">
                                <p className="w-40 font-bold">{item.label}:</p>
                                <p className="flex-1">{item.value}</p>
                              </div>
                            ))}
                          </div>

                          <div>
                            {[
                              {
                                label: "State",
                                value: student.state || "N/A",
                              },
                              {
                                label: "Pincode",
                                value: student.pincode || "N/A",
                              },
                              {
                                label: "Religion",
                                value: student.religion || "N/A",
                              },
                              {
                                label: "Caste",
                                value: student.caste || "N/A",
                              },
                              {
                                label: "Category",
                                value: student.category || "N/A",
                              },
                              {
                                label: "Nationality",
                                value: student.nationality || "N/A",
                              },
                              {
                                label: "Birth Place",
                                value: student.birth_place || "N/A",
                              },
                              {
                                label: "Mother Tongue",
                                value: student.mother_tongue || "N/A",
                              },
                              {
                                label: "Emergency Name",
                                value: student.emergency_name || "N/A",
                              },
                              {
                                label: "Emergency Contact",
                                value: student.emergency_contact || "N/A",
                              },
                              {
                                label: "Emergency Address",
                                value: student.emergency_add || "N/A",
                              },
                              {
                                label: "Transport Mode",
                                value: student.transport_mode || "N/A",
                              },
                              {
                                label: "Allergies",
                                value: student.allergies || "N/A",
                              },
                              {
                                label: "Weight",
                                value: student.weight || "N/A",
                              },
                              {
                                label: "Height",
                                value: student.height || "N/A",
                              },
                              {
                                label: "Has spectacles",
                                value: student.has_spec || "N/A",
                              },
                            ].map((item, index) => (
                              <div key={index} className="flex">
                                <p className="w-40 font-bold">{item.label}:</p>
                                <p className="flex-1">{item.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Parent Information */}
                    <div className="flex flex-col gap-y-3 p-2 flex-grow">
                      {/* Title */}
                      <h3 className="text-gray-700 mt-1 mb-0 text-[1em] lg:text-xl text-nowrap">
                        Parent Information
                      </h3>
                      <div
                        className="relative w-full  h-0.5 mx-auto bg-red-700"
                        style={{ backgroundColor: "#C03078" }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mt-3 p-2">
                      {/* Father Details */}
                      <div>
                        {[
                          {
                            label: "Father Name",
                            value: student.parents?.father_name || "N/A",
                          },
                          {
                            label: "Occupation",
                            value: student.parents?.father_occupation || "N/A",
                          },
                          {
                            label: "Office Address",
                            value: student.parents?.f_office_add || "N/A",
                          },
                          {
                            label: "Telephone",
                            value: student.parents?.f_office_tel || "N/A",
                          },
                          {
                            label: "Mobile Number",
                            value: student.parents?.f_mobile || "N/A",
                          },
                          {
                            label: "Email Id",
                            value: student.parents?.f_email || "N/A",
                          },
                          {
                            label: "Aadhaar no.",
                            value: student.parents?.f_aadhaar_no || "N/A",
                          },
                          {
                            label: "Date of Birth",
                            value: student.parents?.f_dob || "N/A",
                          },
                          {
                            label: "Blood Group",
                            value: student.parents?.f_blood_group || "N/A",
                          },
                          {
                            label: "User Id",
                            value: student.parents?.user?.user_id || "N/A",
                          },
                        ].map((item, index) => (
                          <div key={index} className="flex">
                            <p className="w-40 font-bold">{item.label}:</p>
                            <p className="flex-1">{item.value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Mother Details */}
                      <div>
                        {[
                          {
                            label: "Mother Name",
                            value: student.parents?.mother_name || "N/A",
                          },
                          {
                            label: "Occupation",
                            value: student.parents?.mother_occupation || "N/A",
                          },
                          {
                            label: "Office Address",
                            value: student.parents?.m_office_add || "N/A",
                          },
                          {
                            label: "Telephone",
                            value: student.parents?.m_office_tel || "N/A",
                          },
                          {
                            label: "Mobile Number",
                            value: student.parents?.m_mobile || "N/A",
                          },
                          {
                            label: "Email Id",
                            value: student.parents?.m_email || "N/A",
                          },
                          {
                            label: "Aadhaar no.",
                            value: student.parents?.m_aadhaar_no || "N/A",
                          },
                          {
                            label: "Date of Birth",
                            value: student.parents?.m_dob || "N/A",
                          },
                          {
                            label: "Blood Group",
                            value: student.parents?.m_blood_group || "N/A",
                          },
                        ].map((item, index) => (
                          <div key={index} className="flex">
                            <p className="w-40 font-bold">{item.label}:</p>
                            <p className="flex-1">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentSearchUsingGRN;
//
// import { useState } from "react";
// import {
//   FaUser,
//   FaCommentDots,
//   FaCertificate,
//   FaHeartbeat,
// } from "react-icons/fa";
// import PersonalProfile from "./PersonalProfile";
// import RemarksObservation from "./RemarksObservation";
// import ReportCardCertificates from "./ReportCardCertificates";
// import HealthActivityRecord from "./HealthActivityRecord";
// import { RxCross1 } from "react-icons/rx";
// import { useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// export default function StudentSearchUsingGRN() {
//   const [activeTab, setActiveTab] = useState("profile");
//   const navigate = useNavigate();
//   const location = useLocation();
//   const student = location.state?.studentData || {};

//   const tabs = [
//     {
//       id: "profile",
//       label: "Personal Profile",
//       icon: <FaUser />,
//       bgColor: "bg-pink-500",
//     },
//     {
//       id: "remarks",
//       label: "Remark & Observation",
//       icon: <FaCommentDots />,
//       bgColor: "bg-pink-500",
//     },
//     {
//       id: "reportCard",
//       label: "Report Card & Certificates",
//       icon: <FaCertificate />,
//       bgColor: "bg-gray-400",
//     },
//     {
//       id: "health",
//       label: "Health & Activity Record",
//       icon: <FaHeartbeat />,
//       bgColor: "bg-pink-500",
//     },
//   ];

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "profile":
//         return <PersonalProfile />;
//       case "remarks":
//         return <RemarksObservation />;
//       case "reportCard":
//         return <ReportCardCertificates />;
//       case "health":
//         return <HealthActivityRecord />;
//       default:
//         return <PersonalProfile />;
//     }
//   };

//   return (
//     <>
//       <div className="w-full md:W-[95%] mx-auto p-4">
//         <div className="card p-3 rounded-md">
//           {/* <div className="card-header mb-4 flex justify-between items-center">
//             <h5 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
//               Student Personal Profile
//             </h5>
//             <RxCross1
//               className="float-end relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
//               onClick={() => navigate("/dashboard")}
//             />
//           </div> */}
//           <div
//             className="relative w-full -top-6 h-1 mx-auto bg-red-700"
//             style={{ backgroundColor: "#C03078" }}
//           ></div>
//           <div className="flex  bg-gray-100 ">
//             {/* Left Side - Tabs */}
//             <div className="w-[15%] bg-white shadow-lg border-r p-6  rounded-lg">
//               <div className="flex flex-col items-center  gap-4">
//                 <div className="text-center item-center ">
//                   <img
//                     src="/path/to/default-profile.png"
//                     alt="Profile"
//                     className="w-24 h-24 mx-auto rounded-full border-4 border-pink-500"
//                   />
//                   <h2 className="text-sm font-semibold mt-3">
//                     ASHWATI - 11(D - Commerce & Arts) fdgdf
//                   </h2>
//                 </div>

//                 <div className="w-full text-sm flex flex-col gap-3">
//                   {tabs.map((tab) => (
//                     <button
//                       key={tab.id}
//                       className={`w-full flex items-center gap-2 p-2 rounded-lg text-white
//                                     transition-all duration-300
//                                     ${
//                                       activeTab === tab.id
//                                         ? "bg-blue-500 shadow-md"
//                                         : tab.bgColor
//                                     }
//                                     hover:bg-blue-400`}
//                       onClick={() => setActiveTab(tab.id)}
//                     >
//                       {tab.icon}
//                       {tab.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Right Side - Content */}
//             <div className="w-[85%] bg-white p-4 shadow-md rounded-lg  max-h-[calc(100vh-150px)] overflow-y-auto">
//               {renderTabContent()}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
