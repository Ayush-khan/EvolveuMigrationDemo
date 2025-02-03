// Try UP
import { useState, useEffect } from "react";
// import debounce from "lodash/debounce";
import LoaderStyle from "../../common/LoaderFinal/LoaderStyle";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
// import { RxCross1 } from "react-icons/rx";

const EditCastCertificate = () => {
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
    reg_no: "",
    date: "",
    stud_name: "",
    stud_id: "",
    student_id: "",
    // student_UID: "",
    father_name: "",
    mother_name: "",
    class_division: "",
    religion: "",
    caste: "",
    subcaste: "",
    birth_place: "",
    state: "",
    mother_tongue: "",
    dob: "",
    dob_words: "",
    nationality: "",
    prev_school_class: "",
    admission_date: "",
    class_when_learning: "",
    progress: "",
    behaviour: "",
    leaving_reason: "",
    lc_date_n_no: "",

    stu_aadhaar_no: "",
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
          `${API_URL}/api/get_datacastecertificate/${student?.sr_no}`,
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
            reg_no: fetchedData.reg_no || "",
            date: today || "", // Directly from the fetched data
            stud_name: `${fetchedData?.first_name || ""} ${
              fetchedData?.mid_name || ""
            } ${fetchedData?.last_name || ""}`,
            stud_id: fetchedData.stud_id || "",
            student_id: fetchedData.student_id || " ",
            father_name: fetchedData.father_name || "",
            mother_name: fetchedData.mother_name || "",
            class_division: fetchedData.class_division || " ",
            admission_date: fetchedData.admission_date || "",
            religion: fetchedData.religion || "",
            caste: fetchedData.caste || "",
            subcaste: fetchedData.subcaste || "",
            birth_place: fetchedData.birth_place || "", // Adjusted according to the fetched data
            state: fetchedData.state || "",
            mother_tongue: fetchedData.mother_tongue || "",
            dob: fetchedData.dob || "",
            dob_words: fetchedData.dob_words || " ",
            nationality: fetchedData.nationality || "",
            stu_aadhaar_no: fetchedData.stu_aadhaar_no || "",
            teacher_image_name: fetchedData.father_image_name || null, // Assuming this is for a teacher image
            purpose: fetchedData.purpose || " ",
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

  const validate = () => {
    const newErrors = {};

    // Mandatory fields validations
    const requiredFields = [
      "reg_no",
      "date",
      "stud_name",
      "stud_id",
      "father_name",
      "mother_name",
      "class_division",
      "birth_place",
      "state",
      "mother_tongue",
      "dob",
      "dob_words",
      "nationality",
      "prev_school_class",
      "admission_date",
      "class_when_learning",
      "progress",
      "behaviour",
      "leaving_reason",
      "lc_date_n_no",
      "stu_aadhaar_no",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `This field is required`;
      }
    });

    // Additional validations for specific fields
    if (formData.stud_name && /^\d/.test(formData.stud_name)) {
      newErrors.stud_name = "Student Name should not start with a number";
    }

    if (formData.father_name && /^\d/.test(formData.father_name)) {
      newErrors.father_name = "Father's Name should not start with a number";
    }

    if (formData.mother_name && /^\d/.test(formData.mother_name)) {
      newErrors.mother_name = "Mother's Name should not start with a number";
    }

    setErrors(newErrors);

    // Return true if no errors, false if errors exist
    return Object.keys(newErrors).length === 0;
  };

  // Handle change for form fields
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "dob" && { dob_words: convertDateToWords(value) }),
    }));

    let fieldErrors = {};

    // Individual field validation logic
    if (name === "stud_name" && /^\d/.test(value)) {
      fieldErrors.stud_name = "Student Name should not start with a number";
    }

    if (name === "father_name" && /^\d/.test(value)) {
      fieldErrors.father_name = "Father's Name should not start with a number";
    }

    if (name === "mother_name" && /^\d/.test(value)) {
      fieldErrors.mother_name = "Mother's Name should not start with a number";
    }

    // if (!value && requiredFields.includes(name)) {
    //   fieldErrors[name] = `${name.replace(/_/g, " ")} is required`;
    // }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: fieldErrors[name] }));
  };

  const formatDateString = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${year}-${month}-${day}`;
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
        `${API_URL}/api/update_castebonafidecertificate/${student?.sr_no}`,
        formattedFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Set response type to blob to handle PDF data
        }
      );

      if (response.status === 200) {
        toast.success("Cast Certificate updated successfully!");

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
          reg_no: "",
          date: "",
          stud_name: "",
          stud_id: "",
          student_id: "",
          father_name: "",
          mother_name: "",
          class_division: "",
          religion: "",
          caste: "",
          subcaste: "",
          birth_place: "",
          state: "",
          mother_tongue: "",
          dob: "",
          dob_words: "",
          nationality: "",
          prev_school_class: "",
          admission_date: "",
          class_when_learning: "",
          progress: "",
          behaviour: "",
          leaving_reason: "",
          lc_date_n_no: "",
          stu_aadhaar_no: "",
        });
        setSelectedClass(null); // Reset class selection
        setSelectedStudent(null); // Reset student selection
        setErrors({});
        setBackendErrors({});
        setTimeout(() => setParentInformation(null), 3000);

        // Navigate to the desired route after successful update
        navigate("/castCertificate");
      }
    } catch (error) {
      console.error("Error:", error.response.data, error.response.sr_no);
      toast.error("An error occurred while updating the Cast Certificate.");

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
    <div className=" w-full md:w-2/3  md:container mx-auto py-4 p-4 px-4  ">
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
            Edit Cast Certificate
          </h5>

          <RxCross1
            className="float-end relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
            onClick={() => {
              setErrors({});
              navigate("/castCertificate");
            }}
          />
        </div>
        <div
          className=" relative w-full   -top-6 h-1  mx-auto bg-red-700"
          style={{
            backgroundColor: "#C03078",
          }}
        ></div>
        <p className=" text-[.9em] md:absolute md:right-5  md:top-[5%]   text-gray-500 ">
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
              Document Information
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
                <label
                  htmlFor="reg_no"
                  className="block font-bold text-xs mb-2"
                >
                  General Register No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="reg_no"
                  name="reg_no"
                  maxLength={10}
                  value={formData.reg_no}
                  onChange={handleChange}
                  readOnly
                  className="block  border w-full border-gray-900 rounded-md py-1 px-3  bg-gray-200 outline-none shadow-inner"
                />
                {errors.reg_no && (
                  <span className="text-red-500 text-xs ml-2 h-1">
                    {errors.reg_no}
                  </span>
                )}
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
            </div>
          </fieldset>
          {/* Student Identity */}
          <fieldset className="mb-4">
            {/* <legend className="font-bold"> */}
            <h5 className="col-span-4 text-blue-400 py-2">Student Identity</h5>
            {/* </legend> */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  htmlFor="stud_id"
                  className="block font-bold text-xs mb-2"
                >
                  Student ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="stud_id"
                  name="stud_id"
                  maxLength={25}
                  value={formData.stud_id}
                  onChange={handleChange}
                  readOnly
                  className="block  border w-full border-gray-900 rounded-md py-1 px-3  bg-gray-200 outline-none shadow-inner"
                />
                {errors.stud_id && (
                  <span className="text-red-500 text-xs ml-2 h-1">
                    {errors.stud_id}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="stu_aadhaar_no"
                  className="block font-bold text-xs mb-2"
                >
                  Student UID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="stu_aadhaar_no"
                  name="stu_aadhaar_no"
                  maxLength={12}
                  value={formData.stu_aadhaar_no}
                  onChange={handleChange}
                  readOnly
                  className="block  border w-full border-gray-900 rounded-md py-1 px-3  bg-gray-200 outline-none shadow-inner"
                />
                {errors.stu_aadhaar_no && (
                  <span className="text-red-500 text-xs ml-2 h-1">
                    {errors.stu_aadhaar_no}
                  </span>
                )}
              </div>
            </div>
          </fieldset>
          {/* Parent Details */}
          <fieldset className="mb-4">
            {/* <legend className="font-bold"> */}
            <h5 className="col-span-4 text-blue-400 py-2">Parent Details</h5>
            {/* </legend> */}

            <div className="w-full md:w-[80%] grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="text-red-500 text-xs ml-2 ">
                    {errors.father_name}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="mother_name"
                  className="block font-bold text-xs mb-2"
                >
                  Mother's Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="mother_name"
                  name="mother_name"
                  maxLength={50}
                  value={formData.mother_name}
                  onChange={handleChange}
                  readOnly
                  className="block  border w-full border-gray-900 rounded-md py-1 px-3  bg-gray-200 outline-none shadow-inner"
                />
                {errors.mother_name && (
                  <span className="text-red-500 text-xs ml-2 h-1">
                    {errors.mother_name}
                  </span>
                )}
              </div>
            </div>
          </fieldset>
          {/* Academic Details */}
          <fieldset className="mb-4">
            {/* <legend className="font-bold"> */}
            <h5 className="col-span-4 text-blue-400 py-2">Academic Details</h5>
            {/* </legend> */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  onChange={handleChange}
                  readOnly
                  className="input-field block border w-full border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
                />
                {errors.class_division && (
                  <span className="text-red-500 text-xs ml-2 h-1">
                    {errors.class_division}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="religion"
                  className="block font-bold text-xs mb-2"
                >
                  Religion
                </label>
                <input
                  type="text"
                  id="religion"
                  name="religion"
                  maxLength={20}
                  value={formData.religion}
                  onChange={handleChange}
                  readOnly
                  className="block  border w-full border-gray-900 rounded-md py-1 px-3  bg-gray-200 outline-none shadow-inner"
                />
              </div>
              <div>
                <label htmlFor="caste" className="block font-bold text-xs mb-2">
                  Caste
                </label>
                <input
                  type="text"
                  id="caste"
                  name="caste"
                  maxLength={20}
                  value={formData.caste}
                  onChange={handleChange}
                  readOnly
                  className="block  border w-full border-gray-900 rounded-md py-1 px-3  bg-gray-200 outline-none shadow-inner"
                />
              </div>
              <div>
                <label
                  htmlFor="subcaste"
                  className="block font-bold text-xs mb-2"
                >
                  Sub-Caste
                </label>
                <input
                  type="text"
                  id="subcaste"
                  name="subcaste"
                  maxLength={100}
                  value={formData.subcaste}
                  onChange={handleChange}
                  className="input-field block border w-full border-gray-900 rounded-md py-1 px-3 bg-white shadow-inner"
                />
              </div>
            </div>
          </fieldset>
          {/* Personal Information */}
          <fieldset className="mb-4">
            {/* <legend className="font-bold"> */}
            <h5 className="col-span-4 text-blue-400 py-2">
              Personal Information
            </h5>
            {/* </legend> */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="birthPlace"
                  className="block font-bold text-xs mb-2"
                >
                  Birth Place <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="birthPlace"
                  maxLength={20}
                  name="birth_place"
                  value={formData.birth_place}
                  onChange={handleChange}
                  readOnly
                  className="block  border w-full border-gray-900 rounded-md py-1 px-3  bg-gray-200 outline-none shadow-inner"
                />
                {errors.birth_place && (
                  <span className="text-red-500 text-xs ml-2 h-1">
                    {errors.birth_place}
                  </span>
                )}
              </div>
              <div>
                <label htmlFor="state" className="block font-bold text-xs mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  maxLength={50}
                  value={formData.state}
                  onChange={handleChange}
                  readOnly
                  className="block  border w-full border-gray-900 rounded-md py-1 px-3  bg-gray-200 outline-none shadow-inner"
                />
                {errors.state && (
                  <span className="text-red-500 text-xs ml-2 h-1">
                    {errors.state}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="mother_tongue"
                  className="block font-bold text-xs mb-2"
                >
                  Mother Tongue <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="mother_tongue"
                  name="mother_tongue"
                  maxLength={50}
                  value={formData.mother_tongue}
                  onChange={handleChange}
                  readOnly
                  className="block  border w-full border-gray-900 rounded-md py-1 px-3  bg-gray-200 outline-none shadow-inner"
                />
                {errors.mother_tongue && (
                  <span className="text-red-500 text-xs ml-2 h-1">
                    {errors.mother_tongue}
                  </span>
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
                  <div className="text-red-500 text-xs ml-2 ">{errors.dob}</div>
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
                  <div className="text-red-500 text-xs ml-2 ">
                    {errors.dob_words}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="nationality"
                  className="block font-bold text-xs mb-2"
                >
                  Nationality <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nationality"
                  name="nationality"
                  maxLength={100}
                  value={formData.nationality}
                  onChange={handleChange}
                  readOnly
                  className="block  border w-full border-gray-900 rounded-md py-1 px-3  bg-gray-200 outline-none shadow-inner"
                />
                {errors.nationality && (
                  <span className="text-red-500 text-xs ml-2 h-1">
                    {errors.nationality}
                  </span>
                )}
              </div>
            </div>
          </fieldset>
          {/* Admission Details */}
          <fieldset className="mb-4">
            {/* <legend className="font-bold"> */}
            <h5 className="col-span-4 text-blue-400 py-2">Admission Details</h5>
            {/* </legend> */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="prev_school_class"
                  className="block font-bold text-xs mb-2"
                >
                  Previous School and Class{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="prev_school_class"
                  maxLength={100}
                  name="prev_school_class"
                  value={formData.prev_school_class}
                  onChange={handleChange}
                  className="input-field block border w-full border-gray-900 rounded-md py-1 px-3 bg-white shadow-inner"
                />
                {errors.prev_school_class && (
                  <span className="text-red-500 text-xs ml-2 h-1">
                    {errors.prev_school_class}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="admission_date"
                  className="block font-bold text-xs mb-2"
                >
                  Date of Admission <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="admission_date"
                  name="admission_date"
                  value={formData.admission_date}
                  onChange={handleChange}
                  readOnly
                  className="block  border w-full border-gray-900 rounded-md py-1 px-3  bg-gray-200 outline-none shadow-inner"
                />
                {errors.admission_date && (
                  <span className="text-red-500 text-xs ml-2 h-1">
                    {errors.admission_date}
                  </span>
                )}
              </div>
              <div className=" relative -top-4">
                <label
                  htmlFor="class_when_learning"
                  className="block font-bold text-xs mb-2 "
                >
                  In which class and when was he/she was learning from{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="class_when_learning"
                  maxLength={100}
                  name="class_when_learning"
                  value={formData.class_when_learning}
                  onChange={handleChange}
                  className="input-field block border w-full border-gray-900 rounded-md py-1 px-3 bg-white shadow-inner"
                />
                {errors.class_when_learning && (
                  <span className="text-red-500 text-xs ml-2 h-1">
                    {errors.class_when_learning}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="progress"
                  className="block font-bold text-xs mb-2"
                >
                  Progress Report <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="progress"
                  name="progress"
                  maxLength={200}
                  value={formData.progress}
                  onChange={handleChange}
                  className="input-field block border w-full border-gray-900 rounded-md py-1 px-3 bg-white shadow-inner"
                />
                {errors.progress && (
                  <span className="text-red-500 text-xs ml-2 h-1">
                    {errors.progress}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="behaviour"
                  className="block font-bold text-xs mb-2"
                >
                  Behavior <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="behaviour"
                  name="behaviour"
                  maxLength={200}
                  value={formData.behaviour}
                  onChange={handleChange}
                  className="input-field block border w-full border-gray-900 rounded-md py-1 px-3 bg-white shadow-inner"
                />
                {errors.behaviour && (
                  <span className="text-red-500 text-xs ml-2 h-1">
                    {errors.behaviour}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="leaving_reason"
                  className="block font-bold text-xs mb-2"
                >
                  Reason for Leaving <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="leaving_reason"
                  name="leaving_reason"
                  maxLength={100}
                  value={formData.leaving_reason}
                  onChange={handleChange}
                  className="input-field block border w-full border-gray-900 rounded-md py-1 px-3 bg-white shadow-inner"
                />
                {errors.leaving_reason && (
                  <span className="text-red-500 text-xs ml-2 h-1">
                    {errors.leaving_reason}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="lc_date_n_no"
                  className="block font-bold text-xs mb-2"
                >
                  Date of Leaving Certificate{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="lc_date_n_no"
                  name="lc_date_n_no"
                  value={formData.lc_date_n_no}
                  onChange={handleChange}
                  className="input-field block border w-full border-gray-900 rounded-md py-1 px-3 bg-white shadow-inner"
                />
                {errors.lc_date_n_no && (
                  <span className="text-red-500 text-xs ml-2 h-1">
                    {errors.lc_date_n_no}
                  </span>
                )}
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

export default EditCastCertificate;
