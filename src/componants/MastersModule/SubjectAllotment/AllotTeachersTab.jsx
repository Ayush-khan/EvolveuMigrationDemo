// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Select from "react-select";
// import makeAnimated from "react-select/animated";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Loader from "../../../componants/common/Loader"; // Add this dependency
// import { useNavigate } from "react-router-dom"; // Import useNavigate

// const animatedComponents = makeAnimated();

// const AllotTeachersTab = () => {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const [classes, setClasses] = useState([]);
//   const [classSection, setClassSection] = useState("");
//   const [sectionId, setSectionId] = useState("");
//   const [classId, setClassId] = useState("");

//   const [subjects, setSubjects] = useState([]);
//   const [error, setError] = useState(null);
//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate(); // Initialize useNavigate
//   const [nameError, setNameError] = useState("");
//   //   const [nameAvailable, setNameAvailable] = useState(true);

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
//       toast.error("Error fetching teacher list");
//     }
//   };

//   const fetchClassNames = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(`${API_URL}/api/getClassList`, {
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
//       toast.error("Error fetching class and section names");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClassSectionChange = (e) => {
//     setNameError(null); // Reset error when user selects a class
//     const [classSection, sectionId] = e.target.value.split(" "); // Split the value by space
//     setClassSection(e.target.value);
//     setClassId(classSection); // Store the first value in setClassSection

//     setSectionId(sectionId); // Store the second value in setSectionId
//     console.log("The class_id", classId);
//     console.log("The sectionId ", sectionId);

//     // console.log("The sectionId and class_id", e.target.value);
//   };
//   // heavy code take time more
//   const handleSearchForAllotTea = async () => {
//     if (!classSection) {
//       setNameError("Please select the class.");
//       return;
//     }
//     setLoading(true);
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
//       toast.error("Error fetching subjects");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <ToastContainer />

//       <div className="container mt-4">
//         <div className="card mx-auto lg:w-full shadow-lg">
//           <div className="card-header flex justify-between items-center">
//             <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
//               Allot Teachers
//             </h3>
//           </div>

//           <div className="card-body w-full md:w-[85%] mx-auto ">
//             <div className="h-96 lg:h-96 overflow-y-scroll lg:overflow-x-hidden border-2 border-black">
//               <div className="form-group flex justify-center gap-x-1 md:gap-x-6">
//                 <label
//                   htmlFor="classSection"
//                   className="w-1/4 pt-2 items-center text-center"
//                 >
//                   Select Class <span className="text-red-500">*</span>
//                 </label>
//                 <div className="w-full">
//                   <select
//                     id="classSection"
//                     className="border w-[50%] h-10 md:h-auto rounded-md px-3 py-2 mr-2"
//                     value={classSection}
//                     onChange={handleClassSectionChange}
//                   >
//                     <option value="">Select</option>
//                     {classes.map((cls) => (
//                       <option
//                         key={cls.section_id}
//                         value={`${cls.section_id} ${cls.class_id}`}
//                       >
//                         {`${cls?.name}`}
//                       </option>
//                     ))}
//                   </select>
//                   {nameError && (
//                     <div className=" relative top-0.5 ml-1 text-danger text-xs">
//                       {nameError}
//                     </div>
//                   )}{" "}
//                 </div>
//                 {/* Show error message */}
//               </div>
//               <div className="form-group flex justify-center gap-x-1 md:gap-x-6">
//                 <label
//                   htmlFor="classSection"
//                   className="w-1/4 pt-2 items-center text-center"
//                 >
//                   Select division <span className="text-red-500">*</span>
//                 </label>
//                 <div className="w-full">
//                   <select
//                     id="classSection"
//                     className="border w-[50%] h-10 md:h-auto rounded-md px-3 py-2  mr-2"
//                     value={classSection}
//                     onChange={handleClassSectionChange}
//                   >
//                     <option value="">Select</option>
//                     {classes.map((cls) => (
//                       <option
//                         key={cls.section_id}
//                         value={`${cls.section_id} ${cls.class_id}`}
//                       >
//                         {`${cls?.name}`}
//                       </option>
//                     ))}
//                   </select>
//                   {nameError && (
//                     <div className=" relative top-0.5 ml-1 text-danger text-xs">
//                       {nameError}
//                     </div>
//                   )}{" "}
//                 </div>
//                 {/* Show error message */}
//               </div>
//               <div className="form-group flex justify-center gap-x-1 md:gap-x-6">
//                 <label
//                   htmlFor="classSection"
//                   className="w-1/4 pt-2 items-center text-center"
//                 >
//                   Teacher assigned <span className="text-red-500">*</span>
//                 </label>
//                 <div className="w-full">
//                   <select
//                     id="classSection"
//                     className="border w-[50%] h-10 md:h-auto rounded-md px-3 py-2  mr-2"
//                     value={classSection}
//                     onChange={handleClassSectionChange}
//                   >
//                     <option value="">Select</option>
//                     {classes.map((cls) => (
//                       <option
//                         key={cls.section_id}
//                         value={`${cls.section_id} ${cls.class_id}`}
//                       >
//                         {`${cls?.name}`}
//                       </option>
//                     ))}
//                   </select>
//                   {nameError && (
//                     <div className=" relative top-0.5 ml-1 text-danger text-xs">
//                       {nameError}
//                     </div>
//                   )}{" "}
//                 </div>
//                 {/* Show error message */}
//               </div>
//               <div className="relative mt-2 col-span-2 text-[.9em]">
//                 <Select
//                   closeMenuOnSelect={false}
//                   components={animatedComponents}
//                   isMulti
//                   options={departments}
//                   value={subject.selectedTeachers}
//                   onChange={(selectedOptions) =>
//                     handleTeacherSelect(selectedOptions, index)
//                   }
//                 />
//               </div>

