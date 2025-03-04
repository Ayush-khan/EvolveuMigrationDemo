import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

function HolidayList() {
  const API_URL = import.meta.env.VITE_API_URL; // URL for host
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDActiveModal, setShowDActiveModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  //   variable to store the respone of the allot subject tab
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingandPublishing, setIsSubmittingandPublishing] =
    useState(false);

  const pageSize = 10;
  const navigate = useNavigate();
  // State for form fields and validation errors
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(""); // For success message
  const [errorMessage, setErrorMessage] = useState(""); // For error message
  const [errorMessageUrl, setErrorMessageUrl] = useState(""); // For error message
  const [loading, setLoading] = useState(false); // For loader
  const [showDisplayUpload, setShowDisplayUpload] = useState(false);
  const [isDataPosted, setIsDataPosted] = useState(false); // Flag for tracking successful post
  const [userName, setUserName] = useState("");
  const [holidays, setHolidays] = useState([]);
  const [selectedHolidays, setSelectedHolidays] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [currentHoliday, setCurrentHoliday] = useState("");
  const [currentHolidayNameForDelete, setCurrentHolidayNameForDelete] =
    useState("");
  const [publishedHolidays, setPublishedHolidays] = useState([]);
  const [deletedHolidays, setDeletedHolidays] = useState([]);
  const [dateLimits, setDateLimits] = useState({ min: "", max: "" });
  // const [formData, setFormData] = useState({ holiday_date: "" });

  const [formData, setFormData] = useState({
    title: "",
    holiday_date: "",
    to_date: "",
  });

  // Custom styles for the close button

  const fetchSessionData = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.get(`${API_URL}/api/sessionData`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      console.log("response session data", response.data);

      if (response.data && response.data.user) {
        const { name } = response.data.user;
        setUserName(name); // Set user name in state
      } else {
        console.error("User data not found in the response");
      }
    } catch (error) {
      console.error("Error fetching session data:", error);
    }
  };

  const getDateLimits = (academicYear) => {
    if (!academicYear) return {};

    const [startYear, endYear] = academicYear.split("-").map(Number);

    return {
      min: `${startYear}-04-01`, // Start of academic year (April 1st)
      max: `${endYear}-03-31`, // End of academic year (March 31st)
    };
  };

  // Fetch holidays & academic year
  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/get_holidaylist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.data?.length) {
        const academicYear = response.data.data[0].academic_yr; // Assuming first entry has the academic year
        setDateLimits(getDateLimits(academicYear)); // Set the min/max dates
      }

      setHolidays(response.data.data || []);
      setPageCount(Math.ceil(response.data.data.length / pageSize));
    } catch (error) {
      toast.error("Error fetching holiday data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionData();
    console.log("session.data", fetchSessionData);

    fetchHolidays();

    // If data is posted successfully, reset the flag and refetch
    if (isDataPosted) {
      setIsDataPosted(false); // Reset the flag after refresh
    }
  }, [isDataPosted]);

  // Handle pagination
  const handlePageClick = (data) => {
    console.log("Page clicked:", data.selected);
    setCurrentPage(data.selected);
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleSubmitAdd = async () => {
    if (isSubmitting) return; // Prevent duplicate submissions
    setIsSubmitting(true);

    const { title, holiday_date, to_date } = formData;

    console.log("data", { title, holiday_date, to_date });

    let formHasErrors = false;
    let errorMessages = {};

    if (!title) {
      formHasErrors = true;
      errorMessages.title = "Title is required.";
    }

    if (!holiday_date) {
      formHasErrors = true;
      errorMessages.holiday_date = "Start Date is required.";
    }

    if (formHasErrors) {
      setFieldErrors(errorMessages);
      setIsSubmitting(false);
      toast.error("Please fill required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No authentication token found. Please log in again.");
        setIsSubmitting(false);
        return;
      }

      const requestData = {
        title,
        holiday_date,
        to_date: to_date || "", // Set empty string if to_date is not provided
      };

      const response = await axios.post(
        `${API_URL}/api/save_holiday`,
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { data } = response;

      if (!data.success) {
        toast.error("Holiday already exists.");
        setIsSubmitting(false);
        return;
      }

      // Success Handling
      toast.success("Holiday added successfully!");
      setFormData({ title: "", holiday_date: "", to_date: "" });
      setFieldErrors({}); // Reset errors
      fetchHolidays(); // Refresh holiday list
      handleCloseModal(); // Close modal
    } catch (error) {
      console.error("Error adding holiday:", error);

      if (!error.response || error.response.status >= 500) {
        toast.error("Server error. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    // Handle different date formats
    let parts = dateString.includes("-")
      ? dateString.split("-")
      : dateString.split("/");

    if (parts.length !== 3) return ""; // Ensure valid format

    let [day, month, year] = parts;

    // Ensure year is always the last part
    if (year.length !== 4) [year, day] = [day, year];

    return `${year}-${month}-${day}`; // Convert to yyyy-MM-dd
  };

  const handleEdit = (holiday) => {
    setCurrentHoliday(holiday.holiday_id);

    let formattedStartDate = holiday.holiday_date
      ? formatDateForInput(holiday.holiday_date)
      : "";
    let formattedEndDate = holiday.to_date
      ? formatDateForInput(holiday.to_date)
      : "";

    console.log("Formatted Start Date:", formattedStartDate);
    console.log("Formatted End Date:", formattedEndDate);

    setFormData((prevState) => ({
      ...prevState,
      title: holiday.title || "",
      holiday_date: formattedStartDate,
      to_date: formattedEndDate,
    }));

    setShowEditModal(true);
  };

  const handleSubmitEdit = async () => {
    if (isSubmitting) return; // Prevent duplicate submissions
    setIsSubmitting(true);

    const { title, holiday_date, to_date } = formData;
    console.log("Editing Holiday:", { title, holiday_date, to_date });

    let formHasErrors = false;
    let errorMessages = {};

    if (!title) {
      formHasErrors = true;
      errorMessages.title = "Title is required.";
    }

    if (!holiday_date) {
      // Ensure correct variable name
      formHasErrors = true;
      errorMessages.holiday_date = "Start Date is required.";
    }

    if (formHasErrors) {
      setFieldErrors(errorMessages);
      setIsSubmitting(false);
      toast.error("Please fill required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No authentication token found. Please log in again.");
        setIsSubmitting(false);
        return;
      }

      const formatDateForAPI = (dateString) => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split("-");
        return `${year}-${month}-${day}`; // Ensure yyyy-MM-dd
      };

      const response = await axios.put(
        `${API_URL}/api/update_holiday/${currentHoliday}`,
        {
          title,
          holiday_date: formatDateForAPI(holiday_date),
          to_date: formatDateForAPI(to_date),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data.success) {
        toast.error(response.data.message || "Failed to update holiday.");
        setIsSubmitting(false);
        return;
      }

      // Success Handling
      toast.success("Holiday updated successfully!");
      setShowEditModal(false); // Close modal
      fetchHolidays(); // Refresh holiday list
    } catch (error) {
      console.error("Error updating holiday:", error);
      toast.error(
        error.response?.data?.message || "Server error. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAddandPublish = async () => {
    if (isSubmitting) return; // Prevent duplicate submissions
    setIsSubmittingandPublishing(true);

    const { title, holiday_date, to_date } = formData;

    console.log("Submitting:", { title, holiday_date, to_date });

    let formHasErrors = false;
    let errorMessages = {};

    if (!title) {
      formHasErrors = true;
      errorMessages.title = "Title is required.";
    }

    if (!holiday_date) {
      formHasErrors = true;
      errorMessages.holiday_date = "Start Date is required.";
    }

    if (formHasErrors) {
      setFieldErrors(errorMessages);
      setIsSubmittingandPublishing(false);
      toast.error("Please fill required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No authentication token found. Please log in again.");
        setIsSubmittingandPublishing(false);
        return;
      }

      // **Single API request to save and publish**
      const response = await axios.post(
        `${API_URL}/api/save_holidaypublish`,
        { title, holiday_date, to_date },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data.success) {
        toast.error(
          response.data.message || "Failed to save and publish holiday."
        );
        setIsSubmittingandPublishing(false);
        return;
      }

      // **Success Handling**
      toast.success("Holiday saved and published successfully!");

      // **Update published holidays list**
      setPublishedHolidays((prev) => [...prev, response.data.holiday_id]);

      setFormData({ title: "", holiday_date: "", to_date: "" });
      setFieldErrors({}); // Reset errors
      fetchHolidays(); // Refresh holiday list
      handleCloseModal(); // Close modal
    } catch (error) {
      console.error("Error saving and publishing holiday:", error);
      toast.error(
        error.response?.data?.message || "Server error. Please try again later."
      );
    } finally {
      setIsSubmittingandPublishing(false);
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      // Select all students
      const allHolidayIds = holidays.map((holiday) => holiday.holiday_id);
      setSelectedHolidays(allHolidayIds);
      console.log("allholidays", allHolidayIds);
    } else {
      // Deselect all students
      setSelectedHolidays([]);
    }
  };

  const handleCheckboxChange = (holidayId) => {
    if (selectedHolidays.includes(holidayId)) {
      setSelectedHolidays(selectedHolidays.filter((id) => id !== holidayId));
    } else {
      setSelectedHolidays([...selectedHolidays, holidayId]);
    }
  };

  const handlePublish = async () => {
    if (selectedHolidays.length === 0) {
      toast.warning("Please select at least one holiday to publish.");
      return;
    }

    setIsSubmitting(true); // Disable button while publishing

    const token = localStorage.getItem("authToken"); // Retrieve token from storage

    if (!token) {
      alert("Authentication required. Please log in.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/update_publishholiday`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token for authentication
        },
        body: JSON.stringify({ holiday_id: selectedHolidays }),
      });

      if (!response.ok) {
        toast.error("Failed to publish holidays. Please try again.");
        throw new Error("Failed to publish holidays");
      }

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Holidays published successfully!");

        // Update holidays state to mark them as published
        setHolidays((prevHolidays) =>
          prevHolidays.map((holiday) =>
            selectedHolidays.includes(holiday.holiday_id)
              ? { ...holiday, publish: "Y" } // Mark as published
              : holiday
          )
        );

        // Clear selection after publishing
        setSelectedHolidays([]);
      } else {
        toast.error(data.message || "Failed to publish holidays.");
      }
    } catch (error) {
      console.error("Error publishing holidays:", error);
      toast.error("An error occurred while publishing holidays.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    let errors = { ...fieldErrors };

    // Title validation
    if (name === "title") {
      errors.title = value.trim() ? "" : "Title is required.";
    }

    // Start Date validation
    if (name === "holiday_date") {
      if (!value.trim()) {
        errors.holiday_date = "Start date is required.";
      } else if (
        dateLimits.min &&
        dateLimits.max &&
        (value < dateLimits.min || value > dateLimits.max)
      ) {
        errors.holiday_date = `Start date must be between ${dateLimits.min} and ${dateLimits.max}.`;
      } else {
        errors.holiday_date = "";
      }
    }

    // End Date validation (Ensure it's not before Start Date)
    if (name === "to_date") {
      if (!value.trim()) {
        errors.to_date = "End date is required.";
      } else if (formData.holiday_date && value < formData.holiday_date) {
        errors.to_date = "End date cannot be before start date.";
      } else if (
        dateLimits.min &&
        dateLimits.max &&
        (value < dateLimits.min || value > dateLimits.max)
      ) {
        errors.to_date = `End date must be between ${dateLimits.min} and ${dateLimits.max}.`;
      } else {
        errors.to_date = "";
      }
    }

    setFieldErrors(errors);
  };

  useEffect(() => {
    const storedDeletedHolidays =
      JSON.parse(localStorage.getItem("deletedHolidays")) || [];
    setDeletedHolidays(storedDeletedHolidays);
  }, []);

  const handleDelete = (holiday) => {
    setCurrentHoliday(holiday.holiday_id);
    setCurrentHolidayNameForDelete(holiday.title);

    console.log("Holiday to delete:", holiday);
    console.log("Current holiday name for delete:", holiday.title);

    // Show confirmation modal for all holidays (published & unpublished)
    setShowDeleteModal(true);
  };

  const handleSubmitDelete = async (holidayId) => {
    if (!holidayId) {
      toast.error("Invalid holiday selected.");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No authentication token found. Please log in again.");
        setIsSubmitting(false);
        return;
      }

      console.log("Deleting holiday with ID:", holidayId);

      // Call API to delete holiday
      const response = await axios.delete(
        `${API_URL}/api/delete_holiday/${holidayId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { data } = response;

      if (!data.success) {
        toast.error("Failed to delete the holiday.");
        setIsSubmitting(false);
        return;
      }

      //Remove holiday from UI (both published & unpublished)
      setHolidays((prevHolidays) =>
        prevHolidays.filter((h) => h.holiday_id !== holidayId)
      );

      // Track deleted holidays if they were published
      setDeletedHolidays((prev) => {
        const updatedDeletedHolidays = [...prev, holidayId];
        localStorage.setItem(
          "deletedHolidays",
          JSON.stringify(updatedDeletedHolidays)
        );
        return updatedDeletedHolidays;
      });

      toast.success("Holiday deleted successfully!");
      setShowDeleteModal(false); // Close modal after delete
      fetchHolidays(); // Refresh list
    } catch (error) {
      console.error("Error deleting holiday:", error);
      toast.error("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setFormData({ title: "", holiday_date: "", to_date: "" }); // Clear the form data when closing
    setFieldErrors({ message: "" }); // Reset any errors
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowDActiveModal(false);
  };

  // for uplode portions  // Function to download the CSV template
  const handleDownloadTemplate = async () => {
    const token = localStorage.getItem("authToken");

    try {
      // Adjust classIdForManage dynamically if needed
      const response = await axios.get(
        `${API_URL}/api/get_templatecsv`, // download api
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob", // Important for handling binary data
        }
      );

      // Trigger download using a hidden link element
      triggerFileDownload(response.data, "holidaylist.csv");
    } catch (error) {
      console.error("Error downloading template:", error);
    }
  };

  // Helper function to trigger file download
  const triggerFileDownload = (blobData, fileName) => {
    const url = window.URL.createObjectURL(new Blob([blobData]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName); // Set the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Cleanup after download
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file); // Set the selected file to state
    setErrorMessage(""); // Clear any previous error
    setUploadStatus(""); // Clear any previous success
    setErrorMessageUrl("");
  };

  const downloadCsv = async (fileUrl) => {
    try {
      const token = localStorage.getItem("authToken");
      console.log("the response of the namechack api____");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        `${API_URL}/api/download_csv_rejected/${fileUrl}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        {
          responseType: "blob", // Important for handling binary data
        }
      );

      // Trigger download using a hidden link element
      triggerFileDownload(response.data, `rejected_template.csv`);
    } catch (error) {
      console.error("Error downloading template:", error);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a file first.");
      return;
    }

    // Regular expression to allow "holidaylist.csv", "holidaylist(1).csv", "holidaylist(2).csv", etc.
    const fileNamePattern = /^holidaylist(\s\(\d+\))?\.csv$/;

    const fileName = selectedFile.name.trim();

    // Check if the file name matches the allowed pattern
    if (!fileNamePattern.test(fileName)) {
      toast.warning(
        "⚠️ Invalid file name! Please select 'holidaylist.csv' or 'holidaylist(x).csv' (e.g., 'holidaylist(1).csv')."
      );
      return;
    }

    // File is valid, proceed with upload
    setLoading(true); // Show loader
    const formData = new FormData();
    formData.append("file", selectedFile); // Append the selected file

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("File is valid CSV", formData);

      const response = await axios.post(
        `${API_URL}/api/update_holidaylist_csv`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response of bulk upload:", response);

      if (response.status === 200) {
        toast.success("Data posted successfully!");
        setIsDataPosted(true);
        setSelectedFile(null);
      }
    } catch (error) {
      setLoading(false); // Hide loader

      const showErrorForUploading = error?.response?.data?.message;
      const showErrorForUploadingUrl = error?.response?.data?.invalid_rows;
      console.log("Error from API:", showErrorForUploading);

      setErrorMessage(
        !showErrorForUploading
          ? "Failed to upload file. Please try again..."
          : `Error: ${showErrorForUploading}.`
      );

      const fullErrorMessageUrl = `${showErrorForUploadingUrl}`;
      setErrorMessageUrl(fullErrorMessageUrl);
      console.log("Full error message URL:", errorMessageUrl);

      toast.error(
        !showErrorForUploading
          ? "Error uploading file."
          : error?.response?.data?.message
      );

      console.error("Error uploading file:", showErrorForUploading);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return " ";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-4); // Last 2 digits of the year
    return `${day}-${month}-${year}`;
  };

  const filteredSections = (Array.isArray(holidays) ? holidays : [])
    .sort((a, b) => new Date(a.holiday_date) - new Date(b.holiday_date)) // Sort by holiday_date
    .filter((holiday) => {
      if (!searchTerm) return true; // If no search term, return all holidays

      const searchLower = searchTerm.toLowerCase().trim();
      const holidayName = holiday?.title
        ? holiday.title.toLowerCase().trim()
        : "";
      const holidayStartDate = holiday?.holiday_date
        ? holiday.holiday_date.toLowerCase().trim()
        : "";
      const createdBy = holiday?.created_by_name
        ? holiday.created_by_name.toLowerCase().trim()
        : "";

      return (
        holidayName.includes(searchLower) ||
        holidayStartDate.includes(searchLower) ||
        createdBy.includes(searchLower)
      );
    });

  const displayedSections = filteredSections.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );
  // console.log("displayted sections", displayedSections);

  return (
    <>
      <div className="md:mx-auto md:w-[85%] p-4 bg-white mt-4 ">
        <div className="w-full  flex flex-row justify-between">
          <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
            Holiday List
          </h3>
          <RxCross1
            className=" relative  mt-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
            onClick={() => {
              navigate("/dashboard");
            }}
          />
        </div>

        <div
          className=" relative  mb-8   h-1  mx-auto bg-red-700"
          style={{
            backgroundColor: "#C03078",
          }}
        ></div>
        <div className="bg-white w-full md:w-[97%] mx-auto rounded-md ">
          <div className="w-full  mx-auto">
            <ToastContainer />

            <div className="mb-4  ">
              <div className="  w-[100%]  mx-auto ">
                <div className="max-w-full bg-white shadow-md rounded-lg border border-gray-300 mx-auto p-6">
                  <h2 className="text-center text-2xl font-semibold mb-8 text-blue-600">
                    Upload Holiday Data from Excel Sheet
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    {/* Download Student List Template */}
                    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-md">
                      <h5 className="font-semibold mb-3 text-gray-800">
                        Download Template
                      </h5>
                      <p className="text-sm text-gray-600 mb-4">
                        # Please download the template by clicking below.
                        <br />
                        # Enter holiday details in the downloaded file.
                        <br />
                      </p>
                      <button
                        onClick={handleDownloadTemplate}
                        className="mt-5 bg-blue-600 text-white text-xs rounded-full px-6 py-3 hover:bg-blue-700 transition duration-200"
                      >
                        <i className="fas fa-download text-lg"></i> Download
                        Template
                      </button>
                    </div>

                    {/* File Upload dfgs  gdg*/}
                    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-md">
                      <h5 className="font-semibold mb-3 text-gray-800">
                        Select a file to upload
                      </h5>

                      <p className="text-sm text-gray-600 mb-4">
                        # Do not change the name of the file. Do not change the
                        contents of first 4 columns in the downloaded
                        excelsheet.
                        <br /># Please click on the button below to select the
                        file which was downloaded in the previous step.
                      </p>

                      <label className="mt-2 bg-blue-600 md:w-[45%] overflow-hidden text-white rounded-full text-xs  px-6 py-3 hover:bg-blue-700 cursor-pointer transition duration-200 whitespace-nowrap">
                        <i className="fas fa-upload text-lg "></i>{" "}
                        {selectedFile
                          ? selectedFile.name.length > 20
                            ? `${selectedFile.name.substring(0, 10)}...`
                            : selectedFile.name
                          : " Choose File "}
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Register New Students */}
                    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-md">
                      <h5 className="font-semibold mb-3 text-gray-800">
                        Enter New Holiday List
                      </h5>
                      <p className="text-sm text-gray-600 mb-4">
                        # Please click on the upload button to upload the file.
                        <br /># Holidays will be entered in application
                      </p>
                      <div className="text-xs flex flex-col justify-around">
                        <span>
                          {errorMessage && (
                            <p style={{ color: "red" }}>{errorMessage}</p>
                          )}
                        </span>
                        <span className="">
                          {errorMessageUrl && (
                            <a
                              href="#"
                              style={{ color: "red" }}
                              className="text-xs"
                              onClick={(e) => {
                                e.preventDefault(); // Prevent the default link behavior
                                downloadCsv(errorMessageUrl); // Call the function to download the file
                              }}
                            >
                              <span className="underline text-blue-500 hover:text-blue-800 ">
                                Download CSV to see errors.
                              </span>
                            </a>
                          )}
                        </span>
                      </div>

                      <button
                        onClick={handleUpload}
                        className="mt-16 bg-blue-600 text-white text-xs rounded-full px-6 py-3 hover:bg-blue-700 transition duration-200"
                        disabled={loading} // Disable button during loading
                      >
                        {" "}
                        <i className="fas fa-cloud-upload-alt text-lg"></i>{" "}
                        {loading ? "Uploading..." : "Upload"}
                      </button>

                      {uploadStatus && (
                        <p style={{ color: "green" }}>{uploadStatus}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {holidays.length > 0 && (
              <div className="w-full  mt-4">
                <div className="card mx-auto lg:w-full shadow-lg">
                  <div className="p-2 px-3 bg-gray-100 border-none flex justify-between items-center">
                    <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
                      Holiday List
                    </h3>
                    <div className="box-border flex md:gap-x-2 justify-end md:h-10">
                      <div className=" w-1/2 md:w-fit mr-1">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search"
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <button
                        className="btn btn-primary btn-sm md:h-9 text-xs md:text-sm"
                        onClick={handleAdd}
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          style={{ marginRight: "5px" }}
                        />
                        Add
                      </button>

                      <button
                        // type="submit"
                        className="btn btn-primary btn-sm md:h-9 text-xs md:text-sm"
                        onClick={handlePublish}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Publishing..." : "Publish"}
                      </button>
                    </div>
                  </div>
                  <div
                    className=" relative w-[97%]   mb-3 h-1  mx-auto bg-red-700"
                    style={{
                      backgroundColor: "#C03078",
                    }}
                  ></div>

                  <div className="card-body w-full">
                    <div className="h-96 lg:h-96 overflow-y-scroll lg:overflow-x-hidden w-full  md:w-[100%] mx-auto">
                      <table className="min-w-full leading-normal table-auto">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="px-2 w-full md:w-[6%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Sr.No
                            </th>
                            <th className="px-2 w-full md:w-[6%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                                className="cursor-pointer"
                              />{" "}
                              All
                            </th>
                            <th className="px-2 w-full md:w-[10%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Title
                            </th>
                            <th className="px-2 w-full md:w-[8%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Start Date
                            </th>
                            <th className="px-2 w-full md:w-[8%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              End Date
                            </th>
                            <th className="px-2 w-full md:w-[25%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Created By
                            </th>
                            <th className="px-2 w-full md:w-[7%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Edit
                            </th>
                            <th className="px-2 w-full md:w-[7%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Delete
                            </th>
                            {/* <th className="px-2 w-full md:w-[10%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Publish
                            </th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {displayedSections.length ? (
                            displayedSections.map((holiday, index) => (
                              <tr
                                key={holiday.holiday_id}
                                className=" text-sm "
                                // onClick={() => handlePublish(holiday.holiday_id)}
                              >
                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  {currentPage * pageSize + index + 1}
                                </td>

                                <td className="px-2 text-center lg:px-3 border border-gray-950 text-sm">
                                  {" "}
                                  {/* py-2 */}
                                  <p className="text-gray-900 whitespace-no-wrap relative top-2">
                                    {holiday.publish === "N" && (
                                      <input
                                        type="checkbox"
                                        checked={selectedHolidays.includes(
                                          holiday.holiday_id
                                        )}
                                        onChange={(e) => {
                                          e.stopPropagation(); // Prevents row click from triggering publish
                                          handleCheckboxChange(
                                            holiday.holiday_id
                                          );
                                        }}
                                      />
                                    )}
                                  </p>
                                </td>

                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm text-nowrap">
                                  {holiday.title}
                                </td>

                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  {formatDate(holiday.holiday_date)}
                                  {/* {holiday.holiday_date} */}
                                </td>

                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  {formatDate(holiday.to_date || "")}
                                  {/* {holiday.to_date} */}
                                </td>

                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  {/* {userName ? userName : "Loading..."} */}
                                  {holiday.created_by_name}
                                </td>

                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  {holiday.publish === "N" && (
                                    <button
                                      className="text-blue-600 hover:text-blue-800 hover:bg-transparent"
                                      onClick={() => handleEdit(holiday)}
                                    >
                                      <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                  )}
                                </td>

                                {/* <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  <button
                                    onClick={() => handleDelete(holiday)}
                                    className="text-red-600 hover:text-red-800 hover:bg-transparent "
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </button>
                                </td> */}

                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  {deletedHolidays.includes(
                                    holiday.holiday_id
                                  ) ? (
                                    <span className="text-red-600 font-semibold">
                                      Deleted
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => handleDelete(holiday)}
                                      className="text-red-600 hover:text-red-800 hover:bg-transparent"
                                    >
                                      <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <div className="absolute left-[1%] w-[100%]  text-center flex justify-center items-center mt-14">
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
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        pageCount={pageCount}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={1}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        activeClassName={"active"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Modal*/}
      {showAddModal && (
        <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="modal"
            style={{
              display: "block",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <div className="modal-dialog modal-dialog-centered ">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title">Create New Holiday</h5>
                  <RxCross1
                    className="float-end relative top-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                    type="button"
                    // className="btn-close text-red-600"
                    onClick={handleCloseModal}
                  />
                </div>
                <div
                  className=" relative  mb-3 h-1 w-[97%] mx-auto bg-red-700"
                  style={{
                    backgroundColor: "#C03078",
                  }}
                ></div>
                {/* <hr className="font-bold"></hr> */}
                <div className="modal-body">
                  <div className=" relative mb-4 flex justify-center  mx-4">
                    <label htmlFor="title" className="w-1/2 mt-2">
                      Title<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="title"
                      className="form-control shadow-md"
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChangeInput}
                    />
                    <div className="absolute top-9 left-1/3">
                      {fieldErrors.title && (
                        <span className="text-danger text-xs">
                          {fieldErrors.title}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className=" relative mb-4 flex justify-center  mx-4">
                    <label htmlFor="holiday_date" className="w-1/2 mt-2">
                      Start Date<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="holiday_date"
                      className="form-control shadow-md"
                      type="date"
                      name="holiday_date"
                      value={formData.holiday_date}
                      onChange={handleChangeInput}
                      min={dateLimits.min} // Restrict min date
                      max={dateLimits.max} // Restrict max date
                    />
                    <div className="absolute top-9 left-1/3">
                      {fieldErrors.holiday_date && (
                        <span className="text-danger text-xs">
                          {fieldErrors.holiday_date}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className=" relative mb-4 flex justify-center  mx-4">
                    <label htmlFor="to_date" className="w-1/2 mt-2">
                      End Date
                    </label>
                    <input
                      id="to_date"
                      className="form-control shadow-md"
                      type="date"
                      name="to_date"
                      value={formData.to_date}
                      onChange={handleChangeInput}
                      min={dateLimits.min} // Restrict min date
                      max={dateLimits.max} // Restrict max date
                    />
                    {/* <div className="absolute top-9 left-1/3">
                        {fieldErrors.to_date && (
                          <span className="text-danger text-xs">
                            {fieldErrors.to_date}
                          </span>
                        )}
                      </div> */}
                  </div>
                </div>
                {/* <div className="modal-footer d-flex justify-content-end"> */}
                {/* modified code by divyani mam guidance */}
                <div className=" flex justify-end p-3">
                  <button
                    type="button"
                    className="btn btn-primary px-3 mb-2 mr-2"
                    onClick={() => {
                      console.log("Button clicked");
                      handleSubmitAdd();
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary px-3 mb-2 "
                    style={{}}
                    onClick={handleSubmitAddandPublish}
                    disabled={isSubmittingandPublishing}
                  >
                    {isSubmittingandPublishing
                      ? "Saving.. & Publishing.."
                      : "Save & Publish"}
                  </button>
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
                    "the currecnt section inside delete of the Holiday",
                    currentHoliday
                  )}
                </div>
                <div
                  className=" relative  mb-3 h-1 w-[97%] mx-auto bg-red-700"
                  style={{
                    backgroundColor: "#C03078",
                  }}
                ></div>
                <div className="modal-body">
                  Are you sure you want to delete this holiday{" "}
                  {` ${currentHolidayNameForDelete} `} ?
                </div>
                <div className=" flex justify-end p-3">
                  <button
                    type="button"
                    className="btn btn-danger px-3 mb-2"
                    onClick={() => handleSubmitDelete(currentHoliday)}
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="modal"
            style={{
              display: "block",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <div className="modal-dialog modal-dialog-centered ">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title">Edit Holiday</h5>
                  <RxCross1
                    className="float-end relative top-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                    type="button"
                    // className="btn-close text-red-600"
                    onClick={handleCloseModal}
                  />
                </div>
                <div
                  className=" relative  mb-3 h-1 w-[97%] mx-auto bg-red-700"
                  style={{
                    backgroundColor: "#C03078",
                  }}
                ></div>

                <div className="modal-body">
                  <div className=" relative mb-4 flex justify-center  mx-4">
                    <label htmlFor="title" className="w-1/2 mt-2">
                      Title<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="title"
                      className="form-control shadow-md"
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChangeInput}
                    />
                    <div className="absolute top-9 left-1/3">
                      {fieldErrors.title && (
                        <span className="text-danger text-xs">
                          {fieldErrors.title}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className=" relative mb-4 flex justify-center  mx-4">
                    <label htmlFor="holiday_date" className="w-1/2 mt-2">
                      Start Date<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="holiday_date"
                      className="form-control shadow-md"
                      type="date"
                      name="holiday_date"
                      value={formData.holiday_date}
                      onChange={handleChangeInput}
                      min={dateLimits.min} // Restrict min date
                      max={dateLimits.max} // Restrict max date
                    />
                    <div className="absolute top-9 left-1/3">
                      {fieldErrors.holiday_date && (
                        <span className="text-danger text-xs">
                          {fieldErrors.holiday_date}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className=" relative mb-4 flex justify-center  mx-4">
                    <label htmlFor="to_date" className="w-1/2 mt-2">
                      End Date
                    </label>
                    <input
                      id="to_date"
                      className="form-control shadow-md"
                      type="date"
                      name="to_date"
                      value={formData.to_date}
                      onChange={handleChangeInput}
                      min={dateLimits.min} // Restrict min date
                      max={dateLimits.max} // Restrict max date
                    />
                    {/* <div className="absolute top-9 left-1/3">
                        {fieldErrors.to_date && (
                          <span className="text-danger text-xs">
                            {fieldErrors.to_date}
                          </span>
                        )}
                      </div> */}
                  </div>
                </div>

                {/* <div className="modal-footer d-flex justify-content-end"> */}
                {/* modified code by divyani mam guidance */}
                <div className=" flex justify-end p-3">
                  <button
                    type="button"
                    className="btn btn-primary px-3 mb-2 mr-2"
                    style={{}}
                    onClick={handleSubmitEdit}
                    disabled={isSubmitting}
                  >
                    {/* {isSubmitting ? "Updating..." : "Update"} */}
                    Update
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

export default HolidayList;
