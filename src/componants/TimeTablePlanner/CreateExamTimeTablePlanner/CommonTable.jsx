// this one resove above bug
// import { useState, useEffect } from "react";
// import LoaderStyle from "../../componants/common/LoaderFinal/LoaderStyle";

// export default function CommonTable({
//   periods,
//   subjects,
//   loading,
//   selectedSubjects,
//   handleTableData,
//   activeTab,
//   tabs,
//   rowCounts,
//   allocatedPeriods,
//   usedPeriods,
//   setUsedPeriods,
//   showToast,
// }) {
//   const [localSelectedSubjects, setLocalSelectedSubjects] = useState({});

//   const activeTabData = tabs.find((tab) => tab.id === activeTab);
//   const classId = activeTabData?.class_id;
//   const sectionId = activeTabData?.section_id;
//   const key = `${classId}-${sectionId}`;
//   console.log("Allocated Periods:", allocatedPeriods);
//   console.log("Used Periods:", usedPeriods);
//   console.log("Periods:", periods);
//   console.log("Subjects:", subjects);
//   console.log("Loading:", loading);
//   console.log("Selected Subjects:", selectedSubjects);
//   console.log("Handle Table Data Function:", handleTableData);
//   console.log("Active Tab:", activeTab);
//   console.log("Tabs:", tabs);
//   console.log("Row Counts:", rowCounts);
//   useEffect(() => {
//     if (selectedSubjects[key]) {
//       setLocalSelectedSubjects(selectedSubjects[key]);
//     } else {
//       setLocalSelectedSubjects({});
//     }
//   }, [selectedSubjects, key]);

//   const handleSubjectChange = (day, period_no, selectedSubject) => {
//     if (!classId || !sectionId) return;

//     const currentSelectedSubject = localSelectedSubjects?.[day]?.[period_no];

//     // Handle the case when no subject is selected (i.e., clearing the subject)
//     if (!selectedSubject.id) {
//       if (currentSelectedSubject) {
//         setUsedPeriods((prev) => (prev > 0 ? prev - 1 : 0));
//       }

//       const updatedSubjects = {
//         ...localSelectedSubjects,
//         [day]: {
//           ...(localSelectedSubjects[day] || {}),
//           [period_no]: null,
//         },
//       };
//       setLocalSelectedSubjects(updatedSubjects);
//       handleTableData(classId, sectionId, day, period_no, selectedSubject);
//       return;
//     }

//     // Case where the subject is being changed
//     if (
//       currentSelectedSubject &&
//       currentSelectedSubject.id !== selectedSubject.id
//     ) {
//       // Only decrease usedPeriods if it’s not equal to allocatedPeriods
//       if (usedPeriods < allocatedPeriods) {
//         setUsedPeriods((prev) => (prev > 0 ? prev - 1 : 0));
//       }
//       if (usedPeriods < allocatedPeriods) {
//         setUsedPeriods((prev) => prev + 1);
//       }
//     }

//     // Case where no subject is currently selected or it's an empty selection
//     if (!currentSelectedSubject || currentSelectedSubject.id === "") {
//       // Increase usedPeriods only if it’s less than allocatedPeriods
//       if (usedPeriods < allocatedPeriods) {
//         setUsedPeriods((prev) => prev + 1);
//       }
//     }

//     // Update the selected subject
//     const updatedSubjects = {
//       ...localSelectedSubjects,
//       [day]: {
//         ...(localSelectedSubjects[day] || {}),
//         [period_no]: { id: selectedSubject.id, name: selectedSubject.name },
//       },
//     };

//     setLocalSelectedSubjects(updatedSubjects);
//     handleTableData(classId, sectionId, day, period_no, selectedSubject);
//   };

//   const renderRows = (days) => {
//     const rows = [];
//     const maxRows = Math.max(rowCounts.mon_fri, rowCounts.sat);

//     for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
//       rows.push(
//         <tr key={`row-${rowIndex}`}>
//           {/* Periods Column */}
//           <td className="border p-2 text-center bg-gray-100 w-16">
//             {rowIndex + 1}
//           </td>

//           {days.map((day) => {
//             // Skip rendering cells for Saturday if it exceeds rowCounts.sat
//             if (day === "Saturday" && rowIndex >= rowCounts.sat) {
//               return <td key={day} className="border p-2"></td>;
//             }
//             const selectedPeriod = localSelectedSubjects?.[day]?.[rowIndex + 1];
//             // Find the period for the current day and rowIndex (period_no)
//             const periodData = periods.find(
//               (period) =>
//                 period.day === day && period.period_no === rowIndex + 1
//             );

//             const subjectName = periodData ? periodData.subject_id : " ";
//             const teacherName = periodData ? periodData.teachers : " ";

//             return (
//               <td key={day} className="border p-2">
//                 {/* Subject and Teacher Info */}
//                 <div className="flex flex-col w-full text-sm text-gray-600">
//                   <div className="mb-1">
//                     {/* <span className="">Subject: </span> */}
//                     <span className="break-words  text-xs">
//                       {subjectName || " "}
//                     </span>
//                   </div>

//                   <div>
//                     {/* <span className="font-medium">Teacher: </span> */}
//                     <span className="break-words text-pink-600 text-xs">
//                       {teacherName || " "}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Subject Dropdown */}
//                 <select
//                   className="border p-1 w-full mt-2"
//                   value={selectedPeriod?.id || ""}
//                   onChange={(e) => {
//                     const selectedSub = {
//                       id: e.target.value,
//                       name:
//                         subjects.find((s) => s.id === e.target.value)
//                           ?.subjectname || "",
//                     };
//                     handleSubjectChange(day, rowIndex + 1, selectedSub);
//                   }}
//                   disabled={
//                     usedPeriods >= allocatedPeriods && !selectedPeriod?.id
//                   }
//                 >
//                   <option value="">Select</option>
//                   {subjects.map((subject) => (
//                     <option key={subject.subject_id} value={subject.sm_id}>
//                       {subject.subjectname}
//                     </option>
//                   ))}
//                 </select>
//               </td>
//             );
//           })}
//         </tr>
//       );
//     }
//     return rows;
//   };

