// Try UP
import { useState, useEffect, useMemo } from "react";
// import debounce from "lodash/debounce";
import LoaderStyle from "../../common/LoaderFinal/LoaderStyle";
import axios from "axios";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
// import { RxCross1 } from "react-icons/rx";

const EditPercentage = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [selectedClass, setSelectedClass] = useState(null);
  const [parentInformation, setParentInformation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingForSearchAcy, setLoadingForSearchAcy] = useState(false);

  const [marks, setMarks] = useState({});
  const [total, setTotal] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { student } = location.state || {};
  const [formData, setFormData] = useState({
    sr_no: "",
    roll_no: "",
    date: "",
    stud_name: "",
    stud_id: "",
    // student_UID: "",
    class_division: "",

    teacher_image_name: null,
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");

        if (!token) throw new Error("No authentication token found");

        const response = await axios.get(
          `${API_URL}/api/get_percentageData/${student?.sr_no}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response?.data?.data) {
          const fetchedData = response.data.data;
          const initialMarks = {};

          // Initialize marks from the fetched data
          fetchedData.classsubject.forEach((subject) => {
            initialMarks[subject.c_sm_id] = subject.marks || "";
          });

          setMarks(initialMarks);
          setFormData({
            ...formData,
            classsubject: fetchedData.classsubject || [],
            sr_no: fetchedData?.studentinfo?.sr_no || "",
            roll_no: fetchedData.studentinformation.roll_no || "",
            date: today || "",
            stud_name: `${fetchedData.studentinformation?.first_name || ""} ${
              fetchedData.studentinformation?.mid_name || ""
            } ${fetchedData.studentinformation?.last_name || ""}`,
            stud_id: fetchedData.studentinformation.student_id || " ",
            class_division:
              `${fetchedData.studentinformation.classname}-${fetchedData.studentinformation.sectionname}` ||
              "",
          });

          calculateTotalAndPercentage(initialMarks); // Initial calculation
        } else {
          toast.error("Failed to load data");
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Error fetching initial data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Update total and percentage dynamically
  const calculateTotalAndPercentage = (marks) => {
    const marksValues = Object.values(marks)
      .filter((value) => value !== "" && !isNaN(value)) // Exclude empty or non-numeric values
      .map(Number); // Convert to numbers

    const totalMarks = marksValues.reduce((sum, mark) => sum + mark, 0);
    const percentage = marksValues.length
      ? (totalMarks / (marksValues.length * 100)) * 100
      : 0;

    setTotal(totalMarks);
    setPercentage(percentage.toFixed(2)); // Limit to two decimal places
  };
  // Handle change for marks input
  const handleMarksChange = (subjectId, value) => {
    // Update the errors state based on validation
    if (!value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [subjectId]: "Marks are required.",
      }));
    } else if (!/^\d+$/.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [subjectId]: "Marks should be numeric.",
      }));
    } else if (value.length > 3) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [subjectId]: "Marks cannot exceed 3 characters.",
      }));
    } else {
      // Remove the error if input is valid
      setErrors((prevErrors) => ({
        ...prevErrors,
        [subjectId]: "",
      }));
    }

    // Update the specific mark in the state
    setMarks((prevMarks) => {
      const updatedMarks = { ...prevMarks, [subjectId]: value };
      calculateTotalAndPercentage(updatedMarks); // Recalculate each time a mark changes
      return updatedMarks;
    });
  };

  // for form
  const [errors, setErrors] = useState({});
  const [backendErrors, setBackendErrors] = useState({});

  // Get today's date in YYYY-MM-DD format
  // Calculate today's date
  const today = new Date().toISOString().split("T")[0];

  // Handle change for form fields
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    let fieldErrors = {};

    // Individual field validation logic
    if (name === "stud_name") {
      if (!value) {
        fieldErrors.stud_name = "Student name is required";
      } else if (/^\d/.test(value)) {
        fieldErrors.stud_name = "Student name should not start with a number";
      }
    }

    // Required fields list
    const requiredFields = [
      "roll_no",
      "date",
      //   "stud_name",
      "class_division",
      "roll_no",
    ];

    // Check if the field is required and empty
    if (!value && requiredFields.includes(name)) {
      fieldErrors[name] = `This field is required`;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: fieldErrors[name] }));
  };

  const validate = () => {
    const newErrors = {};

    // Required fields validation with error messages
    const requiredFields = [
      "roll_no",
      "date",
      "stud_name",
      "class_division",
      "roll_no",
      //   "stud_id",
    ];

    // Check for empty required fields
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `This field is required.`;
      }
    });

    // Validate marks for each subject
    formData.classsubject?.forEach((subject) => {
      const markValue = marks[subject.c_sm_id];
      console.log("marks", markValue);

      if (markValue === undefined || markValue === "" || markValue === 0) {
        newErrors[subject.c_sm_id] = `Marks are required.`;
      } else if (isNaN(markValue)) {
        newErrors[subject.c_sm_id] = `Marks should be numeric.`;
      } else if (parseFloat(markValue) > 100 || parseFloat(markValue) < 1) {
        newErrors[
          subject.c_sm_id
        ] = `${subject.name} Marks should not exceed 100.`;
        //  `${subject.name} Marks should not exceed 100.
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const prepareSubmissionData = () => {
    const formattedMarks = Object.entries(marks).map(([id, mark]) => ({
      c_sm_id: parseInt(id),
      marks: parseInt(mark),
    }));

    const submissionData = {
      roll_no: formData.roll_no,
      stud_name: formData.stud_name,
      class_division: formData.class_division,
      percentage,
      total,
      stud_id: formData.stud_id,
      class: formattedMarks,
      date: today,
    };

    return submissionData;
  };
  // Inside your component
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submit process started");

    // Clear previous errors
    setErrors({});
    setBackendErrors({});

    // Check validation
    if (!validate()) {
      console.log("Validation failed, stopping submission");
      return;
    }

    console.log("Validation passed, proceeding with submission");

    const dataToSubmit = prepareSubmissionData();
    console.log("dataTosubmkit", dataToSubmit);

    try {
      setLoading(true); // Start loading

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token is found");
      }

      // Make an API call with the "blob" response type to download the PDF
      const response = await axios.put(
        `${API_URL}/api/update_percentagePDF/${student?.sr_no}`,
        dataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Set response type to blob to handle PDF data
        }
      );

      if (response.status === 200) {
        toast.success("Percentage Certificate updated successfully!");

        // Extract filename from Content-Disposition header
        const contentDisposition = response.headers["content-disposition"];
        let filename = "DownloadedFile.pdf"; // Fallback name

        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+?)"/);
          if (match && match[1]) {
            filename = match[1];
          }
        }

        // Create a URL for the PDF blob and initiate download
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Reset form data and selected values after successful submission
        setFormData({
          sr_no: "",
          stud_name: "",
          father_name: "",
          dob: "",
          dob_words: "",
          date: "",
          class_division: "",
          purpose: "",
          nationality: "",

          // Add other fields here if needed
        });
        // Reset form data
        setFormData({
          sr_no: "",
          roll_no: "",
          date: "",
          stud_name: "",
          stud_id: "",
          class_division: "",
        });
        setMarks({});
        setTotal(0);
        setPercentage(0);
        setSelectedClass(null);
        // setSelectedStudent(null);

        setTimeout(() => setParentInformation(null), 3000);

        // Navigate to the desired route after successful update
        navigate("/percentageCertificate");
      }
    } catch (error) {
      console.error("Error:", error.response.data, error.response.sr_no);
      toast.error(
        "An error occurred while updating the Percentage Certificate."
      );

      if (error.response && error.response) {
        setBackendErrors(error.response || {});
      } else {
        toast.error(error.response.sr_no);
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className=" w-full  md:container mx-auto py-4 p-4 px-4  ">
      <ToastContainer />
      {loading && (
        <div className="fixed  inset-0 z-50   flex items-center justify-center bg-gray-700 bg-opacity-50">
          <LoaderStyle />
        </div>
      )}{" "}
      <div className="    card  px-3 rounded-md ">
        {/* <div className="card p-4 rounded-md "> */}
        <div className=" card-header mb-4 flex justify-between items-center  ">
          <h5 className="text-gray-700 mt-1 text-md lg:text-lg">
            Edit Percentage Certificate
          </h5>

          <RxCross1
            className="float-end relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
            onClick={() => {
              setErrors({});
              navigate("/percentageCertificate");
            }}
          />
        </div>
        <div
          className=" relative w-full   -top-6 h-1  mx-auto bg-red-700"
          style={{
            backgroundColor: "#C03078",
          }}
        ></div>
        <p className=" text-[.9em] md:absolute md:right-8  md:top-[15%]   text-gray-500 ">
          <span className="text-red-500 ">*</span>indicates mandatory
          information
        </p>
        {loadingForSearchAcy && (
          <div className="fixed  inset-0 z-50   flex items-center justify-center bg-gray-700 bg-opacity-50">
            <LoaderStyle />
          </div>
        )}{" "}
        <form
          onSubmit={handleSubmit}
          className=" w-full gap-x-1 md:gap-x-14  gap-y-1   overflow-x-hidden shadow-md p-4 border-1 bg-gray-100 mb-4"
        >
          {/* Document Information */}
          <fieldset className="mb-4">
            <h5 className="col-span-4 text-blue-400 pb-2">
              {/* <legend className="font-semibold text-[1.2em]"> */}
              Student Details
              {/* </legend> */}
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="sr_no" className="block font-bold text-xs mb-2">
                  Sr No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="sr_no"
                  name="sr_no"
                  value={formData.sr_no}
                  readOnly
                  className="input-field block border w-full border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
                />
              </div>
              <div>
                <label htmlFor="date" className="block font-bold text-xs mb-2">
                  Issue Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="input-field block border w-full border-gray-900 rounded-md py-1 px-3 bg-white shadow-inner"
                />
                {errors.date && (
                  <span className="text-red-500 text-xs ml-2 h-1">
                    {errors.date}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="roll_no"
                  className="block font-bold text-xs mb-2"
                >
                  Roll No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="roll_no"
                  name="roll_no"
                  maxLength={10}
                  value={formData.roll_no}
                  onChange={handleChange}
                  readOnly
                  className="block  border w-full border-gray-900 rounded-md py-1 px-3  bg-gray-200 outline-none shadow-inner"
                />
                {errors.roll_no && (
                  <span className="text-red-500 text-xs ml-2 h-1">
                    {errors.roll_no}
                  </span>
                )}
              </div>

              <div className=" ">
                <label
                  htmlFor="staffName"
                  className="block font-bold  text-xs mb-2"
                >
                  Student Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={200}
                  id="staffName"
                  name="stud_name"
                  value={formData.stud_name}
                  onChange={handleChange}
                  readOnly
                  className="block  border w-full border-gray-900 rounded-md py-1 px-3  bg-gray-200 outline-none shadow-inner"
                />
                {errors.stud_name && (
                  <div className="text-red-500 text-xs ml-2 ">
                    {errors.stud_name}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="class_division"
                  className="block font-bold text-xs mb-2"
                >
                  Class/Division <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="class_division"
                  name="class_division"
                  value={formData.class_division}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      class_division: e.target.value,
                    })
                  }
                  readOnly
                  className="input-field block border w-full border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
                />
                {errors.class_division && (
                  <span className="text-red-500 text-xs ml-2 h-1">
                    {errors.class_division}
                  </span>
                )}
              </div>
            </div>
          </fieldset>
          {/* Student Identity */}

          {/* Parent Details */}

          <fieldset className="mb-4">
            <h5 className="col-span-4 text-blue-400 py-2">
              Academic Performance
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formData.classsubject?.map((subject) => (
                <div key={subject.c_sm_id}>
                  <label
                    htmlFor={`subject-${subject.c_sm_id}`}
                    className="block font-bold text-xs mb-2"
                  >
                    {subject.name} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id={`subject-${subject.c_sm_id}`}
                    name={`subject-${subject.c_sm_id}`}
                    value={marks[subject.c_sm_id] || ""}
                    onChange={(e) =>
                      handleMarksChange(subject.c_sm_id, e.target.value)
                    }
                    maxLength={3}
                    className="block border w-full border-gray-900 rounded-md py-1 px-3 bg-white shadow-inner"
                  />
                  {errors[subject.c_sm_id] && (
                    <span className="text-red-500 text-xs ml-2">
                      {errors[subject.c_sm_id]}
                    </span>
                  )}
                </div>
              ))}

              {/* Total and Percentage Fields */}
              <div>
                <label htmlFor="total" className="block font-bold text-xs mb-2">
                  Total
                </label>
                <input
                  type="number"
                  id="total"
                  name="total"
                  value={total}
                  readOnly
                  className="input-field block border w-full border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
                />
              </div>

              <div>
                <label
                  htmlFor="percentage"
                  className="block font-bold text-xs mb-2"
                >
                  Percentage
                </label>
                <input
                  type="number"
                  id="percentage"
                  name="percentage"
                  value={percentage}
                  readOnly
                  className="input-field block border w-full border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
                />
              </div>
            </div>
          </fieldset>

          <div className="col-span-3 text-right">
            <button
              type="submit"
              onClick={handleSubmit}
              style={{ backgroundColor: "#2196F3" }}
              className={`text-white font-bold py-1 border-1 border-blue-500 px-4 rounded ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-4 w-4 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPercentage;
