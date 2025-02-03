// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Select from "react-select";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

// const AllotMarksHeadingTab = () => {
//   const API_URL = import.meta.env.VITE_API_URL;

//   const [classes, setClasses] = useState([]);
//   const [exams, setExams] = useState([]);
//   const [subjects, setSubjects] = useState([]);

//   const [selectedClass, setSelectedClass] = useState(null);
//   const [selectedExam, setSelectedExam] = useState(null);
//   const [selectedSubject, setSelectedSubject] = useState(null);

//   const [marksHeadingsData, setMarksHeadingsData] = useState([]);

//   const [classError, setClassError] = useState("");
//   const [examError, setExamError] = useState("");
//   const [subjectError, setSubjectError] = useState("");
//   const [marksHeadingError, setMarksHeadingError] = useState("");
//   const [highestMarksError, setHighestMarksError] = useState([]);
//   const navigate = useNavigate();
//   // Fetch class list and exams on component mount
//   useEffect(() => {
//     fetchClassNames();
//     fetchExams();
//     fetchMarksHeadings(); // Fetch marks headings on component mount
//   }, []);

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

//   const fetchExams = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(`${API_URL}/api/get_Examslist`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setExams(response?.data); // Assuming the exam list structure
//     } catch (error) {
//       toast.error("Error fetching exams");
//     }
//   };

//   const fetchMarksHeadings = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(`${API_URL}/api/get_Markheadingslist`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       // Assuming the response contains marks headings data in the desired format
//       const formattedData = response.data.map((heading) => ({
//         marks_headings_id: heading.marks_headings_id,
//         name: heading.name,
//         highest_marks: "",
//         selected: false,
//       }));
//       setMarksHeadingsData(formattedData);
//     } catch (error) {
//       toast.error("Error fetching marks headings");
//     }
//   };

//   const fetchSubjects = async (classId) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(
//         `${API_URL}/api/get_subject_Alloted_for_report_card/${classId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setSubjects(response?.data?.subjectAllotments); // Adjust based on actual API response structure
//     } catch (error) {
//       toast.error("Error fetching subjects");
//     }
//   };

//   const handleClassChange = (selectedOption) => {
//     setSelectedClass(selectedOption);
//     setClassError("");
//     setSelectedSubject(null); // Reset subject
//     fetchSubjects(selectedOption.value);
//   };

//   const handleExamChange = (selectedOption) => {
//     setSelectedExam(selectedOption);
//     setExamError("");
//   };

//   const handleSubjectChange = (selectedOption) => {
//     setSelectedSubject(selectedOption);
//     setSubjectError("");
//   };

//   const handleMarksHeadingChange = (index) => {
//     const updatedMarksHeadings = [...marksHeadingsData];
//     updatedMarksHeadings[index].selected =
//       !updatedMarksHeadings[index].selected;
//     setMarksHeadingsData(updatedMarksHeadings);
//     setMarksHeadingError("");
//   };

//   // const handleHighestMarksChange = (index, newMarks) => {

//   //   const updatedMarksHeadings = [...marksHeadingsData];
//   //   updatedMarksHeadings[index].highest_marks = newMarks;
//   //   setMarksHeadingsData(updatedMarksHeadings);

//   //   const updatedMarksErrors = [...highestMarksError];
//   //   updatedMarksErrors[index] = ""; // Clear any existing error when input is provided
//   //   setHighestMarksError(updatedMarksErrors);
//   // };

//   // const handleSave = async () => {
//   //   let hasError = false;

//   //   // Validate form fields
//   //   if (!selectedClass) {
//   //     setClassError("Please select a class.");
//   //     hasError = true;
//   //   }
//   //   if (!selectedExam) {
//   //     setExamError("Please select an exam.");
//   //     hasError = true;
//   //   }
//   //   if (!selectedSubject) {
//   //     setSubjectError("Please select a subject.");
//   //     hasError = true;
//   //   }

//   //   // Validate marks headings
//   //   const selectedHeadings = marksHeadingsData.filter(
//   //     (heading) => heading.selected
//   //   );
//   //   if (selectedHeadings.length === 0) {
//   //     setMarksHeadingError("Please select at least one marks heading.");
//   //     hasError = true;
//   //   }

