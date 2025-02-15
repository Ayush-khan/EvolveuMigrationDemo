import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { Field } from "formik";

const UpdateStudentID = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentForStudent, setSelectedStudentForStudent] =
    useState(null);
  const [classesforForm, setClassesforForm] = useState([]);

  const [classIdForSearch, setClassIdForSearch] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const [nameError, setNameError] = useState("");
  const [nameErrorForClass, setNameErrorForClass] = useState("");
  const [nameErrorForDivision, setNameErrorForDivision] = useState("");
  const [nameErrorForStudent, setNameErrorForStudent] = useState("");
  const [nameErrorForClassForStudent, setNameErrorForClassForStudent] =
    useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [admittedClass, setAdmittedClass] = useState({});
  const [selectedClassForStudent, setSelectedClassForStudent] = useState(null);
  const [studentInformation, setstudentInformation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingForSearch, setLoadingForSearch] = useState(false);

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [backendErrors, setBackendErrors] = useState({});

  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingDivision, setLoadingDivision] = useState(false);
  const [divisionforForm, setDivisionForForm] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [editedStudents, setEditedStudents] = useState({});
  const [error, setError] = useState(null);

  const studentRefs = useRef({});

  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/getClassList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(response.data)) {
        setClassesforForm(response.data);
      } else {
        toast.error("Unexpected Data Format");
      }
    } catch (error) {
      toast.error("Error fetching classes");
      console.error("Error fetching classes", error);
    } finally {
      setLoadingClasses(false);
    }
  };

  const classOptions = useMemo(
    () =>
      classesforForm.map((cls) => ({
        value: cls.class_id,
        label: cls.name,
      })),
    [classesforForm]
  );

  const fetchDivisions = async (classId) => {
    try {
      setLoadingDivision(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/get_divisions/${classId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Divisions API Response:", response.data); // Debug log

      // Check if the 'divisions' key exists and contains an array
      if (Array.isArray(response.data.divisions)) {
        setDivisionForForm(response.data.divisions); // Set divisions if valid
      } else {
        toast.error("Unexpected Data Format.");
        setDivisionForForm([]); // Fallback to empty array
      }
    } catch (error) {
      toast.error("Error fetching divisions");
      console.error("Error fetching divisions", error);
    } finally {
      setLoadingDivision(false);
    }
  };

  const divisionOptions = useMemo(() => {
    if (!Array.isArray(divisionforForm)) return [];
    return divisionforForm.map((div) => ({
      value: div.section_id, // Using 'section_id' as the value
      label: div.name, // Using 'name' as the label
    }));
  }, [divisionforForm]);

  const handleClassSelect = (selectedOption) => {
    setNameErrorForClass("");
    setSelectedClass(selectedOption); // change
    // setClassError("");

    setSelectedDivision(null); // Reset division dropdown
    setDivisionForForm([]); // Clear division options
    setClassIdForSearch(selectedOption?.value);

    if (selectedOption) {
      fetchDivisions(selectedOption.value); // Fetch divisions for the selected class
    }
  };

  const handleDivisionSelect = (selectedOption) => {
    setNameErrorForDivision("");
    setSelectedDivision(selectedOption); // Ensure correct value is set
  };

  const handleSearch = async () => {
    // Reset error messages
    setNameError("");
    setSearchTerm("");
    setNameErrorForClass("");
    setNameErrorForDivision("");
    setNameErrorForStudent("");
    setErrors({}); // Clears all field-specific errors

    let hasError = false;
    if (!selectedClass) {
      setNameErrorForClass("Please select a class.");
      hasError = true;
    }

    if (!selectedDivision) {
      setNameErrorForDivision("Please select a division.");
      hasError = true;
    }

    if (hasError) return;

    try {
      setstudentInformation(null);
      setSelectedClassForStudent([]);
      setSelectedStudents([]);
      setSelectAll(false);
      setLoadingForSearch(true); // Start loading

      const token = localStorage.getItem("authToken");

      const sectionId = selectedDivision?.value;
      console.log("Section ID:", sectionId);

      const classId = selectedClass?.value;
      console.log("Class ID", classId);

      if (!sectionId) {
        toast.error("Invalid division selection.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/get_studentidotherdetails/${classId}/${sectionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log("response.data", response.data);

      if (response?.data) {
        const fetchedData = response?.data;
        // console.log("fetched data", fetchedData);
        // console.log("Response.data.data", response.data.data);
        setstudentInformation(response?.data?.data);
      } else {
        toast.error("No data found for the selected class.");
      }
    } catch (error) {
      console.log("Error:", error);
      console.log("Error Response:", error.response);
    } finally {
      setLoadingForSearch(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true); // Start loading

      const token = localStorage.getItem("authToken");

      if (!studentInformation?.length) {
        alert("No student data to update.");
        return;
      }

      const errors = {};
      let firstInvalidField = null; // Store the first invalid field for scrolling

      const updatedStudentInformation = studentInformation.map((student) => {
        let studentHasError = false;

        // Check if the selected class should hide Udise
        const studentClass = classOptions.find(
          (cls) => cls.value === selectedClass?.value
        )?.label;
        const shouldHideUdise = hiddenClasses.includes(studentClass);

        if (!shouldHideUdise) {
          ["udise_pen_no"].forEach((field) => {
            const value = student[field]?.trim();
            const fieldKey = `${student.student_id}-${field}`;

            if (!value) {
              studentHasError = true;
              errors[fieldKey] = "This field cannot be empty";
            } else if (!/^\d{11}$/.test(value)) {
              studentHasError = true;
              errors[fieldKey] = "Please enter an 11-digit Udise Pen Number.";
            }

            if (studentHasError && !firstInvalidField) {
              firstInvalidField = fieldKey; // Capture first invalid field
            }
          });
        }

        return { ...student, hasError: studentHasError };
      });

      // If validation errors exist, highlight the fields and scroll to the first invalid field
      if (firstInvalidField) {
        Object.keys(errors).forEach((key) => {
          const fieldElement = studentRefs.current?.[key];
          if (fieldElement) {
            fieldElement.classList.add("border-red-500", "ring-red-300");
          }
        });

        const firstFieldElement = studentRefs.current?.[firstInvalidField];
        if (firstFieldElement) {
          firstFieldElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          firstFieldElement.focus();
        }

        return; // Stop execution if validation fails
      }

      // Proceed with API call
      const response = await axios.put(
        `${API_URL}/api/update_studentidotherdetails`,
        { students: studentInformation },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success("Student details updated successfully!");
        setSelectedClass(null); // Reset class selection
        setSelectedStudent(null); // Reset student selection
        setSelectedStudents([]); // Clear selected students
        setErrors({});
        setSelectedStudentForStudent(null);
        setSelectedStudentForStudent([]);
        setSelectedClassForStudent(null);
        setSelectedDivision("");
        setDivisionForForm([]);
        setSelectedClassForStudent([]);
        setNameErrorForClassForStudent("");
        setNameErrorForStudent("");
        setSelectAll(null);
        setBackendErrors({});
        setTimeout(() => {
          setstudentInformation(null);
        }, 500);
      } else {
        toast.error(
          `Failed to update student details. Status: ${response.status}`
        );
      }
    } catch (error) {
      console.log("Full API Error Response:", error.response);
      toast.error("Error Updating Student Details.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleInputChange = (e, studentId, fieldName) => {
    const { value } = e.target;

    setstudentInformation((prevStudents) =>
      prevStudents.map((student) =>
        student.student_id === studentId || student.roll_no === studentId
          ? { ...student, [fieldName]: value }
          : student
      )
    );

    // If the field being changed is the class, update admittedClass state
    if (fieldName === "admission_class") {
      setAdmittedClass((prev) => ({
        ...prev,
        [studentId]: value, // Store selection per student ID
      }));
    }

    // Perform field-specific validation
    let error = "";

    if (fieldName === "stud_id_no") {
      if (!value) {
        error = "Student ID is required.";
      } else if (
        studentInformation.some(
          (student) =>
            student.stud_id_no === value && student.student_id !== studentId
        )
      ) {
        error = "Student ID must be unique.";
      }
    }

    if (fieldName === "udise_pen_no") {
      if (!value) {
        error = "Please Enter Udise Pen No.";
      } else if (!/^\d{11}$/.test(value)) {
        error = "Please enter 11 digit Udise Pen No.";
      }
    }

    // else if (
    //   studentInformation.some(
    //     (student) =>
    //       student.udise_pen_no === value && student.student_id !== studentId
    //   )
    // )
    // {
    //   error = "Udise Pen Number must be unique.";
    // }

    // Update the frontend validation errors
    setErrors((prevErrors) => ({
      ...prevErrors,
      [studentId]: {
        ...prevErrors[studentId],
        [fieldName]: error,
      },
    }));

    setBackendErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (newErrors[studentId] && newErrors[studentId][fieldName]) {
        delete newErrors[studentId][fieldName];

        // If no more errors for this student, remove them from the object
        if (Object.keys(newErrors[studentId]).length === 0) {
          delete newErrors[studentId];
        }
      }
      return newErrors;
    });
  };

  const hiddenClasses = ["Nursery", "LKG", "UKG"];

  const selectedClassHide = classOptions.find(
    (cls) => cls.value === selectedClass?.value
  )?.label;

  const shouldHideUdise = hiddenClasses.includes(selectedClassHide);

  const filteredParents = useMemo(() => {
    if (!Array.isArray(studentInformation)) return [];

    return studentInformation.filter((student) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (student.roll_no !== null &&
          student.roll_no.toString().toLowerCase().includes(searchLower)) ||
        `${student.full_name || ""}`.toLowerCase().includes(searchLower) ||
        student.stud_id_no.toString().toLowerCase().includes(searchLower) ||
        student.udise_pen_no.toString().toLowerCase().includes(searchLower)
      );
    });
    // .sort((a, b) => (a.roll_no || 0) - (b.roll_no || 0)); // Sort by roll_no
  }, [studentInformation, searchTerm]);
  console.log("Filtered Students:", filteredParents);

  useEffect(() => {
    fetchClasses();
  }, [classIdForSearch]);

  const handleNavigation = () => {
    navigate("/dashboard");
  };

  return (
    <div>
      <ToastContainer />

      <div className="md:mx-auto md:w-[90%] p-4 bg-white mt-4 ">
        <div className=" w-full    flex justify-between items-center ">
          <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
            Update Student ID & Other Details
          </h3>
          <RxCross1
            className="text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
            type="button"
            onClick={handleNavigation}
          />
        </div>
        <div
          className=" relative  mb-8   h-1  mx-auto bg-red-700"
          style={{
            backgroundColor: "#C03078",
          }}
        ></div>
        <div className="w-full md:container mt-4">
          {/* Search Section */}
          <div className="pt-2 md:pt-4"></div>
          <div className="pt-8 w-full md:w-[65%]  relative ml-0 md:ml-[10%]  border-1 flex justify-start flex-col md:flex-row gap-x-1  bg-white rounded-lg mt-2 md:mt-6 p-2 ">
            {/* <h6 className=" w-[20%] float-start text-nowrap text-blue-600 mt-2.5"></h6> */}

            <div className="w-full flex md:flex-row justify-start items-center">
              <div className="w-full  flex flex-col gap-y-2 md:gap-y-0 md:flex-row">
                <div className="w-full gap-x-1 md:gap-x-6 items-center md:justify-between my-1 md:my-4 flex flex-col md:flex-row ">
                  <div className=" w-full md:w-[85%] flex flex-col md:flex-row justify-between">
                    <div className="  w-full md:w-[47%] flex flex-row justify-between   ">
                      <label
                        className="text-md mt-1.5 mr-1 md:mr-0 inline-flex"
                        htmlFor="classSelect"
                      >
                        Class <span className="text-red-500">*</span>
                      </label>

                      <div className="w-full md:w-[70%]">
                        <Select
                          id="classSelect"
                          value={selectedClass}
                          onChange={handleClassSelect}
                          options={classOptions}
                          placeholder={
                            loadingClasses ? "Loading classes..." : "Select"
                          }
                          isSearchable
                          isClearable
                          className="text-sm"
                          styles={{
                            menu: (provided) => ({
                              ...provided,
                              zIndex: 1050, // Set your desired z-index value
                            }),
                          }}
                          isDisabled={loadingClasses}
                        />
                        {nameErrorForClass && (
                          <div className="h-8 relative ml-1 text-danger text-xs">
                            {nameErrorForClass}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="  w-full md:w-[44%] flex flex-row justify-between   ">
                      <label
                        className="text-md mt-1.5 mr-1 md:mr-0 inline-flex"
                        htmlFor="divisionSelect"
                      >
                        Division <span className="text-red-500">*</span>
                      </label>

                      <div className="w-full md:w-[60%]">
                        <Select
                          id="divisionSelect"
                          value={selectedDivision}
                          onChange={handleDivisionSelect}
                          options={divisionOptions}
                          placeholder={
                            loadingClasses ? "Loading divisions..." : "Select"
                          }
                          isSearchable
                          isClearable
                          className="text-sm"
                          styles={{
                            menu: (provided) => ({
                              ...provided,
                              zIndex: 1050, // Set your desired z-index value
                            }),
                          }}
                          isDisabled={loadingDivision}
                        />
                        {nameErrorForDivision && (
                          <div className="h-8 relative ml-1 text-danger text-xs">
                            {nameErrorForDivision}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="search"
                  onClick={handleSearch}
                  style={{ backgroundColor: "#2196F3" }}
                  className={`my-1 md:my-4 btn h-10 w-18 md:w-auto btn-primary text-white font-bold py-1 border-1 border-blue-500 px-4 rounded ${
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
                      Loading...
                    </span>
                  ) : (
                    "Browse"
                  )}
                </button>
              </div>
            </div>
          </div>
          {/* Form Section - Displayed when studentInformation is fetched */}
          {studentInformation && (
            <div className="w-full md:container mx-auto py-4 px-4 ">
              <div className="card mx-auto w-full shadow-lg">
                <div className="p-1 px-3 bg-gray-100 flex justify-between items-center">
                  <h6 className="text-gray-700 mt-1   text-nowrap">
                    Update Student Details
                  </h6>
                  <div className="box-border flex md:gap-x-2  ">
                    <div className=" w-1/2 md:w-fit mr-1">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className=" relative w-[97%] h-1  mx-auto bg-red-700"
                  style={{
                    backgroundColor: "#C03078",
                  }}
                ></div>
                <div className="card-body w-full ">
                  <div className="h-96 lg:h-96 overflow-y-scroll lg:overflow-x-hidden w-full mx-auto">
                    <div className="bg-white rounded-lg shadow-xs">
                      <table className="min-w-full leading-normal table-auto">
                        <thead className=" ">
                          <tr className="bg-gray-200 ">
                            <th className="px-2 w-full md:w-[5%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Sr. No.
                            </th>
                            <th className="px-2 w-full md:w-[6%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Roll No
                            </th>
                            <th className="px-2 w-full md:w-[30%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Student Name
                            </th>
                            <th className="px-2 w-full md:w-[10%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Student ID
                            </th>
                            {!shouldHideUdise && (
                              <th className="px-2 w-full md:w-[10%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                Udise pen no.
                              </th>
                            )}
                            <th className="px-2 w-full md:w-[10%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Place of Birth
                            </th>
                            <th className="px-2 w-full md:w-[10%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Mother Tongue
                            </th>
                            <th className="px-2 w-full md:w-[12%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Admitted in Class
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredParents.length ? (
                            filteredParents.map((student, index) => (
                              <tr
                                key={student.student_id}
                                className={`${
                                  index % 2 === 0 ? "bg-white" : "bg-gray-100"
                                } hover:bg-gray-50`}
                              >
                                <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap relative top-2">
                                    {index + 1}
                                  </p>
                                </td>
                                <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm p-1">
                                  <p className="text-gray-900 whitespace-no-wrap relative top-2">
                                    {student.roll_no === 0
                                      ? "0"
                                      : student.roll_no || ""}
                                  </p>
                                </td>
                                <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap relative top-2">
                                    {student.full_name || ""}
                                  </p>
                                </td>

                                <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                                  <input
                                    type="text"
                                    ref={(el) =>
                                      (studentRefs.current[
                                        `${student.student_id}-stud_id_no`
                                      ] = el)
                                    }
                                    className={`text-center w-full px-2 py-1 border rounded outline-none focus:ring focus:ring-blue-300 ${
                                      errors[student.student_id]?.stud_id_no
                                        ? "border-red-500 ring-red-300"
                                        : ""
                                    }`}
                                    value={student.stud_id_no || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        e,
                                        student.student_id,
                                        "stud_id_no"
                                      )
                                    }
                                  />
                                  {/* {errors[student.student_id]?.stud_id_no && (
                                    <span className="text-red-500 text-xs block mt-1">
                                      {errors[student.student_id]?.stud_id_no}
                                    </span>
                                  )} */}
                                </td>

                                {!shouldHideUdise && (
                                  <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                                    <input
                                      type="text"
                                      ref={(el) =>
                                        (studentRefs.current[
                                          `${student.student_id}-udise_pen_no`
                                        ] = el)
                                      }
                                      className={`text-center w-full px-2 py-1 border rounded outline-none focus:ring focus:ring-blue-300 ${
                                        errors[student.student_id]?.udise_pen_no
                                          ? "border-red-500 ring-red-300"
                                          : ""
                                      }`}
                                      value={student.udise_pen_no || ""}
                                      onChange={(e) =>
                                        handleInputChange(
                                          e,
                                          student.student_id,
                                          "udise_pen_no"
                                        )
                                      }
                                    />
                                    {errors[student.student_id]
                                      ?.udise_pen_no && (
                                      <span className="text-red-500 text-xs block mt-1">
                                        {
                                          errors[student.student_id]
                                            ?.udise_pen_no
                                        }
                                      </span>
                                    )}
                                  </td>
                                )}

                                <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                                  <input
                                    type="text"
                                    ref={(el) =>
                                      (studentRefs.current[
                                        `${student.student_id}-birth_place`
                                      ] = el)
                                    }
                                    className={`text-center w-full px-2 py-1 border rounded outline-none focus:ring focus:ring-blue-300 ${
                                      errors[student.student_id]?.birth_place
                                        ? "border-red-500 ring-red-300"
                                        : ""
                                    }`}
                                    value={student.birth_place || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        e,
                                        student.student_id,
                                        "birth_place"
                                      )
                                    }
                                  />
                                  {errors[student.student_id]?.birth_place && (
                                    <span className="text-red-500 text-xs block mt-1">
                                      {errors[student.student_id]?.birth_place}
                                    </span>
                                  )}
                                </td>
                                <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                                  <input
                                    type="text"
                                    ref={(el) =>
                                      (studentRefs.current[
                                        `${student.student_id}-mother_tongue`
                                      ] = el)
                                    }
                                    className={`text-center w-full px-2 py-1 border rounded outline-none focus:ring focus:ring-blue-300 ${
                                      errors[student.student_id]?.mother_tongue
                                        ? "border-red-500 ring-red-300"
                                        : ""
                                    }`}
                                    value={student.mother_tongue || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        e,
                                        student.student_id,
                                        "mother_tongue"
                                      )
                                    }
                                  />
                                  {/* {errors[student.student_id]
                                    ?.mother_tongue && (
                                    <span className="text-red-500 text-xs block mt-1">
                                      {
                                        errors[student.student_id]
                                          ?.mother_tongue
                                      }
                                    </span>
                                  )} */}
                                </td>
                                {/* <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                                  <select
                                    value={
                                      admittedClass[student.student_id] || ""
                                    }
                                    onChange={(e) =>
                                      handleClassChange(
                                        student.student_id,
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-2 py-1 border rounded outline-none focus:ring focus:ring-blue-300"
                                    disabled={loadingClasses}
                                  >
                                    <option value="">Select</option>
                                    {loadingClasses ? (
                                      <option disabled>Loading...</option>
                                    ) : (
                                      classOptions.map((option) => (
                                        <option
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </option>
                                      ))
                                    )}
                                  </select>
                                </td> */}

                                <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                                  <select
                                    value={student.admission_class || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        e,
                                        student.student_id,
                                        "admission_class"
                                      )
                                    }
                                    className="w-full px-2 py-1 border rounded outline-none focus:ring focus:ring-blue-300"
                                    disabled={loadingClasses}
                                  >
                                    <option value="">Select</option>
                                    {loadingClasses ? (
                                      <option disabled>Loading...</option>
                                    ) : (
                                      classOptions.map((option) => (
                                        <option
                                          key={option.value}
                                          value={option.label}
                                        >
                                          {option.label}
                                        </option>
                                      ))
                                    )}
                                  </select>
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
                  </div>{" "}
                  <div className="col-span-3 mb-2  text-right mt-2">
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
                          Updating...
                        </span>
                      ) : (
                        "Update"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateStudentID;
