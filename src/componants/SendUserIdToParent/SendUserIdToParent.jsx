import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";

const SendUserIdToParent = () => {
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
  //   const today = new Date().toISOString().split("T")[0];
  // State for loading indicators
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    // Fetch both classes and student names on component mount
    fetchInitialDataAndStudents();
  }, []);

  const fetchInitialDataAndStudents = async () => {
    try {
      setLoadingClasses(true);
      setLoadingStudents(true);

      const token = localStorage.getItem("authToken");

      // Fetch classes and students concurrently
      const [classResponse] = await Promise.all([
        axios.get(`${API_URL}/api/getallClassWithStudentCount `, {
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

  const handleClassSelect = (selectedOption) => {
    setNameErrorForClass("");
    setSelectedClass(selectedOption);
    setSelectedStudent(null);
    setSelectedStudentId(null);
    setClassIdForSearch(selectedOption?.value);
  };

  // Dropdown options
  const classOptions = useMemo(
    () =>
      classesforForm.map((cls) => ({
        value: cls.section_id,
        label: `${cls?.get_class?.name} ${cls.name} (${cls.students_count})`,

        key: `${cls.class_id}`,
      })),
    [classesforForm]
  );

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  console.log("seletedStudents[]", selectedStudents);
  //   const handleSelectAll = () => {
  //     setSelectAll(!selectAll);
  //     if (!selectAll) {
  //       // Select all students
  //       const allStudentIds = parentInformation.map(
  //         (student) => student.student_id
  //       );
  //       setSelectedStudents(allStudentIds);
  //     } else {
  //       // Deselect all students
  //       setSelectedStudents([]);
  //     }
  //   };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);

    if (!selectAll) {
      // Select only students with at least one parent email
      const validStudentIds = parentInformation
        .filter(
          (student) => student?.parents?.f_email || student?.parents?.m_emailid
        )
        .map((student) => student.student_id);

      setSelectedStudents(validStudentIds);
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

      const response = await axios.get(`${API_URL}/api/get_students`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { section_id: classIdForSearch }, // Pass query parameters here
      });

      // Check if data was received and update the form state
      if (response?.data?.students) {
        const fetchedData = response?.data?.students; // Extract the data
        setParentInformation(response?.data?.students); // Assuming response data contains form data

        // Populate formData with the fetched data
      } else {
        console.log("reponse", response.data.status);

        toast.error("No data found for the selected class.");
      }
    } catch (error) {
      console.log("error is", error);
      console.log("error is", error.response);
    } finally {
      setLoadingForSearch(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let hasError = false;

    // Validate if `selectedStudents` array is empty

    // Validate if `selectedClassForStudent` or `selectedStudentForStudent` are missing
    // if (!selectedClassForStudent.value) {
    //   setNameErrorForClassForStudent("Please select a class.");
    //   hasError = true;
    // }
    // if (!selectedStudentForStudent.value) {
    //   setNameErrorForStudent("Please select a student.");
    //   hasError = true;
    // }
    if (selectedStudents.length === 0) {
      toast.error(
        "Please select at least one student to send their User ID to the parents."
      );
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
        studentId: selectedStudents,
        // tclass_id: selectedClassForStudent.value, // Replace with actual target class ID
        // tsection_id: selectedStudentForStudent.value, // Replace with actual target section ID
      };

      // Make the API call
      const response = await axios.post(
        `${API_URL}/api/send_user_id_toparents`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle successful response
      if (response.status === 200) {
        toast.success("Send Use ID to parents successfully!");
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
      toast.error("An error occurred while sending use ID to parents.");

      if (error.response && error.response.data) {
        setBackendErrors(error.response.data || {});
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  //   const filteredParents = parentInformation
  //     ? parentInformation.filter((student) => {
  //         const searchLower = searchTerm.toLowerCase();

  //         return (
  //           (student.roll_no !== null &&
  //             student.roll_no.toString().toLowerCase().includes(searchLower)) || // Filter by roll number
  //           `${student.first_name || ""} ${student.mid_name || ""} ${
  //             student.last_name || ""
  //           }`
  //             .toLowerCase()
  //             .includes(searchLower) // Filter by full name
  //         );
  //       })
  //     : [];
  const filteredParents = parentInformation
    ? parentInformation.filter((student) => {
        const searchLower = searchTerm.toLowerCase();

        return (
          // Filter by roll number
          (student.roll_no !== null &&
            student.roll_no.toString().toLowerCase().includes(searchLower)) ||
          // Filter by father's email
          (student.parents?.f_email &&
            student.parents.f_email.toLowerCase().includes(searchLower)) ||
          // Filter by mother's email
          (student.parents?.m_emailid &&
            student.parents.m_emailid.toLowerCase().includes(searchLower)) ||
          // Filter by user master table (user ID)
          (student?.user_master?.user_id !== null &&
            student?.user_master?.user_id
              .toString()
              .toLowerCase()
              .includes(searchLower)) ||
          // Filter by full name
          `${student.first_name || ""} ${student.mid_name || ""} ${
            student.last_name || ""
          }`
            .toLowerCase()
            .includes(searchLower)
        );
      })
    : [];

  return (
    <div>
      <ToastContainer />

      <div className="md:mx-auto md:w-[90%] p-4 bg-white mt-4 ">
        <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
          Send User ID To Parents
        </h3>
        <div
          className=" relative  mb-8   h-1  mx-auto bg-red-700"
          style={{
            backgroundColor: "#C03078",
          }}
        ></div>
        <div className="     w-full md:container mt-4">
          {/* Search Section */}
          <div className="pt-2 md:pt-4"></div>
          <div className="pt-8 w-full md:w-[50%]  relative ml-0 md:ml-[10%]  border-1 flex justify-start flex-col md:flex-row gap-x-1  bg-white rounded-lg    mt-2 md:mt-6 p-2 ">
            <h6 className=" w-[20%] float-start text-nowrap text-blue-600 mt-2.5"></h6>

            <div className="w-full    flex md:flex-row justify-start items-center">
              <div className="w-full  flex flex-col gap-y-2 md:gap-y-0 md:flex-row">
                <div className="w-full gap-x-14 md:gap-x-6 md:justify-start my-1 md:my-4 flex md:flex-row">
                  <label
                    className="text-md mt-1.5 mr-1 md:mr-0"
                    htmlFor="classSelect"
                  >
                    Class <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full md:w-[57%]">
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
            <div className="w-full md:container mx-auto py-4 px-4 ">
              <div className="card mx-auto w-full shadow-lg">
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
                            <th className="px-2 text-center w-full md:w-[7%] lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Sr.No
                            </th>
                            <th className="px-2 text-center w-full md:w-[14%]  lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                                className="cursor-pointer"
                              />{" "}
                              All
                            </th>
                            <th className="px-2 w-full md:w-[13%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Roll No
                            </th>
                            <th className="px-2 w-full md:w-[22%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Student Name
                            </th>
                            <th className="px-2 w-full md:w-[52%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Father Email Id
                            </th>
                            <th className="px-2 w-full md:w-[52%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              Mother Email Id{" "}
                            </th>
                            <th className="px-2 w-full md:w-[52%] text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider">
                              User Id
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
                                {/* <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap relative top-2">
                                    <input
                                      type="checkbox"
                                      checked={selectedStudents.includes(
                                        student.student_id
                                      )}
                                      onChange={() =>
                                        handleCheckboxChange(student.student_id)
                                      }
                                      className="cursor-pointer"
                                    />
                                  </p>
                                </td> */}
                                <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap relative top-2">
                                    {(student?.parents?.f_email ||
                                      student?.parents?.m_emailid) && (
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
                                    )}
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
                                <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap relative top-2">
                                    {student?.parents?.f_email
                                      ? student?.parents?.f_email
                                      : ""}
                                  </p>
                                </td>
                                <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap relative top-2">
                                    {student?.parents?.m_emailid
                                      ? student?.parents?.m_emailid
                                      : ""}
                                  </p>
                                </td>
                                <td className="text-center px-2 lg:px-3 border border-gray-950 text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap relative top-2">
                                    {student?.user_master?.user_id
                                      ? student?.user_master?.user_id
                                      : ""}
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
                          Sending...
                        </span>
                      ) : (
                        "Send email to parents"
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

export default SendUserIdToParent;