//   //   // Validate highest marks for selected headings
//   //   const marksErrors = [];
//   //   selectedHeadings.forEach((heading, index) => {
//   //     if (!heading.highest_marks) {
//   //       marksErrors[index] = "Highest marks is required.";
//   //       hasError = true;
//   //     }
//   //   });
//   //   setHighestMarksError(marksErrors);

//   //   if (hasError) return;

//   //   // Prepare data to send to API
//   //   const marksData = selectedHeadings.map((heading) => ({
//   //     marks_heading_id: heading.marks_headings_id,
//   //     highest_marks: heading.highest_marks,
//   //   }));

//   //   try {
//   //     const token = localStorage.getItem("authToken");
//   //     await axios.post(
//   //       `${API_URL}/api/saveMarksHeadings`,
//   //       {
//   //         class_id: selectedClass.value,
//   //         exam_id: selectedExam.value,
//   //         subject_id: selectedSubject.value,
//   //         marks: marksData,
//   //       },
//   //       {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       }
//   //     );

//   //     toast.success("Marks headings saved successfully");
//   //     // Reset the form
//   //     setSelectedClass(null);
//   //     setSelectedExam(null);
//   //     setSelectedSubject(null);
//   //     setMarksHeadingsData(
//   //       marksHeadingsData.map((heading) => ({
//   //         ...heading,
//   //         selected: false,
//   //         highest_marks: "",
//   //       }))
//   //     );
//   //   } catch (error) {
//   //     toast.error("Error saving marks headings");
//   //   }
//   // };

//   const handleHighestMarksChange = (index, newMarks, marks_headings_id) => {
//     const updatedMarksHeadings = [...marksHeadingsData];
//     updatedMarksHeadings[index].highest_marks = newMarks;
//     setMarksHeadingsData(updatedMarksHeadings);

//     // Clear error for the specific marks_headings_id when input is provided
//     const updatedMarksErrors = { ...highestMarksError };
//     updatedMarksErrors[marks_headings_id] = ""; // Clear error for this specific id
//     setHighestMarksError(updatedMarksErrors);
//   };

//   const handleSave = async () => {
//     let hasError = false;

//     // Validate form fields
//     if (!selectedClass) {
//       setClassError("Please select a class.");
//       hasError = true;
//     }
//     if (!selectedExam) {
//       setExamError("Please select an exam.");
//       hasError = true;
//     }
//     if (!selectedSubject) {
//       setSubjectError("Please select a subject.");
//       hasError = true;
//     }

//     // Validate marks headings
//     const selectedHeadings = marksHeadingsData.filter(
//       (heading) => heading.selected
//     );
//     if (selectedHeadings.length === 0) {
//       setMarksHeadingError("Please select at least one marks heading.");
//       hasError = true;
//     }

//     // Validate highest marks for selected headings
//     const marksErrors = { ...highestMarksError }; // Store errors by marks_headings_id
//     selectedHeadings.forEach((heading) => {
//       if (!heading.highest_marks || heading.highest_marks.trim() === "") {
//         marksErrors[heading.marks_headings_id] = "Highest marks is required.";
//         hasError = true;
//       } else {
//         marksErrors[heading.marks_headings_id] = ""; // Clear error if valid
//       }
//     });
//     setHighestMarksError(marksErrors);

//     if (hasError) return;

//     // Prepare data to send to API
//     const marksData = selectedHeadings.map((heading) => ({
//       marks_heading_id: heading.marks_headings_id,
//       highest_marks: heading.highest_marks,
//     }));

//     try {
//       const token = localStorage.getItem("authToken");
//       await axios.post(
//         `${API_URL}/api/save_AllotMarkheadings`,
//         {
//           class_id: selectedClass.value,
//           exam_id: selectedExam.value,
//           subject_id: selectedSubject.value,
//           highest_marks_allocation: marksData,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       toast.success("Allot Marks headings saved successfully");
//       // Reset the form
//       setSelectedClass(null);
//       setSelectedExam(null);
//       setSelectedSubject(null);
//       setMarksHeadingsData(
//         marksHeadingsData.map((heading) => ({
//           ...heading,
//           selected: false,
//           highest_marks: "",
//         }))
//       );
//       // navigate("/allotMarksHeading"); // Replace '/your-target-route' with the desired route
//     } catch (error) {
//       toast.error("Error saving Allot Marks headings");
//     }
//   };

