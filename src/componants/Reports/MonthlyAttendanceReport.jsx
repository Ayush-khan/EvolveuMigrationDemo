// import React from "react";

// const MonthlyAttendenceReport = () => {
//   return (
//     <div>
//       <h1>Monthly Attendencce</h1>
//     </div>
//   );
// };

// export default MonthlyAttendenceReport;

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

const MonthlyAttendenceReport = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [selectedClass, setSelectedClass] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [classNameWithClassId, setClassNameWithClassId] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [loadingForSearch, setLoadingForSearch] = useState(false);

  const [monthError, setMonthError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedMonthId, setSelectedMonthId] = useState(null);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [classError, setClassError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [timetable, setTimetable] = useState([]);
  const [sessionData, setSessionData] = useState({});

  const pageSize = 10;
  const [pageCount, setPageCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchClasses();
    fetchSessionData();
    // handleSearch();
  }, []);

  const fetchSessionData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      const response = await axios.get(`${API_URL}/api/sessionData`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const academicYear = response?.data?.custom_claims?.academic_year;
      console.log("Academic Year", academicYear);

      setSessionData(response?.data || []);
    } catch (error) {
      // toast.error("Error fetching session D");
      console.error("Error fetching session Data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const handleClassSelect = (selectedOption) => {
    setClassError(""); // Reset error if student is select.
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

  const monthMap = [
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
  ];

  const monthOptions = useMemo(
    () =>
      monthMap.map((month) => ({
        value: month.value,
        label: month.label,
      })),
    []
  );

  const handleMonthSelect = (selectedOption) => {
    setSelectedMonth(selectedOption);

    // Store only the value separately, ensuring "All" is stored as an empty string
    setSelectedMonthId(selectedOption.value);

    // Clear error if a valid option is selected
    if (selectedOption) {
      setMonthError("");
    }
  };

  const handleSearch = async () => {
    setLoadingForSearch(false);
    if (!selectedClassId) {
      setClassError("Please select Class.");
      setLoadingForSearch(false);
      return;
    }

    if (!selectedMonthId) {
      setClassError("Please select Month.");
      setLoadingForSearch(false);
      return;
    }
    setSearchTerm("");
    try {
      setLoadingForSearch(true); // Start loading
      setTimetable([]);
      const token = localStorage.getItem("authToken");
      const params = {};
      if (selectedClassId) params.section_id = selectedClassId;
      if (selectedMonthId) params.month = selectedMonth.label;
      const response = await axios.get(
        `${API_URL}/api/get_monthly_attendance_report`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );
      if (
        !response?.data?.data?.students ||
        response?.data?.data?.students?.length === 0
      ) {
        toast.error("Monthly Attendence Report data not found.");
        setTimetable([]);
      } else {
        setTimetable(response?.data?.data);
        setPageCount(Math.ceil(response?.data?.data?.length / pageSize)); // Set page count based on response size
      }
    } catch (error) {
      console.error("Error fetching Monthly Attendence Report:", error);
      toast.error(
        "Error fetching Monthly Attendence Report. Please try again."
      );
    } finally {
      setIsSubmitting(false); // Re-enable the button after the operation
      setLoadingForSearch(false);
    }
  };

  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const handlePrint = () => {
    const printTitle = `Monthly Attendance Report for ${selectedClass?.label} Class for ${selectedMonth.label}`;
    const printContent = `
    <div id="tableMain">
      <h5>${printTitle}</h5>
      <div id="tableContainer">
        <table>
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Roll No.</th>
              <th>Student Name</th>
              <th>Present Days / Working Days in ${selectedMonth.label}</th>
              <th>Total Attendance in ${
                sessionData?.custom_claims?.academic_year
              }</th>
            </tr>
          </thead>
          <tbody>
            ${displayedSections?.students
              .map(
                (subject, index) => `
                <tr>
                  <td>${index + 1}</td>

                  <td>${subject?.roll_no}</td>
                  <td>
                   ${subject?.first_name ? capitalize(subject.first_name) : " "}
                   ${
                     subject?.mid_name
                       ? " " + capitalize(subject.mid_name)
                       : " "
                   }
                   ${
                     subject?.last_name
                       ? " " + capitalize(subject.last_name)
                       : " "
                   }
                  </td>
                  <td>${"'"}${subject?.present_count || " "} ${"/"} ${
                  subject?.working_days || " "
                }${"'"}</td>
                  <td>${"'"}${subject?.total_attendance || " "} ${"/"} ${
                  subject?.total_attendance_till_a_month || " "
                }${"'"}</td>
                </tr>`
              )
              .join("")}
             <tr class="border border-gray-300 font-semibold">
                <td colspan="3" class="text-center">
                  Total
                </td>
                <td colspan="1" class="text-center">
                ${"'"}${displayedSections?.total_present_count || " "} ${"/"} ${
      displayedSections?.total_working_days || " "
    }${"'"}
                </td>
                <td colspan="1" class="text-center">
                ${"'"}${displayedSections?.total_attendance || " "} ${"/"} ${
      displayedSections?.grand_total_working_days || " "
    }${"'"}
                </td>
              </tr>
          </tbody>
        </table>
      </div>
    </div>`;

    const printWindow = window.open("", "_blank", "width=1000,height=800");

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
          <div id="printContainer">
              ${printContent}
          </div>
      </body>
      </html>
    `);

    printWindow.document.close();

    // Ensure content is fully loaded before printing
    printWindow.onload = function () {
      printWindow.focus();
      printWindow.print();
      printWindow.close(); // Optional: close after printing
    };
  };

  const handleDownloadEXL = () => {
    if (
      !displayedSections?.students ||
      displayedSections?.students.length === 0
    ) {
      toast.error("No data available to download the Excel sheet.");
      return;
    }

    // Define headers matching the print table
    const headers = [
      "Sr No.",
      "Roll No.",
      "Student Name",
      `${
        selectedMonth
          ? `Present Days / Working Days in ${selectedMonth.label}`
          : "Present Days / Working Days"
      }`,
      `${
        sessionData?.custom_claims?.academic_year
          ? `Total Attendance in ${sessionData?.custom_claims?.academic_year}`
          : "Total Attendanc"
      }`,
    ];

    // Convert displayedSections data to array format for Excel
    // const data = displayedSections?.students.map((student, index) => [
    //   index + 1,
    //   student?.roll_no || " ",
    //   `${capitalize(student?.first_name || " ")} ${capitalize(
    //     student?.mid_name || " "
    //   )} ${capitalize(student?.last_name || " ")}`,
    //   `${"'"} ${student?.present_count || " "} ${"/"} ${student?.working_days || " "} ${"'"}`,
    //   `${"'"} ${student?.total_attendance || " "} ${"/"} ${student?.total_attendance_till_a_month || " "} ${"'"}`,
    // ]);

    const data = [
      ...displayedSections?.students.map((student, index) => [
        index + 1,
        student?.roll_no,
        `${capitalize(student?.first_name || " ")} ${capitalize(
          student?.mid_name || " "
        )} ${capitalize(student?.last_name || " ")}`,
        `${"'"} ${student?.present_count || " "} ${"/"} ${
          student?.working_days || " "
        } ${"'"}`,
        `${"'"} ${student?.total_attendance || " "} ${"/"} ${
          student?.total_attendance_till_a_month || " "
        } ${"'"}`,
      ]),

      [
        "TOTAL",
        "",
        "",
        `' ${displayedSections?.total_present_count || " "} / ${
          displayedSections?.total_working_days || " "
        } '`,
        `' ${displayedSections?.total_attendance || " "} / ${
          displayedSections?.grand_total_working_days || " "
        } '`,
      ],
    ];

    // Create a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);

    // Auto-adjust column width
    const columnWidths = headers.map(() => ({ wch: 20 })); // Approx. width of 20 characters per column
    worksheet["!cols"] = columnWidths;

    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Admission Form Data");

    // Generate and download the Excel file
    const fileName = ` Monthly_Attendance_Report_${
      selectedClass?.label || " "
    } for ${selectedMonth || " "}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  console.log("row", timetable);

  // const filteredSections = Array.isArray(timetable?.students)
  // ? timetable.students.filter((student) => {
  //     const searchLower = (searchTerm || "").toLowerCase();

  //     const rollNo = student?.roll_no ? String(student.roll_no) : "";
  //     const studentName = [student?.first_name, student?.mid_name, student?.last_name]
  //       .filter(Boolean)
  //       .join(" ")
  //       .toLowerCase();
  //     const stream = student?.stream_name?.toLowerCase() || "";
  //     const subject = student?.subjects?.map((sub) => sub.subject_name)?.join(", ")?.toLowerCase() || "";

  //     return (
  //       rollNo.includes(searchLower) ||
  //       studentName.includes(searchLower) ||
  //       stream.includes(searchLower) ||
  //       subject.includes(searchLower)
  //     );
  //   })
  // : [];

  // console.log("filtered section",filteredSections)

  // const displayedSections = filteredSections.slice(currentPage * pageSize);
  // console.log("displayedsection",displayedSections)

  const filteredStudents = Array.isArray(timetable?.students)
    ? timetable.students.filter((student) => {
        const searchLower = (searchTerm || "").toLowerCase();

        const rollNo = student?.roll_no ? String(student.roll_no) : "";
        const studentName = [
          student?.first_name,
          student?.mid_name,
          student?.last_name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        const presentCount = `${student?.present_count || ""}/${
          student?.working_days || ""
        }`.trim();
        const subject =
          student?.subjects
            ?.map((sub) => sub.subject_name)
            ?.join(", ")
            ?.toLowerCase() || "";

        return (
          rollNo.includes(searchLower) ||
          studentName.includes(searchLower) ||
          presentCount.includes(searchLower.replace(/\s+/g, "").trim()) ||
          subject.includes(searchLower)
        );
      })
    : [];

  // Preserve other timetable data
  const filteredSections = {
    students: filteredStudents,
    grand_total_working_days: timetable?.grand_total_working_days || 0,
    total_attendance: timetable?.total_attendance || 0,
    total_present_count: timetable?.total_present_count || 0,
    total_working_days: timetable?.total_working_days || 0,
  };

  // Fix: Keep other data while paginating students
  const displayedSections = {
    students: filteredSections.students.slice(currentPage * pageSize),
    grand_total_working_days: filteredSections.grand_total_working_days,
    total_attendance: filteredSections.total_attendance,
    total_present_count: filteredSections.total_present_count,
    total_working_days: filteredSections.total_working_days,
  };

  // 🔹 Debugging Logs
  console.log("Filtered Sections:", filteredSections);
  console.log("Displayed Sections:", displayedSections);

  return (
    <>
      <div className="w-full md:w-[90%] mx-auto p-4 ">
        <ToastContainer />
        <div className="card p-4 rounded-md ">
          <div className=" card-header mb-4 flex justify-between items-center ">
            <h5 className="text-gray-700 mt-1 text-md lg:text-lg">
              Monthly Attendence Report
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
            <div className=" w-full md:w-[90%] flex justify-center flex-col md:flex-row gap-x-1     ml-0    p-2">
              <div className="w-full md:w-[95%] flex md:flex-row justify-between items-center mt-0 md:mt-4">
                <div className="w-full  md:w-[90%] gap-x-0  md:gap-x-12 flex flex-col gap-y-2 md:gap-y-0 md:flex-row">
                  {/* Class Dropdown */}
                  <div className="w-full md:w-[full] gap-x-2 justify-around my-1 md:my-4 flex md:flex-row">
                    <label
                      className="w-full md:w-[30%] text-md pl-0 md:pl-5 mt-1.5"
                      htmlFor="classSelect"
                    >
                      Class <span className="text-sm text-red-500">*</span>
                    </label>
                    <div className="w-full md:w-[65%]">
                      <Select
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        id="classSelect"
                        value={selectedClass}
                        onChange={handleClassSelect}
                        options={classOptions}
                        placeholder={loading ? "Loading..." : "Select"}
                        isSearchable
                        isClearable
                        className="text-sm"
                        isDisabled={loading}
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            fontSize: ".9em", // Adjust font size for selected value
                            minHeight: "30px", // Reduce height
                          }),
                          menu: (provided) => ({
                            ...provided,
                            fontSize: "1em", // Adjust font size for dropdown options
                          }),
                          option: (provided) => ({
                            ...provided,
                            fontSize: ".9em", // Adjust font size for each option
                          }),
                        }}
                      />
                      {classError && (
                        <div className="h-8 relative ml-1 text-danger text-xs">
                          {classError}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full md:w-[full] gap-x-2 justify-around my-1 md:my-4 flex md:flex-row">
                    <label
                      className="w-full md:w-[40%] text-md pl-0 md:pl-5 mt-1.5"
                      htmlFor="divisionSelect"
                    >
                      Month <span className="text-sm text-red-500">*</span>
                    </label>
                    <div className="w-full md:w-[70%]">
                      <Select
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        id="divisionSelect"
                        value={selectedMonth}
                        onChange={handleMonthSelect}
                        options={monthOptions}
                        placeholder={loading ? "Loading..." : "Select"}
                        isSearchable
                        isClearable
                        className="text-sm"
                        isDisabled={loading}
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            fontSize: ".9em", // Adjust font size for selected value
                            minHeight: "30px", // Reduce height
                          }),
                          menu: (provided) => ({
                            ...provided,
                            fontSize: "1em", // Adjust font size for dropdown options
                          }),
                          option: (provided) => ({
                            ...provided,
                            fontSize: ".9em", // Adjust font size for each option
                          }),
                        }}
                      />
                      {monthError && (
                        <div className="h-8 relative ml-1 text-danger text-xs">
                          {monthError}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Browse Button */}
                  <div className="mt-1">
                    <button
                      type="search"
                      onClick={handleSearch}
                      style={{ backgroundColor: "#2196F3" }}
                      className={`btn h-10 w-18 md:w-auto btn-primary text-white font-bold py-1 border-1 border-blue-500 px-4 rounded ${
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
                </div>
              </div>
            </div>

            {timetable?.students?.length > 0 && (
              <>
                <div className="w-[full]  mt-4 ">
                  <div className="card mx-auto lg:w-full shadow-lg">
                    <div className="p-2 px-3 bg-gray-100 border-none flex justify-between items-center">
                      <div className="w-full flex flex-row justify-between mr-0 md:mr-4 ">
                        <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl text-nowrap">
                          List of Monthly Attendence Report
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
                                "Roll No.",
                                "Student Name",
                                `${
                                  selectedMonth
                                    ? `Present Days / Working Days in ${selectedMonth.label}`
                                    : "Present Days / Working Days"
                                }`,
                                `${
                                  sessionData?.custom_claims?.academic_year
                                    ? `Total Attendance in ${sessionData?.custom_claims?.academic_year}`
                                    : "Total Attendanc"
                                }`,
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
                            {displayedSections?.students?.length ? (
                              <>
                                {displayedSections?.students?.map(
                                  (student, index) => (
                                    <tr
                                      key={student.adm_form_pk}
                                      className="border border-gray-300"
                                    >
                                      <td className="px-2 py-2 text-center border border-gray-300">
                                        {index + 1}
                                      </td>

                                      <td className="px-2 py-2 text-center border border-gray-300">
                                        {/* {console.log(student?.roll_no)} */}
                                        {student?.roll_no}
                                      </td>
                                      <td className="px-2 py-2 text-nowrap text-center border border-gray-300">
                                        {[
                                          student.first_name,
                                          student.mid_name,
                                          student.last_name,
                                        ]
                                          .filter(Boolean) // Removes empty or undefined values
                                          .map(
                                            (word) =>
                                              word.charAt(0).toUpperCase() +
                                              word.slice(1).toLowerCase()
                                          ) // Capitalizes each word properly
                                          .join(" ")}
                                      </td>
                                      <td className="px-2 py-2 text-center border border-gray-300">
                                        {"'"}
                                        {student?.present_count || " "}
                                        {"/"}
                                        {student?.working_days || " "}
                                        {"'"}
                                      </td>
                                      <td className="px-2 py-2 text-center border border-gray-300">
                                        {"'"}
                                        {student?.total_attendance == null
                                          ? " "
                                          : student?.total_attendance}
                                        {" / "}
                                        {student?.total_attendance_till_a_month ==
                                        null
                                          ? " "
                                          : student?.total_attendance_till_a_month}
                                        {"'"}
                                      </td>
                                    </tr>
                                  )
                                )}

                                <tr className="border border-gray-300 font-semibold">
                                  <td
                                    className="px-2 py-2 text-center border border-gray-300"
                                    colSpan={3}
                                  >
                                    Total
                                  </td>
                                  <td
                                    className="px-2 py-2 text-center border border-gray-300"
                                    colSpan={1}
                                  >
                                    {"'"}
                                    {displayedSections?.total_present_count ==
                                    null
                                      ? " "
                                      : displayedSections?.total_present_count}
                                    {"/"}
                                    {displayedSections?.total_working_days ==
                                    null
                                      ? " "
                                      : displayedSections?.total_working_days}
                                    {"'"}
                                  </td>
                                  <td
                                    className="px-2 py-2 text-center border border-gray-300"
                                    colSpan={1}
                                  >
                                    {"'"}
                                    {displayedSections?.total_attendance}
                                    {" / "}
                                    {
                                      displayedSections?.grand_total_working_days
                                    }
                                    {"'"}
                                  </td>
                                </tr>
                              </>
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

export default MonthlyAttendenceReport;
