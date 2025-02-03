// // Each dropdown of substitution teacher drop down and it's working fine.
// import { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import Select from "react-select";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import Loader from "../common/LoaderFinal/LoaderStyle";

// const CreateSubstituteTeacher = () => {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(() => {
//     const today = new Date();
//     return today.toISOString().split("T")[0];
//   });
//   const [studentNameWithClassId, setStudentNameWithClassId] = useState([]);
//   const [classIdForSearch, setClassIdForSearch] = useState(null);
//   const [selectedStudentId, setSelectedStudentId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [loadingForSearch, setLoadingForSearch] = useState(false);
//   const [description, setDescription] = useState("");
//   const [errors, setErrors] = useState({});
//   const [day, setDay] = useState("");
//   const [subjects, setSubjects] = useState([]);
//   const [timetable, setTimetable] = useState([]);
//   const [teacherList, setTeacherList] = useState([]);
//   const [dates, setDates] = useState();
//   const [loadingExams, setLoadingExams] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchExams();
//     fetchTeacherList();
//   }, []);

//   const fetchExams = async () => {
//     try {
//       setLoadingExams(true);
//       const token = localStorage.getItem("authToken");

//       const response = await axios.get(`${API_URL}/api/get_teacher_list`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setStudentNameWithClassId(response.data || []);
//     } catch (error) {
//       toast.error("Error fetching teachers");
//       console.error("Error fetching teachers:", error);
//     } finally {
//       setLoadingExams(false);
//     }
//   };

//   const fetchTeacherList = async () => {
//     try {
//       const token = localStorage.getItem("authToken");

//       const response = await axios.get(`${API_URL}/api/get_teacher_list`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setTeacherList(response.data || []);
//     } catch (error) {
//       toast.error("Error fetching teachers");
//       console.error("Error fetching teachers:", error);
//     }
//   };

//   const handleDateChange = (e) => {
//     const newDate = e.target.value;
//     const currentYear = new Date().getFullYear();
//     const selectedYear = new Date(newDate).getFullYear();

//     if (selectedYear >= currentYear - 1 && selectedYear <= currentYear + 1) {
//       setSelectedDate(newDate);
//     } else {
//       alert("Please select a date within the allowed range.");
//     }
//   };

//   const fetchSubstituteTeachers = async (periodRow) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(
//         `${API_URL}/api/get_substituteteacherclasswise/${periodRow.periodNo}/${periodRow.teacherId}/${dates}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response?.data?.success) {
//         console.log("responsedata", response?.data?.data);
//         return Array.isArray(response.data.data)
//           ? response.data.data.map((teacher) => ({
//               value: teacher.teacher_id,
//               label: teacher.name,
//             }))
//           : [];
//       } else {
//         return [];
//       }
//     } catch (error) {
//       console.error("Error fetching substitute teachers:", error);
//       toast.error("Failed to fetch substitute teachers for some rows.");
//       return [];
//     }
//   };

//   const populateSubstituteDropdowns = async () => {
//     const options = {};
//     for (const periodRow of timetable) {
//       const dropdownOptions = await fetchSubstituteTeachers(periodRow);
//       options[periodRow.periodNo] = dropdownOptions;
//     }
//     setTeacherList(options);
//   };
//   console.log("TeacherLIst", teacherList);

//   useEffect(() => {
//     if (timetable.length > 0) {
//       populateSubstituteDropdowns();
//     }
//   }, [timetable]);

//   const handleStudentSelect = (selectedOption) => {
//     setSelectedStudent(selectedOption);
//     setSelectedStudentId(selectedOption?.value);
//   };

//   const studentOptions = useMemo(
//     () =>
//       studentNameWithClassId.map((teacher) => ({
//         value: teacher.reg_id,
//         label: teacher.name,
//       })),
//     [studentNameWithClassId]
//   );

//   const handleSearch = async () => {
//     try {
//       setLoadingForSearch(true);

//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(
//         `${API_URL}/api/get_substituteteacher/${selectedStudentId}/${selectedDate}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response?.data?.success && response.data?.data?.length > 0) {
//         const substitutionData = response.data.data;
//         setDay(response.data.data1?.day);
//         setDates(response.data.data1?.date);

//         const timetableData = substitutionData.map((item) => ({
//           subject: item.subject,
//           classSection: `${item.c_name}-${item.s_name}`,
//           periodNo: item?.period_no,
//           teacherName: item?.teacher_name,
//           classId: item?.class_id,
//           sectionId: item?.section_id,
//           subjectId: item?.sm_id,
//           date: item?.date,
//           teacherId: item?.teacher_id,
//         }));

