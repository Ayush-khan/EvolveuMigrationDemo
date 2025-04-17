import React, { useMemo, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import { faEdit, faTrash, faPrint } from "@fortawesome/free-solid-svg-icons";
import { RxCross1 } from "react-icons/rx";

const TimeTable = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [selectedClass, setSelectedClass] = useState(null);
  const [loadingClasses] = useState(false); // setLoadingClasses
  const [classError, setClassError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); //loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classes, setClasses] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useState("");

  const [timetable, setTimetable] = useState(null);
  const [showTimetable, setShowTimetable] = useState(false);
  const [selectedDay, setSelectedDay] = useState(false);
  const [currentTimetable, setCurrentTimetable] = useState(null);
  const [loadingForSearch, setLoadingForSearch] = useState(false);

  const classOptions = useMemo(
    () =>
      classes.map((cls) => ({
        value: { class_id: cls.class_id, section_id: cls.section_id }, // Store both values
        label: `${cls?.get_class?.name} ${cls.name}`, // Display class name & section
      })),
    [classes]
  );

  useEffect(() => {
    fetchClasses();
  }, []);

  // Fetch classes Data
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const classResponse = await axios.get(
        `${API_URL}/api/getallClassWithStudentCount`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(classResponse);
      setClasses(classResponse.data || []);
    } catch (error) {
      toast.error("Error fetching initial data.");
    } finally {
      setLoading(false);
    }
  };

  const handleClassSelect = (selectedOption) => {
    console.log("selected option", selectedOption);
    setSelectedClass(selectedOption);
    setClassError("");
  };

  const handleSearch = async () => {
    setLoadingForSearch(false);
    if (!selectedClass) {
      setClassError("Please select a class.");
      return;
    }
    setLoading(true);
    setClassError("");
    setShowTimetable(true); // Set search action as performed

    try {
      setLoadingForSearch(true);
      const token = localStorage.getItem("authToken");
      const { class_id, section_id } = selectedClass.value;

      const response = await axios.get(
        `${API_URL}/api/get_classtimetable/${class_id}/${section_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("API Response:", response.data);

      if (response.data && response.data.success) {
        setTimetable(response.data.data); // Store timetable data
      } else {
        setTimetable(null);
        toast.error(`Timetable is not created for this class.`);
      }
    } catch (error) {
      console.error("Error fetching timetable:", error);
      toast.error("Error fetching class timetable.");
    } finally {
      setLoading(false);
      setLoadingForSearch(false);
    }
  };

  const handleEdit = (class_id, section_id) => {
    if (!class_id || !section_id) {
      toast.error("Class and Division are required!");
      return;
    }
    console.log("Navigating with:", class_id, section_id);
    navigate(`/editTimeTable/${class_id}/${section_id}`);
  };

  const handleDelete = (class_id, section_id) => {
    console.log("class id", { class_id, section_id });
    if (!class_id || !section_id) {
      toast.error("Invalid class data.");
      return;
    }
    setCurrentTimetable({ class_id, section_id }); // ✅ Correctly updating state
    setShowDeleteModal(true);
  };

  const handleSubmitDelete = async () => {
    if (!currentTimetable.class_id || !currentTimetable.section_id) {
      toast.error("Invalid class selection.");
      return;
    }
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Authentication failed. Please login again.");
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await axios.delete(
        `${API_URL}/api/delete_timetable/${currentTimetable.class_id}/${currentTimetable.section_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Timetable deleted successfully");
        handleCloseModal();
        setTimetable(); // ✅ Re-fetch updated timetable from the API
        setSelectedClass(null);
      } else {
        toast.error("Failed to delete timetable. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting timetable:", error);
      toast.error("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
  };

  const handlePrint = () => {
    if (!timetable || !selectedClass) {
      alert("Please select a class and ensure timetable data is available.");
      return;
    }
    const periods = Object.keys(timetable).reduce((acc, day) => {
      timetable[day].forEach((lecture, index) => {
        if (!acc[index]) acc[index] = { period_no: index + 1 };
        acc[index][day] = lecture;
      });
      return acc;
    }, []);

    const printTitle = `TimeTable for ${selectedClass.label}`;

    const printContent = `
      <div id="tableMain" class="flex items-center justify-center min-h-screen bg-white">
        <h5 class="text-lg font-semibold border border-black">${printTitle}</h5>
        <div id="tableHeading" class="text-center w-full">
          <table border="1" class="table">
            <thead class="bg-gray-200">
              <tr class="bg-gray-100">
                <th class="px-3 py-2 border border-black text-sm font-semibold">Period No.</th>
                <th class="px-3 py-2 border border-black text-sm font-semibold">Monday</th>
                <th class="px-3 py-2 border border-black text-sm font-semibold">Tuesday</th>
                <th class="px-3 py-2 border border-black text-sm font-semibold">Wednesday</th>
                <th class="px-3 py-2 border border-black text-sm font-semibold">Thursday</th>
                <th class="px-3 py-2 border border-black text-sm font-semibold">Friday</th>
                <th class="px-3 py-2 border border-black text-sm font-semibold">Saturday</th>
              </tr>
            </thead>
            <tbody>
              ${periods
                .map((entry, index) => {
                  const assemblyRow =
                    index === 0
                      ? `<tr class="text-sm bg-blue-100">
                          <td class="px-3 py-2 border border-black font-semibold" colspan="7">Assembly 8.00 - 8.30</td>
                        </tr>`
                      : "";

                  const rowBgColor =
                    index % 2 === 0 ? "bg-white" : "bg-gray-100";
                  const rowContent = `
                    <tr class="text-sm ${rowBgColor}">
                      <td class="px-3 py-2 border border-black">${
                        index + 1
                      }</td>
                      ${[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ]
                        .map((day) => {
                          const lecture = entry[day] || {};
                          const subject = lecture.subject || " ";
                          // const timeIn = lecture.time_in || " ";
                          // const timeOut = lecture.time_out || " ";
                          const teacherArray = Array.isArray(lecture.teacher)
                            ? lecture.teacher
                                .map((t) =>
                                  t.t_name
                                    .toLowerCase()
                                    .replace(/\b\w/g, (char) =>
                                      char.toUpperCase()
                                    )
                                )
                                .join(", ")
                            : "";

                          return `<td class="px-3 py-2 border border-black">
                                    <b>${subject}</b><br>
                                    
                                    ${teacherArray}
                                  </td>`;
                        })
                        .join("")}
                    </tr>`;
                  // ${timeIn} - ${timeOut}<br>

                  const shortBreakRow =
                    index === 1
                      ? `<tr class="text-sm bg-yellow-500">
                          <td class="px-3 py-2 border border-black font-semibold" colspan="7">Short Break 9.45 - 10.00</td>
                        </tr>`
                      : "";

                  const longBreakRow =
                    index === 4
                      ? `<tr class="text-sm bg-red-500">
                          <td class="px-3 py-2 border border-black font-semibold" colspan="7">Long Break 11.45 - 12.15</td>
                        </tr>`
                      : "";

                  return (
                    assemblyRow + rowContent + shortBreakRow + longBreakRow
                  );
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </div>`;

    const printWindow = window.open("", "_blank", "height=1000,width=1200");

    printWindow.document.write(`
      <html>
      <head>
        <title>${printTitle}</title>
       <style>
            @page { 
                size: A4 landscape; /* Wider format for better fit */
                margin: 10px; 
            }

            body { 
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            /* Scrollable container */
            #printContainer {
                width: 100%;
                overflow-x: auto;  /* Enables horizontal scrolling */
                white-space: nowrap; /* Prevents text wrapping */
            }

            #tableMain {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 0 10px;
            }

            table {
                border-spacing: 0;
                width: 90vw;
                min-width: 1200px; /* Ensures table doesn't shrink */
           margin: auto;
                table-layout: fixed; /* Ensures even column spacing */
            }

            th, td {
                border: 1px solid gray;
                padding: 8px;
                text-align: center;
                font-size: 12px;
                word-wrap: break-word; /* Ensures text breaks properly */
            }

            th {
                font-size: 0.8em;
                background-color: #f9f9f9;
            }

            .student-photo {
                width: 30px !important;
                height: 30px !important;
                object-fit: cover;
                border-radius: 50%;
            }

            /* Ensure scrolling is available in print mode */
            @media print {
                #printContainer {
                    overflow-x: auto;
                    display: block;
                    width: 100%;
                    height: auto;
                }
                table {
                    min-width: 100%;
                }
            }
        </style>
      </head>
      <body>
        ${printContent} 
      </body>
      </html>`);

    // printWindow.document.close();
    // printWindow.print();
    // console.log(printContent);
    printWindow.document.close();

    // Ensure content is fully loaded before printing
    printWindow.onload = function () {
      printWindow.focus();
      printWindow.print();
      printWindow.close(); // Optional: close after printing
    };
  };

  return (
    <>
      <ToastContainer />
      {!(showTimetable && timetable) && (
        <div className="container mx-auto md:mt-2">
          <div className="card mx-auto w-full md:w-[80%] lg:w-3/4 shadow-lg">
            <div className="p-2 px-3 bg-gray-100 flex justify-between items-center">
              <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl">
                TimeTable
              </h3>
              <button
                className="btn btn-primary btn-sm"
                // onClick={() => navigate("/createTimeTable")}
                onClick={() => navigate("/createTimetablePlanner")}
              >
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }} />
                Add
              </button>
            </div>
            <div
              className="relative w-[97%] mb-3 h-1 mx-auto"
              style={{ backgroundColor: "#C03078" }}
            ></div>
            <div className="mb-4">
              <div className="w-full md:w-[80%] mx-auto">
                <div className="max-w-full bg-white shadow-md rounded-lg border border-gray-300 mx-auto mt-6 p-6">
                  <div className="w-full flex flex-col md:flex-row items-center justify-center gap-2">
                    {/* Class Select Section */}
                    <div className="flex items-center gap-x-6">
                      <label
                        htmlFor="classSection"
                        className="text-sm md:text-base"
                      >
                        Class <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[200px]">
                        <Select
                          id="classSelect"
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                          value={selectedClass}
                          onChange={handleClassSelect}
                          options={classOptions}
                          placeholder={
                            loadingClasses ? "Loading classes..." : "Select"
                          }
                          isSearchable
                          isClearable
                          isDisabled={loadingClasses}
                          className="text-sm"
                        />
                        {classError && (
                          <div className="text-danger text-xs mt-1">
                            {classError}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Search Button */}
                    {/* <button
                      className="btn btn-primary btn-sm md:h-9 text-xs md:text-sm px-4"
                      onClick={handleSearch}
                    >
                      Search
                    </button> */}
                    <div className="mt-1 ">
                      <button
                        type="search"
                        onClick={handleSearch}
                        style={{ backgroundColor: "#2196F3" }}
                        className={` btn h-10 w-18 md:w-auto btn-primary text-white font-bold py-1 border-1 border-blue-500 px-4 rounded  gap-x-6${
                          loadingForSearch
                            ? "opacity-50 cursor-not-allowed"
                            : ""
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
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <div className="px-4 py-3 border-x-gray-200 mx-auto w-full md:w-[60%]">
          {showTimetable && timetable && (
            <>
              {/* Day Selector Buttons */}
              <div className="p-3 border bg-white rounded-lg shadow-md text-center">
                <div className="relative w-full mb-3">
                  {/* Centered Class Label */}
                  <h3 className="text-pink-600 font-extrabold text-center text-base md:text-lg absolute left-1/2 transform -translate-x-1/2">
                    Timetable - {selectedClass.label}
                  </h3>

                  {/* Print Button Aligned Right */}
                  {/* <div className="flex justify-end">
                    <button
                      className="px-2 py-2 text-sm md:text-md bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all flex items-center gap-2"
                      onClick={handlePrint}
                    >
                      <FontAwesomeIcon icon={faPrint} />
                    </button>
                    <RxCross1
                      className=" relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                      onClick={() => {
                        navigate("/dashboard");
                      }}
                    />
                  </div> */}
                  <div className="flex justify-end items-center gap-2">
                    {/* <button
                      className="px-3 py-2 text-sm md:text-md bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all flex items-center gap-2"
                      onClick={handlePrint}
                    >
                      <FontAwesomeIcon icon={faPrint} />
                    </button> */}
                    <button
                      className="px-2 py-2 text-sm md:text-md bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all flex items-center gap-2"
                      onClick={handlePrint}
                    >
                      <FontAwesomeIcon icon={faPrint} />
                    </button>

                    {/* <button
                      onClick={() => navigate("/timeTable")}
                      className="p-2 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-md transition-all"
                    >
                      <RxCross1 className="text-sm" />
                    </button> */}
                    <button
                      onClick={() => {
                        setShowTimetable(false);
                        setTimetable(null);
                        setSelectedDay(null); // optional
                        setSelectedClass(null);
                      }}
                      className="p-2 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-md transition-all"
                    >
                      <RxCross1 className="text-sm" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  {Object.keys(timetable).map((day) => (
                    <button
                      key={day}
                      className={`px-4 py-2 rounded-md border transition-all duration-200 ${
                        selectedDay === day
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 hover:bg-pink-600 hover:text-white"
                      }`}
                      onClick={() => setSelectedDay(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timetable Display */}
              {/* {selectedDay && (
                <div className="p-4 text-center mx-auto">
                  <div className="space-y-2">
                    <div className="border rounded-lg px-6 py-2 shadow-sm bg-gray-300 text-left">
                      <div className="flex flex-col sm:flex-row items-center text-md font-medium gap-2 ">
                        {" "}
                       
                        <span className="w-[30%] font-bold"></span>
                        <span className="font-bold">Assembly</span>
                        <span className="font-bold">8.00 - 8.30</span>
                      </div>
                    </div>

                    {timetable[selectedDay].map((lecture, index) => (
                      <React.Fragment key={index}>
                        
                        <div className="border rounded-lg px-4 py-2 shadow-sm bg-gray-100 text-left min-h-[60px] flex items-center">
                          <div className="flex flex-row justify-between items-center text-md font-medium w-full">
                            <span className="w-[17%] text-left pl-3">
                              {lecture.period_no}
                            </span>
                            <span className="w-[25%] text-center">
                              {lecture.subject}
                            </span>
                            <span className="w-[35%] text-right">
                              {lecture.teacher?.[0]?.t_name || ""}
                            </span>
                          </div>
                        </div>

                        
                        {index === 1 && (
                          <div className="border rounded-lg px-6 py-2 shadow-sm bg-gray-300 text-left">
                            <div className="flex flex-col sm:flex-row items-center text-md font-medium gap-2">
                              <span className="w-[30%] font-bold"></span>
                              <span className="font-bold">Short Break</span>
                              <span className="font-bold">9.45 - 10.00</span>
                            </div>
                          </div>
                        )}
                        {index === 4 && (
                          <div className="border rounded-lg px-6 py-2 shadow-sm bg-gray-300 text-left">
                            <div className="flex flex-col sm:flex-row items-center text-md font-medium gap-2">
                              <span className="w-[30%] font-bold"></span>
                              <span className="font-bold">Long Break</span>
                              <span className="font-bold">11.45 - 12.15</span>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )} */}

              {selectedDay && (
                <>
                  {timetable[selectedDay] &&
                  timetable[selectedDay].length > 0 ? (
                    <div className="p-4 text-center mx-auto">
                      <div className="space-y-2">
                        {/* Assembly Block */}
                        <div className="border rounded-lg px-6 py-2 shadow-sm bg-gray-300 text-left">
                          <div className="flex flex-col sm:flex-row items-center text-md font-medium gap-2">
                            <span className="w-[35%] font-bold"></span>
                            <span className="font-bold">Assembly</span>
                            <span className="font-bold">8.00 - 8.30</span>
                          </div>
                        </div>

                        {timetable[selectedDay].map((lecture, index) => (
                          <React.Fragment key={index}>
                            {/* Lecture Block */}
                            <div className="border rounded-lg px-4 py-2 shadow-sm bg-gray-100 text-left min-h-[60px] flex items-center">
                              <div className="flex flex-row justify-between items-center text-md font-medium w-full">
                                <span className="w-[25%] text-left pl-3">
                                  {lecture.period_no}
                                </span>
                                <span className="w-[25%] text-center">
                                  {lecture.subject}
                                </span>
                                <span className="w-[35%] text-right">
                                  {lecture.teacher?.[0]?.t_name || ""}
                                </span>
                              </div>
                            </div>

                            {/* Breaks */}
                            {index === 1 && (
                              <div className="border rounded-lg px-6 py-2 shadow-sm bg-gray-300 text-left">
                                <div className="flex flex-col sm:flex-row items-center text-md font-medium gap-2">
                                  <span className="w-[32%] font-bold"></span>
                                  <span className="font-bold">Short Break</span>
                                  <span className="font-bold">
                                    9.45 - 10.00
                                  </span>
                                </div>
                              </div>
                            )}
                            {index === 4 && (
                              <div className="border rounded-lg px-6 py-2 shadow-sm bg-gray-300 text-left">
                                <div className="flex flex-col sm:flex-row items-center text-md font-medium gap-2">
                                  <span className="w-[32%] font-bold"></span>
                                  <span className="font-bold">Long Break</span>
                                  <span className="font-bold">
                                    11.45 - 12.15
                                  </span>
                                </div>
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-black-500 font-extrabold">
                      No lectures for {selectedDay}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="flex justify-between p-3">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <RxCross1
                    className="relative mt-2 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                    onClick={handleCloseModal} // ✅ Close modal on click
                  />
                </div>
                <div
                  className="relative mb-3 h-1 w-[97%] mx-auto bg-red-700"
                  style={{ backgroundColor: "#C03078" }}
                ></div>
                <div className="modal-body">
                  Are you sure you want to delete this timetable?
                </div>
                <div className="flex justify-end p-3">
                  <button
                    type="button"
                    className="btn btn-danger px-3 mb-2"
                    onClick={() => {
                      setIsSubmitting(true);
                      handleSubmitDelete(currentTimetable);
                    }}
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
    </>
  );
};

export default TimeTable;
