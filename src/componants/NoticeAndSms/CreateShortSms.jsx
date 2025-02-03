// import { useState, useEffect } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import "bootstrap/dist/css/bootstrap.min.css";
// import { RxCross1 } from "react-icons/rx";
// const CreateShortSMS = () => {
//   const API_URL = import.meta.env.VITE_API_URL; // URL for host

//   const [divisionError, setDivisionError] = useState("");

//   const [allClasses, setAllClasses] = useState([]);
//   const [subject, setSubject] = useState("");
//   const [noticeDesc, setNoticeDesc] = useState("");
//   const [selectedClasses, setSelectedClasses] = useState([]);
//   const [subjectError, setSubjectError] = useState("");
//   const [noticeDescError, setNoticeDescError] = useState("");
//   const [classError, setClassError] = useState("");

//   // Handle division checkbox change
//   useEffect(() => {
//     fetchClassNames();
//   }, []);

//   const fetchClassNames = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(`${API_URL}/api/getClassList`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (Array.isArray(response.data)) {
//         setAllClasses(response.data);
//       } else {
//         setDivisionError("Unexpected data format");
//       }
//     } catch (error) {
//       console.error("Error fetching class names:", error);
//       setDivisionError("Error fetching class names");
//     }
//   };

//   // Handle checkbox toggle
//   const handleClassChange = (classId) => {
//     if (selectedClasses.includes(classId)) {
//       setSelectedClasses(selectedClasses.filter((id) => id !== classId));
//     } else {
//       setSelectedClasses([...selectedClasses, classId]);
//     }
//   };

//   // Select/Deselect all classes
//   const handleSelectAllClasses = () => {
//     if (selectedClasses.length === allClasses.length) {
//       setSelectedClasses([]); // Deselect all
//     } else {
//       setSelectedClasses(allClasses.map((cls) => cls.class_id)); // Select all
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setSubject("");
//     setNoticeDesc("");
//     setSelectedClasses([]);
//     setSubjectError("");
//     setNoticeDescError("");
//     setClassError("");
//   };

//   // Handle form submission
//   const handleSubmit = async (isPublish = false) => {
//     let hasError = false;

//     if (!subject.trim()) {
//       setSubjectError("Subject is required.");
//       hasError = true;
//     } else {
//       setSubjectError("");
//     }

//     if (!noticeDesc.trim()) {
//       setNoticeDescError("Notice description is required.");
//       hasError = true;
//     } else {
//       setNoticeDescError("");
//     }

//     if (selectedClasses.length === 0) {
//       setClassError("Please select at least one class.");
//       hasError = true;
//     } else {
//       setClassError("");
//     }

//     if (hasError) return;

//     const apiEndpoint = isPublish ? "save_publish_smsnotice" : "save_smsnotice";

//     try {
//       const token = localStorage.getItem("authToken");

//       if (!token) throw new Error("No authentication token found");

//       const response = await axios.post(
//         `${API_URL}/api/${apiEndpoint}`,
//         {
//           subject,
//           notice_desc: noticeDesc,
//           checkbxevent: selectedClasses,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             // "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.status === 200) {
//         toast.success(
//           isPublish
//             ? "Notice saved and published!"
//             : "Notice saved successfully!"
//         );
//         resetForm();
//       } else {
//         toast.error("Unexpected server response.");
//       }
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || "Error while saving the notice."
//       );
//     }
//   };

//   return (
//     <div>
//       <ToastContainer />