//         setTimetable(timetableData);
//         toast.success("Substitution data fetched successfully!");
//       } else {
//         toast.error(
//           "No substitution data available for the selected teacher and date."
//         );
//         setTimetable([]);
//       }
//     } catch (error) {
//       console.error("Error fetching substitution data:", error);
//       toast.error("An error occurred while fetching substitution data.");
//     } finally {
//       setLoadingForSearch(false);
//     }
//   };
//   const teacherOptions = useMemo(() => {
//     if (!Array.isArray(teacherList)) return {};

//     const options = teacherList.reduce((acc, teacher) => {
//       const periodNo = teacher.periodNo; // Assuming teacherList contains `periodNo`
//       if (!acc[periodNo]) acc[periodNo] = [];
//       acc[periodNo].push({ value: teacher.teacher_id, label: teacher.name });
//       return acc;
//     }, {});

//     return options;
//   }, [teacherList]);
//   console.log("teacherOptions", teacherOptions);

//   // const teachersForPeriod = teacherOptions[row.periodNo] || [];
//   // const matchedTeacher = teachersForPeriod.find(
//   //   (teacher) => teacher.id === row.teacherId
//   // );
//   const handleTeacherSelect = (index, selectedOption) => {
//     setTimetable((prevTimetable) =>
//       prevTimetable.map((row, i) =>
//         i === index ? { ...row, substituteTeacher: selectedOption?.value } : row
//       )
//     );
//   };
//   return (
//     <>
//       <div className="w-full  ">
//         <ToastContainer />

//         <div className=" w-full md:w-[79%] border-1 drop-shadow-sm  flex justify-center flex-col md:flex-row gap-x-1  bg-white rounded-lg   ml-0 md:ml-[2%]   p-2">
//           <div className="w-[99%] flex md:flex-row justify-between items-center">
//             <div className="w-full flex flex-col gap-y-2 md:gap-y-0 md:flex-row">
//               <div className="w-full gap-x-2   justify-around md:w-[95%] my-1 md:my-4 flex md:flex-row">
//                 <label
//                   className="md:w-[25%] text-md pl-0 md:pl-3 mt-1.5"
//                   htmlFor="studentSelect"
//                 >
//                   Teacher <span className="text-red-500">*</span>
//                 </label>
//                 <div className=" w-full md:w-[70%]">
//                   <Select
//                     id="studentSelect"
//                     menuPortalTarget={document.body}
//                     menuPosition="fixed"
//                     value={selectedStudent}
//                     onChange={handleStudentSelect}
//                     options={studentOptions}
//                     placeholder={loadingExams ? "Loading exams..." : "Select"}
//                     isSearchable
//                     isClearable
//                     className="text-sm"
//                     isDisabled={loadingExams}
//                   />
//                   {/* {studentError && (
//                    <div className="h-8 relative ml-1 text-danger text-xs">
//                      {studentError}
//                    </div>
//                  )} */}
//                 </div>
//               </div>
//               <div className="w-full gap-x-14 md:gap-x-6 md:justify-center my-1 md:my-4 flex md:flex-row">
//                 <label
//                   className="text-md mt-1.5 mr-1 md:mr-0"
//                   htmlFor="classSelect"
//                 >
//                   Date
//                 </label>
//                 <div className="w-full md:w-[50%]">
//                   <input
//                     id="dateInput"
//                     type="date"
//                     value={selectedDate} // Default to current date
//                     onChange={handleDateChange}
//                     onKeyDown={(e) => e.preventDefault()} // Prevent clearing the field
//                     min={`${new Date().getFullYear() - 1}-01-01`} // Min date: Jan 1 of previous year
//                     max={`${new Date().getFullYear() + 1}-12-31`} // Max date: Dec 31 of next year
//                     className=" w-full border-1 rounded px-2 py-2 border-gray-300"
//                     required
//                   />
//                 </div>
//               </div>
//               <button
//                 type="search"
//                 onClick={handleSearch}
//                 style={{ backgroundColor: "#2196F3" }}
//                 className={`my-1 md:my-4 btn h-10 w-18 md:w-auto btn-primary text-white font-bold py-1 border-1 border-blue-500 px-4 rounded ${
//                   loadingForSearch ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//                 disabled={loadingForSearch}
//               >
//                 {loadingForSearch ? (
//                   <span className="flex items-center">
//                     <svg
//                       className="animate-spin h-4 w-4 mr-2 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                       ></path>
//                     </svg>
//                     Loading...
//                   </span>
//                 ) : (
//                   "Search"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//         {/* Form Section - Displayed when parentInformation is fetched */}
//         {/* // Render the table */}