//               <div className="flex justify-end p-3 mr-5">
//                 <button
//                   onClick={handleSubmitForAllotTeacherTab}
//                   type="button"
//                   className="btn h-10 md:h-auto w-18 md:w-auto btn-primary"
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllotTeachersTab;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Select from "react-select";
// import makeAnimated from "react-select/animated";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Loader from "../../../componants/common/Loader";
// import { useNavigate } from "react-router-dom";

// const animatedComponents = makeAnimated();

// const TeacherSubjectAllotment = () => {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const [classes, setClasses] = useState([]);
//   const [divisions, setDivisions] = useState([]);
//   const [teachers, setTeachers] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedClass, setSelectedClass] = useState(null);
//   const [selectedDivision, setSelectedDivision] = useState(null);
//   const [selectedTeacher, setSelectedTeacher] = useState(null);
//   const [selectedSubject, setSelectedSubject] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchClassNames();
//     fetchTeacherList();
//   }, []);

//   useEffect(() => {
//     if (selectedClass) {
//       fetchDivisions(selectedClass.value);
//     }
//   }, [selectedClass]);

//   useEffect(() => {
//     if (selectedDivision) {
//       fetchSubjects(selectedDivision.value);
//     }
//   }, [selectedDivision]);

//   const fetchClassNames = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(`${API_URL}/api/getClassList`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const classOptions = response.data.map((cls) => ({
//         value: cls.class_id,
//         label: cls.name,
//       }));
//       setClasses(classOptions);
//     } catch (error) {
//       toast.error("Error fetching class list");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDivisions = async (classId) => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(
//         `${API_URL}/api/get_divisions/${classId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const divisionOptions = response.data.map((division) => ({
//         value: division.section_id,
//         label: division.name,
//       }));
//       setDivisions(divisionOptions);
//     } catch (error) {
//       toast.error("Error fetching divisions");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTeacherList = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(`${API_URL}/api/get_teacher_list`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const teacherOptions = response.data.map((teacher) => ({
//         value: teacher.reg_id,
//         label: teacher.name,
//       }));
//       setTeachers(teacherOptions);
//     } catch (error) {
//       toast.error("Error fetching teacher list");
//     }
//   };