//       <div className="container mb-4">
//         <div className="card-header flex justify-between items-center"></div>
//         <div className="w-full mx-auto">
//           <div className="container mt-4">
//             <div className="card mx-auto lg:w-full shadow-lg">
//               <div className="p-2 px-3 bg-gray-100 border-none flex justify-between items-center">
//                 <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl">
//                   Create Short SMS
//                 </h3>
//                 <RxCross1
//                   className="text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
//                   type="button"
//                 />
//               </div>
//               <div
//                 className="relative mb-3 h-1 w-[97%] mx-auto"
//                 style={{ backgroundColor: "#C03078" }}
//               ></div>
//               <div className="card-body w-full ml-2">
//                 <div className="lg:overflow-x-hidden">
//                   <div className="mb-6 flex flex-col md:flex-row gap-x-4">
//                     <h5 className="px-2 lg:px-3 py-2 text-[1em] text-gray-700">
//                       Select Class <span className="text-red-500">*</span>
//                     </h5>
//                     <div className="  w-full md:w-[66%] relative left-0 md:left-7 mt-2 grid grid-cols-4 sm:grid-cols-3 lg:grid-cols-6 gap-2  ">
//                       {allClasses.map((cls) => (
//                         <div
//                           key={cls.class_id}
//                           className="flex items-center space-x-2 hover:cursor-pointer"
//                           onClick={() => handleClassChange(cls.class_id)}
//                         >
//                           <input
//                             type="checkbox"
//                             checked={selectedClasses.includes(cls.class_id)}
//                             onChange={() => handleClassChange(cls.class_id)}
//                             className="cursor-pointer"
//                           />
//                           <label className="cursor-pointer">{cls.name}</label>
//                         </div>
//                       ))}
//                       <div className="flex items-center space-x-2">
//                         <label className="cursor-pointer flex items-center space-x-2">
//                           <input
//                             type="checkbox"
//                             checked={
//                               selectedClasses.length === allClasses.length
//                             }
//                             onChange={handleSelectAllClasses}
//                             className="cursor-pointer"
//                           />
//                           <span>Select All</span>
//                         </label>
//                       </div>
//                       {classError && (
//                         <p className="relative top-2 col-span-3  text-red-500 text-sm mt-1 ">
//                           {classError}
//                         </p>
//                       )}
//                     </div>
//                   </div>{" "}
//                   {/* {classError && (
//                     <p className="relative left-[15%] text-red-500 text-sm mt-2 block border-3">
//                       {classError}
//                     </p>
//                   )} */}
//                   <div className="w-full  md:w-[58%]  mb-4 flex flex-row justify-between gap-x-2 ">
//                     <h5 className="px-2 lg:px-3 py-2 text-[1em] text-gray-700">
//                       Subject <span className="text-red-500">*</span>
//                     </h5>
//                     <div className="w-full md:w-[70%] flex flex-col gap-0 ">
//                       <input
//                         type="text"
//                         className=" px-2 py-1 border border-gray-700 rounded-md shadow-md  "
//                         value={subject}
//                         onChange={(e) => setSubject(e.target.value)}
//                       />
//                       {subjectError && (
//                         <p className="text-red-500 text-sm h-3">
//                           {subjectError}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                   <div className="w-full  md:w-[58%]  mb-4 flex flex-row justify-between gap-x-2 ">
//                     <h5 className="px-2 mt-2 lg:px-3 py-2 text-[1em] text-gray-700">
//                       Description <span className="text-red-500">*</span>
//                     </h5>
//                     <div className="w-full md:w-[70%] flex flex-col gap-0 ">
//                       <p className="font-light">Dear Parent,</p>
//                       <textarea
//                         className="relative -top-4 px-2 py-1 border border-gray-700 rounded-md shadow-md  "
//                         rows="2"
//                         value={noticeDesc}
//                         onChange={(e) => setNoticeDesc(e.target.value)}
//                       />
//                       {noticeDescError && (
//                         <p className="h-3 relative -top-3 text-red-500 text-sm mt-2">
//                           {noticeDescError}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex  space-x-2 justify-end m-4">
//                 <button
//                   onClick={() => handleSubmit(false)}
//                   className="btn btn-primary"
//                 >
//                   Save
//                 </button>
//                 <button
//                   onClick={() => handleSubmit(true)}
//                   className=" btn btn-primary"
//                 >
//                   Save & Publish
//                 </button>
//                 <button
//                   onClick={resetForm}
//                   className="btn btn-danger bg-gray-500 text-white rounded-md hover:bg-gray-600"
//                 >
//                   Reset
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateShortSMS;