//   return (
//     <div>
//       <ToastContainer />
//       <div className="container mt-4">
//         <div className="card mx-auto lg:w-full shadow-lg">
//           <div className="p-2 px-3 bg-gray-100 flex justify-between items-center">
//             <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
//               Allot Mark Headings
//             </h3>
//           </div>
//           <div
//             className="relative -top-2 mb-3 h-1 w-[97%] mx-auto"
//             style={{ backgroundColor: "#C03078" }}
//           ></div>
//           <div className="card-body w-full md:w-[85%] mx-auto">
//             {/* Select Class */}
//             <div className="form-group flex justify-center gap-x-1 md:gap-x-6">
//               <label className="w-1/4 pt-2 text-center font-semibold text-gray-700">
//                 Select Class <span className="text-red-500">*</span>
//               </label>
//               <div className="w-full relative">
//                 <Select
//                   value={selectedClass}
//                   onChange={handleClassChange}
//                   placeholder="Select"
//                   className="w-full md:w-[50%]  "
//                   isClearable
//                   options={classes.map((classObj) => ({
//                     value: classObj.class_id,
//                     label: classObj.name,
//                   }))}
//                 />
//                 {classError && (
//                   <p className="relative  -mb-3 text-red-500 text-sm">
//                     {classError}
//                   </p>
//                 )}
//               </div>
//             </div>
//             {/* Select Subject */}
//             <div className="form-group flex justify-center gap-x-1 md:gap-x-6 mt-4">
//               <label className="w-1/4 pt-2 text-center font-semibold text-gray-700">
//                 Select Subject <span className="text-red-500">*</span>
//               </label>
//               <div className="w-full relative">
//                 <Select
//                   value={selectedSubject}
//                   onChange={handleSubjectChange}
//                   placeholder="Select"
//                   className="w-full md:w-[50%] "
//                   isClearable
//                   options={subjects.map((subject) => ({
//                     value: subject?.sub_rc_master_id,
//                     label: subject?.get_subjects_for_report_card?.name,
//                   }))}
//                 />
//                 {subjectError && (
//                   <p className="relative  -mb-3 text-red-500 text-sm">
//                     {subjectError}
//                   </p>
//                 )}
//               </div>
//             </div>
//             {/* Select Exam */}
//             <div className="form-group flex justify-center gap-x-1 md:gap-x-6 mt-4">
//               <label className="w-1/4 pt-2 text-center font-semibold text-gray-700">
//                 Select Exam <span className="text-red-500">*</span>
//               </label>
//               <div className="w-full relative">
//                 <Select
//                   value={selectedExam}
//                   onChange={handleExamChange}
//                   placeholder="Select"
//                   className="w-full md:w-[50%] "
//                   isClearable
//                   options={exams.map((exam) => ({
//                     value: exam.exam_id,
//                     label: exam.name,
//                   }))}
//                 />
//                 {examError && (
//                   <p className="relative  -mb-3 text-red-500 text-sm">
//                     {examError}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Marks Headings */}
//             <div className="mt-4 shadow-md  w-full md:w-[60%] ml-0 md:ml-4">
//               <div className="w-full overflow-x-auto">
//                 {/* Sticky Header */}
//                 <div className="w-full sticky top-0 bg-white  ">
//                   <div className="grid grid-cols-2 text-start ">
//                     <h6 className="text-gray-700 font-semibold py-2  pl-2">
//                       Marks Headings <span className="text-red-500">*</span>
//                     </h6>
//                     <h6 className="text-gray-700 font-semibold py-2 text-center pr-4">
//                       Highest Marks <span className="text-red-500">*</span>
//                     </h6>
//                   </div>
//                 </div>

//                 {/* Scrollable Content */}
//                 {marksHeadingsData.length > 0 ? (
//                   <div className="max-h-64 overflow-y-auto">
//                     {marksHeadingsData.map((heading, index) => (
//                       <div
//                         key={heading.marks_headings_id}
//                         className="grid grid-cols-2 w-full text-center py-2"
//                       >
//                         <div className="flex items-center justify-start px-2">
//                           {/* Checkbox with consistent alignment */}
//                           <input
//                             type="checkbox"
//                             checked={heading.selected}
//                             onChange={() => handleMarksHeadingChange(index)}
//                             className="mr-2"
//                           />
//                           {/* Toggle checkbox when clicking on the label */}
//                           <label
//                             onClick={() => handleMarksHeadingChange(index)}
//                             className="cursor-pointer"
//                           >
//                             {heading.name}
//                           </label>
//                         </div>

