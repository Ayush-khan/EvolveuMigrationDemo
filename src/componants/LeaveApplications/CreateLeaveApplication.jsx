import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const CreateLeaveApplication = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    staff_name: "",
    leave_type_id: "",
    leave_start_date: "",
    leave_end_date: "",
    no_of_days: "",
    reason: "",
  });

  const [errors, setErrors] = useState({});
  const [leaveType, setLeaveType] = useState([]);
  const [newLeaveType, setNewLeaveType] = useState("");
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // const [regId, setRegId] = useState(null);

  const navigate = useNavigate();
  const MAX_DATE = "2006-12-31";
  const today = new Date().toISOString().split("T")[0];

  const validateDays = (days) => {
    if (!days) return "Number of days is required";
    if (!/^\d{1,2}(\.\d{1,2})?$/.test(days)) {
      return "Enter a valid number";
    }
    return null;
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.staff_name) {
      newErrors.staff_name = "Staff name is required";
    } else if (!/^[^\d].*/.test(formData.staff_name)) {
      newErrors.staff_name = "Staff name should not start with a number";
    }

    if (!formData.leave_type_id) {
      newErrors.leave_type_id = "Leave type is required";
    }

    if (!formData.leave_start_date) {
      newErrors.leave_start_date = "Leave start date is required";
    }

    if (!formData.leave_end_date) {
      newErrors.leave_end_date = "Leave end date is required";
    }

    const daysError = validateDays(formData.no_of_days);
    if (daysError) {
      newErrors.no_of_days = daysError;
    }

    setErrors(newErrors);
    return newErrors;
  };

  const fetchSessionData = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.get(`${API_URL}/api/sessionData`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      console.log("response session data", response.data);

      if (response.data && response.data.user) {
        const { name, reg_id } = response.data.user;
        console.log("user reg id", response.data.user.reg_id);
        // Set staff name and reg_id
        setFormData((prevData) => ({
          ...prevData,
          staff_name: name,
          reg_id: reg_id,
        }));

        fetchLeaveType(reg_id);
        console.log("user fetch reg id", reg_id);
      } else {
        console.error("User data not found in the response");
      }
    } catch (error) {
      console.error("Error fetching session data:", error);
    }
  };

  const fetchLeaveType = async (reg_id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No Authentication token found.");
      }
      // console.log("regid", reg_id)
      const response = await axios.get(
        `${API_URL}/api/get_leavetypedata/${reg_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // Process response
      if (Array.isArray(response.data.data)) {
        setLeaveType(response.data.data); // Set leave types
      } else {
        setError("Unexpected data format.");
      }
    } catch (error) {
      setError(error.message);
      toast.error("Error fetching leave type");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => {
      let updatedData = {
        ...prevData,
        [name]: value,
      };

      // Recalculate no_of_days only if the dates are changed, and no manual editing is done
      if (
        updatedData.leave_start_date &&
        updatedData.leave_end_date &&
        name !== "no_of_days"
      ) {
        const startDate = new Date(updatedData.leave_start_date);
        const endDate = new Date(updatedData.leave_end_date);

        // Calculate day difference as a decimal (including fractional days)
        const timeDiff = endDate - startDate;
        const dayDiff = timeDiff / (1000 * 60 * 60 * 24) + 1; // Including fractional days

        // Set the calculated value
        updatedData.no_of_days = dayDiff > 0 ? dayDiff.toFixed(0) : "";
      }

      return updatedData;
    });

    // When manually editing no_of_days field, accept decimals and validate
    if (name === "no_of_days") {
      // Allow decimal values (positive only)
      const decimalPattern = /^\d+(\.\d+)?$/;
      if (decimalPattern.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          no_of_days: "", // Clear any existing errors
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          no_of_days: "Please enter a valid positive number (e.g., 0.5).",
        }));
      }
    }
  };

  const formatDateString = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Object.values(validationErrors).forEach((error) => {
        toast.error(error);
      });
      return;
    }

    const formattedFormData = {
      ...formData,
      leave_start_date: formatDateString(formData.leave_start_date),
      leave_end_date: formatDateString(formData.leave_end_date),
      staff_id: formData.reg_id,
      staff_name: formData.staff_name,
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await axios.post(
        `${API_URL}/api/save_leaveapplication`,
        formattedFormData,
        {
          headers: {
            "Content-Type": "application/json", // Use JSON as content type
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data } = response;
      if (data.success) {
        toast.success("Leave Application Created Successfully!");
        setTimeout(() => {
          navigate("/leaveApplication");
        }, 500);
      } else {
        toast.error(
          "You have Applied for the leave more than the balance leave."
        );
      }
    } catch (error) {
      toast.error("Error submitting leave application");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionData();
    fetchLeaveType();
  }, []);

  const handleChangeLeaveType = (e) => {
    const { value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      leave_type_id: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      leave_type_id: value ? null : "Leave type is required",
    }));
  };

  return (
    <div className="container mx-auto min-h-screen flex items-center justify-center mt-3 ">
      <ToastContainer />
      <div className="card p-4 rounded-md w-[60%] ">
        <div className=" card-header mb-4 flex justify-between items-center">
          <h5 className="text-gray-700 mt-1 text-md lg:text-lg">
            Create Leave Application
          </h5>

          <RxCross1
            className="float-end relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
            onClick={() => {
              setErrors({});
              navigate("/leaveApplication");
            }}
          />
        </div>
        <div
          className=" relative w-full -top-6 h-1  mx-auto bg-red-700"
          style={{
            backgroundColor: "#C03078",
          }}
        ></div>
        <p className="  md:absolute md:right-10  md:top-[14%]  text-gray-500  ">
          <span className="text-red-500">*</span>indicates mandatory information
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center overflow-x-hidden shadow-md p-3 bg-gray-50 space-y-2" //min-h-screen flex items-center justify-center overflow-x-hidden shadow-md p-4 bg-gray-50
        >
          <div className="modal-body">
            <div className=" relative mb-3 flex justify-center  mx-4">
              <label htmlFor="sectionName" className="w-1/2 mt-2">
                Staff Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={100}
                id="staff_name"
                name="staff_name"
                pattern="^[^\d].*"
                title="Name should not start with a number"
                required
                value={formData.staff_name}
                className="w-full form-control shadow-md mb-2"
                disabled
              />
              <div className="absolute top-9 left-1/3">
                {errors.staff_name && (
                  <span className="text-danger text-xs">
                    {errors.staff_name}
                  </span>
                )}
              </div>
            </div>
            <div className="relative mb-3 flex justify-center mx-4">
              <label htmlFor="departmentId" className="w-1/2 mt-2">
                Leave Type <span className="text-red-500">*</span>
              </label>
              <select
                id="leave_type"
                name="leave_type"
                value={formData.leave_type_id}
                onChange={handleChangeLeaveType}
                required
                className="form-control shadow-md"
              >
                <option className="bg-gray-300" value="">
                  Select Leave{" "}
                </option>
                {leaveType.length === 0 ? (
                  <option>No Options</option>
                ) : (
                  leaveType.map((leave) => (
                    <option
                      key={leave.leave_type_id}
                      value={leave.leave_type_id}
                      className="max-h-20 overflow-y-scroll"
                    >
                      {leave.name}
                    </option>
                  ))
                )}
              </select>
              <div className="absolute top-9 left-1/3">
                {errors.leave_type_id && (
                  <span className="text-danger text-xs">
                    {errors.leave_type_id}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 relative mb-3 flex justify-center  mx-4">
              <label htmlFor="startDate" className="w-1/2 mt-2">
                Leave Start Date <span className="text-red-500">*</span>
              </label>

              <input
                type="date"
                id="leave_start_date"
                min={today}
                name="leave_start_date"
                value={formData.leave_start_date}
                onChange={handleChange}
                // max={formData.leave_end_date || ""}
                required
                className="form-control shadow-md"
              />
              <div className="absolute top-9 left-1/3">
                {errors.leave_start_date && (
                  <span className="text-danger text-xs">
                    {errors.leave_start_date}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-4 relative mb-3 flex justify-center  mx-4">
              <label htmlFor="endDate" className="w-1/2 mt-2">
                Leave End Date <span className="text-red-500">*</span>
              </label>

              <input
                type="date"
                id="leave_end_date"
                min={today}
                name="leave_end_date"
                value={formData.leave_end_date}
                onChange={handleChange}
                // min={formData.leave_start_date || ""}
                required
                className="form-control shadow-md"
              />
              <div className="absolute top-9 left-1/3 ">
                {errors.leave_end_date && (
                  <span className="text-danger text-xs">
                    {errors.leave_end_date}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-4 relative mb-3 flex justify-center  mx-4">
              <label htmlFor="openDay" className="w-1/2 mt-2">
                No. of days<span className="text-red-500">*</span>
              </label>
              <input
                type="number" // Change to "number" to support decimals
                id="no_of_days"
                name="no_of_days"
                value={formData.no_of_days}
                step="0.5" // Allows decimals (e.g., 0.5, 1.75)
                min="0.5" // Ensures that 0.01 or more is entered
                onChange={handleChange}
                className="form-control shadow-md mb-2"
              />
              <div className="absolute top-9 left-1/3 ">
                {errors.no_of_days && (
                  <span className="text-danger text-xs">
                    {errors.no_of_days}
                  </span>
                )}
              </div>
            </div>
            <div className=" relative mb-3 flex justify-center  mx-4">
              <label htmlFor="comment" className="w-1/2 mt-2">
                Reason
              </label>
              <textarea
                type="text"
                maxLength={200}
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="2"
                className="form-control shadow-md mb-2"
              />{" "}
            </div>
            <div className="col-span-3 text-right mt-4">
              <button
                className="mr-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700"
                onClick={handleSubmit}
                // disabled={loadingForSearch}
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLeaveApplication;

{
  /* <button
                className="mr-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700"
                onClick={() => navigate("/createLeaveApplication")}
                // disabled={loadingForSearch}
              >
                Reset
              </button>
              <button
                className=" bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-700"
                onClick={() => navigate("/leaveApplication")}
                // disabled={loadingForSearch}
              >
                Back
              </button> */
}

//     <div className="w-full max-w-3xl rounded-lg mt-0">
//   <div className="flex flex-col mt-0 md:grid md:grid-cols-2 md:gap-x-0 md:gap-y-4">
//     <label htmlFor="staffName" className="w-1/2 mt-2 ml-7">
//       Staff Name <span className="text-red-500">*</span>
//     </label>
//     <input
//       type="text"
//       maxLength={100}
//       id="staff_name"
//       name="staff_name"
//       pattern="^[^\d].*"
//       title="Name should not start with a number"
//       required
//       value={formData.staff_name}
//       // onChange={handleChange}
//       // placeholder="Name"
//       className="block border w-full border-gray-300 rounded-md py-1 px-3 bg-white shadow-inner"
//       readOnly
//     />
//     <div className="absolute top-48 left-[50%] mt-3">
//      {errors.staff_name && (
//         <span className="text-red-500 text-xs">
//           {errors.staff_name}
//         </span>
//       )}
//     </div>
//     <label htmlFor="leavetype" className="w-1/2 mt-2 ml-7">
//       Leave Type<span className="text-red-500">*</span>
//     </label>
//     <select
//       id="leave_type"
//       name="leave_type"
//       value={formData.leave_type_id}
//       onChange={handleChangeLeaveType}
//       required
//       className="input-field block w-full border border-gray-300 rounded-md py-1 px-3 bg-white shadow-inner mt-2"
//     >
//       <option className="bg-gray-300" value="">
//         Select
//       </option>

//       {leaveType.length === 0 ? (
//         <option>No Options</option>
//       ) : (
//         leaveType.map((leave) => (
//           <option
//             key={leave.leave_type_id}
//             value={leave.leave_type_id}
//             className="max-h-20 overflow-y-scroll"
//           >
//             {leave.name}
//           </option>
//         ))
//       )}
//     </select>
//     <div className="absolute top-48 left-[50%] mt-3">
//      {/* {errors.leave_type_id && (
//         <span className="text-red-500 text-xs">
//           {errors.leave_type_id}
//         </span>
//       )} */}
//     </div>
//     <label htmlFor="leavestartdate" className="w-1/2 mt-2 ml-7">
//       Leave Start Date <span className="text-red-500">*</span>
//     </label>
//     <input
//       type="date"
//       id="leave_start_date"
//       // max={today}
//       name="leave_start_date"
//       value={formData.leave_start_date}
//       onChange={handleChange}
//       max={formData.leave_end_date || ""}
//       className="input-field block w-full border border-gray-300 rounded-md py-1 px-3 bg-white shadow-inner mt-2"
//       required
//     />
//     <div className="absolute top-60 left-[50%] mt-4">
//      {/* {errors.leave_start_date && (
//         <span className="text-red-500 text-xs">
//           {errors.leave_start_date}
//         </span>
//       )} */}
//     </div>

//     <label htmlFor="leaveenddate" className="w-1/2 mt-2 ml-7">
//       Leave End Date<span className="text-red-500">*</span>
//     </label>
//     <input
//       type="date"
//       id="leave_end_date"
//       // max={today}
//       name="leave_end_date"
//       value={formData.leave_end_date}
//       onChange={handleChange}
//       min={formData.leave_start_date || ""}
//       className="input-field block w-full border border-gray-300 rounded-md py-1 px-3 bg-white shadow-inner mt-2"
//       required
//     />
//     <div className="absolute top-48 left-[50%] mt-3">
//      {/* {errors.leave_end_date && (
//         <span className="text-red-500 text-xs">
//           {errors.leave_end_date}
//         </span>
//       )} */}
//     </div>
//     <label htmlFor="days" className="w-1/2 mt-2 ml-7">
//       No. of Days <span className="text-red-500">*</span>
//     </label>
//     <input
//       type="number" // Change to "number" to support decimals
//       id="no_of_days"
//       name="no_of_days"
//       value={formData.no_of_days}
//       step="0.5" // Allows decimals (e.g., 0.5, 1.75)
//       min="0.5" // Ensures that 0.01 or more is entered
//       onChange={handleChange}
//       className="input-field block w-full border border-gray-300 rounded-md py-1 px-3 bg-white shadow-inner mt-2"
//     />
//       <div className="absolute top-48 left-[50%] mt-3">
//      {/* {errors.no_of_days && (
//         <span className="text-red-500 text-xs">
//           {errors.no_of_days}
//         </span>
//       )} */}
//     </div>
//     <label htmlFor="reason" className="w-1/2 mt-2 ml-7">
//       Reason
//     </label>
//     <textarea
//       type="text"
//       maxLength={200}
//       id="reason"
//       name="reason"
//       value={formData.reason}
//       onChange={handleChange}
//       className="input-field resize block w-full border border-gray-300 rounded-md py-1 px-3 bg-white shadow-inner mt-2"
//       rows="2"
//     />
//     <div className="absolute top-48 left-[50%] mt-3">
//      {errors.reason && (
//         <span className="text-red-500 text-xs">
//           {errors.reason}
//         </span>
//       )}
//     </div>
//   </div>
//   <div className="col-span-3 text-right mt-4">
//     <button
//       className="mr-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700"
//       onClick={handleSubmit}
//       // disabled={loadingForSearch}
//     >
//       Save
//     </button>
//   </div>
// </div>
