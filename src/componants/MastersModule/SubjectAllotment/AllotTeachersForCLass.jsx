// // for multiseleted drop down gfdgdgr
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Select from "react-select";
// import makeAnimated from "react-select/animated";

// const animatedComponents = makeAnimated();

// const AllotTeachersForClass = () => {
//   const API_URL = import.meta.env.VITE_API_URL; // URL for host
//   const [classes, setClasses] = useState([]);
//   const [classSection, setClassSection] = useState("");
//   const [subjects, setSubjects] = useState([]);
//   const [error, setError] = useState(null);
//   const [departments, setDepartments] = useState([]);

//   useEffect(() => {
//     fetchClassNames();
//     fetchDepartments();
//   }, []);

//   // Fetch teacher list for dropdown
//   const fetchDepartments = async () => {
//     try {
//       const token = localStorage.getItem("authToken");

//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await axios.get(`${API_URL}/api/get_teacher_list`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         withCredentials: true,
//       });

//       const teacherOptions = response.data.map((teacher) => ({
//         value: teacher.reg_id,
//         label: teacher.name,
//       }));

//       setDepartments(teacherOptions);
//       console.log("Fetched teacher list:", response.data);
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   const fetchClassNames = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(`${API_URL}/api/get_class_section`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (Array.isArray(response.data)) {
//         setClasses(response.data);
//         console.log("Class and section data:", response.data);
//       } else {
//         setError("Unexpected data format");
//       }
//     } catch (error) {
//       console.error("Error fetching class and section names:", error);
//       setError("Error fetching class and section names");
//     }
//   };

//   const handleClassSectionChange = (e) => {
//     setClassSection(e.target.value);
//   };

//   const handleSearchForAllotTea = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(
//         `${API_URL}/api/subject-allotment/section/${classSection}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.data.status === "success" && response.data.data) {
//         const subjectData = Object.values(response.data.data).map(
//           (subject) => ({
//             ...subject,
//             selectedTeachers: [],
//           })
//         );
//         setSubjects(subjectData);
//       } else {
//         setError("Unexpected data format");
//       }
//       console.log("Subjects data:", response.data.data);
//     } catch (error) {
//       console.error("Error fetching subjects:", error);
//       setError("Error fetching subjects");
//     }
//   };

//   const handleTeacherSelect = (selectedOptions, subjectIndex) => {
//     const newSubjects = [...subjects];
//     newSubjects[subjectIndex].selectedTeachers = selectedOptions;
//     setSubjects(newSubjects);
//   };

//   return (
//     <div>
//       <div className="mb-4 ">
//         <div className="md:w-[80%] mx-auto">
//           <div className="form-group flex justify-center gap-x-1 md:gap-x-6">
//             <label
//               htmlFor="classSection"
//               className="w-1/4 pt-2 items-center text-center"
//             >
//               Select Class <span className="text-red-500">*</span>
//             </label>
//             <select
//               id="classSection"
//               className="border w-[50%] h-10 md:h-auto rounded-md px-3 py-2 md:w-full mr-2"
//               value={classSection}
//               onChange={handleClassSectionChange}
//             >
//               <option value="">Select </option>
//               {classes.map((cls) => (
//                 <option key={cls.section_id} value={cls.section_id}>
//                   {`${cls?.get_class?.name} ${cls?.name}`}
//                 </option>
//               ))}
//             </select>
//             <button
//               onClick={handleSearchForAllotTea}
//               type="button"
//               className="btn h-10 md:h-auto w-18 md:w-auto btn-primary"
//             >
//               Browse
//             </button>
//           </div>
//         </div>
//       </div>

//       {subjects.length > 0 && (
//         <div className="container mt-4">
//           <div className="card mx-auto lg:w-full shadow-lg">
//             <div className="card-header flex justify-between items-center">
//               <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
//                 Manage Subjects List
//               </h3>
//             </div>

//             <div className="card-body w-full md:w-[85%] mx-auto ">
//               <div className="h-96 lg:h-96 overflow-y-scroll lg:overflow-x-hidden">
//                 {subjects.map((subject, index) => (
//                   <div
//                     key={index}
//                     className=" border-b border-gray-200 grid grid-cols-3 mx-10 -gap-x-8"
//                   >
//                     <div className="relative mt-3 font-semibold text-gray-600 ">
//                       {" "}
//                       {subject.subject_name}
//                     </div>
//                     <div className="relative mt-2 col-span-2 text-[.9em]">
//                       <Select
//                         closeMenuOnSelect={false}
//                         components={animatedComponents}
//                         isMulti
//                         options={departments}
//                         value={subject.selectedTeachers}
//                         onChange={(selectedOptions) =>
//                           handleTeacherSelect(selectedOptions, index)
//                         }
//                         // className="mt-2"
//                       />
//                     </div>
//                   </div>
//                 ))}
//                 <div className=" flex justify-end p-3 mr-5">
//                   <button
//                     onClick={handleSubmitForAllotTeacherTab}
//                     type="button"
//                     className="btn h-10 md:h-auto w-18 md:w-auto btn-primary"
//                   >
//                     Save
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllotTeachersForClass;

// working code
// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import Select from "react-select";
// import makeAnimated from "react-select/animated";

// const animatedComponents = makeAnimated();

// const AllotTeachersForClass = () => {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const [classes, setClasses] = useState([]);
//   const [classSection, setClassSection] = useState("");
//   const [sectionId, setSectionId] = useState("");
//   const [classId, setClassId] = useState("");

//   const [subjects, setSubjects] = useState([]);
//   const [error, setError] = useState(null);
//   const [departments, setDepartments] = useState([]);

//   useEffect(() => {
//     fetchClassNames();
//     fetchDepartments();
//   }, []);

//   const fetchDepartments = async () => {
//     try {
//       const token = localStorage.getItem("authToken");

//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await axios.get(`${API_URL}/api/get_teacher_list`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         withCredentials: true,
//       });

//       const teacherOptions = response.data.map((teacher) => ({
//         value: teacher.reg_id,
//         label: teacher.name,
//       }));

//       setDepartments(teacherOptions);
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   const fetchClassNames = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(`${API_URL}/api/get_class_section`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (Array.isArray(response.data)) {
//         setClasses(response.data);
//       } else {
//         setError("Unexpected data format");
//       }
//     } catch (error) {
//       setError("Error fetching class and section names");
//     }
//   };

//   const handleClassSectionChange = (e) => {
//     const [classSection, sectionId] = e.target.value.split(" ");
//     setClassSection(e.target.value);
//     setClassId(classSection);
//     setSectionId(sectionId);
//   };

//   const handleSearchForAllotTea = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(
//         `${API_URL}/api/subject-allotment/section/${classId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.data.status === "success" && response.data.data) {
//         const subjectData = Object.entries(response.data.data).map(
//           ([sm_id, subject]) => ({
//             sm_id,
//             subject_name: subject.subject_name,
//             selectedTeachers: subject.details
//               .filter((detail) => detail.teacher_id)
//               .map((detail) => ({
//                 value: detail?.teacher_id,
//                 label: detail.teacher?.name,
//               })),
//             details: subject.details.map((detail) => ({
//               subject_id: detail?.subject_id,
//               teacher_id: detail?.teacher_id || null,
//             })),
//           })
//         );
//         setSubjects(subjectData);
//       } else {
//         setError("Unexpected data format");
//       }
//     } catch (error) {
//       setError("Error fetching subjects");
//     }
//   };

//   const handleTeacherSelect = (selectedOptions, subjectIndex) => {
//     const newSubjects = [...subjects];
//     newSubjects[subjectIndex].selectedTeachers = selectedOptions;
//     newSubjects[subjectIndex].details = selectedOptions.map((option) => ({
//       subject_id: newSubjects[subjectIndex].details[0].subject_id||null,
//       teacher_id: option.value || null,
//     }));
//     setSubjects(newSubjects);
//   };

//   const handleSubmitForAllotTeacherTab = async () => {
//     try {
//       const token = localStorage.getItem("authToken");

//       const formattedData = {
//         subjects: subjects.reduce((acc, subject) => {
//           const updatedDetails = subject.selectedTeachers.map(
//             (selectedTeacher) => ({
//               subject_id: subject.sm_id,
//               teacher_id: selectedTeacher.value,
//             })
//           );

//           acc[subject.sm_id] = {
//             details: updatedDetails,
//           };

//           return acc;
//         }, {}),
//       };

//       const response = await axios.put(
//         `${API_URL}/api/subject-allotments/${sectionId}/${classId}`,
//         formattedData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       alert("Teacher allotment updated successfully!");
//     } catch (error) {
//       setError("Error updating teacher allotment");
//     }
//   };

//   const memoizedSubjects = useMemo(() => subjects, [subjects]);
//   const memoizedDepartments = useMemo(() => departments, [departments]);

//   return (
//     <div>
//       <div className="mb-4">
//         <div className="md:w-[80%] mx-auto">
//           <div className="form-group flex justify-center gap-x-1 md:gap-x-6">
//             <label
//               htmlFor="classSection"
//               className="w-1/4 pt-2 items-center text-center"
//             >
//               Select Class <span className="text-red-500">*</span>
//             </label>
//             <select
//               id="classSection"
//               className="border w-[50%] h-10 md:h-auto rounded-md px-3 py-2 md:w-full mr-2"
//               value={classSection}
//               onChange={handleClassSectionChange}
//             >
//               <option value="">Select</option>
//               {classes.map((cls) => (
//                 <option
//                   key={cls.section_id}
//                   value={`${cls.section_id} ${cls.class_id}`}
//                 >
//                   {`${cls?.get_class?.name} ${cls?.name}`}
//                 </option>
//               ))}
//             </select>
//             <button
//               onClick={handleSearchForAllotTea}
//               type="button"
//               className="btn h-10 md:h-auto w-18 md:w-auto btn-primary"
//             >
//               Browse
//             </button>
//           </div>
//         </div>
//       </div>

//       {memoizedSubjects.length > 0 && (
//         <div className="container mt-4">
//           <div className="card mx-auto lg:w-full shadow-lg">
//             <div className="card-header flex justify-between items-center">
//               <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
//                 Manage Subjects List
//               </h3>
//             </div>

//             <div className="card-body w-full md:w-[85%] mx-auto ">
//               <div className="h-96 lg:h-96 overflow-y-scroll lg:overflow-x-hidden">
//                 {memoizedSubjects.map((subject, index) => (
//                   <div
//                     key={index}
//                     className="border-b border-gray-200 grid grid-cols-3 mx-10 gap-x-8"
//                   >
//                     <div className="relative mt-3 font-semibold text-gray-600">
//                       {subject.subject_name}
//                     </div>
//                     <div className="relative mt-2 col-span-2 text-[.9em]">
//                       <Select
//                         closeMenuOnSelect={false}
//                         components={animatedComponents}
//                         isMulti
//                         options={memoizedDepartments}
//                         value={subject.selectedTeachers}
//                         onChange={(selectedOptions) =>
//                           handleTeacherSelect(selectedOptions, index)
//                         }
//                       />
//                     </div>
//                   </div>
//                 ))}
//                 <div className="flex justify-end p-3 mr-5">
//                   <button
//                     onClick={handleSubmitForAllotTeacherTab}
//                     type="button"
//                     className="btn h-10 md:h-auto w-18 md:w-auto btn-primary"
//                   >
//                     Save
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllotTeachersForClass;

// 100% working code but we need fast code
import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { RxCross1 } from "react-icons/rx";
import Loader from "../../common/LoaderFinal/LoaderStyle";

const animatedComponents = makeAnimated();

const AllotTeachersForClass = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [classes, setClasses] = useState([]);
  const [classSection, setClassSection] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [classId, setClassId] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingForSubmit, setLoadingForSubmit] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate
  const [nameError, setNameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  //   const [nameAvailable, setNameAvailable] = useState(true);

  useEffect(() => {
    fetchClassNames();
    fetchDepartments();
  }, []);

  // Fetch teacher list for dropdown
  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${API_URL}/api/get_teacher_list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const teacherOptions = response.data.map((teacher) => ({
        value: teacher.reg_id,
        label: teacher.name,
      }));

      setDepartments(teacherOptions);
      console.log("Fetched teacher list:", response.data);
    } catch (error) {
      setError(error.message);
      toast.error("Error fetching teacher list");
    }
  };

  const fetchClassNames = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/get_class_section`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(response.data)) {
        // Convert the class data to the format required by react-select
        const classOptions = response.data.map((cls) => ({
          value: cls.section_id, // Use section_id as the value
          label: `${cls?.get_class?.name} ${cls?.name}`,
          classId: cls.class_id,
          sectionId: cls.section_id,
        }));
        setClasses(classOptions);
        console.log("Class and section data:", response.data);
      } else {
        setError("Unexpected data format");
      }
    } catch (error) {
      console.error("Error fetching class and section names:", error);
      setError("Error fetching class and section names");
      toast.error("Error fetching class and section names");
    } finally {
      setLoading(false);
    }
  };
  const handleAllotTeacherForAClassClose = () => {
    setSubjects([]);

    // setClassId("");
  };
  const handleClassSectionChange = (selectedOption) => {
    setNameError(null); // Reset error when user selects a class
    console.log("selectedOption", selectedOption);
    setSelectedClass(selectedOption);
    setClassId(selectedOption ? selectedOption.classId : null); // Store the class_id
    setSectionId(selectedOption ? selectedOption.value : null); // Store the section_id
    console.log("Selected class_id:", selectedOption.classId);
    console.log("Selected section_id:", selectedOption.value);
  };
  // heavy code take time more
  const handleSearchForAllotTea = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    console.log("hfdskjlhjf", classId);
    if (!classId) {
      setNameError("Please select the class.");
      setIsSubmitting(false);
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/subject-allotment/section/${sectionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("fdslkjfsdlrun");
      if (response.data.status === "success" && response.data.data) {
        const subjectData = Object.entries(response.data.data).map(
          ([sm_id, subject]) => ({
            sm_id, // Store the sm_id for PUT request later
            subject_name: subject.subject_name,
            selectedTeachers: subject.details
              .filter((detail) => detail.teacher_id) // Only include non-null teacher IDs
              .map((detail) => ({
                value: detail.teacher_id,
                label: detail.teacher?.name,
              })),
            details: subject.details.map((detail) => ({
              subject_id: detail.subject_id,
              teacher_id: detail.teacher_id || null, // Store the teacher_id or null if not selected
            })), // Store original details for later reference
          })
        );
        setSubjects(subjectData);
      } else {
        setError("Unexpected data format");
      }
      console.log("Subjects data from GET API by classId:", subjects);
    } catch (error) {
      console.log(
        "eerror-->allotTeachrersForsubject",
        error.response.data.error
      );
      console.error("Error fetching subjects:", error);
      setError("Error fetching subjects");
      toast.error(error?.response?.data?.error || "Error fetching subjects");
    } finally {
      setLoading(false);

      setIsSubmitting(false); // Re-enable the button after the operation
    }
  };

  //  Light code
  //   const handleSearchForAllotTea = async () => {
  //     try {
  //       const token = localStorage.getItem("authToken");
  //       const response = await axios.get(
  //         `${API_URL}/api/subject-allotment/section/${classId}`,
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );

  //       if (response.data.status === "success" && response.data.data) {
  //         const subjectData = Object.entries(response.data.data).map(
  //           ([sm_id, subject]) => ({
  //             sm_id, // Store the sm_id for PUT request later
  //             subject_name: subject.subject_name,
  //             selectedTeachers: subject.details
  //               .filter((detail) => detail.teacher_id) // Only include non-null teacher IDs
  //               .map((detail) => ({
  //                 value: detail.teacher_id,
  //                 label: detail.teacher?.name,
  //               })),
  //             details: subject.details.map((detail) => ({
  //               subject_id: detail.subject_id,
  //               teacher_id: detail.teacher_id || null, // Store the teacher_id or null if not selected
  //             })), // Store original details for later reference
  //           })
  //         );
  //         setSubjects(subjectData);
  //       } else {
  //         setError("Unexpected data format");
  //       }
  //       console.log("Subjects data from GET API by classId:", subjects);
  //     } catch (error) {
  //       console.error("Error fetching subjects:", error);
  //       setError("Error fetching subjects");
  //     }
  //   };
  // comment because in the no input field of the dropdown select emplty then is's show error subj_id not defined
  //   const handleTeacherSelect = (selectedOptions, subjectIndex) => {
  //     const newSubjects = [...subjects];
  //     newSubjects[subjectIndex].selectedTeachers = selectedOptions;

  //     // Update the details array with the selected teachers
  //     newSubjects[subjectIndex].details = selectedOptions.map((option) => ({
  //       subject_id: newSubjects[subjectIndex].details[0].subject_id, // Assuming the same subject_id for all selected teachers
  //       teacher_id: option.value || null, // Assign teacher_id or null if unselected
  //     }));

  //     setSubjects(newSubjects);
  //   };

  //   working when i inlcude it the component become heavy
  const handleTeacherSelect = (selectedOptions, subjectIndex) => {
    const newSubjects = [...subjects];
    newSubjects[subjectIndex].selectedTeachers = selectedOptions;

    // Check if details array is present and has at least one item
    if (
      newSubjects[subjectIndex].details &&
      newSubjects[subjectIndex].details.length > 0
    ) {
      const subjectId = newSubjects[subjectIndex].details[0].subject_id;

      // Update the details array with the selected teachers
      newSubjects[subjectIndex].details = selectedOptions.map((option) => ({
        subject_id: subjectId, // Use the valid subject_id
        teacher_id: option.value || null, // Assign teacher_id or null if unselected
      }));
    } else {
      // Handle the case where details is empty or undefined
      console.warn(
        "Details array is empty or undefined for the subject at index:",
        subjectIndex
      );

      // Optionally, initialize the details array if it's undefined
      newSubjects[subjectIndex].details = selectedOptions.map((option) => ({
        subject_id: null, // Default to null or handle accordingly
        teacher_id: option.value || null,
      }));
    }

    setSubjects(newSubjects);
  };

  console.log("Updated subjects after teacher selection:", subjects);

  console.log("The setSubject if teacher id is unselected", subjects);
  // heavy code here
  const handleSubmitForAllotTeacherTab = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const formattedData = {
        subjects: subjects.reduce((acc, subject) => {
          const existingTeacherIds = new Set(
            subject.details.map((detail) => detail.teacher_id)
          );

          // Combine existing teachers and selected teachers, handling additions and removals
          const updatedDetails = subject.selectedTeachers.map(
            (selectedTeacher) => {
              return {
                subject_id: subject.sm_id,
                teacher_id: selectedTeacher.value,
              };
            }
          );

          // Handle removals: if a teacher is no longer selected, set their teacher_id to null
          //   subject.details.forEach((detail) => {
          //     if (
          //       detail.teacher_id &&
          //       !subject.selectedTeachers.some(
          //         (t) => t.value === detail.teacher_id
          //       )
          //     ) {
          //       updatedDetails.push({
          //         subject_id: detail.subject_id,
          //         teacher_id: null,
          //       });
          //     }
          //   });

          acc[subject.sm_id] = {
            details: updatedDetails,
          };

          return acc;
        }, {}),
      };

      console.log("Final subject data for PUT request:", subjects);
      console.log("Formatted data for PUT request:", formattedData);
      // just convet the logic sectionId is become classId and classId is become sectionID
      setLoadingForSubmit(true);
      const response = await axios.put(
        `${API_URL}/api/subject-allotments/${classId}/${sectionId}`, // Replace with actual classId and sectionId
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Update response:", response.data);
      toast.success("Teacher allotment updated successfully!");
      setTimeout(() => {
        setSubjects([]);
      }, 500);

      // setActiveTab("Manage");

      //   navigate("/managesubject"); // Navigate to the parent component
    } catch (error) {
      console.error("Error updating teacher allotment:", error);
      setError("Error updating teacher allotment");
      toast.error("Error updating teacher allotment");
    } finally {
      setLoadingForSubmit(false);
      setLoading(false);
    }
  };
  // light code is here
  //   const handleSubmitForAllotTeacherTab = async () => {
  //     try {
  //       const token = localStorage.getItem("authToken");

  //       const formattedData = {
  //         subjects: subjects.reduce((acc, subject) => {
  //           acc[subject.sm_id] = {
  //             details: subject.details.map((detail) => ({
  //               subject_id: detail.subject_id || null,
  //               teacher_id: detail.teacher_id || null,
  //             })),
  //           };
  //           return acc;
  //         }, {}),
  //       };

  //       console.log("Final subject data for PUT request:", subjects);
  //       console.log("Formatted data for PUT request:", formattedData);

  //       const response = await axios.put(
  //         `${API_URL}/api/subject-allotments/${sectionId}/${classId}`, // Replace with actual classId and sectionId
  //         formattedData,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       console.log("Update response:", response.data);
  //       alert("Teacher allotment updated successfully!");
  //     } catch (error) {
  //       console.error("Error updating teacher allotment:", error);
  //       setError("Error updating teacher allotment");
  //     }
  //   };

  return (
    <div>
      <ToastContainer />

      <div className="mb-4">
        <div className="md:w-[80%] mx-auto">
          <div className="form-group mt-6 md:mt-10 w-full  md:w-[80%] flex justify-start gap-x-1 md:gap-x-6">
            <label
              htmlFor="classSection"
              className="w-1/4 pt-2 items-center text-center"
            >
              Select Class <span className="text-red-500">*</span>
            </label>
            <div className="w-full">
              {/* <select
                id="classSection"
                className="border w-[50%] h-10 md:h-auto rounded-md px-3 py-2 md:w-full mr-2"
                value={classSection}
                onChange={handleClassSectionChange}
              >
                <option value="">Select</option>
                {classes.map((cls) => (
                  <option
                    key={cls.section_id}
                    value={`${cls.section_id} ${cls.class_id}`}
                  >
                    {`${cls?.get_class?.name} ${cls?.name}`}
                  </option>
                ))}
              </select> */}
              <Select
                id="classSection"
                components={animatedComponents}
                options={classes}
                value={selectedClass}
                onChange={handleClassSectionChange}
                placeholder="Select Class"
                className=" w-full md:w-[60%] item-center relative left-0 md:left-4"
                isClearable
              />
              {nameError && (
                <div className=" relative left-4 top-0.5 ml-1 text-danger text-xs">
                  {nameError}
                </div>
              )}{" "}
            </div>
            {/* Show error message */}
            <button
              onClick={handleSearchForAllotTea}
              type="button"
              className="btn h-10  w-18 md:w-auto relative  right-0 md:right-[15%] btn-primary"
              disabled={isSubmitting}

              //   disabled={loading}
            >
              {isSubmitting ? "Browsing..." : "Browse"}
            </button>
          </div>
        </div>
      </div>
      {/* {loading && (
        <div className="flex justify-center items-center h-32">
          <Loader />
        </div>
      )} */}

      {/* {subjects.length > 0 && !loading && ( */}
      {subjects.length > 0 && (
        <div className="container mt-4">
          <div className="card mx-auto lg:w-full shadow-lg">
            <div className="p-2 px-3 bg-gray-100 flex justify-between items-center">
              <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
                Allot Teachers for a class
              </h3>{" "}
              <RxCross1
                className="float-end relative  right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                type="button"
                // className="btn-close text-red-600"
                onClick={handleAllotTeacherForAClassClose}
              />
            </div>

            <div
              className=" relative -top-2 mb-3 h-1 w-[97%] mx-auto bg-red-700"
              style={{
                backgroundColor: "#C03078",
              }}
            ></div>

            <div className="card-body w-full md:w-[85%] mx-auto ">
              {loadingForSubmit ? (
                <tr>
                  <div className=" absolute inset-0  flex items-center justify-center bg-gray-50  z-10">
                    <Loader /> {/* Replace with your loader */}
                  </div>
                </tr>
              ) : (
                <div className="h-96 lg:h-96 overflow-y-scroll lg:overflow-x-hidden">
                  {subjects.map((subject, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 grid grid-cols-3 mx-10 gap-x-8"
                    >
                      <div className="relative mt-3 font-semibold text-gray-600">
                        {subject.subject_name}
                      </div>
                      <div className="relative mt-2 col-span-2 text-[.9em]">
                        <Select
                          closeMenuOnSelect={false}
                          components={animatedComponents}
                          isMulti
                          options={departments}
                          value={subject.selectedTeachers}
                          onChange={(selectedOptions) =>
                            handleTeacherSelect(selectedOptions, index)
                          }
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end p-3 mr-5">
                    <button
                      onClick={handleSubmitForAllotTeacherTab}
                      type="button"
                      className="btn h-10 md:h-auto w-18 md:w-auto btn-primary"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllotTeachersForClass;
