import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
// import "./AllotGRNumbers.module.CSS";
const AllotGRNumbers = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentForStudent, setSelectedStudentForStudent] =
    useState(null);
  const [classesforForm, setClassesforForm] = useState([]);

  const [classIdForSearch, setClassIdForSearch] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const [nameError, setNameError] = useState("");
  const [nameErrorForClass, setNameErrorForClass] = useState("");
  const [nameErrorForDivision, setNameErrorForDivision] = useState("");
  const [nameErrorForStudent, setNameErrorForStudent] = useState("");
  const [nameErrorForClassForStudent, setNameErrorForClassForStudent] =
    useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedClassForStudent, setSelectedClassForStudent] = useState(null);
  const [studentInformation, setstudentInformation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingForSearch, setLoadingForSearch] = useState(false);

  const navigate = useNavigate();

  // for form
  const [errors, setErrors] = useState({});
  const [backendErrors, setBackendErrors] = useState({});

  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingDivision, setLoadingDivision] = useState(false);
  const [divisionforForm, setDivisionForForm] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [editedStudents, setEditedStudents] = useState({});
  const [error, setError] = useState(null);
  const [invalidField, setInvalidField] = useState(null);

  const studentRefs = useRef({});

  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/getClassList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(response.data)) {
        setClassesforForm(response.data);
      } else {
        toast.error("Unexpected Data Format");
      }
    } catch (error) {
      toast.error("Error fetching classes");
      console.error("Error fetching classes", error);
    } finally {
      setLoadingClasses(false);
    }
  };

  const classOptions = useMemo(
    () =>
      classesforForm.map((cls) => ({
        value: cls.class_id,
        label: cls.name,
      })),
    [classesforForm]
  );

  const fetchDivisions = async (classId) => {
    try {
      setLoadingDivision(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/get_divisions/${classId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Divisions API Response:", response.data); // Debug log

      // Check if the 'divisions' key exists and contains an array
      if (Array.isArray(response.data.divisions)) {
        setDivisionForForm(response.data.divisions); // Set divisions if valid
      } else {
        toast.error("Unexpected Data Format.");
        setDivisionForForm([]); // Fallback to empty array
      }
    } catch (error) {
      toast.error("Error fetching divisions");
      console.error("Error fetching divisions", error);
    } finally {
      setLoadingDivision(false);
    }
  };

  const divisionOptions = useMemo(() => {
    if (!Array.isArray(divisionforForm)) return [];
    return divisionforForm.map((div) => ({
      value: div.section_id, // Using 'section_id' as the value
      label: div.name, // Using 'name' as the label
    }));
  }, [divisionforForm]);

  const handleClassSelect = (selectedOption) => {
    setSelectedClass(selectedOption);
    // setClassError("");

    setSelectedDivision(null); // Reset division dropdown
    setDivisionForForm([]); // Clear division options
    setClassIdForSearch(selectedOption?.value);

    if (selectedOption) {
      fetchDivisions(selectedOption.value); // Fetch divisions for the selected class
    }
  };

  const handleDivisionSelect = (selectedOption) => {
    setSelectedDivision(selectedOption); // Ensure correct value is set
  };

  const handleSearch = async () => {
    // Reset error messages
    setNameError("");
    setSearchTerm("");
    setNameErrorForClass("");
    setNameErrorForDivision("");
    // setNameErrorForClassForStudent("");
    setNameErrorForStudent("");
    setErrors({}); // Clears all field-specific errors

    let hasError = false;
    if (!selectedClass) {
      setNameErrorForClass("Please select a class.");
      hasError = true;
    }

    if (!selectedDivision) {
      setNameErrorForDivision("Please select a division.");
      hasError = true;
    }

    if (hasError) return;

    try {
      setstudentInformation(null);
      // setSelectedStudentForStudent(null);
      // setSelectedStudentForStudent([]);
      setSelectedClassForStudent(null);
      setSelectedClassForStudent([]);
      setSelectedStudents([]);
      setSelectAll(false);
      setLoadingForSearch(true); // Start loading
      const token = localStorage.getItem("authToken");

      const sectionId = selectedDivision?.value;
      console.log("Section ID:", sectionId);

      if (!sectionId) {
        toast.error("Invalid division selection.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/get_studentallotgrno/${sectionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log("response.data", response.data);

      if (response?.data) {
        const fetchedData = response?.data;
        // console.log("fetched data", fetchedData);
        // console.log("Response.data.data", response.data.data);
        setstudentInformation(response?.data?.data);
      } else {
        toast.error("No data found for the selected class.");
      }
    } catch (error) {
      console.log("Error:", error);
      console.log("Error Response:", error.response);
    } finally {
      setLoadingForSearch(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      if (!studentInformation?.length) {
        alert("No student data to update.");
        toast.error("All fields are required.");
        return;
      }

      let firstInvalidField = null;
      const regNoCount = {}; // Track occurrences of GR numbers
      const aadhaarCount = {}; // Track occurrences of Aadhaar numbers
      const errors = {}; // Store errors for validation

      // Count occurrences of GR numbers and Aadhaar numbers
      studentInformation.forEach((student) => {
        if (student.reg_no) {
          regNoCount[student.reg_no] = (regNoCount[student.reg_no] || 0) + 1;
        }
        if (student.stu_aadhaar_no) {
          aadhaarCount[student.stu_aadhaar_no] =
            (aadhaarCount[student.stu_aadhaar_no] || 0) + 1;
        }
      });

      // Validate fields
      const updatedStudentInformation = studentInformation.map((student) => {
        let studentHasError = false;

        // Validate empty fields
        ["admission_date"].forEach((field) => {
          if (!student[field]?.trim()) {
            studentHasError = true;
            errors[`${student.student_id}-${field}`] =
              "This field cannot be empty";
          }
        });

        // Check for duplicate GR Number
        if (student.reg_no && regNoCount[student.reg_no] > 1) {
          studentHasError = true;
          errors[`${student.student_id}-reg_no`] = "GR number must be unique";
        }

        // Check for duplicate Aadhaar Number
        if (
          student.stu_aadhaar_no &&
          aadhaarCount[student.stu_aadhaar_no] > 1
        ) {
          studentHasError = true;
          errors[`${student.student_id}-stu_aadhaar_no`] =
            "Aadhaar number must be unique";
        }

        return { ...student, hasError: studentHasError };
      });

      // Initialize a Set to store unique error messages
      const errorMessages = new Set();

      // Highlight and scroll to the first invalid field
      const firstInvalidStudent = updatedStudentInformation.find(
        (student) => student.hasError
      );
      if (firstInvalidStudent) {
        Object.keys(errors).forEach((key) => {
          const fieldElement = studentRefs.current[key]; // Get the input element
          if (fieldElement) {
            fieldElement.classList.add("border-red-500", "ring-red-300"); // Highlight field
            if (!firstInvalidField) {
              firstInvalidField = fieldElement;
            }
          }
          errorMessages.add(errors[key]); // Collect unique error messages
        });

        if (firstInvalidField) {
          firstInvalidField.focus(); // Focus on the first invalid input
          firstInvalidField.scrollIntoView({
            behavior: "smooth",
            block: "center",
          }); // Smooth scroll
        }

        // Display toast messages for unique errors
        // if (errorMessages.size > 0) {
        //   toast.error(Array.from(errorMessages).join("\n"),
        //   {
        //     autoClose: 5000,
        //     position: "top-right",
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //   });
        // }

        return; // Stop form submission
      }

      // Proceed with API call if validation passes
      const response = await axios.put(
        `${API_URL}/api/update_studentallotgrno `,
        { students: updatedStudentInformation },
        { headers: { Authorization: ` Bearer ${token} ` } }
      );

      if (response.status === 200) {
        toast.success("Student details updated successfully!");
      } else {
        toast.error(
          `Failed to update student details. Status: ${response.status}`
        );
      }
    } catch (error) {
      console.log("Full API Error Response:", error.response);

      if (error.response?.status === 422) {
        const backendErrors = error.response.data;

        if (backendErrors.errors) {
          const formattedErrors = {};
          const errorMessages = new Set(); // Store unique error messages

          Object.entries(backendErrors.errors).forEach(([key, messages]) => {
            const match = key.match(/^students\.(\d+)\.(.+)$/);
            if (match) {
              const studentIndex = Number(match[1]);
              const fieldName = match[2];

              const studentId = studentInformation[studentIndex]?.student_id;
              if (studentId) {
                if (!formattedErrors[studentId]) {
                  formattedErrors[studentId] = {};
                }
                formattedErrors[studentId][fieldName] = messages[0];

                errorMessages.add(messages[0]); // Collect unique error messages
              }
            }
          });

          if (Object.keys(formattedErrors).length > 0) {
            setBackendErrors(formattedErrors);

            // Scroll to first backend error
            const firstErrorKey = Object.keys(formattedErrors)[0];
            const firstErrorFieldKey = Object.keys(
              formattedErrors[firstErrorKey]
            )[0];
            const firstErrorField =
              studentRefs.current[`${firstErrorKey}-${firstErrorFieldKey}`];

            if (firstErrorField) {
              firstErrorField.classList.add("border-red-500", "ring-red-300");
              firstErrorField.focus();
              firstErrorField.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }
        }
      } else {
        toast.error(
          `An error occurred: ${error.response?.data?.message || error.message}`
        );
      }
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const token = localStorage.getItem("authToken");
  //     if (!studentInformation?.length) {
  //       alert("No student data to update.");
  //       toast.error("All fields are required.");
  //       return;
  //     }

  //     let firstInvalidField = null;
  //     const regNoCount = {};
  //     const aadhaarCount = {};
  //     const errors = {};
  //     const errorMessages = new Set();

  //     // Count occurrences of GR numbers and Aadhaar numbers
  //     studentInformation.forEach((student) => {
  //       if (student.reg_no) {
  //         regNoCount[student.reg_no] = (regNoCount[student.reg_no] || 0) + 1;
  //       }
  //       if (student.stu_aadhaar_no) {
  //         aadhaarCount[student.stu_aadhaar_no] =
  //           (aadhaarCount[student.stu_aadhaar_no] || 0) + 1;
  //       }
  //     });

  //     // Validate fields
  //     const updatedStudentInformation = studentInformation.map((student) => {
  //       let studentHasError = false;

  //       // Validate required fields only if they are needed
  //       ["reg_no", "stu_aadhaar_no", "admission_date"].forEach((field) => {
  //         if (student[field] === undefined || student[field]?.trim() === "") {
  //           studentHasError = true;
  //           errors[`${student.student_id}-${field}`] = "This field cannot be empty";
  //           errorMessages.add("All required fields must be filled.");
  //         }
  //       });

  //       // Check for duplicate GR Number
  //       if (student.reg_no && regNoCount[student.reg_no] > 1) {
  //         studentHasError = true;
  //         errors[`${student.student_id}-reg_no`] = "GR number must be unique";
  //         errorMessages.add("Duplicate GR numbers found.");
  //       }

  //       // Check for duplicate Aadhaar Number
  //       if (student.stu_aadhaar_no && aadhaarCount[student.stu_aadhaar_no] > 1) {
  //         studentHasError = true;
  //         errors[`${student.student_id}-stu_aadhaar_no`] = "Aadhaar number must be unique";
  //         errorMessages.add("Duplicate Aadhaar numbers found.");
  //       }

  //       return { ...student, hasError: studentHasError };
  //     });

  //     // Highlight and scroll to the first invalid field
  //     const firstInvalidStudent = updatedStudentInformation.find(
  //       (student) => student.hasError
  //     );

  //     if (firstInvalidStudent) {
  //       Object.keys(errors).forEach((key) => {
  //         const fieldElement = studentRefs.current[key];
  //         if (fieldElement) {
  //           fieldElement.classList.add("border-red-500", "ring-red-300");
  //           if (!firstInvalidField) {
  //             firstInvalidField = fieldElement;
  //           }
  //         }
  //       });

  //       if (firstInvalidField) {
  //         firstInvalidField.focus();
  //         firstInvalidField.scrollIntoView({ behavior: "smooth", block: "center" });
  //       }

  //       toast.error(Array.from(errorMessages).join("\n"), {
  //         autoClose: 5000,
  //         position: "top-right",
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //       });

  //       return;
  //     }

  //     // Proceed with API call if validation passes
  //     const response = await axios.put(
  //       `${API_URL}/api/update_studentallotgrno`,
  //       { students: updatedStudentInformation },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     if (response.status === 200) {
  //       toast.success("Student details updated successfully!");
  //     } else {
  //       toast.error(`Failed to update student details. Status: ${response.status}`);
  //     }
  //   } catch (error) {
  //     console.log("Full API Error Response:", error.response);

  //     if (error.response?.status === 422) {
  //       const backendErrors = error.response.data;

  //       if (backendErrors.errors) {
  //         const formattedErrors = {};
  //         const backendErrorMessages = new Set();

  //         Object.entries(backendErrors.errors).forEach(([key, messages]) => {
  //           const match = key.match(/^students\.(\d+)\.(.+)$/);
  //           if (match) {
  //             const studentIndex = Number(match[1]);
  //             const fieldName = match[2];

  //             const studentId = studentInformation[studentIndex]?.student_id;
  //             if (studentId) {
  //               if (!formattedErrors[studentId]) {
  //                 formattedErrors[studentId] = {};
  //               }
  //               formattedErrors[studentId][fieldName] = messages[0];
  //               backendErrorMessages.add(messages[0]);
  //             }
  //           }
  //         });

  //         if (Object.keys(formattedErrors).length > 0) {
  //           setBackendErrors(formattedErrors);

  //           // Scroll to first backend error
  //           const firstErrorKey = Object.keys(formattedErrors)[0];
  //           const firstErrorFieldKey = Object.keys(formattedErrors[firstErrorKey])[0];
  //           const firstErrorField = studentRefs.current[`${firstErrorKey}-${firstErrorFieldKey}`];

  //           if (firstErrorField) {
  //             firstErrorField.classList.add("border-red-500", "ring-red-300");
  //             firstErrorField.focus();
  //             firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
  //           }

  //           toast.error(Array.from(backendErrorMessages).join("\n"), {
  //             autoClose: 5000,
  //             position: "top-right",
  //             closeOnClick: true,
  //             pauseOnHover: true,
  //           });
  //         }
  //       }
  //     } else {
  //       toast.error(`An error occurred: ${error.response?.data?.message || error.message}`);
  //     }
  //   }
  // };

  const handleInputChange = (e, studentId, fieldName) => {
    const { value } = e.target;

    setstudentInformation((prevStudents) =>
      prevStudents.map((student) =>
        student.student_id === studentId || student.roll_no === studentId
          ? { ...student, [fieldName]: value, hasChanged: true }
          : student
      )
    );

    // Perform field-specific validation
    let error = "";

    if (fieldName === "reg_no") {
      if (!value) {
        // error = "GR number is required.";
      } else if (
        studentInformation.some(
          (student) =>
            student.reg_no === value && student.student_id !== studentId
        )
      ) {
        error = "GR number must be unique.";
      }
    }

    if (fieldName === "stu_aadhaar_no") {
      if (!value) {
        // error = "Aadhaar number is required.";
      } else if (!/^\d{12}$/.test(value)) {
        error = "Please enter 12 digits.";
      } else if (
        studentInformation.some(
          (student) =>
            student.stu_aadhaar_no === value && student.student_id !== studentId
        )
      ) {
        error = "Aadhaar Number must be unique.";
      }
    }

    // if (fieldName === "admission_date") {
    //   if (!value) {
    //     error = "Admission date is required.";
    //   } else if (isNaN(new Date(value).getTime())) {
    //     error = "Please enter a valid date.";
    //   }
    // }

    // Update the frontend validation errors
    setErrors((prevErrors) => ({
      ...prevErrors,
      [studentId]: {
        ...prevErrors[studentId],
        [fieldName]: error,
      },
    }));

    // ✅ Clear the backend error for this field when the user types
    setBackendErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (newErrors[studentId] && newErrors[studentId][fieldName]) {
        delete newErrors[studentId][fieldName];

        // If no more errors for this student, remove them from the object
        if (Object.keys(newErrors[studentId]).length === 0) {
          delete newErrors[studentId];
        }
      }
      return newErrors;
    });
  };

  const filteredParents = useMemo(() => {
    if (!Array.isArray(studentInformation)) return [];

    return studentInformation.filter((student) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (student.roll_no !== null &&
          student.roll_no.toString().toLowerCase().includes(searchLower)) ||
        student.full_name.toLowerCase().includes(searchLower) ||
        student.reg_no.toString().toLowerCase().includes(searchLower)
      );
    });
    // .sort((a, b) => (a.roll_no || 0) - (b.roll_no || 0)); // Sort by roll_no
  }, [studentInformation, searchTerm]);
  console.log("Filtered Students:", filteredParents);

  useEffect(() => {
    fetchClasses();
  }, [classIdForSearch]);

  const handleNavigation = () => {
    navigate("/dashboard");
  };

  return (
    <div>
      <ToastContainer />

      <div className="md:mx-auto md:w-[90%] p-4 bg-white mt-4 ">
        <div className=" w-full    flex justify-between items-center ">
          <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
            Allot GR No. and Aadhaar No.
          </h3>
          <RxCross1
            className="   text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
            type="button"
            onClick={handleNavigation}
          />
        </div>
        <div
          className=" relative  mb-8   h-1  mx-auto bg-red-700"
          style={{
            backgroundColor: "#C03078",
          }}
        ></div>
        <div className="w-full md:container mt-4">
          {/* Search Section */}
          <div className="pt-2 md:pt-4"></div>
          <div className="pt-8 w-full md:w-[70%]  relative ml-0 md:ml-[10%]  border-1 flex justify-start flex-col md:flex-row gap-x-1  bg-white rounded-lg mt-2 md:mt-6 p-2 ">
            {/* <h6 className=" w-[20%] float-start text-nowrap text-blue-600 mt-2.5"></h6> */}

            <div className="w-full flex md:flex-row justify-start items-center">
              <div className="w-full  flex flex-col gap-y-2 md:gap-y-0 md:flex-row">
                <div className="w-full gap-x-1 md:gap-x-6 md:justify-start my-1 md:my-4 flex md:flex-row ">
                  <label
                    className="text-md mt-1.5 mr-1 md:mr-0 inline-flex"
                    htmlFor="classSelect"
                  >
                    Class <span className="text-red-500">*</span>
                  </label>

                  <div className="w-full md:w-[30%]">
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
                      styles={{
                        menu: (provided) => ({
                          ...provided,
                          zIndex: 1050, // Set your desired z-index value
                        }),
                      }}
                      isDisabled={loadingClasses}
                    />
                    {nameErrorForClass && (
                      <div className="h-8 relative ml-1 text-danger text-xs">
                        {nameErrorForClass}
                      </div>
                    )}
                  </div>

                  <label
                    className="text-md mt-1.5 mr-1 md:mr-0 inline-flex"
                    htmlFor="divisionSelect"
                  >
                    Division <span className="text-red-500">*</span>
                  </label>

                  <div className="w-full md:w-[30%]">
                    <Select
                      id="divisionSelect"
                      value={selectedDivision}
                      onChange={handleDivisionSelect}
                      options={divisionOptions}
                      placeholder={
                        loadingClasses ? "Loading divisions..." : "Select"
                      }
                      isSearchable
                      isClearable
                      className="text-sm"
                      styles={{
                        menu: (provided) => ({
                          ...provided,
                          zIndex: 1050, // Set your desired z-index value
                        }),
                      }}
                      isDisabled={loadingDivision}
                    />
                    {nameErrorForDivision && (
                      <div className="h-8 relative ml-1 text-danger text-xs">
                        {nameErrorForDivision}
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
                    "Browse"
                  )}
                </button>
              </div>
            </div>
          </div>
          {/* Form Section - Displayed when studentInformation is fetched */}
          {studentInformation && (
            <div className="w-full md:container mx-auto py-4 px-4 ">
              <div className="card mx-auto w-full shadow-lg">
                <div className="p-1 px-3 bg-gray-100 flex justify-between items-center">
                  <h6 className="text-gray-700 mt-1   text-nowrap">
                    Select Students for allot GR & Aadhaar No.
                  </h6>
                  <div className="box-border flex md:gap-x-2  ">
                    <div className=" w-1/2 md:w-fit mr-1">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className=" relative w-[97%] h-1  mx-auto bg-red-700"
                  style={{
                    backgroundColor: "#C03078",
                  }}
                ></div>
                <div className="card-body w-full ">
                  <div className="h-96 lg:h-96 overflow-y-scroll lg:overflow-x-hidden w-full mx-auto">
                    <div className="bg-white rounded-lg shadow-xs">
                      <table className="min-w-full leading-normal table-auto">
                        <thead className=" ">
                          <tr className="bg-gray-200 ">
                            <th className="px-2 w-full md:w-[7%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Sr. No.
                            </th>
                            <th className="px-2 w-full md:w-[8%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Roll No
                            </th>
                            <th className="px-2 w-full md:w-[40%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Student Name
                            </th>
                            <th className="px-2 w-full md:w-[15%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              GR No.
                            </th>
                            <th className="px-2 w-full md:w-[10%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Admission Date
                            </th>
                            <th className="px-2 w-full md:w-[30%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Student Aadhaar No.
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredParents.length ? (
                            filteredParents.map((student, index) => (
                              <tr
                                key={student.student_id}
                                className={`${
                                  index % 2 === 0 ? "bg-white" : "bg-gray-100"
                                } hover:bg-gray-50`}
                              >
                                <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap relative top-2">
                                    {index + 1}
                                  </p>
                                </td>

                                <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm p-1">
                                  <p className="text-gray-900 whitespace-no-wrap relative top-2">
                                    {/* {console.log(
                                      "student roll no",
                                      student.roll_no
                                    )} */}
                                    {student.roll_no === 0
                                      ? "0"
                                      : student.roll_no || ""}
                                  </p>
                                </td>
                                <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap relative top-2">
                                    {student.full_name || ""}
                                  </p>
                                </td>

                                <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                                  <input
                                    type="text"
                                    ref={(el) =>
                                      (studentRefs.current[
                                        `${student.student_id}-reg_no`
                                      ] = el)
                                    }
                                    className={`text-center w-full px-2 py-1 border rounded outline-none focus:ring focus:ring-blue-300 ${
                                      errors[student.student_id]?.reg_no
                                        ? "border-red-500 ring-red-300"
                                        : ""
                                    }`}
                                    value={student.reg_no || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        e,
                                        student.student_id,
                                        "reg_no"
                                      )
                                    }
                                  />
                                  {errors[student.student_id]?.reg_no && (
                                    <span className="text-red-500 text-xs block mt-1">
                                      {errors[student.student_id]?.reg_no}
                                    </span>
                                  )}
                                  {backendErrors[student.student_id]
                                    ?.reg_no && (
                                    <span className="text-red-500 text-xs block mt-1">
                                      {
                                        backendErrors[student.student_id]
                                          ?.reg_no
                                      }
                                    </span>
                                  )}
                                </td>

                                <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                                  <input
                                    type="date"
                                    ref={(el) =>
                                      (studentRefs.current[
                                        `${student.student_id}-admission_date`
                                      ] = el)
                                    }
                                    className={`text-center w-full px-2 py-1 border rounded outline-none focus:ring focus:ring-blue-300 ${
                                      errors[student.student_id]?.admission_date
                                        ? "border-red-500 ring-red-300"
                                        : ""
                                    }`}
                                    value={student.admission_date || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        e,
                                        student.student_id,
                                        "admission_date"
                                      )
                                    }
                                    // max={student.admission_date || ""}
                                  />
                                  {errors[student.student_id]
                                    ?.admission_date && (
                                    <span className="text-red-500 text-xs block mt-1">
                                      {
                                        errors[student.student_id]
                                          ?.admission_date
                                      }
                                    </span>
                                  )}
                                </td>

                                <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                                  <input
                                    type="text"
                                    ref={(el) =>
                                      (studentRefs.current[
                                        `${student.student_id}-stu_aadhaar_no`
                                      ] = el)
                                    }
                                    className={`text-center w-full px-2 py-1 border rounded outline-none focus:ring focus:ring-blue-300 ${
                                      errors[student.student_id]?.stu_aadhaar_no
                                        ? "border-red-500 ring-red-300"
                                        : ""
                                    }`}
                                    value={student.stu_aadhaar_no || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        e,
                                        student.student_id,
                                        "stu_aadhaar_no"
                                      )
                                    }
                                  />
                                  {errors[student.student_id]
                                    ?.stu_aadhaar_no && (
                                    <span className="text-red-500 text-xs block mt-1">
                                      {
                                        errors[student.student_id]
                                          ?.stu_aadhaar_no
                                      }
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <div className=" absolute left-[1%] w-[100%]  text-center flex justify-center items-center mt-14">
                              <div className=" text-center text-xl text-red-700">
                                Oops! No data found..
                              </div>
                            </div>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>{" "}
                  {/* <div className="text-center">
                    <p className="text-blue-500 font-semibold mt-1">
                      Selected Students:{" "}
                      <h6 className=" inline text-pink-600">
                        {selectedStudents.length}
                      </h6>
                    </p>
                  </div> */}
                  <div className="col-span-3 mb-2  text-right mt-2">
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
                          Updating...
                        </span>
                      ) : (
                        "Update"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllotGRNumbers;
