// import { useState, useEffect } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate, useLocation } from "react-router-dom";
// import { RxCross1 } from "react-icons/rx";
// import Loader from "../../common/LoaderFinal/LoaderStyle";

// const EditExamTimeTable = () => {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const location = useLocation();
//   const { staff } = location.state || {};
//   console.log("staff", staff);

//   const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

//   const [loading, setLoading] = useState(false);
//   const [description, setDescription] = useState("");

//   const navigate = useNavigate();
//   const [errors, setErrors] = useState({});
//   // State for loading indicators
//   const [subjects, setSubjects] = useState([]);
//   const [timetable, setTimetable] = useState([]);

//   const [schedule, setSchedule] = useState(
//     timetable.map((row) => ({
//       ...row,
//       errors: { noSubject: false, missingOption: false }, // Initialize error state for each row
//     }))
//   );
//   console.log("scheduleerror", schedule);
//   const updatedErrors = [...schedule]; // Clone the schedule to track errors
//   updatedErrors.forEach((row) => {
//     row.errors = row.errors || { noSubject: false, missingOption: false };
//   });
//   console.log("updatedErrors", updatedErrors);
//   // Fetch exam timetable data

//   const updateTimetable = (index, field, value, subIndex = null) => {
//     const updatedTimetable = [...timetable];

//     if (field === "subjects" && subIndex !== null) {
//       updatedTimetable[index].subjects[subIndex] = value;
//       if (value !== "") {
//         updatedTimetable[index].studyLeave = false;
//       }
//     } else if (field === "studyLeave") {
//       updatedTimetable[index].studyLeave = value;
//       if (value) {
//         updatedTimetable[index].subjects = Array(4).fill("");
//         updatedTimetable[index].option = "Select";
//       }
//     } else {
//       updatedTimetable[index][field] = value;
//     }

//     setTimetable(updatedTimetable);
//   };

//   const resetTimetable = () => {
//     setTimetable(
//       timetable.map((row) => ({
//         ...row,
//         subjects: Array(4).fill(""),
//         option: "Select",
//         studyLeave: false,
//       }))
//     );
//     setDescription("");
//   };

//   const prepareData = () => {
//     const preparedData = {
//       description: description, // Assuming `description` is the state variable for the input field
//       data: timetable.map((row, rowIndex) => {
//         // Prepare each row object for submission
//         const subjects = [];

//         row.subjects.forEach((subject, subIndex) => {
//           // Map the subjects to the array
//           subjects[subIndex] = /^\d+$/.test(subject) ? subject : "";
//         });

//         return {
//           date: row.date,
//           option: row.option || "Select", // Default to "Select" if no option is chosen
//           studyLeave: row.studyLeave ? "1" : "", // If study leave is true, set to "1"
//           subjects: subjects, // Array of subjects
//         };
//       }),
//     };
//     console.log("preparedData", preparedData);
//     return preparedData;
//   };

//   const handleSubmit = async () => {
//     const preparedData = prepareData(); // Prepare data for validation
//     console.log("prepareData", preparedData);
//     let hasError = false;
//     let warningRows = [];
//     let errorMessage = "";
//     let anySubjectSelected = false;

//     // Clone the schedule errors state
//     const updatedErrors = timetable.map((row) => ({
//       noSubject: false,
//       missingOption: false,
//     }));

//     timetable.forEach((row, rowIndex) => {
//       const studyLeaveKey = `study_leave${rowIndex + 1}`;
//       const optionKey = `option${rowIndex + 1}`;
//       const hasStudyLeave = preparedData.data[rowIndex].studyLeave === "1";
//       const hasSubjects = preparedData.data[rowIndex].subjects.some(
//         (subject) => subject !== ""
//       );
//       const hasMultipleSubjects =
//         preparedData.data[rowIndex].subjects.filter((subject) => subject !== "")
//           .length > 1;
//       const hasOptionSelected = preparedData.data[rowIndex].option !== "Select";

