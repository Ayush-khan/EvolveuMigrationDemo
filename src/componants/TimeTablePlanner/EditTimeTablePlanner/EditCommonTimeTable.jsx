// import { useState, useEffect } from "react";
// // import LoaderStyle from "../../componants/common/LoaderFinal/LoaderStyle";
// import LoaderStyle from "../../common/LoaderFinal/LoaderStyle";

// export default function EditCommonTimeTable({
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
//   console.log("Periods:", periods);
//   console.log("Subjects:", subjects);
//   console.log("Loading:", loading);
//   console.log("Selected Subjects:", selectedSubjects);
//   console.log("Handle Table Data:", handleTableData);
//   console.log("Active Tab:", activeTab);
//   console.log("Tabs:", tabs);
//   console.log("Row Counts:", rowCounts);
//   console.log("Allocated Periods:", allocatedPeriods);
//   console.log("Used Periods:", usedPeriods);
//   console.log("Set Used Periods:", setUsedPeriods);
//   console.log("Show Toast:", showToast);

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

//             const subjectName = periodData ? periodData.subject : " ";
//             const teacherName = periodData ? periodData.teachers : " ";

//             return (
//               <td key={day} className="border p-2">
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
//     </div>
//   );
// }
// working create commmon component
// import { useState, useEffect } from "react";
// import LoaderStyle from "../../common/LoaderFinal/LoaderStyle";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function EditCommonTimeTable({
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

//   console.log("localSelectedSubjects", localSelectedSubjects);
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
//   // Check if a subject is already selected in another section for the same period and day
//   const isAnySubjectAlreadySelectedInOtherSection = (day, period_no) => {
//     for (const sectionKey in globalSubjectSelection) {
//       if (sectionKey === key) continue; // Skip current section
//       const sectionData = globalSubjectSelection[sectionKey];
//       const selectedSubject = sectionData[day]?.[period_no];
//       // Allow changes only if the ID is not empty in the other section
//       if (selectedSubject?.id && selectedSubject.id !== "") {
//         return true; // Subject already selected in another section
//       }
//     }
//     return false;
//   };

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
//         if (selectedSubjectInOtherSection?.id) {
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

//             const subjectName = periodData ? periodData.subject : " ";
//             const subject_id = periodData ? periodData.subject_id : " ";
//             // console.log("subjects_id is:---->", subject_id);
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
//             const highlightClass =
//               selectedPeriod?.id === ""
//                 ? "" // No highlight if the ID is empty
//                 : isSelectedInOtherSection
//                 ? "bg-pink-100"
//                 : "";

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

