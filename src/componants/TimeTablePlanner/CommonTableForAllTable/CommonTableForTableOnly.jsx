// import React from "react";

// const CommonTable = ({ title, headers, data, onSubmit }) => {
//   return (
//     <div className="relative w-[95%] bg-white shadow-xl rounded-lg border border-pink-500 mx-auto mt-3">
//       <div className="overflow-x-auto p-4">
//         <div className="p-2 px-3 bg-gray-100 flex justify-between items-center rounded-t-lg">
//           <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl">
//             {title}
//           </h3>
//           <button
//             className="text-xl text-red-600 hover:cursor-pointer hover:bg-red-100 p-1 rounded"
//             onClick={() => window.history.back()} // Navigate back or handle custom logic
//           >
//             ✕
//           </button>
//         </div>
//         <div
//           className="relative w-full h-1 mb-3 mx-auto"
//           style={{ backgroundColor: "#C03078" }}
//         ></div>

//         <table className="table-auto border-collapse border border-gray-300 w-full">
//           <thead className="bg-gray-200">
//             <tr>
//               {headers.map((header, index) => (
//                 <th
//                   key={index}
//                   className="border p-2 font-semibold text-center"
//                 >
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody className="bg-gray-50">
//             {data.map((row, rowIndex) => (
//               <tr key={rowIndex}>
//                 {row.map((cell, cellIndex) => (
//                   <td
//                     key={cellIndex}
//                     className="border border-gray-300 p-2 text-center"
//                   >
//                     {cell}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <div className="flex justify-end p-2 relative">
//           <button
//             className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
//             onClick={onSubmit}
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CommonTable;
// Create Common Table component code: working
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

  const activeTabData = tabs.find((tab) => tab.id === activeTab);
  const classId = activeTabData?.class_id;
  const sectionId = activeTabData?.section_id;
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
  const isAnySubjectAlreadySelectedInOtherSection = (day, period_no) => {
    for (const sectionKey in globalSubjectSelection) {
      if (sectionKey === key) continue; // Skip current section
      const sectionData = globalSubjectSelection[sectionKey];
      const selectedSubject = sectionData[day]?.[period_no];
      if (selectedSubject) {
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
      toast.error(
        `Subject already selected in another section for ${day}, Period ${period_no}.`
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

  // Render the rows for the table
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
            const highlightClass = isSelectedInOtherSection ? "bg-red-100" : "";

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
// Common table compoentn code working but if one you select then in other section you can't select it again
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

//   const activeTabData = tabs.find((tab) => tab.id === activeTab);
//   const classId = activeTabData?.class_id;
//   const sectionId = activeTabData?.section_id;
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
//   const handleSubjectChange = (day, period_no, selectedSubject) => {
//     if (!classId || !sectionId) return;
//     const currentSelectedSubject = localSelectedSubjects?.[day]?.[period_no];

//     // If subject is selected in another section, prevent selection
//     if (
//       selectedSubject.id &&
//       isAnySubjectAlreadySelectedInOtherSection(day, period_no)
//     ) {
//       toast.error(
//         `Subject already selected in another section for ${day}, Period ${period_no}.`
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

//   // Render the rows for the table
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
//             const isSelectedInOtherSection = isAnySubjectAlreadySelectedInOtherSection(day, rowIndex + 1);
//             const highlightClass = isSelectedInOtherSection ? "bg-red-100" : "";

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
//                   disabled={usedPeriods >= allocatedPeriods && !selectedPeriod?.id} // Disable if used periods match allocated periods and subject is not already selected
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
