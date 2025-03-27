import React, { useEffect, useState } from "react";
import axios from "axios";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PersonalProfile = () => {
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

          <div className="bg-white w-full  mx-2 rounded-md ">
            <div className="w-full mx-auto">
              <div className="">
                {" "}
                {/* mb-4 */}
                <div className="w-full flex gap-4">
                  {/* Profile Image Card */}
                  <div className="card p-3 w-full md:w-[20%] shadow-md flex flex-col items-center h-auto min-h-full">
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
                  <div className="card p-3 w-full md:w-[80%] shadow-md flex flex-col h-auto min-h-full">
                    {/* Student Information */}
                    <div className="flex flex-col gap-y-3 p-2 flex-grow">
                      <h3 className="text-gray-700 mt-1 mb-0 text-[1em] lg:text-xl text-nowrap">
                        Student Information
                      </h3>
                      <div
                        className="relative w-full h-0.5 mx-auto bg-red-700"
                        style={{ backgroundColor: "#C03078" }}
                      ></div>

                      <div className=" text-sm grid grid-cols-3 gap-x-4 mt-3">
                        {[
                          {
                            label: "Student Name",
                            value: student.student_name || " ",
                          },
                          {
                            label: "Date of Birth",
                            value: student.dob || " ",
                          },
                          {
                            label: "Admission Date",
                            value: student.admission_date || " ",
                          },
                          { label: "GR No.", value: student.reg_no || " " },
                          {
                            label: "Student ID",
                            value: student.student_id || " ",
                          },
                          {
                            label: "Udise Pen No.",
                            value: student.udise_pen_no || " ",
                          },
                          {
                            label: "Aadhaar no.",
                            value: student.stu_aadhaar_no || " ",
                          },
                          {
                            label: "Class",
                            value: student.get_class?.name || " ",
                          },
                          {
                            label: "Division",
                            value: student.get_division?.name || " ",
                          },
                          {
                            label: "Roll No.",
                            value: student.roll_no || " ",
                          },
                          { label: "House", value: student.house || " " },
                          {
                            label: "Admitted In Class",
                            value: student.admission_class || " ",
                          },
                          { label: "Gender", value: student.gender || " " },
                          {
                            label: "Blood Group",
                            value: student.blood_group || " ",
                          },
                          {
                            label: "Permanant Address",
                            value: student.permant_add || " ",
                          },
                          { label: "City", value: student.city || " " },
                          { label: "State", value: student.state || " " },
                          { label: "Pincode", value: student.pincode || " " },
                          {
                            label: "Religion",
                            value: student.religion || " ",
                          },
                          { label: "Caste", value: student.caste || " " },
                          {
                            label: "Category",
                            value: student.category || " ",
                          },
                          {
                            label: "Nationality",
                            value: student.nationality || " ",
                          },
                          {
                            label: "Birth Place",
                            value: student.birth_place || " ",
                          },
                          {
                            label: "Mother Tongue",
                            value: student.mother_tongue || " ",
                          },
                          {
                            label: "Emergency Name",
                            value: student.emergency_name || " ",
                          },
                          {
                            label: "Emergency Contact",
                            value: student.emergency_contact || " ",
                          },
                          {
                            label: "Emergency Address",
                            value: student.emergency_add || " ",
                          },
                          {
                            label: "Transport Mode",
                            value: student.transport_mode || " ",
                          },
                          {
                            label: "Allergies",
                            value: student.allergies || " ",
                          },
                          { label: "Weight", value: student.weight || " " },
                          { label: "Height", value: student.height || " " },
                          {
                            label: "Has spectacles",
                            value: student.has_spec || " ",
                          },
                        ].map((item, index) => (
                          <div key={index} className="flex">
                            <p className="w-40 font-bold">{item.label}:</p>
                            <p className="flex-1">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Parent Information */}
                    <div className="flex flex-col gap-y-3 p-2 flex-grow">
                      <h3 className="text-gray-700 mt-1 mb-0 text-[1em] lg:text-xl text-nowrap">
                        Parent Information
                      </h3>
                      <div
                        className="relative w-full h-0.5 mx-auto bg-red-700"
                        style={{ backgroundColor: "#C03078" }}
                      ></div>

                      <div className="text-sm grid grid-cols-3 gap-x-4 mt-3">
                        {[
                          {
                            label: "Father Name",
                            value: student.parents?.father_name || " ",
                          },
                          {
                            label: "Occupation",
                            value: student.parents?.father_occupation || " ",
                          },
                          {
                            label: "Office Address",
                            value: student.parents?.f_office_add || " ",
                          },
                          {
                            label: "Telephone",
                            value: student.parents?.f_office_tel || " ",
                          },
                          {
                            label: "Mobile Number",
                            value: student.parents?.f_mobile || " ",
                          },
                          {
                            label: "Email Id",
                            value: student.parents?.f_email || " ",
                          },
                          {
                            label: "Aadhaar no.",
                            value: student.parents?.f_aadhaar_no || " ",
                          },
                          {
                            label: "Date of Birth",
                            value: student.parents?.f_dob || " ",
                          },
                          {
                            label: "Blood Group",
                            value: student.parents?.f_blood_group || " ",
                          },
                          {
                            label: "User Id",
                            value: student.parents?.user?.user_id || " ",
                          },
                          {
                            label: "Mother Name",
                            value: student.parents?.mother_name || " ",
                          },
                          {
                            label: "Occupation",
                            value: student.parents?.mother_occupation || " ",
                          },
                          {
                            label: "Office Address",
                            value: student.parents?.m_office_add || " ",
                          },
                          {
                            label: "Telephone",
                            value: student.parents?.m_office_tel || " ",
                          },
                          {
                            label: "Mobile Number",
                            value: student.parents?.m_mobile || " ",
                          },
                          {
                            label: "Email Id",
                            value: student.parents?.m_email || " ",
                          },
                          {
                            label: "Aadhaar no.",
                            value: student.parents?.m_aadhaar_no || " ",
                          },
                          {
                            label: "Date of Birth",
                            value: student.parents?.m_dob || " ",
                          },
                          {
                            label: "Blood Group",
                            value: student.parents?.m_blood_group || " ",
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

export default PersonalProfile;
