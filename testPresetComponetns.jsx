import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import "./AllotGRNumbers";
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

  const studentRefs = useRef({});

  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);
      setLoadingStudents(true);
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
      setLoadingStudents(false);
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
      setLoadingStudents(true);
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
      setLoadingStudents(false);
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const token = localStorage.getItem("authToken");
  //     console.log("token:", token);
  //     console.log("studentInformation:", studentInformation);

  //     if (!studentInformation || studentInformation.length === 0) {
  //       alert("No student data to update.");
  //       return;
  //     }

  //     let hasEmptyFields = false;
  //     let firstInvalidField = null;

  //     // Step 1: Check for missing fields
  //     studentInformation.forEach((student) => {
  //       ["reg_no", "stu_aadhaar_no", "admission_date"].forEach((field) => {
  //         const refKey = `${student.student_id}-${field}`;
  //         const inputField = studentRefs.current[refKey];

  //         if (!student[field] || student[field].trim() === "") {
  //           hasEmptyFields = true;

  //           if (inputField) {
  //             inputField.classList.add("border-red-500", "ring-red-300");

  //             if (!firstInvalidField) {
  //               firstInvalidField = inputField; // Store first invalid field
  //             }
  //           }
  //         } else {
  //           if (inputField) {
  //             inputField.classList.remove("border-red-500", "ring-red-300");
  //           }
  //         }
  //       });
  //     });

  //     // Step 2: Check for duplicate reg_no values
  //     const regNoMap = new Map();
  //     let hasDuplicates = false;

  //     studentInformation.forEach((student) => {
  //       if (student.reg_no) {
  //         if (regNoMap.has(student.reg_no)) {
  //           hasDuplicates = true;

  //           const firstIndex = regNoMap.get(student.reg_no);
  //           const duplicateIndex = student.student_id;

  //           const firstField = studentRefs.current[`${firstIndex}-reg_no`];
  //           const duplicateField =
  //             studentRefs.current[`${duplicateIndex}-reg_no`];

  //           if (firstField)
  //             firstField.classList.add("border-red-500", "ring-red-300");
  //           if (duplicateField)
  //             duplicateField.classList.add("border-red-500", "ring-red-300");

  //           if (!firstInvalidField)
  //             firstInvalidField = firstField || duplicateField;
  //         } else {
  //           regNoMap.set(student.reg_no, student.student_id);
  //         }
  //       }
  //     });

  //     if (hasDuplicates) {
  //       toast.error("Duplicate GR Numbers found. Please correct them.");
  //     }

  //     // Scroll to first invalid field
  //     if (firstInvalidField) {
  //       firstInvalidField.focus();
  //       firstInvalidField.scrollIntoView({
  //         behavior: "smooth",
  //         block: "center",
  //       });
  //       return; // Stop form submission
  //     }

  //     const requestData = { students: studentInformation };
  //     console.log("request data", requestData);

  //     const response = await axios.put(
  //       `${API_URL}/api/update_studentallotgrno`,
  //       requestData,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     console.log("Full API Response:", response);

  //     if (response.status === 200) {
  //       toast.success("Student details updated successfully!");
  //       console.log(response.data);
  //     } else {
  //       toast.error(
  //         `Failed to update student details. Status: ${response.status}`
  //       );
  //     }
  //   } catch (error) {
  //     if (error.response?.status === 422) {
  //       console.log("Full Validation Error Response:", error.response.data);
  //       const errorMessages = error.response.data.errors;
  //       const studentsData = error.response.data.students || [];

  //       if (errorMessages) {
  //         const displayedMessages = new Set();

  //         Object.keys(errorMessages).forEach((key) => {
  //           const keyParts = key.split(".");
  //           const studentIndex =
  //             keyParts.length > 1 ? parseInt(keyParts[1], 10) : null;
  //           let rollNo = "Unknown";

  //           if (!isNaN(studentIndex) && studentsData[studentIndex]) {
  //             console.log(
  //               `Student Found at Index ${studentIndex}:`,
  //               studentsData[studentIndex]
  //             );
  //             rollNo = studentsData[studentIndex].roll_no ?? "Unknown";
  //           } else {
  //             console.warn(
  //               `Invalid Student Index: ${studentIndex}`,
  //               studentsData
  //             );
  //           }

  //           errorMessages[key].forEach((msg) => {
  //             let customMsg = msg;

  //             if (msg.toLowerCase().includes("required")) {
  //               customMsg = `The student's roll number ${rollNo} field is required.`;
  //             }

  //             if (!displayedMessages.has(customMsg)) {
  //               console.log(`Toast Error: ${customMsg}`);
  //               toast.error(customMsg);
  //               displayedMessages.add(customMsg);
  //             }
  //           });

  //           if (
  //             key.includes("reg_no") ||
  //             key.includes("stu_aadhaar_no") ||
  //             key.includes("admission_date")
  //           ) {
  //             const refKey = `${studentsData[studentIndex]?.student_id}-${key
  //               .split(".")
  //               .pop()}`;
  //             const field = studentRefs.current[refKey];

  //             if (field) {
  //               field.classList.add("border-red-500", "ring-red-300");
  //               field.focus();
  //               field.scrollIntoView({ behavior: "smooth", block: "center" });
  //             }
  //           }
  //         });
  //       } else {
  //         toast.error("Validation error occurred.");
  //       }
  //     } else {
  //       toast.error(
  //         `An error occurred: ${error.response?.data?.message || error.message}`
  //       );
  //     }
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const token = localStorage.getItem("authToken");
  //     console.log("token:", token);
  //     console.log("studentInformation:", studentInformation);

  //     if (!studentInformation || studentInformation.length === 0) {
  //       alert("No student data to update.");
  //       return;
  //     }

  //     let hasEmptyFields = false;
  //     let firstInvalidField = null;

  //     studentInformation.forEach((student, index) => {
  //       ["reg_no", "stu_aadhaar_no", "admission_date"].forEach((field) => {
  //         const refKey = `${student.student_id}-${field}`;
  //         const inputField = studentRefs.current[refKey];

  //         if (!student[field] || student[field].trim() === "") {
  //           hasEmptyFields = true;

  //           if (inputField) {
  //             inputField.classList.add("border-red-500", "ring-red-300");

  //             if (!firstInvalidField) {
  //               firstInvalidField = inputField; // Store first invalid field
  //             }
  //           }
  //         } else {
  //           if (inputField) {
  //             inputField.classList.remove("border-red-500", "ring-red-300");
  //           }
  //         }
  //       });
  //     });

  //     // Step 2: Handle Duplicate reg_no
  //     const regNoMap = new Map();
  //     let hasDuplicates = false;

  //     studentInformation.forEach((student) => {
  //       if (student.reg_no) {
  //         if (regNoMap.has(student.reg_no)) {
  //           hasDuplicates = true;

  //           const firstIndex = regNoMap.get(student.reg_no);
  //           const duplicateIndex = student.student_id;

  //           const firstField = studentRefs.current[`${firstIndex}-reg_no`];
  //           const duplicateField = studentRefs.current[`${duplicateIndex}-reg_no`];

  //           if (firstField) firstField.classList.add("border-red-500", "ring-red-300");
  //           if (duplicateField) duplicateField.classList.add("border-red-500", "ring-red-300");

  //           if (!firstInvalidField) firstInvalidField = firstField || duplicateField;
  //         } else {
  //           regNoMap.set(student.reg_no, student.student_id);
  //         }
  //       }
  //     });

  //     if (hasDuplicates) {
  //       toast.error("Duplicate GR Numbers found. Please correct them.");
  //     }

  //     // Scroll to first invalid field or duplicate reg_no field
  //     if (firstInvalidField) {
  //       firstInvalidField.focus();
  //       firstInvalidField.scrollIntoView({ behavior: "smooth", block: "center" });
  //       return; // Stop form submission
  //     }

  //     const requestData = { students: studentInformation };
  //     console.log("request data", requestData);

  //     const response = await axios.put(`${API_URL}/api/update_studentallotgrno`, requestData, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     console.log("Full API Response:", response);

  //     if (response.status === 200) {
  //       toast.success("Student details updated successfully!");
  //       console.log(response.data);
  //     } else {
  //       toast.error(`Failed to update student details. Status: ${response.status}`);
  //     }
  //   } catch (error) {
  //     if (error.response?.status === 422) {
  //       console.log("Full Validation Error Response:", error.response.data);
  //       const errorMessages = error.response.data.errors;
  //       const studentsData = error.response.data.students || [];

  //       if (errorMessages) {
  //         const displayedMessages = new Set();

  //         Object.keys(errorMessages).forEach((key) => {
  //           const keyParts = key.split(".");
  //           const studentIndex = keyParts.length > 1 ? parseInt(keyParts[1], 10) : null;
  //           let rollNo = "Unknown";

  //           if (!isNaN(studentIndex) && studentsData[studentIndex]) {
  //             console.log(`Student Found at Index ${studentIndex}:`, studentsData[studentIndex]);
  //             rollNo = studentsData[studentIndex].roll_no ?? "Unknown";
  //           } else {
  //             console.warn(`Invalid Student Index: ${studentIndex}`, studentsData);
  //           }

  //           errorMessages[key].forEach((msg) => {
  //             let customMsg = msg;

  //             if (msg.toLowerCase().includes("required")) {
  //               customMsg = `The student's roll number ${rollNo} field is required.`;
  //             }

  //             if (!displayedMessages.has(customMsg)) {
  //               console.log(`Toast Error: ${customMsg}`);
  //               toast.error(customMsg);
  //               displayedMessages.add(customMsg);

  //               // 🔹 Scroll into view for the reg_no duplicate error
  //               if (key.includes("reg_no")) {
  //                 const refKey = `${studentsData[studentIndex]?.student_id}-${key.split(".").pop()}`;
  //                 const field = studentRefs.current[refKey];

  //                 if (field) {
  //                   field.classList.add("border-red-500", "ring-red-300");
  //                   field.focus();
  //                   field.scrollIntoView({ behavior: "smooth", block: "center" });
  //                 }
  //               }
  //             }
  //           });
  //         });
  //       } else {
  //         toast.error("Validation error occurred.");
  //       }
  //     } else {
  //       toast.error(`An error occurred: ${error.response?.data?.message || error.message}`);
  //     }
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      console.log("token:", token);
      console.log("studentInformation:", studentInformation);

      if (!studentInformation || studentInformation.length === 0) {
        alert("No student data to update.");
        return;
      }

      let hasEmptyFields = false;
      let firstInvalidField = null;

      // Step 1: Check for empty fields
      studentInformation.forEach((student) => {
        ["reg_no", "stu_aadhaar_no", "admission_date"].forEach((field) => {
          const refKey = `${student.student_id}-${field}`;
          const inputField = studentRefs.current[refKey];

          if (!student[field] || student[field].trim() === "") {
            hasEmptyFields = true;

            if (inputField) {
              inputField.classList.add("border-red-500", "ring-red-300");

              if (!firstInvalidField) {
                firstInvalidField = inputField; // Store first invalid field
              }
            }
          } else {
            if (inputField) {
              inputField.classList.remove("border-red-500", "ring-red-300");
            }
          }
        });
      });

      // Step 2: Handle Duplicate reg_no
      const regNoMap = new Map();
      let hasDuplicatesSameClass = false;
      let hasDuplicatesDifferentClass = false;
      let firstDuplicateField = null;

      studentInformation.forEach((student) => {
        if (student.reg_no) {
          if (regNoMap.has(student.reg_no)) {
            const existingStudent = regNoMap.get(student.reg_no);

            if (
              existingStudent.class_id === student.class_id &&
              existingStudent.division_id === student.division_id
            ) {
              hasDuplicatesSameClass = true;
            } else {
              hasDuplicatesDifferentClass = true;
            }

            // Highlight the duplicate fields
            const firstField =
              studentRefs.current[`${existingStudent.student_id}-reg_no`];
            const duplicateField =
              studentRefs.current[`${student.student_id}-reg_no`];

            if (firstField)
              firstField.classList.add("border-red-500", "ring-red-300");
            if (duplicateField)
              duplicateField.classList.add("border-red-500", "ring-red-300");

            if (!firstDuplicateField)
              firstDuplicateField = firstField || duplicateField;
          } else {
            regNoMap.set(student.reg_no, student);
          }
        }
      });

      // Show toast messages and scroll to invalid fields
      if (hasDuplicatesSameClass) {
        toast.error(
          "Duplicate Registration Numbers found in the same class and division. Please correct them."
        );
      }

      if (hasDuplicatesDifferentClass) {
        toast.error(
          "Duplicate Registration Number found in a different class or division."
        );
      }

      // Scroll to the first invalid or duplicate field
      const scrollTarget = firstInvalidField || firstDuplicateField;
      if (scrollTarget) {
        scrollTarget.focus();
        scrollTarget.scrollIntoView({ behavior: "smooth", block: "center" });
        return; // Stop form submission
      }

      // Step 3: Submit Data
      const requestData = { students: studentInformation };
      console.log("request data", requestData);

      const response = await axios.put(
        `${API_URL}/api/update_studentallotgrno`,
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Full API Response:", response);

      if (response.status === 200) {
        toast.success("Student details updated successfully!");
        console.log(response.data);
      } else {
        toast.error(
          `Failed to update student details. Status: ${response.status}`
        );
      }
    } catch (error) {
      if (error.response?.status === 422) {
        console.log("Full Validation Error Response:", error.response.data);
        const errorMessages = error.response.data.errors;
        const studentsData = error.response.data.students || [];
        console.log("errorMessages", errorMessages);
        if (errorMessages) {
          const displayedMessages = new Set();

          Object.keys(errorMessages).forEach((key) => {
            const keyParts = key.split(".");
            const studentIndex =
              keyParts.length > 1 ? parseInt(keyParts[1], 10) : null;
            let rollNo = "Unknown";

            if (!isNaN(studentIndex) && studentsData[studentIndex]) {
              console.log(
                `Student Found at Index ${studentIndex}:`,
                studentsData[studentIndex]
              );
              rollNo = studentsData[studentIndex].roll_no ?? "Unknown";
            } else {
              console.warn(
                `Invalid Student Index: ${studentIndex}`,
                studentsData
              );
            }
            console.log("displayedMessages", displayedMessages);
            errorMessages[key].forEach((msg) => {
              let customMsg = msg;

              if (msg.toLowerCase().includes("required")) {
                customMsg = `The student's roll number ${rollNo} field is required.`;
              }

              if (!displayedMessages.has(customMsg)) {
                console.log(`Toast Error: ${customMsg}`);
                toast.error(customMsg);
                displayedMessages.add(customMsg);

                // 🔹 Scroll into view for the reg_no duplicate error
                if (key.includes("reg_no")) {
                  const refKey = `${
                    studentsData[studentIndex]?.student_id
                  }-${key.split(".").pop()}`;
                  const field = studentRefs.current[refKey];

                  if (field) {
                    field.classList.add("border-red-500", "ring-red-300");
                    field.focus();
                    field.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }
                }
              }
            });
          });
        } else {
          toast.error("Validation error occurred.");
        }
      } else {
        toast.error(
          `An error occurred: ${error.response?.data?.message || error.message}`
        );
      }
    }
  };

  const handleInputChange = (e, studentId, fieldName) => {
    const { value } = e.target;

    // Update the student's field value
    setstudentInformation((prevStudents) =>
      prevStudents.map((student) =>
        student.student_id === studentId || student.roll_no === studentId
          ? { ...student, [fieldName]: value }
          : student
      )
    );

    // Perform field-specific validation
    let error = "";

    // Field-specific validation logic
    if (fieldName === "reg_no") {
      if (!value) {
        error = "GR number is required.";
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
        error = "Aadhaar number is required.";
      } else if (!/^\d{12}$/.test(value)) {
        error = "Please enter 12 digit.";
      }
    }

    // Update the errors state with the specific field error
    setErrors((prevErrors) => ({
      ...prevErrors,
      [studentId]: {
        ...prevErrors[studentId],
        [fieldName]: error,
      },
    }));
  };

  // const validate = () => {
  //   let hasError = false;
  //   let newErrors = {};
  //   let regNoSet = new Set(); // To track unique registration numbers

  //   studentInformation.forEach((student) => {
  //     // Validate reg_no: Must not be empty and must be unique
  //     if (!student.reg_no) {
  //       newErrors[student.student_id] = "Registration number is required.";
  //       hasError = true;
  //     } else if (regNoSet.has(student.reg_no)) {
  //       newErrors[student.student_id] = "Registration number must be unique.";
  //       hasError = true;
  //     } else {
  //       regNoSet.add(student.reg_no);
  //     }

  //     if (!student.stu_aadhaar_no) {
  //       newErrors[student.student_id] = "Aadhaar number is required.";
  //       hasError = true;
  //     } else if (!/^\d{12}$/.test(student.stu_aadhaar_no)) {
  //       newErrors[student.student_id] =
  //         "Aadhaar number must be exactly 12 digits.";
  //       hasError = true;
  //     } else {
  //       newErrors[student.student_id] = ""; // Clear any previous error for Aadhaar
  //     }

  //     // Additional field validations can be added here if needed
  //   });

  //   setErrors(newErrors);
  //   return !hasError;
  // };

  const filteredParents = useMemo(() => {
    if (!Array.isArray(studentInformation)) return [];

    return studentInformation.filter((student) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (student.roll_no !== null &&
          student.roll_no.toString().toLowerCase().includes(searchLower)) ||
        `${student.full_name || ""}`.toLowerCase().includes(searchLower)
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

          <div className="     w-full md:container mt-4">
            {/* Search Section */}
            <div className=" w-full md:w-[65%] border-1 flex justify-center flex-col md:flex-row gap-x-1  bg-white rounded-lg relative md:left-16 left-0  mt-1 p-2 ">
              <div className="w-full   flex md:flex-row justify-between items-center">
                <div className="w-full  flex flex-col gap-y-2 md:gap-y-0 md:flex-row">
                  <div className="w-full gap-x-14 md:gap-x-6 md:justify-start my-1 md:my-4 flex md:flex-row">
                    <label
                      className="text-md mt-1.5 mr-1 md:mr-0"
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
                        placeholder={loadingClasses ? "Loading..." : "Select"}
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
                    <div className="w-full  gap-x-4 justify-between relative left-0 md:left-[7%]  md:w-[40%]  my-1 md:my-4 flex md:flex-row">
                      <label
                        className="text-md  mr-1 mt-0.5 md:mr-0 inline-flex"
                        htmlFor="divisionSelect"
                      >
                        Division <span className="text-red-500">*</span>
                      </label>

                      <div className="w-full md:w-[65%] relative -top-1">
                        <Select
                          id="divisionSelect"
                          value={selectedDivision}
                          onChange={handleDivisionSelect}
                          options={divisionOptions}
                          placeholder={
                            loadingStudents ? "Loading..." : "Select"
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
                          isDisabled={loadingStudents}
                        />
                        {nameErrorForDivision && (
                          <div className="h-8 relative ml-1 text-danger text-xs">
                            {nameErrorForDivision}
                          </div>
                        )}
                      </div>
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
          </div>
          {/* Form Section - Displayed when studentInformation is fetched */}
          {studentInformation && (
            <div className="w-full md:w-[93%] md:container mx-auto py-4 px-4 ">
              <div className="card mx-auto w-full shadow-lg">
                {/* <div className="p-1 px-3 bg-gray-100 flex justify-between items-center">
                  <div className="box-border flex md:gap-x-2">
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
                ></div> */}
                <div className="card-body w-full ">
                  <div className="h-96 lg:h-96 overflow-y-scroll lg:overflow-x-hidden w-full mx-auto">
                    <div className="bg-white rounded-lg shadow-xs">
                      <table className="min-w-full leading-normal table-auto">
                        <thead className=" ">
                          <tr className="bg-gray-200 ">
                            <th className="px-2 w-full md:w-[8%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Sr. No.
                            </th>
                            <th className="px-2 w-full md:w-[8%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Roll No.
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
                              Student Aadhhar No.
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
                                  />
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

                                {/* 444444 */}
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
