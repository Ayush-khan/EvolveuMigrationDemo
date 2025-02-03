import { useState, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function ViewCareTacker() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    name: "",
    birthday: "",
    date_of_joining: "",
    designation: "",
    academic_qual: "",
    sex: "",
    blood_group: "",
    religion: "",
    address: "",
    phone: "",
    email: "",
    aadhar_card_no: "",
    teacher_id: "",
    employee_id: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { staff } = location.state || {};
  // Maximum date for date_of_birth
  // Get today's date in YYYY-MM-DD format

  useEffect(() => {
    if (staff) {
      setFormData({
        employee_id: staff.employee_id || " ",
        name: staff.name || "",
        birthday: staff.birthday || "",
        date_of_joining: staff.date_of_joining || "",
        sex: staff.sex || "",
        religion: staff.religion || "",
        blood_group: staff.blood_group || "",
        address: staff.address || "",
        phone: staff.phone || "",
        designation: staff.designation || "",
        academic_qual: staff.academic_qual || "",
        aadhar_card_no: staff.aadhar_card_no || "",
        teacher_id: staff.tc_id || "",

        isDelete: staff.isDelete || "N",
      });
    }
  }, [staff, API_URL]);

  const [classes, setClasses] = useState([]);

  const fetchTeacherCategory = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${API_URL}/api/get_teachercategory`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setClasses(response.data.data); // Assuming response has 'data' property holding the categories array
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchTeacherCategory();
  }, []);
  // Function to get teacher category name based on tc_id
  const getTeacherCategoryName = (tc_id) => {
    const category = classes.find((cat) => cat.tc_id === tc_id);
    return category ? category.name : "Unknown Category";
  };

  // Function to convert gender code to readable format
  const getGenderDisplay = (genderCode) => {
    switch (genderCode) {
      case "M":
        return "Male";
      case "F":
        return "Female";
      case "O":
        return "Other";
      default:
        return "Unknown";
    }
  };
  return (
    <div className="container mx-auto p-4 ">
      <ToastContainer />
      <div className="card p-4 rounded-md ">
        <div className=" card-header mb-4 flex justify-between items-center ">
          <h5 className="text-gray-700 mt-1 text-md lg:text-lg">
            View Caretaker
          </h5>

          <RxCross1
            className="float-end relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
            onClick={() => {
              setErrors({});
              navigate("/careTacker");
            }}
          />
        </div>
        <div
          className=" relative w-full   -top-6 h-1  mx-auto bg-red-700"
          style={{
            backgroundColor: "#C03078",
          }}
        ></div>
        <p className="  md:absolute md:right-10  md:top-[15%]   text-gray-500 "></p>
        <form
          //   onSubmit={handleSubmit}
          className="  md:mx-5 overflow-x-hidden shadow-md p-2 bg-gray-50"
        >
          <div className=" flex flex-col  md:grid  md:grid-cols-3 md:gap-x-14 md:mx-10 gap-y-1">
            <div className=" ">
              <label
                htmlFor="staffName"
                className="block font-bold  text-xs mb-2"
              >
                Name
              </label>
              <p className="input-field h-9  block w-full  border border-gray-300 rounded-md py-1 px-3 bg-gray-300">
                {formData.name}
              </p>
            </div>
            <div>
              <label
                htmlFor="birthday"
                className="block font-bold text-xs mb-2"
              >
                Date of Birth
              </label>
              <p className="input-field h-9  block w-full  border border-gray-300 rounded-md py-1 px-3 bg-gray-300">
                {formData.birthday}
              </p>
            </div>
            <div>
              <label
                htmlFor="date_of_joining"
                className="block font-bold  text-xs mb-2"
              >
                Date Of Joining
              </label>
              <p className="input-field h-9  block w-full  border border-gray-300 rounded-md py-1 px-3 bg-gray-300">
                {formData.date_of_joining}
              </p>
            </div>
            <div>
              <label
                htmlFor="designation"
                className="block font-bold  text-xs mb-2"
              >
                Designation
              </label>
              <p className="input-field h-9  block w-full  border border-gray-300 rounded-md py-1 px-3 bg-gray-300">
                {formData.designation}
              </p>
            </div>

            <div>
              <label
                htmlFor="academic_qual"
                className="block font-bold  text-xs mb-2"
              >
                Academic Qualification
              </label>
              <p className="input-field h-9  block w-full  border border-gray-300 rounded-md py-1 px-3 bg-gray-300">
                {formData.academic_qual}
              </p>
            </div>

            <div>
              <label
                htmlFor="aadhar_card_no"
                className="block font-bold  text-xs mb-2"
              >
                Aadhaar Card No.
              </label>
              <p className="input-field h-9  block w-full  border border-gray-300 rounded-md py-1 px-3 bg-gray-300">
                {formData.aadhar_card_no}
              </p>
            </div>

            <div className="">
              <label htmlFor="sex" className="block font-bold  text-xs mb-2">
                Gender
              </label>

              <p className="input-field h-9  block w-full  border border-gray-300 rounded-md py-1 px-3 bg-gray-300">
                {getGenderDisplay(formData.sex)}
              </p>
            </div>

            <div>
              <label
                htmlFor="blood_group"
                className="block font-bold  text-xs mb-2"
              >
                Blood Group
              </label>
              <p className="input-field h-9  block w-full  border border-gray-300 rounded-md py-1 px-3 bg-gray-300">
                {formData.blood_group}
              </p>
            </div>

            <div>
              <label
                htmlFor="religion"
                className="block font-bold  text-xs mb-2"
              >
                Religion
              </label>
              <p className="input-field h-9  block w-full  border border-gray-300 rounded-md py-1 px-3 bg-gray-300">
                {formData.religion}
              </p>
            </div>

            <div>
              <label
                htmlFor="address"
                className="block font-bold  text-xs mb-2"
              >
                Address
              </label>

              <textarea
                type="text"
                maxLength={200}
                id="address"
                name="address"
                readOnly
                value={formData.address}
                className="input-field outline-none resize block w-full border border-gray-300 rounded-md py-1 px-3 bg-gray-300 shadow-inner"
                rows="2"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block font-bold  text-xs mb-2">
                Phone
              </label>
              <div className="flex ">
                <span className=" rounded-l-md pt-1 bg-gray-200 text-black font-bold px-2 pointer-events-none ml-1">
                  +91
                </span>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  maxLength="10"
                  readOnly
                  value={formData.phone}
                  className="input-field block w-full border border-gray-300 outline-none  rounded-r-md py-1 px-3 bg-gray-300 shadow-inner "
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="employee_id"
                className="block font-bold  text-xs mb-2"
              >
                Employee ID
              </label>

              <input
                type="tel"
                maxLength={5}
                id="employee_id"
                readOnly
                name="employee_id"
                value={formData.employee_id}
                className="input-field outline-none block w-full border border-gray-300 rounded-md py-1 px-3 bg-gray-300 shadow-inner"
              />
            </div>
            <div>
              <label
                htmlFor="teacher_category"
                className="block font-bold  text-xs mb-2"
              >
                Teacher Category
              </label>
              <p className="input-field h-9  block w-full  border border-gray-300 rounded-md py-1 px-3 bg-gray-300">
                {getTeacherCategoryName(formData.teacher_id)}{" "}
              </p>
            </div>

            <div className="col-span-3  text-right">
              {/* <button
                type="submit"
                style={{ backgroundColor: "#2196F3" }}
                className=" text-white font-bold py-1 border-1 border-blue-500 px-4 rounded"
              >
                Update
              </button> */}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ViewCareTacker;