import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoaderStyle from "../../componants/common/LoaderFinal/LoaderStyle";

import "bootstrap/dist/css/bootstrap.min.css";
import { RxCross1 } from "react-icons/rx";

const CreateShortSMS = () => {
  const API_URL = import.meta.env.VITE_API_URL; // URL for host

  const [loading, setLoading] = useState(false); // Loader state
  const [divisionError, setDivisionError] = useState("");
  const [allClasses, setAllClasses] = useState([]);
  const [subject, setSubject] = useState("");
  const [noticeDesc, setNoticeDesc] = useState("");
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [subjectError, setSubjectError] = useState("");
  const [noticeDescError, setNoticeDescError] = useState("");
  const [classError, setClassError] = useState("");

  // Handle division checkbox change
  useEffect(() => {
    fetchClassNames();
  }, []);

  const fetchClassNames = async () => {
    setLoading(true); // Start loader
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/getClassList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(response.data)) {
        setAllClasses(response.data);
      } else {
        setDivisionError("Unexpected data format");
      }
    } catch (error) {
      console.error("Error fetching class names:", error);
      setDivisionError("Error fetching class names");
    } finally {
      setLoading(false); // Stop loader
    }
  };

  // Handle checkbox toggle
  const handleClassChange = (classId) => {
    if (selectedClasses.includes(classId)) {
      setSelectedClasses(selectedClasses.filter((id) => id !== classId));
    } else {
      setSelectedClasses([...selectedClasses, classId]);
    }
  };

  // Select/Deselect all classes
  const handleSelectAllClasses = () => {
    if (selectedClasses.length === allClasses.length) {
      setSelectedClasses([]); // Deselect all
    } else {
      setSelectedClasses(allClasses.map((cls) => cls.class_id)); // Select all
    }
  };

  // Reset form
  const resetForm = () => {
    setSubject("");
    setNoticeDesc("");
    setSelectedClasses([]);
    setSubjectError("");
    setNoticeDescError("");
    setClassError("");
  };

  // Handle form submission
  const handleSubmit = async (isPublish = false) => {
    let hasError = false;

    if (!subject.trim()) {
      setSubjectError("Subject is required.");
      hasError = true;
    } else {
      setSubjectError("");
    }

    if (!noticeDesc.trim()) {
      setNoticeDescError("Notice description is required.");
      hasError = true;
    } else {
      setNoticeDescError("");
    }

    if (selectedClasses.length === 0) {
      setClassError("Please select at least one class.");
      hasError = true;
    } else {
      setClassError("");
    }

    if (hasError) return;

    const apiEndpoint = isPublish ? "save_publish_smsnotice" : "save_smsnotice";

    setLoading(true); // Start loader
    try {
      const token = localStorage.getItem("authToken");

      if (!token) throw new Error("No authentication token found");

      const response = await axios.post(
        `${API_URL}/api/${apiEndpoint}`,
        {
          subject,
          notice_desc: noticeDesc,
          checkbxevent: selectedClasses,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(
          isPublish
            ? "Notice saved and published!"
            : "Notice saved successfully!"
        );
        resetForm();
      } else {
        toast.error("Unexpected server response.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error while saving the notice."
      );
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <div>
      <ToastContainer />

      <div className="container mb-4">
        <div className="card-header flex justify-between items-center"></div>
        <div className="w-full mx-auto">
          <div className="container mt-4">
            <div className="card mx-auto lg:w-full shadow-lg">
              <div className="p-2 px-3 bg-gray-100 border-none flex justify-between items-center">
                <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl">
                  Create Short SMS
                </h3>
                {/* <RxCross1
                  className="text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                  type="button"
                /> */}
              </div>
              <div
                className="relative mb-3 h-1 w-[97%] mx-auto"
                style={{ backgroundColor: "#C03078" }}
              ></div>
              <div className="card-body w-full ml-2">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <LoaderStyle />
                  </div>
                ) : (
                  <div className="lg:overflow-x-hidden">
                    <div className="card-body w-full ml-2">
                      <div className="lg:overflow-x-hidden">
                        <div className="mb-6 flex flex-col md:flex-row gap-x-4">
                          <h5 className="px-2 lg:px-3 py-2 text-[1em] text-gray-700">
                            Select Class <span className="text-red-500">*</span>
                          </h5>
                          <div className="  w-full md:w-[66%] relative left-0 md:left-7 mt-2 grid grid-cols-4 sm:grid-cols-3 lg:grid-cols-6 gap-2  ">
                            {allClasses.map((cls) => (
                              <div
                                key={cls.class_id}
                                className="flex items-center space-x-2 hover:cursor-pointer"
                                onClick={() => handleClassChange(cls.class_id)}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedClasses.includes(
                                    cls.class_id
                                  )}
                                  onChange={() =>
                                    handleClassChange(cls.class_id)
                                  }
                                  className="cursor-pointer"
                                />
                                <label className="cursor-pointer">
                                  {cls.name}
                                </label>
                              </div>
                            ))}
                            <div className="flex items-center space-x-2">
                              <label className="cursor-pointer flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={
                                    selectedClasses.length === allClasses.length
                                  }
                                  onChange={handleSelectAllClasses}
                                  className="cursor-pointer"
                                />
                                <span>Select All</span>
                              </label>
                            </div>
                            {classError && (
                              <p className="relative top-2 col-span-3  text-red-500 text-sm mt-1 ">
                                {classError}
                              </p>
                            )}
                          </div>
                        </div>{" "}
                        {/* {classError && (
                    <p className="relative left-[15%] text-red-500 text-sm mt-2 block border-3">
                      {classError}
                    </p>
                  )} */}
                        <div className="w-full  md:w-[58%]  mb-4 flex flex-row justify-between gap-x-2 ">
                          <h5 className="px-2 lg:px-3 py-2 text-[1em] text-gray-700">
                            Subject <span className="text-red-500">*</span>
                          </h5>
                          <div className="w-full md:w-[70%] flex flex-col gap-0 ">
                            <input
                              type="text"
                              className=" px-2 py-1 border border-gray-700 rounded-md shadow-md  "
                              value={subject}
                              onChange={(e) => setSubject(e.target.value)}
                            />
                            {subjectError && (
                              <p className="text-red-500 text-sm h-3">
                                {subjectError}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="w-full  md:w-[58%]  mb-4 flex flex-row justify-between gap-x-2 ">
                          <h5 className="px-2 mt-2 lg:px-3 py-2 text-[1em] text-gray-700">
                            Description <span className="text-red-500">*</span>
                          </h5>
                          <div className="w-full md:w-[70%] flex flex-col gap-0 ">
                            <p className="font-light">Dear Parent,</p>
                            <textarea
                              className="relative -top-4 px-2 py-1 border border-gray-700 rounded-md shadow-md  "
                              rows="2"
                              value={noticeDesc}
                              onChange={(e) => setNoticeDesc(e.target.value)}
                            />
                            {noticeDescError && (
                              <p className="h-3 relative -top-3 text-red-500 text-sm mt-2">
                                {noticeDescError}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {!loading && (
                <div className="flex space-x-2 justify-end m-4">
                  <button
                    onClick={() => handleSubmit(false)}
                    className="btn btn-primary"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleSubmit(true)}
                    className="btn btn-primary"
                  >
                    Save & Publish
                  </button>
                  <button
                    onClick={resetForm}
                    className="btn btn-danger bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateShortSMS;