//   const daysForTable = [
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     ...(rowCounts.sat > 0 ? ["Saturday"] : []),
//   ];

//   const renderTable = () => {
//     if (!periods?.length || !subjects.length || !rowCounts?.mon_fri) {
//       return <div className="p-5 text-center text-gray-600">No data found</div>;
//     }
//     return (
//       <table className="table-auto w-full border-collapse border border-gray-300">
//         <thead>
//           <tr className="bg-gray-200 text-gray-600">
//             <th className="border p-2 text-center">Periods</th>
//             {daysForTable.map((day, daykey) => (
//               <th key={daykey} className="border p-2 text-center">
//                 {day}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>{renderRows(daysForTable)}</tbody>
//       </table>
//     );
//   };

//   return (
//     <div className="overflow-x-auto">
//       {loading ? (
//         <div className="mt-24 border-1 border-white flex justify-center items-center p-5 ">
//           <LoaderStyle />
//         </div>
//       ) : (
//         renderTable()
//       )}
//     </div>
//   );
// }
// TryUP workin well also condition of same period same day for calss section is not select other
// import { useState, useEffect } from "react";
// // import LoaderStyle from "../../componants/common/LoaderFinal/LoaderStyle";
// import LoaderStyle from "../../common/LoaderFinal/LoaderStyle";

// export default function CommonTable({
//   periods,
//   subjects,
//   loading,
//   selectedSubjects,
//   handleTableData,
//   activeTab,
//   tabs,
//   rowCounts,
//   allocatedPeriods,
//   usedPeriods,
//   setUsedPeriods,
//   showToast,
// }) {
//   const [localSelectedSubjects, setLocalSelectedSubjects] = useState({});
//   const [globalSubjectSelection, setGlobalSubjectSelection] = useState({});

//   const activeTabData = tabs.find((tab) => tab.id === activeTab);
//   const classId = activeTabData?.class_id;
//   const sectionId = activeTabData?.section_id;
//   const key = `${classId}-${sectionId}`;
//   console.log("localSelectedSubjects[]", localSelectedSubjects);
//   console.log("globalSubjectSelection[]", globalSubjectSelection);
//   // Sync local selected subjects with global selected subjects
//   useEffect(() => {
//     if (selectedSubjects[key]) {
//       setLocalSelectedSubjects(selectedSubjects[key]);
//     } else {
//       setLocalSelectedSubjects({});
//     }
//   }, [selectedSubjects, key]);

//   useEffect(() => {
//     // Update global subject selection when local changes
//     if (Object.keys(localSelectedSubjects).length) {
//       setGlobalSubjectSelection((prevState) => ({
//         ...prevState,
//         [key]: localSelectedSubjects,
//       }));
//     }
//   }, [localSelectedSubjects, key]);

//   // Check if any subject is already selected for the same period and day in any other section
//   const isSubjectDropdownDisabled = (day, period_no) => {
//     for (const sectionKey in globalSubjectSelection) {
//       if (sectionKey === key) continue; // Skip the current section (it’s where the subject is being assigned)
//       const sectionData = globalSubjectSelection[sectionKey];
//       const selectedSubject = sectionData[day]?.[period_no];
//       if (selectedSubject) {
//         return true; // Disable the dropdown if any subject is selected in any other section
//       }
//     }
//     return false;
//   };

//   // Handle subject change for a specific day and period
//   const handleSubjectChange = (day, period_no, selectedSubject) => {
//     if (!classId || !sectionId) return;

//     const currentSelectedSubject = localSelectedSubjects?.[day]?.[period_no];

//     // Prevent subject selection if it's already selected in another section for the same day and period
//     if (selectedSubject.id && isSubjectDropdownDisabled(day, period_no)) {
//       showToast(
//         "The subject dropdown is disabled for this period and day in other class-sections.",
//         "error"
//       );
//       return; // Prevent selection and show toast
//     }

//     const updatedSubjects = {
//       ...localSelectedSubjects,
//       [day]: {
//         ...(localSelectedSubjects[day] || {}),
//         [period_no]: selectedSubject.id
//           ? { id: selectedSubject.id, name: selectedSubject.name }
//           : null,
//       },
//     };

//     // Update `usedPeriods` based on selection/deselection
//     if (selectedSubject.id) {
//       // New subject selected
//       if (!currentSelectedSubject || currentSelectedSubject.id === "") {
//         setUsedPeriods((prev) => (prev < allocatedPeriods ? prev + 1 : prev));
//       }
//     } else {
//       // Subject cleared
//       if (currentSelectedSubject) {
//         setUsedPeriods((prev) => (prev > 0 ? prev - 1 : 0));
//       }
//     }

//     setLocalSelectedSubjects(updatedSubjects);
//     handleTableData(classId, sectionId, day, period_no, selectedSubject);
//   };

//   // Function to render the table rows
//   const renderRows = (days) => {
//     const rows = [];
//     const maxRows = Math.max(rowCounts.mon_fri, rowCounts.sat);

//     for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
//       rows.push(
//         <tr key={`row-${rowIndex}`}>
//           {/* Periods Column */}
//           <td className="border p-2 text-center bg-gray-100 w-16">
//             {rowIndex + 1}
//           </td>

//           {days.map((day) => {
//             if (day === "Saturday" && rowIndex >= rowCounts.sat) {
//               return <td key={day} className="border p-2"></td>;
//             }

//             const selectedPeriod = localSelectedSubjects?.[day]?.[rowIndex + 1];
//             const periodData = periods.find(
//               (period) =>
//                 period.day === day && period.period_no === rowIndex + 1
//             );