//       // Track if any subject is selected across rows
//       if (hasSubjects) {
//         anySubjectSelected = true;
//       }

//       // Validation: Multiple subjects selected but no option chosen
//       if (hasMultipleSubjects && !hasOptionSelected) {
//         updatedErrors[rowIndex].missingOption = true;
//         errorMessage = `Please select an option for multiple subjects on ${row.date}.`;
//         hasError = true;
//       }

//       // Track warning rows: No data for a row
//       if (!hasSubjects && !hasStudyLeave && !hasOptionSelected) {
//         warningRows.push(row.date);
//       }
//     });

//     // Validation: No subject selected across all rows
//     if (!anySubjectSelected) {
//       errorMessage =
//         "Please select at least one subject or mark study leave for any date.";
//       hasError = true;
//     }

//     // Update the state to reflect field-level errors
//     setSchedule(
//       schedule.map((row, index) => ({
//         ...row,
//         errors: updatedErrors[index],
//       }))
//     );

//     // Display error messages
//     if (hasError) {
//       toast.error(
//         <div>
//           <strong className="text-red-600">Error:</strong> {errorMessage}
//           <div className="text-right mt-2">
//             <button
//               className="bg-blue-500 text-[.9em] text-white px-3 py-1 rounded hover:bg-blue-700"
//               onClick={() => toast.dismiss()}
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       );
//       return;
//     }

//     // Display warning message
//     if (warningRows.length > 0) {
//       const remainingRows = warningRows.length;
//       // Disable the Submit button when warning is shown
//       setIsSubmitDisabled(true);

//       // Show a modal-like toast for confirmation
//       toast(
//         <div>
//           <strong className="text-pink-500">Warning:</strong> Data for{" "}
//           <strong>{remainingRows}</strong> rows are not filled. Do you still
//           want to save data?
//           <div className="flex justify-end gap-2 mt-2 ">
//             <button
//               className="bg-red-500 text-[.9em] text-white px-2 py-1 rounded hover:bg-red-700"
//               onClick={() => {
//                 toast.dismiss(); // Dismiss the toast
//                 setIsSubmitDisabled(false); // Enable the Submit button
//               }}
//             >
//               Cancel
//             </button>
//             <button
//               className="bg-green-500 text-[.9em] text-white px-2 py-1 rounded hover:bg-green-700"
//               onClick={() => {
//                 toast.dismiss(); // Dismiss the toast
//                 setIsSubmitDisabled(false); // Enable the Submit button
//                 submitData(preparedData); // Call the function to submit data
//               }}
//             >
//               Confirm
//             </button>
//           </div>
//         </div>,
//         {
//           autoClose: false, // Prevent auto-dismiss
//           closeButton: false, // Remove the cross button
//           onClose: () => {
//             // Ensure `setIsSubmitDisabled(false)` runs if the toast is closed manually
//             setIsSubmitDisabled(false);
//           },
//         }
//       );

//       return;
//     }

//     // If no errors or warnings, submit data
//     submitData(preparedData);
//   };

//   // Separate function to handle data submission
//   const submitData = async (preparedData) => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.put(
//         `${API_URL}/api/update_examtimetable/${staff?.exam_tt_id}`, // Use PUT for updating data
//         preparedData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       toast.success("Exam Time Table updated successfully!");
//       setLoading(false);

//       // Navigate to /examTimeTable after a slight delay
//       setTimeout(() => {
//         navigate("/examTimeTable");
//       }, 500);
//     } catch (error) {
//       toast.error("Error updating Exam Time Table.");
//       console.error(error);
//       setLoading(false);
//     }
//   };

//   console.log("timetable", timetable);
//   return (
//     <div className="w-full md:w-[80%] mx-auto p-4 ">
//       <ToastContainer />
//       <div className="card p-4 rounded-md ">
//         <div className=" card-header mb-4 flex justify-between items-center ">
//           <h5 className="text-gray-700 mt-1 text-md lg:text-lg">
//             Edit Exam Timetable
//           </h5>

