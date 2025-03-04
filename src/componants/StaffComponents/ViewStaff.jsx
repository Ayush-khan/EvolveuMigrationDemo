// corret date formate dd/mm/yy
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { useNavigate, useLocation } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function ViewStaff() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const { staff } = location.state || {};
  const [formData, setFormData] = useState({
    employee_id: "",
    name: "",
    father_spouse_name: "",
    birthday: "",
    date_of_joining: "",
    sex: "",
    religion: "",
    blood_group: "",
    address: "",
    phone: "",
    email: "",
    designation: "",
    academic_qual: [],
    professional_qual: "",
    special_sub: "",
    trained: "",
    experience: "",
    aadhar_card_no: "",
    teacher_image_name: null,
    user_id: "",
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  // Role ID to Name Mapping

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login"); // Navigate to login page if no token is found
      return;
    }

    axios
      .get(`${API_URL}/api/teachers/${staff?.teacher_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const formatDate = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }).format(date);
        };

        const teacher = response.data.teacher || {};
        const user = response.data.user || {};
        const roleMapping = {
          A: "Admin",
          B: "Bus",
          E: "Data Entry",
          F: "Finance",
          L: "Librarian",
          M: "Management",
          N: "Printer",
          O: "Owner",
          R: "Support",
          T: "Teacher",
          X: "Support Staff",
          Y: "Security",
          P: "Principle",
        };

        // Ensure the mapping uses the correct role_id and displays full name
        const role_name =
          user && user.role_id
            ? roleMapping[user.role_id.toUpperCase()] || "Unknown"
            : "Unknown";
        // Map API response to form data
        setFormData({
          employee_id: teacher.employee_id || "",
          name: teacher.name || "",
          father_spouse_name: teacher.father_spouse_name || "",
          birthday: formatDate(teacher.birthday),
          date_of_joining: formatDate(teacher.date_of_joining),
          sex: teacher?.sex || "",

          religion: teacher.religion || "",
          blood_group: teacher.blood_group || "",
          address: teacher.address || "",
          phone: teacher.phone || "",
          email: teacher.email || "",
          designation: teacher.designation || "",
          academic_qual: teacher.academic_qual
            ? teacher.academic_qual.split(",")
            : [],
          professional_qual: teacher.professional_qual || "",
          special_sub: teacher.special_sub || "",
          trained: teacher.trained || "",
          experience: teacher.experience || 0,
          aadhar_card_no: teacher.aadhar_card_no || "",
          teacher_image_name: teacher.teacher_image_name || null,
          role_id: user.role_id || null,
          user_id: user.user_id !== null ? user.user_id : "",

          role_name: role_name,
        });
        console.log("role_name", formData.role_name);
        if (teacher.teacher_image_name) {
          setPhotoPreview(
            // `https://sms.evolvu.in/storage/app/public/teacher_images/${teacher.teacher_image_name}`
            `${teacher?.teacher_image_name}`
          );
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          console.log("Unauthorized:", error.response);
        } else {
          toast.error("An error occurred while fetching teacher data.");
        }
      });
  }, [staff?.teacher_id, navigate]);

  console.log("staff", staff);
  console.log("formData_teacher_image--->", formData.teacher_image);
  console.log("teacherImgfrom API:-->", photoPreview);

  return (
    <>
      <ToastContainer />
      <div className="container mx-auto p-4">
        <div className="card p-4 rounded-md">
          <div className="card-header mb-4 flex justify-between items-center">
            <h5 className="text-gray-700 mt-1 text-md lg:text-lg">
              View Staff Details
            </h5>
            <RxCross1
              className="float-end relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
              onClick={() => {
                navigate("/StaffList");
              }}
            />
          </div>
          <div
            className=" relative w-full   -top-6 h-1  mx-auto bg-red-700"
            style={{
              backgroundColor: "#C03078",
            }}
          ></div>
          <div className="md:mx-5 overflow-x-hidden shadow-md p-2 bg-gray-50">
            <div className="flex flex-col md:grid md:grid-cols-3 md:gap-x-14 md:mx-10 ">
              <div className="mx-auto">
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
              <div className="col-span-1">
                <label
                  htmlFor="academic_qual"
                  className="block font-bold text-xs mb-2"
                >
                  Academic Qualification
                </label>
                <div className="flex flex-wrap">
                  {formData.academic_qual.map((qualification) => (
                    <span key={qualification} className="mr-4 text-sm font-md">
                      {qualification}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block font-bold text-xs mb-2"
                >
                  Address
                </label>
                <p className="input-field resize h-[70%]  block w-full  border border-gray-300 rounded-md py-1 px-3 bg-gray-300">
                  {formData.address}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 ">
              {[
                { label: "Employee ID", name: "employee_id" },
                { label: "Name", name: "name" },
                { label: "Father/Spouse Name", name: "father_spouse_name" },
                { label: "Date of Birth", name: "birthday" },
                { label: "Date of Joining", name: "date_of_joining" },
                { label: "Gender", name: "sex" },
                { label: "Religion", name: "religion" },
                { label: "Blood Group", name: "blood_group" },
                { label: "Phone", name: "phone" },
                { label: "Email", name: "email" },
                {
                  label: "Designation",
                  name: "designation",
                },
                {
                  label: "Professional Qualification",
                  name: "professional_qual",
                },
                { label: "Special Subject", name: "special_sub" },

                { label: "Trained", name: "trained" },

                { label: "Experience", name: "experience" },

                { label: "Aadhar Card Number", name: "aadhar_card_no" },

                // { label: "Role", name: "role_id" },
                {
                  label: "Role",
                  name: "role_name",
                  // value: roleMapping[formData.designation] || "Unknown",
                  // value: roleMapping[formData.role_id] || "Unknown",
                },
              ].map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="block font-bold text-xs py-1"
                  >
                    {field.label}
                  </label>
                  {formData[field.name] ? (
                    <p className="input-field w-full border  border-gray-300 rounded-md py-1 px-3 bg-gray-300 ">
                      {field.value || formData[field.name]}
                    </p>
                  ) : (
                    <p className="input-field w-full  border pointer-events-none cursor-none border-gray-300 rounded-md py-3 px-3 bg-gray-300 ">
                      {field.value || formData[field.name]}
                    </p>
                  )}
                </div>
              ))}
              <div className="col-span-1">
                <label
                  htmlFor="experience"
                  className="block font-bold  text-xs mb-1 mt-1"
                >
                  User ID{" "}
                </label>
                <input
                  type="text"
                  name="User_id"
                  value={formData.user_id}
                  readOnly
                  className="input-field block w-full border border-gray-300 rounded-md py-1 px-3  shadow-inner outline-none bg-gray-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewStaff;