//             const subjectName = periodData ? periodData.subject_id : " ";
//             const teacherName = periodData ? periodData.teachers : " ";

//             return (
//               <td key={day} className="border p-2">
//                 {/* <div className="flex flex-col w-full text-sm text-gray-600">
//                   <div className="mb-1">
//                     <span className="break-words text-xs">
//                       {subjectName || " "}
//                     </span>
//                   </div>

//                   <div>
//                     <span className="break-words text-pink-600 text-xs">
//                       {teacherName || " "}
//                     </span>
//                   </div>
//                 </div> */}
//                 <div className="flex  text-center flex-col w-full text-sm text-gray-600">
//                   {subjectName && teacherName ? (
//                     <>
//                       <div className="mb-1">
//                         <span className="break-words text-xs font-medium">
//                           {subjectName}
//                         </span>
//                       </div>

//                       <div>
//                         <span className="break-words text-pink-600 font-medium text-xs">
//                           {teacherName}
//                         </span>
//                       </div>
//                     </>
//                   ) : null}
//                 </div>

//                 {/* <select
//                   className="border p-1 w-full mt-2"
//                   value={selectedPeriod?.id || ""}
//                   onChange={(e) => {
//                     const selectedSub = {
//                       id: e.target.value,
//                       name:
//                         subjects.find((s) => s.id === e.target.value)
//                           ?.subjectname || "",
//                     };
//                     handleSubjectChange(day, rowIndex + 1, selectedSub);
//                   }}
//                   disabled={
//                     isSubjectDropdownDisabled(day, rowIndex + 1) ||
//                     (usedPeriods >= allocatedPeriods && !selectedPeriod?.id)
//                   }
//                 >
//                   <option value="">Select</option>
//                   {subjects.map((subject) => (
//                     <option key={subject.subject_id} value={subject.sm_id}>
//                       {subject.subjectname}
//                     </option>
//                   ))}
//                 </select> */}
//                 {/* Disabled select */}

//                 <select
//                   className={`border p-1 w-full mt-2 ${
//                     isSubjectDropdownDisabled(day, rowIndex + 1) ||
//                     (usedPeriods >= allocatedPeriods && !selectedPeriod?.id)
//                       ? "bg-gray-300 cursor-not-allowed" // Disabled state styles
//                       : "bg-white" // Default background color when enabled
//                   }`}
//                   value={selectedPeriod?.id || ""}
//                   onChange={(e) => {
//                     const selectedSub = {
//                       id: e.target.value,
//                       name:
//                         subjects.find((s) => s.id === e.target.value)
//                           ?.subjectname || "",
//                     };
//                     handleSubjectChange(day, rowIndex + 1, selectedSub);
//                   }}
//                   disabled={
//                     isSubjectDropdownDisabled(day, rowIndex + 1) ||
//                     (usedPeriods >= allocatedPeriods && !selectedPeriod?.id)
//                   }
//                   title={
//                     isSubjectDropdownDisabled(day, rowIndex + 1)
//                       ? `Occupied by ${
//                           periods.find(
//                             (subject) => subject.sm_id === selectedPeriod?.id
//                           )?.subjectname || "No subject"
//                         } in ${day}, Period ${rowIndex + 1} (Class: ${
//                           activeTabData?.class_id
//                         }, Section: ${activeTabData?.section_id})`
//                       : ""
//                   }
//                 >
//                   <option value="">Select</option>
//                   {subjects.map((subject) => (
//                     <option key={subject.subject_id} value={subject.sm_id}>
//                       {subject.subjectname}
//                     </option>
//                   ))}
//                 </select>

//                 {/* <select
//                   className={`border p-1 w-full mt-2 ${
//                     isSubjectDropdownDisabled(day, rowIndex + 1) ||
//                     (usedPeriods >= allocatedPeriods && !selectedPeriod?.id)
//                       ? "bg-gray-300 cursor-not-allowed" // Disabled state styles
//                       : "bg-white" // Default background color when enabled
//                   }`}
//                   value={selectedPeriod?.id || ""}
//                   onChange={(e) => {
//                     const selectedSub = {
//                       id: e.target.value,
//                       name:
//                         subjects.find((s) => s.id === e.target.value)
//                           ?.subjectname || "",
//                     };
//                     handleSubjectChange(day, rowIndex + 1, selectedSub);
//                   }}
//                   disabled={
//                     isSubjectDropdownDisabled(day, rowIndex + 1) ||
//                     (usedPeriods >= allocatedPeriods && !selectedPeriod?.id)
//                   }
//                 >
//                   <option value="">Select</option>
//                   {subjects.map((subject) => (
//                     <option key={subject.subject_id} value={subject.sm_id}>
//                       {subject.subjectname}
//                     </option>
//                   ))}
//                 </select> */}
//               </td>
//             );
//           })}
//         </tr>
//       );
//     }
//     return rows;
//   };

//   const daysForTable = [
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     ...(rowCounts.sat > 0 ? ["Saturday"] : []),
//   ];

//   const renderTable = () => {
//     if (!periods?.length || !subjects.length || !rowCounts?.mon_fri) {
//       return <div className="p-5 text-center text-gray-600">No data found</div>;
//     }
//     return (
//       <table className="table-auto w-full border-collapse border border-gray-300">
//         <thead>
//           <tr className="bg-gray-200 text-gray-600">
//             <th className="border p-2 text-center">Periods</th>
//             {daysForTable.map((day, daykey) => (
//               <th key={daykey} className="border p-2 text-center">
//                 {day}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>{renderRows(daysForTable)}</tbody>
//       </table>
//     );
//   };

