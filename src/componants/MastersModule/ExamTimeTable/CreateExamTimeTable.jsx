import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import Loader from "../../common/LoaderFinal/LoaderStyle";

const CreateExamTimeTable = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [classesforForm, setClassesforForm] = useState([]);
  const [studentNameWithClassId, setStudentNameWithClassId] = useState([]);
  const [classIdForSearch, setClassIdForSearch] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingForSearch, setLoadingForSearch] = useState(false);
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  // State for loading indicators
  const [loadingClasses, setLoadingClasses] = useState(false);
  // const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingExams, setLoadingExams] = useState(false);
  const [classError, setClassError] = useState("");
  const [studentError, setStudentError] = useState("");
  const [dates, setDates] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const [schedule, setSchedule] = useState(
    timetable.map((row) => ({
      ...row,
      errors: { noSubject: false, missingOption: false }, // Initialize error state for each row
    }))
  );
  console.log("scheduleerror", schedule);
  const updatedErrors = [...schedule]; // Clone the schedule to track errors
  updatedErrors.forEach((row) => {
    row.errors = row.errors || { noSubject: false, missingOption: false };
  });
  console.log("updatedErrors", updatedErrors);
  useEffect(() => {
    // Fetch both classes and exams when the component mounts

    fetchClasses();
    fetchExams();
  }, []);

  // Fetch subjects
  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        `${API_URL}/api/get_subjectsofallstudents/${classIdForSearch}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSubjects(response.data.data || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };
  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);

      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/getClassList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(response.data)) {
        setClassesforForm(response.data);
        console.log(
          "this is the dropdown of the allot subject tab for class",
          response.data
        );
      } else {
        toast.Error("Unexpected data format");
      }
    } catch (error) {
      toast.error("Error fetching classes.");
      console.error("Error fetching classes:", error);
    } finally {
      setLoadingClasses(false);
    }
  };

  const fetchExams = async () => {
    try {
      setLoadingExams(true);
      const token = localStorage.getItem("authToken");

      const response = await axios.get(`${API_URL}/api/get_Examslist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStudentNameWithClassId(response.data || []);
    } catch (error) {
      toast.error("Error fetching exams.");
      console.error("Error fetching exams:", error);
    } finally {
      setLoadingExams(false);
    }
  };

  const handleClassSelect = (selectedOption) => {
    setSelectedClass(selectedOption);
    setClassError(""); // Reset error if class is selected

    setClassIdForSearch(selectedOption?.value);
    // fetchStudentNameWithClassId(selectedOption?.value);
  };

  const handleStudentSelect = (selectedOption) => {
    setStudentError(""); // Reset error if student is selected
    setSelectedStudent(selectedOption);
    setSelectedStudentId(selectedOption?.value);
  };

  // Dropdown options
  const classOptions = useMemo(
    () =>
      classesforForm.map((cls) => ({
        value: cls.class_id,
        label: `${cls?.name}`,
        key: `${cls.class_id}`,
      })),
    [classesforForm]
  );

  const studentOptions = useMemo(
    () =>
      studentNameWithClassId.map((stu) => ({
        value: stu.exam_id,
        label: `${stu?.name}`,
      })),
    [studentNameWithClassId]
  );

  // Handle search and fetch parent information
  const handleSearch = async () => {
    let valid = true;

    // Check if selectedClass is empty and set the error message
    if (!selectedClass) {
      setClassError("Please select Class.");
      valid = false;
    } else {
      setClassError(""); // Reset error if class is selected
    }

    // Check if selectedStudent is empty and set the error message
    if (!selectedStudent) {
      setStudentError("Please select Exam.");
      valid = false;
    } else {
      setStudentError(""); // Reset error if student is selected
    }

    if (!valid) {
      setLoadingForSearch(false);
      return;
    } // Stop if any validation fails

    try {
      setLoadingForSearch(true); // Start loading

      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/get_examdates/${classIdForSearch}/${selectedStudentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchSubjects();

      if (response?.data?.data) {
        const { dates, option, study_leave, subject_ids } = response.data.data;

        // Check if the response data arrays are all empty
        if (
          dates.length === 0 &&
          option.length === 0 &&
          study_leave.length === 0 &&
          subject_ids.length === 0
        ) {
          toast.error("Data is not available for the selected Class and Exam.");
          setDates([]);
          setTimetable([]); // Reset timetable to avoid incorrect rendering
          return;
        }

        // Initialize timetable rows
        setDates(dates);
        setTimetable(
          dates.map((date, index) => ({
            date,
            subjects: subject_ids[index] || Array(4).fill(""), // Pre-fill subject_ids or empty
            option: "Select",
            studyLeave: false,
          }))
        );
      }

      // Check for backend-specific error message
      console.log("ress", response.data.success);
      const sucessmessage = response.data.success;
      if (response.data.success == sucessmessage) {
        const { message, status, success } = response.data;

        // Log the full error details for debugging
        console.log("Error details:", response.data);

        // Check if the response has a status and message
        if (message) {
          if (status === 400) {
            setDates([]);
            setTimetable([]);
            // Handle specific case for status 400 (e.g., Exam Timetable already created)
            toast.error(message); // This will display: "Exam Timetable is already created for this class!!"
          } else if (status == 200 && success == true) {
            // Handle other cases if needed
            toast.success(
              "For Create Exam Timetable Data loaded successfully!"
            ); // Display general error message from the backend
          } else {
            toast.error(message);
          }
        } else {
          // If no message exists, show a fallback error message
          toast.error("An unknown error occurred.");
        }
      }
    } catch (error) {
      console.error("Error fetching exam data:", error);
      toast.error("An error occurred while fetching data.");
    } finally {
      setLoadingForSearch(false);
    }
  };

  // Function to reset the table
  const resetTimetable = () => {
    setTimetable(
      timetable.map((row) => ({
        ...row,
        subjects: Array(4).fill(""),
        option: "Select",
        studyLeave: false,
      }))
    );
    setDescription("");
  };
  // Function to update timetable rows
  const updateTimetable = (index, field, value, subIndex = null) => {
    const updatedTimetable = [...timetable];

    if (field === "subjects" && subIndex !== null) {
      // Update the subject value
      updatedTimetable[index].subjects[subIndex] = value;

      // Uncheck study leave if any subject dropdown is selected
      if (value !== "") {
        updatedTimetable[index].studyLeave = false;
      }
    } else if (field === "studyLeave") {
      // Update study leave checkbox
      updatedTimetable[index].studyLeave = value;

      // Clear subjects and options if study leave is checked
      if (value) {
        updatedTimetable[index].subjects = Array(4).fill("");
        updatedTimetable[index].option = "Select";
      }
    } else {
      // Update other fields like option
      updatedTimetable[index][field] = value;
    }

    setTimetable(updatedTimetable);
  };
  const prepareData = () => {
    const preparedData = {};

    timetable.forEach((row, rowIndex) => {
      row.subjects.forEach((subject, subIndex) => {
        const key = `subject_id${rowIndex + 1}${subIndex + 1}`; // Generate key
        if (/^\d+$/.test(subject)) {
          // If value is numeric
          preparedData[key] = subject;
        } else {
          // If value is not numeric, set it as an empty string
          preparedData[key] = "";
        }
      });

      // Handle study leave checkbox value
      const studyLeaveKey = `study_leave${rowIndex + 1}`;
      preparedData[studyLeaveKey] = row.studyLeave ? "1" : "0";

      // Add options value
      const optionKey = `option${rowIndex + 1}`;
      preparedData[optionKey] = row.option || "Select";
    });

    // Add description field at the end
    preparedData.description = description; // Assuming `description` is the state variable for the input field

    return preparedData;
  };
  // const handleSubmit = async () => {
  //   const preparedData = prepareData(); // Prepare data for validation
  //   let hasError = false;
  //   let warningRows = [];
  //   let errorMessage = "";
  //   let anySubjectSelected = false;

  //   // Clone the schedule errors state
  //   const updatedErrors = timetable.map((row) => ({
  //     noSubject: false,
  //     missingOption: false,
  //   }));

  //   timetable.forEach((row, rowIndex) => {
  //     const studyLeaveKey = `study_leave${rowIndex + 1}`;
  //     const optionKey = `option${rowIndex + 1}`;
  //     const hasStudyLeave = preparedData[studyLeaveKey] === "1";
  //     const hasSubjects = Object.keys(preparedData).some(
  //       (key) =>
  //         key.startsWith(`subject_id${rowIndex + 1}`) &&
  //         preparedData[key] !== ""
  //     );
  //     const hasMultipleSubjects =
  //       Object.keys(preparedData).filter(
  //         (key) =>
  //           key.startsWith(`subject_id${rowIndex + 1}`) &&
  //           preparedData[key] !== ""
  //       ).length > 1;
  //     const hasOptionSelected = preparedData[optionKey] !== "Select";

  //     // Track if any subject is selected across rows
  //     if (hasSubjects) {
  //       anySubjectSelected = true;
  //     }

  //     // Validation 2: Multiple subjects selected but no option chosen
  //     if (hasMultipleSubjects && !hasOptionSelected) {
  //       updatedErrors[rowIndex].missingOption = true;
  //       errorMessage = `Please select an option for multiple subjects on ${row.date}.`;
  //       hasError = true;
  //     }

  //     // Track warning rows: No data for a row
  //     if (!hasSubjects && !hasStudyLeave && !hasOptionSelected) {
  //       warningRows.push(row.date);
  //     }
  //   });

  //   // Validation 1: No subject selected across all rows
  //   if (!anySubjectSelected) {
  //     errorMessage = `Please select at least one subject for any date.`;
  //     hasError = true;
  //   }

  //   // Update the state to reflect field-level errors
  //   setSchedule(
  //     schedule.map((row, index) => ({
  //       ...row,
  //       errors: updatedErrors[index],
  //     }))
  //   );

  //   // Display error messages
  //   if (hasError) {
  //     toast.error(
  //       <div>
  //         <strong className="text-red-600">Error:</strong> {errorMessage}
  //         <div className="text-right mt-2">
  //           <button
  //             className="bg-blue-500 text-[.9em] text-white px-3 py-1 rounded hover:bg-blue-700"
  //             onClick={() => toast.dismiss()}
  //           >
  //             OK
  //           </button>
  //         </div>
  //       </div>
  //     );
  //     return;
  //   }

  //   // Display warning message
  //   if (warningRows.length > 0) {
  //     const remainingRows = warningRows.length;
  //     // Disable the Submit button when warning is shown
  //     setIsSubmitDisabled(true);

  //     // Show a modal-like toast for confirmation
  //     toast(
  //       <div>
  //         <strong className="text-pink-500">Warning:</strong> Data for{" "}
  //         <strong className="">{remainingRows}</strong> days are not selected.
  //         Do you still want to save data?
  //         <div className="flex justify-end gap-2 mt-2 ">
  //           <button
  //             className="bg-red-500 text-[.9em] text-white px-2 py-1 rounded hover:bg-red-700"
  //             onClick={() => {
  //               toast.dismiss(); // Dismiss the toast
  //               setIsSubmitDisabled(false); // Enable the Submit button
  //             }}
  //           >
  //             Cancel
  //           </button>
  //           <button
  //             className="bg-green-500 text-[.9em] text-white px-2 py-1 rounded hover:bg-green-700"
  //             onClick={() => {
  //               toast.dismiss(); // Dismiss the toast
  //               setIsSubmitDisabled(false); // Re-enable the Submit button after submission

  //               submitData(preparedData); // Call the function to submit data
  //             }}
  //           >
  //             Confirm
  //           </button>
  //         </div>
  //       </div>,
  //       {
  //         autoClose: false, // Prevent auto-dismiss
  //         closeButton: false, // Remove the cross button
  //         onClose: () => {
  //           // Ensure `setIsSubmitDisabled(false)` runs if the toast is closed manually
  //           setIsSubmitDisabled(false);
  //         },
  //       }
  //     );
  //     return;
  //   }

  //   // If no errors or warnings, submit data
  //   submitData(preparedData);
  // };

  // Separate function to handle data submission
  const handleSubmit = async () => {
    const preparedData = prepareData(); // Prepare data for validation
    let hasError = false;
    let warningRows = [];
    let errorMessage = "";
    let anySubjectSelected = false;

    // Clone the schedule errors state
    const updatedErrors = timetable.map((row) => ({
      noSubject: false,
      missingOption: false,
      optionMismatch: false,
    }));

    timetable.forEach((row, rowIndex) => {
      const studyLeaveKey = `study_leave${rowIndex + 1}`;
      const optionKey = `option${rowIndex + 1}`;
      const hasStudyLeave = preparedData[studyLeaveKey] === "1";
      const hasSubjects = Object.keys(preparedData).some(
        (key) =>
          key.startsWith(`subject_id${rowIndex + 1}`) &&
          preparedData[key] !== ""
      );
      const selectedSubjects = Object.keys(preparedData).filter(
        (key) =>
          key.startsWith(`subject_id${rowIndex + 1}`) &&
          preparedData[key] !== ""
      ).length;

      const hasOptionSelected = preparedData[optionKey] !== "Select";

      // Track if any subject is selected across rows
      if (hasSubjects) {
        anySubjectSelected = true;
      }

      // Validation 1: "AND"/"OR" selected but no subject
      if (hasOptionSelected && selectedSubjects === 0) {
        updatedErrors[rowIndex].noSubject = true;
        errorMessage = `Please select a subject for ${row.date}.`;
        hasError = true;
      }

      // Validation 2: "AND"/"OR" selected but only one subject
      if (
        hasOptionSelected &&
        selectedSubjects === 1 &&
        (preparedData[optionKey] === "A" || preparedData[optionKey] === "O")
      ) {
        updatedErrors[rowIndex].optionMismatch = true;
        errorMessage = `Please select at least two subjects for ${
          row.date
        } when select option ${
          preparedData[optionKey] === "A" ? "AND" : "OR"
        }.`;

        hasError = true;
      }

      // Validation 3: Multiple subjects selected but no option chosen
      if (selectedSubjects > 1 && !hasOptionSelected) {
        updatedErrors[rowIndex].missingOption = true;
        errorMessage = `Please select an option for multiple subjects on ${row.date}.`;
        hasError = true;
      }

      // Track warning rows: No data for a row
      if (!hasSubjects && !hasStudyLeave && !hasOptionSelected) {
        warningRows.push(row.date);
      }
    });

    // Validation 4: No subject selected across all rows
    if (!anySubjectSelected) {
      errorMessage = `Please select at least one subject for any date.`;
      hasError = true;
    }

    // Update the state to reflect field-level errors
    setSchedule(
      schedule.map((row, index) => ({
        ...row,
        errors: updatedErrors[index],
      }))
    );

    // Display error messages
    if (hasError) {
      toast.error(
        <div>
          <strong className="text-red-600">Error:</strong> {errorMessage}
          <div className="text-right mt-2">
            <button
              className="bg-blue-500 text-[.9em] text-white px-3 py-1 rounded hover:bg-blue-700"
              onClick={() => toast.dismiss()}
            >
              OK
            </button>
          </div>
        </div>
      );
      return;
    }

    // Display warning message
    if (warningRows.length > 0) {
      const remainingRows = warningRows.length;
      setIsSubmitDisabled(true); // Disable the Submit button when warning is shown

      toast(
        <div>
          <strong className="text-pink-500">Warning:</strong> Data for{" "}
          <strong className="">{remainingRows}</strong> days are not selected.
          Do you still want to save data?
          <div className="flex justify-end gap-2 mt-2 ">
            <button
              className="bg-red-500 text-[.9em] text-white px-2 py-1 rounded hover:bg-red-700"
              onClick={() => {
                toast.dismiss();
                setIsSubmitDisabled(false);
              }}
            >
              Cancel
            </button>
            <button
              className="bg-green-500 text-[.9em] text-white px-2 py-1 rounded hover:bg-green-700"
              onClick={() => {
                toast.dismiss();
                setIsSubmitDisabled(false);
                submitData(preparedData);
              }}
            >
              Confirm
            </button>
          </div>
        </div>,
        {
          autoClose: false,
          closeButton: false,
          onClose: () => setIsSubmitDisabled(false),
        }
      );
      return;
    }

    // If no errors or warnings, submit data
    submitData(preparedData);
  };

  const submitData = async (preparedData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${API_URL}/api/save_timetable/${selectedStudentId}/${classIdForSearch}`,
        preparedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Exam Time Table created successfully!");
      setLoading(false);

      // Navigate to /examTimeTable after a slight delay
      setTimeout(() => {
        navigate("/exam_TImeTable");
      }, 500);
    } catch (error) {
      toast.error("Error creating Exam Time Table.");
      console.error(error);
      setLoading(false);
    }
  };

  // const handleSubmit = async () => {
  //   const preparedData = prepareData(); // Prepare data for validation
  //   let hasError = false;
  //   let warningRows = [];
  //   let errorMessage = "";
  //   let anySubjectSelected = false;

  //   // Clone the schedule errors state
  //   const updatedErrors = timetable.map((row) => ({
  //     noSubject: false,
  //     missingOption: false,
  //   }));

  //   timetable.forEach((row, rowIndex) => {
  //     const studyLeaveKey = `study_leave${rowIndex + 1}`;
  //     const optionKey = `option${rowIndex + 1}`;
  //     const hasStudyLeave = preparedData[studyLeaveKey] === "1";
  //     const hasSubjects = Object.keys(preparedData).some(
  //       (key) =>
  //         key.startsWith(`subject_id${rowIndex + 1}`) &&
  //         preparedData[key] !== ""
  //     );
  //     const hasMultipleSubjects =
  //       Object.keys(preparedData).filter(
  //         (key) =>
  //           key.startsWith(`subject_id${rowIndex + 1}`) &&
  //           preparedData[key] !== ""
  //       ).length > 1;
  //     const hasOptionSelected = preparedData[optionKey] !== "Select";

  //     // Track if any subject is selected across rows
  //     if (hasSubjects) {
  //       anySubjectSelected = true;
  //     }

  //     // Validation 2: Multiple subjects selected but no option chosen
  //     if (hasMultipleSubjects && !hasOptionSelected) {
  //       updatedErrors[rowIndex].missingOption = true;
  //       errorMessage = `Please select an option for multiple subjects on ${row.date}.`;
  //       hasError = true;
  //     }

  //     // Track warning rows: No data for a row
  //     if (!hasSubjects && !hasStudyLeave && !hasOptionSelected) {
  //       warningRows.push(row.date);
  //     }
  //   });

  //   // Validation 1: No subject selected across all rows
  //   if (!anySubjectSelected) {
  //     errorMessage = `Please select at least one subject or mark study leave for any date.`;
  //     hasError = true;
  //   }

  //   // Update the state to reflect field-level errors
  //   setSchedule(
  //     schedule.map((row, index) => ({
  //       ...row,
  //       errors: updatedErrors[index],
  //     }))
  //   );

  //   // Display error messages
  //   if (hasError) {
  //     toast.error(
  //       <div>
  //         <strong>Error:</strong> {errorMessage}
  //         <div className="text-right mt-2">
  //           <button
  //             className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700"
  //             onClick={() => toast.dismiss()}
  //           >
  //             OK
  //           </button>
  //         </div>
  //       </div>
  //     );
  //     return;
  //   }

  //   // Display warning message
  //   if (warningRows.length > 0) {
  //     toast.warn(
  //       <div>
  //         <strong>Warning:</strong> Data for the following days are not filled:{" "}
  //         {warningRows.join(", ")}. Do you still want to save data?
  //         <div className="text-right mt-2">
  //           <button
  //             className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700"
  //             onClick={() => toast.dismiss()}
  //           >
  //             OK
  //           </button>
  //         </div>
  //       </div>
  //     );
  //     return; // Stop here if user cancels
  //   }

  //   // Submit data if no errors
  //   setLoading(true);
  //   try {
  //     const token = localStorage.getItem("authToken");
  //     const response = await axios.post(
  //       `${API_URL}/api/save_timetable/${selectedStudentId}/${classIdForSearch}`,
  //       preparedData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     toast.success("Exam Time Table created successfully!");
  //     setLoading(false);

  //     // Navigate to /examTimeTable after a slight delay
  //     setTimeout(() => {
  //       navigate("/examTimeTable");
  //     }, 500);
  //   } catch (error) {
  //     toast.error("Error creating Exam Time Table.");
  //     console.error(error);
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="w-full md:w-[80%] mx-auto p-4 ">
      <ToastContainer />
      <div className="card p-4 rounded-md ">
        <div className=" card-header mb-4 flex justify-between items-center ">
          <h5 className="text-gray-700 mt-1 text-md lg:text-lg">
            Create Exam Timetable
          </h5>

          <RxCross1
            className="float-end relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
            onClick={() => {
              setErrors({});
              navigate("/exam_TImeTable");
            }}
          />
        </div>
        <div
          className=" relative w-full   -top-6 h-1  mx-auto bg-red-700"
          style={{
            backgroundColor: "#C03078",
          }}
        ></div>
        {/* Search Section */}
        <div className=" w-full md:w-[79%] border-1 drop-shadow-sm  flex justify-center flex-col md:flex-row gap-x-1  bg-white rounded-lg  mt-3 ml-0 md:ml-[2%]   p-2">
          <div className="w-[99%] flex md:flex-row justify-between items-center">
            <div className="w-full flex flex-col gap-y-2 md:gap-y-0 md:flex-row">
              <div className="w-full gap-x-14 md:gap-x-6 md:justify-start my-1 md:my-4 flex md:flex-row">
                <label
                  className="text-md mt-1.5 mr-1 md:mr-0"
                  htmlFor="classSelect"
                >
                  Class <span className="text-red-500">*</span>
                </label>
                <div className="w-full md:w-[50%]">
                  <Select
                    id="classSelect"
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
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
                  {classError && (
                    <div className="h-8 relative ml-1 text-danger text-xs">
                      {classError}
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full gap-x-2 relative left-0 md:-left-[7%] justify-around md:w-[85%] my-1 md:my-4 flex md:flex-row">
                <label
                  className="md:w-[20%] text-md pl-0 md:pl-3 mt-1.5"
                  htmlFor="studentSelect"
                >
                  Exam <span className="text-red-500">*</span>
                </label>
                <div className="w-full md:w-[70%]">
                  <Select
                    id="studentSelect"
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    value={selectedStudent}
                    onChange={handleStudentSelect}
                    options={studentOptions}
                    placeholder={loadingExams ? "Loading exams..." : "Select"}
                    isSearchable
                    isClearable
                    className="text-sm"
                    isDisabled={loadingExams}
                  />
                  {studentError && (
                    <div className="h-8 relative ml-1 text-danger text-xs">
                      {studentError}
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
        {/* // Render the table */}
        {timetable.length > 0 && (
          <div className="w-full  mx-auto py-4 px-1 md:px-4">
            <div className="card bg-gray-100 py-2 px-3 rounded-md">
              {/* Responsive Table Wrapper */}
              <div className="overflow-x-auto">
                <table className="table-auto mt-4 w-full border-collapse border bg-gray-50 border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2 font-semibold text-center">
                        Date
                      </th>
                      <th className="border p-2 font-semibold text-center">
                        Subject 1
                      </th>
                      <th className="border p-2 font-semibold text-center">
                        Subject 2
                      </th>
                      <th className="border p-2 font-semibold text-center">
                        Subject 3
                      </th>
                      <th className="border p-2 font-semibold text-center">
                        Subject 4
                      </th>
                      <th className="border p-2 font-semibold text-center">
                        Option
                      </th>
                      <th className="border p-2 font-semibold text-center">
                        Study Leave
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-50  z-10">
                        <Loader />{" "}
                        {/* Replace this with your loader component */}
                      </div>
                    ) : (
                      timetable.map((row, index) => (
                        <tr key={index}>
                          <td className="border p-2 text-center">{row.date}</td>
                          {row.subjects.map((subject, subIndex) => (
                            <td className="border p-2" key={subIndex}>
                              <select
                                className="w-full text-xs border p-1 text-xs"
                                value={subject}
                                onChange={(e) =>
                                  updateTimetable(
                                    index,
                                    "subjects",
                                    e.target.value,
                                    subIndex
                                  )
                                }
                              >
                                <option value="">Select</option>
                                {subjects.map((sub) => (
                                  <option
                                    key={sub.sub_rc_master_id}
                                    value={sub.sub_rc_master_id}
                                  >
                                    {sub.name}
                                  </option>
                                ))}
                              </select>
                              {/* Inline Error for No Subject */}
                              {row.errors?.noSubject && (
                                <span className="text-red-500 text-xs">
                                  Subject is required
                                </span>
                              )}
                            </td>
                          ))}
                          <td className="border p-2">
                            <select
                              className="w-full  border p-1 text-xs"
                              value={row.option}
                              onChange={(e) =>
                                updateTimetable(index, "option", e.target.value)
                              }
                            >
                              <option value="Select">Select</option>
                              <option value="A">AND</option>
                              <option value="O">OR</option>
                            </select>
                            {/* Inline Error for Missing Option */}
                            {row.errors?.missingOption && (
                              <span className="text-red-500 text-xs">
                                Option is required for multiple subjects
                              </span>
                            )}
                          </td>
                          <td className="w-full md:w-[11%] border py-2 text-center">
                            <input
                              type="checkbox"
                              checked={row.studyLeave}
                              className="shadow-md w-4 h-4"
                              onChange={(e) =>
                                updateTimetable(
                                  index,
                                  "studyLeave",
                                  e.target.checked
                                )
                              }
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Description Input */}
              <div className="mt-4 ml-0 md:ml-5 flex flex-row gap-x-4">
                <label
                  htmlFor="description"
                  className="block font-semibold text-[1em] mb-2 text-gray-700"
                >
                  Description:
                </label>
                <textarea
                  type="text"
                  id="description"
                  maxLength={500}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border-1 border-gray-300 p-2 w-[50%] shadow-md mb-2"
                />
              </div>

              {/* Action Buttons */}
              <div className="my-4 flex flex-col md:flex-row gap-2 justify-center md:justify-end">
                <button
                  onClick={resetTimetable}
                  className={`bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700`}
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className={`bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded ${
                    isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitDisabled}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateExamTimeTable;
