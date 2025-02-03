import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";

const PromotedStudent = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentForStudent, setSelectedStudentForStudent] =
    useState(null);
  const [classesforForm, setClassesforForm] = useState([]);
  const [classesforFormForStudent, setClassesforFormForStudent] = useState([]);

  const [studentNameWithClassId, setStudentNameWithClassId] = useState([]);
  const [
    studentNameWithClassIdForStudent,
    setStudentNameWithClassIdForStudent,
  ] = useState([]);

  const [classIdForSearch, setClassIdForSearch] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [classIdForSearchForStudent, setClassIdForSearchForStudent] =
    useState(null);
  const [selectedStudentIdForStudent, setSelectedStudentIdForStudent] =
    useState(null);
  const [nameError, setNameError] = useState("");
  const [nameErrorForClass, setNameErrorForClass] = useState("");
  const [nameErrorForStudent, setNameErrorForStudent] = useState("");
  const [nameErrorForClassForStudent, setNameErrorForClassForStudent] =
    useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedClassForStudent, setSelectedClassForStudent] = useState(null);
  const [parentInformation, setParentInformation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingForSearch, setLoadingForSearch] = useState(false);

  const navigate = useNavigate();

  // for form
  const [errors, setErrors] = useState({});
  const [backendErrors, setBackendErrors] = useState({});

  // Get today's date in YYYY-MM-DD format
  // Calculate today's date
  const today = new Date().toISOString().split("T")[0];
  // State for loading indicators
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    // Fetch both classes and student names on component mount
    fetchInitialDataAndStudents();
    fetchInitialDataAndStudentsForStudent();
  }, []);

  const fetchInitialDataAndStudents = async () => {
    try {
      setLoadingClasses(true);
      setLoadingStudents(true);

      const token = localStorage.getItem("authToken");

      // Fetch classes and students concurrently
      const [classResponse] = await Promise.all([
        axios.get(`${API_URL}/api/getClassList`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Set the fetched data
      setClassesforForm(classResponse.data || []);
      //   setStudentNameWithClassId(studentResponse?.data?.data || []);
    } catch (error) {
      toast.error("Error fetching Class data.");
    } finally {
      // Stop loading for both dropdowns
      setLoadingClasses(false);
      setLoadingStudents(false);
    }
  };
  const fetchInitialDataAndStudentsForStudent = async () => {
    try {
      setLoadingClasses(true);
      setLoadingStudents(true);

      const token = localStorage.getItem("authToken");

      // Fetch classes and students concurrently
      const [classResponse] = await Promise.all([
        axios.get(`${API_URL}/api/nextclassacademicyear`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Set the fetched data
      setClassesforFormForStudent(classResponse.data.data || []);
      //   setStudentNameWithClassId(studentResponse?.data?.data || []);
    } catch (error) {
      toast.error("Error fetching Class data.");
    } finally {
      // Stop loading for both dropdowns
      setLoadingClasses(false);
      setLoadingStudents(false);
    }
  };
  const fetchStudentNameWithClassId = async (section_id = null) => {
    console.log("fetchStudentNameWithClassId is run");

    try {
      setLoadingStudents(true);

      const params = section_id ? { section_id } : {};
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        `${API_URL}/api/get_divisions/${section_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStudentNameWithClassId(response?.data?.divisions || []);
      console.log(
        "Response of fetchStudentNameWithClassId is",
        response?.data?.divisions
      );
    } catch (error) {
      toast.error("Error fetching Divisions.");
    } finally {
      setLoadingStudents(false);
    }
  };
  const fetchStudentNameWithClassIdForStudent = async (section_id = null) => {
    console.log("fetchStudentNameWithClassIdForStudent is run");
    try {
      setLoadingStudents(true);

      const params = section_id ? { section_id } : {};
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        `${API_URL}/api/nextsectionacademicyear/${section_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStudentNameWithClassIdForStudent(response?.data?.data || []);
      console.log(
        "Response of fetchStudentNameWithClassIdForStudent is ",
        response?.data?.divisions
      );
    } catch (error) {
      toast.error("Error fetching Divisions.");
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleClassSelect = (selectedOption) => {
    setNameErrorForClass("");
    setSelectedClass(selectedOption);
    setSelectedStudent(null);
    setSelectedStudentId(null);
    setClassIdForSearch(selectedOption?.value);
    fetchStudentNameWithClassId(selectedOption?.value);
  };
  const handleClassSelectForStudent = (selectedOption) => {
    setNameErrorForClassForStudent("");
    setSelectedClassForStudent(selectedOption);
    setSelectedStudentForStudent(null);
    setSelectedStudentIdForStudent(null);
    setClassIdForSearchForStudent(selectedOption?.value);
    fetchStudentNameWithClassIdForStudent(selectedOption?.value);
  };

  const handleStudentSelect = (selectedOption) => {
    setNameError(""); // Reset student error on selection
    setSelectedStudent(selectedOption);
    setSelectedStudentId(selectedOption?.value);
  };
  const handleStudentSelectForStudent = (selectedOption) => {
    setNameErrorForStudent(""); // Reset student error on selection
    setSelectedStudentForStudent(selectedOption);
    setSelectedStudentIdForStudent(selectedOption?.value);
  };

  // Dropdown options
  const classOptions = useMemo(
    () =>
      classesforForm.map((cls) => ({
        value: cls.class_id,
        label: `${cls.name}`,
        key: `${cls.class_id}`,
      })),
    [classesforForm]
  );
  const classOptionsForStudent = useMemo(
    () =>
      classesforFormForStudent.map((cls) => ({
        value: cls.class_id,
        label: `${cls.name}`,
        key: `${cls.class_id}`,
      })),
    [classesforFormForStudent]
  );

  const studentOptions = useMemo(
    () =>
      studentNameWithClassId.map((stu) => ({
        value: stu.section_id,
        label: `${stu?.name}`,
      })),
    [studentNameWithClassId]
  );
  const studentOptionsForStudent = useMemo(
    () =>
      studentNameWithClassIdForStudent.map((stu) => ({
        value: stu.section_id,
        label: `${stu?.name}`,
      })),
    [studentNameWithClassIdForStudent]
  );

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  console.log("seletedStudents[]", selectedStudents);
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      // Select all students
      const allStudentIds = parentInformation.map(
        (student) => student.student_id
      );
      setSelectedStudents(allStudentIds);
    } else {
      // Deselect all students
      setSelectedStudents([]);
    }
  };

  const handleCheckboxChange = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const handleSearch = async () => {
    // Reset error messages
    setNameError("");
    setSearchTerm("");
    setNameErrorForClass("");
    setNameErrorForClassForStudent("");
    setNameErrorForStudent("");
    setErrors({}); // Clears all field-specific errors

    let hasError = false;
    if (!selectedClass) {
      setNameErrorForClass("Please select a class.");
      hasError = true;
    }
    if (!selectedStudent) {
      setNameError("Please select a division.");
      hasError = true;
    }

    // If there are validation errors, exit the function
    if (hasError) return;
    // Reset form data and selected values after successful submission

    try {
      setParentInformation(null);
      setSelectedStudentForStudent(null);
      setSelectedStudentForStudent([]);
      setSelectedClassForStudent(null);
      setSelectedClassForStudent([]);
      setSelectedStudents([]);
      setSelectAll(false);
      setLoadingForSearch(true); // Start loading
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/getstudentlistbyclassdivision/${classIdForSearch}/${selectedStudentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Check if data was received and update the form state
      if (response?.data?.data) {
        const fetchedData = response?.data?.data; // Extract the data
        setParentInformation(response?.data?.data); // Assuming response data contains form data

        // Populate formData with the fetched data
      } else {
        console.log("reponse", response.data.status);

        toast.error("No data found for the selected class and divisoin.");
      }
    } catch (error) {
      console.log("error is", error);
      console.log("error is", error.response);
    } finally {
      setLoadingForSearch(false);
    }
  };

  const formatDateString = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let hasError = false;

    // Validate if `selectedStudents` array is empty

    // Validate if `selectedClassForStudent` or `selectedStudentForStudent` are missing
    if (!selectedClassForStudent.value) {
      setNameErrorForClassForStudent("Please select a class.");
      hasError = true;
    }
    if (!selectedStudentForStudent.value) {
      setNameErrorForStudent("Please select a student.");
      hasError = true;
    }
    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student to promote.");
      hasError = true;
    }
    // Exit if there are validation errors
    if (hasError) return;

    try {
      setLoading(true); // Start loading

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token is found");
      }

      // Prepare data for the API request
      const postData = {
        selector: selectedStudents,
        tclass_id: selectedClassForStudent.value, // Replace with actual target class ID
        tsection_id: selectedStudentForStudent.value, // Replace with actual target section ID
      };

      // Make the API call
      const response = await axios.post(
        `${API_URL}/api/promotestudents`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle successful response
      if (response.status === 200) {
        toast.success("Students promoted successfully!");
        setSelectedClass(null); // Reset class selection
        // setSelectedClassForStudent(null);
        // selectedStudentForStudent(null);

        setSelectedStudent(null); // Reset student selection
        setSelectedStudents([]); // Clear selected students
        setErrors({});
        setSelectedStudentForStudent(null);
        setSelectedStudentForStudent([]);
        setSelectedClassForStudent(null);
        setSelectedClassForStudent([]);
        setNameErrorForClassForStudent("");
        setNameErrorForStudent("");
        setSelectAll(null);
        setBackendErrors({});
        setTimeout(() => {
          setParentInformation(null);
        }, 500);
      }
    } catch (error) {
      console.error("Error:", error.response?.data);

      // Display error message
      toast.error("An error occurred while promoting students.");

      if (error.response && error.response.data) {
        setBackendErrors(error.response.data || {});
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const filteredParents = parentInformation
    ? parentInformation.filter((student) => {
        const searchLower = searchTerm.toLowerCase();

        return (
          (student.roll_no !== null &&
            student.roll_no.toString().toLowerCase().includes(searchLower)) || // Filter by roll number
          `${student.first_name || ""} ${student.mid_name || ""} ${
            student.last_name || ""
          }`
            .toLowerCase()
            .includes(searchLower) // Filter by full name
        );
      })
    : [];

  return (
    <div>
      <ToastContainer />

      <div className="md:mx-auto md:w-3/4 p-4 bg-white mt-4 ">
        <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
          Promote Students
        </h3>
        <div
          className=" relative  mb-8   h-1  mx-auto bg-red-700"
          style={{
            backgroundColor: "#C03078",
          }}
        ></div>
        <div className="     w-full md:container mt-4">
          {/* Search Section */}
          <div className=" w-full md:w-[95%] border-1 flex justify-center flex-col md:flex-row gap-x-1  bg-white rounded-lg    mx-auto mt-1 p-2 ">
            <h6 className=" w-[20%] float-start text-nowrap text-blue-600 mt-2.5">
              Promote From :
            </h6>

            <div className="w-full  flex md:flex-row justify-between items-center">
              <div className="w-full  flex flex-col gap-y-2 md:gap-y-0 md:flex-row">
                <div className="w-full gap-x-14 md:gap-x-6 md:justify-start my-1 md:my-4 flex md:flex-row">
                  <label
                    className="text-md mt-1.5 mr-1 md:mr-0"
                    htmlFor="classSelect"
                  >
                    Class <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full md:w-[50%]">
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

                <div className="w-full gap-x-6 relative left-0 md:-left-[5%] justify-between md:w-[75%] my-1 md:my-4 flex md:flex-row">
                  <label
                    className="md:w-[40%] text-md mt-1.5"
                    htmlFor="studentSelect"
                  >
                    Division <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full md:w-[80%]">
                    <Select
                      id="studentSelect"
                      value={selectedStudent}
                      onChange={handleStudentSelect}
                      options={studentOptions}
                      disabled={!selectedClass} // Disable division until class is selected
                      placeholder={
                        loadingStudents ? "Loading divisions..." : "Select"
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
                      isDisabled={loadingStudents}
                    />
                    {nameError && (
                      <div className="h-8 relative ml-1 text-danger text-xs">
                        {nameError}
                      </div>
                    )}
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

          {/* Form Section - Displayed when parentInformation is fetched */}
          {parentInformation && (
            <div className="w-full md:container mx-auto py-4 px-4">
              <div className="card px-3 rounded-md">
                <div className=" w-full md:w-[82%] border-2 border-gray-200 flex justify-center flex-col md:flex-row gap-x-1  bg-white rounded-lg    mx-auto mt-4 p-2 ">
                  <h6 className=" w-[20%] float-start text-nowrap text-blue-600 mt-2.5">
                    Promote To :
                  </h6>
                  <div className="w-full md:w-[99%] flex md:flex-row justify-between items-center">
                    <div className="w-full  flex flex-col gap-y-2 md:gap-y-0 md:flex-row">
                      <div className="w-full gap-x-14 md:gap-x-6 md:justify-start my-1 md:my-4 flex md:flex-row">
                        <label
                          className="text-md mt-1.5 mr-1 md:mr-0"
                          htmlFor="classSelect"
                        >
                          Class <span className="text-red-500">*</span>
                        </label>
                        <div className="w-full md:w-[50%]">
                          <Select
                            id="classSelect"
                            value={selectedClassForStudent}
                            onChange={handleClassSelectForStudent}
                            options={classOptionsForStudent}
                            placeholder={
                              loadingClasses ? "Loading classes..." : "Select"
                            }
                            isSearchable
                            isClearable
                            isDisabled={loadingClasses}
                            className="text-sm"
                            styles={{
                              menu: (provided) => ({
                                ...provided,
                                zIndex: 1050, // Set your desired z-index value
                              }),
                            }}
                          />

                          {nameErrorForClassForStudent && (
                            <div className="h-8 relative ml-1 text-danger text-xs">
                              {nameErrorForClassForStudent}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="w-full gap-x-6 relative left-0 md:-left-[5%] justify-between md:w-[75%] my-1 md:my-4 flex md:flex-row">
                        <label
                          className="md:w-[40%] text-md mt-1.5"
                          htmlFor="studentSelect"
                        >
                          Division <span className="text-red-500">*</span>
                        </label>
                        <div className="w-full md:w-[80%]">
                          <Select
                            id="studentSelect"
                            value={selectedStudentForStudent}
                            onChange={handleStudentSelectForStudent}
                            options={studentOptionsForStudent}
                            disabled={!selectedClassForStudent} // Disable division until class is selected
                            isSearchable
                            isClearable
                            className="text-sm"
                            styles={{
                              menu: (provided) => ({
                                ...provided,
                                zIndex: 1050, // Set your desired z-index value
                              }),
                            }}
                            // isDisabled={loadingStudents}
                          />
                          {nameErrorForStudent && (
                            <div className="h-8 relative ml-1 text-danger text-xs">
                              {nameErrorForStudent}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Student Table */}
                <div className="container mt-4">
                  <div className="card mx-auto lg:w-[85%] shadow-lg">
                    <div className="p-1 px-3 bg-gray-100 flex justify-between items-center">
                      <h6 className="text-gray-700 mt-1   text-nowrap">
                        Select Students
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
                                <th className="px-2 text-center w-full md:w-[10%] lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                  Sr.No
                                </th>
                                <th className="px-2 text-center w-full md:w-[14%]  lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                  <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                    className="cursor-pointer"
                                  />{" "}
                                  Select All
                                </th>
                                <th className="px-2 w-full md:w-[19%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                  Roll Number
                                </th>
                                <th className="px-2 w-full md:w-[52%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                                  Name
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredParents.length ? (
                                filteredParents.map((student, index) => (
                                  <tr
                                    key={student.student_id}
                                    className={`${
                                      index % 2 === 0
                                        ? "bg-white"
                                        : "bg-gray-100"
                                    } hover:bg-gray-50`}
                                  >
                                    <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                                      <p className="text-gray-900 whitespace-no-wrap relative top-2">
                                        {index + 1}
                                      </p>
                                    </td>
                                    <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                                      <p className="text-gray-900 whitespace-no-wrap relative top-2">
                                        <input
                                          type="checkbox"
                                          checked={selectedStudents.includes(
                                            student.student_id
                                          )}
                                          onChange={() =>
                                            handleCheckboxChange(
                                              student.student_id
                                            )
                                          }
                                          className="cursor-pointer"
                                        />
                                      </p>
                                    </td>
                                    <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                                      <p className="text-gray-900 whitespace-no-wrap relative top-2">
                                        {student.roll_no === 0
                                          ? "0"
                                          : student.roll_no || ""}
                                      </p>
                                    </td>
                                    <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                                      <p className="text-gray-900 whitespace-no-wrap relative top-2">
                                        {student.first_name || ""}{" "}
                                        {student.mid_name || ""}{" "}
                                        {student.last_name || ""}{" "}
                                      </p>
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
                      <div className="text-center">
                        <p className="text-blue-500 font-semibold mt-1">
                          Selected Students:{" "}
                          <h6 className=" inline text-pink-600">
                            {selectedStudents.length}
                          </h6>
                        </p>
                      </div>
                      <div className="col-span-3 mb-2  text-right">
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromotedStudent;