//           <RxCross1
//             className="float-end relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
//             onClick={() => {
//               setErrors({});
//               navigate("/examTImeTable");
//             }}
//           />
//         </div>
//         <div
//           className=" relative w-full   -top-6 h-1  mx-auto bg-red-700"
//           style={{
//             backgroundColor: "#C03078",
//           }}
//         ></div>
//         {/* Search Section */}
//         <div className="w-full  text-sm md:text-[1.4em] text-opacity-90 font-semibold text-blue-700  flex flex-row justify-center items-center">
//           Timetable of <span className="px-1 md:px-2">{staff?.examname}</span> (
//           Class{" "}
//           <span className="text-pink-500 px-1 md:px-2 ">{staff?.name}</span> )
//         </div>
//         {/* Form Section - Displayed when parentInformation is fetched */}
//         {/* // Render the table */}
//         <>
//           <div className="w-full mx-auto py-4 px-1 md:px-4">
//             <div className="card bg-gray-100 py-2 px-3 rounded-md">
//               <div className="overflow-x-auto">
//                 <table className="table-auto mt-4 w-full border-collapse border bg-gray-50 border-gray-300">
//                   <thead>
//                     <tr className="bg-gray-200">
//                       <th className="border p-2 font-semibold text-center">
//                         Date
//                       </th>
//                       {[1, 2, 3, 4].map((i) => (
//                         <th
//                           key={`subject${i}`}
//                           className="border p-2 font-semibold text-center"
//                         >
//                           Subject {i}
//                         </th>
//                       ))}
//                       <th className="border p-2 font-semibold text-center">
//                         Option
//                       </th>
//                       <th className="border p-2 font-semibold text-center">
//                         Study Leave
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {loading ? (
//                       <div className="absolute inset-0 flex items-center justify-center bg-gray-50  z-10">
//                         <Loader />{" "}
//                         {/* Replace this with your loader component */}
//                       </div>
//                     ) : (
//                       timetable.map((row, index) => (
//                         <tr key={index}>
//                           <td className="border p-2 text-center">{row.date}</td>
//                           {row.subjects.map((subject, subIndex) => (
//                             <td className="border p-2" key={subIndex}>
//                               <select
//                                 className="w-full border p-1"
//                                 value={subject || ""} // Prefill with the existing subject value
//                                 onChange={(e) =>
//                                   updateTimetable(
//                                     index,
//                                     "subjects",
//                                     e.target.value,
//                                     subIndex
//                                   )
//                                 }
//                               >
//                                 <option value="">Select</option>
//                                 {subjects.map((sub) => (
//                                   <option
//                                     key={sub.sub_rc_master_id}
//                                     value={sub.sub_rc_master_id}
//                                   >
//                                     {sub.name}
//                                   </option>
//                                 ))}
//                               </select>
//                               {/* Optional: Show an error if no subject is selected */}
//                               {row.errors?.noSubject && (
//                                 <span className="text-red-500 text-xs">
//                                   Subject is required
//                                 </span>
//                               )}
//                             </td>
//                           ))}

//                           <td className="border p-2">
//                             <select
//                               className="w-full border p-1"
//                               value={row.option}
//                               onChange={(e) =>
//                                 updateTimetable(index, "option", e.target.value)
//                               }
//                             >
//                               <option value="Select">Select</option>
//                               <option value="A">AND</option>
//                               <option value="O">OR</option>
//                             </select>
//                           </td>
//                           <td className="w-full md:w-[11%] border py-2 text-center">
//                             <input
//                               type="checkbox"
//                               checked={row.studyLeave === 1} // Check if studyLeave is '1'
//                               className="shadow-md w-4 h-4"
//                               onChange={(e) =>
//                                 updateTimetable(
//                                   index,
//                                   "studyLeave",
//                                   e.target.checked ? 1 : "" // Set to '1' if checked, empty string if unchecked
//                                 )
//                               }
//                             />
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//               <div className="mt-4 ml-0 md:ml-5 flex flex-row gap-x-4">
//                 <label
//                   htmlFor="description"
//                   className="block font-semibold text-[1em] mb-2 text-gray-700"
//                 >
//                   Description:
//                 </label>
//                 <textarea
//                   type="text"
//                   id="description"
//                   maxLength={500}
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   className="border-1 border-gray-300 p-2 w-[50%] shadow-md mb-2"
//                 />
//               </div>
//               <div className="my-4 flex flex-col md:flex-row gap-2 justify-center md:justify-end">
//                 <button
//                   onClick={resetTimetable}
//                   className={`bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700`}
//                 >
//                   Reset
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleSubmit}
//                   className={`bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded ${
//                     isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""
//                   }`}
//                   disabled={isSubmitDisabled}
//                 >
//                   Submit
//                 </button>
//               </div>
//             </div>
//           </div>
//         </>
//       </div>
//     </div>
//   );
// };

// export default EditExamTimeTable;

import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import Loader from "../../common/LoaderFinal/LoaderStyle";

const EditExamTimeTable = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const location = useLocation();
  const { staff } = location.state || {};
  console.log("staff", staff);

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  // State for loading indicators
  const [subjects, setSubjects] = useState([]);
  const [timetable, setTimetable] = useState([]);

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
  // Fetch exam timetable data
  useEffect(() => {
    const fetchTimetableData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${API_URL}/api/get_examtimetable/${staff?.exam_tt_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response?.data?.data) {
          const data = response.data.data;

          if (data.length === 0) {
            toast.error("Date is not available for this timetable.");
            setTimetable([]); // Clear timetable to avoid incorrect rendering
            setDescription(""); // Clear description
            return;
          }

          setTimetable(
            data.map((row) => ({
              date: row.date,
              subjects: [...row.subject_rc_id, "", "", ""].slice(0, 4), // Ensure 4 subject slots
              option: row.option || "Select",
              studyLeave: row.study_leave,
            }))
          );

          setDescription(response.data[0]?.description || "");
        }

        fetchSubjects();
      } catch (error) {
        console.error("Error fetching timetable data:", error);
        toast.error("An error occurred while fetching timetable data.");
      } finally {
        setLoading(false);
      }
    };

    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${API_URL}/api/get_subjectsofallstudents/${staff?.class_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSubjects(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchTimetableData();
  }, [API_URL, staff]);

  const updateTimetable = (index, field, value, subIndex = null) => {
    const updatedTimetable = [...timetable];

    if (field === "subjects" && subIndex !== null) {
      updatedTimetable[index].subjects[subIndex] = value;
      if (value !== "") {
        updatedTimetable[index].studyLeave = false;
      }
    } else if (field === "studyLeave") {
      updatedTimetable[index].studyLeave = value;
      if (value) {
        updatedTimetable[index].subjects = Array(4).fill("");
        updatedTimetable[index].option = "Select";
      }
    } else {
      updatedTimetable[index][field] = value;
    }

    setTimetable(updatedTimetable);
  };

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

  const prepareData = () => {
    const preparedData = {
      description: description, // Assuming `description` is the state variable for the input field
      data: timetable.map((row, rowIndex) => {
        // Prepare each row object for submission
        const subjects = [];

        row.subjects.forEach((subject, subIndex) => {
          // Map the subjects to the array
          subjects[subIndex] = /^\d+$/.test(subject) ? subject : "";
        });

        return {
          date: row.date,
          option: row.option || "Select", // Default to "Select" if no option is chosen
          studyLeave: row.studyLeave ? "1" : "", // If study leave is true, set to "1"
          subjects: subjects, // Array of subjects
        };
      }),
    };
    console.log("preparedData", preparedData);
    return preparedData;
  };

  // const handleSubmit = async () => {
  //   const preparedData = prepareData(); // Prepare data for validation
  //   console.log("prepareData", preparedData);
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
  //     const hasStudyLeave = preparedData.data[rowIndex].studyLeave === "1";
  //     const hasSubjects = preparedData.data[rowIndex].subjects.some(
  //       (subject) => subject !== ""
  //     );
  //     const hasMultipleSubjects =
  //       preparedData.data[rowIndex].subjects.filter((subject) => subject !== "")
  //         .length > 1;
  //     const hasOptionSelected = preparedData.data[rowIndex].option !== "Select";

  //     // Track if any subject is selected across rows
  //     if (hasSubjects) {
  //       anySubjectSelected = true;
  //     }

  //     // Validation: Multiple subjects selected but no option chosen
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

  //   // Validation: No subject selected across all rows
  //   if (!anySubjectSelected) {
  //     errorMessage =
  //       "Please select at least one subject or mark study leave for any date.";
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
  //         <strong>{remainingRows}</strong> rows are not filled. Do you still
  //         want to save data?
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
  //               setIsSubmitDisabled(false); // Enable the Submit button
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

  // working 100% but warning message wrong

  const handleSubmit = async () => {
    const preparedData = prepareData(); // Prepare data for validation
    console.log("prepareData", preparedData);
    let hasError = false;
    let warningRows = [];
    let errorMessage = "";
    let anySubjectSelected = false;

    // Clone the schedule errors state
    const updatedErrors = timetable.map((row) => ({
      noSubject: false,
      missingOption: false,
    }));

    timetable.forEach((row, rowIndex) => {
      const hasSubjects = preparedData.data[rowIndex].subjects.some(
        (subject) => subject !== ""
      );
      const hasStudyLeave = preparedData.data[rowIndex].studyLeave === "1";

      const subjectCount = preparedData.data[rowIndex].subjects.filter(
        (subject) => subject !== ""
      ).length;
      const option = preparedData.data[rowIndex].option;
      const hasOptionSelected = option !== "Select";

      // Track if any subject is selected across rows
      if (hasSubjects) {
        anySubjectSelected = true;
      }

      // Validation: Option selected but no subjects
      if (hasOptionSelected && !hasSubjects) {
        updatedErrors[rowIndex].noSubject = true;
        errorMessage = `Please select at least one subject for ${row.date}.`;
        hasError = true;
      }

      // Validation: "AND" or "OR" selected but fewer than two subjects
      if (["A", "O"].includes(option) && subjectCount < 2) {
        updatedErrors[rowIndex].noSubject = true;
        errorMessage = `Please select at least two subjects for ${
          row.date
        } when Select option  ${option === "A" ? "AND" : "OR"}.`;

        hasError = true;
      }

      // Track warning rows: No data for a row
      if (!hasSubjects && !hasStudyLeave && !hasOptionSelected) {
        warningRows.push(row.date);
      }
    });

    // Validation: No subject selected across all rows
    if (!anySubjectSelected) {
      errorMessage =
        "Please select at least one subject or mark study leave for any date.";
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
    console.log("waringRows", warningRows);
    // Display warning message
    if (warningRows.length > 0) {
      const remainingRows = warningRows.length;
      // Disable the Submit button when warning is shown
      setIsSubmitDisabled(true);

      // Show a modal-like toast for confirmation
      toast(
        <div>
          <strong className="text-pink-500">Warning:</strong> Data for{" "}
          <strong>{remainingRows}</strong> rows are not filled. Do you still
          want to save data?
          <div className="flex justify-end gap-2 mt-2 ">
            <button
              className="bg-red-500 text-[.9em] text-white px-2 py-1 rounded hover:bg-red-700"
              onClick={() => {
                toast.dismiss(); // Dismiss the toast
                setIsSubmitDisabled(false); // Enable the Submit button
              }}
            >
              Cancel
            </button>
            <button
              className="bg-green-500 text-[.9em] text-white px-2 py-1 rounded hover:bg-green-700"
              onClick={() => {
                toast.dismiss(); // Dismiss the toast
                setIsSubmitDisabled(false); // Enable the Submit button
                submitData(preparedData); // Call the function to submit data
              }}
            >
              Confirm
            </button>
          </div>
        </div>,
        {
          autoClose: false, // Prevent auto-dismiss
          closeButton: false, // Remove the cross button
          onClose: () => {
            // Ensure `setIsSubmitDisabled(false)` runs if the toast is closed manually
            setIsSubmitDisabled(false);
          },
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
      const response = await axios.put(
        `${API_URL}/api/update_examtimetable/${staff?.exam_tt_id}`, // Use PUT for updating data
        preparedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Exam Time Table updated successfully!");
      setLoading(false);

      // Navigate to /examTimeTable after a slight delay
      setTimeout(() => {
        navigate("/exam_TImeTable");
      }, 500);
    } catch (error) {
      toast.error("Error updating Exam Time Table.");
      console.error(error);
      setLoading(false);
    }
  };

  console.log("timetable", timetable);
  return (
    <div className="w-full md:w-[80%] mx-auto p-4 ">
      <ToastContainer />
      <div className="card p-4 rounded-md ">
        <div className=" card-header mb-4 flex justify-between items-center ">
          <h5 className="text-gray-700 mt-1 text-md lg:text-lg">
            Edit Exam Timetable
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
        <div className="w-full  text-sm md:text-[1.4em] text-opacity-90 font-semibold text-blue-700  flex flex-row justify-center items-center">
          Timetable of <span className="px-1 md:px-2">{staff?.examname}</span> (
          Class{" "}
          <span className="text-pink-500 px-1 md:px-2 ">{staff?.name}</span> )
        </div>
        {/* Form Section - Displayed when parentInformation is fetched */}
        {/* // Render the table */}
        <>
          <div className="w-full mx-auto py-4 px-1 md:px-4">
            <div className="card bg-gray-100 py-2 px-3 rounded-md">
              <div className="overflow-x-auto">
                <table className="table-auto mt-4 w-full border-collapse border bg-gray-50 border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2 font-semibold text-center">
                        Date
                      </th>
                      {[1, 2, 3, 4].map((i) => (
                        <th
                          key={`subject${i}`}
                          className="border p-2 font-semibold text-center"
                        >
                          Subject {i}
                        </th>
                      ))}
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
                                className="w-full border p-1"
                                value={subject || ""} // Prefill with the existing subject value
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
                              {/* Optional: Show an error if no subject is selected */}
                              {row.errors?.noSubject && (
                                <span className="text-red-500 text-xs">
                                  Subject is required
                                </span>
                              )}
                            </td>
                          ))}

                          <td className="border p-2">
                            <select
                              className="w-full border p-1"
                              value={row.option}
                              onChange={(e) =>
                                updateTimetable(index, "option", e.target.value)
                              }
                            >
                              <option value="Select">Select</option>
                              <option value="A">AND</option>
                              <option value="O">OR</option>
                            </select>
                          </td>
                          <td className="w-full md:w-[11%] border py-2 text-center">
                            <input
                              type="checkbox"
                              checked={row.studyLeave === 1} // Check if studyLeave is '1'
                              className="shadow-md w-4 h-4"
                              onChange={(e) =>
                                updateTimetable(
                                  index,
                                  "studyLeave",
                                  e.target.checked ? 1 : "" // Set to '1' if checked, empty string if unchecked
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent the default behavior of Enter key
                      const cursorPos = e.target.selectionStart; // Current cursor position
                      const textBeforeCursor = description.slice(0, cursorPos); // Text before the cursor is:

                      const textAfterCursor = description.slice(cursorPos); // Text after the cursor
                      const updatedText = `${textBeforeCursor}\n• ${textAfterCursor}`;
                      setDescription(updatedText);
                      // Move the cursor to the position after the bullet point
                      setTimeout(() => {
                        e.target.selectionStart = e.target.selectionEnd =
                          cursorPos + 3;
                      }, 0);
                    }
                  }}
                  className="border-1 border-gray-300 p-2 w-[50%] shadow-md mb-2"
                />
              </div>
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
        </>
      </div>
    </div>
  );
};

export default EditExamTimeTable;
