import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { useRef } from "react";
// import Loader from "../common/LoaderFinal/LoaderStyle";

const TeacherPeriodAllocation = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const inputRefs = useRef({});
  const [errors, setErrors] = useState({});

  const [currentPage, setCurrentPage] = useState(0);
  const [departmentNameId, setDepartmentNameId] = useState([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  // const [loading, setLoading] = useState(false);
  const [loadingForSearch, setLoadingForSearch] = useState(false);

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  const navigate = useNavigate();
  const [loadingExams, setLoadingExams] = useState(false);
  const [studentError, setDepartmentError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [timetable, setTimetable] = useState([]);

  const [selectAll, setSelectAll] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
  const [periodValue, setPeriodValue] = useState(""); // Stores user-input period
  const [allocatedPeriods, setAllocatedPeriods] = useState({}); // Stores periods for all rows

  const pageSize = 10;
  const [pageCount, setPageCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchExams();
    fetchSubjects();
    handleSearch();
  }, []);

  const fetchExams = async () => {
    try {
      setLoadingExams(true);
      const token = localStorage.getItem("authToken");

      const response = await axios.get(`${API_URL}/api/get_departments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Class", response);
      setDepartmentNameId(response?.data?.data || []);
    } catch (error) {
      toast.error("Error fetching Departments");
      console.error("Error fetching Departments:", error);
    } finally {
      setLoadingExams(false);
    }
  };

  const handleDepartmentChange = (selectedOption) => {
    setDepartmentError(""); // Reset error if student is select.
    setSelectedDepartment(selectedOption);
    setSelectedDepartmentId(selectedOption?.value);
  };

  const fetchSubjects = async () => {
    try {
      setLoadingExams(true);
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        `${API_URL}/api/get_subjectwithoutsocial`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Subjects", response);
      setSubjects(response?.data?.data || []);
    } catch (error) {
      toast.error("Error fetching Subjects");
      console.error("Error fetching Subjects:", error);
    } finally {
      setLoadingExams(false);
    }
  };

  const handleSubjectSelect = (selectedOption) => {
    setDepartmentError("");
    setSelectedSubject(selectedOption);
    setSelectedSubjectId(selectedOption?.value);
  };

  const subjectOptions = useMemo(
    () =>
      subjects.map((cls) => ({
        value: cls?.sm_id,
        label: `${cls.name}`,
      })),
    [subjects]
  );

  const departmentOptions = useMemo(
    () =>
      departmentNameId.map((cls) => ({
        value: cls?.department_id,
        label: `${cls.name}`,
      })),
    [departmentNameId]
  );

  // Handle search and fetch parent information
  // const handleSearch = async () => {
  //   setLoadingForSearch(false);

  //   setSearchTerm("");
  //   try {
  //     setLoadingForSearch(true); // Start loading
  //     setTimetable([]);
  //     const token = localStorage.getItem("authToken");
  //     const params = {};
  //     if (selectedDepartmentId) params.name = selectedDepartmentId;
  //     if (selectedSubjectId) params.sm_id = selectedSubjectId;

  //     const response = await axios.get(
  //       `${API_URL}/api/get_teacherperiodallocation`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //         params,
  //       }
  //     );

  //     if (!response?.data?.data || response?.data?.data?.length === 0) {
  //       toast.error("Teacher Period Allocation data not found.");
  //       setTimetable([]);
  //     } else {
  //       setTimetable(response?.data?.data);
  //       setPageCount(Math.ceil(response?.data?.data?.length / pageSize)); // Set page count based on response size
  //     }
  //   } catch (error) {
  //     console.error("Error fetching Teacher Period Allocation:", error);
  //     toast.error("Error fetching Teacher Period Allocation. Please try again.");
  //   } finally {
  //     setIsSubmitting(false); // Re-enable the button after the operation
  //     setLoadingForSearch(false);
  //   }
  // };

  const handleSearch = async () => {
    setSearchTerm("");

    try {
      setLoadingForSearch(true); // Start loading
      setTimetable([]);
      const token = localStorage.getItem("authToken");

      // Correct API parameters
      const params = {};
      if (selectedDepartmentId)
        params.departmentname = selectedDepartment.label; // Fix parameter name
      if (selectedSubjectId) params.subject = selectedSubjectId; // Fix parameter name

      console.log("API Request Params:", params); // Debugging: Check if params are correct

      const response = await axios.get(
        `${API_URL}/api/get_teacherperiodallocation`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      console.log("API Response Data:", response?.data?.data); // Debugging

      if (!response?.data?.data || response?.data?.data?.length === 0) {
        toast.error("Teacher Period Allocation data not found.");
        setTimetable([]);
      } else {
        setTimetable(response?.data?.data);
        setPageCount(Math.ceil(response?.data?.data?.length / pageSize)); // Set pagination
      }
    } catch (error) {
      console.error("Error fetching Teacher Period Allocation:", error);
      toast.error(
        "Error fetching Teacher Period Allocation. Please try again."
      );
    } finally {
      setIsSubmitting(false);
      setLoadingForSearch(false);
    }
  };

  // console.log("row", timetable);

  // const handleSubmit = async () => {
  //   setLoadingForSearch(false);

  //   try{
  //     const token = localStorage.getItem("authToken");
  //     const params = {} ;

  //     const response = await axios.post(
  //       `${API_URL}/api/get_teacherperiodallocation`,
  //       {
  //         headers: {Authorization : `Bearer ${token}`},
  //         params,
  //       }
  //     );

  //     const {data} = response

  //     if(!data.success)
  //     {
  //       toast.error("Teacher Period Allocation not Created .")
  //     }
  //     else{
  //       toast.error("Teacher Period Allocation Created Successfully.")
  //     }
  //   }
  //   catch(error)
  //   {
  //     console.error("Error Submitting Teacher Period Allocation:", error);
  //     toast.error("Error Submitting Teacher Period Allocation. Please try again.");

  //   }
  //   finally {
  //     setIsSubmitting(false); // Re-enable the button after the operation
  //     setLoadingForSearch(false);
  //   }
  // }

  // const capitalize = (str) =>
  //   str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const handleSelectAll = () => {
    const newState = !selectAll;
    setSelectAll(newState);

    // Update all checkboxes
    const updatedCheckboxes = {};
    displayedSections.forEach((student) => {
      updatedCheckboxes[student.teacher_id] = newState;
    });
    setSelectedCheckboxes(updatedCheckboxes);
  };

  // Function to handle individual checkbox change
  const handleCheckboxChange = (teacher_id) => {
    const updatedCheckboxes = {
      ...selectedCheckboxes,
      [teacher_id]: !selectedCheckboxes[teacher_id],
    };

    setSelectedCheckboxes(updatedCheckboxes);

    // If all checkboxes are manually selected, check the "All" checkbox
    setSelectAll(
      displayedSections.every(
        (student) => updatedCheckboxes[student.teacher_id]
      )
    );
  };

  // const handleSubmit = async () => {
  //   try {
  //     const token = localStorage.getItem("authToken");

  //     // Collect selected teachers with their allocated periods
  //     const selectedTeachers = displayedSections
  //       .filter((teacher) => selectedCheckboxes[teacher.teacher_id])
  //       .map((teacher) => ({
  //         teacher_id: teacher.teacher_id,
  //         name: teacher.name,
  //         periods_allocated:
  //           allocatedPeriods[teacher.teacher_id] !== undefined
  //             ? allocatedPeriods[teacher.teacher_id]
  //             : teacher.periods_allocated,
  //       }));

  //        console.log("Selected Teachers:",selectedTeachers)

  //     if (selectedTeachers.length === 0) {
  //       toast.error("Please select at least one teacher before submitting.");
  //       return;
  //     }

  //     console.log("Sending Data:", JSON.stringify(selectedTeachers, null, 2));
  //     if (isSubmitting) return;
  //     setIsSubmitting(true);
  //     const response = await axios.post(
  //       `${API_URL}/api/save_teacherperiodallocation`,
  //       selectedTeachers, // Try sending the array directly instead of { teachers: selectedTeachers }
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     console.log("selected teachers after respponse", selectedTeachers);
  //     console.log("response", response);
  //     console.log("API Response:", response.data);

  //     if (response) {
  //       toast.success("Teacher Period Allocation Created Successfully.");
  //       setSelectedCheckboxes({});
  //       setSelectAll(false);
  //       // handleSearch();
  //     } else {
  //       toast.error("Teacher Period Allocation not created.");
  //     }
  //   } catch (error) {
  //     console.error("Error Submitting Teacher Period Allocation:", error);
  //     toast.error(
  //       "Error Submitting Teacher Period Allocation. Please try again."
  //     );
  //   } finally {
  //     setIsSubmitting(false);
  //     setIsSubmitting(false);
  //   }
  // };

  // validation if selected tecaher periods_allocated 0

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("authToken");

      // Collect selected teachers with their allocated periods
      const selectedTeachers = displayedSections
        .filter((teacher) => selectedCheckboxes[teacher.teacher_id])
        .map((teacher) => ({
          teacher_id: teacher.teacher_id,
          name: teacher.name,
          periods_allocated:
            allocatedPeriods[teacher.teacher_id] !== undefined
              ? allocatedPeriods[teacher.teacher_id]
              : teacher.periods_allocated,
        }));

      console.log("selectedTechaers", selectedTeachers);

      if (selectedTeachers.length === 0) {
        toast.error("Please select at least one teacher before submitting.");
        return;
      }

      // Find teachers with 0 allocated periods
      const invalidTeachers = selectedTeachers.filter(
        (teacher) => teacher.periods_allocated === 0
      );
      console.log("invalidTechahers", invalidTeachers);

      if (invalidTeachers.length > 0) {
        const newErrors = { ...errors };

        // Find the first invalid teacher that is also selected
        const firstInvalidTeacher = invalidTeachers.find(
          (teacher) => selectedCheckboxes[teacher.teacher_id] // Ensure only selected teachers
        );

        if (firstInvalidTeacher) {
          const teacherId = firstInvalidTeacher.teacher_id;

          // Set error only for the first invalid selected teacher
          newErrors[teacherId] = true;
          setErrors(newErrors);

          // Scroll into view for only that teacher
          if (inputRefs.current[teacherId]) {
            inputRefs.current[teacherId].scrollIntoView({
              behavior: "smooth",
              block: "center",
            });

            // Flash effect for visibility
            inputRefs.current[teacherId].classList.add("animate-pulse");
            setTimeout(() => {
              inputRefs.current[teacherId]?.classList.remove("animate-pulse");
            }, 1000);
          }
        }
        return;
      }

      console.log("Sending Data:", JSON.stringify(selectedTeachers, null, 2));
      if (isSubmitting) return;
      setIsSubmitting(true);

      const response = await axios.post(
        `${API_URL}/api/save_teacherperiodallocation`,
        selectedTeachers,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);

      if (response) {
        toast.success("Teacher Period Allocation Created Successfully.");
        setSelectedCheckboxes({});
        setSelectAll(false);
        setErrors({}); // Clear errors on success
        setAllocatedPeriods({});
        setPeriodValue({});
        handleSearch();
      } else {
        toast.error("Teacher Period Allocation not created.");
      }
    } catch (error) {
      console.error("Error Submitting Teacher Period Allocation:", error);
      toast.error(
        "Error Submitting Teacher Period Allocation. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleSubmit = async () => {
  //   try {
  //     const token = localStorage.getItem("authToken");

  //     // Collect selected teachers with their allocated periods
  //     const selectedTeachers = displayedSections
  //       .filter((teacher) => selectedCheckboxes[teacher.teacher_id])
  //       .map((teacher) => ({
  //         teacher_id: teacher.teacher_id,
  //         name: teacher.name,
  //         periods_allocated: allocatedPeriods[teacher.teacher_id] ?? 0, // Default to 0
  //       }));

  //     if (selectedTeachers.length === 0) {
  //       toast.error("Please select at least one teacher before submitting.");
  //       return;
  //     }

  //     // Check if any selected teacher has periods_allocated as 0
  //     const invalidTeachers = selectedTeachers.filter(
  //       (teacher) => teacher.periods_allocated === 0
  //     );

  //     if (invalidTeachers.length > 0) {
  //       const teacherNames = invalidTeachers.map((t) => t.name).join(", ");
  //       toast.error(`Please allocate periods for: ${teacherNames}`);
  //       // return;

  //       const firstInvalidTeacher = invalidTeachers[0]?.teacher_id;
  //       if(inputRefs.current[firstInvalidTeacher])
  //       {
  //         inputRefs.current[firstInvalidTeacher].scrollIntoView({
  //           behavior: "smooth",
  //           block:"center",
  //         })
  //       }
  //       return;
  //     }

  //     console.log("Sending Data:", JSON.stringify(selectedTeachers, null, 2));
  //     if (isSubmitting) return;
  //     setIsSubmitting(true);

  //     const response = await axios.post(
  //       `${API_URL}/api/save_teacherperiodallocation`,
  //       selectedTeachers, // Try sending the array directly instead of { teachers: selectedTeachers }
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     console.log("selected teachers after response", selectedTeachers);
  //     console.log("response", response);
  //     console.log("API Response:", response.data);

  //     if (response) {
  //       toast.success("Teacher Period Allocation Created Successfully.");
  //       setSelectedCheckboxes({});
  //       setSelectAll(false);
  //       // handleSearch();
  //     } else {
  //       toast.error("Teacher Period Allocation not created.");
  //     }
  //   } catch (error) {
  //     console.error("Error Submitting Teacher Period Allocation:", error);
  //     toast.error(
  //       "Error Submitting Teacher Period Allocation. Please try again."
  //     );
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const filteredSections = timetable.filter((section) => {
    const searchLower = searchTerm.trim().toLowerCase();

    // Extract relevant fields and convert them to lowercase for case-insensitive search
    const teacherName = `${section?.name}`.toLowerCase().trim() || "";
    const noOfPeriods = `${section?.periods_allocated}`.toLowerCase() || "";
    // Check if the search term is present in any of the specified fields
    return (
      teacherName.includes(searchLower) || noOfPeriods.includes(searchLower)
    );
  });

  const displayedSections = filteredSections.slice(currentPage * pageSize);

  // const applyPeriodToAll = () => {
  //   if (!periodValue || periodValue.trim() === "") {
  //     toast.error("Please enter a period value before applying.");
  //     return;
  //   }

  //   // Ensure at least one teacher is selected
  //   const selectedTeacherIds = Object.keys(selectedCheckboxes).filter(
  //     (teacher_id) => selectedCheckboxes[teacher_id] // Check if checkbox is selected
  //   );

  //   if (selectedTeacherIds.length === 0) {
  //     toast.error("Please select at least one teacher before applying.");
  //     return;
  //   }

  //   const updatedPeriods = { ...allocatedPeriods };

  //   // Update period only for selected teachers
  //   selectedTeacherIds.forEach((teacher_id) => {
  //     updatedPeriods[teacher_id] = periodValue.trim();
  //   });

  //   setAllocatedPeriods(updatedPeriods);
  // };

  const applyPeriodToAll = () => {
    if (!periodValue || periodValue.trim() === "") {
      toast.error("Please enter a period value before applying.");
      return;
    }

    // Ensure the period value does not exceed 2 digits
    if (periodValue.length > 2) {
      toast.error("Period value cannot exceed 2 digits.");
      return;
    }

    // Ensure at least one teacher is selected
    const selectedTeacherIds = Object.keys(selectedCheckboxes).filter(
      (teacher_id) => selectedCheckboxes[teacher_id] // Check if checkbox is selected
    );

    if (selectedTeacherIds.length === 0) {
      toast.error("Please select at least one teacher before applying.");
      return;
    }

    // Ensure `displayedSections` is available and valid
    if (!Array.isArray(displayedSections) || displayedSections.length === 0) {
      toast.error(
        "Teacher data is not available. Please refresh and try again."
      );
      return;
    }

    // Convert periodValue to a number
    const periodValueNum = Number(periodValue.trim());

    // Validate each selected teacher
    for (const teacher_id of selectedTeacherIds) {
      const teacherData = displayedSections.find(
        (teacher) => String(teacher.teacher_id) === String(teacher_id) // Ensure type match
      );

      if (!teacherData) {
        console.error(`No data found for Teacher ID: ${teacher_id}`);
        toast.error(`No data found for selected teacher.`);
        return;
      }

      const teacherName = teacherData.name || `ID ${teacher_id}`; // Fallback to ID if name is missing
      const periodsUsed = teacherData.periods_used || 0;

      console.log(
        `Checking Teacher: ${teacherName}, periodsUsed: ${periodsUsed}, periodValueNum: ${periodValueNum}`
      );

      if (periodValueNum < periodsUsed) {
        toast.error(
          `Allocated periods for ${teacherName} must be at least ${periodsUsed}`
        );
        return;
      }
    }

    // If all validations pass, apply periods
    const updatedPeriods = { ...allocatedPeriods };
    selectedTeacherIds.forEach((teacher_id) => {
      updatedPeriods[teacher_id] = periodValueNum;
    });

    setAllocatedPeriods(updatedPeriods);
    toast.warning("Period applied successfully to the selected teachers!");
  };

  // const applyPeriodToAll = () => {
  //   if (!periodValue || periodValue.trim() === "") {
  //     toast.error("Please enter a period value before applying.");
  //     return;
  //   }

  //   // Ensure at least one teacher is selected
  //   const selectedTeacherIds = Object.keys(selectedCheckboxes).filter(
  //     (teacher_id) => selectedCheckboxes[teacher_id] // Check if checkbox is selected
  //   );

  //   if (selectedTeacherIds.length === 0) {
  //     toast.error("Please select at least one teacher before applying.");
  //     return;
  //   }

  //   // Ensure `displayedSections` is available and valid
  //   if (!Array.isArray(displayedSections) || displayedSections.length === 0) {
  //     toast.error(
  //       "Teacher data is not available. Please refresh and try again."
  //     );
  //     return;
  //   }

  //   // Convert periodValue to a number
  //   const periodValueNum = Number(periodValue.trim());

  //   // Validate each selected teacher
  //   for (const teacher_id of selectedTeacherIds) {
  //     const teacherData = displayedSections.find(
  //       (teacher) => String(teacher.teacher_id) === String(teacher_id) // Ensure type match
  //     );

  //     if (!teacherData) {
  //       console.error(`No data found for Teacher ID: ${teacher_id}`);
  //       toast.error(`No data found for selected teacher.`);
  //       return;
  //     }

  //     const teacherName = teacherData.name || `ID ${teacher_id}`; // Fallback to ID if name is missing
  //     const periodsUsed = teacherData.periods_used || 0;

  //     console.log(
  //       `Checking Teacher: ${teacherName}, periodsUsed: ${periodsUsed}, periodValueNum: ${periodValueNum}`
  //     );

  //     if (periodValueNum < periodsUsed) {
  //       toast.error(
  //         `Allocated periods for ${teacherName} must be at least ${periodsUsed}`
  //       );
  //       return;
  //     }
  //   }

  //   // If all validations pass, apply periods
  //   const updatedPeriods = { ...allocatedPeriods };
  //   selectedTeacherIds.forEach((teacher_id) => {
  //     updatedPeriods[teacher_id] = periodValueNum;
  //   });

  //   setAllocatedPeriods(updatedPeriods);
  //   toast.warning("Period applied successfully to the selected teachers!");
  // };

  // const handlePeriodChange = (teacher_id, value) => {
  //   const periodValue = value.trim() === "" ? "" : Number(value); // Convert to number
  //   const periodsUsed =
  //     displayedSections.find((teacher) => teacher.teacher_id === teacher_id)
  //       ?.periods_used || 0;

  //   if (periodValue < periodsUsed) {
  //     toast.error(`Allocated periods must be at least ${periodsUsed}`);
  //     return;
  //   }

  //   setAllocatedPeriods((prev) => ({
  //     ...prev,
  //     [teacher_id]: periodValue, // Set only valid values
  //   }));
  // };

  // const handlePeriodChange = (teacher_id, value) => {
  //   if (value.trim() === "") {
  //     // Allow clearing the input field
  //     setAllocatedPeriods((prev) => ({
  //       ...prev,
  //       [teacher_id]: "", // Set empty value so user can re-enter
  //     }));
  //     return;
  //   }

  //   // Convert value to number and ensure it's a valid number
  //   const periodValue = Number(value);
  //   if (isNaN(periodValue)) return;

  //   // Ensure the value does not exceed 2 digits
  //   if (value.length > 2) {
  //     toast.error("Allocated periods cannot exceed 2 digits.");
  //     return;
  //   }

  //   const teacherData = displayedSections.find(
  //     (teacher) => teacher.teacher_id === teacher_id
  //   );
  //   const periodsUsed = teacherData?.periods_used || 0;

  //   if (periodValue < periodsUsed) {
  //     toast.error(`Allocated periods must be at least ${periodsUsed}`);
  //     return;
  //   }

  //   setAllocatedPeriods((prev) => ({
  //     ...prev,
  //     [teacher_id]: periodValue, // Set only valid values
  //   }));
  // };

  const handlePeriodChange = (teacher_id, value) => {
    if (value.trim() === "") {
      // Allow clearing the input field
      setAllocatedPeriods((prev) => ({
        ...prev,
        [teacher_id]: "", // Set empty value so user can re-enter
      }));
      return;
    }

    // Convert value to number and ensure it's a valid number
    const periodValue = Number(value);
    if (isNaN(periodValue)) return;

    // Ensure the value does not exceed 2 digits
    if (value.length > 2) {
      toast.error("Allocated periods cannot exceed 2 digits.");
      return;
    }

    const teacherData = displayedSections.find(
      (teacher) => teacher.teacher_id === teacher_id
    );
    const periodsUsed = teacherData?.periods_used || 0;

    if (periodValue < periodsUsed) {
      toast.error(`Allocated periods must be at least ${periodsUsed}`);
      return;
    }

    // ✅ Update periods
    setAllocatedPeriods((prev) => ({
      ...prev,
      [teacher_id]: periodValue,
    }));

    // ✅ Remove error if any for this teacher_id
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (updatedErrors[teacher_id]) {
        delete updatedErrors[teacher_id];
      }
      return updatedErrors;
    });
  };

  // const handlePeriodChange = (teacher_id, value) => {
  //   // Allow clearing the input field
  //   if (value.trim() === "") {
  //     setAllocatedPeriods((prev) => ({
  //       ...prev,
  //       [teacher_id]: "",
  //     }));

  //     setErrors((prev) => ({
  //       ...prev,
  //       [teacher_id]: true, // Highlight the input when empty
  //     }));

  //     return;
  //   }

  //   // Prevent more than 2 digits
  //   if (value.length > 2) {
  //     toast.error("Allocated periods cannot exceed 2 digits.");
  //     return;
  //   }

  //   // Convert to number
  //   const periodValue = Number(value);
  //   if (isNaN(periodValue) || periodValue === 0) {
  //     setErrors((prev) => ({
  //       ...prev,
  //       [teacher_id]: true, // Highlight the input if invalid
  //     }));
  //     return;
  //   }

  //   const teacherData = displayedSections.find(
  //     (teacher) => teacher.teacher_id === teacher_id
  //   );
  //   const periodsUsed = teacherData?.periods_used || 0;

  //   if (periodValue < periodsUsed) {
  //     toast.error(`Allocated periods must be at least ${periodsUsed}`);

  //     setErrors((prev) => ({
  //       ...prev,
  //       [teacher_id]: true, // Highlight the input if below minimum required
  //     }));

  //     return;
  //   }

  //   // Remove the error if the value is valid
  //   setErrors((prev) => ({
  //     ...prev,
  //     [teacher_id]: false,
  //   }));

  //   setAllocatedPeriods((prev) => ({
  //     ...prev,
  //     [teacher_id]: periodValue,
  //   }));
  // };

  // const handlePeriodChange = (teacher_id, value) => {
  //   if (value.trim() === "") {
  //     // Allow clearing the input field
  //     setAllocatedPeriods((prev) => ({
  //       ...prev,
  //       [teacher_id]: "", // Set empty value so user can re-enter
  //     }));
  //     return;
  //   }

  //   const periodValue = Number(value); // Convert to number
  //   const teacherData = displayedSections.find(
  //     (teacher) => teacher.teacher_id === teacher_id
  //   );
  //   const periodsUsed = teacherData?.periods_used || 0;

  //   if (periodValue < periodsUsed) {
  //     toast.error(`Allocated periods must be at least ${periodsUsed}`);
  //     return;
  //   }

  //   setAllocatedPeriods((prev) => ({
  //     ...prev,
  //     [teacher_id]: periodValue, // Set only valid values
  //   }));
  // };

  return (
    <>
      <div className="w-full md:w-[65%] mx-auto p-4 ">
        <ToastContainer />
        <div className="card p-4 rounded-md ">
          <div className=" card-header mb-4 flex justify-between items-center ">
            <h5 className="text-gray-700 mt-1 text-md lg:text-lg">
              Teacher Period Allocation
            </h5>
            <RxCross1
              className=" relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
              onClick={() => {
                navigate("/dashboard");
              }}
            />
          </div>
          <div
            className=" relative w-full   -top-6 h-1  mx-auto bg-red-700"
            style={{
              backgroundColor: "#C03078",
            }}
          ></div>

          <>
            <div className=" w-full md:w-[95%]   flex justify-center flex-col md:flex-row gap-x-1     ml-0    p-2">
              <div className="w-full md:w-[full] flex md:flex-row justify-between items-center mt-0 md:mt-4">
                <div className="w-full md:w-[full] gap-x-0 md:gap-x-12  flex flex-col gap-y-2 md:gap-y-0 md:flex-row">
                  <div className="w-full md:w-[70%] gap-x-2   justify-around  my-1 md:my-4 flex md:flex-row ">
                    <label
                      className="md:w-[40%] text-md pl-0 md:pl-5 mt-1.5"
                      htmlFor="studentSelect"
                    >
                      Department
                    </label>
                    <div className=" w-full md:w-[60%]">
                      <Select
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        id="studentSelect"
                        value={selectedDepartment}
                        onChange={handleDepartmentChange}
                        options={departmentOptions}
                        placeholder={loadingExams ? "Loading..." : "Select"}
                        isSearchable
                        isClearable
                        className="text-sm"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            fontSize: "0.875rem", // This directly modifies the font size of the Select control
                          }),
                          singleValue: (provided) => ({
                            ...provided,
                            fontSize: "0.875rem", // Adjust font size of selected value
                          }),
                          option: (provided) => ({
                            ...provided,
                            fontSize: "0.875rem", // Adjust font size of options in the dropdown
                          }),
                        }}
                        isDisabled={loadingExams}
                      />
                      {studentError && (
                        <div className="h-8 relative ml-1 text-danger text-xs">
                          {studentError}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full md:w-[60%] gap-x-2   justify-around  my-1 md:my-4 flex md:flex-row ">
                    <label
                      className="md:w-[40%] text-md pl-0 md:pl-5 mt-1.5"
                      htmlFor="studentSelect"
                    >
                      Subject
                    </label>
                    <div className=" w-full md:w-[65%]">
                      <Select
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        id="studentSelect"
                        value={selectedSubject}
                        onChange={handleSubjectSelect}
                        options={subjectOptions}
                        placeholder={loadingExams ? "Loading..." : "Select"}
                        isSearchable
                        isClearable
                        className="text-sm"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            fontSize: "0.875rem", // This directly modifies the font size of the Select control
                          }),
                          singleValue: (provided) => ({
                            ...provided,
                            fontSize: "0.875rem", // Adjust font size of selected value
                          }),
                          option: (provided) => ({
                            ...provided,
                            fontSize: "0.875rem", // Adjust font size of options in the dropdown
                          }),
                        }}
                        isDisabled={loadingExams}
                      />
                      {studentError && (
                        <div className="h-8 relative ml-1 text-danger text-xs">
                          {studentError}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-1">
                    <button
                      type="search"
                      onClick={handleSearch}
                      style={{ backgroundColor: "#2196F3" }}
                      className={` btn h-10 w-18 md:w-auto btn-primary text-white font-bold py-1 border-1 border-blue-500 px-4 rounded ${
                        loadingForSearch ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={loadingForSearch}
                    >
                      {loadingForSearch ? (
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
                          Browsing...
                        </span>
                      ) : (
                        "Browse"
                      )}
                    </button>
                  </div>
                </div>{" "}
              </div>
            </div>

            {timetable.length > 0 && (
              <>
                <div className="w-[full%] mt-4 p-2 px-3">
                  <div className="card mx-auto lg:w-full shadow-lg">
                    <div className="p-2 px-3 bg-gray-100 border-none flex justify-between items-center">
                      <div className="w-full flex flex-row justify-between mr-0 md:mr-4 ">
                        <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
                          List of Teacher Period Allocation
                        </h3>
                        <div className="w-1/2 md:w-[25%] mr-1 ">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search "
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className=" relative w-[97%]   mb-3 h-1  mx-auto bg-red-700"
                      style={{
                        backgroundColor: "#C03078",
                      }}
                    ></div>

                    <div className="card-body w-full">
                      <div
                        className="h-96 lg:h-96 overflow-y-scroll overflow-x-scroll"
                        style={{
                          scrollbarWidth: "thin", // Makes scrollbar thin in Firefox
                          scrollbarColor: "#C03178 transparent", // Sets track and thumb color in Firefox
                        }}
                      >
                        <table className="min-w-full leading-normal table-auto">
                          <thead>
                            <tr className="bg-gray-100">
                              {[
                                "Sr No.",
                                "Select All",
                                "Teacher Name",
                                "No. of Periods",
                              ].map((header, index) => (
                                <th
                                  key={index}
                                  className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider"
                                >
                                  {header === "Select All" ? (
                                    <div className="flex flex-col items-center justify-center gap-1">
                                      <span>{header}</span>
                                      <input
                                        type="checkbox"
                                        className="form-checkbox h-3 w-3 text-blue-600"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                      />
                                    </div>
                                  ) : header === "No. of Periods" ? (
                                    <div className="flex flex-col items-center gap-1">
                                      <span>{header}</span>
                                      <div className="flex items-center gap-2 ">
                                        {/* <input
                                          type="number"
                                          min="1"
                                          // max="7"
                                          className="w-20 px-1 py-1 border border-gray-400 rounded text-center text-sm ml-16"
                                          placeholder="Period"
                                          value={periodValue}
                                          maxLength={2}
                                          onChange={(e) =>
                                            setPeriodValue(e.target.value)
                                          }
                                        /> */}
                                        <input
                                          type="number"
                                          className="w-20 px-1 py-1 border border-gray-400 rounded text-center text-sm ml-16"
                                          placeholder="Period"
                                          value={periodValue}
                                          onChange={(e) => {
                                            let value = e.target.value.replace(
                                              /\D/g,
                                              ""
                                            ); // Remove non-numeric characters
                                            if (value.length > 2) {
                                              toast.error(
                                                "Allocated periods cannot exceed 2 digits."
                                              );
                                              return;
                                            }
                                            setPeriodValue(value);
                                          }}
                                          maxLength={2}
                                          inputMode="numeric"
                                        />

                                        <button
                                          type="button"
                                          className="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                          onClick={applyPeriodToAll}
                                        >
                                          Apply
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    header
                                  )}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {displayedSections.length ? (
                              displayedSections?.map((student, index) => (
                                <tr
                                  key={student.teacher_id}
                                  className="border border-gray-300"
                                >
                                  <td className="px-2 py-2 text-center border border-gray-300">
                                    {index + 1}
                                  </td>
                                  <td className="px-2 py-2 text-center border border-gray-300">
                                    <input
                                      type="checkbox"
                                      className="form-checkbox h-3 w-3 text-blue-600"
                                      checked={
                                        !!selectedCheckboxes[student.teacher_id]
                                      }
                                      onChange={() =>
                                        handleCheckboxChange(student.teacher_id)
                                      }
                                    />
                                  </td>

                                  <td className="px-2 py-2 text-center border border-gray-300">
                                    {/* {capitalize(student?.name || " ")} */}
                                    {student?.name || " "}
                                  </td>

                                  <td className="px-2 py-2 text-center border border-gray-300">
                                    <input
                                      type="number"
                                      min="1"
                                      // max="7"
                                      className="w-20 px-1 py-1 border border-gray-400 rounded text-center text-sm"
                                      // className={`w-20 px-1 py-1 border rounded text-center text-sm transition-all`}

                                      placeholder="Period"
                                      value={
                                        allocatedPeriods[student.teacher_id] ??
                                        student.periods_allocated
                                      }
                                      onChange={(e) =>
                                        handlePeriodChange(
                                          student.teacher_id,
                                          e.target.value
                                        )
                                      }
                                      ref={(el) => {
                                        if (el) {
                                          inputRefs.current = {
                                            ...inputRefs.current,
                                            [student.teacher_id]: el,
                                          };
                                        }
                                      }}
                                    />
                                    {errors[student.teacher_id] && (
                                      <p className="mt-1 text-xs text-red-600 animate-fadeIn">
                                        {typeof errors === "string"
                                          ? errors
                                          : "At least 1 period is required."}
                                      </p>
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
                      <div className="flex justify-end w-full mt-2 p-2">
                        <button
                          type="submit"
                          style={{ backgroundColor: "#2196F3" }}
                          className="text-white font-bold py-1 border border-blue-500 px-4 rounded"
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        </div>
      </div>
    </>
  );
};

export default TeacherPeriodAllocation;