//   return (
//     <div className="overflow-x-auto">
//       {loading ? (
//         <div className="mt-24 border-1 border-white flex justify-center items-center p-5 ">
//           <LoaderStyle />
//         </div>
//       ) : (
//         renderTable()
//       )}
//     </div>
//   );
// }
// Try to apply disabled condtions
// Import Toastify styles workin well but select or deselct not working
// import { useState, useEffect } from "react";
// import LoaderStyle from "../../common/LoaderFinal/LoaderStyle";
// import { toast, ToastContainer } from "react-toastify"; // Import Toastify
// import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

// export default function CommonTable({
//   periods,
//   subjects,
//   loading,
//   selectedSubjects,
//   handleTableData,
//   activeTab,
//   tabs,
//   rowCounts,
//   allocatedPeriods,
//   usedPeriods,
//   setUsedPeriods,
// }) {
//   const [localSelectedSubjects, setLocalSelectedSubjects] = useState({});
//   const [globalSubjectSelection, setGlobalSubjectSelection] = useState({});

//   const activeTabData = tabs.find((tab) => tab.id === activeTab);
//   const classId = activeTabData?.class_id;
//   const sectionId = activeTabData?.section_id;
//   const key = `${classId}-${sectionId}`;

//   // Sync local selected subjects with global selected subjects
//   useEffect(() => {
//     if (selectedSubjects[key]) {
//       setLocalSelectedSubjects(selectedSubjects[key]);
//     } else {
//       setLocalSelectedSubjects({});
//     }
//   }, [selectedSubjects, key]);

//   // Update globalSubjectSelection when localSelectedSubjects change
//   useEffect(() => {
//     if (Object.keys(localSelectedSubjects).length) {
//       setGlobalSubjectSelection((prevState) => ({
//         ...prevState,
//         [key]: localSelectedSubjects,
//       }));
//     }
//   }, [localSelectedSubjects, key]);
//   const isSubjectDropdownDisabled = (day, period_no) => {
//     for (const sectionKey in globalSubjectSelection) {
//       if (sectionKey === key) continue; // Skip the current section (it’s where the subject is being assigned)
//       const sectionData = globalSubjectSelection[sectionKey];
//       const selectedSubject = sectionData[day]?.[period_no];
//       if (selectedSubject) {
//         return true; // Disable the dropdown if any subject is selected in any other section
//       }
//     }
//     return false;
//   };
//   // Check if any subject is already selected in another section for the same period and day
//   const isAnySubjectAlreadySelectedInOtherSection = (day, period_no) => {
//     for (const sectionKey in globalSubjectSelection) {
//       if (sectionKey === key) continue; // Skip the current section
//       const sectionData = globalSubjectSelection[sectionKey];
//       const selectedSubject = sectionData[day]?.[period_no];
//       if (selectedSubject) {
//         return true; // A subject is selected in another section for this period and day
//       }
//     }
//     return false;
//   };

//   // Handle subject change for a specific day and period
//   const handleSubjectChange = (day, period_no, selectedSubject) => {
//     if (!classId || !sectionId) return;
//     const currentSelectedSubject = localSelectedSubjects?.[day]?.[period_no];

//     // If any subject is selected in another section for this period and day, show toast
//     if (
//       selectedSubject.id &&
//       isAnySubjectAlreadySelectedInOtherSection(day, period_no)
//     ) {
//       toast.error(
//         `You have already selected a subject in another section for ${day}, Period ${period_no}.`
//       );
//       return; // Prevent subject selection and show toast
//     }

//     // Handle deselecting the subject
//     const updatedSubjects = {
//       ...localSelectedSubjects,
//       [day]: {
//         ...(localSelectedSubjects[day] || {}),
//         [period_no]: selectedSubject.id
//           ? { id: selectedSubject.id, name: selectedSubject.name }
//           : null, // Clear the subject if it's deselected
//       },
//     };

//     // If a subject is deselected, decrease the used period count
//     if (selectedSubject.id) {
//       // New subject selected
//       if (!currentSelectedSubject || currentSelectedSubject.id === "") {
//         setUsedPeriods((prev) => (prev < allocatedPeriods ? prev + 1 : prev));
//       }
//     } else {
//       // Subject cleared
//       if (currentSelectedSubject) {
//         setUsedPeriods((prev) => (prev > 0 ? prev - 1 : 0));
//       }
//     }

//     // Update local and global selections
//     setLocalSelectedSubjects(updatedSubjects);
//     setGlobalSubjectSelection((prevState) => ({
//       ...prevState,
//       [key]: updatedSubjects[day],
//     }));

//     handleTableData(classId, sectionId, day, period_no, selectedSubject);
//   };

//   // Function to render the table rows
//   const renderRows = (days) => {
//     const rows = [];
//     const maxRows = Math.max(rowCounts.mon_fri, rowCounts.sat);

//     for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
//       rows.push(
//         <tr key={`row-${rowIndex}`}>
//           {/* Periods Column */}
//           <td className="border p-2 text-center bg-gray-100 w-16">
//             {rowIndex + 1}
//           </td>

//           {days.map((day) => {
//             if (day === "Saturday" && rowIndex >= rowCounts.sat) {
//               return <td key={day} className="border p-2"></td>;
//             }

//             const selectedPeriod = localSelectedSubjects?.[day]?.[rowIndex + 1];
//             const periodData = periods.find(
//               (period) =>
//                 period.day === day && period.period_no === rowIndex + 1
//             );

//             const subjectName = periodData ? periodData.subject_id : " ";
//             const teacherName = periodData ? periodData.teachers : " ";

//             // Check if any subject is already selected in another section for the same period and day
//             const isSubjectSelectedInOtherSection =
//               isAnySubjectAlreadySelectedInOtherSection(day, rowIndex + 1);

//             // Disable new subject selection if used periods have reached allocated periods
//             const isMaxPeriodReached = usedPeriods === allocatedPeriods;

