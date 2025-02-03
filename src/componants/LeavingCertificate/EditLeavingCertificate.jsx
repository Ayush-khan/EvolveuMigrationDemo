// Try UP
import { useState, useEffect, useMemo } from "react";
// import debounce from "lodash/debounce";
import LoaderStyle from "../../componants/common/LoaderFinal/LoaderStyle";
import axios from "axios";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
// import { RxCross1 } from "react-icons/rx";

const EditLeavingCertificate = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [nameError, setNameError] = useState("");
  const [nameErrorForClass, setNameErrorForClass] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [parentInformation, setParentInformation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingForSearch, setLoadingForSearch] = useState(false);
  const [loadingForSearchAcy, setLoadingForSearchAcy] = useState(false);

  const [selectedActivities, setSelectedActivities] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { student } = location.state || {};
  const [formData, setFormData] = useState({
    sr_no: "",
    class_id: "",
    grn_no: "",
    date: "",
    first_name: "",
    mid_name: "",
    last_name: "",
    udise_pen_no: "",
    student_id_no: "",
    promoted_to: " ",
    last_exam: "",
    stud_id: "",
    // student_UID: "",
    father_name: "",
    mother_name: "",
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
    date_of_admission: "",
    admission_class: "",
    attendance: "",
    subjectsFor: [],
    subjects: [],

    reason_leaving: "",
    application_date: "",
    leaving_date: "",
    standard_studying: "",
    dob_proof: "",
    class_id_for_subj: "",
    aadhar_no: "",
    teacher_image_name: null,
    academicStudent: [],
    academic_yr: "", // Add this to track selected academic year
    part_of: "",
    // games: "",
    selectedActivities: [],
  });

  // Fetch initial data on component load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true); // Start loading
        const token = localStorage.getItem("authToken");

        if (!token) throw new Error("No authentication token found");

        const response = await axios.get(
          `${API_URL}/api/get_getleavingcertificatedata/${student?.sr_no}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success && response.data.data) {
          const fetchedData = response.data.data.leavingcertificatesingle;
          const DataStudentAc = response.data.data;
          // Update formData with the fetched data
          // Inside useEffect, after fetching data and setting formData
          const { subjects_studied, games } =
            response.data.data.leavingcertificatesingle;
          const classsubject = response.data.data.classsubject;
          // Convert comma-separated strings to arrays
          const selectedSubjects = subjects_studied
            ? subjects_studied.split(",")
            : [];
          const selectedActivities = games ? games.split(",") : [];
          setFormData({
            sr_no: fetchedData.sr_no || "",
            student_id: fetchedData.student_id || "",
            grn_no: fetchedData.grn_no || "",
            academicStudent: DataStudentAc.academicStudent || [],
            issue_date: fetchedData.issue_date || "",
            student_id_no: fetchedData.stud_id_no || "",
            aadhar_no: fetchedData.aadhar_no || "",
            first_name: fetchedData.stud_name || "",
            mid_name: fetchedData.mid_name || "",
            last_name: fetchedData.last_name || "",
            father_name: fetchedData.father_name || "",
            mother_name: fetchedData.mother_name || "",
            nationality: fetchedData.nationality || "",
            mother_tongue: fetchedData.mother_tongue || "",
            religion: fetchedData.religion || "",
            caste: fetchedData.caste || "",
            subcaste: fetchedData.subcaste || "",
            birth_place: fetchedData.birth_place || "",
            state: fetchedData.state || "",
            dob: fetchedData.dob || "",
            dob_words: fetchedData.dob_words || "",
            prev_school_class: fetchedData.last_school_attended_standard || "",
            date_of_admission: fetchedData.date_of_admission || "",
            admission_class: fetchedData.admission_class || "",
            attendance: fetchedData.attendance || "",
            reason_leaving: fetchedData.reason_leaving || "",
            application_date: fetchedData.application_date || "",
            leaving_date: fetchedData.leaving_date || "",
            standard_studying: fetchedData.standard_studying || "",
            dob_proof: fetchedData.dob_proof || "",
            promoted_to: fetchedData.promoted_to || "",
            last_exam: fetchedData.last_exam || "",
            udise_pen_no: fetchedData.udise_pen_no || "",
            part_of: fetchedData.part_of || "",
            remark: fetchedData.remark || "",
            academic_yr: fetchedData.academic_yr || "",
            conduct: fetchedData.conduct || "",
            fee_month: fetchedData.fee_month || "",
            subjects: DataStudentAc.classsubject || [],
            // selectedActivities: (fetchedData.games || "").split(","),
            subjectsFor: classsubject, // All subjects to display
            selectedSubjects: selectedSubjects, // Only selected subjects checked
            selectedActivities: selectedActivities, // Only selected activities checked
          });
          toast.success("Data loaded successfully");
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

  // for student and class dropdown

  //   const handleSearch = async () => {
  //     setNameError("");
  //     setNameErrorForClass("");
  //     setErrors({}); // Clears all field-specific errors

  //     if (!selectedClass && !selectedStudent) {
  //       setNameError("Please select at least one of them.");
  //       toast.error("Please select at least one of them!");
  //       return;
  //     }

  //     setFormData({
  //       grn_no: "",
  //       class_id: "",
  //       issue_date: "",
  //       student_id_no: "",
  //       aadhar_no: "",
  //       first_name: "",
  //       mid_name: "",
  //       last_name: "",
  //       father_name: "",
  //       mother_name: "",
  //       nationality: "",
  //       mother_tongue: "",
  //       religion: "",
  //       caste: "",
  //       subcaste: "",
  //       birth_place: "",
  //       dob: "",
  //       dob_words: "",
  //       dob_proof: "",
  //       prev_school_class: "",
  //       // previous_school_attended: "",
  //       date_of_admission: "",
  //       admission_class: "",
  //       leaving_date: "",
  //       standard_studying: "",
  //       last_exam: "",
  //       subjects: [], // Empty array for selected subjects
  //       promoted_to: "",
  //       attendance: "",
  //       fee_month: "",
  //       part_of: "",
  //       selectedActivities: [], // Empty array for selected activities
  //       application_date: "",
  //       conduct: "",
  //       reason_leaving: "",
  //       remark: "",
  //       academic_yr: "",
  //       stud_id: "",
  //       udise_pen_no: "",
  //     });

  //     try {
  //       setLoadingForSearch(true); // Start loading
  //       const token = localStorage.getItem("authToken");
  //       const response = await axios.get(
  //         `${API_URL}/api/get_srnoleavingcertificatedata/${selectedStudentId}`,
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );

  //       // Check if data was received and update the form state
  //       if (response?.data?.data) {
  //         const fetchedData = response.data.data; // Extract the data

  //         setParentInformation(fetchedData); // Assuming response data contains parent information
  //         // Extract all subject names for initial selected state
  //         const allSubjectNames = (fetchedData.classsubject || []).map(
  //           (subject) => subject.name
  //         );

  //         console.log("allSubjectNames", allSubjectNames);
  //         // Populate formData with the fetched data
  //         setFormData({
  //           sr_no: fetchedData.sr_no || "",
  //           class_id: fetchedData.class_id || " ",
  //           class_id_for_subj: fetchedData.studentinformation.class_id || "",
  //           grn_no: fetchedData.studentinformation.grn_no || "",
  //           date: today || "", // Directly from the fetched data
  //           subjectsFor: fetchedData.classsubject || [],
  //           academicStudent: fetchedData.academicStudent || [],
  //           academic_yr: fetchedData.studentinformation?.academic_yr || "", // Preselect first academic year if available
  //           subjects: allSubjectNames,

  //           selectedSubjects: allSubjectNames, // Initialize with all subjects checked
  //           // first_name: `${fetchedData.studentinformation?.first_name || ""} ${
  //           //   fetchedData.studentinformation?.mid_name || ""
  //           // } ${fetchedData.studentinformation?.last_name || ""}`,
  //           student_id_no: fetchedData.studentinformation.student_id_no || "",
  //           first_name: fetchedData.studentinformation.first_name || "",
  //           mid_name: fetchedData.studentinformation.mid_name || "",
  //           last_name: fetchedData.studentinformation.last_name || "",
  //           udise_pen_no: fetchedData.studentinformation.udise_pen_no || "",
  //           promoted_to: fetchedData.studentinformation.promoted_to || "",
  //           last_exam: fetchedData.studentinformation.last_exam || "",

  //           stud_id: fetchedData.studentinformation.student_id || " ",
  //           father_name: fetchedData.studentinformation.father_name || "",
  //           mother_name: fetchedData.studentinformation.mother_name || "",

  //           date_of_admission:
  //             fetchedData.studentinformation.date_of_admission || "",
  //           religion: fetchedData.studentinformation.religion || "",
  //           caste: fetchedData.studentinformation.caste || "",
  //           subcaste: fetchedData.studentinformation.subcaste || "",
  //           birth_place: fetchedData.studentinformation.birth_place || "", // Adjusted according to the fetched data
  //           state: fetchedData.studentinformation.state || "",
  //           mother_tongue: fetchedData.studentinformation.mother_tongue || "",
  //           dob: fetchedData.studentinformation.dob || "",
  //           // dob_words: fetchedData.dobinwords || "", // Directly from fetched data
  //           dob_words: convertDateToWords(fetchedData.studentinformation.dob),
  //           attendance: fetchedData.total_attendance || "",
  //           nationality: fetchedData.studentinformation.nationality || "",
  //           aadhar_no: fetchedData.studentinformation.aadhar_no || "",
  //           teacher_image_name:
  //             fetchedData.studentinformation.father_image_name || null, // Assuming this is for a teacher image
  //           purpose: fetchedData.purpose || " ",
  //         });
  //       } else {
  //         toast.error("No data found for the selected student.");
  //       }
  //     } catch (error) {
  //       console.log("error is", error);
  //       toast.error("Error fetching data for the selected student.");
  //     } finally {
  //       setLoadingForSearch(false);
  //     }
  //   };

  const validate = () => {
    const newErrors = {};

    // Required fields validation
    const requiredFields = [
      "grn_no",
      "issue_date",
      "first_name",

      "student_id_no",
      "promoted_to",
      "last_exam",
      "father_name",
      "mother_name",
      "birth_place",
      "state",
      "mother_tongue",
      "dob",
      "dob_words",
      "nationality",
      "prev_school_class",
      "date_of_admission",
      "admission_class",
      "reason_leaving",
      "application_date",
      "leaving_date",
      "standard_studying",
      "dob_proof",
      "aadhar_no",
      "attendance",
      "fee_month",
      "remark",
      "conduct",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });
    if (formData.class_id > 109) {
      if (!formData.udise_pen_no) {
        newErrors.udise_pen_no = "This field is required";
      }
    }
    // Additional validations for specific fields
    if (formData.first_name && /^\d/.test(formData.first_name)) {
      newErrors.first_name = "Student Name should not start with a number";
    }
    if (formData.father_name && /^\d/.test(formData.father_name)) {
      newErrors.father_name = "Father's Name should not start with a number";
    }
    if (formData.mother_name && /^\d/.test(formData.mother_name)) {
      newErrors.mother_name = "Mother's Name should not start with a number";
    }

    // Checkbox validation
    if (
      !formData.selectedActivities ||
      formData.selectedActivities.length === 0
    ) {
      newErrors.activities =
        "Please select at least one extra-curricular activity";
    }
    if (!formData.selectedSubjects || formData.selectedSubjects.length === 0) {
      newErrors.selectedSubjects = "Please select at least one subject";
    }

    // Dropdown-specific validations
    if (!formData.dob_proof) {
      newErrors.dob_proof = "This field is required";
    }
    if (!formData.part_of) {
      newErrors.part_of = "This field is required";
    }
    if (!formData.academic_yr) {
      newErrors.academic_yr = "This field is required";
    }

    setErrors(newErrors);

    // Return true if no errors, false if errors exist
    return Object.keys(newErrors).length === 0;
  };

  // Handle change for form fields
  const handleChange = async (event) => {
    const { name, value, type, checked } = event.target;

    // Handle checkboxes and dropdown values
    if (type === "checkbox") {
      setFormData((prevData) => {
        const updatedSelectedItems = checked
          ? [...prevData[name], value] // Add item if checked
          : prevData[name].filter((item) => item !== value); // Remove item if unchecked

        return {
          ...prevData,
          [name]: updatedSelectedItems,
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "dob" && { dob_words: convertDateToWords(value) }),
        ...(name === "academic_yr" && { academic_yr: value }),
      }));
    }

    // Validation for specific fields
    let fieldErrors = {};
    if (name === "first_name" && /^\d/.test(value)) {
      fieldErrors.first_name = "Student Name should not start with a number";
    }
    if (name === "father_name" && /^\d/.test(value)) {
      fieldErrors.father_name = "Father's Name should not start with a number";
    }
    if (name === "mother_name" && /^\d/.test(value)) {
      fieldErrors.mother_name = "Mother's Name should not start with a number";
    }

    // Update errors if any validation fails
    setErrors((prevErrors) => ({ ...prevErrors, [name]: fieldErrors[name] }));

    // Fetch new data if academic year is changed
    if (name === "academic_yr") {
      try {
        await handleSearchForAcademicYr(value);
      } catch (error) {
        console.error("Failed to fetch data for academic year", error);
      }
    }
  };

  console.log("academ,icyearchagne", formData.academic_yr);
  const handleSearchForAcademicYr = async (selectedAcademicYear) => {
    setErrors({}); // Clears all field-specific errors

    // Optional validation to ensure an academic year is selected
    if (!selectedAcademicYear) {
      toast.error("Please select an academic year!");
      return;
    }

    // Reset form data to ensure it updates with fresh data
    setFormData({
      grn_no: "",
      issue_date: "",
      student_id_no: "",
      aadhar_no: "",
      first_name: "",
      mid_name: "",
      last_name: "",
      father_name: "",
      mother_name: "",
      nationality: "",
      mother_tongue: "",
      religion: "",
      caste: "",
      subcaste: "",
      birth_place: "",
      dob: "",
      dob_words: "",
      dob_proof: "",
      prev_school_class: "",
      // previous_school_attended: "",
      date_of_admission: "",
      admission_class: "",
      leaving_date: "",
      standard_studying: "",
      last_exam: "",
      subjects: [], // Empty array for selected subjects
      promoted_to: "",
      attendance: "",
      fee_month: "",
      part_of: "",
      selectedActivities: [], // Empty array for selected activities
      application_date: "",
      conduct: "",
      reason_leaving: "",
      remark: "",
      academic_yr: "",
      stud_id: "",
      udise_pen_no: "",
    });

    try {
      setLoadingForSearchAcy(true); // Start loading
      const token = localStorage.getItem("authToken");

      // Make API call with academic year as part of the endpoint
      const response = await axios.get(
        `${API_URL}/api/get_srnoleavingcertificateByAcademicyr/${student?.stud_id}/${selectedAcademicYear}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data?.data) {
        const fetchedData = response.data.data;

        // Set fetched data to the form
        // Set fetched data to the form, retaining the academic_yr field
        setFormData((prevData) => ({
          ...prevData, // Retain the existing formData values
          academic_yr: selectedAcademicYear, // Make sure to retain the selected academic year
          sr_no: fetchedData.sr_no || "",
          class_id_for_subj: fetchedData.studentinformation.class_id || "",
          grn_no: fetchedData.studentinformation.grn_no || "",
          issue_date: today || "",
          subjectsFor: fetchedData.classsubject || [],
          academicStudent: fetchedData.academicStudent || [],
          selectedSubjects: (fetchedData.classsubject || []).map(
            (subject) => subject.name
          ),
          // subjects: allSubjectNames,

          // subjects:selectedSubjects || [],
          student_id_no: fetchedData.studentinformation.student_id_no || "",
          first_name: fetchedData.studentinformation.first_name || "",
          mid_name: fetchedData.studentinformation.mid_name || "",
          last_name: fetchedData.studentinformation.last_name || "",
          udise_pen_no: fetchedData.studentinformation.udise_pen_no || "",
          promoted_to: fetchedData.studentinformation.promoted_to || "",
          last_exam: fetchedData.studentinformation.last_exam || "",
          stud_id: fetchedData.studentinformation.student_id || " ",
          father_name: fetchedData.studentinformation.father_name || "",
          mother_name: fetchedData.studentinformation.mother_name || "",
          date_of_admission:
            fetchedData.studentinformation.date_of_admission || "",
          religion: fetchedData.studentinformation.religion || "",
          caste: fetchedData.studentinformation.caste || "",
          subcaste: fetchedData.studentinformation.subcaste || "",
          birth_place: fetchedData.studentinformation.birth_place || "",
          state: fetchedData.studentinformation.state || "",
          mother_tongue: fetchedData.studentinformation.mother_tongue || "",
          dob: fetchedData.studentinformation.dob || "",
          dob_words: convertDateToWords(fetchedData.studentinformation.dob),
          attendance: fetchedData.total_attendance || "",
          nationality: fetchedData.studentinformation.nationality || "",
          aadhar_no: fetchedData.studentinformation.aadhar_no || "",
          teacher_image_name:
            fetchedData.studentinformation.father_image_name || null,
          purpose: fetchedData.purpose || " ",
        }));
      } else {
        toast.error("No data found for the selected academic year.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data for the selected academic year.");
    } finally {
      setLoadingForSearchAcy(false);
    }
  };
  console.log("academic yearr", formData.academicStudent);
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

    // Format the form data before submission
    const formattedFormData = {
      grn_no: formData.grn_no || "",
      issue_date: formatDateString(formData.issue_date),
      student_id_no: formData.student_id_no || "",
      aadhar_no: formData.aadhar_no || "",
      first_name: formData.first_name || "",
      mid_name: formData.mid_name || "",
      last_name: formData.last_name || "",
      father_name: formData.father_name || "",
      mother_name: formData.mother_name || "",
      nationality: formData.nationality || "",
      mother_tongue: formData.mother_tongue || "",
      state: formData.state || "",
      religion: formData.religion || "",
      caste: formData.caste || "",
      subcaste: formData.subcaste || "",
      birth_place: formData.birth_place || "",
      dob: formatDateString(formData.dob),
      dob_words: formData.dob_words || "",
      dob_proof: formData.dob_proof || "",
      previous_school_attended: formData.prev_school_class || "",
      date_of_admission: formatDateString(formData.date_of_admission),
      admission_class: formData.admission_class || "",
      leaving_date: formatDateString(formData.leaving_date),
      standard_studying: formData.standard_studying || "",
      last_exam: formData.last_exam || "",
      subjects: formData.selectedSubjects || [], // Ensure it's an array of subject names
      promoted_to: formData.promoted_to || "",
      attendance: formData.attendance || "",
      fee_month: formData.fee_month || "",
      part_of: formData.part_of || "",
      games: selectedActivities || [], // Ensure it's an array of game names
      application_date: formatDateString(formData.application_date),
      conduct: formData.conduct || "",
      reason_leaving: formData.reason_leaving || "",
      remark: formData.remark || "",
      academic_yr: formData.academic_yr || "",
      stud_id: formData.stud_id || "",
      udise_pen_no: formData.udise_pen_no || "",
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.put(
        `${API_URL}/api/update_leavingcertificate/${student?.sr_no}`,
        formattedFormData,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob", // For PDF response
        }
      );

      if (response.status === 200) {
        toast.success("LC Certificate Updated successfully!");
        // Extract filename from Content-Disposition header
        const contentDisposition = response.headers["content-disposition"];
        let filename = "DownloadedFile.pdf"; // Fallback name

        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+?)"/);
          if (match && match[1]) {
            filename = match[1];
          }
        }
        // Download PDF
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Reset form data
        setFormData({
          sr_no: "",
          grn_no: "",
          date: "",
          first_name: "",
          mid_name: "",
          last_name: "",
          udise_pen_no: "",
          student_id_no: "",
          promoted_to: " ",
          last_exam: "",
          stud_id: "",
          // student_UID: "",
          father_name: "",
          mother_name: "",
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
          date_of_admission: "",
          admission_class: "",
          attendance: "",
          subjectsFor: [],
          subjects: [],
          selectedActivities: [],

          reason_leaving: "",
          application_date: "",
          leaving_date: "",
          standard_studying: "",
          dob_proof: "",
          class_id_for_subj: "",
          aadhar_no: "",
          teacher_image_name: null,
          academicStudent: [],
          academic_yr: "", // Add this to track selected academic year
          part_of: "",
        });
        setSelectedClass(null);
        setSelectedStudent(null);

        setTimeout(() => setParentInformation(null), 3000);

        // Navigate to the desired route after successful update
        navigate("/leavingCertificate");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error("An error occurred while Updated the LC Certificate.");

      if (error.response && error.response.data) {
        setBackendErrors(error.response.data);
      } else {
        toast.error("Unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setFormData((prevData) => {
      const updatedActivities = checked
        ? [...prevData.selectedActivities, value]
        : prevData.selectedActivities.filter((activity) => activity !== value);

      // Remove error if at least one activity is selected
      if (updatedActivities.length > 0) {
        setErrors((prevErrors) => ({ ...prevErrors, activities: null }));
      }
      //   setSelectedActivities(updatedActivities);

      return {
        ...prevData,
        selectedActivities: updatedActivities,
      };
    });
  };

  // Log or save selectedActivities when needed
  console.log("____activity", selectedActivities);
  // Handle selection of each subject
  const handleSubjectSelection = (e, subjectName) => {
    setFormData((prevData) => {
      const updatedSelectedSubjects = e.target.checked
        ? [...prevData.selectedSubjects, subjectName] // add subject if checked
        : prevData.selectedSubjects.filter((name) => name !== subjectName); // remove subject if unchecked

      // Remove error if at least one subject is selected
      if (updatedSelectedSubjects.length > 0) {
        setErrors((prevErrors) => ({ ...prevErrors, selectedSubjects: null }));
      }

      return {
        ...prevData,
        selectedSubjects: updatedSelectedSubjects,
      };
    });
  };

  console.log("handleSubjectSelection", formData.selectedSubjects);

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
            Edit Leaving Certificate
          </h5>

          <RxCross1
            className="float-end relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
            onClick={() => {
              setErrors({});
              navigate("/leavingCertificate");
            }}
          />
        </div>
        <div
          className=" relative w-full   -top-6 h-1  mx-auto bg-red-700"
          style={{
            backgroundColor: "#C03078",
          }}
        ></div>
        <p className=" text-[.9em] md:absolute md:right-8  md:top-[5%]   text-gray-500 ">
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="sr_no" className="block font-bold text-xs mb-2">
                  LC No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="sr_no"
                  name="sr_no"
                  value={formData.sr_no}
                  readOnly
                  className="input-field block border w-full border-1 border-gray-950 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
                />
              </div>
              <div>
                <label
                  htmlFor="grn_no"
                  className="block font-bold text-xs mb-2"
                >
                  General Register No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="grn_no"
                  name="grn_no"
                  maxLength={10}
                  value={formData.grn_no}
                  onChange={handleChange}
                  readOnly
                  className="input-field block border w-full border-1 border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
                />
                {errors.grn_no && (
                  <span className="text-red-500 text-xs ml-1 h-1">
                    {errors.grn_no}
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
                  name="issue_date"
                  value={formData.issue_date}
                  onChange={handleChange}
                  className="input-field block border w-full border-1 border-gray-950 rounded-md py-1 px-3 bg-white shadow-inner"
                />
                {errors.issue_date && (
                  <span className="text-red-500 text-xs ml-1 h-1">
                    {errors.issue_date}
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className=" ">
                <label
                  htmlFor="staffName"
                  className="block font-bold  text-xs mb-2"
                >
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={200}
                  id="staffName"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  readOnly
                  className="input-field block border w-full border-1 border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
                />
                {errors.first_name && (
                  <div className="text-red-500 text-xs ml-1 ">
                    {errors.first_name}
                  </div>
                )}
              </div>
              <div className=" ">
                <label
                  htmlFor="staffMidName"
                  className="block font-bold  text-xs mb-2"
                >
                  Mid Name
                </label>
                <input
                  type="text"
                  maxLength={200}
                  id="staffMidName"
                  name="mid_name"
                  value={formData.mid_name}
                  onChange={handleChange}
                  readOnly
                  className="input-field block border w-full border-1 border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
                />
              </div>
              <div className=" ">
                <label
                  htmlFor="staffLastName"
                  className="block font-bold  text-xs mb-2"
                >
                  Surname
                </label>
                <input
                  type="text"
                  maxLength={200}
                  id="staffLastName"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  readOnly
                  className="input-field block border w-full border-1 border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
                />
              </div>
              <div>
                <label
                  htmlFor="student_id_no"
                  className="block font-bold text-xs mb-2"
                >
                  STUDENT ID NO <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="student_id_no"
                  name="student_id_no"
                  maxLength={25}
                  value={formData.student_id_no}
                  onChange={handleChange}
                  readOnly
                  className="input-field block border w-full border-1 border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
                />
                {errors.student_id_no && (
                  <span className="text-red-500 text-xs ml-1 h-1">
                    {errors.student_id_no}
                  </span>
                )}
              </div>

              {formData?.class_id > 109 && (
                <div className="mt-2">
                  <label
                    htmlFor="studentAadharNumber"
                    className="block font-bold text-xs mb-0.5"
                  >
                    Udise Pen No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="Udise_no"
                    name="udise_pen_no"
                    maxLength={14}
                    value={formData.udise_pen_no}
                    // className="input-field block w-full  border-1 border-gray-950 rounded-md py-1 px-3 bg-white shadow-inner"
                    readOnly
                    className="input-field block border w-full border-1 border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
                    onChange={handleChange}
                    // onBlur={handleBlur}
                  />{" "}
                  {errors.udise_pen_no && (
                    <span className="text-red-500 text-xs ml-1 h-1">
                      {errors.udise_pen_no}
                    </span>
                  )}
                </div>
              )}
              <div>
                <label
                  htmlFor="aadhar_no"
                  className="block font-bold text-xs mb-2"
                >
                  UDI NO.(Aadhar Card No.){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="aadhar_no"
                  name="aadhar_no"
                  maxLength={12}
                  value={formData.aadhar_no}
                  onChange={handleChange}
                  readOnly
                  className="input-field block border w-full border-1 border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
                />
                {errors.aadhar_no && (
                  <span className="text-red-500 text-xs ml-1 h-1">
                    {errors.aadhar_no}
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

            <div className="w-full md:w-[75%]  grid grid-cols-1 md:grid-cols-2   gap-x-6 gap-4">
              {" "}
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
                  className="input-field block border w-full border-1 border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
                />
                {errors.father_name && (
                  <div className="text-red-500 text-xs ml-1 ">
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
                  className="input-field block border w-full border-1 border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
                />
                {errors.mother_name && (
                  <span className="text-red-500 text-xs ml-1 h-1">
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
                  className="input-field block border w-full border-1 border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
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
                  className="input-field block border w-full border-1 border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
                />
              </div>{" "}
              <div className="grid   col-span-2 row-span-2 ">
                <label
                  htmlFor="subjects"
                  className="block font-bold text-xs  col-span-3"
                >
                  Subjects Studied <span className="text-red-500">*</span>
                </label>
                {/* Render checkboxes for each subject */}
                {/* Render checkboxes for each subject */}

                {formData.subjectsFor && formData.subjectsFor.length > 0 ? (
                  formData.subjectsFor.map((subject, index) => (
                    <div key={index} className="grid-col-3 relative">
                      <label>
                        <input
                          type="checkbox"
                          name="subjects"
                          value={subject.name}
                          checked={formData.selectedSubjects.includes(
                            subject.name
                          )}
                          onChange={(e) =>
                            handleSubjectSelection(e, subject.name)
                          }
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="ml-1 text-sm">{subject.name}</span>
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 col-span-3">
                    No subjects available
                  </p>
                )}
                {/* Conditional extra subject for class 100 */}
                {formData.class_id_for_subj &&
                  formData.class_id_for_subj === 109 && (
                    <div className="col-span-1 relative  ">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name="subjects"
                          value="Basic Mathematics"
                          checked={formData.selectedSubjects.includes(
                            "Basic Mathematics"
                          )}
                          onChange={(e) =>
                            handleSubjectSelection(e, "Basic Mathematics")
                          }
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="ml-1 text-sm">Basic Mathematics</span>
                      </label>
                    </div>
                  )}
                {errors.selectedSubjects && (
                  <span className="text-red-500 text-xs ml-1 h-1 col-span-3">
                    {errors.selectedSubjects}
                  </span>
                )}
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
                  className="input-field block border w-full border-1 border-gray-950 rounded-md py-1 px-3 bg-white shadow-inner"
                />
              </div>
              <div>
                <label
                  htmlFor="PromotedTo"
                  className="block font-bold text-xs mb-2"
                >
                  Promoted to <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="PromotedTo"
                  name="promoted_to"
                  maxLength={100}
                  value={formData.promoted_to}
                  onChange={handleChange}
                  className="input-field block border w-full border-1 border-gray-950 rounded-md py-1 px-3 bg-white shadow-inner"
                />
                {errors.promoted_to && (
                  <span className="text-red-500 text-xs ml-1 h-1">
                    {errors.promoted_to}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="School/Board"
                  className="block font-bold text-xs mb-2"
                >
                  School/Board Annual Exam Last Taken with Result{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="School/Board"
                  name="last_exam"
                  maxLength={100}
                  value={formData.last_exam}
                  onChange={handleChange}
                  className="input-field block border w-full border-1 border-gray-950 rounded-md py-1 px-3 bg-white shadow-inner"
                />
                {errors.last_exam && (
                  <span className="text-red-500 text-xs ml-1 h-1">
                    {errors.last_exam}
                  </span>
                )}
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  className="input-field block border w-full border-1 border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
                />
                {errors.birth_place && (
                  <span className="text-red-500 text-xs ml-1 h-1">
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
                  className="input-field block border w-full border-1 border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
                />
                {errors.state && (
                  <span className="text-red-500 text-xs ml-1 h-1">
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
                  className="input-field block border w-full border-1 border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
                />
                {errors.mother_tongue && (
                  <span className="text-red-500 text-xs ml-1 h-1">
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
                  className="input-field block border w-full border-1 border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
                />
                {errors.dob && (
                  <div className="text-red-500 text-xs ml-1 ">{errors.dob}</div>
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
                  className="input-field block border w-full border-1 border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
                />
                {errors.dob_words && (
                  <div className="text-red-500 text-xs ml-1 ">
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
                  className="input-field block border w-full border-1 border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
                />
                {errors.nationality && (
                  <span className="text-red-500 text-xs ml-1 h-1">
                    {errors.nationality}
                  </span>
                )}
              </div>
            </div>
          </fieldset>
          {/* Admission Details */}
          <fieldset className="mb-4">
            {/* <legend className="font-bold"> */}
            <h5 className="col-span-4 text-blue-400 py-2">
              Admission and School Records{" "}
            </h5>
            {/* </legend> */}

            <div className="grid grid-cols-1 md:grid-cols-4  gap-4">
              <div>
                <label
                  htmlFor="prev_school_class"
                  className="block font-bold text-xs mb-2"
                >
                  Previous School Attended{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="prev_school_class"
                  maxLength={100}
                  name="prev_school_class"
                  value={formData.prev_school_class}
                  onChange={handleChange}
                  className="input-field block border w-full border-1 border-gray-950 rounded-md py-1 px-3 bg-white shadow-inner"
                />
                {errors.prev_school_class && (
                  <span className="text-red-500 text-xs ml-1 h-1">
                    {errors.prev_school_class}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="date_of_admission"
                  className="block font-bold text-xs mb-2"
                >
                  Date of Admission <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date_of_admission"
                  name="date_of_admission"
                  value={formData.date_of_admission}
                  onChange={handleChange}
                  readOnly
                  className="input-field block border w-full border-1 border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
                />
                {errors.date_of_admission && (
                  <span className="text-red-500 text-xs ml-1 h-1">
                    {errors.date_of_admission}
                  </span>
                )}
              </div>
              <div className=" ">
                <label
                  htmlFor="admission_class"
                  className="block font-bold text-xs mb-2 "
                >
                  Admitted in Class
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="admission_class"
                  maxLength={100}
                  name="admission_class"
                  value={formData.admission_class}
                  onChange={handleChange}
                  readOnly
                  className="input-field block border w-full border-1 border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
                />
                {errors.admission_class && (
                  <span className="text-red-500 text-xs ml-1 h-1">
                    {errors.admission_class}
                  </span>
                )}
              </div>{" "}
              <div>
                <label
                  htmlFor="Date_of_Leaving_School"
                  className="block font-bold text-xs mb-2"
                >
                  Date of Leaving School
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="Date_of_Leaving_School"
                  name="leaving_date"
                  value={formData.leaving_date}
                  onChange={handleChange}
                  className="input-field block border w-full border-1 border-gray-950 rounded-md py-1 px-3 bg-white shadow-inner"
                />
                {errors.leaving_date && (
                  <span className="text-red-500 text-xs ml-1 h-1">
                    {errors.leaving_date}
                  </span>
                )}
              </div>{" "}
              {/* Dropdown for Proof of DOB submitted */}
              <div className="">
                <label
                  htmlFor="dob_proof"
                  className="block font-bold text-xs mb-2"
                >
                  Proof of DOB Submitted at the Time of Admission
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="dob_proof"
                  name="dob_proof"
                  value={formData.dob_proof}
                  onChange={handleChange}
                  className="block w-full border border-gray-900 rounded-md py-1 px-3 bg-white shadow-inner"
                >
                  <option value="">Select</option>
                  <option value="Birth Certificate">Birth Certificate</option>
                  <option value="School Leaving Certificate">
                    School Leaving Certificate
                  </option>
                  <option value="Aadhar Card">Aadhar Card</option>
                  <option value="Passport">Passport</option>
                </select>
                {errors.dob_proof && (
                  <span className="text-red-500 text-xs ml-1 h-1">
                    {errors.dob_proof}
                  </span>
                )}
              </div>{" "}
              <div className="">
                <label
                  htmlFor="part_of"
                  className="block font-bold text-xs mb-2"
                >
                  Whether Part of (NCC Cadet, Boy Scout, Girl Guide)
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="part_of"
                  name="part_of"
                  value={formData.part_of}
                  onChange={handleChange}
                  className="block w-full border border-gray-900 rounded-md py-1 px-3 bg-white shadow-inner"
                >
                  <option value="">Select</option>
                  <option value="NCC Cadet">NCC Cadet</option>
                  <option value="Boy Scout">Boy Scout</option>
                  <option value="Girl Guide">Girl Guide</option>
                  <option value="N.A">N.A</option>
                </select>
                {errors.part_of && (
                  <span className="text-red-500 text-xs ml-1 h-1">
                    {errors.part_of}
                  </span>
                )}
              </div>
              <div className="mt-3">
                <label
                  htmlFor="reason_leaving"
                  className="block font-bold text-xs mb-2"
                >
                  Reason for Leaving <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="reason_leaving"
                  name="reason_leaving"
                  maxLength={100}
                  value={formData.reason_leaving}
                  onChange={handleChange}
                  className="input-field block border w-full border-1 border-gray-950 rounded-md py-1 px-3 bg-white shadow-inner"
                />
                {errors.reason_leaving && (
                  <span className="text-red-500 text-xs ml-1 h-1">
                    {errors.reason_leaving}
                  </span>
                )}
              </div>
              <div className="mt-3">
                <label
                  htmlFor="application_date"
                  className="block font-bold text-xs mb-2"
                >
                  Date of application for Certificate{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="application_date"
                  name="application_date"
                  value={formData.application_date}
                  onChange={handleChange}
                  className="input-field block border w-full border-1 border-gray-950 rounded-md py-1 px-3 bg-white shadow-inner"
                />
                {errors.application_date && (
                  <span className="text-red-500 text-xs ml-1 h-1">
                    {errors.application_date}
                  </span>
                )}
              </div>
              {/* // In your component JSX, display the error message */}
              <div className="grid col-span-4 row-span-1">
                <label
                  htmlFor="activities"
                  className="block font-bold text-xs mb-2"
                >
                  Extra-Curricular Activities{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
                  {[
                    "Football",
                    "Basketball",
                    "Volleyball",
                    "Tennis",
                    "Kho Kho",
                    "Table Tennis",
                    "Kabaddi",
                    "Cricket",
                    "Athletics",
                    "Dodgeball",
                    "Throwball",
                    "Handball",
                    "Tug of War",
                    "Gymnastics",
                    "Skating",
                    "Martial Arts",
                    "Badminton",
                    "Chess",
                    "Carrom",
                  ].map((activity) => (
                    <div key={activity} className="flex items-center">
                      <input
                        type="checkbox"
                        id={activity}
                        value={activity}
                        checked={formData.selectedActivities.includes(activity)}
                        onChange={handleCheckboxChange}
                        className="mr-2"
                      />
                      <label htmlFor={activity} className="text-sm">
                        {activity}
                      </label>
                    </div>
                  ))}
                </div>

                {errors.activities && (
                  <span className="text-red-500 text-xs ml-1 h-1 mt-2">
                    {errors.activities}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="attendance"
                  className="block font-bold text-xs mb-2"
                >
                  Attendance <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="attendance"
                  maxLength={7}
                  name="attendance"
                  value={formData.attendance}
                  onChange={handleChange}
                  className="input-field block border w-full border-1 border-gray-950 rounded-md py-1 px-3 bg-white shadow-inner"
                />
                {errors.attendance && (
                  <span className="text-red-500 text-xs ml-1 h-1">
                    {errors.attendance}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="fee_month"
                  className="block font-bold text-xs mb-2"
                >
                  Month Up to Which School Fees are Paid{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fee_month"
                  maxLength={50}
                  name="fee_month"
                  value={formData.fee_month}
                  onChange={handleChange}
                  className="input-field block border w-full border-1 border-gray-950 rounded-md py-1 px-3 bg-white shadow-inner"
                />
                {errors.fee_month && (
                  <span className="text-red-500 text-xs ml-1 h-1">
                    {errors.fee_month}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="standard_studying"
                  className="block font-bold text-xs mb-2"
                >
                  Class in Which Last Studied in
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="standard_studying"
                  name="standard_studying"
                  maxLength={20}
                  value={formData.standard_studying}
                  onChange={handleChange}
                  className="input-field block border w-full border-1 border-gray-950 rounded-md py-1 px-3 bg-white shadow-inner"
                />
                {errors.standard_studying && (
                  <span className="text-red-500 text-xs ml-1 h-1">
                    {errors.standard_studying}
                  </span>
                )}
              </div>{" "}
              {/* Display selected value for reference */}
            </div>
          </fieldset>

          {/* Certificate Information */}
          <fieldset className="mb-4">
            <h5 className="col-span-4 text-blue-400 py-2">
              Certificate Information
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label
                  htmlFor="application_date"
                  className="block font-bold text-xs mb-2"
                >
                  Date of Application for Certificate{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="application_date"
                  name="application_date"
                  value={formData.application_date}
                  onChange={handleChange}
                  className="input-field block border w-full border-1 border-gray-950 rounded-md py-1 px-3 bg-white shadow-inner"
                />
                {errors.application_date && (
                  <span className="text-red-500 text-xs ml-1 h-1">
                    {errors.application_date}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="conduct"
                  className="block font-bold text-xs mb-2"
                >
                  Conduct <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="conduct"
                  name="conduct"
                  maxLength={100}
                  value={formData.conduct}
                  onChange={handleChange}
                  className="input-field block border w-full border-1 border-gray-950 rounded-md py-1 px-3 bg-white shadow-inner"
                />
                {errors.conduct && (
                  <span className="text-red-500 text-xs ml-1 h-1">
                    {errors.conduct}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="remark"
                  className="block font-bold text-xs mb-2"
                >
                  Any Other Remarks <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="remark"
                  maxLength={100}
                  name="remark"
                  value={formData.remark}
                  onChange={handleChange}
                  className="input-field block border w-full border-1 border-gray-950 rounded-md py-1 px-3 bg-white shadow-inner"
                />
                {errors.remark && (
                  <span className="text-red-500 text-xs ml-1 h-1">
                    {errors.remark}
                  </span>
                )}
              </div>

              {/* <div>
                        <label
                          htmlFor="academic_year"
                          className="block font-bold text-xs mb-2"
                        >
                          Academic Year <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="academic_year"
                          name="academic_year"
                          value={formData.academic_year}
                          onChange={handleChange}
                          className="input-field block border w-full border-1 border-gray-950 rounded-md py-1 px-3 bg-white shadow-inner"
                        />
                        {errors.academic_year && (
                          <span className="text-red-500 text-xs ml-1 h-1">
                            {errors.academic_year}
                          </span>
                        )}
                      </div> */}
              {/* Dropdown for Academic Year */}
              <div className="mb-4">
                <label
                  htmlFor="academic_yr"
                  className="block font-bold text-xs mb-2"
                >
                  Academic Year <span className="text-red-500">*</span>
                </label>

                <select
                  id="academic_yr"
                  name="academic_yr"
                  value={formData.academic_yr || ""}
                  onChange={handleChange}
                  className="block w-full border border-gray-900 rounded-md py-1 px-3 bg-white shadow-inner"
                >
                  <option value="">Select</option>
                  {formData.academicStudent &&
                  formData.academicStudent.length > 0 ? (
                    formData.academicStudent.map((item, index) => (
                      <option key={index} value={item.academic_yr}>
                        {item.academic_yr}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No academic years available
                    </option>
                  )}
                </select>

                {errors.academic_yr && (
                  <span className="text-red-500 text-xs ml-1 h-1">
                    {errors.academic_yr}
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

export default EditLeavingCertificate;