import { useState, useEffect } from "react";
import LoaderStyle from "../../common/LoaderFinal/LoaderStyle";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditCommonTimeTable({
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

  const activeTabData = tabs.find((tab) => tab.id === activeTab);
  const classId = activeTabData?.class_id;
  const sectionId = activeTabData?.section_id;
  const key = `${classId}-${sectionId}`;

  useEffect(() => {
    if (!periods || !Array.isArray(periods)) return;

    const updated = {};
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    days.forEach((day) => {
      const dayPeriods = periods.filter((period) => period.day === day);
      if (!updated[day]) updated[day] = {};

      dayPeriods.forEach((period) => {
        updated[day][period.period_no] = {
          id: period.subject_id || "",
          name: period.subject || "",
        };
      });
    });

    setLocalSelectedSubjects(updated);
    setGlobalSubjectSelection((prev) => ({
      ...prev,
      [key]: updated,
    }));
  }, [periods]);

  const isAnySubjectAlreadySelectedInOtherSection = (day, period_no) => {
    for (const sectionKey in globalSubjectSelection) {
      if (sectionKey === key) continue;
      const sectionData = globalSubjectSelection[sectionKey];
      const selectedSubject = sectionData[day]?.[period_no];
      if (selectedSubject?.id && selectedSubject.id !== "") {
        return true;
      }
    }
    return false;
  };

  const handleSubjectChange = (day, period_no, selectedSubject) => {
    if (!classId || !sectionId) return;
    const currentSelectedSubject = localSelectedSubjects?.[day]?.[period_no];

    if (
      selectedSubject.id &&
      isAnySubjectAlreadySelectedInOtherSection(day, period_no)
    ) {
      let conflictingClassSection = "";
      for (const sectionKey in globalSubjectSelection) {
        if (sectionKey === key) continue;
        const sectionData = globalSubjectSelection[sectionKey];
        const selectedSubjectInOtherSection = sectionData[day]?.[period_no];
        if (selectedSubjectInOtherSection?.id) {
          const [, conflictingSectionId] = sectionKey.split("-");
          const classSectionName = classSectionMapping[conflictingSectionId];
          conflictingClassSection = `${classSectionName}`;
          break;
        }
      }

      toast.error(
        <div>
          <strong style={{ color: "#e74c3c" }}>
            Subject already selected in another section (
            {conflictingClassSection})
          </strong>
          <br />
          <span style={{ color: "#2980b9" }}>
            for {day}, Period {period_no}.
          </span>
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      return;
    }

    const updatedSubjects = {
      ...localSelectedSubjects,
      [day]: {
        ...(localSelectedSubjects[day] || {}),
        [period_no]: selectedSubject.id
          ? { id: selectedSubject.id, name: selectedSubject.name }
          : null,
      },
    };

    if (selectedSubject.id) {
      if (!currentSelectedSubject || currentSelectedSubject.id === "") {
        setUsedPeriods((prev) => (prev < allocatedPeriods ? prev + 1 : prev));
      }
    } else {
      if (currentSelectedSubject) {
        setUsedPeriods((prev) => (prev > 0 ? prev - 1 : 0));
      }
    }

    setLocalSelectedSubjects(updatedSubjects);
    setGlobalSubjectSelection((prevState) => ({
      ...prevState,
      [key]: updatedSubjects,
    }));

    handleTableData(classId, sectionId, day, period_no, selectedSubject);
  };

  const renderRows = (days) => {
    const rows = [];
    const maxRows = Math.max(rowCounts.mon_fri, rowCounts.sat);

    for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
      rows.push(
        <tr key={`row-${rowIndex}`}>
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

            const subjectName = periodData ? periodData.subject : "";
            const teacherName = periodData ? periodData.teachers : "";

            const handleSubjectSelection = (e) => {
              const selectedSub = {
                id: e.target.value,
                name:
                  subjects.find((s) => s.sm_id === e.target.value)
                    ?.subjectname || "",
              };
              handleSubjectChange(day, rowIndex + 1, selectedSub);
            };

            const isSelectedInOtherSection =
              isAnySubjectAlreadySelectedInOtherSection(day, rowIndex + 1);
            const highlightClass =
              selectedPeriod?.id === ""
                ? ""
                : isSelectedInOtherSection
                ? "bg-pink-100"
                : "";

            return (
              <td key={day} className="border p-2">
                <div className="flex text-center flex-col w-full text-sm text-gray-600">
                  {subjectName && teacherName && (
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
                  )}
                </div>
                <select
                  className={`border p-1 w-full mt-2 ${highlightClass}`}
                  value={selectedPeriod?.id || ""}
                  onChange={handleSubjectSelection}
                  disabled={
                    usedPeriods >= allocatedPeriods && !selectedPeriod?.id
                  }
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
      return <div className="p-5">No data available.</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-200 w-16 text-center">
                Period
              </th>
              {daysForTable.map((day) => (
                <th key={day} className="border p-2 bg-gray-200 text-center">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{renderRows(daysForTable)}</tbody>
        </table>
        <ToastContainer />
      </div>
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

// import { useState, useEffect } from "react";
// import LoaderStyle from "../../common/LoaderFinal/LoaderStyle";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function EditCommonTimeTable({
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

//   console.log(" before localSelectedSubjects", localSelectedSubjects);
//   const activeTabData = tabs.find((tab) => tab.id === activeTab);
//   const classId = activeTabData?.class_id;
//   const sectionId = activeTabData?.section_id;
//   console.log("activeTabData", activeTabData);
//   const key = `${classId}-${sectionId}`;
//   // useEffect(() => {
//   //   if (!periods || !Array.isArray(periods)) return;

//   //   const transformedSubjects = {};

//   //   const days = [
//   //     "Monday",
//   //     "Tuesday",
//   //     "Wednesday",
//   //     "Thursday",
//   //     "Friday",
//   //     "Saturday",
//   //   ];
//   //   days.forEach((day) => {
//   //     const dayPeriods = periods.filter((period) => period.day === day);
//   //     if (!transformedSubjects[day]) transformedSubjects[day] = {};

//   //     dayPeriods.forEach((period) => {
//   //       transformedSubjects[day][period.period_no] = {
//   //         id: period.subject_id || "",
//   //         name: period.subject || "", // fallback to subject name from API
//   //       };
//   //     });
//   //   });

//   //   setLocalSelectedSubjects(transformedSubjects);
//   //   setGlobalSubjectSelection((prev) => ({
//   //     ...prev,
//   //     [key]: transformedSubjects,
//   //   }));
//   // }, [periods]);

//   // // Sync local selected subjects with global selected subjects when the active tab or selected subjects change
//   // useEffect(() => {
//   //   if (selectedSubjects[key]) {
//   //     setLocalSelectedSubjects(selectedSubjects[key]);
//   //   } else {
//   //     setLocalSelectedSubjects({});
//   //   }
//   // }, [selectedSubjects, key]);

//   // // Update global subject selection when local selections change
//   // useEffect(() => {
//   //   if (Object.keys(localSelectedSubjects).length) {
//   //     setGlobalSubjectSelection((prevState) => ({
//   //       ...prevState,
//   //       [key]: localSelectedSubjects,
//   //     }));
//   //   }
//   // }, [localSelectedSubjects, key]);
//   useEffect(() => {
//     if (!periods || !Array.isArray(periods)) return;

//     setLocalSelectedSubjects((prev) => {
//       const updated = { ...prev };
//       const days = [
//         "Monday",
//         "Tuesday",
//         "Wednesday",
//         "Thursday",
//         "Friday",
//         "Saturday",
//       ];

//       days.forEach((day) => {
//         const dayPeriods = periods.filter((period) => period.day === day);
//         if (!updated[day]) updated[day] = {};

//         dayPeriods.forEach((period) => {
//           const period_no = period.period_no;
//           if (!updated[day][period_no]) {
//             updated[day][period_no] = {
//               id: period.subject_id || "",
//               name: period.subject || "",
//             };
//           }
//         });
//       });

//       return updated;
//     });

//     setGlobalSubjectSelection((prev) => {
//       const updated = { ...prev };
//       if (!updated[key]) updated[key] = {};

//       const days = [
//         "Monday",
//         "Tuesday",
//         "Wednesday",
//         "Thursday",
//         "Friday",
//         "Saturday",
//       ];
//       days.forEach((day) => {
//         const dayPeriods = periods.filter((period) => period.day === day);
//         if (!updated[key][day]) updated[key][day] = {};

//         dayPeriods.forEach((period) => {
//           const period_no = period.period_no;
//           if (!updated[key][day][period_no]) {
//             updated[key][day][period_no] = {
//               id: period.subject_id || "",
//               name: period.subject || "",
//             };
//           }
//         });
//       });

//       return updated;
//     });
//   }, [periods]);

//   // Check if a subject is already selected in another section for the same period and day
//   // Check if a subject is already selected in another section for the same period and day
//   const isAnySubjectAlreadySelectedInOtherSection = (day, period_no) => {
//     for (const sectionKey in globalSubjectSelection) {
//       if (sectionKey === key) continue; // Skip current section
//       const sectionData = globalSubjectSelection[sectionKey];
//       const selectedSubject = sectionData[day]?.[period_no];
//       // Allow changes only if the ID is not empty in the other section
//       if (selectedSubject?.id && selectedSubject.id !== "") {
//         return true; // Subject already selected in another section
//       }
//     }
//     return false;
//   };

//   // Handle subject selection or deselection
//   // const handleSubjectChange = (day, period_no, selectedSubject) => {
//   //   if (!classId || !sectionId) return;

//   //   const currentSelectedSubject = localSelectedSubjects?.[day]?.[period_no];

//   //   // ✅ Check if same subject is already selected in another section (same day & period)
//   //   const isSubjectSelectedInAnotherSection = (subjectId, day, period_no) => {
//   //     for (const sectionKey in globalSubjectSelection) {
//   //       if (sectionKey === key) continue; // skip current section
//   //       const sectionData = globalSubjectSelection[sectionKey];
//   //       const selectedSubjectInOther = sectionData[day]?.[period_no];
//   //       if (selectedSubjectInOther?.id === subjectId) {
//   //         return true;
//   //       }
//   //     }
//   //     return false;
//   //   };

//   //   if (
//   //     selectedSubject.id &&
//   //     isSubjectSelectedInAnotherSection(selectedSubject.id, day, period_no)
//   //   ) {
//   //     let conflictingClassSection = "";
//   //     for (const sectionKey in globalSubjectSelection) {
//   //       if (sectionKey === key) continue;
//   //       const sectionData = globalSubjectSelection[sectionKey];
//   //       const selectedSubjectInOtherSection = sectionData[day]?.[period_no];
//   //       if (selectedSubjectInOtherSection?.id === selectedSubject.id) {
//   //         const [conflictingClassId, conflictingSectionId] =
//   //           sectionKey.split("-");
//   //         const classSectionName = classSectionMapping[conflictingSectionId];
//   //         conflictingClassSection = `${classSectionName}`;
//   //         break;
//   //       }
//   //     }

//   //     toast.error(
//   //       <div>
//   //         <span>
//   //           <strong style={{ color: "#e74c3c" }}>
//   //             Subject already selected in another section (
//   //             {conflictingClassSection})
//   //           </strong>
//   //         </span>
//   //         <br />
//   //         <span style={{ color: "#2980b9" }}>
//   //           for {day}, Period {period_no}.
//   //         </span>
//   //       </div>
//   //     );
//   //     return;
//   //   }

//   //   // ✅ Adjust used periods count
//   //   if (selectedSubject.id) {
//   //     if (!currentSelectedSubject || currentSelectedSubject.id === "") {
//   //       setUsedPeriods((prev) => (prev < allocatedPeriods ? prev + 1 : prev));
//   //     }
//   //   } else {
//   //     if (currentSelectedSubject) {
//   //       setUsedPeriods((prev) => (prev > 0 ? prev - 1 : 0));
//   //     }
//   //   }

//   //   // ✅ Update local state (preserve old data)
//   //   setLocalSelectedSubjects((prev) => ({
//   //     ...prev,
//   //     [day]: {
//   //       ...(prev[day] || {}),
//   //       [period_no]: selectedSubject.id
//   //         ? { id: selectedSubject.id, name: selectedSubject.name }
//   //         : null,
//   //     },
//   //   }));

//   //   // ✅ Trigger callback
//   //   handleTableData(classId, sectionId, day, period_no, selectedSubject);
//   // };

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
//         if (selectedSubjectInOtherSection?.id) {
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
//     console.log(
//       "inside hanldeSubject localSelectedSubjects",
//       localSelectedSubjects
//     );
//     console.log(
//       "inside hanldeSubject globalSubjectSelection",
//       globalSubjectSelection
//     );
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

//             const subjectName = periodData ? periodData.subject : " ";
//             const subject_id = periodData ? periodData.subject_id : " ";
//             // console.log("subjects_id is:---->", subject_id);
//             const teacherName = periodData ? periodData.teachers : " ";

//             // Handle subject selection
//             // const handleSubjectSelection = (e) => {
//             //   const selectedSub = {
//             //     id: e.target.value,
//             //     name:
//             //       subjects.find((s) => s.sm_id === e.target.value)
//             //         ?.subjectname || "",
//             //   };

//             //   handleSubjectChange(day, rowIndex + 1, selectedSub);
//             // };
//             const handleSubjectSelection = (e) => {
//               const selectedSub = {
//                 id: e.target.value,
//                 name:
//                   subjects.find((s) => s.sm_id === e.target.value)
//                     ?.subjectname || "",
//               };

//               handleSubjectChange(day, rowIndex + 1, selectedSub);
//             };

//             // Determine if the background should be highlighted (for selected subjects in other class-sections)
//             const isSelectedInOtherSection =
//               isAnySubjectAlreadySelectedInOtherSection(day, rowIndex + 1);
//             const highlightClass =
//               selectedPeriod?.id === ""
//                 ? "" // No highlight if the ID is empty
//                 : isSelectedInOtherSection
//                 ? "bg-pink-100"
//                 : "";

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
//       <ToastContainer />
//     </div>
//   );
// }
