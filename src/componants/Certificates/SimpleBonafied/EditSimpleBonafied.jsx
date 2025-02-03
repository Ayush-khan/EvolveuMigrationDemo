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

const EditSimpleBonafied = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [parentInformation, setParentInformation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingForSearchAcy, setLoadingForSearchAcy] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { student } = location.state || {};
  const [formData, setFormData] = useState({
    sr_no: "",
    stud_name: "",
    dob: "",
    date: "",
    father_name: "",
    class_division: "",
    professional_qual: "",
    trained: "",
    experience: "",

    religion: "",
    dob_words: "",

    stud_id: "",

    // purpose: " ",
    teacher_image_name: null,
  });

  // Fetch initial data on component load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true); // Start loading
        const token = localStorage.getItem("authToken");

        if (!token) throw new Error("No authentication token found");

        const response = await axios.get(
          `${API_URL}/api/get_datasimplebonafidestudent/${student?.sr_no}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response?.data?.data) {
          const fetchedData = response.data.data; // Extract the data

          setParentInformation(fetchedData); // Assuming response data contains form data

          // Populate formData with the fetched data
          setFormData({
            sr_no: fetchedData.sr_no || "",
            stud_name: fetchedData.stud_name || "",
            dob: fetchedData.dob || "",
            dob_words: fetchedData.dob_words || " ",

            // dob_words: convertDateToWords(fetchedData?.dob),
            date: today || "",
            father_name: fetchedData.father_name || "",
            class_division: fetchedData.class_division || "",
            stud_id: fetchedData.stud_id || "",
            issue_date_bonafide: fetchedData.issue_date_bonafide || "",
            academic_yr: fetchedData.academic_yr || "",
            IsGenerated: fetchedData.IsGenerated || "",
            IsDeleted: fetchedData.IsDeleted || "",
            IsIssued: fetchedData.IsIssued || "",
            issued_date: fetchedData.issued_date || "",
            deleted_date: fetchedData.deleted_date || "",
            generated_by: fetchedData.generated_by || "",
            issued_by: fetchedData.issued_by || "",
            deleted_by: fetchedData.deleted_by || "",
          });
        } else {
          toast.error("Failed to load data");
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Error fetching initial data");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchInitialData();
  }, []);

  const getYearInWords = (year) => {
    if (year < 1000 || year > 9999) return "Year Out of Range"; // Optional range limit

    const thousands = [
      "",
      "One Thousand",
      "Two Thousand",
      "Three Thousand",
      "Four Thousand",
      "Five Thousand",
      "Six Thousand",
      "Seven Thousand",
      "Eight Thousand",
      "Nine Thousand",
    ];
    const hundreds = [
      "",
      "One Hundred",
      "Two Hundred",
      "Three Hundred",
      "Four Hundred",
      "Five Hundred",
      "Six Hundred",
      "Seven Hundred",
      "Eight Hundred",
      "Nine Hundred",
    ];
    const units = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const thousandDigit = Math.floor(year / 1000);
    const hundredDigit = Math.floor((year % 1000) / 100);
    const lastTwoDigits = year % 100;

    const thousandsPart = thousands[thousandDigit];
    const hundredsPart = hundreds[hundredDigit];

    let lastTwoWords;
    if (lastTwoDigits < 10) {
      lastTwoWords = units[lastTwoDigits];
    } else if (lastTwoDigits < 20) {
      lastTwoWords = teens[lastTwoDigits - 10];
    } else {
      lastTwoWords = `${tens[Math.floor(lastTwoDigits / 10)]} ${
        units[lastTwoDigits % 10]
      }`;
    }

    return `${thousandsPart} ${hundredsPart} ${lastTwoWords}`.trim();
  };

  const getDayInWords = (day) => {
    const dayWords = [
      "First",
      "Second",
      "Third",
      "Fourth",
      "Fifth",
      "Sixth",
      "Seventh",
      "Eighth",
      "Ninth",
      "Tenth",
      "Eleventh",
      "Twelfth",
      "Thirteenth",
      "Fourteenth",
      "Fifteenth",
      "Sixteenth",
      "Seventeenth",
      "Eighteenth",
      "Nineteenth",
      "Twentieth",
      "Twenty-First",
      "Twenty-Second",
      "Twenty-Third",
      "Twenty-Fourth",
      "Twenty-Fifth",
      "Twenty-Sixth",
      "Twenty-Seventh",
      "Twenty-Eighth",
      "Twenty-Ninth",
      "Thirtieth",
      "Thirty-First",
    ];
    return dayWords[day];
  };

  const convertDateToWords = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    return `${getDayInWords(day)} ${month} ${getYearInWords(year)}`;
  };

  // for form
  const [errors, setErrors] = useState({});
  const [backendErrors, setBackendErrors] = useState({});

  // Maximum date for date_of_birth
  const MAX_DATE = "2030-12-31";
  const MIN_DATE = "1996-01-01";
  // Get today's date in YYYY-MM-DD format
  // Calculate today's date
  const today = new Date().toISOString().split("T")[0];

  // For FOrm
  const validate = () => {
    const newErrors = {};

    // Validate name
    if (!formData.stud_name) newErrors.stud_name = "Thid field is required";
    else if (!/^[^\d].*/.test(formData.stud_name))
      newErrors.stud_name = "Name should not start with a number";

    // Validate name
    if (!formData.father_name) newErrors.father_name = "Thid field is required";
    else if (!/^[^\d].*/.test(formData.father_name))
      newErrors.father_name = "Name should not start with a number";
    // Validate academic qualifications (now a single text input)
    if (!formData.class_division)
      newErrors.class_division = "Thid field is required";
    if (!formData.sr_no) newErrors.sr_no = "Thid field is required";

    // Validate dob
    if (!formData.dob) newErrors.dob = "Thid field is required";
    if (!formData.father_name) newErrors.father_name = "Thid field is required";

    // Validate date of joining
    if (!formData.date) newErrors.date = "Thid field is required";

    // Validate Employee Id
    // if (!formData.purpose) newErrors.purpose = "purpose is required";
    // Validate address
    if (!formData.dob_words) newErrors.dob_words = "Thid field is required";

    setErrors(newErrors);
    return newErrors;
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    let newValue = value;

    if (name === "dob") {
      setFormData((prev) => ({
        ...prev,
        dob: value,
        dob_words: convertDateToWords(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Update formData for the field
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));

    // Field-specific validation
    let fieldErrors = {};

    // Name validation
    if (name === "stud_name") {
      if (!newValue) fieldErrors.stud_name = "Thid field is required";
      else if (/^\d/.test(newValue))
        fieldErrors.stud_name = "Name should not start with a number";
    }
    if (name === "father_name") {
      if (!newValue) fieldErrors.father_name = "Thid field is required";
      else if (/^\d/.test(newValue))
        fieldErrors.father_name = "Name should not start with a number";
    }

    // Academic Qualification validation
    if (name === "class_division") {
      if (!newValue) fieldErrors.class_division = "Thid field is required";
    }

    // Date of Birth validation
    if (name === "dob") {
      if (!newValue) fieldErrors.dob = "Thid field is required";
    }
    // serial number

    if (name === "sr_no") {
      if (!newValue) fieldErrors.sr_no = "Thid field is required";
    }
    if (name === "father_name") {
      if (!newValue) fieldErrors.father_name = "Thid field is required";
    }

    // Date of Joining validation
    if (name === "date") {
      if (!newValue) fieldErrors.date = "Thid field is required";
    }

    // Employee ID validation
    // if (name === "purpose") {
    //   if (!newValue) fieldErrors.purpose = "Purpose  is required";
    // }

    // Address validation
    if (name === "dob_words") {
      if (!newValue) fieldErrors.dob_words = "Thid field is required";
    }

    // Update the errors state with the new field errors
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldErrors[name],
    }));
  };

  const formatDateString = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };

  // Inside your component
  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    const errorsToCheck = validationErrors || {};

    if (Object.keys(errorsToCheck).length > 0) {
      setErrors(errorsToCheck);
      return;
    }

    const formattedFormData = {
      ...formData,
      dob: formatDateString(formData.dob),
      date: formatDateString(formData.date),
    };

    try {
      setLoading(true); // Start loading

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token is found");
      }

      // Make an API call with the "blob" response type to download the PDF
      const response = await axios.put(
        `${API_URL}/api/update_simplebonafidecertificate/${student?.sr_no}`,
        formattedFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Set response type to blob to handle PDF data
        }
      );

      if (response.status === 200) {
        toast.success("Simple Bonafide Certificate updated successfully!");

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

          // Add other fields here if needed
        });
        setSelectedClass(null); // Reset class selection
        setSelectedStudent(null); // Reset student selection
        setErrors({});
        setBackendErrors({});
        setTimeout(() => setParentInformation(null), 3000);

        // Navigate to the desired route after successful update
        navigate("/simpleBonafied");
      }
    } catch (error) {
      console.error("Error:", error.response.data, error.response.sr_no);
      toast.error("An error occurred while updating the Bonafide Certificate.");

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
            Edit Simple Bonafied Certificate
          </h5>

          <RxCross1
            className="float-end relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
            onClick={() => {
              setErrors({});
              navigate("/simpleBonafied");
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
          className="  border-1 overflow-x-hidden shadow-md p-2 bg-gray-100 mb-4"
        >
          <div className=" flex flex-col gap-4 md:grid  md:grid-cols-3 md:gap-x-14 md:mx-10 gap-y-1 pt-4 pb-4">
            <div className=" ">
              <label htmlFor="sr_no" className="block font-bold  text-xs mb-2">
                Sr No. <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={100}
                id="sr_no"
                name="sr_no"
                readOnly
                value={formData.sr_no}
                onChange={handleChange}
                className="block  border w-full border-gray-900 rounded-md py-1 px-3  bg-gray-200 outline-none shadow-inner"
              />
              {backendErrors.sr_no && (
                <span className="text-red-500 text-xs ml-2">
                  {backendErrors.sr_no}
                </span>
              )}
              {errors.sr_no && (
                <div className="text-red-500 text-xs ml-2">{errors.sr_no}</div>
              )}
            </div>
            <div>
              <label
                htmlFor="date_of_joining"
                className="block font-bold  text-xs mb-2"
              >
                Issue Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date_of_joining"
                // max={today}
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input-field block w-full border border-gray-900 rounded-md py-1 px-3 bg-white shadow-inner"
              />
              {errors.date && (
                <span className="text-red-500 text-xs ml-2">{errors.date}</span>
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
                <div className="text-red-500 text-xs ml-2">
                  {errors.stud_name}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="father_name"
                className="block font-bold  text-xs mb-2"
              >
                Father's Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={50}
                id="father_name"
                name="father_name"
                value={formData.father_name}
                onChange={handleChange}
                readOnly
                className="block  border w-full border-gray-900 rounded-md py-1 px-3  bg-gray-200 outline-none shadow-inner"
              />
              {errors.father_name && (
                <div className="text-red-500 text-xs ml-2">
                  {errors.father_name}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="dob" className="block font-bold text-xs mb-2">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="dob"
                min={MIN_DATE} // Set minimum date
                max={MAX_DATE} // Set maximum date to today
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                readOnly
                className="block  border w-full border-gray-900 rounded-md py-1 px-3  bg-gray-200 outline-none shadow-inner"
              />
              {errors.dob && (
                <div className="text-red-500 text-xs ml-2">{errors.dob}</div>
              )}
            </div>

            <div>
              <label
                htmlFor="dob_words"
                className="block font-bold  text-xs mb-2"
              >
                Birth date in words <span className="text-red-500">*</span>
              </label>
              <textarea
                type="text"
                maxLength={100}
                id="dob_words"
                name="dob_words"
                value={formData.dob_words}
                onChange={handleChange}
                readOnly
                className="block  border w-full border-gray-900 rounded-md py-1 px-3  bg-gray-200 outline-none shadow-inner"
              />
              {errors.dob_words && (
                <div className="text-red-500 text-xs ml-2">
                  {errors.dob_words}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="class_division"
                className="block font-bold  text-xs mb-2"
              >
                Class/Divsion <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                // maxLength={12}
                id="class_division"
                readOnly
                name="class_division"
                value={formData.class_division}
                onChange={handleChange} // Using the handleChange function to update formData and validate
                className="input-field block w-full outline-none border border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
              />
              {errors.class_division && (
                <span className="text-red-500 text-xs ml-2">
                  {errors.class_division}
                </span>
              )}
            </div>

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
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSimpleBonafied;
