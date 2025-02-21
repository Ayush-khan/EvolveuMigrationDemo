import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import { RxCross1 } from "react-icons/rx";
// import Select from "react-select";
import { IoMdSend } from "react-icons/io";

import CreateShortSMS from "./CreateShortSms";
import CreateNotice from "./CreateNotice";
// import { PiCertificateBold } from "react-icons/pi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { ImDownload } from "react-icons/im";

function NoticeAndSms() {
  const API_URL = import.meta.env.VITE_API_URL; // URL for host
  // const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("Manage");
  const [classes, setClasses] = useState([]);
  const [classesforsubjectallot, setclassesforsubjectallot] = useState([]);

  // for allot subject tab
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPublish, setShowPublishModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [currestSubjectNameForDelete, setCurrestSubjectNameForDelete] =
    useState("");

  const [newSection, setnewSectionName] = useState("");
  const [newSubject, setnewSubjectnName] = useState("");
  const [newclassnames, setnewclassnames] = useState("");
  const [teacherIdIs, setteacherIdIs] = useState("");
  const [teacherNameIs, setTeacherNameIs] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dropdownRef = useRef(null);
  //   for allot subject checkboxes

  const [error, setError] = useState(null);

  // errors messages for allot subject tab
  const [status, setStatus] = useState("All"); // For status dropdown
  const [selectedDate, setSelectedDate] = useState(""); // For date picker
  const [notices, setNotices] = useState([]); // To store fetched notices
  const [subject, setSubject] = useState("");
  const [noticeDesc, setNoticeDesc] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [noticeDescError, setNoticeDescError] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);

  // for react-search of manage tab teacher Edit and select class
  const pageSize = 10;

  useEffect(() => {
    handleSearch();
    fetchClassNamesForAllotSubject();
  }, []);

  const fetchClassNamesForAllotSubject = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/getClassList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(response.data)) {
        setclassesforsubjectallot(response.data);
        console.log(
          "this is the dropdown of the allot subject tab for class",
          response.data
        );
      } else {
        setError("Unexpected data format");
      }
    } catch (error) {
      console.error("Error fetching class names:", error);
      setError("Error fetching class names");
    }
  };

  // Listing tabs data for diffrente tabs
  // const handleSearch = async () => {
  //   try {
  //     // Get token from local storage
  //     const token = localStorage.getItem("authToken");

  //     // Prepare query parameters
  //     const params = {};
  //     if (status) params.status = status; // Include status if selected
  //     if (selectedDate) params.notice_date = selectedDate; // Include date if selected

  //     // Make API request
  //     const response = await axios.get(`${API_URL}/api/get_smsnoticelist`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //       params,
  //     });

  //     // Handle response data
  //     if (response.data?.data?.length > 0) {
  //       setNotices(response.data.data); // Update notice list with response data
  //       setPageCount(Math.ceil(response.data.data.length / pageSize));
  //     } else {
  //       setNotices([]); // Clear notices if no data
  //       toast.error("No notices found for the selected criteria.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching SMS notices:", error);
  //     toast.error("Error fetching SMS notices. Please try again.");
  //   }
  // };
  const handleSearch = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    setSearchTerm("");
    try {
      const token = localStorage.getItem("authToken");
      const params = {};
      if (status) params.status = status;
      if (selectedDate) params.notice_date = selectedDate;

      const response = await axios.get(`${API_URL}/api/get_smsnoticelist`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      if (response.data?.data?.length > 0) {
        const smscount = response.data["0"]?.smscount || {};

        const updatedNotices = response.data.data.map((notice) => {
          const count = smscount[notice.unq_id] || 0;
          return {
            ...notice,
            showSendButton: notice.publish === "Y" && count > 0,
            count,
          };
        });

        setNotices(updatedNotices); // Update the state with enriched data
        setPageCount(Math.ceil(updatedNotices.length / pageSize));
      } else {
        setNotices([]);
        toast.error("No notices found for the selected criteria.");
      }
    } catch (error) {
      console.error("Error fetching SMS notices:", error);
      toast.error("Error fetching SMS notices. Please try again.");
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
    }
  };

  // Handle tab change with explicit logic for "Manage"
  const handleTabChange = (tab) => {
    if (tab === "Manage") {
      handleSearch(); // Call handleSearch only when "Manage" tab is selected
    }
    setActiveTab(tab); // Update active tab state
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    // Handle page change logic
  };

  const fetchNoticeData = async (currentSection) => {
    const token = localStorage.getItem("authToken");

    if (!token) throw new Error("No authentication token found");

    try {
      const response = await axios.get(
        `${API_URL}/api/get_smsnoticedata/${currentSection?.unq_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { imageurl } = response.data.data;
      console.log("imageURL", imageurl);
      setImageUrls(imageurl); // Store image URLs for download links
    } catch (error) {
      console.error("Error fetching notice data:", error);
    }
  };

  const handleView = (section) => {
    console.log("view data", section);
    setCurrentSection(section);
    setnewclassnames(section?.classnames);
    setnewSectionName(section?.notice_date);
    setnewSubjectnName(section?.subject);
    setTeacherNameIs(section?.notice_desc);
    setteacherIdIs(section?.get_teacher?.teacher_id);
    setShowViewModal(true);

    if (section.notice_type === "Notice") {
      fetchNoticeData(section); // Pass the current section directly
    } else {
      setImageUrls([]); // Clear image URLs if not a notice
    }
  };
  // Function to download files
  {
    imageUrls && imageUrls.length > 0 && (
      <div className="relative mb-3 flex flex-col mx-4 gap-y-2">
        <label className="mb-2 font-bold">Attachments:</label>
        {imageUrls.map((url, index) => {
          // Extract file name from the URL
          const fileName = url.substring(url.lastIndexOf("/") + 1);
          return (
            <div
              key={index}
              className="flex flex-row text-[.6em] items-center gap-x-2"
            >
              {/* Display file name */}
              <span>{fileName}</span>
              <button
                className="text-blue-600 hover:text-blue-800 hover:bg-transparent"
                onClick={
                  () => downloadFile(url, fileName) // Pass both URL and fileName
                }
              >
                <ImDownload />
              </button>
            </div>
          );
        })}
      </div>
    );
  }

  // // Usage
  // downloadFile(fileUrl, fileName);

  // const downloadFile = async (fileUrl, fileName) => {
  //   try {
  //     const token = localStorage.getItem("authToken");

  //     if (!token) throw new Error("No authentication token found");

  //     const response = await fetch(
  //       // `https://sms.evolvu.in/storage/app/public/notice/${fileUrl}`,
  //       `${fileUrl}`,

  //       {
  //         method: "GET",
  //         headers: {
  //           // Add headers if needed, e.g., Authorization
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     // Convert the response into a Blob
  //     const blob = await response.blob();
  //     const link = document.createElement("a");
  //     link.href = URL.createObjectURL(blob); // Create a URL for the Blob
  //     link.setAttribute("download", fileName); // Set the file name for download
  //     document.body.appendChild(link); // Append the link to the DOM
  //     link.click(); // Simulate a click to download the file
  //     document.body.removeChild(link); // Remove the link from the DOM
  //   } catch (error) {
  //     console.error("Error downloading the file:", error);
  //   }
  // };

  //   const downloadFile = async (fileUrl, fileName) => {
  //     try {
  //       const token = localStorage.getItem("authToken");

  //       if (!token) throw new Error("No authentication token found");

  //       const response = await fetch(fileUrl, {
  //         method: "GET",
  //         headers: {
  //           // Add headers if needed, e.g., Authorization
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }

  //       // Convert the response into a Blob
  //       const blob = await response.blob();
  //       const link = document.createElement("a");
  //       link.href = URL.createObjectURL(blob); // Create a URL for the Blob
  //       link.setAttribute("download", fileName); // Set the file name
  //       document.body.appendChild(link); // Append the link to the DOM
  //       link.click(); // Simulate a click to download the file
  //       document.body.removeChild(link); // Remove the link from the DOM
  //     } catch (error) {
  //       console.error("Error downloading the file:", error);
  //     }
  //   };
  // const downloadFile = async (url, filename) => {
  //   try {
  //     const token = localStorage.getItem("authToken");

  //     if (!token) throw new Error("No authentication token found");
  //     console.log("fileName", filename, "FileURL", url);
  //     const response = await axios.get(
  //       url,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           // "Content-Type": "application/json",
  //         },
  //       },
  //       {
  //         responseType: "blob", // Ensures the response is treated as a binary file
  //       }
  //     );

  //     // Create a URL for the downloaded file
  //     const blob = new Blob([response.data], {
  //       type: response.headers["content-type"],
  //     });
  //     const link = document.createElement("a");
  //     link.href = URL.createObjectURL(blob);
  //     link.download = filename || "certificate.pdf"; // Default name if filename is not provided
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);

  //     // Revoke the object URL to release memory
  //     URL.revokeObjectURL(link.href);
  //   } catch (error) {
  //     console.error("Error downloading file:", error);
  //   }
  // };
  const downloadFile = (fileUrl, fileName) => {
    const baseUrl = "https://sms.evolvu.in/"; // Base URL
    const fullUrl = `${fileUrl}`; // Construct the full file URL

    // Create an anchor element
    const link = document.createElement("a");
    link.href = fullUrl; // Set the file URL
    link.target = "none"; // Open in a new tab (optional)
    link.download = fileName || "downloaded_file.pdf"; // Use the provided file name or a default name
    document.body.appendChild(link); // Append the link to the DOM

    // Trigger the click to download the file
    link.click();

    // Clean up the DOM
    document.body.removeChild(link); // Remove the link after the click
  };

  const handleDelete = (sectionId) => {
    console.log("inside delete of subjectallotmenbt____", sectionId);
    console.log("inside delete of subjectallotmenbt", classes);
    const classToDelete = notices.find((cls) => cls.unq_id === sectionId);
    // setCurrentClass(classToDelete);
    setCurrentSection({ classToDelete });
    console.log("the currecne t section", currentSection);
    setCurrestSubjectNameForDelete(currentSection?.classToDelete?.notice_type);
    console.log("cureendtsungjeg", currentSection?.classToDelete?.notice_type);
    console.log("currestSubjectNameForDelete", currestSubjectNameForDelete);
    setShowDeleteModal(true);
  };
  const [preselectedFiles, setPreselectedFiles] = useState([]); // Files fetched from API

  const handleEdit = async (section) => {
    setCurrentSection(section);
    setSubject(section?.subject || "");
    setNoticeDesc(section?.notice_desc || "");
    setnewclassnames(section?.classnames || "");
    console.log("enter notice", section);
    if (section?.notice_type === "Notice") {
      console.log("enter notice-->start");

      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found");
        }
        const response = await axios.get(
          `${API_URL}/api/get_smsnoticedata/${section.unq_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("responsedata of notice edit", response);
        if (response.data.success) {
          const noticedata = response.data.data.noticedata[0];
          const imageUrls = response.data.data.imageurl || [];

          setSubject(noticedata.subject || "");
          setNoticeDesc(noticedata.notice_desc || "");
          setnewclassnames(noticedata.classnames || "");
          setPreselectedFiles(imageUrls); // Set preselected files
        }
      } catch (error) {
        console.error("Error fetching notice data:", error);
        toast.error("Failed to fetch notice data.");
      }
    } else {
      setPreselectedFiles([]); // Clear preselected files for non-NOTICE types
    }

    setShowEditModal(true);
  };

  const handleSubmitEdit = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
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
    if (hasError) {
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token is missing");

      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("notice_desc", noticeDesc);
      // if (uploadedFiles) {
      //   uploadedFiles.forEach((file) => formData.append("userfile[]", file));
      // } else {
      //   preselectedFiles.forEach((fileUrl) =>
      //     formData.append("userfile[]", fileUrl)
      //   );
      // }
      // Append newly uploaded files
      uploadedFiles.forEach((file) => formData.append("userfile[]", file));
      console.log("filenottobedeleted[]", preselectedFiles);
      // Append preselected files (assuming preselectedFiles contains their URLs or identifiers)
      preselectedFiles.forEach((fileUrl) =>
        formData.append("filenottobedeleted[]", fileUrl)
      );

      console.log("formated data of the edit sms part", formData);
      console.log("seletd files", uploadedFiles);
      await axios.post(
        `${API_URL}/api/update_smsnotice/${currentSection?.unq_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      toast.success("Notice updated successfully!");
      handleSearch();
      handleCloseModal();
    } catch (error) {
      toast.error("Error updating notice. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
    }
  };

  const handlePublish = (section) => {
    setCurrentSection(section);
    // console.log("the currecne t section", currentSection);

    console.log("fdsfsdsd handleEdit", section);

    // It's used for the dropdown of the tachers
    setShowPublishModal(true);
  };
  const handleSubmitPublish = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    // Handle delete submission logic
    try {
      const token = localStorage.getItem("authToken");
      console.log(
        "the currecnt section inside the delte___",
        currentSection?.classToDelete?.subject_id
      );
      console.log("the classes inside the delete", classes);
      console.log(
        "the current section insde the handlesbmitdelete",
        currentSection.classToDelete
      );
      if (!token || !currentSection || !currentSection?.unq_id) {
        throw new Error("Unique ID is missing");
      }

      await axios.put(
        `${API_URL}/api/update_publishsmsnotice/${currentSection?.unq_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // fetchClassNames();
      handleSearch();

      setShowPublishModal(false);
      // setSubjects([]);
      toast.success(`${currestSubjectNameForDelete} Publish successfully!`);
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(
          `Error In Publishing ${currestSubjectNameForDelete}: ${error.response.data.message}`
        );
      } else {
        toast.error(
          `Error In Publishing ${currestSubjectNameForDelete}: ${error.message}`
        );
      }
      console.error("Error In Publishing:", error);
      // setError(error.message);
    } finally {
      setShowPublishModal(false);
      setIsSubmitting(false); // Re-enable the button after the operation
    }
  };
  const handleSubmitDelete = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    // Handle delete submission logic
    try {
      const token = localStorage.getItem("authToken");
      console.log(
        "the currecnt section inside the delte___",
        currentSection?.classToDelete?.subject_id
      );
      console.log("the classes inside the delete", classes);
      console.log(
        "the current section insde the handlesbmitdelete",
        currentSection.classToDelete
      );
      if (!token || !currentSection || !currentSection?.classToDelete?.unq_id) {
        throw new Error("Unique ID is missing");
      }

      await axios.delete(
        `${API_URL}/api/delete_smsnotice/${currentSection?.classToDelete?.unq_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // fetchClassNames();
      handleSearch();

      setShowDeleteModal(false);
      // setSubjects([]);
      toast.success(`${currestSubjectNameForDelete} Deleted successfully!`);
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(
          `Error In Deleting ${currestSubjectNameForDelete}: ${error.response.data.message}`
        );
      } else {
        toast.error(
          `Error In Deleting ${currestSubjectNameForDelete}: ${error.message}`
        );
      }
      console.error("Error In Deleting:", error);
      // setError(error.message);
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
      setShowDeleteModal(false);
    }
  };

  const handleCloseModal = () => {
    setSubject("");
    setNoticeDesc("");
    setnewclassnames("");
    setPreselectedFiles([]);
    setUploadedFiles([]);
    // removeUploadedFile;
    setShowPublishModal(false);
    setShowViewModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
  };

  const filteredSections = notices.filter((section) => {
    // Convert the fields to lowercase for case-insensitive comparison
    const teacherName = section?.classnames?.toLowerCase() || "";
    const subjectName = section?.subject?.toLowerCase() || "";
    const noticeDesc = section?.notice_type?.toLowerCase() || ""; // New field to filter
    const teacher = section?.name?.toLowerCase() || ""; // Example for teacher's name, update as needed

    // Check if the search term is present in any of the specified fields
    return (
      teacherName.includes(searchTerm.toLowerCase()) ||
      subjectName.includes(searchTerm.toLowerCase()) ||
      noticeDesc.includes(searchTerm.toLowerCase()) || // Check notice description
      teacher.includes(searchTerm.toLowerCase()) // Check teacher name
    );
  });

  const displayedSections = filteredSections.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );
  // handle allot subject close model
  //   useEffect(() => {
  //     if (activeTab === "Manage") {
  //       handleSearch();
  //     }
  //   }, [activeTab]); // Dependency array ensures it runs when activeTab changes
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };
  console.log("handleFileUpload", handleFileUpload);
  const removePreselectedFile = (index) => {
    const updatedFiles = preselectedFiles.filter((_, i) => i !== index);
    setPreselectedFiles(updatedFiles);
  };

  const removeUploadedFile = (index) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
  };

  // const handleSend = (uniqueId) => {
  //   // Logic to handle the send button click
  //   console.log(`Sending SMS for Unique ID: ${uniqueId}`);
  //   toast.success(`SMS sent for Unique ID: ${uniqueId}`);
  // };
  const handleSend = async (uniqueId) => {
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        return;
      }

      // Construct the API URL with the unique ID as a query parameter
      // const apiUrl = `http://103.159.85.174:8500/api/save_sendsms/${uniqueId}`;

      // Make the POST request
      const response = await axios.post(
        `${API_URL}/api/save_sendsms/${uniqueId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle success response
      if (response.status === 200 && response.data.success) {
        toast.success(`SMS sent successfully for Unique ID: ${uniqueId}`);
        handleSearch();
      } else {
        toast.error("Failed to send SMS. Please try again.");
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
      toast.error("An error occurred while sending SMS. Please try again.");
    }
  };

  //   This is tab
  const tabs = [
    { id: "Manage", label: "Manage" },
    { id: "CreateShortSMS", label: "Create Short SMS" },
    { id: "CreateNotice", label: "Create Notice" },
  ];

  return (
    <>
      {/* <ToastContainer /> */}
      <div className="md:mx-auto md:w-3/4 p-4 bg-white mt-4 ">
        <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
          Notice/SMS For Parents
        </h3>
        <div
          className=" relative  mb-8   h-1  mx-auto bg-red-700"
          style={{
            backgroundColor: "#C03078",
          }}
        ></div>
        {/* <hr className="relative -top-3" /> */}

        <ul className="grid grid-cols-2 gap-x-10 relative -left-6 md:left-0 md:flex md:flex-row -top-4">
          {tabs.map(({ id, label }) => (
            <li
              key={id}
              className={`md:-ml-7 shadow-md ${
                activeTab === id ? "text-blue-500 font-bold" : ""
              }`}
            >
              <button
                onClick={() => handleTabChange(id)}
                className="px-2 md:px-4 py-1 hover:bg-gray-200 text-[1em] md:text-sm text-nowrap"
                aria-current={activeTab === id ? "page" : undefined}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        <div className="bg-white  rounded-md -mt-5">
          {activeTab === "Manage" && (
            <div>
              <ToastContainer />
              <div className="mb-4">
                <div className="w-full  md:w-[78%] mt-8  gap-x-0 md:gap-x-12 mx-auto   flex flex-col gap-y-2 md:gap-y-0 md:flex-row  ">
                  <div className="w-full md:w-[50%] gap-x-14 md:gap-x-6 md:justify-start my-1 md:my-4 flex md:flex-row">
                    <label
                      className="text-md mt-1.5 mr-1 md:mr-0 w-[40%] md:w-[29%]"
                      htmlFor="classSelect"
                    >
                      Select Date
                    </label>{" "}
                    <div className="w-full md:w-[60%]">
                      <input
                        type="date"
                        id="date"
                        className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring focus:ring-indigo-200"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-[45%]  gap-x-4  justify-between  my-1 md:my-4 flex md:flex-row">
                    <label
                      className=" ml-0 md:ml-4 w-full md:w-[30%]  text-md mt-1.5 "
                      htmlFor="studentSelect"
                    >
                      Status
                    </label>{" "}
                    <div className="w-full">
                      <select
                        id="status"
                        className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring focus:ring-indigo-200"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="All">All</option>
                        <option value="Y">Publish</option>
                        <option value="N">Unpublish</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-1">
                    <button
                      onClick={handleSearch}
                      type="button"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      {isSubmitting ? "Searching..." : "Search"}
                    </button>
                  </div>
                </div>{" "}
              </div>

              <div className="container mt-4">
                <div className="card mx-auto lg:w-full shadow-lg">
                  <div className="p-2 px-3 bg-gray-100 border-none flex justify-between items-center">
                    <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
                      Manage Notice/SMS{" "}
                    </h3>
                    <div className="w-1/2 md:w-fit mr-1 ">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search "
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div
                    className=" relative w-[97%]   mb-3 h-1  mx-auto bg-red-700"
                    style={{
                      backgroundColor: "#C03078",
                    }}
                  ></div>

                  <div className="card-body w-full">
                    <div className="h-96 lg:h-96 overflow-y-scroll lg:overflow-x-hidden">
                      <table className="min-w-full leading-normal table-auto">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Sr.No
                            </th>
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Type
                            </th>
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Notice Date
                            </th>
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Subject
                            </th>{" "}
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Class{" "}
                            </th>
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Created by
                            </th>
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Edit/View
                            </th>
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Delete
                            </th>
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Publish
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayedSections.length ? (
                            displayedSections.map((subject, index) => (
                              <tr key={subject.notice_id} className="text-sm ">
                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  {currentPage * pageSize + index + 1}
                                </td>
                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  {subject?.notice_type}
                                </td>
                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  {subject?.notice_date}
                                </td>
                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  {subject?.subject}
                                </td>
                                {/* CLass Column */}
                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  <div className=" w-17  overflow-x-auto ">
                                    {subject?.classnames
                                      ?.split(",")
                                      .map((classname, idx) => (
                                        <span key={idx}>
                                          {classname.trim()}
                                          {idx <
                                            subject.classnames.split(",")
                                              .length -
                                              1 && ", "}
                                        </span>
                                      ))}
                                  </div>
                                </td>

                                {/* <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  {subject?.get_division?.name}
                                </td> */}
                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  {subject?.name}
                                </td>

                                <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                                  {subject.publish === "Y" ? (
                                    <button
                                      className="text-blue-600 hover:text-blue-800 hover:bg-transparent"
                                      onClick={() => handleView(subject)}
                                    >
                                      <MdOutlineRemoveRedEye className="font-bold text-xl" />
                                    </button>
                                  ) : (
                                    <button
                                      className="text-blue-600 hover:text-blue-800 hover:bg-transparent"
                                      onClick={() => handleEdit(subject)}
                                    >
                                      <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                  )}
                                </td>

                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  {subject.publish === "N" ? (
                                    <button
                                      onClick={() =>
                                        handleDelete(subject?.unq_id)
                                      }
                                      className="text-red-600 hover:text-red-800 hover:bg-transparent "
                                    >
                                      <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                  ) : (
                                    " "
                                  )}
                                </td>
                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  {subject.showSendButton ? (
                                    <div className="flex flex-col gap-y-0.5">
                                      <span className="text-nowrap text-red-600 font-bold">{`${subject.count}`}</span>
                                      <span className="text-bule-600 text-nowrap font-medium ">{`SMS Pending`}</span>
                                      <button
                                        className=" flex felx-row items-center justify-center p-2 gap-x-1 bg-blue-500 text-nowrap hover:bg-blue-600 text-white font-medium rounded-md"
                                        //  onClick={() => handleEdit(subject)}
                                        onClick={() =>
                                          handleSend(subject.unq_id)
                                        }
                                      >
                                        Send <IoMdSend />
                                      </button>
                                    </div>
                                  ) : (
                                    " "
                                  )}

                                  {subject.publish === "N" ? (
                                    <button
                                      onClick={() => handlePublish(subject)}
                                      className="text-green-500 hover:text-green-700 hover:bg-transparent"
                                    >
                                      <FaCheck icon={faTrash} />
                                    </button>
                                  ) : (
                                    " "
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <div className=" absolute left-[1%] w-[100%]  text-center flex justify-center items-center mt-14">
                              <div className=" text-center text-xl text-red-700">
                                Oops! No data found..
                              </div>
                            </div>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className=" flex justify-center pt-2 -mb-3">
                      <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        breakLabel={"..."}
                        pageCount={pageCount}
                        onPageChange={handlePageClick}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={1}
                        containerClassName={"pagination"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        activeClassName={"active"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs content */}

          {activeTab === "CreateShortSMS" && (
            <div>
              <CreateShortSMS />
            </div>
          )}

          {activeTab === "CreateNotice" && (
            <div>
              <CreateNotice />{" "}
            </div>
          )}
          {/* {activeTab === "AllotTeachers" && (
            <div>
              <CreateShortNotice />
            </div>
          )} */}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title">Edit Notice/SMS</h5>
                  <RxCross1
                    className="float-end relative mt-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                    type="button"
                    onClick={handleCloseModal}
                  />
                </div>
                <div
                  className="relative mb-3 h-1 w-[97%] mx-auto bg-red-700"
                  style={{ backgroundColor: "#C03078" }}
                ></div>
                <div className="modal-body">
                  <div className="relative mb-3 flex justify-center mx-4 gap-x-7">
                    <label htmlFor="className" className="w-1/2 mt-2">
                      Class:
                    </label>
                    <div
                      className="input-field block border w-full border-1 border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner break-words"
                      style={{
                        maxWidth: "262px", // Set maximum width for text wrapping
                        height: "auto", // Allow height to grow dynamically
                        wordWrap: "break-word", // Ensure text wraps within the box
                      }}
                    >
                      {newclassnames}
                    </div>
                  </div>

                  <div className="relative mb-3 flex justify-center mx-4 gap-x-7">
                    <label htmlFor="subject" className="w-1/2 mt-2">
                      Subject:
                    </label>
                    <input
                      id="subject"
                      type="text"
                      maxLength={100}
                      className="form-control shadow-md mb-2 w-full"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                    {subjectError && (
                      <p className="text-red-500 text-sm h-3">{subjectError}</p>
                    )}
                  </div>

                  <div className="relative mb-3 flex justify-center mx-4 gap-x-7">
                    <label htmlFor="noticeDesc" className="w-1/2 mt-2">
                      Description:
                    </label>
                    <textarea
                      id="noticeDesc"
                      rows="2"
                      maxLength={1000}
                      className="form-control shadow-md mb-2 w-full"
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

                          const textAfterCursor = noticeDesc.slice(cursorPos); // Text after the cursor
                          const updatedText = `${textBeforeCursor}\n• ${textAfterCursor}`;
                          setNoticeDesc(updatedText);
                          // Move the cursor to the position after the bullet point
                          setTimeout(() => {
                            e.target.selectionStart = e.target.selectionEnd =
                              cursorPos + 3;
                          }, 0);
                        }
                      }}
                    ></textarea>
                    {noticeDescError && (
                      <p className="h-3 relative -top-3 text-red-500 text-sm mt-2">
                        {noticeDescError}
                      </p>
                    )}
                  </div>

                  {currentSection?.notice_type === "Notice" && (
                    <>
                      {/* File Upload */}
                      <div className="modal-body">
                        {/* Attachments */}

                        <div className="  relative -top-5 w-full  flex flex-row justify-between gap-x-2 ">
                          <label className="px-2 mt-2 lg:px-3 py-2 ">
                            Upload Files
                          </label>
                          <input
                            className="mt-3 relative right-0 md:right-[11%] text-xs bg-gray-50 "
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                          />
                        </div>
                        <label className="px-2 block  mb-2">Attachment:</label>
                        <div className="">
                          {uploadedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-x-2"
                            >
                              <span className="bg-gray-100 border-1 text-[.8em] p-0.5 shadow-sm">
                                {file.name}
                              </span>
                              <div>
                                <RxCross1
                                  className="text-xl relative  w-4 h-4 text-red-600 hover:cursor-pointer hover:bg-red-100"
                                  type="button"
                                  onClick={() => removeUploadedFile(index)}
                                />
                              </div>
                            </div>
                          ))}

                          <div>
                            {preselectedFiles.map((url, index) => {
                              const fileName = url.substring(
                                url.lastIndexOf("/") + 1
                              );
                              return (
                                <div
                                  key={index}
                                  className="flex items-center gap-x-2"
                                >
                                  <span className="bg-gray-100 border-1 p-0.5 text-[.8em] shadow-sm">
                                    {fileName}
                                  </span>
                                  <RxCross1
                                    className=" text-xl relative - w-4 h-4 text-red-600 hover:cursor-pointer hover:bg-red-100"
                                    type="button"
                                    onClick={() => removePreselectedFile(index)}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Uploaded Files */}
                    </>
                  )}
                </div>

                <div className="flex justify-end p-3">
                  <button
                    type="button"
                    className="btn btn-primary px-3 mb-2"
                    onClick={handleSubmitEdit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title">View Notice/SMS</h5>
                  <RxCross1
                    className="float-end relative mt-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                    type="button"
                    onClick={handleCloseModal}
                  />
                </div>
                <div
                  className="relative mb-3 h-1 w-[97%] mx-auto bg-red-700"
                  style={{ backgroundColor: "#C03078" }}
                ></div>
                <div className="modal-body">
                  {/* Class */}
                  <div className="relative mb-3 flex justify-center mx-4 gap-x-7">
                    <label htmlFor="newSectionName" className="w-1/2 mt-2">
                      Class:{" "}
                    </label>

                    <div
                      className="input-field block border w-full border-1 border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner break-words"
                      style={{
                        maxWidth: "262px", // Set maximum width for text wrapping
                        height: "auto", // Allow height to grow dynamically
                        wordWrap: "break-word", // Ensure text wraps within the box
                      }}
                    >
                      {newclassnames}
                    </div>
                  </div>
                  {/* Notice Date */}
                  <div className="relative mb-3 flex justify-center mx-4 gap-x-7">
                    <label htmlFor="newSectionName" className="w-1/2 mt-2">
                      Notice Date:{" "}
                    </label>
                    <span className="input-field block border w-full border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner">
                      {newSection}
                    </span>
                  </div>
                  {/* Subject */}
                  <div className="mb-3 relative flex justify-start mx-4 gap-x-7">
                    <label htmlFor="newSectionName" className="w-1/2 mt-2">
                      Subject:{" "}
                    </label>
                    <span className="input-field block border w-full border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner">
                      {newSubject}
                    </span>
                  </div>
                  {/* Description */}
                  <div className="relative mb-3 flex justify-center mx-4 gap-x-7">
                    <label htmlFor="noticeDesc" className="w-1/2 mt-2">
                      Description:
                    </label>
                    <textarea
                      id="noticeDesc"
                      rows="2"
                      maxLength={1000}
                      readOnly
                      className="input-field block border w-full border-gray-900 rounded-md py-1 px-3 bg-gray-200 shadow-inner"
                      value={teacherNameIs}
                    ></textarea>
                  </div>

                  {/* Download Links */}
                  {/* Download Links */}

                  {imageUrls && imageUrls.length > 0 && (
                    <div className=" flex flex-row">
                      <label className=" px-4 mb-2 ">Attachments:</label>

                      <div className="relative mt-2 flex flex-col mx-4 gap-y-2">
                        {imageUrls.map((url, index) => {
                          // Extracting file name from the URL
                          const fileName = url.substring(
                            url.lastIndexOf("/") + 1
                          );
                          return (
                            <div
                              key={index}
                              className=" font-semibold flex flex-row text-[.58em]  items-center gap-x-2"
                            >
                              {/* Display file name */}
                              <span className=" ">{fileName}</span>
                              <button
                                className=" text-blue-600 hover:text-blue-800 hover:bg-transparent"
                                onClick={() => downloadFile(url, fileName)}
                              >
                                <ImDownload className="font-2xl w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <RxCross1
                    className="float-end relative mt-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                    type="button"
                    // className="btn-close text-red-600"
                    onClick={handleCloseModal}
                  />
                  {console.log(
                    "the currecnt section inside delete of the managesubjhect",
                    currentSection
                  )}
                </div>
                <div
                  className=" relative  mb-3 h-1 w-[97%] mx-auto bg-red-700"
                  style={{
                    backgroundColor: "#C03078",
                  }}
                ></div>
                <div className="modal-body">
                  Are you sure you want to delete this{" "}
                  {` ${currentSection?.classToDelete?.notice_type} `} ?
                </div>
                <div className=" flex justify-end p-3">
                  <button
                    type="button"
                    className="btn btn-danger px-3 mb-2"
                    onClick={handleSubmitDelete}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showPublish && (
        <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title">Confirm Publish</h5>
                  <RxCross1
                    className="float-end relative mt-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                    type="button"
                    // className="btn-close text-red-600"
                    onClick={handleCloseModal}
                  />
                  {console.log(
                    "the currecnt section inside delete of the managesubjhect",
                    currentSection
                  )}
                </div>
                <div
                  className=" relative  mb-3 h-1 w-[97%] mx-auto bg-red-700"
                  style={{
                    backgroundColor: "#C03078",
                  }}
                ></div>
                <div className="modal-body">
                  Are you sure you want to Publish this{" "}
                  {` ${currestSubjectNameForDelete} `} ?
                </div>
                <div className=" flex justify-end p-3">
                  <button
                    type="button"
                    className="btn btn-primary px-3 mb-2"
                    onClick={handleSubmitPublish}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Publishing..." : "Publish"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NoticeAndSms;
