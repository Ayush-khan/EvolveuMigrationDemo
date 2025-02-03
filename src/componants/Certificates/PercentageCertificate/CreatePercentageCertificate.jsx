import { useState, useEffect, useMemo } from "react";
// import debounce from "lodash/debounce";
import axios from "axios";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
// import { RxCross1 } from "react-icons/rx";

const CreatePercentageCertificate = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [classesforForm, setClassesforForm] = useState([]);
  const [studentNameWithClassId, setStudentNameWithClassId] = useState([]);
  const [classIdForSearch, setClassIdForSearch] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [nameError, setNameError] = useState("");
  const [nameErrorForClass, setNameErrorForClass] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [parentInformation, setParentInformation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingForSearch, setLoadingForSearch] = useState(false);
  const [marks, setMarks] = useState({});

  const [total, setTotal] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const maxInputLength = 3;
  const navigate = useNavigate();
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

  // for form
  const [errors, setErrors] = useState({});
  const [backendErrors, setBackendErrors] = useState({});

  // Get today's date in YYYY-MM-DD format
  // Calculate today's date
  const today = new Date().toISOString().split("T")[0];

  // for student and class dropdown
  // State for loading indicators
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    // Fetch both classes and student names on component mount
    fetchInitialDataAndStudents();
  }, []);

  const fetchInitialDataAndStudents = async () => {
    try {
      setLoadingClasses(true);
      setLoadingStudents(true);

      const token = localStorage.getItem("authToken");

      // Fetch classes and students concurrently
      const [classResponse, studentResponse] = await Promise.all([
        axios.get(`${API_URL}/api/getallClassWithStudentCount`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/getStudentListBySectionData`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Set the fetched data
      setClassesforForm(classResponse.data || []);
      setStudentNameWithClassId(studentResponse?.data?.data || []);
    } catch (error) {
      toast.error("Error fetching data.");
    } finally {
      // Stop loading for both dropdowns
      setLoadingClasses(false);
      setLoadingStudents(false);
    }
  };

  const fetchStudentNameWithClassId = async (section_id = null) => {
    try {
      setLoadingStudents(true);

      const params = section_id ? { section_id } : {};
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        `${API_URL}/api/getStudentListBySectionData`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      setStudentNameWithClassId(response?.data?.data || []);
    } catch (error) {
      toast.error("Error fetching students.");
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleClassSelect = (selectedOption) => {
    setSelectedClass(selectedOption);
    setSelectedStudent(null);
    setSelectedStudentId(null);
    setClassIdForSearch(selectedOption?.value);
    fetchStudentNameWithClassId(selectedOption?.value);
  };

  const handleStudentSelect = (selectedOption) => {
    setNameError(""); // Reset student error on selection
    setSelectedStudent(selectedOption);
    setSelectedStudentId(selectedOption?.value);
  };

  // Dropdown options
  // const classOptions = useMemo(
  //   () =>
  //     classesforForm.map((cls) => ({
  //       value: cls.section_id,
  //       label: `${cls?.get_class?.name} ${cls.name} (${cls.students_count})`,
  //       key: `${cls.class_id}-${cls.section_id}`,
  //     })),
  //   [classesforForm]
  // );
  const classOptions = useMemo(
    () =>
      classesforForm
        .filter((cls) => cls.class_id > 123) // Filter out values less than or equal to 107
        .map((cls) => ({
          value: cls.section_id,
          label: `${cls?.get_class?.name || ""} ${cls.name || ""} (${
            cls.students_count || ""
          })`,
          key: `${cls.class_id}-${cls.section_id}`,
        })),
    [classesforForm]
  );

  const studentOptions = useMemo(
    () =>
      studentNameWithClassId.map((stu) => ({
        value: stu.student_id,
        label: `${stu?.first_name || ""} ${stu?.mid_name || ""} ${
          stu?.last_name || ""
        }`,
      })),
    [studentNameWithClassId]
  );

  //   const handleMarksChange = (id, value) => {
  //     setMarks((prevMarks) => ({
  //       ...prevMarks,
  //       [id]: value,
  //     }));
  //   };

  const handleSearch = async () => {
    // Reset error messages
    setNameError("");
    setNameErrorForClass("");
    setErrors({}); // Clears all field-specific errors

    if (!selectedStudent) {
      setNameError("Please select Student Name.");
      toast.error("Please select Student Name.!");
      return;
    }
    // Validate if class and student are selected
    // let hasError = false;

    // if (!selectedClass) {
    //   setNameErrorForClass("Please select a class.");
    //   hasError = true;
    // }
    // if (!selectedStudent) {
    //   setNameError("Please select a student.");
    //   hasError = true;
    // }

    // // If there are validation errors, exit the function
    // if (hasError) return;
    setFormData({
      sr_no: "",
      roll_no: "",
      date: "",
      stud_name: "",
      stud_id: " ",
      // student_UID: "",
      class_division: "",

      // stu_aadhaar_no: "",
      teacher_image_name: null,
    });
    setMarks({});
    setTotal(0);
    setPercentage(0);

    try {
      setLoadingForSearch(true); // Start loading
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/get_srnopercentagebonafide/${selectedStudentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Check if data was received and update the form state
      if (response?.data?.data) {
        const fetchedData = response.data.data; // Extract the data

        setParentInformation(fetchedData); // Assuming response data contains parent information

        // Populate formData with the fetched data
        setFormData({
          classsubject: fetchedData.classsubject || "",
          sr_no: fetchedData.sr_no || "",
          roll_no: fetchedData.studentinformation.roll_no || "",
          date: today || "", // Directly from the fetched data
          stud_name: `${fetchedData.studentinformation?.first_name || ""} ${
            fetchedData.studentinformation?.mid_name || ""
          } ${fetchedData.studentinformation?.last_name || ""}`,
          stud_id: fetchedData.studentinformation.student_id || " ",
          class_division:
            `${fetchedData.studentinformation.classname}-${fetchedData.studentinformation.sectionname}` ||
            "",
          teacher_image_name:
            fetchedData.studentinformation.father_image_name || null, // Assuming this is for a teacher image
          purpose: fetchedData.purpose || " ",
        });
      } else {
        if (response.data && response.data.status === 403) {
          toast.error(
            "Percentage Certificate Already Generated. Please go to manage to download the Percentage Certificate."
          );
        } else {
          // Show a generic error message if the error is not a 403
          toast.error("No data found for the selected student.");
        }
      }
    } catch (error) {
      console.log("error is", error);
      toast.error("Error fetching data for the selected student.");
    } finally {
      setLoadingForSearch(false);
    }
  };

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
        fieldErrors.stud_name = "This field is required";
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
  // it's 100% working but when i remove values from the field then it pass bydefault there 0
  const handleMarksChange = (id, value) => {
    // Update the errors state based on validation

    if (value === "") {
      // If the input is cleared, remove the error and set the value as empty
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: "",
      }));

      setMarks((prevMarks) => {
        const updatedMarks = { ...prevMarks, [id]: "" }; // Keep the mark as an empty string
        calculateTotals(updatedMarks); // Recalculate totals with updated marks
        return updatedMarks;
      });
    }
    // if (!value) {
    //   console.log("marka", value);
    //   // setErrors((prevErrors) => ({
    //   //   ...prevErrors,
    //   //   [id]: "Marks are required.",
    //   // }));
    // }
    else if (!/^\d+$/.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: "Marks should be numeric.",
      }));
    } else if (value.length > 3) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: "Marks cannot exceed 3 characters.",
      }));
    } else {
      // Remove the error if input is valid
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: "",
      }));
    }

    // Convert value to an integer if valid
    const numericValue = parseInt(value, 10) || 0;

    setMarks((prevMarks) => {
      const updatedMarks = { ...prevMarks, [id]: numericValue };
      console.log("updatedMarks", updatedMarks);
      // Extract Standard and Basic Math IDs dynamically from formData.classsubject
      const standardMathId = formData.classsubject?.find(
        (subject) => subject.name === "MATHEMATICS STANDARD"
      )?.c_sm_id;
      const basicMathId = formData.classsubject?.find(
        (subject) => subject.name === "BASIC MATHEMATICS"
      )?.c_sm_id;

      // Check if both Standard and Basic Mathematics are present
      const hasBothMaths = standardMathId == 3 && basicMathId == 7;

      // Calculate total marks, excluding Basic Mathematics if both are present
      let totalMarks = Object.entries(updatedMarks).reduce(
        (acc, [key, mark]) => {
          // Exclude "BASIC MATHEMATICS" from total if both subjects have marks
          if (hasBothMaths && key === basicMathId) {
            return acc; // Skip adding marks for Basic Math
          }
          return acc + mark; // Add marks for other subjects
        },
        0
      );

      // Adjust subject count
      let subjectCount = formData.classsubject?.length || 0;

      if (hasBothMaths) {
        subjectCount -= 1; // Decrease count by 1 if both math subjects are present
      }

      // Set the total marks
      setTotal(totalMarks);

      // Calculate percentage
      const calculatedPercentage =
        subjectCount > 0 ? (totalMarks / (subjectCount * 100)) * 100 : 0;
      setPercentage(calculatedPercentage.toFixed(2));

      console.log(
        "totalMarks",
        totalMarks,
        "subjectCount",
        subjectCount,
        "calculatedPercentage",
        calculatedPercentage
      );

      return updatedMarks;
    });
  };

  // Function to calculate total marks and percentage
  const calculateTotals = (marks) => {
    // Extract Standard and Basic Math IDs dynamically from formData.classsubject
    const standardMathId = formData.classsubject?.find(
      (subject) => subject.name === "MATHEMATICS STANDARD"
    )?.c_sm_id;
    const basicMathId = formData.classsubject?.find(
      (subject) => subject.name === "BASIC MATHEMATICS"
    )?.c_sm_id;

    // Check if both Standard and Basic Mathematics are present
    const hasBothMaths = standardMathId == 3 && basicMathId == 7;

    // Calculate total marks, excluding Basic Mathematics if both are present
    let totalMarks = Object.entries(marks).reduce((acc, [key, mark]) => {
      if (hasBothMaths && key == basicMathId) {
        return acc; // Skip Basic Math
      }
      return acc + (parseInt(mark, 10) || 0); // Add mark if valid, else add 0
    }, 0);

    // Adjust subject count
    let subjectCount = formData.classsubject?.length || 0;

    if (hasBothMaths) {
      subjectCount -= 1; // Decrease count by 1 if both math subjects are present
    }

    // Set the total marks
    setTotal(totalMarks);

    // Calculate percentage
    const calculatedPercentage =
      subjectCount > 0 ? (totalMarks / (subjectCount * 100)) * 100 : 0;
    setPercentage(calculatedPercentage.toFixed(2));

    console.log(
      "totalMarks",
      totalMarks,
      "subjectCount",
      subjectCount,
      "calculatedPercentage",
      calculatedPercentage
    );
  };

  // working write
  // const handleMarksChange = (id, value) => {
  //   // Update the errors state based on validation
  //   if (!value) {
  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       [id]: "Marks are required.",
  //     }));
  //   } else if (!/^\d+$/.test(value)) {
  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       [id]: "Marks should be numeric.",
  //     }));
  //   } else if (value.length > 3) {
  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       [id]: "Marks cannot exceed 3 characters.",
  //     }));
  //   } else {
  //     // Remove the error if input is valid
  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       [id]: "",
  //     }));
  //   }

  //   // Convert value to an integer if valid
  //   const numericValue = parseInt(value, 10) || 0;
  //   setMarks((prevMarks) => {
  //     const updatedMarks = { ...prevMarks, [id]: numericValue };

  //     // Calculate total
  //     const totalMarks = Object.values(updatedMarks).reduce(
  //       (acc, mark) => acc + mark,
  //       0
  //     );
  //     setTotal(totalMarks);

  //     // Calculate percentage if there are subjects
  //     const subjectCount = formData.classsubject?.length || 0;

  //     const calculatedPercentage =
  //       subjectCount > 0 ? (totalMarks / (subjectCount * 100)) * 100 : 0;
  //     setPercentage(calculatedPercentage.toFixed(2));

  //     return updatedMarks;
  //   });
  // };
  console.log("marks", marks);
  const prepareSubmissionData = () => {
    const formattedMarks = Object.entries(marks).map(([id, mark]) => ({
      c_sm_id: parseInt(id),
      marks: parseInt(mark) || "",
    }));
    console.log("prepareSubmissionData", prepareSubmissionData);
    const submissionData = {
      roll_no: formData.roll_no,
      stud_name: formData.stud_name,
      class_division: formData.class_division,
      percentage,
      total,
      stud_id: formData.stud_id,
      class: formattedMarks,
      date: formData.date,
    };

    return submissionData;
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
    // formData.classsubject?.forEach((subject) => {
    //   const markValue = marks[subject.c_sm_id];
    //   console.log("markds", markValue);
    //   if (markValue === undefined || markValue === "" || markValue === 0) {
    //     newErrors[subject.c_sm_id] = `${subject.name} marks are required.`;
    //   } else if (!/^\d+$/.test(markValue)) {
    //     newErrors[subject.c_sm_id] = `${subject.name} marks should be numeric.`;
    //   } else if (markValue.toString().length > 3) {
    //     newErrors[
    //       subject.c_sm_id
    //     ] = `${subject.name} marks cannot exceed 3 characters.`;
    //   }
    // });

    formData.classsubject?.forEach((subject) => {
      const markValue = marks[subject.c_sm_id];

      // Identify IDs for "MATHEMATICS STANDARD" and "BASIC MATHEMATICS"
      const standardMathId = 3; // c_sm_id for "MATHEMATICS STANDARD"
      const basicMathId = 7; // c_sm_id for "BASIC MATHEMATICS"

      // Special validation for "MATHEMATICS STANDARD" and "BASIC MATHEMATICS"
      if (
        subject.c_sm_id === standardMathId ||
        subject.c_sm_id === basicMathId
      ) {
        const standardMathValue = marks[standardMathId];
        const basicMathValue = marks[basicMathId];

        // If both are empty
        if (!standardMathValue && !basicMathValue) {
          newErrors[
            standardMathId
          ] = `Either "standard maths" or "basic maths" marks are required.`;
          newErrors[
            basicMathId
          ] = `Either "standard maths" or "basic maths" marks are required.`;
        }

        // If both are filled
        if (
          standardMathValue &&
          basicMathValue &&
          (standardMathValue !== "" || basicMathValue !== "")
        ) {
          newErrors[
            standardMathId
          ] = `Only one of "standard maths" or "basic maths" can be filled.`;
          newErrors[
            basicMathId
          ] = `Only one of "standard maths" or "basic maths" can be filled.`;
        }

        // Skip further validation for these two fields here
        return;
      }

      // General validation for other fields
      if (markValue === undefined || markValue === "" || markValue === 0) {
        newErrors[subject.c_sm_id] = `Marks are required.`;
      } else if (isNaN(markValue)) {
        newErrors[subject.c_sm_id] = `Marks should be numeric.`;
      } else if (parseFloat(markValue) > 100 || parseFloat(markValue) < 1) {
        newErrors[
          subject.c_sm_id
        ] = `${subject.name} Marks should not exceed 100.`;
      }
    });

    // Validate marks for each subject
    // formData.classsubject?.forEach((subject) => {
    //   const markValue = marks[subject.c_sm_id];
    //   console.log("marks", markValue);

    //   if (markValue === undefined || markValue === "" || markValue === 0) {
    //     newErrors[subject.c_sm_id] = `Marks are required.`;
    //   } else if (isNaN(markValue)) {
    //     newErrors[subject.c_sm_id] = `Marks should be numeric.`;
    //   } else if (parseFloat(markValue) > 100 || parseFloat(markValue) < 1) {
    //     newErrors[
    //       subject.c_sm_id
    //     ] = `${subject.name} Marks should not exceed 100.`;
    //     //  `${subject.name} Marks should not exceed 100.
    //   }
    // });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

    // Format date fields and handle API submission
    // const formattedFormData = {
    //   ...formData,
    //   date: formatDateString(formData.date),
    // };
    const dataToSubmit = prepareSubmissionData();
    console.log("dataTosubmkit", dataToSubmit);
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.post(
        `${API_URL}/api/save_pdfpercentagebonafide`,
        dataToSubmit,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      if (response.status === 200) {
        toast.success("Percentage Certificate Created successfully!");
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
        setSelectedStudent(null);

        setTimeout(() => setParentInformation(null), 3000);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(
        "An error occurred while Creating the Percentage Certificate."
      );

      if (error.response && error.response.data) {
        setBackendErrors(error.response.data);
      } else {
        toast.error("Unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <ToastContainer />
      <div className="     w-full md:container mt-4">
        {/* Search Section */}
        <div className="w-[95%] flex justify-center flex-col md:flex-row gap-x-1  bg-white rounded-lg border border-gray-400 shadow-md mx-auto mt-10 p-6">
          <div className="w-full md:w-[99%] flex md:flex-row justify-between items-center">
            <div className="w-full flex flex-col gap-y-2 md:gap-y-0 md:flex-row">
              <div className="w-full gap-x-14 md:gap-x-6 md:justify-start my-1 md:my-4 flex md:flex-row">
                <label
                  className="text-md mt-1.5 mr-1 md:mr-0"
                  htmlFor="classSelect"
                >
                  Class
                </label>
                <div className="w-full md:w-[50%]">
                  <Select
                    id="classSelect"
                    value={selectedClass}
                    onChange={handleClassSelect}
                    options={classOptions}
                    placeholder={
                      loadingClasses ? "Loading classes..." : "Select"
                    }
                    isSearchable
                    isClearable
                    className="text-sm"
                    isDisabled={loadingClasses}
                  />
                </div>
              </div>

              <div className="w-full gap-x-6 relative left-0 md:-left-[5%] justify-between md:w-[98%] my-1 md:my-4 flex md:flex-row">
                <label
                  className="md:w-[50%] text-md mt-1.5"
                  htmlFor="studentSelect"
                >
                  Student Name <span className="text-red-500">*</span>
                </label>
                <div className="w-full md:w-[80%]">
                  <Select
                    id="studentSelect"
                    value={selectedStudent}
                    onChange={handleStudentSelect}
                    options={studentOptions}
                    placeholder={
                      loadingStudents ? "Loading students..." : "Select"
                    }
                    isSearchable
                    isClearable
                    className="text-sm"
                    isDisabled={loadingStudents}
                  />
                  {nameError && (
                    <div className="h-8 relative ml-1 text-danger text-xs">
                      {nameError}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="search"
                onClick={handleSearch}
                style={{ backgroundColor: "#2196F3" }}
                className={`my-1 md:my-4 btn h-10 w-18 md:w-auto btn-primary text-white font-bold py-1 border-1 border-blue-500 px-4 rounded ${
                  loadingForSearch ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loadingForSearch}
              >
                {loadingForSearch ? (
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
                  "Search"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Form Section - Displayed when parentInformation is fetched */}
        {parentInformation && (
          <div className=" w-full  md:container mx-auto py-4 p-4 px-4  ">
            <div className="    card  px-3 rounded-md ">
              {/* <div className="card p-4 rounded-md "> */}

              <div className=" card-header mb-4 flex justify-between items-center  ">
                <h5 className="text-gray-700 mt-1 text-md lg:text-lg">
                  Student Information
                </h5>
                {/*
                <RxCross1
                  className="float-end relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                  onClick={() => {
                    setErrors({});
                    navigate("/careTacker");
                  }}
                /> */}
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

              <form
                onSubmit={handleSubmit}
                className=" w-full gap-x-1 md:gap-x-14  gap-y-1   overflow-x-hidden shadow-md p-4  bg-gray-50 mb-4"
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
                      <label
                        htmlFor="sr_no"
                        className="block font-bold text-xs mb-2"
                      >
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
                        htmlFor="date"
                        className="block font-bold text-xs mb-2"
                      >
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
                    Academic Performance{" "}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Dynamically generated input fields for subjects */}
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
                          //   placeholder="Enter marks"
                          value={marks[subject.c_sm_id] || ""}
                          onChange={(e) =>
                            handleMarksChange(subject.c_sm_id, e.target.value)
                          }
                          maxLength={3}
                          className="block  border w-full border-gray-900 rounded-md py-1 px-3  bg-white shadow-inner"
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
                      <label
                        htmlFor="total"
                        className="block font-bold text-xs mb-2"
                      >
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
                      "Generate PDF"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePercentageCertificate;
