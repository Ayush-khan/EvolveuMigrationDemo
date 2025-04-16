import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import LoaderStyle from "../../componants/common/LoaderFinal/LoaderStyle";

const SiblingMapping = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentForSecond, setSelectedStudentForSecond] =
    useState(null);
  const [classesforForm, setClassesforForm] = useState([]);
  const [studentNameWithClassId, setStudentNameWithClassId] = useState([]);
  const [classesforFormForSecond, setClassesforFormForSecond] = useState([]);
  const [studentNameWithClassIdForSecond, setStudentNameWithClassIdForSecond] =
    useState([]);
  const [classIdForSearch, setClassIdForSearch] = useState(null);
  const [classIdForSearchForSecond, setClassIdForSearchForSecond] =
    useState(null);

  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedStudentIdForSecond, setSelectedStudentIdForSecond] =
    useState(null);
  const [radioButtonError, setRadioButtonError] = useState("");
  const [nameError, setNameError] = useState("");
  const [nameErrorForClass, setNameErrorForClass] = useState("");
  const [nameErrorForSecond, setNameErrorForSecond] = useState("");
  const [nameErrorForClassForSecond, setNameErrorForClassForSecond] =
    useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedClassForSecond, setSelectedClassForSecond] = useState(null);

  const [parentInformation, setParentInformation] = useState(null);
  const [parentInformationForSecond, setParentInformationForSecond] =
    useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingForSearch, setLoadingForSearch] = useState(false);
  const [loadingForSearchForSecond, setLoadingForSearchForSecond] =
    useState(false);

  const navigate = useNavigate();
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      fontSize: "0.8rem",
      backgroundColor: state.isFocused ? "rgba(59, 130, 246, 0.1)" : "white",
      color: state.isSelected ? "blue" : "inherit", // Ensures selected value is black
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 50, // To ensure proper stacking
    }),
  };
  const [selectedParent, setSelectedParent] = useState("");
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!selectedParent) {
      alert("Please select a form before submitting!");
      return;
    }
    console.log("Form submitted for:", selectedParent);
  };
  const [formData, setFormData] = useState({
    stud_name: "", // Combined name with class and division
    father_name: "",
    mother_name: "", // Added mother's name
    father_email: "",
    father_phone: "",
    mother_email: "",
    mother_phone: "",
    user_id: "", // User ID set as Parent (Father Phone here)
  });
  const [formDataForSecond, setFormDataForSecond] = useState({
    stud_name: "", // Combined name with class and division
    father_name: "",
    mother_name: "", // Added mother's name
    father_email: "",
    father_phone: "",
    mother_email: "",
    mother_phone: "",
    user_id: "", // User ID set as Parent (Father Phone here)
  });

  // for form
  const [errors, setErrors] = useState({});
  const [backendErrors, setBackendErrors] = useState({});

  // Get today's date in YYYY-MM-DD format
  // Calculate today's date
  const today = new Date().toISOString().split("T")[0];
  // State for loading indicators
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingClassesForSecond, setLoadingClassesForSecond] = useState(false);
  const [loadingStudentsForSecond, setLoadingStudentsForSecond] =
    useState(false);

  useEffect(() => {
    // Fetch both classes and student names on component mount
    fetchInitialDataAndStudents();
    fetchInitialDataAndStudentsForSecond();
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
      setClassesforForm(classResponse.data || []);
      setStudentNameWithClassId(studentResponse?.data?.data || []);
    } catch (error) {
      toast.error("Error fetching data.");
    } finally {
      // Stop loading for both dropdowns
      setLoadingClasses(false);
      setLoadingStudents(false);
    }
  };

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

  const fetchInitialDataAndStudentsForSecond = async () => {
    try {
      setLoadingClassesForSecond(true);
      setLoadingStudentsForSecond(true);

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
      setClassesforFormForSecond(classResponse.data || []);
      setStudentNameWithClassIdForSecond(studentResponse?.data?.data || []);
    } catch (error) {
      toast.error("Error fetching data.");
    } finally {
      // Stop loading for both dropdowns
      setLoadingClassesForSecond(false);
      setLoadingStudentsForSecond(false);
    }
  };

  const fetchStudentNameWithClassIdForSecond = async (section_id = null) => {
    try {
      setLoadingStudentsForSecond(true);

      const params = section_id ? { section_id } : {};
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        `${API_URL}/api/getStudentListBySectionData`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      setStudentNameWithClassIdForSecond(response?.data?.data || []);
    } catch (error) {
      toast.error("Error fetching students.");
    } finally {
      setLoadingStudentsForSecond(false);
    }
  };

  const handleClassSelect = (selectedOption) => {
    setSelectedClass(selectedOption);
    setSelectedStudent(null);
    setSelectedStudentId(null);
    setClassIdForSearch(selectedOption?.value);
    fetchStudentNameWithClassId(selectedOption?.value);
  };
  const handleClassSelectForSecond = (selectedOption) => {
    setSelectedClassForSecond(selectedOption);
    setSelectedStudentForSecond(null);
    setSelectedStudentIdForSecond(null);
    setClassIdForSearchForSecond(selectedOption?.value);
    fetchStudentNameWithClassIdForSecond(selectedOption?.value);
  };

  const handleStudentSelect = (selectedOption) => {
    setNameError(""); // Reset student error on selection
    setSelectedStudent(selectedOption);
    setSelectedStudentId(selectedOption?.value);
    handleSearch(selectedOption?.value);
  };
  const handleStudentSelectForSecond = (selectedOption) => {
    setNameErrorForSecond(""); // Reset student error on selection
    setSelectedStudentForSecond(selectedOption);
    setSelectedStudentIdForSecond(selectedOption?.value);
    handleSearchForSecond(selectedOption?.value);
  };

  // Dropdown options
  const classOptions = useMemo(
    () =>
      classesforForm.map((cls) => ({
        value: cls.section_id,
        label: `${cls?.get_class?.name || ""} ${cls?.name || ""} (${
          cls?.students_count || ""
        })`,
        key: `${cls.class_id}-${cls.section_id}`,
      })),
    [classesforForm]
  );

  const studentOptions = useMemo(
    () =>
      studentNameWithClassId.map((stu) => ({
        value: stu.student_id,
        label: `${stu?.first_name || ""} ${stu?.mid_name || ""} ${
          stu?.last_name || ""
        }`,
      })),
    [studentNameWithClassId]
  );
  // Dropdown options
  const classOptionsForSecond = useMemo(
    () =>
      classesforFormForSecond.map((cls) => ({
        value: cls.section_id,
        label: `${cls?.get_class?.name || ""} ${cls.name || ""} (${
          cls.students_count || ""
        })`,
        key: `${cls.class_id}-${cls.section_id}`,
      })),
    [classesforFormForSecond]
  );

  const studentOptionsForSecond = useMemo(
    () =>
      studentNameWithClassIdForSecond.map((stu) => ({
        value: stu.student_id,
        label: `${stu?.first_name || ""} ${stu?.mid_name || ""} ${
          stu?.last_name || ""
        }`,
      })),
    [studentNameWithClassIdForSecond]
  );
  const handleSearch = async (selectedStudent1) => {
    // Reset error messages
    setNameError("");
    setNameErrorForClass("");
    setRadioButtonError("");
    setSelectedParent("");
    setErrors({}); // Clears all field-specific errors

    if (!selectedStudent1) {
      setNameError("Please select Student Name.");
      toast.error("Please select Student Name.!");
      return;
    }
    // Reset form data and selected values after successful submission
    setParentInformation(null);
    setFormData({
      stud_name: "", // Combined name with class and division
      parent_id: "",

      father_name: "",
      mother_name: "", // Added mother's name
      father_email: "",
      father_phone: "",
      mother_email: "",
      mother_phone: "",
      user_id: "", // User ID set as Parent (Father Phone here)
    });
    try {
      setLoadingForSearch(true); // Start loading
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/get_students`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { student_id: selectedStudent1 }, // Pass query parameters here
      });

      // Check if data was received and update the form state
      if (response?.data?.students) {
        const fetchedData = response?.data?.students; // Extract the data
        setParentInformation(fetchedData); // Assuming response data contains form data
        console.log("fetchedData", fetchedData);

        // Check if the fetchedData array is not empty
        if (fetchedData && fetchedData.length > 0) {
          const student = fetchedData[0]; // Access the first student in the array (or handle multiple students if needed)

          // Populate formData with the fetched student data
          setFormData({
            stud_name: `${student?.first_name || ""} ${
              student?.mid_name || ""
            } ${student?.last_name || ""} (${student?.get_class?.name || ""}-${
              student?.get_division?.name || ""
            })`, // Combined name with class and division
            father_name: student?.parents?.father_name || "",
            mother_name: student?.parents?.mother_name || "", // Mother's name
            father_email: student?.parents?.f_email || "",
            father_phone: student?.parents?.f_mobile || "",
            parent_id: student?.parents?.parent_id || "",

            mother_email: student?.parents?.m_emailid || "",
            mother_phone: student?.parents?.m_mobile || "",
            user_id: student?.user_master?.user_id || "", // User ID set as Parent (Father Email here)
          });
        } else {
          console.error("No students found in the response.");
        }
      } else {
        console.log("reponse", response.data.status);
      }
    } catch (error) {
      console.log("error", error.response.data.message);
      if (
        error.response.data.message ==
        "No student found matching the search criteria."
      ) {
        toast.error("student information not found!");
      } else {
        toast.error(error.response.data.message || "student not found!");
      }
    } finally {
      setLoadingForSearch(false);
    }
  };
  const handleSearchForSecond = async (selectedStudent1) => {
    // Reset error messages
    setNameErrorForSecond("");
    setNameErrorForClassForSecond("");
    setRadioButtonError("");
    setSelectedParent("");
    setErrors({}); // Clears all field-specific errors

    if (!selectedStudent1) {
      setNameErrorForSecond("Please select Student Name.");
      toast.error("Please select Student Name.!");
      return;
    }
    setParentInformationForSecond(null); // Assuming response data contains form data

    setFormDataForSecond({
      parent_id: "",
      stud_name: "", // Combined name with class and division
      father_name: "",
      mother_name: "", // Added mother's name
      father_email: "",
      father_phone: "",
      mother_email: "",
      mother_phone: "",
      user_id: "", // User ID set as Parent (Father Phone here)
    });
    try {
      setLoadingForSearchForSecond(true); // Start loading
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/get_students`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { student_id: selectedStudent1 }, // Pass query parameters here
      });

      // Check if data was received and update the form state
      if (response?.data?.students) {
        const fetchedData = response?.data?.students; // Extract the data
        setParentInformationForSecond(fetchedData); // Assuming response data contains form data
        console.log("fetchedData", fetchedData);

        // Check if the fetchedData array is not empty
        if (fetchedData && fetchedData.length > 0) {
          const student = fetchedData[0]; // Access the first student in the array (or handle multiple students if needed)

          // Populate formData with the fetched student data
          setFormDataForSecond({
            stud_name: `${student?.first_name || ""} ${
              student?.mid_name || ""
            } ${student?.last_name || ""} (${student?.get_class?.name || ""}-${
              student?.get_division?.name || ""
            })`, // Combined name with class and division
            father_name: student?.parents?.father_name || "",
            mother_name: student?.parents?.mother_name || "", // Mother's name
            father_email: student?.parents?.f_email || "",
            parent_id: student?.parents?.parent_id || "",

            father_phone: student?.parents?.f_mobile || "",
            mother_email: student?.parents?.m_emailid || "",
            mother_phone: student?.parents?.m_mobile || "",
            user_id: student?.user_master?.user_id || "", // User ID set as Parent (Father Email here)
          });
        } else {
          console.error("No students found in the response.");
        }
      } else {
        console.log("reponse", response.data.status);
      }
    } catch (error) {
      console.log("error", error.response.data.message);
      if (
        error.response.data.message ==
        "No student found matching the search criteria."
      ) {
        toast.error("student information not found!");
      } else {
        toast.error(error.response.data.message || "student not found!");
      }
    } finally {
      setLoadingForSearchForSecond(false);
    }
  };

  const formatDateString = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };
  const handleChange = (value) => {
    setSelectedParent(value);
    // Clear the error message when a selection is made
    setRadioButtonError("");
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    let hasError = false;

    if (!selectedStudentId) {
      setNameError("Please select a student.");
      hasError = true;
    }
    if (!selectedStudentIdForSecond) {
      setNameErrorForSecond("Please select a student.");
      hasError = true;
    }
    if (!selectedParent) {
      setRadioButtonError(
        "Please select any one of 'Set this as parent' option."
      );
      hasError = true;
    }
    if (hasError) {
      return;
    }
    // Validation checks
    if (selectedStudentId === selectedStudentIdForSecond) {
      toast.error(
        "🚫 Both students cannot be the same. Please select different students!",
        {
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return;
    }
    // Prepare the data format as per requirement
    const requestData = {
      operation: "create",
      set_as_parent: selectedParent, // Example: "2" if parent 2 is selected
      student_id1: selectedStudentId,
      student_id2: selectedStudentIdForSecond,
      parent_id1: formData?.parent_id || " ", // Ensure these are set properly
      parent_id2: formDataForSecond?.parent_id || " ",
    };

    console.log("Request Data:", requestData);

    try {
      setLoading(true);

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token is found");
      }

      const response = await axios.post(
        `${API_URL}/api/save_siblingmapping`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Student Mapping successfully!");

        // Reset form data and selections
        setSelectedStudent(null);
        setSelectedStudentForSecond(null);
        setSelectedClass(null);
        setSelectedClassForSecond(null);
        setSelectedParent("");
        setParentInformation(null);
        setParentInformationForSecond(null);
        setNameError("");
        setNameErrorForSecond("");
        setRadioButtonError("");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred!");
      console.error("Error:", error.response || error.message);
    } finally {
      setLoading(false);
    }
  };
  const reset = () => {
    setSelectedStudent(null);
    setSelectedStudentForSecond(null);
    setSelectedClass(null);
    setSelectedClassForSecond(null);
    setSelectedParent("");
    setParentInformation(null);
    setParentInformationForSecond(null);
    setNameError("");
    setNameErrorForSecond("");
    setRadioButtonError("");
  };
  const handleNavigation = () => {
    navigate("/dashboard");
  };
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   // Validate if class and student are selected
  //   if (selectedStudentId === selectedStudentIdForSecond) {
  //     toast.error(
  //       "🚫 Both students cannot be the same. Please select different students!",
  //       {
  //         // position: "rigt-center",
  //         autoClose: 5000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         // theme: "colored",
  //       }
  //     );
  //     return;
  //   }
  //   let hasError = false;
  //   if (!selectedStudentIdForSecond) {
  //     setNameErrorForSecond("Please select a student.");
  //     hasError = true;
  //   }
  //   if (!selectedStudentId) {
  //     setNameError("Please select a student.");
  //     hasError = true;
  //   }
  //   if (!selectedParent) {
  //     setRadioButtonError(
  //       "Please select any one of 'Set this as parent' option."
  //     );
  //     hasError = true;
  //   }
  //   if (hasError) {
  //     return;
  //   }
  //   console.log("selectedParent", selectedParent);

  //   const formattedFormData = {
  //     ...formData,
  //     dob: formatDateString(formData.dob),
  //     date: formatDateString(formData.date),
  //   };

  //   try {
  //     setLoading(true); // Start loading

  //     const token = localStorage.getItem("authToken");
  //     if (!token) {
  //       throw new Error("No authentication token is found");
  //     }

  //     // Make an API call with the "blob" response type to download the PDF
  //     const response = await axios.post(
  //       `${API_URL}/api/save_siblingmapping`,
  //       formattedFormData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       toast.success("Student Mapping successfully!");
  //       // Reset form data and selected values after successful submission
  //       setFormData({
  //         sr_no: "",
  //         stud_name: "",
  //         father_name: "",
  //         dob: "",
  //         dob_words: "",
  //         date: "",
  //         class_division: "",
  //         purpose: "",
  //         nationality: "",

  //         // Add other fields here if needed
  //       });
  //       setSelectedClass(null); // Reset class selection
  //       setSelectedStudent(null); // Reset student selection
  //       setSelectedClassForSecond(null); // Reset class selection
  //       setSelectedStudentForSecond(null); // Reset student selection
  //       setNameErrorForSecond("");
  //       setNameErrorForClassForSecond("");
  //       setRadioButtonError("");
  //       setSelectedParent("");
  //       setErrors({});
  //       setBackendErrors({});
  //       setTimeout(() => {
  //         setParentInformation(null);
  //         setParentInformationForSecond(null);
  //       }, 3000);
  //     }
  //   } catch (error) {
  //     console.log("error", error.response.data.message);

  //     toast.error(error.response.data.message || "student not found!");
  //   } finally {
  //     setLoading(false); // Stop loading
  //   }
  // };

  return (
    <div>
      <ToastContainer />

      <div className=" w-full md:w-[95%] mt-4 mx-auto">
        <div className="card mx-auto lg:w-[100%] shadow-lg">
          <div className=" w-full  p-2 px-3 bg-gray-100 flex justify-between items-center ">
            <h3 className=" w-full text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
              Sibling Mapping
            </h3>
            {/* <div className="flex justify-between p-3"> */}
            <RxCross1
              className=" relative top-0.5  text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
              type="button"
              onClick={handleNavigation}
            />
            {/* </div> */}
            <div className="box-border flex md:gap-x-2 justify-end md:h-10"></div>
          </div>
          <div
            className=" relative w-[97%]    h-1  mx-auto bg-red-700"
            style={{
              backgroundColor: "#C03078",
            }}
          ></div>
          <div className="w-full  flex flex-col md:flex-row">
            <div className="     w-full md:container ">
              {/* Search Section */}
              <div className=" w-[95%] border-1  flex justify-center flex-col md:flex-row gap-x-1  bg-white rounded-lg  border-gray-300 shadow-md  mx-auto mt-6 p-6 mb-4 ">
                <div className="w-[99%] flex md:flex-row justify-between items-center ">
                  <div className="w-full flex flex-col gap-y-2 md:gap-y-0 md:flex-row">
                    <div className="w-full gap-x-14 md:gap-x-6 md:justify-start my-1 md:my-4 flex md:flex-row">
                      <label
                        className="text-[.9em] mt-1.5 mr-1 md:mr-0"
                        htmlFor="classSelect"
                      >
                        Class
                      </label>
                      <div className="w-full md:w-[50%]">
                        <Select
                          id="classSelect"
                          value={selectedClass}
                          onChange={handleClassSelect}
                          options={classOptions}
                          placeholder={loadingClasses ? "Loading..." : "Select"}
                          isSearchable
                          isClearable
                          className="text-[.8em]"
                          styles={customStyles} // Apply custom styles
                          isDisabled={loadingClasses}
                        />
                      </div>
                    </div>

                    <div className=" w-full gap-x-6 relative left-0 md:-left-[5%] justify-between md:w-[98%] my-1 md:my-4 flex md:flex-row">
                      <label
                        className="md:w-[50%] text-[.9em] mt-1.5"
                        htmlFor="studentSelect"
                      >
                        Student Name
                      </label>
                      <div className="w-full md:w-[80%]">
                        <Select
                          id="studentSelect"
                          value={selectedStudent}
                          onChange={handleStudentSelect}
                          options={studentOptions}
                          placeholder={
                            loadingStudents ? "Loading..." : "Select"
                          }
                          isSearchable
                          isClearable
                          className="text-[.8em]"
                          styles={customStyles} // Apply custom styles
                          isDisabled={loadingStudents}
                        />
                        {nameError && (
                          <div className="h-8 relative ml-1 text-danger text-xs">
                            {nameError}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Section - Displayed when parentInformation is fetched */}

              {loadingForSearch ? (
                <div className="flex justify-center items-center h-44">
                  <LoaderStyle />
                </div>
              ) : (
                parentInformation && (
                  // <div className="container mx-auto p-4 ">
                  <div className=" w-full  md:container mx-auto py-4 p-4 px-4  ">
                    <div className="card  px-3 rounded-md ">
                      {/* <div className="card p-4 rounded-md "> */}
                      <div className=" card-header mb-4 flex justify-between items-center ">
                        <h5 className="text-gray-700 mt-1 text-md lg:text-lg">
                          Student Information
                        </h5>
                      </div>
                      <div
                        className=" relative w-full   -top-6 h-1  mx-auto bg-red-700"
                        style={{
                          backgroundColor: "#C03078",
                        }}
                      ></div>

                      <form
                        onSubmit={handleSubmit}
                        className="flex flex-col justify-center items-center overflow-x-hidden shadow-md p-2 pt-0 bg-gray-50 mb-4 "
                      >
                        <div className="flex  flex-col w-full   md:mx-10  pb-6  px-6">
                          {/* Student Name */}
                          <div className="flex   flex-col md:flex-row md:items-center gap-y-2 gap-x-8">
                            <label
                              htmlFor="stud_name"
                              className="block font-semibold text-[1em] md:w-1/3 text-gray-700"
                            >
                              Student Name :
                            </label>
                            <p className="text-gray-700  relative top-2 md:w-[60%] ">
                              {formData.stud_name || ""}
                            </p>
                          </div>

                          {/* Father's Name */}
                          <div className="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-8">
                            <label
                              htmlFor="father_name"
                              className="block font-semibold text-[1em] md:w-1/3 text-gray-700"
                            >
                              Father's Name :
                            </label>
                            <p className="text-gray-700 relative top-2  md:w-[60%] ">
                              {formData.father_name || ""}
                            </p>
                          </div>

                          {/* Mother's Name */}
                          <div className="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-8">
                            <label
                              htmlFor="mother_name"
                              className="block font-semibold text-[1em] md:w-1/3 text-gray-700"
                            >
                              Mother's Name :
                            </label>
                            <p className="text-gray-700 relative top-2  md:w-[60%] ">
                              {formData.mother_name || ""}
                            </p>
                          </div>

                          {/* Father's Email */}
                          <div className="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-8">
                            <label
                              htmlFor="father_email"
                              className="block font-semibold text-[1em] md:w-1/3 text-gray-700"
                            >
                              Father's Email :
                            </label>
                            <p className="text-gray-700 relative top-2  md:w-[60%] ">
                              {formData.father_email || ""}
                            </p>
                          </div>

                          {/* Father's Phone */}
                          <div className="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-8">
                            <label
                              htmlFor="father_phone"
                              className="block font-semibold text-[1em] md:w-1/3 text-gray-700"
                            >
                              Father's Phone :
                            </label>
                            <p className="text-gray-700 relative top-2  md:w-[60%] ">
                              {formData.father_phone || ""}
                            </p>
                          </div>

                          {/* Mother's Email */}
                          <div className="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-8">
                            <label
                              htmlFor="mother_email"
                              className="block font-semibold text-[1em] md:w-1/3 text-gray-700"
                            >
                              Mother's Email :
                            </label>
                            <p className="text-gray-700 relative top-2  md:w-[60%] ">
                              {formData.mother_email || ""}
                            </p>
                          </div>

                          {/* Mother's Phone */}
                          <div className="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-8">
                            <label
                              htmlFor="mother_phone"
                              className="block font-semibold text-[1em] md:w-1/3 text-gray-700"
                            >
                              Mother's Phone :
                            </label>
                            <p className="text-gray-700 relative top-2  md:w-[60%] ">
                              {formData.mother_phone || ""}
                            </p>
                          </div>

                          {/* User ID */}
                          <div className="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-8">
                            <label
                              htmlFor="user_id"
                              className="block font-semibold text-[1em] md:w-1/3 text-gray-700"
                            >
                              User ID :
                            </label>
                            <p className="text-gray-700 relative top-2  md:w-[60%] ">
                              {formData.user_id || ""}
                            </p>
                          </div>

                          {/* Radio Button */}
                          <div className="flex  relative left-0 md:left-7 flex-row items-center justify-center gap-x-4 mt-4 ">
                            <input
                              type="radio"
                              id="parent1"
                              name="setAsParent"
                              value="form1"
                              className="w-4 h-4    hover:cursor-pointer "
                              checked={selectedParent === "1"} // Controlled component
                              onChange={() => handleChange("1")}
                              required
                            />
                            <label
                              htmlFor="parent1"
                              className="text-gray-700 hover:cursor-pointer"
                            >
                              Set this as parent
                            </label>{" "}
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="     w-full md:container ">
              <div className=" w-[95%] border-1  flex justify-center flex-col md:flex-row gap-x-1  bg-white rounded-lg  border-gray-300 shadow-md  mx-auto mt-6 p-6 mb-4 ">
                {" "}
                <div className="w-[99%] flex md:flex-row justify-between items-center">
                  <div className="w-full flex flex-col gap-y-2 md:gap-y-0 md:flex-row">
                    <div className="w-full gap-x-14 md:gap-x-6 md:justify-start my-1 md:my-4 flex md:flex-row">
                      <label
                        className="text-[.9em] mt-1.5 mr-1 md:mr-0"
                        htmlFor="classSelect"
                      >
                        Class
                      </label>
                      <div className="w-full md:w-[50%]">
                        <Select
                          id="classSelect"
                          value={selectedClassForSecond}
                          onChange={handleClassSelectForSecond}
                          options={classOptionsForSecond}
                          placeholder={
                            loadingClassesForSecond ? "Loading..." : "Select"
                          }
                          isSearchable
                          isClearable
                          className="text-[.8em]"
                          styles={customStyles} // Apply custom styles
                          isDisabled={loadingClassesForSecond}
                        />
                      </div>
                    </div>

                    <div className="w-full gap-x-6 relative left-0 md:-left-[5%] justify-between md:w-[98%] my-1 md:my-4 flex md:flex-row">
                      <label
                        className="md:w-[50%] text-[.9em] mt-1.5"
                        htmlFor="studentSelect"
                      >
                        Student Name
                      </label>
                      <div className="w-full md:w-[80%]">
                        <Select
                          id="studentSelect"
                          value={selectedStudentForSecond}
                          onChange={handleStudentSelectForSecond}
                          options={studentOptionsForSecond}
                          placeholder={
                            loadingStudentsForSecond ? "Loading..." : "Select"
                          }
                          isSearchable
                          isClearable
                          className="text-[.8em]"
                          styles={customStyles} // Apply custom styles
                          isDisabled={loadingStudentsForSecond}
                        />
                        {nameErrorForSecond && (
                          <div className="h-8 relative ml-1 text-danger text-xs">
                            {nameErrorForSecond}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Section - Displayed when parentInformation is fetched */}

              {loadingForSearchForSecond ? (
                <div className="flex justify-center items-center h-44">
                  <LoaderStyle />
                </div>
              ) : (
                parentInformationForSecond && (
                  // <div className="container mx-auto p-4 ">
                  <div className=" w-full  md:container mx-auto py-4 p-4 px-4  ">
                    <div className="card  px-3 rounded-md ">
                      {/* <div className="card p-4 rounded-md "> */}
                      <div className=" card-header mb-4 flex justify-between items-center ">
                        <h5 className="text-gray-700 mt-1 text-md lg:text-lg">
                          Student Information
                        </h5>
                      </div>
                      <div
                        className=" relative w-full   -top-6 h-1  mx-auto bg-red-700"
                        style={{
                          backgroundColor: "#C03078",
                        }}
                      ></div>

                      <form
                        onSubmit={handleSubmit}
                        className="flex flex-col justify-center items-center overflow-x-hidden shadow-md p-2 pt-0 bg-gray-50 mb-4"
                      >
                        <div className="flex  flex-col w-full   md:mx-10  pb-6  px-6">
                          {/* Student Name */}
                          <div className="flex   flex-col md:flex-row md:items-center gap-y-2 gap-x-8">
                            <label
                              htmlFor="stud_name"
                              className="block font-semibold text-[1em] md:w-1/3 text-gray-700"
                            >
                              Student Name :
                            </label>
                            <p className="text-gray-700  relative top-2 md:w-[60%] ">
                              {formDataForSecond.stud_name || ""}
                            </p>
                          </div>

                          {/* Father's Name */}
                          <div className="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-8">
                            <label
                              htmlFor="father_name"
                              className="block font-semibold text-[1em] md:w-1/3 text-gray-700"
                            >
                              Father's Name :
                            </label>
                            <p className="text-gray-700 relative top-2  md:w-[60%] ">
                              {formDataForSecond.father_name || ""}
                            </p>
                          </div>

                          {/* Mother's Name */}
                          <div className="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-8">
                            <label
                              htmlFor="mother_name"
                              className="block font-semibold text-[1em] md:w-1/3 text-gray-700"
                            >
                              Mother's Name :
                            </label>
                            <p className="text-gray-700 relative top-2  md:w-[60%] ">
                              {formDataForSecond.mother_name || ""}
                            </p>
                          </div>

                          {/* Father's Email */}
                          <div className="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-8">
                            <label
                              htmlFor="father_email"
                              className="block font-semibold text-[1em] md:w-1/3 text-gray-700"
                            >
                              Father's Email :
                            </label>
                            <p className="text-gray-700 relative top-2  md:w-[60%] ">
                              {formDataForSecond.father_email || ""}
                            </p>
                          </div>

                          {/* Father's Phone */}
                          <div className="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-8">
                            <label
                              htmlFor="father_phone"
                              className="block font-semibold text-[1em] md:w-1/3 text-gray-700"
                            >
                              Father's Phone :
                            </label>
                            <p className="text-gray-700 relative top-2  md:w-[60%] ">
                              {formDataForSecond.father_phone || ""}
                            </p>
                          </div>

                          {/* Mother's Email */}
                          <div className="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-8">
                            <label
                              htmlFor="mother_email"
                              className="block font-semibold text-[1em] md:w-1/3 text-gray-700"
                            >
                              Mother's Email :
                            </label>
                            <p className="text-gray-700 relative top-2  md:w-[60%] ">
                              {formDataForSecond.mother_email || ""}
                            </p>
                          </div>

                          {/* Mother's Phone */}
                          <div className="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-8">
                            <label
                              htmlFor="mother_phone"
                              className="block font-semibold text-[1em] md:w-1/3 text-gray-700"
                            >
                              Mother's Phone :
                            </label>
                            <p className="text-gray-700 relative top-2  md:w-[60%] ">
                              {formDataForSecond.mother_phone || ""}
                            </p>
                          </div>

                          {/* User ID */}
                          <div className="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-8">
                            <label
                              htmlFor="user_id"
                              className="block font-semibold text-[1em] md:w-1/3 text-gray-700"
                            >
                              User ID :
                            </label>
                            <p className="text-gray-700 relative top-2  md:w-[60%] ">
                              {formDataForSecond.user_id || ""}
                            </p>
                          </div>
                          {/* Radio Button */}
                          <div className="flex flex-row relative left-0 md:left-7 items-center justify-center gap-x-4 mt-4 ">
                            <input
                              type="radio"
                              id="parent2"
                              name="setAsParent"
                              value="form2"
                              className="w-4 h-4 hover:cursor-pointer"
                              checked={selectedParent === "2"} // Controlled component
                              onChange={() => handleChange("2")}
                              required
                            />
                            <label
                              htmlFor="parent2"
                              className=" hover:cursor-pointer text-gray-700"
                            >
                              Set this as parent
                            </label>
                            {radioButtonError && (
                              <div className=" ml-1 text-danger text-xs">
                                {radioButtonError}
                              </div>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="w-[98%] mx-auto mb-2  text-right">
            <button
              type="reset"
              onClick={reset}
              className={` bg-red-500 mr-2 text-white font-bold py-1 border-1 border-red-500 px-4 rounded ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Reset
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              style={{ backgroundColor: "#2196F3" }}
              className={`text-white font-bold py-1 border-1 border-blue-500 px-4 rounded ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-4 w-4 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiblingMapping;
