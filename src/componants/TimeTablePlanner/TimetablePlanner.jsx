// // Try UP

// import { useState, useEffect, useMemo, useRef } from "react";
// import axios from "axios";
// import Select from "react-select";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import { RxCross1 } from "react-icons/rx";
// import "react-datepicker/dist/react-datepicker.css";
// import CommonTable from "./CommonTable";

// const TimetablePlanner = () => {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   //   const [fromDate, setFromDate] = useState(null);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [studentNameWithClassId, setStudentNameWithClassId] = useState([]);
//   const [selectedStudentId, setSelectedStudentId] = useState(null);
//   const [loadingForSearch, setLoadingForSearch] = useState(false);

//   const navigate = useNavigate();
//   const [loadingExams, setLoadingExams] = useState(false);
//   const [studentError, setStudentError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [timetable, setTimetable] = useState([]);

//   const pageSize = 10;
//   const [pageCount, setPageCount] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   //   const [timetableData, setTimetableData] = useState([]);
//   const [timetableData, setTimetableData] = useState({
//     periods: [],
//     subjects: [],
//     rowCounts: { mon_fri: 0, sat: 0 }, // Initialize rowCounts state
//   }); // To hold transformed data
//   const [loadingForTabSwitch, setLoadingForTabSwitch] = useState(false); // Loading state
//   const [storeWholeData, setStoreWholeData] = useState([]);
//   const [weekRange, setWeekRange] = useState("");
//   const [subjects, setSubjects] = useState([]);
//   const [tabs, setTabs] = useState([]);
//   const [selectedSubjects, setSelectedSubjects] = useState({});
//   const [allocatedPeriods, setAllocatedPeriods] = useState(null); // Store allocated periods
//   const [usedPeriods, setUsedPeriods] = useState(null); // Store used periods
//   const [occupiedPeriods, setOccupiedPeriods] = useState(0); // Store occupied periods
//   const data = {
//     tab: [
//       { id: "1-A", label: "1-A", periods: 6 },
//       { id: "1-B", label: "1-B", periods: 6 },
//       { id: "12-A", label: "12-A", periods: 6 },
//       { id: "12-B", label: "12-B", periods: 6 },
//     ],
//     "1-A": {
//       Monday: [
//         {
//           time_in: "08:30",
//           period_no: 1,
//           time_out: "09:10",
//           subject: "Math",
//           teacher: [{ t_name: "John Doe" }],
//         },
//         {
//           time_in: "09:10",
//           period_no: 2,
//           time_out: "09:45",
//           subject: "Science",
//           teacher: [{ t_name: "Jane Smith" }],
//         },
//       ],
//       Tuesday: [
//         {
//           time_in: "08:30",
//           period_no: 1,
//           time_out: "09:10",
//           subject: "History",
//           teacher: [{ t_name: "John Doe" }],
//         },
//       ],
//       Wednesday: [],
//       Thursday: [],
//       Friday: [],
//       Saturday: [],
//     },
//     "1-B": {
//       Monday: [
//         {
//           time_in: "08:30",
//           period_no: 1,
//           time_out: "09:10",
//           subject: "Biology",
//           teacher: [{ t_name: "Alice Cooper" }],
//         },
//       ],
//       Tuesday: [],
//       Wednesday: [],
//       Thursday: [],
//       Friday: [],
//       Saturday: [],
//     },
//     "12-A": {
//       Monday: [],
//       Tuesday: [],
//       Wednesday: [],
//       Thursday: [],
//       Friday: [],
//       Saturday: [],
//     },
//     "12-B": {
//       Monday: [],
//       Tuesday: [],
//       Wednesday: [],
//       Thursday: [],
//       Friday: [],
//       Saturday: [],
//     },
//   };

//   const [activeTab, setActiveTab] = useState(data.tab[0].id);

//   useEffect(() => {
//     fetchExams();
//   }, []);

//   const fetchExams = async () => {
//     try {
//       setLoadingExams(true);
//       const token = localStorage.getItem("authToken");

//       const response = await axios.get(
//         `${API_URL}/api/get_teacherslistbyperiod`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       console.log("Teachers", response.data);
//       setStudentNameWithClassId(response?.data?.data || []);
//     } catch (error) {
//       toast.error("Error fetching Teachers");
//       console.error("Error fetching Teachers:", error);
//     } finally {
//       setLoadingExams(false);
//     }
//   };

//   const handleStudentSelect = (selectedOption) => {
//     setStudentError(""); // Reset error if student is select.
//     setSelectedStudent(selectedOption);
//     setSelectedStudentId(selectedOption?.value);
//   };

//   const studentOptions = useMemo(
//     () =>
//       studentNameWithClassId.map((cls) => ({
//         value: cls?.teacher_id,
//         label: `${cls.teachername}`,
//       })),
//     [studentNameWithClassId]
//   );
//   console.log("studentNameWithClassId[]--->", studentNameWithClassId);

//   console.log("studentOptions[]--->", studentOptions);

//   // Handle search and fetch parent information

//   const handleSearch = async () => {
//     setLoadingForSearch(false);
//     // setSelectedStudent("");
//     // setSelectedStudentId("");
//     if (!selectedStudentId) {
//       setStudentError("Please select teacher name.");
//       setLoadingForSearch(false);
//       return;
//     }

//     setSearchTerm("");
//     setTimetableData({
//       periods: [],
//       subjects: [],
//       rowCounts: { mon_fri: 0, sat: 0 },
//     });
//     setSelectedSubjects({});
//     setAllocatedPeriods(null); // Reset periods
//     setUsedPeriods(null); // Reset used periods
//     setOccupiedPeriods(0); // Reset occupied periods
//     try {
//       const formattedWeek = weekRange.replace(/\s/g, "").replace(/%20/g, ""); // Ensure no extra spaces or encoded symbols
//       console.log("Formatted Week is: --->", formattedWeek);

//       setLoadingForSearch(true); // Start loading
//       setTimetable([]);

//       const token = localStorage.getItem("authToken");
//       const periodResponse = await axios.get(
//         `${API_URL}/api/get_teacherperioddata?teacher_id=${selectedStudentId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (periodResponse?.data?.success) {
//         setAllocatedPeriods(periodResponse?.data?.data[0]?.periods_allocated);
//         setUsedPeriods(periodResponse?.data?.data[0]?.periods_used);
//       } else {
//         toast.error("Failed to fetch teacher period data.");
//       }
//       const params = {
//         teacher_id: selectedStudentId,
//       };

//       const response = await axios.get(
//         `${API_URL}/api/get_teacherclasstimetable`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           params,
//         }
//       );

//       if (!response?.data?.data || response?.data?.data?.length === 0) {
//         toast.error("Time Table Planner for selected teacher not found.");
//         setTimetable([]);
//       } else {
//         setTimetable(response?.data?.data);
//         setPageCount(Math.ceil(response?.data?.data?.length / pageSize));
//       }
//       const formattedTabs = response.data.data.map((item) => ({
//         id: `${item.classname}-${item.sectionname}`,
//         classname: item.classname,
//         sectionname: item.sectionname,
//         teachername: item.teachername,
//         class_id: item.class_id, // Store class_id
//         section_id: item.section_id, // Store section_id
//       }));

//       // Now you have class_id and section_id stored for each tab

//       // Sort tabs by class in ascending order
//       const sortedTabs = formattedTabs.sort((a, b) => {
//         const classA = parseInt(a.classname, 10);
//         const classB = parseInt(b.classname, 10);
//         return classA - classB;
//       });

//       setTabs(sortedTabs);
//       //   setActiveTab(sortedTabs[0]?.id || ""); // Set default active tab
//     } catch (error) {
//       console.error(
//         "Error fetching Time Table Planner for selected teacher :",
//         error
//       );
//       toast.error(
//         "Error fetching Time Table Planner for selected teacher. Please try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//       setLoadingForSearch(false);
//     }
//   };

//   console.log("row", timetable);
//   const filteredTabs = tabs.filter((tab) =>
//     tab.id.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   const filteredSections = timetable.filter((student) => {
//     const searchLower = searchTerm.toLowerCase();