//             // If the period has a subject selected, the dropdown should be active.
//             const disableDropdown = isMaxPeriodReached && !selectedPeriod; // Disable if max periods are reached and no subject is selected

//             // Handle subject selection (new subject can be selected only if max periods haven't been reached)
//             const handleSubjectSelection = (e) => {
//               const selectedSub = {
//                 id: e.target.value,
//                 name:
//                   subjects.find((s) => s.id === e.target.value)?.subjectname ||
//                   "",
//               };

//               // If max periods have been reached and the user is trying to select a new subject
//               if (isMaxPeriodReached && !selectedPeriod) {
//                 toast.error(
//                   "You cannot select a new subject because the allocated periods have been reached."
//                 );
//                 return; // Prevent subject selection if max periods are reached
//               }

//               // If any subject is selected in another section for the same period and day, show toast
//               if (isSubjectSelectedInOtherSection) {
//                 toast.error(
//                   `You cannot select any subject because one is already selected in another section for ${day}, Period ${
//                     rowIndex + 1
//                   }.\n`
//                 );
//                 return; // Don't allow any subject to be selected if one is already taken in another section
//               }

//               // If a subject is selected, handle the change
//               handleSubjectChange(day, rowIndex + 1, selectedSub);
//             };

//             // Apply a special background color if the subject is already selected in another section for the same period and day
//             const dropdownBgColor = isSubjectSelectedInOtherSection
//               ? "bg-yellow-200"
//               : "bg-white";

//             return (
//               <td key={day} className="border p-2">
//                 <div className="flex text-center flex-col w-full text-sm text-gray-600">
//                   {subjectName && teacherName ? (
//                     <>
//                       <div className="mb-1">
//                         <span className="break-words text-xs font-medium">
//                           {subjectName}
//                         </span>
//                       </div>

//                       <div>
//                         <span className="break-words text-pink-600 font-medium text-xs">
//                           {teacherName}
//                         </span>
//                       </div>
//                     </>
//                   ) : null}
//                 </div>

//                 {/* Subject Dropdown */}
//                 <select
//                   className={`border p-1 w-full mt-2 ${dropdownBgColor}`}
//                   value={selectedPeriod?.id || ""}
//                   onChange={handleSubjectSelection}
//                   // disabled={disableDropdown} // Disable dropdown if new subject cannot be selected
//                   disabled={
//                     isSubjectDropdownDisabled(day, rowIndex + 1) ||
//                     (usedPeriods >= allocatedPeriods && !selectedPeriod?.id)
//                   }
//                 >
//                   <option value="">Select</option>
//                   {subjects.map((subject) => (
//                     <option key={subject.subject_id} value={subject.sm_id}>
//                       {subject.subjectname}
//                     </option>
//                   ))}
//                 </select>
//               </td>
//             );
//           })}
//         </tr>
//       );
//     }
//     return rows;
//   };

//   const daysForTable = [
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     ...(rowCounts.sat > 0 ? ["Saturday"] : []),
//   ];

//   const renderTable = () => {
//     if (!periods?.length || !subjects.length || !rowCounts?.mon_fri) {
//       return <div className="p-5 text-center text-gray-600">No data found</div>;
//     }
//     return (
//       <table className="table-auto w-full border-collapse border border-gray-300">
//         <thead>
//           <tr className="bg-gray-200 text-gray-600">
//             <th className="border p-2 text-center">Periods</th>
//             {daysForTable.map((day, daykey) => (
//               <th key={daykey} className="border p-2 text-center">
//                 {day}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>{renderRows(daysForTable)}</tbody>
//       </table>
//     );
//   };

