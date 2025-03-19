import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import Loader from "../common/LoaderFinal/LoaderStyle";
import { FiPrinter } from "react-icons/fi";
import { FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";

const StudentRemarkReport = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [selectedClass, setSelectedClass] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [classNameWithClassId, setClassNameWithClassId] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [teacherList, setTeacherList] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [toDate, setToDate] = useState(null);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingForSearch, setLoadingForSearch] = useState(false);

  const navigate = useNavigate();
  const [loadingExams, setLoadingExams] = useState(false);
  const [studentError, setStudentError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teacherError, setTeacherError] = useState("");

  const [studentRemarkList, setStudentRemarkList] = useState([]);

  const pageSize = 10;
  const [pageCount, setPageCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchClassesWithSection();
    fetchTeacherList();
    fetchStudentsList();
    handleSearch();
  }, []);

  const fetchClassesWithSection = async () => {
    try {
      setLoadingExams(true);
      const token = localStorage.getItem("authToken");

      const response = await axios.get(`${API_URL}/api/get_class_section`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Class", response);
      setClassNameWithClassId(response?.data || []);
    } catch (error) {
      toast.error("Error fetching Classes");
      console.error("Error fetching Classes:", error);
    } finally {
      setLoadingExams(false);
    }
  };

  const handleClassSelect = (selectedOption) => {
    setStudentError(""); // Reset error if student is select.
    setSelectedClass(selectedOption);
    setSelectedClassId(selectedOption?.value);
  };

  const classOptions = useMemo(
    () =>
      classNameWithClassId.map((cls) => ({
        value: cls?.section_id,
        label: `${cls.get_class.name} ${cls.name}`,
      })),
    [classNameWithClassId]
  );

  const fetchTeacherList = async () => {
    try {
      setLoadingExams(true);
      const token = localStorage.getItem("authToken");

      const response = await axios.get(`${API_URL}/api/get_teacher_list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Teacher List", response);
      setTeacherList(response?.data || []);
    } catch (error) {
      toast.error("Error fetching Teacher List");
      console.error("Error fetching Teacher List:", error);
    } finally {
      setLoadingExams(false);
    }
  };

  const handleTeacherSelect = (selectedOption) => {
    setTeacherError(""); // Reset error if student is select.
    setSelectedTeacher(selectedOption);
    setSelectedTeacherId(selectedOption?.value);
  };

  const teacherOptions = useMemo(
    () =>
      teacherList.map((cls) => ({
        value: cls?.reg_id,
        label: cls?.name,
      })),
    [teacherList]
  );

  const fetchStudentsList = async () => {
    try {
      setLoadingExams(true);
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        `${API_URL}/api/getStudentListBySectionData`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Student List", response);
      setStudentList(response?.data.data || []);
    } catch (error) {
      toast.error("Error fetching Teacher List");
      console.error("Error fetching Teacher List:", error);
    } finally {
      setLoadingExams(false);
    }
  };

  const studentOptions = useMemo(
    () =>
      Array.isArray(studentList)
        ? studentList.map((cls) => ({
            value: cls?.student_id,
            label: `${cls?.first_name || ""} ${cls?.mid_name || ""} ${
              cls?.last_name || ""
            }`.trim(),
          }))
        : [],
    [studentList]
  );

  const handleStudentSelect = (selectedOption) => {
    setStudentError(""); // Reset error if student is select.
    setSelectedStudent(selectedOption);
    setSelectedStudentId(selectedOption?.value);
    console.log("student select id", selectedOption.value);
  };

  // Handle search and fetch parent information

  const handleSearch = async () => {
    setLoadingForSearch(true);
    setSearchTerm("");

    try {
      setStudentRemarkList([]);
      const token = localStorage.getItem("authToken");

      // Dynamically build params
      const params = {};
      if (toDate) params.date = toDate;
      if (selectedClassId) params.section_id = String(selectedClassId);
      if (selectedStudentId) params.student_id = String(selectedStudentId);
      if (selectedTeacherId) params.staff_id = String(selectedTeacherId);

      // Log params before API call
      console.log("🚀 API Request Params:", params);

      const response = await axios.get(
        `${API_URL}/api/get_studentremarksreport`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      // Log full API response
      console.log("✅ API Response:", response);

      if (!response?.data?.data || response?.data?.data?.length === 0) {
        console.warn("❌ No data found for given params:", params);
        toast.error("Student Remark Report data not found.");
        setStudentRemarkList([]);
      } else {
        console.log("🎯 Setting Student Remark List:", response.data.data);
        setStudentRemarkList(response?.data?.data);
        setPageCount(Math.ceil(response?.data?.data?.length / pageSize));
      }
      setSelectedStudent(null);
      setSelectedTeacher(null);
      setSelectedClass(null);
      setToDate("");
    } catch (error) {
      console.error("❌ Error fetching Student Remark Report:", error);
      toast.error("Error fetching Student Remark Report. Please try again.");
    } finally {
      setLoadingForSearch(false);
    }
  };

  //   const handleSearch = async () => {
  //     setLoadingForSearch(true);
  //     setSearchTerm("");

  //     // Ensure at least one field is selected
  //     if (!toDate && !selectedClassId && !selectedStudentId && !selectedTeacherId) {
  //       toast.error("At least one field is required to search.");
  //       setLoadingForSearch(false);
  //       return; // Stop execution
  //     }

  //     try {
  //       setStudentRemarkList([]);
  //       const token = localStorage.getItem("authToken");

  //       // Dynamically build params
  //       const params = {};
  //       if (toDate) params.date = toDate;
  //       if (selectedClassId) params.section_id = String(selectedClassId);
  //       if (selectedStudentId) params.student_id = String(selectedStudentId);
  //       if (selectedTeacherId) params.staff_id = String(selectedTeacherId);

  //       console.log("API Request Params:", params);

  //       const response = await axios.get(
  //         `${API_URL}/api/get_studentremarksreport`,
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //           params, // Pass constructed params
  //         }
  //       );

  //       console.log("API Response Data:", response.data);

  //       if (!response?.data?.data || response?.data?.data?.length === 0) {
  //         toast.error("Student Remark Report data not found.");
  //         setStudentRemarkList([]);
  //       } else {
  //         setStudentRemarkList(response?.data?.data);
  //         setPageCount(Math.ceil(response?.data?.data?.length / pageSize));
  //       }
  //     } catch (error) {
  //       console.error("Error fetching Student Remark Report:", error);
  //       toast.error("Error fetching Student Remark Report. Please try again.");
  //     } finally {
  //       setLoadingForSearch(false);
  //     }
  //   };

  const handlePrint = () => {
    const printTitle = `Student Remark Report
     ${
       selectedClass?.label
         ? `List of Class ${selectedClass.label}`
         : ": For All Students "
     } 
    `;

    const printContent = `
  <div id="tableMain" class="flex items-center justify-center min-h-screen bg-white">
         <h5 id="tableHeading5"  class="text-lg font-semibold border-1 border-black">${printTitle}</h5>
 <div id="tableHeading" class="text-center w-3/4">
      <table class="min-w-full leading-normal table-auto border border-black mx-auto mt-2">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-2 text-center py-2 border border-black text-sm font-semibold">Sr.No</th>
            <th class="px-2 text-center py-2 border border-black text-sm font-semibold">Class</th>
            <th class="px-2 text-center py-2 border border-black text-sm font-semibold">Remark Date</th>
            <th class="px-2 text-center py-2 border border-black text-sm font-semibold">Type</th>
            <th class="px-2 text-center py-2 border border-black text-sm font-semibold">Student Name</th>
            <th class="px-2 text-center py-2 border border-black text-sm font-semibold">Teacher Name</th>
            <th class="px-2 text-center py-2 border border-black text-sm font-semibold">Subject</th>
            <th class="px-2 text-center py-2 border border-black text-sm font-semibold">Remark Subject</th>
            <th class="px-2 text-center py-2 border border-black text-sm font-semibold">Remark Description</th>
            <th class="px-2 text-center py-2 border border-black text-sm font-semibold">Academic Year</th>
          </tr>
        </thead>
        <tbody>
          ${displayedSections
            .map(
              (subject, index) => `
              <tr class="text-sm">
                <td class="px-2 text-center py-2 border border-black">${
                  index + 1
                }</td>
                <td class="px-2 text-center py-2 border border-black">
                  ${subject?.classname || ""} ${subject?.sectionname || ""}
                </td>
                <td class="px-2 text-center py-2 border border-black">
                  ${
                    subject?.remark_date
                      ? new Date(subject.remark_date).toLocaleDateString(
                          "en-GB"
                        ) // Format: dd/mm/yyyy
                      : ""
                  }
                </td>

                <td class="px-2 text-center py-2 border border-black">
                  ${subject?.remark_type}
                </td>
                <td class="px-2 text-center py-2 border border-black">
                ${subject?.first_name || " "} ${" "}
                ${subject?.mid_name || " "} ${" "}
                ${subject?.last_name || " "} </td>
                 <td class="px-2 text-center py-2 border border-black">${
                   subject?.teachername || " "
                 }</td>
                  <td class="px-2 text-center py-2 border border-black">${
                    subject?.subjectname || " "
                  }</td>
                   <td class="px-2 text-center py-2 border border-black">${
                     subject?.remark_subject || " "
                   }</td>
                    <td class="px-2 text-center py-2 border border-black">${
                      subject?.remark_desc || " "
                    }</td>
                     <td class="px-2 text-center py-2 border border-black">${
                       subject?.academic_yr || " "
                     }</td>
              </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  </div>`;

    const printWindow = window.open("", "", "height=800,width=1000");
    printWindow.document.write(`
  <html>
  <head>
    <title>${printTitle}</title>
    <style>
      @page { margin: 0; padding:0; box-sizing:border-box;   ;
}
      body { margin: 0; padding: 0; box-sizing:border-box; font-family: Arial, sans-serif; }
      #tableHeading {
  width: 100%;
  margin: auto; /* Centers the div horizontally */
  display: flex;
  justify-content: center;
}

#tableHeading table {
  width: 100%; /* Ensures the table fills its container */
  margin:auto;
  padding:0 10em 0 10em;

}

#tableContainer {
  display: flex;
  justify-content: center; /* Centers the table horizontally */
  width: 80%;
  
}

 
h5 {  
  width: 100%;  
  text-align: center;  
  margin: 0;  /* Remove any default margins */
  padding: 5px 0;  /* Adjust padding if needed */
}

#tableMain {
width:100%;
margin:auto;
box-sizing:border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* Prevent unnecessary space */
padding:0 10em 0 10em;
}

h5 + * { /* Targets the element after h5 */
  margin-top: 0; /* Ensures no extra space after h5 */
}


      table { border-spacing: 0; width: 70%; margin: auto;   }
      th { font-size: 0.8em; background-color: #f9f9f9; }
      td { font-size: 12px; }
      th, td { border: 1px solid gray; padding: 8px; text-align: center; }
      .student-photo {
        width: 30px !important; 
        height: 30px !important;
        object-fit: cover;
        border-radius: 50%;
      }
    </style>
  </head>
  <body>
    ${printContent}
  </body>
  </html>`);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownloadEXL = () => {
    if (!displayedSections || displayedSections.length === 0) {
      toast.error("No data available to download the Excel sheet.");
      return;
    }

    // Define headers matching the print table
    const headers = [
      "Sr No.",
      "Class",
      "Remark Date",
      "Type",
      "Student Name",
      "Teacher Name",
      "Subject",
      "Remark Subject",
      "Remark Description",
      "Academic Year",
    ];

    // Convert displayedSections data to array format for Excel
    const data = displayedSections.map((student, index) => [
      index + 1,
      `${student?.classname || " "} ${student?.sectionname || ""}`,

      student?.remark_date || " ",
      student?.remark_type || " ",
      `${student?.first_name || ""} ${student?.mid_name || ""} ${
        student?.last_name || ""
      }`,
      student?.teachername || " ",
      student?.subjectname || " ",
      student?.remark_subject || " ",
      student?.remark_desc || " ",

      student?.academic_yr || " ",
    ]);
    // Create a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const columnWidths = headers.map(() => ({ wch: 20 })); // Approx. width of 20 characters per column
    worksheet["!cols"] = columnWidths;

    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Admission Form Data");

    // Generate and download the Excel file
    const fileName = `Student_Remark_Report_${
      selectedClass?.label || "For ALL Students"
    }.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  console.log("row", studentRemarkList);

  const filteredSections = studentRemarkList.filter((student) => {
    const searchLower = searchTerm.toLowerCase();

    // Extract relevant fields and convert them to lowercase for case-insensitive search
    // const rollNo = student?.roll_no || "";
    const regNo = student?.reg_no?.toLowerCase() || "";
    const className = student?.classname?.toLowerCase() || "";
    const studentName =
      `${student?.first_name} ${student?.mid_name} ${student?.last_name}`
        .toLowerCase()
        .trim() || "";
    const teacherName = student?.teachername?.toLowerCase() || "";
    const remarkType = student?.remark_type?.toLowerCase() || "";
    const remarkDescription = student?.remark_desc?.toLowerCase() || "";

    // Check if the search term is present in any of the specified fields
    return (
      // rollNo.includes(searchLower) ||
      regNo.includes(searchLower) ||
      className.includes(searchLower) ||
      studentName.includes(searchLower) ||
      teacherName.includes(searchLower) ||
      remarkType.includes(searchLower) ||
      remarkDescription.includes(searchLower)
    );
  });

  const displayedSections = filteredSections.slice(currentPage * pageSize);

  return (
    <>
      <div className="w-full md:w-[100%] mx-auto p-4 ">
        <ToastContainer />
        <div className="card p-4 rounded-md ">
          <div className=" card-header mb-4 flex justify-between items-center ">
            <h5 className="text-gray-700 mt-1 text-md lg:text-lg">
              Student Remark Report
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
            <div className=" w-full md:w-[100%]  flex justify-center flex-col md:flex-row gap-x-1     ml-0    p-2">
              <div className="w-full md:w-[100%] flex md:flex-row justify-between items-center mt-0 md:mt-4">
                <div className="w-full md:w-[100%] gap-x-0 md:gap-x-8  flex flex-col gap-y-2 md:gap-y-0 md:flex-row">
                  <div className="w-full md:w-[100%] gap-x-1 justify-around  my-1 md:my-4 flex md:flex-row ">
                    <label
                      className="md:w-[35%] text-md pl-0 md:pl-5 mt-1.5"
                      htmlFor="studentSelect"
                    >
                      Class
                      {/* <span className="text-red-500">*</span> */}
                    </label>
                    <div className="w-full md:w-[70%]">
                      <Select
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        id="studentSelect"
                        value={selectedClass}
                        onChange={handleClassSelect}
                        options={classOptions}
                        placeholder={loadingExams ? "Loading..." : "Select"}
                        isSearchable
                        isClearable
                        className="text-sm"
                        isDisabled={loadingExams}
                      />
                      {studentError && (
                        <div className="h-8 relative ml-1 text-danger text-xs">
                          {studentError}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full md:w-[100%] gap-x-1 justify-around  my-1 md:my-4 flex md:flex-row ">
                    <label
                      className="md:w-[55%] text-md pl-0 md:pl-5 mt-1.5"
                      htmlFor="teacherSelect"
                    >
                      Teacher
                      {/* <span className="text-red-500">*</span> */}
                    </label>
                    <div className=" w-full md:w-[100%]">
                      <Select
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        id="teacherSelect"
                        value={selectedTeacher}
                        onChange={handleTeacherSelect}
                        options={teacherOptions}
                        placeholder={loadingExams ? "Loading..." : "Select"}
                        isSearchable
                        isClearable
                        className="text-sm"
                        isDisabled={loadingExams}
                      />
                      {teacherError && (
                        <div className="h-8 relative ml-1 text-danger text-xs">
                          {teacherError}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full md:w-[100%] gap-x-2 justify-around  my-1 md:my-4 flex md:flex-row ">
                    <label
                      className="md:w-[45%] text-md pl-0 md:pl-5 mt-1.5"
                      htmlFor="studentSelect"
                    >
                      Student
                      {/* <span className="text-red-500">*</span> */}
                    </label>
                    <div className=" w-full md:w-[80%]">
                      <Select
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        id="studentSelect"
                        value={selectedStudent}
                        onChange={handleStudentSelect}
                        options={studentOptions}
                        placeholder={loadingExams ? "Loading..." : "Select"}
                        isSearchable
                        isClearable
                        className="text-sm"
                        isDisabled={loadingExams}
                      />
                      {studentError && (
                        <div className="h-8 relative ml-1 text-danger text-xs">
                          {studentError}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full md:w-[100%] gap-x-1 justify-between my-1 md:my-4 flex md:flex-row">
                    <label
                      className="ml-0 md:ml-7 w-full md:w-[20%] text-md mt-1.5"
                      htmlFor="toDate"
                    >
                      Date
                    </label>
                    <div className="w-full md:w-[65%]">
                      <input
                        type="date"
                        id="toDate"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="text-sm w-full border border-gray-300 rounded px-2 py-2"
                      />
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
                          Searching...
                        </span>
                      ) : (
                        "Search"
                      )}
                    </button>
                  </div>
                </div>{" "}
              </div>
            </div>

            {studentRemarkList.length > 0 && (
              <>
                <div className="w-full  mt-4">
                  <div className="card mx-auto lg:w-full shadow-lg">
                    <div className="p-2 px-3 bg-gray-100 border-none flex justify-between items-center">
                      <div className="w-full   flex flex-row justify-between mr-0 md:mr-4 ">
                        <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
                          List Of Student Remark Report
                        </h3>
                        <div className="w-1/2 md:w-[18%] mr-1 ">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search "
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-x-1 justify-center md:justify-end">
                        <button
                          type="button"
                          onClick={handleDownloadEXL}
                          className="relative bg-blue-400 py-1 hover:bg-blue-500 text-white px-3 rounded group"
                        >
                          <FaFileExcel />

                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:flex items-center justify-center bg-gray-600  text-white text-[.7em] rounded-md py-1 px-2">
                            Exports to excel
                          </div>
                        </button>

                        <button
                          onClick={handlePrint}
                          className="relative flex flex-row justify-center align-middle items-center gap-x-1 bg-blue-400 hover:bg-blue-500 text-white px-3 rounded group"
                        >
                          <FiPrinter />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:flex items-center justify-center bg-gray-600  text-white text-[.7em] rounded-md py-1 px-2">
                            Print{" "}
                          </div>
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
                                "Class",
                                "Remark Date",
                                "Type",
                                "Student Name",
                                "Teacher Name",
                                "Subject",
                                "Remark Subject",
                                "Remark Description",
                                "Academic Year",
                              ].map((header, index) => (
                                <th
                                  key={index}
                                  className="px-2 text-center lg:px-3 py-2 border border-gray-950 text-sm font-semibold text-gray-900 tracking-wider"
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>

                          <tbody>
                            {displayedSections.length ? (
                              displayedSections?.map((student, index) => (
                                <tr
                                  key={student.adm_form_pk}
                                  className="border border-gray-300"
                                >
                                  <td className="px-2 py-2 text-center border border-gray-300">
                                    {index + 1}
                                  </td>
                                  <td className="px-2 py-2 text-center border border-gray-300">
                                    {student.classname || " "}{" "}
                                    {student.sectionname || " "}
                                  </td>
                                  <td className="px-2 py-2 text-center border border-gray-300">
                                    {student.remark_date
                                      ? new Date(
                                          student.remark_date
                                        ).toLocaleDateString("en-GB") // Format: dd/mm/yyyy
                                      : " "}
                                  </td>

                                  <td className="px-2 py-2 text-nowrap text-center border border-gray-300">
                                    {student.remark_type || " "}
                                  </td>

                                  <td className="px-2 py-2 text-center border border-gray-300">
                                    {student.first_name || " "}{" "}
                                    {student.mid_name || " "}{" "}
                                    {student.last_name || " "}
                                  </td>

                                  <td className="px-2 py-2 text-center border border-gray-300">
                                    {student.teachername || " "}
                                  </td>
                                  <td className="px-2 py-2 text-center border border-gray-300">
                                    {student.subjectname || " "}
                                  </td>
                                  <td className="px-2 py-2 text-center border border-gray-300">
                                    {student.remark_subject || " "}
                                  </td>
                                  <td className="px-2 py-2 text-center border border-gray-300">
                                    {student.remark_desc || " "}
                                  </td>
                                  <td className="px-2 py-2 text-center border border-gray-300">
                                    {student.academic_yr || " "}
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

export default StudentRemarkReport;