//     // Extract relevant fields and convert them to lowercase for case-insensitive search
//     const teacherName = student?.teachername?.toLowerCase() || "";
//     const week = student?.week?.toLowerCase() || "";
//     const totalHours =
//       student?.time_difference_decimal?.toString().toLowerCase() || "";

//     // Check if the search term is present in any of the specified fields
//     return (
//       teacherName.includes(searchLower) ||
//       week.includes(searchLower) ||
//       totalHours.includes(searchLower)
//     );
//   });

//   const displayedSections = filteredSections.slice(currentPage * pageSize);

//   const fetchTimetableData = async (teacher_id, class_id, section_id) => {
//     setLoadingForTabSwitch(true);
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await axios.get(
//         `${API_URL}/api/get_timetablebyclasssection/${class_id}/${section_id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // Check for the specific error response
//       if (response.data?.success === false && response.data?.message) {
//         toast.error(response.data.message); // Show toast error message
//         setTimetableData({
//           periods: [],
//           subjects: [],
//           rowCounts: { mon_fri: 0, sat: 0 },
//         }); // Clear any existing data
//         return; // Do not proceed to show the table if the response indicates an error
//       }

//       if (response.data && response.data.data) {
//         const transformedData = transformTimetableData(response.data.data);
//         setTimetableData(transformedData); // Store the transformed data
//       } else {
//         setTimetableData({
//           periods: [],
//           subjects: [],
//           rowCounts: { mon_fri: 0, sat: 0 },
//         });
//       }

//       const subjectsResponse = await axios.get(
//         `${API_URL}/api/get_teachersubjectbyclass?teacher_id=${teacher_id}&class_id=${class_id}&section_id=${section_id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (subjectsResponse.data && subjectsResponse.data.data) {
//         setSubjects(subjectsResponse.data.data); // Store the subjects data
//       } else {
//         setSubjects([]); // Handle error fetching subjects data
//       }
//     } catch (error) {
//       console.error("Error fetching timetable data:", error);
//       setTimetableData({
//         periods: [],
//         subjects: [],
//         rowCounts: { mon_fri: 0, sat: 0 },
//       }); // Clear any existing data
//       setSubjects([]); // Handle error fetching subjects data
//       toast.error("Error fetching timetable data. Please try again.");
//     } finally {
//       setLoadingForTabSwitch(false);
//     }
//   };

//   // Ensure to check before rendering the `CommonTable`

//   const handleTableData = (
//     classId,
//     sectionId,
//     day,
//     period_no,
//     selectedSubject
//   ) => {
//     const key = `${classId}-${sectionId}`;

//     setSelectedSubjects((prevSubjects) => ({
//       ...prevSubjects,
//       [key]: {
//         ...prevSubjects[key], // Preserve previous data for the same class-section
//         [day]: {
//           ...(prevSubjects[key]?.[day] || {}), // Preserve previous day's data
//           [period_no]: selectedSubject, // Update selected subject for this period
//         },
//       },
//     }));
//     console.log("setSelectedSubjects[]----->", selectedSubjects);
//   };

//   // Function to transform timetable data
// const transformTimetableData = (data) => {
//   const periods = [];
//   const subjects = [];

//   const rowCounts = {
//     mon_fri: data.mon_fri, // Number of periods for Monday to Friday
//     sat: data.sat, // Number of periods for Saturday
//   };

//   Object.keys(data).forEach((day) => {
//     if (day !== "mon_fri" && day !== "sat") {
//       const dayData = data[day];
//       dayData.forEach((period) => {
//         periods.push({
//           period_no: period.period_no,
//           time_in: period.time_in,
//           time_out: period.time_out,
//           subject: period.subject,
//         });

//         // Check if teacher is not null and handle accordingly
//         const teachers =
//           period.teacher && Array.isArray(period.teacher)
//             ? period.teacher.map((t) => t.t_name).join(", ")
//             : ""; // If null or not an array, leave empty string

//         subjects.push({
//           day,
//           period_no: period.period_no,
//           subject: period.subject,
//           teachers: teachers, // Join teachers if multiple, otherwise empty string
//         });
//       });
//     }
//   });

//   return { periods, subjects, rowCounts };
// };

//   useEffect(() => {
//     // Find the active tab based on `activeTab`
//     let activeTabData = tabs.find((tab) => tab.id === activeTab);
//     //  const activeTabData = tabs.find((tab) => tab.id === activeTab);
//     // Call fetchTimetableData with class_id and section_id
//     if (activeTabData) {
//       setLoadingForTabSwitch(true);
//       fetchTimetableData(
//         selectedStudentId,
//         activeTabData.class_id,
//         activeTabData.section_id
//       );
//     }
//   }, [activeTab, selectedStudentId, tabs]); // Fetch data whenever activeTab changes
//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     try {
//       // Prepare data to submit
//       const submitData = Object.keys(selectedSubjects).map((key) => {
//         const [classId, sectionId] = key.split("-"); // Extract class_id and section_id from key
//         const classSectionData = selectedSubjects[key];

//         const subjectsForClassSection = Object.keys(classSectionData).map(
//           (day) => {
//             const periodsForDay = classSectionData[day];

//             return {
//               day,
//               periods: Object.keys(periodsForDay).map((period_no) => ({
//                 period_no,
//                 subject: periodsForDay[period_no],
//               })),
//             };
//           }
//         );

//         return {
//           class_id: classId,
//           section_id: sectionId,
//           subjects: subjectsForClassSection,
//         };
//       });

//       // Include teacher_id in the data to be submitted
//       const teacherId = selectedStudentId; // Assuming selectedStudentId is the teacher's ID

//       const dataToSubmit = {
//         teacher_id: teacherId, // Add teacher_id to the data being sent
//         timetable_data: submitData,
//       };

//       // Send the data to the server
//       const token = localStorage.getItem("authToken");
//       const response = await axios.post(
//         `${API_URL}/api/save_timetableallotment`,
//         dataToSubmit,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response?.data?.success) {
//         toast.success("Timetable successfully submitted!");
//       } else {
//         toast.error("Failed to submit timetable.");
//       }
//     } catch (error) {
//       toast.error("An error occurred while submitting the timetable.");
//       console.error(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//   // Handle subject selection and update occupied periods
//   const handleSubjectSelect = (
//     classId,
//     sectionId,
//     day,
//     periodNo,
//     selectedSubject
//   ) => {
//     const newOccupiedPeriods = occupiedPeriods + 1;
//     setOccupiedPeriods(newOccupiedPeriods);

//     if (newOccupiedPeriods >= allocatedPeriods) {
//       toast.error("Allocated periods are full, cannot select more subjects.");
//     }

//     // Update selected subjects logic (keep track of subjects)
//     setSelectedSubjects((prev) => ({
//       ...prev,
//       [`${classId}-${sectionId}`]: {
//         ...prev[`${classId}-${sectionId}`],
//         [day]: {
//           ...(prev[`${classId}-${sectionId}`]?.[day] || {}),
//           [periodNo]: selectedSubject,
//         },
//       },
//     }));
//   };
//   return (
//     <>
//       <div className="w-full md:w-[95%] mx-auto p-4 ">
//         <ToastContainer />
//         <div className="card p-4 rounded-md ">
//           <div className=" card-header mb-4 flex justify-between items-center ">
//             <h5 className="text-gray-700 mt-1 text-md lg:text-lg">
//               Time Table Planner
//             </h5>
//             <RxCross1
//               className=" relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
//               onClick={() => {
//                 navigate("/dashboard");
//               }}
//             />
//           </div>
//           <div
//             className=" relative w-full   -top-6 h-1  mx-auto bg-red-700"
//             style={{
//               backgroundColor: "#C03078",
//             }}
//           ></div>

//           <>
//             <div className=" w-full md:w-[75%]   flex justify-center flex-col md:flex-row gap-x-1     ml-0    p-2">
//               <div className="w-full md:w-[99%] flex md:flex-row justify-between items-center mt-0 md:mt-4">
//                 <div className="w-full md:w-[90%] gap-x-0 md:gap-x-12 flex flex-col gap-y-2 md:gap-y-0 md:flex-row">
//                   {/* Class Dropdown */}
//                   <div className="w-full  md:w-[50%] gap-x-2 justify-around my-1 md:my-4 flex md:flex-row">
//                     <label
//                       className="w-full md:w-[25%] text-md pl-0 md:pl-5 mt-1.5"
//                       htmlFor="studentSelect"
//                     >
//                       Teacher <span className="text-red-500">*</span>
//                     </label>
//                     <div className="w-full md:w-[65%]">
//                       <Select
//                         menuPortalTarget={document.body}
//                         menuPosition="fixed"
//                         id="studentSelect"
//                         value={selectedStudent}
//                         onChange={handleStudentSelect}
//                         options={studentOptions}
//                         placeholder={loadingExams ? "Loading..." : "Select"}
//                         isSearchable
//                         isClearable
//                         className="text-sm"
//                         isDisabled={loadingExams}
//                         styles={{
//                           control: (provided) => ({
//                             ...provided,
//                             fontSize: ".9em", // Adjust font size for selected value
//                             minHeight: "30px", // Reduce height
//                           }),
//                           menu: (provided) => ({
//                             ...provided,
//                             fontSize: "1em", // Adjust font size for dropdown options
//                           }),
//                           option: (provided) => ({
//                             ...provided,
//                             fontSize: ".9em", // Adjust font size for each option
//                           }),
//                         }}
//                       />
//                       {studentError && (
//                         <div className="h-8 relative ml-1 text-danger text-xs">
//                           {studentError}
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Browse Button */}
//                   <div className="mt-1">
//                     <button
//                       type="search"
//                       onClick={handleSearch}
//                       style={{ backgroundColor: "#2196F3" }}
//                       className={`btn h-10 w-18 md:w-auto btn-primary text-white font-bold py-1 border-1 border-blue-500 px-4 rounded ${
//                         loadingForSearch ? "opacity-50 cursor-not-allowed" : ""
//                       }`}
//                       disabled={loadingForSearch}
//                     >
//                       {loadingForSearch ? (
//                         <span className="flex items-center">
//                           <svg
//                             className="animate-spin h-4 w-4 mr-2 text-white"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             ></circle>
//                             <path
//                               className="opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                             ></path>
//                           </svg>
//                           Adding...
//                         </span>
//                       ) : (
//                         "Add"
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {allocatedPeriods !== null && usedPeriods !== null && (
//               <div className="mt-4">
//                 <p>Allocated Periods: {allocatedPeriods}</p>
//                 <p>Used Periods: {usedPeriods}</p>
//               </div>
//             )}
//             {timetable.length > 0 && (
//               <>
//                 <div className="card mx-auto lg:w-full shadow-lg mt-3">
//                   <div className="card-body bg-gray-100 border-none w-full border-3 border-black flex">
//                     {/* Left Sidebar - Tabs */}
//                     <div
//                       className="w-[15%] border-r h-[440px] overflow-y-auto p-3 bg-white rounded-xl shadow-lg"
//                       style={{
//                         scrollbarWidth: "thin",
//                         scrollbarColor: "#6366F1 #E5E7EB", // Custom scrollbar colors
//                       }}
//                     >
//                       <h3 className="text-lg font-semibold text-blue-600 mb-3 text-center">
//                         Select Class
//                       </h3>

//                       {tabs.map((tab) => (
//                         <button
//                           key={tab.id}
//                           className={`block w-full text-center p-3 my-2 text-lg font-medium rounded-lg transition-all duration-300
//         ${
//           activeTab === tab.id
//             ? "bg-indigo-600 text-white shadow-md transform scale-105"
//             : "bg-gray-100 text-gray-700 hover:bg-indigo-200 hover:shadow-md"
//         }`}
//                           onClick={() => {
//                             setActiveTab(tab.id); // Set active tab
//                             // fetchTimetableData(tab.class_id, tab.section_id); // Pass class_id and section_id to fetch data
//                           }}
//                         >
//                           {tab.id}
//                         </button>
//                       ))}
//                     </div>
//                     {/* Right Table Section */}
//                     <div className="w-[85%] overflow-hidden bg-white rounded-lg shadow-md">
//                       {/* Header */}
//                       <h2 className="text-xl text-blue-500 font-bold mb-2 text-center">
//                         Class - {activeTab}
//                       </h2>

//                       {/* Scrollable Table Container */}
//                       <div
//                         className="overflow-y-auto h-[400px] border rounded-md p-2"
//                         style={{
//                           scrollbarWidth: "thin", // For Firefox
//                           scrollbarColor: "#4F46E5 #E5E7EB", // Track and thumb color in Firefox
//                         }}
//                       >
//                         <h2>Allocated Periods: {allocatedPeriods}</h2>
//                         <h2>Used Periods: {usedPeriods}</h2>

//                         <CommonTable
//                           activeTab={activeTab}
//                           tabs={tabs}
//                           periods={timetableData.periods || []} // Pass periods to CommonTable
//                           subjects={subjects || []} // Pass subjects to CommonTable || []} // Pass subjects to CommonTable
//                           loading={loadingForTabSwitch} // Show loading state if fetching data
//                           selectedSubjects={selectedSubjects}
//                           handleTableData={handleTableData}
//                           rowCounts={timetableData.rowCounts} // Pass row counts (mon_fri and sat) to CommonTable
//                           allocatedPeriods={allocatedPeriods}
//                           usedPeriods={usedPeriods}
//                           setUsedPeriods={setUsedPeriods} // Pass setUsedPeriods function to child
//                           showToast={(message, type) =>
//                             console.log(`${type}: ${message}`)
//                           } // Example toast handler
//                         />

//                         {/* <CommonTable
//                           activeTab={activeTab}
//                           tabs={tabs}
//                           periods={timetableData.periods || []} // Pass periods to CommonTable
//                           subjects={subjects || []} // Pass subjects to CommonTable || []} // Pass subjects to CommonTable
//                           loading={loadingForTabSwitch} // Show loading state if fetching data
//                           selectedSubjects={selectedSubjects}
//                           handleTableData={handleTableData}
//                           rowCounts={timetableData.rowCounts} // Pass row counts (mon_fri and sat) to CommonTable
//                         /> */}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex justify-end px-3 py-1 relative -top-2">
//                     <button
//                       type="button"
//                       className="btn btn-primary px-3 "
//                       onClick={handleSubmit}
//                       disabled={isSubmitting}
//                     >
//                       {isSubmitting ? "Submiting..." : "Submit"}
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </>
//         </div>
//       </div>
//     </>
//   );
// };

// export default TimetablePlanner;

// Above component working well

import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import "react-datepicker/dist/react-datepicker.css";
import CommonTable from "./CommonTable";

const TimetablePlanner = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [selectedStudent, setSelectedStudent] = useState(null);
  //   const [fromDate, setFromDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [studentNameWithClassId, setStudentNameWithClassId] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [loadingForSearch, setLoadingForSearch] = useState(false);

  const navigate = useNavigate();
  const [loadingExams, setLoadingExams] = useState(false);
  const [studentError, setStudentError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [timetable, setTimetable] = useState([]);

  const pageSize = 10;
  const [pageCount, setPageCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  //   const [timetableData, setTimetableData] = useState([]);
  const [timetableData, setTimetableData] = useState({
    periods: [],
    subjects: [],
    rowCounts: { mon_fri: 0, sat: 0 }, // Initialize rowCounts state
  }); // To hold transformed data
  const [loadingForTabSwitch, setLoadingForTabSwitch] = useState(false); // Loading state
  const [storeWholeData, setStoreWholeData] = useState([]);
  const [weekRange, setWeekRange] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState({});
  const [allocatedPeriods, setAllocatedPeriods] = useState(null); // Store allocated periods
  const [usedPeriods, setUsedPeriods] = useState(null); // Store used periods
  const [checkUsedPeriods, setCheckUsedPeriods] = useState("");
  const [occupiedPeriods, setOccupiedPeriods] = useState(0); // Store occupied periods

  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoadingExams(true);
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        `${API_URL}/api/get_teacherslistbyperiod`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Teachers", response.data);
      setStudentNameWithClassId(response?.data?.data || []);
    } catch (error) {
      toast.error("Error fetching Teachers");
      console.error("Error fetching Teachers:", error);
    } finally {
      setLoadingExams(false);
    }
  };

  const handleStudentSelect = (selectedOption) => {
    setStudentError(""); // Reset error if student is select.
    setSelectedStudent(selectedOption);
    setSelectedStudentId(selectedOption?.value);
  };

  const studentOptions = useMemo(
    () =>
      studentNameWithClassId.map((cls) => ({
        value: cls?.teacher_id,
        label: `${cls.teachername}`,
      })),
    [studentNameWithClassId]
  );
  console.log("studentNameWithClassId[]--->", studentNameWithClassId);

  console.log("studentOptions[]--->", studentOptions);

  // Handle search and fetch parent information

  const handleSearch = async () => {
    setLoadingForSearch(false);
    // setSelectedStudent("");
    // setSelectedStudentId("");
    if (!selectedStudentId) {
      setStudentError("Please select teacher name.");
      setLoadingForSearch(false);
      return;
    }

    setSearchTerm("");
    setActiveTab("");
    setTimetableData({
      periods: [],
      subjects: [],
      rowCounts: { mon_fri: 0, sat: 0 },
    });
    setTabs([]);
    setSelectedSubjects({});
    setAllocatedPeriods(null); // Reset periods
    setUsedPeriods(null); // Reset used periods
    setCheckUsedPeriods("");
    setOccupiedPeriods(0); // Reset occupied periods
    try {
      const formattedWeek = weekRange.replace(/\s/g, "").replace(/%20/g, ""); // Ensure no extra spaces or encoded symbols
      console.log("Formatted Week is: --->", formattedWeek);

      setLoadingForSearch(true); // Start loading
      setTimetable([]);

      const token = localStorage.getItem("authToken");
      const periodResponse = await axios.get(
        `${API_URL}/api/get_teacherperioddata?teacher_id=${selectedStudentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (periodResponse?.data?.success) {
        setAllocatedPeriods(periodResponse?.data?.data[0]?.periods_allocated);
        setUsedPeriods(periodResponse?.data?.data[0]?.periods_used);
        setCheckUsedPeriods(periodResponse?.data?.data[0]?.periods_used);
      } else {
        toast.error("Failed to fetch teacher period data.");
      }
      const params = {
        teacher_id: selectedStudentId,
      };

      const response = await axios.get(
        `${API_URL}/api/get_teacherclasstimetable`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      if (!response?.data?.data || response?.data?.data?.length === 0) {
        toast.error("Time Table Planner for selected teacher not found.");
        setTimetable([]);
      } else {
        setTimetable(response?.data?.data);
        setPageCount(Math.ceil(response?.data?.data?.length / pageSize));
      }
      const formattedTabs = response.data.data.map((item) => ({
        id: `${item.classname}-${item.sectionname}`,
        classname: item.classname,
        sectionname: item.sectionname,
        teachername: item.teachername,
        class_id: item.class_id, // Store class_id
        section_id: item.section_id, // Store section_id
      }));

      // Now you have class_id and section_id stored for each tab

      // Sort tabs by class in ascending order
      const sortedTabs = formattedTabs.sort((a, b) => {
        const classA = parseInt(a.classname, 10);
        const classB = parseInt(b.classname, 10);
        return classA - classB;
      });

      setTabs(sortedTabs);
      // Set the initial active tab to the first tab
      if (sortedTabs.length > 0) {
        setActiveTab(sortedTabs[0].id);
      }
      //   setActiveTab(sortedTabs[0]?.id || ""); // Set default active tab
    } catch (error) {
      console.error(
        "Error fetching Time Table Planner for selected teacher :",
        error
      );
      toast.error(
        "Error fetching Time Table Planner for selected teacher. Please try again."
      );
    } finally {
      setIsSubmitting(false);
      setLoadingForSearch(false);
    }
  };

  console.log("row", timetable);

  // const filteredSections = timetable.filter((student) => {
  //   const searchLower = searchTerm.toLowerCase();

  //   // Extract relevant fields and convert them to lowercase for case-insensitive search
  //   const teacherName = student?.teachername?.toLowerCase() || "";
  //   const week = student?.week?.toLowerCase() || "";
  //   const totalHours =
  //     student?.time_difference_decimal?.toString().toLowerCase() || "";

  //   // Check if the search term is present in any of the specified fields
  //   return (
  //     teacherName.includes(searchLower) ||
  //     week.includes(searchLower) ||
  //     totalHours.includes(searchLower)
  //   );
  // });

  const fetchTimetableData = async (teacher_id, class_id, section_id) => {
    setLoadingForTabSwitch(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        `${API_URL}/api/get_timetablebyclasssection/${class_id}/${section_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check for the specific error response
      if (response.data?.success === false && response.data?.message) {
        toast.error(response.data.message); // Show toast error message
        setTimetableData({
          periods: [],
          subjects: [],
          rowCounts: { mon_fri: 0, sat: 0 },
        }); // Clear any existing data
        return; // Do not proceed to show the table if the response indicates an error
      }

      if (response.data && response.data.data) {
        const transformedData = transformTimetableData(response.data.data);
        setTimetableData(transformedData); // Store the transformed data
      } else {
        setTimetableData({
          periods: [],
          subjects: [],
          rowCounts: { mon_fri: 0, sat: 0 },
        });
      }

      const subjectsResponse = await axios.get(
        `${API_URL}/api/get_teachersubjectbyclass?teacher_id=${teacher_id}&class_id=${class_id}&section_id=${section_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (subjectsResponse.data && subjectsResponse.data.data) {
        setSubjects(subjectsResponse.data.data); // Store the subjects data
      } else {
        setSubjects([]); // Handle error fetching subjects data
      }
    } catch (error) {
      console.error("Error fetching timetable data:", error);
      setTimetableData({
        periods: [],
        subjects: [],
        rowCounts: { mon_fri: 0, sat: 0 },
      }); // Clear any existing data
      setSubjects([]); // Handle error fetching subjects data
      toast.error("Error fetching timetable data. Please try again.");
    } finally {
      setLoadingForTabSwitch(false);
    }
  };

  // Ensure to check before rendering the `CommonTable`

  const handleTableData = (
    classId,
    sectionId,
    day,
    period_no,
    selectedSubject
  ) => {
    const key = `${classId}-${sectionId}`;

    setSelectedSubjects((prevSubjects) => ({
      ...prevSubjects,
      [key]: {
        ...prevSubjects[key], // Preserve previous data for the same class-section
        [day]: {
          ...(prevSubjects[key]?.[day] || {}), // Preserve previous day's data
          [period_no]: selectedSubject, // Update selected subject for this period
        },
      },
    }));
    console.log("setSelectedSubjects[]----->", selectedSubjects);
  };

  const transformTimetableData = (data) => {
    const periods = [];
    const subjects = [];

    const rowCounts = {
      mon_fri: data.mon_fri, // Number of periods for Monday to Friday
      sat: data.sat, // Number of periods for Saturday
    };

    // Iterate through each day and extract the periods
    Object.keys(data).forEach((day) => {
      if (day !== "mon_fri" && day !== "sat") {
        const dayData = data[day];
        dayData.forEach((period) => {
          // Extract teacher names, handling empty teacher arrays
          const teachers =
            period.teacher &&
            Array.isArray(period.teacher) &&
            period.teacher.length > 0
              ? period.teacher.map((t) => t.t_name).join(", ")
              : " "; // If no teachers, return "N/A"

          // Add the period to the periods array, with subject and teacher names
          periods.push({
            period_no: period.period_no,
            time_in: period.time_in,
            time_out: period.time_out,
            subject_id: period.subject, // Subject ID
            teachers: teachers, // Teacher(s) name(s)
            day: day, // Add the day to link periods to days
          });

          // Add the subject and teacher details for the subject table
          subjects.push({
            day,
            period_no: period.period_no,
            subject_id: period.subject, // Subject ID
            teachers: teachers, // Teacher(s) name(s)
          });
        });
      }
    });

    return { periods, subjects, rowCounts };
  };

  useEffect(() => {
    // Find the active tab based on `activeTab`
    let activeTabData = tabs.find((tab) => tab.id === activeTab);
    //  const activeTabData = tabs.find((tab) => tab.id === activeTab);
    // Call fetchTimetableData with class_id and section_id
    if (activeTabData) {
      setLoadingForTabSwitch(true);
      fetchTimetableData(
        selectedStudentId,
        activeTabData.class_id,
        activeTabData.section_id
      );
    }
  }, [activeTab, selectedStudentId, tabs]); // Fetch data whenever activeTab changes
  const handleSubmit = async () => {
    // Assuming checkUsedPeriods is the expected number of periods to be selected
    if (usedPeriods == checkUsedPeriods) {
      toast.error("Please select at least one subject.");
      return; // Prevent submission if the condition is met
    }
    try {
      setIsSubmitting(true);
      // Prepare data to submit
      const submitData = Object.keys(selectedSubjects).map((key) => {
        const [classId, sectionId] = key.split("-"); // Extract class_id and section_id from key
        const classSectionData = selectedSubjects[key];

        const subjectsForClassSection = Object.keys(classSectionData).map(
          (day) => {
            const periodsForDay = classSectionData[day];

            return {
              day,
              periods: Object.keys(periodsForDay).map((period_no) => ({
                period_no,
                subject: periodsForDay[period_no],
              })),
            };
          }
        );

        return {
          class_id: classId,
          section_id: sectionId,
          subjects: subjectsForClassSection,
        };
      });

      // Include teacher_id in the data to be submitted
      const teacherId = selectedStudentId; // Assuming selectedStudentId is the teacher's ID

      const dataToSubmit = {
        teacher_id: teacherId, // Add teacher_id to the data being sent
        period_used: usedPeriods,
        timetable_data: submitData,
      };

      // Send the data to the server
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${API_URL}/api/save_timetableallotment`,
        dataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.success) {
        toast.success("Timetable successfully submitted!");
        setTimeout(() => {
          setActiveTab(""); // Reset active tab
          setTimetableData({
            periods: [],
            subjects: [],
            rowCounts: { mon_fri: 0, sat: 0 },
          });
          setTabs([]); // Clear tabs
          setSelectedSubjects({}); // Reset selected subjects
          setAllocatedPeriods(null); // Reset allocated periods
          setUsedPeriods(null); // Reset used periods
          setCheckUsedPeriods(""); // Reset used periods check
          setOccupiedPeriods(0); // Reset occupied periods
          setTimetable([]);
        }, 1000); // Delay for 2 seconds (2000ms)
      } else {
        toast.error("Failed to submit timetable.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the timetable.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  // Handle subject selection and update occupied periods
  // const handleSubjectSelect = (
  //   classId,
  //   sectionId,
  //   day,
  //   periodNo,
  //   selectedSubject
  // ) => {
  //   const newOccupiedPeriods = occupiedPeriods + 1;
  //   setOccupiedPeriods(newOccupiedPeriods);

  //   if (newOccupiedPeriods >= allocatedPeriods) {
  //     toast.error("Allocated periods are full, cannot select more subjects.");
  //   }

  //   // Update selected subjects logic (keep track of subjects)
  //   setSelectedSubjects((prev) => ({
  //     ...prev,
  //     [`${classId}-${sectionId}`]: {
  //       ...prev[`${classId}-${sectionId}`],
  //       [day]: {
  //         ...(prev[`${classId}-${sectionId}`]?.[day] || {}),
  //         [periodNo]: selectedSubject,
  //       },
  //     },
  //   }));
  // };
  return (
    <>
      <div className="w-full md:w-[99%] mx-auto p-4 ">
        <ToastContainer />
        <div className="card p-4 rounded-md ">
          <div className=" card-header mb-4 flex justify-between items-center ">
            <h5 className="text-gray-700 mt-1 text-md lg:text-lg">
              Time Table Planner
            </h5>
            <RxCross1
              className=" relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
              onClick={() => {
                navigate("/dashboard");
              }}
            />
          </div>
          <div
            className=" relative w-full   -top-6 h-1  mx-auto bg-red-700"
            style={{
              backgroundColor: "#C03078",
            }}
          ></div>

          <>
            <div className=" w-full md:w-[75%]   flex justify-center flex-col md:flex-row gap-x-1     ml-0    p-2">
              <div className="w-full md:w-[99%] flex md:flex-row justify-between items-center mt-0 md:mt-4">
                <div className="w-full md:w-[90%] gap-x-0 md:gap-x-12 flex flex-col gap-y-2 md:gap-y-0 md:flex-row">
                  {/* Class Dropdown */}
                  <div className="w-full  md:w-[50%] gap-x-2 justify-around my-1 md:my-4 flex md:flex-row">
                    <label
                      className="w-full md:w-[25%] text-md pl-0 md:pl-5 mt-1.5"
                      htmlFor="studentSelect"
                    >
                      Teacher <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full md:w-[65%]">
                      <Select
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        id="studentSelect"
                        value={selectedStudent}
                        onChange={handleStudentSelect}
                        options={studentOptions}
                        placeholder={loadingExams ? "Loading..." : "Select"}
                        isSearchable
                        isClearable
                        className="text-sm"
                        isDisabled={loadingExams}
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            fontSize: ".9em", // Adjust font size for selected value
                            minHeight: "30px", // Reduce height
                          }),
                          menu: (provided) => ({
                            ...provided,
                            fontSize: "1em", // Adjust font size for dropdown options
                          }),
                          option: (provided) => ({
                            ...provided,
                            fontSize: ".9em", // Adjust font size for each option
                          }),
                        }}
                      />
                      {studentError && (
                        <div className="h-8 relative ml-1 text-danger text-xs">
                          {studentError}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Browse Button */}
                  <div className="mt-1">
                    <button
                      type="search"
                      onClick={handleSearch}
                      style={{ backgroundColor: "#2196F3" }}
                      className={`btn h-10 w-18 md:w-auto btn-primary text-white font-bold py-1 border-1 border-blue-500 px-4 rounded ${
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
                          Adding...
                        </span>
                      ) : (
                        "Add"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {timetable.length > 0 && (
              <>
                <div className="card mx-auto lg:w-full shadow-lg mt-3">
                  <div className="card-body bg-gray-100 border-none w-full border-3 border-black flex">
                    {/* Left Sidebar - Tabs */}
                    <div
                      className="w-[15%] border-r h-[440px] overflow-y-auto p-3 bg-white rounded-xl shadow-lg"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#6366F1 #E5E7EB", // Custom scrollbar colors
                      }}
                    >
                      <h3 className="text-lg font-semibold text-blue-600 mb-3 text-center">
                        Select Class
                      </h3>

                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          className={`block w-full text-center p-3 my-2 text-lg font-medium rounded-lg transition-all duration-300
        ${
          activeTab === tab.id
            ? "bg-indigo-600 text-white shadow-md transform scale-105"
            : "bg-gray-100 text-gray-700 hover:bg-indigo-200 hover:shadow-md"
        }`}
                          onClick={() => {
                            setActiveTab(tab.id); // Set active tab
                            // fetchTimetableData(tab.class_id, tab.section_id); // Pass class_id and section_id to fetch data
                          }}
                        >
                          {tab.id}
                        </button>
                      ))}
                    </div>
                    {/* Right Table Section */}
                    <div className="w-[85%] overflow-hidden bg-white rounded-lg shadow-md">
                      {/* Header */}
                      <div className="w-[97%] mx-auto overflow-hidden  flex flex-row justify-between items-center  border-b-2 border-pink-600">
                        {allocatedPeriods !== null && (
                          <span className="text-pink-500 text-xl font-medium">
                            Allocated Periods: {allocatedPeriods}
                          </span>
                        )}
                        <h2 className="text-xl   text-blue-500 font-bold mb-2 text-center">
                          Class - {activeTab}
                        </h2>
                        {usedPeriods !== null && (
                          <span className="text-pink-500 text-xl font-medium">
                            Occupied Periods: {usedPeriods}
                          </span>
                        )}
                      </div>
                      {/* Scrollable Table Container */}
                      <div
                        className="overflow-y-auto h-[400px] border rounded-md p-2"
                        style={{
                          scrollbarWidth: "thin", // For Firefox
                          scrollbarColor: "#4F46E5 #E5E7EB", // Track and thumb color in Firefox
                        }}
                      >
                        {/* <h2>Allocated Periods: {allocatedPeriods}</h2>
                        <h2>Used Periods: {usedPeriods}</h2> */}

                        {/* <CommonTable
                          activeTab={activeTab}
                          tabs={tabs}
                          periods={timetableData.periods || []} // Pass periods to CommonTable
                          subjects={subjects || []} // Pass subjects to CommonTable || []} // Pass subjects to CommonTable
                          loading={loadingForTabSwitch} // Show loading state if fetching data
                          selectedSubjects={selectedSubjects}
                          handleTableData={handleTableData}
                          rowCounts={timetableData.rowCounts} // Pass row counts (mon_fri and sat) to CommonTable
                          allocatedPeriods={allocatedPeriods}
                          usedPeriods={usedPeriods}
                          setUsedPeriods={setUsedPeriods} // Pass setUsedPeriods function to child
                          showToast={(message, type) =>
                            console.log(`${type}: ${message}`)
                          } // Example toast handler
                        /> */}
                        <CommonTable
                          activeTab={activeTab}
                          tabs={tabs}
                          periods={timetableData.periods || []} // Pass periods to CommonTable
                          subjects={subjects || []} // Pass subjects to CommonTable
                          loading={loadingForTabSwitch} // Show loading state if fetching data
                          selectedSubjects={selectedSubjects}
                          handleTableData={handleTableData}
                          rowCounts={timetableData.rowCounts} // Pass row counts (mon_fri and sat) to CommonTable
                          allocatedPeriods={allocatedPeriods}
                          usedPeriods={usedPeriods}
                          setUsedPeriods={setUsedPeriods} // Pass setUsedPeriods function to child
                          showToast={
                            (message, type) =>
                              console.log(`${type}: ${message}`) // Example toast handler
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end px-3 py-1 relative -top-2">
                    <button
                      type="button"
                      className="btn btn-primary px-3 "
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submiting..." : "Submit"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        </div>
      </div>
    </>
  );
};

export default TimetablePlanner;

// This working well
// import { useState, useEffect, useMemo, useRef } from "react";
// import axios from "axios";
// import Select from "react-select";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import { RxCross1 } from "react-icons/rx";
// import "react-datepicker/dist/react-datepicker.css";
// import CommonTable from "./CommonTable";

// const TimetablePlanner = () => {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   //   const [fromDate, setFromDate] = useState(null);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [studentNameWithClassId, setStudentNameWithClassId] = useState([]);
//   const [selectedStudentId, setSelectedStudentId] = useState(null);
//   const [loadingForSearch, setLoadingForSearch] = useState(false);

//   const navigate = useNavigate();
//   const [loadingExams, setLoadingExams] = useState(false);
//   const [studentError, setStudentError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [timetable, setTimetable] = useState([]);

//   const pageSize = 10;
//   const [pageCount, setPageCount] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   //   const [timetableData, setTimetableData] = useState([]);
//   const [timetableData, setTimetableData] = useState({
//     periods: [],
//     subjects: [],
//     rowCounts: { mon_fri: 0, sat: 0 }, // Initialize rowCounts state
//   }); // To hold transformed data
//   const [loadingForTabSwitch, setLoadingForTabSwitch] = useState(false); // Loading state
//   const [storeWholeData, setStoreWholeData] = useState([]);
//   const [weekRange, setWeekRange] = useState("");
//   const [subjects, setSubjects] = useState([]);
//   const [tabs, setTabs] = useState([]);
//   const [selectedSubjects, setSelectedSubjects] = useState({});
//   const [allocatedPeriods, setAllocatedPeriods] = useState(null); // Store allocated periods
//   const [usedPeriods, setUsedPeriods] = useState(null); // Store used periods
//   const [checkUsedPeriods, setCheckUsedPeriods] = useState("");
//   const [occupiedPeriods, setOccupiedPeriods] = useState(0); // Store occupied periods

//   const [activeTab, setActiveTab] = useState("");

//   useEffect(() => {
//     fetchExams();
//   }, []);

//   const fetchExams = async () => {
//     try {
//       setLoadingExams(true);
//       const token = localStorage.getItem("authToken");

//       const response = await axios.get(
//         `${API_URL}/api/get_teacherslistbyperiod`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       console.log("Teachers", response.data);
//       setStudentNameWithClassId(response?.data?.data || []);
//     } catch (error) {
//       toast.error("Error fetching Teachers");
//       console.error("Error fetching Teachers:", error);
//     } finally {
//       setLoadingExams(false);
//     }
//   };

//   const handleStudentSelect = (selectedOption) => {
//     setStudentError(""); // Reset error if student is select.
//     setSelectedStudent(selectedOption);
//     setSelectedStudentId(selectedOption?.value);
//   };

//   const studentOptions = useMemo(
//     () =>
//       studentNameWithClassId.map((cls) => ({
//         value: cls?.teacher_id,
//         label: `${cls.teachername}`,
//       })),
//     [studentNameWithClassId]
//   );
//   console.log("studentNameWithClassId[]--->", studentNameWithClassId);

//   console.log("studentOptions[]--->", studentOptions);

//   // Handle search and fetch parent information

//   const handleSearch = async () => {
//     setLoadingForSearch(false);
//     // setSelectedStudent("");
//     // setSelectedStudentId("");
//     if (!selectedStudentId) {
//       setStudentError("Please select teacher name.");
//       setLoadingForSearch(false);
//       return;
//     }

//     setSearchTerm("");
//     setActiveTab("");
//     setTimetableData({
//       periods: [],
//       subjects: [],
//       rowCounts: { mon_fri: 0, sat: 0 },
//     });
//     setTabs([]);
//     setSelectedSubjects({});
//     setAllocatedPeriods(null); // Reset periods
//     setUsedPeriods(null); // Reset used periods
//     setCheckUsedPeriods("");
//     setOccupiedPeriods(0); // Reset occupied periods
//     try {
//       const formattedWeek = weekRange.replace(/\s/g, "").replace(/%20/g, ""); // Ensure no extra spaces or encoded symbols
//       console.log("Formatted Week is: --->", formattedWeek);

//       setLoadingForSearch(true); // Start loading
//       setTimetable([]);

//       const token = localStorage.getItem("authToken");
//       const periodResponse = await axios.get(
//         `${API_URL}/api/get_teacherperioddata?teacher_id=${selectedStudentId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (periodResponse?.data?.success) {
//         setAllocatedPeriods(periodResponse?.data?.data[0]?.periods_allocated);
//         setUsedPeriods(periodResponse?.data?.data[0]?.periods_used);
//         setCheckUsedPeriods(periodResponse?.data?.data[0]?.periods_used);
//       } else {
//         toast.error("Failed to fetch teacher period data.");
//       }
//       const params = {
//         teacher_id: selectedStudentId,
//       };

//       const response = await axios.get(
//         `${API_URL}/api/get_teacherclasstimetable`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           params,
//         }
//       );

//       if (!response?.data?.data || response?.data?.data?.length === 0) {
//         toast.error("Time Table Planner for selected teacher not found.");
//         setTimetable([]);
//       } else {
//         setTimetable(response?.data?.data);
//         setPageCount(Math.ceil(response?.data?.data?.length / pageSize));
//       }
//       const formattedTabs = response.data.data.map((item) => ({
//         id: `${item.classname}-${item.sectionname}`,
//         classname: item.classname,
//         sectionname: item.sectionname,
//         teachername: item.teachername,
//         class_id: item.class_id, // Store class_id
//         section_id: item.section_id, // Store section_id
//       }));

//       // Now you have class_id and section_id stored for each tab

//       // Sort tabs by class in ascending order
//       const sortedTabs = formattedTabs.sort((a, b) => {
//         const classA = parseInt(a.classname, 10);
//         const classB = parseInt(b.classname, 10);
//         return classA - classB;
//       });

//       setTabs(sortedTabs);
//       // Set the initial active tab to the first tab
//       if (sortedTabs.length > 0) {
//         setActiveTab(sortedTabs[0].id);
//       }
//       //   setActiveTab(sortedTabs[0]?.id || ""); // Set default active tab
//     } catch (error) {
//       console.error(
//         "Error fetching Time Table Planner for selected teacher :",
//         error
//       );
//       toast.error(
//         "Error fetching Time Table Planner for selected teacher. Please try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//       setLoadingForSearch(false);
//     }
//   };

//   console.log("row", timetable);

//   // const filteredSections = timetable.filter((student) => {
//   //   const searchLower = searchTerm.toLowerCase();

//   //   // Extract relevant fields and convert them to lowercase for case-insensitive search
//   //   const teacherName = student?.teachername?.toLowerCase() || "";
//   //   const week = student?.week?.toLowerCase() || "";
//   //   const totalHours =
//   //     student?.time_difference_decimal?.toString().toLowerCase() || "";

//   //   // Check if the search term is present in any of the specified fields
//   //   return (
//   //     teacherName.includes(searchLower) ||
//   //     week.includes(searchLower) ||
//   //     totalHours.includes(searchLower)
//   //   );
//   // });

//   const fetchTimetableData = async (teacher_id, class_id, section_id) => {
//     setLoadingForTabSwitch(true);
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await axios.get(
//         `${API_URL}/api/get_timetablebyclasssection/${class_id}/${section_id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // Check for the specific error response
//       if (response.data?.success === false && response.data?.message) {
//         toast.error(response.data.message); // Show toast error message
//         setTimetableData({
//           periods: [],
//           subjects: [],
//           rowCounts: { mon_fri: 0, sat: 0 },
//         }); // Clear any existing data
//         return; // Do not proceed to show the table if the response indicates an error
//       }

//       if (response.data && response.data.data) {
//         const transformedData = transformTimetableData(response.data.data);
//         setTimetableData(transformedData); // Store the transformed data
//       } else {
//         setTimetableData({
//           periods: [],
//           subjects: [],
//           rowCounts: { mon_fri: 0, sat: 0 },
//         });
//       }

//       const subjectsResponse = await axios.get(
//         `${API_URL}/api/get_teachersubjectbyclass?teacher_id=${teacher_id}&class_id=${class_id}&section_id=${section_id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (subjectsResponse.data && subjectsResponse.data.data) {
//         setSubjects(subjectsResponse.data.data); // Store the subjects data
//       } else {
//         setSubjects([]); // Handle error fetching subjects data
//       }
//     } catch (error) {
//       console.error("Error fetching timetable data:", error);
//       setTimetableData({
//         periods: [],
//         subjects: [],
//         rowCounts: { mon_fri: 0, sat: 0 },
//       }); // Clear any existing data
//       setSubjects([]); // Handle error fetching subjects data
//       toast.error("Error fetching timetable data. Please try again.");
//     } finally {
//       setLoadingForTabSwitch(false);
//     }
//   };

//   // Ensure to check before rendering the `CommonTable`

//   const handleTableData = (
//     classId,
//     sectionId,
//     day,
//     period_no,
//     selectedSubject
//   ) => {
//     const key = `${classId}-${sectionId}`;

//     setSelectedSubjects((prevSubjects) => ({
//       ...prevSubjects,
//       [key]: {
//         ...prevSubjects[key], // Preserve previous data for the same class-section
//         [day]: {
//           ...(prevSubjects[key]?.[day] || {}), // Preserve previous day's data
//           [period_no]: selectedSubject, // Update selected subject for this period
//         },
//       },
//     }));
//     console.log("setSelectedSubjects[]----->", selectedSubjects);
//   };

//   const transformTimetableData = (data) => {
//     const periods = [];
//     const subjects = [];

//     const rowCounts = {
//       mon_fri: data.mon_fri, // Number of periods for Monday to Friday
//       sat: data.sat, // Number of periods for Saturday
//     };

//     // Iterate through each day and extract the periods
//     Object.keys(data).forEach((day) => {
//       if (day !== "mon_fri" && day !== "sat") {
//         const dayData = data[day];
//         dayData.forEach((period) => {
//           // Extract teacher names, handling empty teacher arrays
//           const teachers =
//             period.teacher &&
//             Array.isArray(period.teacher) &&
//             period.teacher.length > 0
//               ? period.teacher.map((t) => t.t_name).join(", ")
//               : " "; // If no teachers, return "N/A"

//           // Push period information with subject and teacher names
//           periods.push({
//             period_no: period.period_no,
//             time_in: period.time_in,
//             time_out: period.time_out,
//             subject_id: period.subject, // Subject ID
//             teachers: teachers, // Teacher(s) name(s)
//           });

//           // Push subject and teacher information for later use
//           subjects.push({
//             day,
//             period_no: period.period_no,
//             subject_id: period.subject, // Subject ID
//             teachers: teachers, // Teacher(s) name(s)
//           });
//         });
//       }
//     });

//     return { periods, subjects, rowCounts };
//   };

//   useEffect(() => {
//     // Find the active tab based on `activeTab`
//     let activeTabData = tabs.find((tab) => tab.id === activeTab);
//     //  const activeTabData = tabs.find((tab) => tab.id === activeTab);
//     // Call fetchTimetableData with class_id and section_id
//     if (activeTabData) {
//       setLoadingForTabSwitch(true);
//       fetchTimetableData(
//         selectedStudentId,
//         activeTabData.class_id,
//         activeTabData.section_id
//       );
//     }
//   }, [activeTab, selectedStudentId, tabs]); // Fetch data whenever activeTab changes
//   const handleSubmit = async () => {
//     // Assuming checkUsedPeriods is the expected number of periods to be selected
//     if (usedPeriods == checkUsedPeriods) {
//       toast.error("Please select at least one subject.");
//       return; // Prevent submission if the condition is met
//     }
//     try {
//       setIsSubmitting(true);
//       // Prepare data to submit
//       const submitData = Object.keys(selectedSubjects).map((key) => {
//         const [classId, sectionId] = key.split("-"); // Extract class_id and section_id from key
//         const classSectionData = selectedSubjects[key];

//         const subjectsForClassSection = Object.keys(classSectionData).map(
//           (day) => {
//             const periodsForDay = classSectionData[day];

//             return {
//               day,
//               periods: Object.keys(periodsForDay).map((period_no) => ({
//                 period_no,
//                 subject: periodsForDay[period_no],
//               })),
//             };
//           }
//         );

//         return {
//           class_id: classId,
//           section_id: sectionId,
//           subjects: subjectsForClassSection,
//         };
//       });

//       // Include teacher_id in the data to be submitted
//       const teacherId = selectedStudentId; // Assuming selectedStudentId is the teacher's ID

//       const dataToSubmit = {
//         teacher_id: teacherId, // Add teacher_id to the data being sent
//         period_used: usedPeriods,
//         timetable_data: submitData,
//       };

//       // Send the data to the server
//       const token = localStorage.getItem("authToken");
//       const response = await axios.post(
//         `${API_URL}/api/save_timetableallotment`,
//         dataToSubmit,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response?.data?.success) {
//         toast.success("Timetable successfully submitted!");
//         setTimeout(() => {
//           setActiveTab(""); // Reset active tab
//           setTimetableData({
//             periods: [],
//             subjects: [],
//             rowCounts: { mon_fri: 0, sat: 0 },
//           });
//           setTabs([]); // Clear tabs
//           setSelectedSubjects({}); // Reset selected subjects
//           setAllocatedPeriods(null); // Reset allocated periods
//           setUsedPeriods(null); // Reset used periods
//           setCheckUsedPeriods(""); // Reset used periods check
//           setOccupiedPeriods(0); // Reset occupied periods
//           setTimetable([]);
//         }, 1000); // Delay for 2 seconds (2000ms)
//       } else {
//         toast.error("Failed to submit timetable.");
//       }
//     } catch (error) {
//       toast.error("An error occurred while submitting the timetable.");
//       console.error(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//   // Handle subject selection and update occupied periods
//   // const handleSubjectSelect = (
//   //   classId,
//   //   sectionId,
//   //   day,
//   //   periodNo,
//   //   selectedSubject
//   // ) => {
//   //   const newOccupiedPeriods = occupiedPeriods + 1;
//   //   setOccupiedPeriods(newOccupiedPeriods);

//   //   if (newOccupiedPeriods >= allocatedPeriods) {
//   //     toast.error("Allocated periods are full, cannot select more subjects.");
//   //   }

//   //   // Update selected subjects logic (keep track of subjects)
//   //   setSelectedSubjects((prev) => ({
//   //     ...prev,
//   //     [`${classId}-${sectionId}`]: {
//   //       ...prev[`${classId}-${sectionId}`],
//   //       [day]: {
//   //         ...(prev[`${classId}-${sectionId}`]?.[day] || {}),
//   //         [periodNo]: selectedSubject,
//   //       },
//   //     },
//   //   }));
//   // };
//   return (
//     <>
//       <div className="w-full md:w-[99%] mx-auto p-4 ">
//         <ToastContainer />
//         <div className="card p-4 rounded-md ">
//           <div className=" card-header mb-4 flex justify-between items-center ">
//             <h5 className="text-gray-700 mt-1 text-md lg:text-lg">
//               Time Table Planner
//             </h5>
//             <RxCross1
//               className=" relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
//               onClick={() => {
//                 navigate("/dashboard");
//               }}
//             />
//           </div>
//           <div
//             className=" relative w-full   -top-6 h-1  mx-auto bg-red-700"
//             style={{
//               backgroundColor: "#C03078",
//             }}
//           ></div>

//           <>
//             <div className=" w-full md:w-[75%]   flex justify-center flex-col md:flex-row gap-x-1     ml-0    p-2">
//               <div className="w-full md:w-[99%] flex md:flex-row justify-between items-center mt-0 md:mt-4">
//                 <div className="w-full md:w-[90%] gap-x-0 md:gap-x-12 flex flex-col gap-y-2 md:gap-y-0 md:flex-row">
//                   {/* Class Dropdown */}
//                   <div className="w-full  md:w-[50%] gap-x-2 justify-around my-1 md:my-4 flex md:flex-row">
//                     <label
//                       className="w-full md:w-[25%] text-md pl-0 md:pl-5 mt-1.5"
//                       htmlFor="studentSelect"
//                     >
//                       Teacher <span className="text-red-500">*</span>
//                     </label>
//                     <div className="w-full md:w-[65%]">
//                       <Select
//                         menuPortalTarget={document.body}
//                         menuPosition="fixed"
//                         id="studentSelect"
//                         value={selectedStudent}
//                         onChange={handleStudentSelect}
//                         options={studentOptions}
//                         placeholder={loadingExams ? "Loading..." : "Select"}
//                         isSearchable
//                         isClearable
//                         className="text-sm"
//                         isDisabled={loadingExams}
//                         styles={{
//                           control: (provided) => ({
//                             ...provided,
//                             fontSize: ".9em", // Adjust font size for selected value
//                             minHeight: "30px", // Reduce height
//                           }),
//                           menu: (provided) => ({
//                             ...provided,
//                             fontSize: "1em", // Adjust font size for dropdown options
//                           }),
//                           option: (provided) => ({
//                             ...provided,
//                             fontSize: ".9em", // Adjust font size for each option
//                           }),
//                         }}
//                       />
//                       {studentError && (
//                         <div className="h-8 relative ml-1 text-danger text-xs">
//                           {studentError}
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Browse Button */}
//                   <div className="mt-1">
//                     <button
//                       type="search"
//                       onClick={handleSearch}
//                       style={{ backgroundColor: "#2196F3" }}
//                       className={`btn h-10 w-18 md:w-auto btn-primary text-white font-bold py-1 border-1 border-blue-500 px-4 rounded ${
//                         loadingForSearch ? "opacity-50 cursor-not-allowed" : ""
//                       }`}
//                       disabled={loadingForSearch}
//                     >
//                       {loadingForSearch ? (
//                         <span className="flex items-center">
//                           <svg
//                             className="animate-spin h-4 w-4 mr-2 text-white"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             ></circle>
//                             <path
//                               className="opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                             ></path>
//                           </svg>
//                           Adding...
//                         </span>
//                       ) : (
//                         "Add"
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {timetable.length > 0 && (
//               <>
//                 <div className="card mx-auto lg:w-full shadow-lg mt-3">
//                   <div className="card-body bg-gray-100 border-none w-full border-3 border-black flex">
//                     {/* Left Sidebar - Tabs */}
//                     <div
//                       className="w-[15%] border-r h-[440px] overflow-y-auto p-3 bg-white rounded-xl shadow-lg"
//                       style={{
//                         scrollbarWidth: "thin",
//                         scrollbarColor: "#6366F1 #E5E7EB", // Custom scrollbar colors
//                       }}
//                     >
//                       <h3 className="text-lg font-semibold text-blue-600 mb-3 text-center">
//                         Select Class
//                       </h3>

//                       {tabs.map((tab) => (
//                         <button
//                           key={tab.id}
//                           className={`block w-full text-center p-3 my-2 text-lg font-medium rounded-lg transition-all duration-300
//         ${
//           activeTab === tab.id
//             ? "bg-indigo-600 text-white shadow-md transform scale-105"
//             : "bg-gray-100 text-gray-700 hover:bg-indigo-200 hover:shadow-md"
//         }`}
//                           onClick={() => {
//                             setActiveTab(tab.id); // Set active tab
//                             // fetchTimetableData(tab.class_id, tab.section_id); // Pass class_id and section_id to fetch data
//                           }}
//                         >
//                           {tab.id}
//                         </button>
//                       ))}
//                     </div>
//                     {/* Right Table Section */}
//                     <div className="w-[85%] overflow-hidden bg-white rounded-lg shadow-md">
//                       {/* Header */}
//                       <div className="w-[97%] mx-auto overflow-hidden  flex flex-row justify-between items-center  border-b-2 border-pink-600">
//                         {allocatedPeriods !== null && (
//                           <span className="text-pink-500 text-xl font-medium">
//                             Allocated Periods: {allocatedPeriods}
//                           </span>
//                         )}
//                         <h2 className="text-xl   text-blue-500 font-bold mb-2 text-center">
//                           Class - {activeTab}
//                         </h2>
//                         {usedPeriods !== null && (
//                           <span className="text-pink-500 text-xl font-medium">
//                             Occupied Periods: {usedPeriods}
//                           </span>
//                         )}
//                       </div>
//                       {/* Scrollable Table Container */}
//                       <div
//                         className="overflow-y-auto h-[400px] border rounded-md p-2"
//                         style={{
//                           scrollbarWidth: "thin", // For Firefox
//                           scrollbarColor: "#4F46E5 #E5E7EB", // Track and thumb color in Firefox
//                         }}
//                       >
//                         {/* <h2>Allocated Periods: {allocatedPeriods}</h2>
//                         <h2>Used Periods: {usedPeriods}</h2> */}

//                         {/* <CommonTable
//                           activeTab={activeTab}
//                           tabs={tabs}
//                           periods={timetableData.periods || []} // Pass periods to CommonTable
//                           subjects={subjects || []} // Pass subjects to CommonTable || []} // Pass subjects to CommonTable
//                           loading={loadingForTabSwitch} // Show loading state if fetching data
//                           selectedSubjects={selectedSubjects}
//                           handleTableData={handleTableData}
//                           rowCounts={timetableData.rowCounts} // Pass row counts (mon_fri and sat) to CommonTable
//                           allocatedPeriods={allocatedPeriods}
//                           usedPeriods={usedPeriods}
//                           setUsedPeriods={setUsedPeriods} // Pass setUsedPeriods function to child
//                           showToast={(message, type) =>
//                             console.log(`${type}: ${message}`)
//                           } // Example toast handler
//                         /> */}
//                         <CommonTable
//                           activeTab={activeTab}
//                           tabs={tabs}
//                           periods={timetableData.periods || []} // Pass periods to CommonTable
//                           subjects={subjects || []} // Pass subjects to CommonTable
//                           loading={loadingForTabSwitch} // Show loading state if fetching data
//                           selectedSubjects={selectedSubjects}
//                           handleTableData={handleTableData}
//                           rowCounts={timetableData.rowCounts} // Pass row counts (mon_fri and sat) to CommonTable
//                           allocatedPeriods={allocatedPeriods}
//                           usedPeriods={usedPeriods}
//                           setUsedPeriods={setUsedPeriods} // Pass setUsedPeriods function to child
//                           showToast={
//                             (message, type) =>
//                               console.log(`${type}: ${message}`) // Example toast handler
//                           }
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex justify-end px-3 py-1 relative -top-2">
//                     <button
//                       type="button"
//                       className="btn btn-primary px-3 "
//                       onClick={handleSubmit}
//                       disabled={isSubmitting}
//                     >
//                       {isSubmitting ? "Submiting..." : "Submit"}
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </>
//         </div>
//       </div>
//     </>
//   );
// };

// export default TimetablePlanner;