//   return (
//     <div className="overflow-x-auto">
//       {loading ? (
//         <div className="mt-24 border-1 border-white flex justify-center items-center p-5 ">
//           <LoaderStyle />
//         </div>
//       ) : (
//         renderTable()
//       )}
//       {/* Toast Container */}
//       <ToastContainer />
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import LoaderStyle from "../../common/LoaderFinal/LoaderStyle";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CommonTable({
  periods,
  subjects,
  loading,
  selectedSubjects,
  handleTableData,
  activeTab,
  tabs,
  rowCounts,
  allocatedPeriods,
  usedPeriods,
  setUsedPeriods,
}) {
  const [localSelectedSubjects, setLocalSelectedSubjects] = useState({});
  const [globalSubjectSelection, setGlobalSubjectSelection] = useState({});
  // Mapping of class-section IDs to class-section names
  const classSectionMapping = {
    455: "1-D",
    458: "2-C",
    462: "3-C",
    465: "4-B",
    471: "5-D",
    473: "6-B",
    474: "6-C",
    476: "7-A",
    479: "7-D",
    482: "8-C",
    483: "8-D",
    485: "9-B",
    488: "10-A",
    490: "10-C",
    492: "11-A",
    452: "1-A",
    453: "1-B",
    454: "1-C",
    456: "2-A",
    457: "2-B",
    459: "2-D",
    460: "3-A",
    461: "3-B",
    463: "3-D",
    464: "4-A",
    466: "4-C",
    467: "4-D",
    468: "5-A",
    469: "5-B",
    470: "5-C",
    472: "6-A",
    475: "6-D",
    477: "7-B",
    478: "7-C",
    480: "8-A",
    487: "9-D",
    484: "9-A",
    489: "10-B",
    491: "10-D",
    493: "11-B",
    494: "11-C",
    495: "11-D",
    496: "12-A",
    497: "12-B",
    498: "12-C",
    499: "12-D",
  };

  console.log("globalSubjectSelection", globalSubjectSelection);
  const activeTabData = tabs.find((tab) => tab.id === activeTab);
  const classId = activeTabData?.class_id;
  const sectionId = activeTabData?.section_id;
  console.log("activeTabData", activeTabData);
  const key = `${classId}-${sectionId}`;

  // Sync local selected subjects with global selected subjects when the active tab or selected subjects change
  useEffect(() => {
    if (selectedSubjects[key]) {
      setLocalSelectedSubjects(selectedSubjects[key]);
    } else {
      setLocalSelectedSubjects({});
    }
  }, [selectedSubjects, key]);

  // Update global subject selection when local selections change
  useEffect(() => {
    if (Object.keys(localSelectedSubjects).length) {
      setGlobalSubjectSelection((prevState) => ({
        ...prevState,
        [key]: localSelectedSubjects,
      }));
    }
  }, [localSelectedSubjects, key]);

  // Check if a subject is already selected in another section for the same period and day
  // Check if a subject is already selected in another section for the same period and day
  const isAnySubjectAlreadySelectedInOtherSection = (day, period_no) => {
    for (const sectionKey in globalSubjectSelection) {
      if (sectionKey === key) continue; // Skip current section
      const sectionData = globalSubjectSelection[sectionKey];
      const selectedSubject = sectionData[day]?.[period_no];
      // Allow changes only if the ID is not empty in the other section
      if (selectedSubject?.id && selectedSubject.id !== "") {
        return true; // Subject already selected in another section
      }
    }
    return false;
  };

  // Handle subject selection or deselection
  const handleSubjectChange = (day, period_no, selectedSubject) => {
    if (!classId || !sectionId) return;
    const currentSelectedSubject = localSelectedSubjects?.[day]?.[period_no];

    // If subject is selected in another section, prevent selection
    if (
      selectedSubject.id &&
      isAnySubjectAlreadySelectedInOtherSection(day, period_no)
    ) {
      // Find the class and section that already has the subject selected
      let conflictingClassSection = "";
      for (const sectionKey in globalSubjectSelection) {
        if (sectionKey === key) continue; // Skip current section
        const sectionData = globalSubjectSelection[sectionKey];
        const selectedSubjectInOtherSection = sectionData[day]?.[period_no];
        if (selectedSubjectInOtherSection?.id) {
          // Extract class and section info from the sectionKey (formatted as "classId-sectionId")
          const [conflictingClassId, conflictingSectionId] =
            sectionKey.split("-");
          const classSectionName = classSectionMapping[conflictingSectionId]; // Map to class-section name
          conflictingClassSection = `${classSectionName}`;
          break;
        }
      }

      // Show toast message with the conflicting class-section name
      toast.error(
        <div>
          <span>
            <strong style={{ color: "#e74c3c" }}>
              Subject already selected in another section (
              {conflictingClassSection})
            </strong>
          </span>
          <br />
          <span style={{ color: "#2980b9" }}>
            for {day}, Period {period_no}.
          </span>
        </div>,
        {
          position: "top-right", // You can adjust the position here
          autoClose: 5000, // Toast duration
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );

      return; // Prevent the subject selection
    }

    // Handle subject change (select or swap subjects)
    const updatedSubjects = {
      ...localSelectedSubjects,
      [day]: {
        ...(localSelectedSubjects[day] || {}),
        [period_no]: selectedSubject.id
          ? { id: selectedSubject.id, name: selectedSubject.name }
          : null, // Clear subject if deselected
      },
    };

    // Update used periods count (when deselecting or selecting a subject)
    if (selectedSubject.id) {
      // New subject selected
      if (!currentSelectedSubject || currentSelectedSubject.id === "") {
        setUsedPeriods((prev) => (prev < allocatedPeriods ? prev + 1 : prev));
      }
    } else {
      // Subject cleared
      if (currentSelectedSubject) {
        setUsedPeriods((prev) => (prev > 0 ? prev - 1 : 0));
      }
    }

    // Update both local and global selections
    setLocalSelectedSubjects(updatedSubjects);
    setGlobalSubjectSelection((prevState) => ({
      ...prevState,
      [key]: updatedSubjects[day],
    }));

    // Call the handleTableData to persist the change
    handleTableData(classId, sectionId, day, period_no, selectedSubject);
  };

  const renderRows = (days) => {
    const rows = [];
    const maxRows = Math.max(rowCounts.mon_fri, rowCounts.sat);

    for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
      rows.push(
        <tr key={`row-${rowIndex}`}>
          {/* Periods Column */}
          <td className="border p-2 text-center bg-gray-100 w-16">
            {rowIndex + 1}
          </td>

          {days.map((day) => {
            if (day === "Saturday" && rowIndex >= rowCounts.sat) {
              return <td key={day} className="border p-2"></td>;
            }

            const selectedPeriod = localSelectedSubjects?.[day]?.[rowIndex + 1];
            const periodData = periods.find(
              (period) =>
                period.day === day && period.period_no === rowIndex + 1
            );

            const subjectName = periodData ? periodData.subject_id : " ";
            const teacherName = periodData ? periodData.teachers : " ";

            // Handle subject selection
            const handleSubjectSelection = (e) => {
              const selectedSub = {
                id: e.target.value,
                name:
                  subjects.find((s) => s.id === e.target.value)?.subjectname ||
                  "",
              };

              handleSubjectChange(day, rowIndex + 1, selectedSub);
            };

            // Determine if the background should be highlighted (for selected subjects in other class-sections)
            const isSelectedInOtherSection =
              isAnySubjectAlreadySelectedInOtherSection(day, rowIndex + 1);
            const highlightClass =
              selectedPeriod?.id === ""
                ? "" // No highlight if the ID is empty
                : isSelectedInOtherSection
                ? "bg-pink-100"
                : "";

            return (
              <td key={day} className="border p-2">
                <div className="flex text-center flex-col w-full text-sm text-gray-600">
                  {subjectName && teacherName ? (
                    <>
                      <div className="mb-1">
                        <span className="break-words text-xs font-medium">
                          {subjectName}
                        </span>
                      </div>

                      <div>
                        <span className="break-words text-pink-600 font-medium text-xs">
                          {teacherName}
                        </span>
                      </div>
                    </>
                  ) : null}
                </div>

                {/* Subject Dropdown */}
                <select
                  className={`border p-1 w-full mt-2 ${highlightClass}`}
                  value={selectedPeriod?.id || ""}
                  onChange={handleSubjectSelection}
                  disabled={
                    usedPeriods >= allocatedPeriods && !selectedPeriod?.id
                  } // Disable if used periods match allocated periods and subject is not already selected
                >
                  <option value="">Select</option>
                  {subjects.map((subject) => (
                    <option key={subject.subject_id} value={subject.sm_id}>
                      {subject.subjectname}
                    </option>
                  ))}
                </select>
              </td>
            );
          })}
        </tr>
      );
    }
    return rows;
  };

  const daysForTable = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    ...(rowCounts.sat > 0 ? ["Saturday"] : []),
  ];

  const renderTable = () => {
    if (!periods?.length || !subjects.length || !rowCounts?.mon_fri) {
      return <div className="p-5 text-center text-gray-600">No data found</div>;
    }
    return (
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-600">
            <th className="border p-2 text-center">Periods</th>
            {daysForTable.map((day, daykey) => (
              <th key={daykey} className="border p-2 text-center">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{renderRows(daysForTable)}</tbody>
      </table>
    );
  };

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <div className="mt-24 border-1 border-white flex justify-center items-center p-5 ">
          <LoaderStyle />
        </div>
      ) : (
        renderTable()
      )}
      <ToastContainer />
    </div>
  );
}
// working well
// import { useState, useEffect } from "react";
// import LoaderStyle from "../../common/LoaderFinal/LoaderStyle";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function CommonTable({
//   periods,
//   subjects,
//   loading,
//   selectedSubjects,
//   handleTableData,
//   activeTab,
//   tabs,
//   rowCounts,
//   allocatedPeriods,
//   usedPeriods,
//   setUsedPeriods,
// }) {
//   const [localSelectedSubjects, setLocalSelectedSubjects] = useState({});
//   const [globalSubjectSelection, setGlobalSubjectSelection] = useState({});
//   // Mapping of class-section IDs to class-section names
//   const classSectionMapping = {
//     455: "1-D",
//     458: "2-C",
//     462: "3-C",
//     465: "4-B",
//     471: "5-D",
//     473: "6-B",
//     474: "6-C",
//     476: "7-A",
//     479: "7-D",
//     482: "8-C",
//     483: "8-D",
//     485: "9-B",
//     488: "10-A",
//     490: "10-C",
//     492: "11-A",
//     452: "1-A",
//     453: "1-B",
//     454: "1-C",
//     456: "2-A",
//     457: "2-B",
//     459: "2-D",
//     460: "3-A",
//     461: "3-B",
//     463: "3-D",
//     464: "4-A",
//     466: "4-C",
//     467: "4-D",
//     468: "5-A",
//     469: "5-B",
//     470: "5-C",
//     472: "6-A",
//     475: "6-D",
//     477: "7-B",
//     478: "7-C",
//     480: "8-A",
//     487: "9-D",
//     484: "9-A",
//     489: "10-B",
//     491: "10-D",
//     493: "11-B",
//     494: "11-C",
//     495: "11-D",
//     496: "12-A",
//     497: "12-B",
//     498: "12-C",
//     499: "12-D",
//   };