//         {timetable.length > 0 && (
//           <>
//             <div className="md:w-[65%] w-full mx-auto pb-3 pt-2 px-1 md:px-4">
//               <div className="card bg-gray-100 py-2 px-3 rounded-md">
//                 <h5 className="text-center text-blue-600">{`Timetable for ${day}`}</h5>
//                 <div className="overflow-x-auto">
//                   <table className="table-auto w-full border-collapse border bg-gray-50 border-gray-300">
//                     <thead>
//                       <tr className="bg-gray-200">
//                         <th className="border p-2 w-full md:w-[10%] font-semibold text-center">
//                           Period
//                         </th>
//                         <th className="border p-2 w-full md:w-[30%] font-semibold text-center">
//                           Subject
//                         </th>
//                         <th className="border-3 p-2  w-full md:w-[40%]  font-semibold text-center">
//                           Substitute Teacher
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {loading ? (
//                         <tr>
//                           <div className="absolute inset-0 flex items-center justify-center bg-gray-50  z-10">
//                             <Loader /> {/* Replace with your loader */}
//                           </div>
//                         </tr>
//                       ) : (
//                         timetable.map((row, index) => (
//                           <tr key={index}>
//                             <td className="border p-2 text-center">
//                               {row.periodNo}
//                             </td>
//                             <td className="border p-2 text-center">
//                               {row.subject} {row.classSection}
//                             </td>
//                             <td className="border p-2 text-center">
//                               <Select
//                                 options={teacherOptions[row.periodNo] || []} // Ensure options correspond to the periodNo
//                                 value={
//                                   teacherOptions[row.periodNo]?.find(
//                                     (option) =>
//                                       option.value === row?.substituteTeacher
//                                   ) || null
//                                 }
//                                 onChange={(option) =>
//                                   handleTeacherSelect(index, option)
//                                 }
//                                 placeholder="Select Substitute Teacher"
//                               />
//                             </td>
//                           </tr>
//                         ))
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//             <div className="my-1 md:w-[80%] mx-auto w-full flex flex-col md:flex-row gap-1 justify-center md:justify-end ">
//               <button
//                 type="button"
//                 //    onClick={resetTeacherDropdown}
//                 className={`bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700`}
//                 //    disabled={isSubmitDisabled}
//               >
//                 Reset
//               </button>{" "}
//               <button
//                 type="button"
//                 //    onClick={handleSubmit}
//                 //    className={`bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded ${
//                 //      isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""
//                 //    }`}
//                 //    disabled={isSubmitDisabled}
//               >
//                 Submit
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </>
//   );
// };

// export default CreateSubstituteTeacher;

// 100% working directory
import { useState, useEffect, useMemo } from "react";
import { useRef } from "react";
import axios from "axios";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import Loader from "../common/LoaderFinal/LoaderStyle";
import { FiPrinter } from "react-icons/fi";

const CreateSubstituteTeacher = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const hasFetched = useRef(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format as yyyy-MM-dd
  });
  const [studentNameWithClassId, setStudentNameWithClassId] = useState([]);
  const [classIdForSearch, setClassIdForSearch] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingForSearch, setLoadingForSearch] = useState(false);
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  // State for loading indicators
  // const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingExams, setLoadingExams] = useState(false);
  const [studentError, setStudentError] = useState("");
  const [dates, setDates] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [day, setDay] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [teacherList, setTeacherList] = useState([]);
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

    fetchExams();
    fetchTeacherList();
  }, []);

  // Fetch subjects

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    const currentYear = new Date().getFullYear();
    const selectedYear = new Date(newDate).getFullYear();

    // Allow only dates within the previous, current, and next years
    if (selectedYear >= currentYear - 1 && selectedYear <= currentYear + 1) {
      setSelectedDate(newDate);
    } else {
      alert("Please select a date within the allowed range.");
    }
  };

  const fetchExams = async () => {
    try {
      setLoadingExams(true);
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        `${API_URL}/api/get_teachersubstitutionlist`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("teacher", response);
      setStudentNameWithClassId(response.data?.data || []);
    } catch (error) {
      toast.error("Error fetching teachers");
      console.error("Error fetching teachers:", error);
    } finally {
      setLoadingExams(false);
    }
  };
  const fetchTeacherList = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.get(`${API_URL}/api/get_teacher_list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTeacherList(response.data || []); // Store teacher list separately
    } catch (error) {
      toast.error("Error fetching teachers");
      console.error("Error fetching teachers:", error);
    }
  };
  const handleTeacherSelect = (index, selectedOption) => {
    setTimetable((prevTimetable) =>
      prevTimetable.map((row, i) =>
        i === index ? { ...row, substituteTeacher: selectedOption?.value } : row
      )
    );
  };

  const teacherOptions = useMemo(
    () =>
      teacherList.map((teacher) => ({
        value: teacher.reg_id,
        label: teacher.name,
      })),
    [teacherList]
  );
  const resetTeacherDropdown = () => {
    // setTimetable((prevTimetable) =>
    //   prevTimetable.map((row) => ({
    //     ...row,
    //     substituteTeacher: "", // Clear selected substitute teacher
    //     teacherName: "", // Remove teacherName field
    //   }))
    // );
    setTimetable([]);
  };
  const handleStudentSelect = (selectedOption) => {
    setStudentError(""); // Reset error if student is selected
    setSelectedStudent(selectedOption);
    setSelectedStudentId(selectedOption?.value);
  };

  // Dropdown options

  const studentOptions = useMemo(
    () =>
      studentNameWithClassId.map((teacher) => ({
        value: teacher.teacher_id,
        label: teacher.name,
      })),
    [studentNameWithClassId]
  );

  // Fetch substitution teacher list for a specific period and teacher
  const fetchSubstitutionTeachers = async (periodNo, teacherId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/get_substituteteacherclasswise/${teacherId}/${periodNo}/${selectedDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response?.data?.data || [];
    } catch (error) {
      console.error("Error fetching substitution teachers:", error);
      toast.error("Failed to fetch substitute teachers.");
      return [];
    }
  };
  // Fetch substitution teachers for each period

  useEffect(() => {
    const fetchSubstituteOptions = async () => {
      const updatedTimetable = await Promise.all(
        timetable.map(async (row) => {
          const substituteOptions = await fetchSubstitutionTeachers(
            row.periodNo,
            row.ClassName
          );
          return {
            ...row,
            substituteOptions: substituteOptions.map((teacher) => ({
              value: teacher.teacher_id,
              label: teacher.name,
            })),
          };
        })
      );
      setTimetable(updatedTimetable);
    };

    if (timetable.length > 0 && !hasFetched.current) {
      hasFetched.current = true; // Mark as fetched
      fetchSubstituteOptions();
    }
  }, [timetable]); // Only run if the timetable changes

  // Handle search and fetch parent information
  const handleSearch = async () => {
    let valid = true;

    // Check if selectedStudent is empty and set the error message
    if (!selectedStudent) {
      setStudentError("Please select a teacher.");
      valid = false;
    } else {
      setStudentError(""); // Reset error if teacher is selected
    }

    if (!valid) {
      setLoadingForSearch(false);
      return; // Stop if any validation fails
    }

    try {
      setLoadingForSearch(true); // Start loading

      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/get_substituteteacher/${selectedStudentId}/${selectedDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data?.success && response.data?.data?.length > 0) {
        const substitutionData = response.data.data;
        setDay(response?.data?.data1?.day);
        setDates(response?.data?.data1?.date);
        // Map response data into a usable structure for rendering
        const timetableData = substitutionData.map((item) => ({
          subject: item.subject,
          classSection: `${item.c_name}-${item.s_name}`, // Combine class and section
          periodNo: item?.period_no,
          teacherName: item?.teacher_name,
          classId: item?.class_id,
          sectionId: item?.section_id,
          subjectId: item?.sm_id,
          date: item?.date,
          teacherId: item?.teacher_id,
          ClassName: item?.c_name,
        }));

        setTimetable(timetableData);

        toast.success("Substitution data fetched successfully!");
      } else {
        toast.error(
          "No substitution data available for the selected teacher and date."
        );
        setTimetable([]); // Reset timetable to avoid incorrect rendering
      }
    } catch (error) {
      console.error("Error fetching substitution data:", error);
      toast.error("An error occurred while fetching substitution data.");
    } finally {
      setLoadingForSearch(false);
    }
  };

  // Function to reset the table

  // Function to update timetable rows
  // Prepare data for submission
  const prepareDataForSubmission = () => {
    console.log("timetable is", timetable);
    const substitutions = timetable.map((row) => ({
      class_id: row.classId,
      section_id: row.sectionId,
      subject_id: row.subjectId,
      period: row.periodNo,
      date: dates,
      teacher_id: row.teacherId,
      substitute_teacher_id: row.substituteTeacher || "",
    }));

    return { substitutions };
  };

  // Handle Submit
  const handleSubmit = async () => {
    const preparedData = prepareDataForSubmission();
    console.log("preparedData", preparedData);
    // Validation: Ensure at least one substitute teacher is selected
    const hasSubstitute = preparedData.substitutions.some(
      (sub) => sub.substitute_teacher_id
    );

    if (!hasSubstitute) {
      toast.error("Please select at least one substitute teacher.");
      return;
    }

    // Show loader
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/save_substituteteacher`,
        preparedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Data submitted successfully!");
      // Clear the timetable data
      setTimetable([]);
    } catch (error) {
      toast.error("Failed to submit data. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
  };
  return (
    <>
      <div className="w-full  ">
        <div className=" w-full md:w-[79%] border-1 drop-shadow-sm  flex justify-center flex-col md:flex-row gap-x-1  bg-white rounded-lg   ml-0 md:ml-[2%]   p-2">
          <div className="w-[99%] flex md:flex-row justify-between items-center">
            <div className="w-full flex flex-col gap-y-2 md:gap-y-0 md:flex-row">
              <div className="w-full gap-x-2   justify-around md:w-[95%] my-1 md:my-4 flex md:flex-row">
                <label
                  className="md:w-[25%] text-md pl-0 md:pl-3 mt-1.5"
                  htmlFor="studentSelect"
                >
                  Teacher <span className="text-red-500">*</span>
                </label>
                <div className=" w-full md:w-[70%]">
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
              <div className="w-full gap-x-14 md:gap-x-6 md:justify-center my-1 md:my-4 flex md:flex-row">
                <label
                  className="text-md mt-1.5 mr-1 md:mr-0"
                  htmlFor="classSelect"
                >
                  Date
                </label>
                <div className="w-full md:w-[50%]">
                  <input
                    id="dateInput"
                    type="date"
                    value={selectedDate} // Default to current date
                    onChange={handleDateChange}
                    onKeyDown={(e) => e.preventDefault()} // Prevent clearing the field
                    min={`${new Date().getFullYear() - 1}-01-01`} // Min date: Jan 1 of previous year
                    max={`${new Date().getFullYear() + 1}-12-31`} // Max date: Dec 31 of next year
                    className=" w-full border-1 rounded px-2 py-2 border-gray-300"
                    required
                  />
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
          <>
            <div className="md:w-[65%] w-full mx-auto pb-3 pt-3 px-1 md:px-4">
              <div className="card bg-gray-100 py-2 px-3 rounded-md">
                <h5 className="text-center text-blue-600">{`Timetable for ${day}`}</h5>
                <div className="overflow-x-auto">
                  <table className="table-auto w-full border-collapse border bg-gray-50 border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border p-2 w-full md:w-[10%] font-semibold text-center">
                          Period
                        </th>
                        <th className="border p-2 w-full md:w-[30%] font-semibold text-center">
                          Subject
                        </th>
                        <th className="border-3 p-2  w-full md:w-[40%]  font-semibold text-center">
                          Substitute Teacher
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-50  z-10">
                            <Loader /> {/* Replace with your loader */}
                          </div>
                        </tr>
                      ) : (
                        timetable.map((row, index) => (
                          <tr key={index}>
                            <td className="border p-2 text-center">
                              {row.periodNo}
                            </td>
                            <td className="border p-2 text-center">
                              {row.subject} {row.classSection}
                            </td>
                            <td className="border p-2 text-center">
                              <Select
                                options={row.substituteOptions || []}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                isClearable
                                value={row.substituteOptions?.find(
                                  (option) =>
                                    option.value === row.substituteTeacher
                                )}
                                onChange={(selectedOption) =>
                                  handleTeacherSelect(index, selectedOption)
                                }
                                placeholder="Select"
                                className="text-sm"
                                styles={{
                                  control: (provided) => ({
                                    ...provided,
                                    fontSize: "0.75rem",
                                    minHeight: "30px",
                                  }),
                                  menu: (provided) => ({
                                    ...provided,
                                    fontSize: "0.75rem",
                                  }),
                                  option: (provided, state) => ({
                                    ...provided,
                                    fontSize: "0.95rem",
                                    backgroundColor: state.isFocused
                                      ? "rgba(59, 130, 246, 0.1)"
                                      : "white",
                                    color: state.isSelected
                                      ? "black"
                                      : "inherit", // Ensures selected value is black
                                  }),
                                }}
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="my-1 md:w-[65%] mx-auto w-full flex flex-col md:flex-row gap-1 justify-center md:justify-end ">
              <button
                type="button"
                onClick={resetTeacherDropdown}
                className={`bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700`}
                disabled={isSubmitDisabled}
              >
                Reset
              </button>{" "}
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
          </>
        )}
      </div>
    </>
  );
};

export default CreateSubstituteTeacher;