//   const fetchSubjects = async (sectionId) => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(
//         `${API_URL}/api/get_subjects/${sectionId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const subjectOptions = response.data.map((subject) => ({
//         value: subject.subject_id,
//         label: subject.name,
//       }));
//       setSubjects(subjectOptions);
//     } catch (error) {
//       toast.error("Error fetching subjects");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     if (
//       !selectedClass ||
//       !selectedDivision ||
//       !selectedTeacher ||
//       !selectedSubject
//     ) {
//       toast.error("Please fill in all fields");
//       return;
//     }
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.post(
//         `${API_URL}/api/allot-teacher-for-subject/${selectedClass.value}/${selectedDivision.value}`,
//         {
//           subject_id: selectedSubject.value,
//           teacher_id: selectedTeacher.value,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       toast.success("Teacher successfully allotted to the subject");
//     } catch (error) {
//       toast.error("Error allotting teacher to the subject");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <ToastContainer />
//       {loading && <Loader />}

//       <div className="container mt-4">
//         <div className="card mx-auto lg:w-full shadow-lg">
//           <div className="card-header flex justify-between items-center">
//             <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl">
//               Allot Teachers to Subjects
//             </h3>
//           </div>

//           <div className="card-body w-full md:w-[85%] mx-auto ">
//             <div className="form-group flex justify-center gap-x-1 md:gap-x-6">
//               <label className="w-1/4 pt-2 text-center">
//                 Select Class <span className="text-red-500">*</span>
//               </label>
//               <div className="w-full">
//                 <Select
//                   components={animatedComponents}
//                   options={classes}
//                   value={selectedClass}
//                   onChange={setSelectedClass}
//                   placeholder="Select Class"
//                 />
//               </div>
//             </div>

//             <div className="form-group flex justify-center gap-x-1 md:gap-x-6 mt-4">
//               <label className="w-1/4 pt-2 text-center">
//                 Select Division <span className="text-red-500">*</span>
//               </label>
//               <div className="w-full">
//                 <Select
//                   components={animatedComponents}
//                   options={divisions}
//                   value={selectedDivision}
//                   onChange={setSelectedDivision}
//                   placeholder="Select Division"
//                 />
//               </div>
//             </div>

//             <div className="form-group flex justify-center gap-x-1 md:gap-x-6 mt-4">
//               <label className="w-1/4 pt-2 text-center">
//                 Teacher Assigned <span className="text-red-500">*</span>
//               </label>
//               <div className="w-full">
//                 <Select
//                   components={animatedComponents}
//                   options={teachers}
//                   value={selectedTeacher}
//                   onChange={setSelectedTeacher}
//                   placeholder="Select Teacher"
//                 />
//               </div>
//             </div>

//             <div className="form-group flex justify-center gap-x-1 md:gap-x-6 mt-4">
//               <label className="w-1/4 pt-2 text-center">
//                 Select Subject <span className="text-red-500">*</span>
//               </label>
//               <div className="w-full">
//                 <Select
//                   components={animatedComponents}
//                   options={subjects}
//                   value={selectedSubject}
//                   onChange={setSelectedSubject}
//                   placeholder="Select Subject"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end p-3 mr-5 mt-4">
//               <button
//                 onClick={handleSubmit}
//                 type="button"
//                 className="btn h-10 w-18 btn-primary"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeacherSubjectAllotment;
//working but want to call one more api on the bases of teacher return subjects
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Select from "react-select";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const AllotTeachersTab = () => {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const [classes, setClasses] = useState([]);
//   const [divisions, setDivisions] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [teachers, setTeachers] = useState([]);
//   const [selectedClass, setSelectedClass] = useState(null);
//   const [selectedDivision, setSelectedDivision] = useState(null);
//   const [selectedSubjects, setSelectedSubjects] = useState([]);
//   const [selectedTeacher, setSelectedTeacher] = useState(null);

//   useEffect(() => {
//     fetchClassNames();
//     fetchTeachers();
//   }, []);
//   // Define custom styles for react-select
//   const customSelectStyles = {
//     control: (provided) => ({
//       ...provided,
//       minHeight: "40px", // Set a minimum height for the select box
//     }),
//     valueContainer: (provided) => ({
//       ...provided,
//       height: "40px", // Set the height for the value container
//       display: "flex",

//       alignItems: "center",
//     }),
//     input: (provided) => ({
//       ...provided,

//       height: "40px", // Set the height for the input box
//     }),
//     dropdownIndicator: (provided) => ({
//       ...provided,
//       // backgroundColor: "black",
//       height: "40px", // Set the height for the dropdown indicator
//     }),
//   };
//   const fetchClassNames = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(`${API_URL}/api/getClassList`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setClasses(response.data);
//       console.log("inside the ALLot_teaceher tab:CLASSESS", classes);
//     } catch (error) {
//       toast.error("Error fetching class names");
//     }
//   };

//   const fetchTeachers = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(`${API_URL}/api/get_teacher_list`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setTeachers(
//         response.data.map((teacher) => ({
//           value: teacher.reg_id,
//           label: teacher.name,
//         }))
//       );
//       console.log("inside the ALLot_teaceher tab:Teachers", teachers);
//     } catch (error) {
//       toast.error("Error fetching teachers");
//     }
//   };

//   const handleClassChange = async (selectedOption) => {
//     setSelectedClass(selectedOption);
//     setSelectedDivision(null);
//     setDivisions([]);
//     setSubjects([]);

//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(
//         `${API_URL}/api/get_divisions/${selectedOption.value}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setDivisions(response?.data?.divisions);
//       console.log("inside the ALLot_teaceher tab:Divisions", response.data);
//     } catch (error) {
//       toast.error("Error fetching divisions");
//     }
//   };

//   const handleDivisionChange = async (selectedOption) => {
//     setSelectedDivision(selectedOption);
//     setSubjects([]);

//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(
//         `${API_URL}/api/get_subjects/${selectedOption.value}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setSubjects(response?.data?.subjects);
//       console.log(
//         "inside the ALLot_teaceher tab:Subjects",
//         response.data?.subjects
//       );
//     } catch (error) {
//       toast.error("Error fetching subjects");
//     }
//   };

//   const handleSubjectChange = (subjectId) => {
//     if (selectedSubjects.includes(subjectId)) {
//       setSelectedSubjects(selectedSubjects.filter((id) => id !== subjectId));
//     } else {
//       setSelectedSubjects([...selectedSubjects, subjectId]);
//     }
//   };

//   const handleSave = async () => {
//     if (
//       !selectedClass ||
//       !selectedDivision ||
//       selectedSubjects.length === 0 ||
//       !selectedTeacher
//     ) {
//       toast.error("Please fill all fields before saving");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.post(
//         `${API_URL}/api/allot-teacher-for-subject/${selectedClass.value}/${selectedDivision.value}`,
//         {
//           subjects: selectedSubjects,
//           teacher_id: selectedTeacher.value,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       toast.success("Teacher allotted successfully");
//     } catch (error) {
//       toast.error("Error saving allotment");
//     }
//   };

//   return (
//     <div>
//       <ToastContainer />
//       <div className="container mt-4">
//         <div className="card mx-auto lg:w-full shadow-lg">
//           <div className="card-header flex justify-between items-center">
//             <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
//               Allot Teachers
//             </h3>
//           </div>
//           <div className="card-body w-full md:w-[85%] mx-auto">
//             <div className="form-group flex justify-center gap-x-1 md:gap-x-6">
//               <label className="w-1/4 pt-2 items-center text-center px-2 lg:px-3 py-2 font-semibold text-[1em] text-gray-700">
//                 Select Class <span className="text-red-500">*</span>
//               </label>
//               <div className="w-full">
//                 <Select
//                   options={classes.map((cls) => ({
//                     value: cls.class_id,
//                     label: cls.name,
//                   }))}
//                   value={selectedClass}
//                   onChange={handleClassChange}
//                   placeholder="Select"
//                   styles={customSelectStyles} // Apply custom styles
//                 />
//               </div>
//             </div>
//             <div className="form-group flex justify-center gap-x-1 md:gap-x-6 mt-4">
//               <label className="w-1/4 pt-2 items-center text-center px-2 lg:px-3 py-2 font-semibold text-[1em] text-gray-700">
//                 Select Division <span className="text-red-500">*</span>
//               </label>
//               <div className="w-full">
//                 <select
//                   className="form-control"
//                   value={selectedDivision ? selectedDivision.value : ""}
//                   onChange={(e) =>
//                     handleDivisionChange({
//                       value: e.target.value,
//                       label: divisions.find(
//                         (div) => div.section_id == e.target.value
//                       )?.name,
//                     })
//                   }
//                   disabled={!selectedClass}
//                 >
//                   <option value="">Select </option>
//                   {divisions.map((div) => (
//                     <option key={div.section_id} value={div.section_id}>
//                       {div.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//             <div className="form-group flex justify-center gap-x-1 md:gap-x-6 mt-4">
//               <label className="w-1/4 pt-2 items-center text-center px-2 lg:px-3 py-2 font-semibold text-[1em] text-gray-700">
//                 Assign Teacher <span className="text-red-500">*</span>
//               </label>
//               <div className="w-full">
//                 <Select
//                   options={teachers}
//                   value={selectedTeacher}
//                   onChange={setSelectedTeacher}
//                   placeholder="Select"
//                   styles={customSelectStyles} // Apply custom styles
//                 />
//               </div>
//             </div>
//             <div className="form-group flex justify-center gap-x-1 md:gap-x-6 mt-4">
//               <label className="w-1/4 pt-2 items-center text-center px-2 lg:px-3 py-2 font-semibold text-[1em] text-gray-700">
//                 Select Subjects <span className="text-red-500">*</span>
//               </label>
//               <div className="w-full">
//                 {subjects.map((subject) => (
//                   <div key={subject.sm_id}>
//                     <label>
//                       <input
//                         type="checkbox"
//                         value={subject.sm_id}
//                         checked={selectedSubjects.includes(subject.sm_id)}
//                         onChange={() => handleSubjectChange(subject.sm_id)}
//                       />
//                       {subject.name}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="flex justify-end p-3 mr-5 mt-4">
//               <button
//                 onClick={handleSave}
//                 type="button"
//                 className="btn h-10 md:h-auto w-18 md:w-auto btn-primary"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllotTeachersTab;
// Logic on the bases of teacher return subjet checkedbox checs
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Select from "react-select";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const AllotTeachersTab = () => {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const [classes, setClasses] = useState([]);
//   const [divisions, setDivisions] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [teachers, setTeachers] = useState([]);
//   const [selectedClass, setSelectedClass] = useState(null);
//   const [selectedDivision, setSelectedDivision] = useState(null);
//   const [selectedTeacher, setSelectedTeacher] = useState(null);
//   const [preSubjects, setPreSubjects] = useState([]);

//   useEffect(() => {
//     fetchClassNames();
//     fetchTeachers();
//   }, []);

//   useEffect(() => {
//     if (selectedTeacher) {
//       fetchPreSubjectsForTeacher();
//     } else {
//       setPreSubjects([]);
//     }
//   }, [selectedTeacher]);

//   const customSelectStyles = {
//     control: (provided) => ({
//       ...provided,
//       minHeight: "40px",
//     }),
//     valueContainer: (provided) => ({
//       ...provided,
//       height: "40px",
//       display: "flex",
//       alignItems: "center",
//     }),
//     input: (provided) => ({
//       ...provided,
//       height: "40px",
//     }),
//     dropdownIndicator: (provided) => ({
//       ...provided,
//       height: "40px",
//     }),
//   };

//   const fetchClassNames = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(`${API_URL}/api/getClassList`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setClasses(response.data);
//     } catch (error) {
//       toast.error("Error fetching class names");
//     }
//   };

//   const fetchTeachers = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(`${API_URL}/api/get_teacher_list`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setTeachers(
//         response.data.map((teacher) => ({
//           value: teacher.reg_id,
//           label: teacher.name,
//         }))
//       );
//       console.log("This is thhe fetchTeachers ", response.data);
//     } catch (error) {
//       toast.error("Error fetching teachers");
//     }
//   };

//   const fetchPreSubjectsForTeacher = async () => {
//     if (!selectedTeacher || !selectedClass || !selectedDivision) return;
//     console.log(
//       "The fectch pre_selected teacher list parameter",
//       selectedClass.value,
//       selectedDivision.value,
//       selectedTeacher.value
//     );
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(
//         // `${API_URL}/api/get_presign_subject_by_teacher/${102}/${400}/${7}`,

//         `${API_URL}/api/get_presign_subject_by_teacher/${selectedClass.value}/${selectedDivision.value}/${selectedTeacher.value}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       // Map the fetched subjects to match the expected structure
//       const fetchedPreSubjects = response.data.subjects.map((subject) => ({
//         subject_id: subject.subject_id, // Use subject_id from the API response
//         sm_id: subject.sm_id,
//         teacher_id: subject?.teacher_id,
//       }));

//       setPreSubjects(fetchedPreSubjects);
//       console.log(
//         "This is thhe fetchPreSubjectsForTeacher ",
//         response.data.subjects
//       );
//     } catch (error) {
//       toast.error("Error fetching pre-subjects");
//     }
//   };

//   const handleClassChange = async (selectedOption) => {
//     setSelectedClass(selectedOption);
//     setSelectedDivision(null);
//     setDivisions([]);
//     setSubjects([]);
//     setPreSubjects([]);

//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(
//         `${API_URL}/api/get_divisions/${selectedOption.value}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setDivisions(response.data.divisions);
//       console.log("This is thhe get_divisions ", response.data);
//     } catch (error) {
//       toast.error("Error fetching divisions");
//     }
//   };

//   const handleDivisionChange = async (selectedOption) => {
//     setSelectedDivision(selectedOption);
//     setSubjects([]);
//     setPreSubjects([]);

//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(
//         `${API_URL}/api/get_subjects/${selectedOption.value}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setSubjects(response.data.subjects);
//       console.log("This is thhe get_subjects ", response.data.subjects);
//     } catch (error) {
//       toast.error("Error fetching subjects");
//     }
//   };

//   const handleSubjectChange = (subjectId, subjectName) => {
//     if (preSubjects.find((item) => item.sm_id === subjectId)) {
//       setPreSubjects(preSubjects.filter((item) => item.sm_id !== subjectId));
//     } else {
//       setPreSubjects([
//         ...preSubjects,
//         {
//           sm_id: subjectId, // sm_id from the subject table
//           subject_id: subjects.find((subject) => subject.sm_id === subjectId)
//             .subject_id, // Fetching subject_id from subjects array
//           teacher_id: selectedTeacher ? selectedTeacher.value : null,
//         },
//       ]);
//     }
//   };

//   const handleSave = async () => {
//     if (!selectedClass || !selectedDivision || !selectedTeacher) {
//       toast.error("Please fill all fields before saving");
//       return;
//     }
//     console.log("submitted form", preSubjects);
//     try {
//       const token = localStorage.getItem("authToken");
//       await axios.post(
//         `${API_URL}/api/allot-teacher-for-subject/${selectedClass.value}/${selectedDivision.value}`,
//         { subjects: preSubjects },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       toast.success("Teacher allotted successfully");
//     } catch (error) {
//       toast.error("Error saving allotment");
//     }
//   };

//   return (
//     <div>
//       <ToastContainer />
//       <div className="container mt-4">
//         <div className="card mx-auto lg:w-full shadow-lg">
//           <div className="card-header flex justify-between items-center">
//             <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
//               Allot Teachers
//             </h3>
//           </div>
//           <div className="card-body w-full md:w-[85%] mx-auto">
//             <div className="form-group flex justify-center gap-x-1 md:gap-x-6">
//               <label className="w-1/4 pt-2 items-center text-center px-2 lg:px-3 py-2 font-semibold text-[1em] text-gray-700">
//                 Select Class <span className="text-red-500">*</span>
//               </label>
//               <div className="w-full">
//                 <Select
//                   options={classes.map((cls) => ({
//                     value: cls.class_id,
//                     label: cls.name,
//                   }))}
//                   value={selectedClass}
//                   onChange={handleClassChange}
//                   placeholder="Select"
//                   styles={customSelectStyles}
//                 />
//               </div>
//             </div>
//             <div className="form-group flex justify-center gap-x-1 md:gap-x-6 mt-4">
//               <label className="w-1/4 pt-2 items-center text-center px-2 lg:px-3 py-2 font-semibold text-[1em] text-gray-700">
//                 Select Division <span className="text-red-500">*</span>
//               </label>
//               <div className="w-full">
//                 <select
//                   className="form-control"
//                   value={selectedDivision ? selectedDivision.value : ""}
//                   onChange={(e) =>
//                     handleDivisionChange({
//                       value: e.target.value,
//                       label: divisions.find(
//                         (div) => div.section_id == e.target.value
//                       )?.name,
//                     })
//                   }
//                   disabled={!selectedClass}
//                 >
//                   <option value="">Select</option>
//                   {divisions.map((div) => (
//                     <option key={div.section_id} value={div.section_id}>
//                       {div.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//             <div className="form-group flex justify-center gap-x-1 md:gap-x-6 mt-4">
//               <label className="w-1/4 pt-2 items-center text-center px-2 lg:px-3 py-2 font-semibold text-[1em] text-gray-700">
//                 Assign Teacher <span className="text-red-500">*</span>
//               </label>
//               <div className="w-full">
//                 <Select
//                   options={teachers}
//                   value={selectedTeacher}
//                   onChange={setSelectedTeacher}
//                   placeholder="Select"
//                   styles={customSelectStyles}
//                 />
//               </div>
//             </div>
//             <div className="form-group flex justify-center gap-x-1 md:gap-x-6 mt-4">
//               <label className="w-1/4 pt-2 items-center text-center px-2 lg:px-3 py-2 font-semibold text-[1em] text-gray-700">
//                 Select Subjects <span className="text-red-500">*</span>
//               </label>
//               <div className="w-full">
//                 <div className="flex flex-wrap gap-2">
//                   {subjects.length > 0 ? (
//                     subjects.map((subject) => (
//                       <div key={subject.sm_id} className="flex items-center">
//                         <input
//                           type="checkbox"
//                           id={`subject-${subject.sm_id}`}
//                           checked={preSubjects.some(
//                             (item) => item.sm_id === subject.sm_id
//                           )}
//                           onChange={() =>
//                             handleSubjectChange(subject.sm_id, subject.name)
//                           }
//                         />
//                         <label
//                           htmlFor={`subject-${subject.sm_id}`}
//                           className="ml-2"
//                         >
//                           {subject.name}
//                         </label>
//                       </div>
//                     ))
//                   ) : (
//                     <p>No subjects available</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div className="form-group flex justify-center mt-4">
//               <button
//                 type="button"
//                 onClick={handleSave}
//                 className="btn btn-primary"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllotTeachersTab;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RxCross1 } from "react-icons/rx";
import Loader from "../../common/LoaderFinal/LoaderStyle";

const AllotTeachersTab = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState(null);

  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [preSubjects, setPreSubjects] = useState([]);

  // Error state variables
  const [classError, setClassError] = useState("");
  const [divisionError, setDivisionError] = useState("");
  const [teacherError, setTeacherError] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClassNames();
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (selectedTeacher) {
      fetchPreSubjectsForTeacher();
    } else {
      setPreSubjects([]);
    }
  }, [selectedTeacher]);

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "40px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "40px",
      display: "flex",
      alignItems: "center",
    }),
    input: (provided) => ({
      ...provided,
      height: "40px",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      height: "40px",
    }),
  };

  const fetchClassNames = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/getClassList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(response.data);
    } catch (error) {
      toast.error("Error fetching class names");
    }
  };

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/get_teacher_list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(
        response.data.map((teacher) => ({
          value: teacher.reg_id,
          label: teacher.name,
        }))
      );
    } catch (error) {
      toast.error("Error fetching teachers");
    }
  };

  const fetchPreSubjectsForTeacher = async () => {
    if (!selectedTeacher || !selectedClass || !selectedDivision) return;
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/get_presign_subject_by_teacher/${selectedClass.value}/${selectedDivision.value}/${selectedTeacher.value}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fetchedPreSubjects = response.data.subjects.map((subject) => ({
        subject_id: subject.subject_id,
        sm_id: subject.sm_id,
        teacher_id: subject?.teacher_id,
      }));

      setPreSubjects(fetchedPreSubjects);
    } catch (error) {
      toast.error("Error fetching pre-subjects");
    }
  };

  const handleClassChange = async (selectedOption) => {
    console.log("handleClassChnage", selectedOption);
    setSelectedClassId(selectedOption.value);
    setSelectedClass(selectedOption);
    setSelectedDivision(null);
    setSelectedTeacher(null); // Clear teacher when class changes
    setTeacherError("");
    setSubjectError("");
    setDivisions([]);
    setSubjects([]);
    setPreSubjects([]);
    setClassError(""); // Clear previous error message

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/get_divisions/${selectedOption.value}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDivisions(response.data.divisions);
    } catch (error) {
      toast.error("Error fetching divisions");
    }
  };

  const handleDivisionChange = async (selectedOption) => {
    console.log("handleDivisionChnage", selectedOption);

    setSelectedDivision(selectedOption);
    setSubjects([]);
    setPreSubjects([]);
    setDivisionError(""); // Clear previous error message

    try {
      const token = localStorage.getItem("authToken");
      // Fetch pre-selected subjects for the selected class and division
      const params = new URLSearchParams();
      params.append("section_id[]", selectedOption.value); // Add division/section ID as a parameter
      const response = await axios.get(
        `${API_URL}/api/get_presubjects/${selectedClassId}?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSubjects(response.data?.subjects);
      console.log("presubjects comes", response.data?.subjects);
    } catch (error) {
      toast.error("Error fetching subjects");
    }
  };

  const handleSubjectChange = (subjectId) => {
    setSubjectError("");
    if (preSubjects.find((item) => item.sm_id === subjectId)) {
      setPreSubjects(preSubjects.filter((item) => item.sm_id !== subjectId));
    } else {
      setPreSubjects([
        ...preSubjects,
        {
          sm_id: subjectId,
          subject_id: subjects.find((subject) => subject.sm_id === subjectId)
            .subject_id,
          teacher_id: selectedTeacher ? selectedTeacher.value : null,
        },
      ]);
    }
  };

  const handleSave = async () => {
    setLoading(true);

    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    let hasError = false;

    // Validate form fields
    if (!selectedClass) {
      setClassError("Please select a class.");
      setLoading(false);

      hasError = true;
    }
    if (!selectedDivision) {
      setDivisionError("Please select a division.");
      hasError = true;
    }
    if (!selectedTeacher) {
      setTeacherError("Please select a teacher.");
      hasError = true;
    }
    if (preSubjects.length === 0) {
      setSubjectError("Please select at least one subject.");
      hasError = true;
    }

    if (hasError) {
      setLoading(false);

      setIsSubmitting(false);
      return;
    } // If there are errors, don't proceed with the save.

    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${API_URL}/api/allot-teacher-for-subject/${selectedClass.value}/${selectedDivision.value}`,
        { subjects: preSubjects },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Success message
      toast.success("Teacher allotted successfully");

      // Clear fields after successful submission
      setTimeout(() => {
        setSelectedClass(null);
        setSelectedDivision(null);
        setSelectedTeacher(null);
        setClassError("");
        setDivisionError("");
        setTeacherError("");
        setSubjectError("");
        setSubjects([]);
        setPreSubjects([]);
      }, 500);
    } catch (error) {
      toast.error("Error saving allotment");
    } finally {
      setLoading(false);

      setIsSubmitting(false); // Re-enable the button after the operation
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="container mt-4">
        <div className="card mx-auto lg:w-full shadow-lg">
          <div className="p-2 px-3 bg-gray-100 flex justify-between items-center">
            <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
              Allot Teachers
            </h3>
            {/* <RxCross1
              className="float-end relative top-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
              type="button"
              // className="btn-close text-red-600"
              onClick={handleCloseModalForAllotTeacher}
            /> */}
          </div>
          <div
            className=" relative -top-2 mb-3 h-1 w-[97%] mx-auto bg-red-700"
            style={{
              backgroundColor: "#C03078",
            }}
          ></div>
          <div className="card-body w-full md:w-[85%] mx-auto">
            {loading ? (
              <tr>
                <div className=" absolute inset-0 py-8 h flex items-center justify-center bg-gray-50  z-10">
                  <Loader /> {/* Replace with your loader */}
                </div>
              </tr>
            ) : (
              <div className="">
                <div className=" form-group flex justify-center gap-x-1 md:gap-x-6">
                  <label className="w-1/4 pt-2 relative right-0 md:right-2.5 items-center text-center px-2 lg:px-3 py-2 font-semibold text-[1em] text-gray-700">
                    Select Class <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full">
                    <Select
                      options={classes.map((cls) => ({
                        value: cls.class_id,
                        label: cls.name,
                      }))}
                      value={selectedClass}
                      onChange={handleClassChange}
                      placeholder="Select"
                      styles={customSelectStyles}
                      className="w-full md:w-[50%]"
                      // isClearable
                    />
                    {classError && (
                      <p className=" absolute text-red-500 text-xs">
                        {classError}
                      </p>
                    )}
                  </div>
                </div>
                <div className=" form-group  gap-x-1 relative  left-0 md:-left-5 flex justify-start  mt-4">
                  <label className="w-1/4 pt-2  items-center text-center   py-2 font-semibold text-[1em] text-gray-700">
                    Select Division <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full  md:w-[39%]  ">
                    <select
                      className="form-control "
                      value={selectedDivision ? selectedDivision.value : ""}
                      onChange={(e) =>
                        handleDivisionChange({
                          value: e.target.value,
                          label: divisions.find(
                            (div) => div.section_id == e.target.value
                          )?.name,
                        })
                      }
                      disabled={!selectedClass}
                    >
                      <option value="">Select</option>
                      {divisions.map((div) => (
                        <option key={div.section_id} value={div.section_id}>
                          {div.name}
                        </option>
                      ))}
                    </select>
                    {divisionError && (
                      <p className="absolute text-red-500 text-xs">
                        {divisionError}
                      </p>
                    )}
                  </div>
                </div>
                <div className=" form-group flex justify-center gap-x-1 md:gap-x-6 mt-4">
                  <label className="w-1/4 relative right-0 md:right-0.5 pt-2 items-center text-center px-2 lg:px-3 py-2 font-semibold text-[1em] text-gray-700">
                    Select Teacher <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full">
                    <Select
                      options={teachers}
                      value={selectedTeacher}
                      onChange={setSelectedTeacher}
                      placeholder="Select"
                      styles={customSelectStyles}
                      isDisabled={!selectedDivision}
                      isClearable
                      className="w-full md:w-[50%]"
                    />
                    {teacherError && (
                      <p className="absolute text-red-500 text-xs">
                        {teacherError}
                      </p>
                    )}
                  </div>
                </div>
                <div className=" form-group flex justify-center gap-x-1 md:gap-x-6 mt-4">
                  <label className="w-1/4  pt-2 items-center text-center px-2 lg:px-3 py-2 font-semibold text-[1em] text-gray-700 ">
                    Select Subjects <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full">
                    <div className="relative gap-x-10 top-2   grid grid-cols-3  w-full">
                      {subjects.map((subject) => (
                        <label
                          key={subject.sm_id}
                          // className="flex items-center cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="mr-0.5 shadow-lg"
                            checked={preSubjects.some(
                              (item) => item.sm_id === subject.sm_id
                            )}
                            onChange={() => handleSubjectChange(subject.sm_id)}
                          />
                          <span className="font-normal text-gray-600">
                            {subject?.get_subject?.name}
                          </span>
                        </label>
                      ))}
                    </div>
                    {subjectError && (
                      <p className="relative top-3  text-red-500 text-xs ">
                        {subjectError}
                      </p>
                    )}
                  </div>
                </div>{" "}
                <div className="form-group flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllotTeachersTab;