//   console.log("globalSubjectSelection", globalSubjectSelection);
//   const activeTabData = tabs.find((tab) => tab.id === activeTab);
//   const classId = activeTabData?.class_id;
//   const sectionId = activeTabData?.section_id;
//   console.log("activeTabData", activeTabData);
//   const key = `${classId}-${sectionId}`;

//   // Sync local selected subjects with global selected subjects when the active tab or selected subjects change
//   useEffect(() => {
//     if (selectedSubjects[key]) {
//       setLocalSelectedSubjects(selectedSubjects[key]);
//     } else {
//       setLocalSelectedSubjects({});
//     }
//   }, [selectedSubjects, key]);

//   // Update global subject selection when local selections change
//   useEffect(() => {
//     if (Object.keys(localSelectedSubjects).length) {
//       setGlobalSubjectSelection((prevState) => ({
//         ...prevState,
//         [key]: localSelectedSubjects,
//       }));
//     }
//   }, [localSelectedSubjects, key]);

//   // Check if a subject is already selected in another section for the same period and day
//   const isAnySubjectAlreadySelectedInOtherSection = (day, period_no) => {
//     for (const sectionKey in globalSubjectSelection) {
//       if (sectionKey === key) continue; // Skip current section
//       const sectionData = globalSubjectSelection[sectionKey];
//       const selectedSubject = sectionData[day]?.[period_no];
//       if (selectedSubject) {
//         return true; // Subject already selected in another section
//       }
//     }
//     return false;
//   };

//   // Handle subject selection or deselection
//   // Handle subject selection or deselection
//   const handleSubjectChange = (day, period_no, selectedSubject) => {
//     if (!classId || !sectionId) return;
//     const currentSelectedSubject = localSelectedSubjects?.[day]?.[period_no];

//     // If subject is selected in another section, prevent selection
//     if (
//       selectedSubject.id &&
//       isAnySubjectAlreadySelectedInOtherSection(day, period_no)
//     ) {
//       // Find the class and section that already has the subject selected
//       let conflictingClassSection = "";
//       for (const sectionKey in globalSubjectSelection) {
//         if (sectionKey === key) continue; // Skip current section
//         const sectionData = globalSubjectSelection[sectionKey];
//         const selectedSubjectInOtherSection = sectionData[day]?.[period_no];
//         if (selectedSubjectInOtherSection) {
//           // Extract class and section info from the sectionKey (formatted as "classId-sectionId")
//           const [conflictingClassId, conflictingSectionId] =
//             sectionKey.split("-");
//           const classSectionName = classSectionMapping[conflictingSectionId]; // Map to class-section name
//           conflictingClassSection = `${classSectionName}`;
//           break;
//         }
//       }

