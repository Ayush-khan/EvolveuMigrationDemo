// import { useState, useEffect } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { RxCross1 } from "react-icons/rx";

// const CreateNotice = () => {
//   const API_URL = import.meta.env.VITE_API_URL; // URL for host

//   const [allClasses, setAllClasses] = useState([]);
//   const [subject, setSubject] = useState("");
//   const [noticeDesc, setNoticeDesc] = useState("");
//   const [selectedClasses, setSelectedClasses] = useState([]);
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const [errors, setErrors] = useState({
//     subjectError: "",
//     noticeDescError: "",
//     classError: "",
//   });

//   useEffect(() => {
//     fetchClassNames();
//   }, []);

//   const fetchClassNames = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.get(`${API_URL}/api/getClassList`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAllClasses(response.data || []);
//     } catch (error) {
//       toast.error("Error fetching class names");
//     }
//   };

//   const handleClassChange = (classId) => {
//     if (selectedClasses.includes(classId)) {
//       setSelectedClasses(selectedClasses.filter((id) => id !== classId));
//     } else {
//       setSelectedClasses([...selectedClasses, classId]);
//     }
//   };

//   const handleSelectAllClasses = () => {
//     if (selectedClasses.length === allClasses.length) {
//       setSelectedClasses([]);
//     } else {
//       setSelectedClasses(allClasses.map((cls) => cls.class_id));
//     }
//   };

//   const handleFileUpload = (event) => {
//     const files = Array.from(event.target.files);
//     setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
//   };

//   const removeFile = (index) => {
//     setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
//   };

//   const validateForm = () => {
//     const newErrors = {
//       subjectError: subject.trim() ? "" : "Subject is required.",
//       noticeDescError: noticeDesc.trim()
//         ? ""
//         : "Notice description is required.",
//       classError: selectedClasses.length
//         ? ""
//         : "Please select at least one class.",
//     };

//     setErrors(newErrors);
//     return !Object.values(newErrors).some((error) => error);
//   };

//   const resetForm = () => {
//     setSubject("");
//     setNoticeDesc("");
//     setSelectedClasses([]);
//     setUploadedFiles([]);
//     setErrors({});
//   };

//   const handleSubmit = async (isPublish = false) => {
//     if (!validateForm()) return;

//     const formData = new FormData();
//     formData.append("subject", subject);
//     formData.append("notice_desc", noticeDesc);
//     selectedClasses.forEach((classId) =>
//       formData.append("checkbxevent[]", classId)
//     );
//     uploadedFiles.forEach((file) => formData.append("userfile[]", file));

//     const apiEndpoint = isPublish
//       ? "save_publishnoticesmspdf"
//       : "save_noticesmspdf";

//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await axios.post(
//         `${API_URL}/api/${apiEndpoint}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
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
//                   Create Notice
//                 </h3>
//                 <RxCross1
//                   className="text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
//                   type="button"
//                 />
//               </div>

//               <div className="card-body w-full ml-2">
//                 <div className="lg:overflow-x-hidden">
//                   {/* Class Selection */}
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
//                       </div>{" "}
//                       {errors.classError && (
//                         <p className="relative top-2 col-span-3 text-red-500">
//                           {errors.classError}
//                         </p>
//                       )}
//                     </div>
//                   </div>{" "}
//                   {/* Subject */}
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
//                       {errors.subjectError && (
//                         <p className="text-red-500">{errors.subjectError}</p>
//                       )}
//                     </div>
//                   </div>
//                   {/* Notice Description */}
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
//                       {errors.noticeDescError && (
//                         <p className="relative -top-4 text-red-500">
//                           {errors.noticeDescError}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                   .{/* File Upload */}
//                   <div className="w-full relative -top-14 md:w-[58%]  flex flex-row justify-between gap-x-2 ">
//                     <h5 className="px-2 mt-2 lg:px-3 py-2 text-[1em] text-gray-700">
//                       Upload Files
//                     </h5>
//                     <input
//                       className="mt-3 relative right-0 md:right-[28%] text-xs bg-gray-50 "
//                       type="file"
//                       multiple
//                       onChange={handleFileUpload}
//                     />
//                   </div>
//                   <h5 className="relative -top-9 text-[1em] text-gray-700 px-2">
//                     Attachment:
//                   </h5>
//                   <div className="  -top-16 w-full md:w-[57%] mx-auto relative right-0 md:right-10">
//                     <div className=" text-xs flex flex-col">
//                       {uploadedFiles.map((file, index) => (
//                         <div
//                           key={index}
//                           className="flex items-center space-x-2 space-y-3"
//                         >
//                           <span className="bg-gray-100 border-1 p-0.5 shadow-sm">
//                             {file.name}
//                           </span>
//                           <RxCross1
//                             className="text-xl relative -top-1 w-4 h-4 text-red-600 hover:cursor-pointer hover:bg-red-100"
//                             type="button"
//                             onClick={() => removeFile(index)}
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                   {/* Buttons */}
//                   <div className="flex  space-x-2 justify-end m-4">
//                     <button
//                       onClick={() => handleSubmit(false)}
//                       className="btn btn-primary"
//                     >
//                       Save
//                     </button>
//                     <button
//                       onClick={() => handleSubmit(true)}
//                       className=" btn btn-primary"
//                     >
//                       Save & Publish
//                     </button>
//                     <button
//                       onClick={resetForm}
//                       className="btn btn-danger bg-gray-500 text-white rounded-md hover:bg-gray-600"
//                     >
//                       Reset
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateNotice;

import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { RxCross1 } from "react-icons/rx";
// import Loader from "../components/Loader"; // Add a Loader component or use an existing one.
import LoaderStyle from "../../componants/common/LoaderFinal/LoaderStyle";

const CreateNotice = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [allClasses, setAllClasses] = useState([]);
  const [subject, setSubject] = useState("");
  const [noticeDesc, setNoticeDesc] = useState("");
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false); // Loader state
  // const [fetchingClasses, setFetchingClasses] = useState(false); // Loader for fetching classes
  const [errors, setErrors] = useState({
    subjectError: "",
    noticeDescError: "",
    classError: "",
  });

  useEffect(() => {
    fetchClassNames();
  }, []);

  const fetchClassNames = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/getClassList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllClasses(response.data || []);
    } catch (error) {
      toast.error("Error fetching class names");
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const handleClassChange = (classId) => {
    if (selectedClasses.includes(classId)) {
      setSelectedClasses(selectedClasses.filter((id) => id !== classId));
    } else {
      setSelectedClasses([...selectedClasses, classId]);
    }
  };

  const handleSelectAllClasses = () => {
    if (selectedClasses.length === allClasses.length) {
      setSelectedClasses([]);
    } else {
      setSelectedClasses(allClasses.map((cls) => cls.class_id));
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {
      subjectError: subject.trim() ? "" : "Subject is required.",
      noticeDescError: noticeDesc.trim()
        ? ""
        : "Notice description is required.",
      classError: selectedClasses.length
        ? ""
        : "Please select at least one class.",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const resetForm = () => {
    setSubject("");
    setNoticeDesc("");
    setSelectedClasses([]);
    setUploadedFiles([]);
    setErrors({});
  };

  const handleSubmit = async (isPublish = false) => {
    if (!validateForm()) return;

    setLoading(true); // Start loader
    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("notice_desc", noticeDesc);
    selectedClasses.forEach((classId) =>
      formData.append("checkbxevent[]", classId)
    );
    uploadedFiles.forEach((file) => formData.append("userfile[]", file));

    const apiEndpoint = isPublish
      ? "save_publishnoticesmspdf"
      : "save_noticesmspdf";

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${API_URL}/api/${apiEndpoint}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
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
      {/* Show loader when fetching classes */}
      {/* {fetchingClasses && <LoaderStyle />} */}
      {/* Main Content */}

      <div className="container mb-4">
        <div className="card-header flex justify-between items-center"></div>
        <div className="w-full mx-auto">
          <div className="container mt-4">
            <div className="card mx-auto lg:w-full shadow-lg">
              <div className="p-2 px-3 bg-gray-100 border-none flex justify-between items-center">
                <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl">
                  Create Notice
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
                    {/* <div className="spinner-border text-primary" role="status"> */}
                    <LoaderStyle />
                    {/* </div> */}
                  </div>
                ) : (
                  <div className="card-body w-full ml-2">
                    <div className="lg:overflow-x-hidden">
                      {/* Class Selection */}
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
                                checked={selectedClasses.includes(cls.class_id)}
                                onChange={() => handleClassChange(cls.class_id)}
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
                          </div>{" "}
                          {errors.classError && (
                            <p className="relative top-2 col-span-3 text-red-500">
                              {errors.classError}
                            </p>
                          )}
                        </div>
                      </div>{" "}
                      {/* Subject */}
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
                          {errors.subjectError && (
                            <p className="text-red-500">
                              {errors.subjectError}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Notice Description */}
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
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault(); // Prevent the default behavior of Enter key
                                const cursorPos = e.target.selectionStart; // Current cursor position
                                const textBeforeCursor = noticeDesc.slice(
                                  0,
                                  cursorPos
                                ); // Text before the cursor is:

                                const textAfterCursor =
                                  noticeDesc.slice(cursorPos); // Text after the cursor
                                const updatedText = `${textBeforeCursor}\n• ${textAfterCursor}`;
                                setNoticeDesc(updatedText);
                                // Move the cursor to the position after the bullet point
                                setTimeout(() => {
                                  e.target.selectionStart =
                                    e.target.selectionEnd = cursorPos + 3;
                                }, 0);
                              }
                            }}
                          />
                          {errors.noticeDescError && (
                            <p className="relative -top-4 text-red-500">
                              {errors.noticeDescError}
                            </p>
                          )}
                        </div>
                      </div>
                      .{/* File Upload */}
                      <div className="w-full relative -top-14 md:w-[85%]  flex flex-row justify-start gap-x-2 space-x-2 md:space-x-11 ">
                        <h5 className="px-2 mt-2 lg:px-3 py-2 text-[1em] text-nowrap text-gray-700">
                          Upload Files
                        </h5>
                        <input
                          className="mt-3 text-xs "
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                        />{" "}
                        <span className="relative right-[7%] top-5 text-pink-500 text-[.7em]">
                          (Each file must not exceed a maximum size of 2MB)
                        </span>
                      </div>
                      <h5 className="relative -top-9 text-[1em] text-gray-700 px-2">
                        Attachment:
                      </h5>
                      <div className="  -top-16 w-full md:w-[57%] mx-auto relative right-0 md:right-10">
                        <div className=" text-xs flex flex-col">
                          {uploadedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 space-y-3"
                            >
                              <span className="bg-gray-100 border-1 p-0.5 shadow-sm">
                                {file.name}
                              </span>
                              <RxCross1
                                className="text-xl relative -top-1 w-4 h-4 text-red-600 hover:cursor-pointer hover:bg-red-100"
                                type="button"
                                onClick={() => removeFile(index)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Buttons */}
                      {/* Add your form and other components here */}
                      {/* <div className="flex space-x-2 justify-end m-4">
                    <button
                      onClick={() => handleSubmit(false)}
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => handleSubmit(true)}
                      className=" btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Publishing..." : "Save & Publish"}
                    </button>
                    <button
                      onClick={resetForm}
                      className="btn btn-danger bg-gray-500 text-white rounded-md hover:bg-gray-600"
                      disabled={loading}
                    >
                      Reset
                    </button>
                  </div> */}
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

export default CreateNotice;