//                         <div>
//                           <input
//                             type="text"
//                             maxLength={3}
//                             value={heading.highest_marks}
//                             onChange={(e) => {
//                               const value = e.target.value;
//                               // Allow only positive integers
//                               if (/^\d*$/.test(value)) {
//                                 handleHighestMarksChange(
//                                   index,
//                                   value,
//                                   heading.marks_headings_id
//                                 );
//                               }
//                             }}
//                             disabled={!heading.selected}
//                             placeholder="Highest marks"
//                             className={`border p-1 bg-gray-100 shadow-md rounded w-full md:w-1/2 text-start ${
//                               highestMarksError[heading.marks_headings_id]
//                                 ? "border-red-500"
//                                 : ""
//                             }`}
//                           />
//                           {/* Individual error message for each input based on marks_headings_id */}
//                           {highestMarksError[heading.marks_headings_id] && (
//                             <p className="h-1 text-red-500 text-xs">
//                               {highestMarksError[heading.marks_headings_id]}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-center text-blue-600">
//                     No marks headings available
//                   </p>
//                 )}

//                 {marksHeadingError && (
//                   <p className=" text-center text-red-500 text-xs">
//                     {marksHeadingError}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Save Button  */}
//             <div className=" flex float-end mt-6">
//               <button
//                 onClick={handleSave}
//                 className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
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

// export default AllotMarksHeadingTab;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import Loader from "../common/LoaderFinal/LoaderStyle";
import LoadingSpinner from "../common/LoadingSpinner";
import { FiLoader } from "react-icons/fi";
import { LuLoader2 } from "react-icons/lu";