//       // Show toast message with the conflicting class-section name
//       toast.error(
//         <div>
//           <span>
//             <strong style={{ color: "#e74c3c" }}>
//               Subject already selected in another section (
//               {conflictingClassSection})
//             </strong>
//           </span>
//           <br />
//           <span style={{ color: "#2980b9" }}>
//             for {day}, Period {period_no}.
//           </span>
//         </div>,
//         {
//           position: "top-right", // You can adjust the position here
//           autoClose: 5000, // Toast duration
//           hideProgressBar: true,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//         }
//       );

//       return; // Prevent the subject selection
//     }

//     // Handle subject change (select or swap subjects)
//     const updatedSubjects = {
//       ...localSelectedSubjects,
//       [day]: {
//         ...(localSelectedSubjects[day] || {}),
//         [period_no]: selectedSubject.id
//           ? { id: selectedSubject.id, name: selectedSubject.name }
//           : null, // Clear subject if deselected
//       },
//     };

//     // Update used periods count (when deselecting or selecting a subject)
//     if (selectedSubject.id) {
//       // New subject selected
//       if (!currentSelectedSubject || currentSelectedSubject.id === "") {
//         setUsedPeriods((prev) => (prev < allocatedPeriods ? prev + 1 : prev));
//       }
//     } else {
//       // Subject cleared
//       if (currentSelectedSubject) {
//         setUsedPeriods((prev) => (prev > 0 ? prev - 1 : 0));
//       }
//     }

//     // Update both local and global selections
//     setLocalSelectedSubjects(updatedSubjects);
//     setGlobalSubjectSelection((prevState) => ({
//       ...prevState,
//       [key]: updatedSubjects[day],
//     }));

//     // Call the handleTableData to persist the change
//     handleTableData(classId, sectionId, day, period_no, selectedSubject);
//   };
//   const renderRows = (days) => {
//     const rows = [];
//     const maxRows = Math.max(rowCounts.mon_fri, rowCounts.sat);

//     for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
//       rows.push(
//         <tr key={`row-${rowIndex}`}>
//           {/* Periods Column */}
//           <td className="border p-2 text-center bg-gray-100 w-16">
//             {rowIndex + 1}
//           </td>

//           {days.map((day) => {
//             if (day === "Saturday" && rowIndex >= rowCounts.sat) {
//               return <td key={day} className="border p-2"></td>;
//             }

//             const selectedPeriod = localSelectedSubjects?.[day]?.[rowIndex + 1];
//             const periodData = periods.find(
//               (period) =>
//                 period.day === day && period.period_no === rowIndex + 1
//             );

//             const subjectName = periodData ? periodData.subject_id : " ";
//             const teacherName = periodData ? periodData.teachers : " ";

//             // Handle subject selection
//             const handleSubjectSelection = (e) => {
//               const selectedSub = {
//                 id: e.target.value,
//                 name:
//                   subjects.find((s) => s.id === e.target.value)?.subjectname ||
//                   "",
//               };

//               handleSubjectChange(day, rowIndex + 1, selectedSub);
//             };

//             // Determine if the background should be highlighted (for selected subjects in other class-sections)
//             const isSelectedInOtherSection =
//               isAnySubjectAlreadySelectedInOtherSection(day, rowIndex + 1);
//             const highlightClass = isSelectedInOtherSection
//               ? "bg-pink-100"
//               : "";

//             return (
//               <td key={day} className="border p-2">
//                 <div className="flex text-center flex-col w-full text-sm text-gray-600">
//                   {subjectName && teacherName ? (
//                     <>
//                       <div className="mb-1">
//                         <span className="break-words text-xs font-medium">
//                           {subjectName}
//                         </span>
//                       </div>

//                       <div>
//                         <span className="break-words text-pink-600 font-medium text-xs">
//                           {teacherName}
//                         </span>
//                       </div>
//                     </>
//                   ) : null}
//                 </div>

//                 {/* Subject Dropdown */}
//                 <select
//                   className={`border p-1 w-full mt-2 ${highlightClass}`}
//                   value={selectedPeriod?.id || ""}
//                   onChange={handleSubjectSelection}
//                   disabled={
//                     usedPeriods >= allocatedPeriods && !selectedPeriod?.id
//                   } // Disable if used periods match allocated periods and subject is not already selected
//                 >
//                   <option value="">Select</option>
//                   {subjects.map((subject) => (
//                     <option key={subject.subject_id} value={subject.sm_id}>
//                       {subject.subjectname}
//                     </option>
//                   ))}
//                 </select>
//               </td>
//             );
//           })}
//         </tr>
//       );
//     }
//     return rows;
//   };

//   const daysForTable = [
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     ...(rowCounts.sat > 0 ? ["Saturday"] : []),
//   ];

//   const renderTable = () => {
//     if (!periods?.length || !subjects.length || !rowCounts?.mon_fri) {
//       return <div className="p-5 text-center text-gray-600">No data found</div>;
//     }
//     return (
//       <table className="table-auto w-full border-collapse border border-gray-300">
//         <thead>
//           <tr className="bg-gray-200 text-gray-600">
//             <th className="border p-2 text-center">Periods</th>
//             {daysForTable.map((day, daykey) => (
//               <th key={daykey} className="border p-2 text-center">
//                 {day}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>{renderRows(daysForTable)}</tbody>
//       </table>
//     );
//   };

//   return (
//     <div className="overflow-x-auto">
//       {loading ? (
//         <div className="mt-24 border-1 border-white flex justify-center items-center p-5 ">
//           <LoaderStyle />
//         </div>
//       ) : (
//         renderTable()
//       )}
//       <ToastContainer />
//     </div>
//   );
// }
