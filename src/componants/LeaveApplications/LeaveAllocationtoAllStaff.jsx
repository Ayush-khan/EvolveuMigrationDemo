import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";

function LeaveAllocationtoAllStaff() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [leaveType, setLeaveType] = useState([]);
  const [newLeaveType, setNewLeaveType] = useState(null); // ID of selected leave type
  const [newLeaveAllocated, setNewLeaveAllocated] = useState(""); // Allocated leave count
  const [fieldErrors, setFieldErrors] = useState({});

  const leaveOptions = useMemo(
    () =>
      leaveType.map((leave) => ({
        value: leave.leave_type_id,
        label: leave.name,
      })),
    [leaveType]
  );

  const handleLeaveSelect = (selectedOption) => {
    setFieldErrors((prev) => ({ ...prev, leave_type_id: "" }));
    setNewLeaveType(selectedOption ? selectedOption.value : null);
  };

  const handleAllocatedLeaveChange = (e) => {
    setFieldErrors((prev) => ({ ...prev, leave_allocated: "" }));
    setNewLeaveAllocated(e.target.value);
  };

  // fetch leave type
  const fetchLeaveType = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await axios.get(`${API_URL}/api/get_leavetype`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(response.data.data)) {
        setLeaveType(response.data.data);
      } else {
        throw new Error("Unexpected data format received from API.");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch leave types.");
    } finally {
      setLoading(false);
    }
  };

  // handle submit for to save the leave alllocation for all staff
  const handleSubmit = async () => {
    const errors = {};

    if (!newLeaveType) errors.leave_type_id = "Please select a leave type.";
    if (!newLeaveAllocated || isNaN(newLeaveAllocated)) {
      errors.leave_allocated = "Please enter a valid leave allocation.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found.");

      console.log("token", token);

      const response = await axios.post(
        `${API_URL}/api/save_leaveallocationforallstaff`,
        {
          leave_type_id: newLeaveType,
          leaves_allocated: newLeaveAllocated,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { data } = response;

      if (!data.success) {
        console.log("Leave Allocation is already present.");
        toast.error("Leave allocation is already present.");
      } else {
        console.log("Leave Allocation Sccessfully!");
        toast.success("Leave allocated successfully!");
      }
    } catch (error) {
      toast.error(error.message || "Failed to allocate leave.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchLeaveType();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="md:mx-auto md:w-[70%] p-4 bg-white mt-4">
        <div className="flex justify-between ">
          <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl">
            Leave Allocation to All Staff
          </h3>
          <RxCross1
            className="relative top-2 right-2  text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
            type="button"
            // className="btn-close text-red-600"
            onClick={() => navigate(-1)}
          />
        </div>
        <div
          className="relative mb-8 h-1 mx-auto"
          style={{ backgroundColor: "#C03078" }}
        ></div>
        <div className="bg-white w-full md:w-[95%] mx-auto rounded-md">
          <div className="border border-pink-500 p-3 rounded-lg shadow-md">
            <div className="w-full flex flex-col md:flex-row gap-x-8">
              <div className="w-full flex flex-col md:flex-row my-4 gap-x-4">
                <label htmlFor="leaveType" className="mr-2 ml-4 pt-2">
                  Leave Type <span className="text-red-500">*</span>
                </label>
                <div className="w-[60%] md:w-[50%]">
                  <Select
                    value={leaveOptions.find(
                      (option) => option.value === newLeaveType
                    )}
                    onChange={handleLeaveSelect}
                    options={leaveOptions}
                    placeholder="Select"
                    isSearchable
                    isClearable
                  />
                  {fieldErrors.leave_type_id && (
                    <div className="text-danger text-sm mt-1">
                      {fieldErrors.leave_type_id}
                    </div>
                  )}
                </div>
              </div>
              <div className="relative w-full  flex flex-col md:flex-row my-4 gap-x-4">
                <label htmlFor="leaveAllocated" className="mr-2 pt-2">
                  Leave Allocated <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newLeaveAllocated}
                  onChange={handleAllocatedLeaveChange}
                  className="h-10 text-gray-600 p-1 border-1 border-gray-300 outline-blue-400 rounded-md w-[60%] md:w-[55%] "
                  placeholder=""
                />

                {fieldErrors.leave_allocated && (
                  <div className="absolute top-9 md:left-[37%]  block text-danger text-sm mt-1">
                    {fieldErrors.leave_allocated}
                  </div>
                )}
              </div>{" "}
            </div>
            <div className=" flex justify-end text-center mt-10 w-full  ">
              <button
                className="mr-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700"
                onClick={() => {
                  setNewLeaveType(null);
                  setNewLeaveAllocated("");
                  setFieldErrors({});
                }}
              >
                Reset
              </button>{" "}
              <button
                className="mr-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                Save
              </button>
              {/* <button
                className="mr-2 bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-700"
                onClick={() => navigate(-1)}
              >
                Back
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LeaveAllocationtoAllStaff;
