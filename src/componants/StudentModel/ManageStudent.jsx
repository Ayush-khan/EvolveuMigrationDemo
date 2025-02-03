import { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faEdit, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import { TbFileCertificate } from "react-icons/tb";
import { RxCross1 } from "react-icons/rx";
import Select from "react-select";
import { MdLockReset, MdOutlineRemoveRedEye } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ManageSubjectList() {
  const API_URL = import.meta.env.VITE_API_URL; // URL for host
  // const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [classes, setClasses] = useState([]);
  const [studentNameWithClassId, setStudentNameWithClassId] = useState([]);
  const [subjects, setSubjects] = useState([]);
  // for allot subject tab
  const [sectionIdForStudentList, setSectionIdForStudentList] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDActiveModal, setShowDActiveModal] = useState(false);
  const [currentStudentDataForActivate, setCurrentStudentDataForActivate] =
    useState(null);

  const [currentSection, setCurrentSection] = useState(null);
  const [currestSubjectNameForDelete, setCurrestSubjectNameForDelete] =
    useState("");

  // This is hold the allot subjet api response
  const [classIdForManage, setclassIdForManage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  // validations state for unique name
  const [grNumber, setGrNumber] = useState("");
  //   variable to store the respone of the allot subject tab
  const [nameError, setNameError] = useState(null);
  const pageSize = 10;

  // for react-search of manage tab teacher Edit and select class
  const [selectedClass, setSelectedClass] = useState(null);
  //   For students
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  // for showing the buttons delete and edit controls
  const [roleId, setRoleId] = useState("");
  const navigate = useNavigate();

  // State for form fields and validation errors
  const [setPassword, setSetpassword] = useState("");
  const [userIdset, setUserIdset] = useState("");
  const [passwordError, setPasswordError] = useState(""); // For password error
  const [userIdError, setUserIdError] = useState(""); // For userId error
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Custom styles for the close button

  const classOptions = useMemo(
    () =>
      classes.map((cls) => ({
        value: cls.section_id,
        label: `${cls?.get_class?.name} ${cls.name} (${cls.students_count})`,
      })),
    [classes]
  );

  // const studentOptions = useMemo(
  //   () =>
  //     studentNameWithClassId.map((stu) => ({
  //       value: stu.student_id,
  //       label: `${stu?.first_name} ${stu?.mid_name} ${stu.last_name}`,
  //     })),
  //   [studentNameWithClassId]
  // );
  const studentOptions = useMemo(
    () =>
      studentNameWithClassId
        .map((stu) => ({
          value: stu.student_id,
          label: [stu?.first_name, stu?.mid_name, stu?.last_name]
            .filter((namePart) => namePart)
            .join(" "),
        }))
        .filter((option) => option.label), // Remove items with empty labels
    [studentNameWithClassId]
  );

  // const handleClassSelect = (selectedOption) => {
  //   setNameError("");
  //   setSelectedClass(selectedOption);
  // setclassIdForManage(selectedOption ? selectedOption.value : null); // Assuming value is the class ID
  // // fetchStudentNameWithClassId(selectedOption ? selectedOption.value : null); // Fetch students for selected class
  // setSectionIdForStudentList(selectedOption ? selectedOption.value : null); //
  // };

  // const handleStudentSelect = (selectedOption) => {
  //   setNameError("");
  //   setSelectedStudent(selectedOption);
  //   setSelectedStudentId(selectedOption ? selectedOption.value : null);
  // };
  const fetchStudentNameWithClassId = async (section_id = null) => {
    try {
      setLoadingStudents(true);

      const params = section_id ? { section_id } : {};
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        `${API_URL}/api/getStudentListBySectionData`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      setStudentNameWithClassId(response?.data?.data || []);
    } catch (error) {
      toast.error("Error fetching students.");
    } finally {
      setLoadingStudents(false);
    }
  };
  const handleClassSelect = (selectedOption) => {
    setNameError("");
    setSelectedClass(selectedOption);
    setSelectedStudent(null);
    setSelectedStudentId(null);
    setclassIdForManage(selectedOption ? selectedOption.value : null); // Assuming value is the class ID
    // fetchStudentNameWithClassId(selectedOption ? selectedOption.value : null); // Fetch students for selected class
    setSectionIdForStudentList(selectedOption ? selectedOption.value : null); //
    // setClassIdForSearch(selectedOption?.value);
    fetchStudentNameWithClassId(selectedOption?.value);
  };

  const handleStudentSelect = (selectedOption) => {
    setNameError(""); // Reset student error on selection
    setSelectedStudent(selectedOption);
    setSelectedStudentId(selectedOption?.value);
  };
  const handleGrChange = (e) => {
    setNameError("");
    const numericInput = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    setGrNumber(numericInput);
  };
  useEffect(() => {
    // Fetch both classes and student names on component mount
    fetchInitialDataAndStudents();
    fetchDataRoleId();
  }, []);

  const fetchInitialDataAndStudents = async () => {
    try {
      setLoadingClasses(true);
      setLoadingStudents(true);

      const token = localStorage.getItem("authToken");

      // Fetch classes and students concurrently
      const [classResponse, studentResponse] = await Promise.all([
        axios.get(`${API_URL}/api/getallClassWithStudentCount`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/getStudentListBySectionData`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Set the fetched data
      setClasses(classResponse.data || []);
      setStudentNameWithClassId(studentResponse?.data?.data || []);
    } catch (error) {
      toast.error("Error fetching data.");
    } finally {
      // Stop loading for both dropdowns
      setLoadingClasses(false);
      setLoadingStudents(false);
    }
  };

  const handleSearch = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    setSubjects([]);
    if (!classIdForManage && !selectedStudentId && !grNumber) {
      setNameError("Please select at least one of them.");
      toast.error("Please select at least one of them!");
      setIsSubmitting(false);
      return;
    }
    setLoading(true);
    setSearchTerm("");
    try {
      const token = localStorage.getItem("authToken");
      // let response;

      const queryParams = {};

      // Dynamically build query params
      if (classIdForManage) queryParams.section_id = classIdForManage;
      if (selectedStudentId) queryParams.student_id = selectedStudentId;
      if (grNumber) queryParams.reg_no = grNumber;

      // Make the API call only if queryParams has at least one key
      // if (Object.keys(queryParams).length === 0) {
      //   throw new Error("No valid search parameters.");
      // }
      // previour api:
      // https://sms.evolvu.in/public/api/getStudentListBySection?section_id=440
      const response = await axios.get(`${API_URL}/api/get_students`, {
        headers: { Authorization: `Bearer ${token}` },
        params: queryParams,
      });

      // if (selectedStudentId) {
      //   response = await axios.get(
      //     `${API_URL}/api/students/${selectedStudentId}`,
      //     { headers: { Authorization: `Bearer ${token}` } }
      //   );
      // } else if (grNumber) {
      //   response = await axios.get(
      //     `${API_URL}/api/student_by_reg_no/${grNumber}`,
      //     { headers: { Authorization: `Bearer ${token}` } }
      //   );
      // } else if (selectedClass) {
      //   response = await axios.get(`${API_URL}/api/getStudentListBySection`, {
      //     headers: { Authorization: `Bearer ${token}` },
      //     params: { section_id: selectedClass.value },
      //   });
      // }

      // const studentList = response?.data?.students || [];
      // Handle singular or plural student key
      const studentList =
        response?.data?.students || response?.data?.student || [];
      setSubjects(studentList);
      setPageCount(Math.ceil(studentList.length / pageSize)); // Set page count based on response size
    } catch (error) {
      console.log("error", error.response.data.message);
      toast.error(error.response.data.message || "student not found!");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };
  // for role_id
  const fetchDataRoleId = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      // Fetch session data
      const sessionResponse = await axios.get(`${API_URL}/api/sessionData`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoleId(sessionResponse.data.user.role_id); // Store role_id
      // setRoleId("A"); // Store role_id
      console.log("roleIDis:", roleId);
      // Fetch academic year data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // useEffect(() => {
  //   // fetchInitialData(); // Fetch classes once when the component mounts
  //   // fetchStudentNameWithClassId(classOptions.value);
  //   // fetchDataRoleId();
  // }, []);

  // Handle pagination
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleEdit = (section) => {
    setCurrentSection(section);
    navigate(
      `/student/edit/${section.student_id}`,

      {
        state: { student: section },
      }
    );
    // console.log("the currecne t section", currentSection);
  };

  const handleDelete = (subject) => {
    console.log("inside delete of subjectallotmenbt____", subject);
    console.log("inside delete of subjectallotmenbt", subject.student_id);
    const sectionId = subject.student_id;
    const classToDelete = subjects.find((cls) => cls.student_id === sectionId);
    // setCurrentClass(classToDelete);
    setCurrentSection({ classToDelete });
    console.log("the currecne t section", currentSection);
    setCurrestSubjectNameForDelete(
      currentSection?.CurrentSection?.student_name
    );
    console.log(
      "cureendtsungjeg",
      currentSection?.CurrentSection?.student_name
    );
    console.log("currestSubjectNameForDelete", currestSubjectNameForDelete);
    setShowDeleteModal(true);
  };
  const handleActiveAndInactive = (subjectIsPass) => {
    console.log("handleActiveAndInactive-->", subjectIsPass.student_id);
    const studentToActiveOrDeactive = subjects.find(
      (cls) => cls.student_id === subjectIsPass.student_id
    );
    setCurrentStudentDataForActivate({ studentToActiveOrDeactive });
    console.log("studentToActiveOrDeactive", studentToActiveOrDeactive);
    setShowDActiveModal(true);
  };

  const handleActivateOrNot = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");

      console.log(
        "the classes inside the delete",
        currentStudentDataForActivate?.studentToActiveOrDeactive?.student_id
      );

      if (
        !token ||
        !currentStudentDataForActivate ||
        !currentStudentDataForActivate?.studentToActiveOrDeactive?.student_id
      ) {
        throw new Error("Student ID is missing");
      }

      const response = await axios.patch(
        `${API_URL}/api/students/${currentStudentDataForActivate?.studentToActiveOrDeactive?.student_id}/deactivate`,
        {}, // Empty data object
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      handleSearch();

      setShowDActiveModal(false);
      toast.success(response?.data?.message);
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error(`Error activate or deactivate Student: ${error.message}`);
      }
      console.error("Error activate or deactivate Student:", error);
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
      setShowDActiveModal(false);
    }
  };

  const handleView = (subjectIsPassForView) => {
    console.log("HandleView-->", subjectIsPassForView);
    setCurrentSection(subjectIsPassForView);
    navigate(
      `/student/view/${subjectIsPassForView.student_id}`,

      {
        state: { student: subjectIsPassForView },
      }
    );
  };
  const handleCertificateView = (subjectIsPass) => {
    console.log("handleCertificateView-->", subjectIsPass);
  };

  const handleResetPassword = (subjectIsPass) => {
    setUserIdset(subjectIsPass?.user_master?.user_id);
    console.log("handleResetPassword", subjectIsPass);
    console.log("userId", userIdset);

    setShowEditModal(true);
  };
  // Handle Reset Password form submission
  // const handleSubmitResetPassword = async () => {
  //   try {
  //     const token = localStorage.getItem("authToken");
  //     console.log("toekn", token);
  //     if (!token) {
  //       toast.error("Authentication token missing");
  //       return;
  //     }
  //     await axios.put(`${API_URL}/api/resetPasssword/${userIdset}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     // API call to reset the password

  //     toast.success("Password updated successfully!");
  //     setShowEditModal(false); // Close modal after success
  //   } catch (error) {
  //     console.error("Error resetting password:", error);

  //     // Reset previous errors
  //     setPasswordError("");
  //     setUserIdError("");

  //     if (error.response && error.response.data && error.response.data.errors) {
  //       const backendErrors = error.response.data.errors;

  //       // Display each error message for specific fields

  //       if (backendErrors.user_id) {
  //         setUserIdError(backendErrors.user_id.join(", "));
  //       }
  //     } else {
  //       toast.error("Server error. Please try again later.");
  //     }
  //   }
  // };
  const [errorMessage, setErrorMessage] = useState(""); // State to store error message

  const handleSubmitResetPassword = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("Authentication token missing");
        setErrorMessage("Authentication token missing"); // Set error below the field
        return;
      }

      // API call to reset the password with correct header placement
      const response = await axios.put(
        `${API_URL}/api/resetPasssword/${userIdset}`,
        {}, // Pass empty body if there's no data to send
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response?.data?.Status === 404) {
        console.log("Response is fail");
        // toast.error("User not found");
        setErrorMessage("Invalid user ID");
        return;
      }
      toast.success(
        `Password for user id "${userIdset}" is reset to arnolds successfully!`
      );
      setShowEditModal(false); // Close modal after success
      setErrorMessage(""); // Clear error message on success
    } catch (error) {
      console.error("Error resetting password:", error);

      // Capture server error message and set it below the field
      if (
        error.response &&
        error?.response?.data &&
        error?.response?.data?.Message
      ) {
        setErrorMessage(error?.response?.data?.Message);
        toast.error(error?.response?.data?.Message); // Show toast with the error
      } else {
        setErrorMessage("Failed to update password. Please try again.");
        toast.error("Failed to update password. Please try again.");
      }
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
    }
  };

  // Handle input change for password

  // Handle input change for User ID
  const handleUserIdChange = (e) => {
    setErrorMessage(""); // Clear previous error message
    setUserIdset(e.target.value);
  };

  // const handleSubmitEdit = async () => {
  //   console.log(
  //     "inside the edit model of the subjectallotment",
  //     currentSection.subject_id
  //   );
  // };

  const handleSubmitDelete = async () => {
    if (isSubmitting) return; // Prevent re-submitting
    setIsSubmitting(true);
    // Handle delete submission logic
    try {
      const token = localStorage.getItem("authToken");
      console.log(
        "the currecnt section inside the delte___",
        currentSection?.classToDelete?.student_id
      );
      console.log("the classes inside the delete", classes);
      console.log(
        "the current section insde the handlesbmitdelete",
        currentSection.classToDelete
      );
      if (
        !token ||
        !currentSection ||
        !currentSection?.classToDelete?.student_id
      ) {
        throw new Error("Student ID is missing");
      }

      await axios.delete(
        `${API_URL}/api/students/${currentSection?.classToDelete?.student_id}`,
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
      toast.success("Student deleted successfully!");
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(`Error deleting Student: ${error.response.data.message}`);
      } else {
        toast.error(`Error deleting Student: ${error.message}`);
      }
      console.error("Error deleting Student:", error);
      // setError(error.message);
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
      setShowDeleteModal(false);
    }
  };

  const handleCloseModal = () => {
    setErrorMessage("");
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowDActiveModal(false);
  };

  // const filteredSections = subjects.filter((section) => {
  //   // Convert the teacher's name and subject's name to lowercase for case-insensitive comparison
  //   const studentFullName =
  //     `${section?.first_name} ${section?.mid_name} ${section?.last_name}`?.toLowerCase() ||
  //     "";
  //   const UserId = section?.user?.user_id?.toLowerCase() || "";

  //   // Check if the search term is present in either the teacher's name or the subject's name
  //   return (
  //     studentFullName.includes(searchTerm.toLowerCase()) ||
  //     UserId.includes(searchTerm.toLowerCase())
  //   );
  // });

  const filteredSections = subjects.filter((section) => {
    // Convert the search term to lowercase for case-insensitive comparison
    const searchLower = searchTerm.toLowerCase();

    // Get the student's full name, class name, and user ID for filtering
    const studentName =
      `${section?.first_name} ${section?.mid_name} ${section?.last_name}`?.toLowerCase() ||
      "";
    const studentClass = section?.get_class?.name?.toLowerCase() || "";
    const studentUserId = section?.user_master?.user_id?.toLowerCase() || "";
    const studentRollNo = section?.roll_no?.toString().toLowerCase() || ""; // Convert roll number to string for comparison

    // Check if the search term is present in Roll No, Name, Class, or UserId
    return (
      studentRollNo.includes(searchLower) ||
      studentName.includes(searchLower) ||
      studentClass.includes(searchLower) ||
      studentUserId.includes(searchLower)
    );
  });

  const displayedSections = filteredSections.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );
  // handle allot subject close model
  console.log("displayedSections", displayedSections);
  return (
    <>
      {/* <ToastContainer /> */}
      {/* <div className="md:mx-auto md:w-3/4 p-4 bg-white mt-4 "> */}
      <div className="md:mx-auto md:w-[95%] p-4 bg-white mt-4 ">
        <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
          Manage Student
        </h3>
        <div
          className=" relative  mb-8   h-1  mx-auto bg-red-700"
          style={{
            backgroundColor: "#C03078",
          }}
        ></div>
        {/* <hr className="relative -top-3" /> */}

        <div className="bg-white w-full md:w-[95%] mx-auto rounded-md ">
          {/* <ManageSubjectsTab
               classSection={classSection}
               nameError={nameError}
               handleChangeClassSection={handleChangeClassSection}
               handleSearch={handleSearch}
               classes={classes}
               subjects={subjects}
               displayedSections={displayedSections}
               setSearchTerm={setSearchTerm}
               handleEdit={handleEdit}
               handleDelete={handleDelete}
               pageCount={pageCount}
               handlePageClick={handlePageClick}
             /> */}
          <div className="w-full  mx-auto">
            <ToastContainer />
            <div className="mb-4  ">
              <div className="  w-[90%]  mx-auto ">
                <div className=" w-full flex justify-center flex-col md:flex-row gap-x-1 md:gap-x-8">
                  <div className="w-full  gap-x-3 md:justify-start justify-between  my-1 md:my-4 flex  md:flex-row  ">
                    <label
                      htmlFor="classSection"
                      className=" mr-2 pt-2 items-center text-center"
                    >
                      Class
                    </label>
                    <div className="w-[60%] md:w-[50%] ">
                      <Select
                        value={selectedClass}
                        onChange={handleClassSelect}
                        options={classOptions}
                        // placeholder="Select "
                        isSearchable
                        isClearable
                        placeholder={
                          loadingClasses ? "Loading classes..." : "Select"
                        }
                        isDisabled={loadingClasses}
                        className="text-sm"
                      />
                      {/* {nameError && (
                        <div className=" relative top-0.5 ml-1 text-danger text-xs">
                          {nameError}
                        </div>
                      )} */}
                    </div>
                  </div>
                  <div className="w-full  relative left-0 md:-left-[7%] justify-between  md:w-[90%] my-1 md:my-4 flex  md:flex-row  ">
                    <label
                      htmlFor="classSection"
                      className="relative left-0 md:-left-3  md:text-nowrap pt-2 items-center text-center"
                    >
                      Student Name
                    </label>
                    <div className="w-[60%] md:w-[85%] ">
                      <Select
                        value={selectedStudent}
                        onChange={handleStudentSelect}
                        options={studentOptions}
                        // placeholder="Select "
                        isSearchable
                        isClearable
                        className="text-sm"
                        isDisabled={loadingStudents}
                        placeholder={
                          loadingStudents ? "Loading students..." : "Select"
                        }
                        // isClearable={() => {
                        //   setSelectedStudentId("");
                        // }}
                      />
                      {nameError && (
                        <div className=" relative top-0.5 md:top-[50%] ml-1 text-danger text-md">
                          {nameError}
                        </div>
                      )}{" "}
                    </div>
                  </div>
                  <div className=" relative w-full  justify-between  md:w-[45%] my-1 md:my-4 flex  md:flex-row  ">
                    <label
                      htmlFor="GRnumber"
                      className=" mt-2 ml-0 md:ml-4 text-nowrap"
                    >
                      {" "}
                      GR No.
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      className="h-10 text-gray-600 p-1 border-1 border-gray-300 outline-blue-400 rounded-md w-[60%] md:w-[50%] "
                      id="GRnumber"
                      value={grNumber}
                      onChange={handleGrChange}
                    />
                    {/* {nameError && (
                      <div className=" absolute  top-10 ml-1 text-danger text-xs">
                        {nameError}
                      </div>
                    )}{" "} */}
                  </div>
                  <button
                    onClick={handleSearch}
                    type="button"
                    disabled={isSubmitting}
                    className=" my-1 md:my-4 btn h-10  w-18 md:w-auto btn-primary "
                  >
                    {isSubmitting ? "Searching..." : "Search"}
                  </button>
                </div>
              </div>
            </div>
            {subjects.length > 0 && (
              <div className="w-full  mt-4">
                <div className="card mx-auto lg:w-full shadow-lg">
                  <div className="p-2 px-3 bg-gray-100 border-none flex justify-between items-center">
                    <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
                      Student List
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
                          <tr className="bg-gray-100">
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Sr.No
                            </th>
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Roll No
                            </th>
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Photo
                            </th>
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Name
                            </th>
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Class
                            </th>
                            {/* <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Division
                            </th> */}
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              UserId
                            </th>
                            {(roleId === "A" || roleId === "M") && (
                              <>
                                <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                  Edit
                                </th>
                                <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                  Delete
                                </th>
                                <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                  Inactive
                                </th>
                              </>
                            )}

                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              View
                            </th>
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              RC & Certificates
                            </th>
                            <th className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Reset Password
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayedSections.length ? (
                            displayedSections.map((subject, index) => (
                              <tr key={subject.student_id} className="text-sm ">
                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  {currentPage * pageSize + index + 1}
                                </td>
                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  {subject?.roll_no}
                                </td>
                                {/* <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                {subject?.photo}
                              </td>{" "} */}
                                <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm py-1">
                                  {console.log(
                                    "the teacher image",
                                    `${subject?.image_url}`
                                  )}

                                  <img
                                    src={
                                      subject?.image_name
                                        ? `https://sms.evolvu.in/storage/app/public/student_images/${subject?.image_name}`
                                        : "https://via.placeholder.com/50"
                                    }
                                    alt={subject?.name}
                                    className="rounded-full w-8 h-8 lg:w-10 lg:h-10 object-cover"
                                  />
                                </td>
                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  {`${subject?.first_name ?? ""} ${
                                    subject?.mid_name
                                      ? subject.mid_name + " "
                                      : ""
                                  }${subject?.last_name ?? ""}`.trim()}
                                </td>

                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm text-nowrap">
                                  {`${subject?.get_class?.name}${" "}${
                                    subject?.get_division?.name
                                  }`}
                                </td>
                                {/* <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                {subject?.get_division?.name}
                              </td> */}
                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  {subject?.user_master?.user_id}
                                </td>
                                {(roleId === "A" || roleId === "M") && (
                                  <>
                                    <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                      <button
                                        onClick={() => handleEdit(subject)}
                                        className="text-blue-600 hover:text-blue-800 hover:bg-transparent "
                                      >
                                        <FontAwesomeIcon icon={faEdit} />
                                      </button>
                                    </td>
                                    {subject.isPromoted !== "Y" ? (
                                      <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                        <button
                                          onClick={() => handleDelete(subject)}
                                          className="text-red-600 hover:text-red-800 hover:bg-transparent "
                                        >
                                          <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                      </td>
                                    ) : (
                                      <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                        <button
                                          // onClick={() => ()}
                                          className="text-green-500-600 hover:text-green-800 hover:bg-transparent "
                                        >
                                          {/* <FontAwesomeIcon icon={faTrash} /> */}
                                        </button>
                                      </td>
                                    )}
                                    <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm hover:bg-none">
                                      <button
                                        onClick={() =>
                                          handleActiveAndInactive(subject)
                                        }
                                        className={`  font-bold hover:bg-none ${
                                          subject.isActive === "Y"
                                            ? "text-green-600 hover:text-green-800 hover:bg-transparent"
                                            : "text-red-700 hover:text-red-900  hover:bg-transparent"
                                        }`}
                                      >
                                        {subject.isActive === "Y" ? (
                                          <FaCheck className="text-xl" />
                                        ) : (
                                          <FontAwesomeIcon
                                            icon={faXmark}
                                            className="text-xl"
                                          />
                                        )}
                                      </button>
                                    </td>
                                  </>
                                )}

                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  <button
                                    onClick={() => handleView(subject)}
                                    className="text-blue-600 hover:text-blue-800 hover:bg-transparent "
                                  >
                                    <MdOutlineRemoveRedEye className="font-bold text-xl" />
                                  </button>
                                </td>
                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  <button
                                    onClick={() =>
                                      handleCertificateView(subject)
                                    }
                                    className="text-blue-600 hover:text-blue-800 hover:bg-transparent "
                                  >
                                    <TbFileCertificate className="font-bold text-xl" />
                                  </button>
                                </td>
                                <td className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm">
                                  <button
                                    onClick={() => handleResetPassword(subject)}
                                    className="text-blue-600 hover:text-blue-800 hover:bg-transparent "
                                  >
                                    <MdLockReset className="font-bold text-xl" />
                                  </button>
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
                  Are you sure you want to delete this student{" "}
                  {` ${currentSection?.classToDelete?.student_name} `} ?
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
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title">Reset Password</h5>
                  <RxCross1
                    className="float-end relative mt-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                    onClick={handleCloseModal}
                  />
                </div>
                <div
                  className="relative mb-3 h-1 w-[97%] mx-auto bg-red-700"
                  style={{ backgroundColor: "#C03078" }}
                ></div>

                <div className="modal-body">
                  {/* User ID Input */}
                  <div className="relative mb-3 flex justify-center mx-4">
                    <label htmlFor="userId" className="w-1/2 mt-2">
                      User ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={30}
                      className="form-control shadow-md mb-2"
                      id="userId"
                      value={userIdset} // Prefill userId
                      onChange={handleUserIdChange}
                    />
                    <div className="absolute top-9 left-1/3">
                      {errorMessage && (
                        <span className="text-danger text-xs">
                          {errorMessage}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Password Input
                  <div className="relative mb-3 flex justify-center mx-4">
                    <label htmlFor="newPassword" className="w-1/2 mt-2">
                      New Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      maxLength={30}
                      className="form-control shadow-md mb-2"
                      id="newPassword"
                      value={setPassword} // Prefill password
                      onChange={handleInputChange}
                    />
                    {passwordError && (
                      <span className="text-danger text-xs">
                        {passwordError}
                      </span>
                    )}
                  </div> */}
                </div>

                <div className="flex justify-end p-3">
                  <button
                    type="button"
                    className="btn btn-primary px-3 mb-2"
                    onClick={handleSubmitResetPassword}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Reseting..." : "Reset"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDActiveModal && (
        <div className="fixed inset-0 z-50   flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title">
                    {/* Confirm Activate or Deactivate */}
                    {currentStudentDataForActivate?.studentToActiveOrDeactive
                      ?.isActive === "Y"
                      ? `Confirm Deactivate`
                      : `Confirm Activate`}
                  </h5>
                  <RxCross1
                    className="float-end relative mt-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                    type="button"
                    // className="btn-close text-red-600"
                    onClick={handleCloseModal}
                  />
                  {console.log(
                    "the currecnt section inside activate or not of the managesubjhect",
                    currentStudentDataForActivate
                  )}
                </div>
                <div
                  className=" relative  mb-3 h-1 w-[97%] mx-auto bg-red-700"
                  style={{
                    backgroundColor: "#C03078",
                  }}
                ></div>
                <div className="modal-body">
                  {currentStudentDataForActivate?.studentToActiveOrDeactive
                    ?.isActive === "Y"
                    ? `Are you sure you want to deactivate this student ${currentStudentDataForActivate?.studentToActiveOrDeactive?.student_name}?`
                    : `Are you sure you want to activate this student ${currentStudentDataForActivate?.studentToActiveOrDeactive?.student_name}?`}
                </div>

                {/* <div className="modal-body">
                  Are you sure you want to Activate or Deactivate this student{" "}
                  {` ${currentStudentDataForActivate?.studentToActiveOrDeactive?.student_name} `}{" "}
                  ?
                </div> */}
                <div className=" flex justify-end p-3">
                  <button
                    type="button"
                    className="btn btn-primary px-3 mb-2"
                    onClick={handleActivateOrNot}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Activating..." : "Active"}
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

export default ManageSubjectList;