const AllotMarksHeadingTab = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [classes, setClasses] = useState([]);
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [marksHeadingsData, setMarksHeadingsData] = useState([]);

  const [classError, setClassError] = useState("");
  const [examError, setExamError] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [marksHeadingError, setMarksHeadingError] = useState("");
  const [highestMarksError, setHighestMarksError] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  // Fetch class list and exams on component mount
  useEffect(() => {
    fetchClassNames();
    fetchExams();
    fetchMarksHeadings(); // Fetch marks headings on component mount
  }, []);

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

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/get_Examslist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExams(response?.data); // Assuming the exam list structure
    } catch (error) {
      toast.error("Error fetching exams");
    }
  };

  const fetchMarksHeadings = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/get_Markheadingslist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Assuming the response contains marks headings data in the desired format
      const formattedData = response.data.map((heading) => ({
        marks_headings_id: heading.marks_headings_id,
        name: heading.name,
        highest_marks: "",
        selected: false,
      }));
      setMarksHeadingsData(formattedData);
    } catch (error) {
      toast.error("Error fetching marks headings");
    }
  };

  const fetchSubjects = async (classId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/get_subject_Alloted_for_report_card/${classId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSubjects(response?.data?.subjectAllotments); // Adjust based on actual API response structure
    } catch (error) {
      toast.error("Error fetching subjects");
    }
  };

  const fetchHighestMarks = async (classId, examId, subjectId) => {
    try {
      const token = localStorage.getItem("authToken");

      // Directly include classId, examId, and subjectId in the URL
      const response = await axios.get(
        `${API_URL}/api/get_markheadingsForClassSubExam/${classId}/${examId}/${subjectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const highestMarksAllocation = response.data;
      console.log("highestMarksAllocation", highestMarksAllocation);

      // Map the fetched highest marks to existing marksHeadingsData
      const updatedMarksHeadingsData = marksHeadingsData.map((heading) => {
        const matchedHeading = highestMarksAllocation.find(
          (hm) => hm.marks_headings_id === heading.marks_headings_id
        );
        return {
          ...heading,
          highest_marks: matchedHeading ? matchedHeading.highest_marks : "",
          selected: !!matchedHeading, // Pre-check the checkbox if it exists in the response
        };
      });

      setMarksHeadingsData(updatedMarksHeadingsData);
      if (marksHeadingsData) {
        setMarksHeadingError("");
      }
    } catch (error) {
      toast.error("Error fetching highest marks");
    }
  };
  // const fetchHighestMarks = async (classId, examId, subjectId) => {
  //   try {
  //     const token = localStorage.getItem("authToken");

  //     // Directly include classId, examId, and subjectId in the URL
  //     const response = await axios.get(
  //       `${API_URL}/api/get_markheadingsForClassSubExam/${classId}/${examId}/${subjectId}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     const highestMarksAllocation = response.data;
  //     console.log("the preselected data", response);

  //     // Map the fetched highest marks to existing marksHeadingsData
  //     const updatedMarksHeadingsData = marksHeadingsData.map((heading) => {
  //       const matchedHeading = highestMarksAllocation.find(
  //         (hm) => hm.marks_heading_id === heading.marks_headings_id
  //       );
  //       return {
  //         ...heading,
  //         highest_marks: matchedHeading ? matchedHeading.highest_marks : "",
  //       };
  //     });

  //     setMarksHeadingsData(updatedMarksHeadingsData);
  //   } catch (error) {
  //     toast.error("Error fetching highest marks");
  //   }
  // };

  const handleClassChange = (selectedOption) => {
    setSelectedClass(selectedOption);
    setClassError("");
    setSelectedSubject(null); // Reset subject
    fetchSubjects(selectedOption.value);
  };

  const handleExamChange = (selectedOption) => {
    setSelectedExam(selectedOption);
    setExamError("");
    if (selectedClass && selectedSubject && selectedOption) {
      fetchHighestMarks(
        selectedClass.value,
        selectedSubject.value,
        selectedOption.value
      );
    }
  };

  // const handleSubjectChange = (selectedOption) => {
  //   setSelectedSubject(selectedOption);
  //   setSubjectError("");
  // };

  const handleSubjectChange = (selectedOption) => {
    setSelectedSubject(selectedOption);
    setSubjectError("");
    if (selectedClass && selectedExam && selectedOption) {
      fetchHighestMarks(
        selectedClass.value,
        selectedExam.value,
        selectedOption.value
      );
    }
  };

  const handleMarksHeadingChange = (index) => {
    const updatedMarksHeadings = [...marksHeadingsData];
    updatedMarksHeadings[index].selected =
      !updatedMarksHeadings[index].selected;

    // Optionally clear the highest_marks when unchecking
    if (!updatedMarksHeadings[index].selected) {
      updatedMarksHeadings[index].highest_marks = ""; // Clear marks when unchecked
    }

    setMarksHeadingsData(updatedMarksHeadings);
    setMarksHeadingError("");
  };
  // const handleMarksHeadingChange = (index) => {
  //   const updatedMarksHeadings = [...marksHeadingsData];
  //   updatedMarksHeadings[index].selected =
  //     !updatedMarksHeadings[index].selected;
  //   setMarksHeadingsData(updatedMarksHeadings);
  //   setMarksHeadingError("");
  // };

  // const handleHighestMarksChange = (index, newMarks) => {

  //   const updatedMarksHeadings = [...marksHeadingsData];
  //   updatedMarksHeadings[index].highest_marks = newMarks;
  //   setMarksHeadingsData(updatedMarksHeadings);

  //   const updatedMarksErrors = [...highestMarksError];
  //   updatedMarksErrors[index] = ""; // Clear any existing error when input is provided
  //   setHighestMarksError(updatedMarksErrors);
  // };

  // const handleSave = async () => {
  //   let hasError = false;

  //   // Validate form fields
  //   if (!selectedClass) {
  //     setClassError("Please select a class.");
  //     hasError = true;
  //   }
  //   if (!selectedExam) {
  //     setExamError("Please select an exam.");
  //     hasError = true;
  //   }
  //   if (!selectedSubject) {
  //     setSubjectError("Please select a subject.");
  //     hasError = true;
  //   }

  //   // Validate marks headings
  //   const selectedHeadings = marksHeadingsData.filter(
  //     (heading) => heading.selected
  //   );
  //   if (selectedHeadings.length === 0) {
  //     setMarksHeadingError("Please select at least one marks heading.");
  //     hasError = true;
  //   }

  //   // Validate highest marks for selected headings
  //   const marksErrors = [];
  //   selectedHeadings.forEach((heading, index) => {
  //     if (!heading.highest_marks) {
  //       marksErrors[index] = "Highest marks is required.";
  //       hasError = true;
  //     }
  //   });
  //   setHighestMarksError(marksErrors);

  //   if (hasError) return;

  //   // Prepare data to send to API
  //   const marksData = selectedHeadings.map((heading) => ({
  //     marks_heading_id: heading.marks_headings_id,
  //     highest_marks: heading.highest_marks,
  //   }));

  //   try {
  //     const token = localStorage.getItem("authToken");
  //     await axios.post(
  //       `${API_URL}/api/saveMarksHeadings`,
  //       {
  //         class_id: selectedClass.value,
  //         exam_id: selectedExam.value,
  //         subject_id: selectedSubject.value,
  //         marks: marksData,
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     toast.success("Marks headings saved successfully");
  //     // Reset the form
  //     setSelectedClass(null);
  //     setSelectedExam(null);
  //     setSelectedSubject(null);
  //     setMarksHeadingsData(
  //       marksHeadingsData.map((heading) => ({
  //         ...heading,
  //         selected: false,
  //         highest_marks: "",
  //       }))
  //     );
  //   } catch (error) {
  //     toast.error("Error saving marks headings");
  //   }
  // };

  const handleHighestMarksChange = (index, newMarks, marks_headings_id) => {
    const updatedMarksHeadings = [...marksHeadingsData];
    updatedMarksHeadings[index].highest_marks = newMarks;
    setMarksHeadingsData(updatedMarksHeadings);

    // Clear error for the specific marks_headings_id when input is provided
    const updatedMarksErrors = { ...highestMarksError };
    updatedMarksErrors[marks_headings_id] = ""; // Clear error for this specific id
    setHighestMarksError(updatedMarksErrors);
  };

  const handleSave = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    let hasError = false;

    // Validate form fields
    if (!selectedClass) {
      setClassError("Please select a class.");
      hasError = true;
    }
    if (!selectedExam) {
      setExamError("Please select an exam.");
      hasError = true;
    }
    if (!selectedSubject) {
      setSubjectError("Please select a subject.");
      hasError = true;
    }

    // Validate marks headings
    const selectedHeadings = marksHeadingsData.filter(
      (heading) => heading.selected
    );
    if (selectedHeadings.length === 0) {
      setMarksHeadingError("Please select at least one marks heading.");
      hasError = true;
    }

    // Validate highest marks for selected headings
    const marksErrors = { ...highestMarksError }; // Store errors by marks_headings_id
    selectedHeadings.forEach((heading) => {
      if (!heading.highest_marks) {
        marksErrors[heading.marks_headings_id] = "Highest marks is required.";
        hasError = true;
      } else {
        marksErrors[heading.marks_headings_id] = ""; // Clear error if valid
      }
    });
    setHighestMarksError(marksErrors);

    if (hasError) {
      setIsSubmitting(false);

      return;
    }

    // Prepare data to send to API
    const marksData = selectedHeadings.map((heading) => ({
      marks_heading_id: heading.marks_headings_id,
      highest_marks: heading.highest_marks,
    }));

    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${API_URL}/api/save_AllotMarkheadings`,
        {
          class_id: selectedClass.value,
          exam_id: selectedExam.value,
          subject_id: selectedSubject.value,
          highest_marks_allocation: marksData,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Allot Marks headings saved successfully");
      // Reset the form
      setSelectedClass(null);
      setSelectedExam(null);
      setSelectedSubject(null);
      setMarksHeadingsData(
        marksHeadingsData.map((heading) => ({
          ...heading,
          selected: false,
          highest_marks: "",
        }))
      );
      // navigate("/allotMarksHeading"); // Replace '/your-target-route' with the desired route
    } catch (error) {
      toast.error("Error saving Allot Marks headings");
    } finally {
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
              Allot Mark Headings
            </h3>
          </div>
          <div
            className="relative -top-2 mb-3 h-1 w-[97%] mx-auto"
            style={{ backgroundColor: "#C03078" }}
          ></div>
          <div className="card-body w-full md:w-[85%] mx-auto">
            {/* Select Class */}
            {isSubmitting ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50  z-10">
                <Loader /> {/* Replace this with your loader component */}
              </div>
            ) : (
              <>
                <div className="pr-0 md:pr-6 ">
                  <div className="form-group flex justify-center gap-x-1 md:gap-x-8">
                    <label className="w-1/4 pt-2 text-center font-semibold text-gray-700">
                      Select Class <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full relative">
                      <Select
                        value={selectedClass}
                        onChange={handleClassChange}
                        placeholder="Select"
                        className="w-full md:w-[50%]  "
                        isClearable
                        options={classes.map((classObj) => ({
                          value: classObj.class_id,
                          label: classObj.name,
                        }))}
                      />
                      {classError && (
                        <p className="relative  -mb-3 text-red-500 text-sm">
                          {classError}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Select Subject */}
                  <div className="form-group pl-1.5 flex justify-center gap-x-1 md:gap-x-6 mt-4">
                    <label className="w-1/4  pt-2 text-center font-semibold text-gray-700">
                      Select Subject <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full relative">
                      <Select
                        value={selectedSubject}
                        onChange={handleSubjectChange}
                        placeholder="Select"
                        className="w-full md:w-[50%] "
                        isClearable
                        options={subjects.map((subject) => ({
                          value: subject?.sub_rc_master_id,
                          label: subject?.get_subjects_for_report_card?.name,
                        }))}
                      />
                      {subjectError && (
                        <p className="relative  -mb-3 text-red-500 text-sm">
                          {subjectError}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Select Exam */}
                  <div className="form-group flex justify-center gap-x-1 md:gap-x-8 mt-4">
                    <label className="w-1/4 pt-2 text-center font-semibold text-gray-700">
                      Select Exam <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full relative">
                      <Select
                        value={selectedExam}
                        onChange={handleExamChange}
                        placeholder="Select"
                        className="w-full md:w-[50%] "
                        isClearable
                        options={exams.map((exam) => ({
                          value: exam.exam_id,
                          label: exam.name,
                        }))}
                      />
                      {examError && (
                        <p className="relative  -mb-3 text-red-500 text-sm">
                          {examError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {/* Marks Headings */}
                <div className="mt-4 shadow-md  w-full md:w-[60%] ml-0 md:ml-4">
                  <div className="w-full overflow-x-auto">
                    {/* Sticky Header */}
                    <div className="w-full sticky top-0 bg-white  ">
                      <div className="grid grid-cols-2 text-start ">
                        <h6 className="text-gray-700 font-semibold py-2  pl-2">
                          Marks Headings <span className="text-red-500">*</span>
                        </h6>
                        <h6 className="text-gray-700 font-semibold py-2 text-center pr-4">
                          Highest Marks <span className="text-red-500">*</span>
                        </h6>
                      </div>
                    </div>

                    {/* Scrollable Content */}
                    {marksHeadingsData.length > 0 ? (
                      <div className="max-h-64 overflow-y-auto">
                        {marksHeadingsData.map((heading, index) => (
                          <div
                            key={heading.marks_headings_id}
                            className="grid grid-cols-2 w-full text-center py-2"
                          >
                            <div className="flex items-center justify-start px-2">
                              {/* Checkbox with consistent alignment */}
                              <input
                                type="checkbox"
                                checked={heading.selected}
                                onChange={() => handleMarksHeadingChange(index)}
                                className="mr-2"
                              />
                              {/* Toggle checkbox when clicking on the label */}
                              <label
                                onClick={() => handleMarksHeadingChange(index)}
                                className="cursor-pointer"
                              >
                                {heading.name}
                              </label>
                            </div>

                            <div>
                              <input
                                type="text"
                                maxLength={3}
                                value={heading.highest_marks}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  // Allow only positive integers
                                  if (/^\d*$/.test(value)) {
                                    handleHighestMarksChange(
                                      index,
                                      value,
                                      heading.marks_headings_id
                                    );
                                  }
                                }}
                                disabled={!heading.selected}
                                placeholder="Highest marks"
                                className={`border p-1 bg-gray-100 shadow-md rounded w-full md:w-1/2 text-start ${
                                  highestMarksError[heading.marks_headings_id]
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              {/* Individual error message for each input based on marks_headings_id */}
                              {highestMarksError[heading.marks_headings_id] && (
                                <p className="h-1 text-red-500 text-xs">
                                  {highestMarksError[heading.marks_headings_id]}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-blue-600">
                        <div className="  bg-gray-100 text-black py-8 inset-0 flex items-center justify-center  z-10">
                          <LoadingSpinner />{" "}
                          {/* Replace this with your loader component */}
                        </div>{" "}
                      </p>
                    )}

                    {marksHeadingError && (
                      <p className=" text-center text-red-500 text-xs">
                        {marksHeadingError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Save Button  */}
                <div className=" flex float-end mt-6">
                  <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllotMarksHeadingTab;
