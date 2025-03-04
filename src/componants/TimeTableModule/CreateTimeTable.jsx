import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { useMemo, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { RxCross1 } from "react-icons/rx";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import axios from "axios";

const CreateTimeTable = () => {
  const API_URL = import.meta.env.VITE_API_URL; // Ensure this is correctly defined in your .env
  const [classesforForm, setClassesforForm] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [classError, setClassError] = useState("");
  const navigate = useNavigate();

  const [divisionforForm, setDivisionForForm] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [loadingDivision, setLoadingDivision] = useState(false);
  const [divisionError, setDivisionError] = useState("");

  const [selectedMonFri, setSelectedMonFri] = useState(null);
  const [selectedSat, setSelectedSat] = useState(null);
  const [monFriLectures, setMonFriLectures] = useState([]);
  const [satLectures, setSatLectures] = useState([]);

  const [loadingForSearch, setLoadingForSearch] = useState(false);
  const [classIdForSearch, setClassIdForSearch] = useState(null);
  const [sectionIdForSearch, setSectionIdForSearch] = useState(null);

  const [timetable, setTimetable] = useState([]);
  const [dates, setDates] = useState([]);

  const [selectedTime, setSelectedTime] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [satStartTime, setSatStartTime] = useState("");
  const [satEndTime, setSatEndTime] = useState("");

  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [selectedSubjects, setSelectedSubjects] = useState({});

  const [lectureCount, setLectureCount] = useState(8); // Default value for Mon-Fri
  const [satLectureCount, setSatLectureCount] = useState(5); // Default for Sat

  const [loading, setLoading] = useState(false);
  const [lecturesPerWeek, setLecturesPerWeek] = useState("");
  const [saturdayLectures, setSaturdayLectures] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [showTimeTable, setShowTimeTable] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});

  //Fetch Subjects Data
  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("Authorization token is missing. Please log in again.");
        return;
      }

      // Ensure classId and sectionId are selected
      if (!classIdForSearch || !sectionIdForSearch) {
        toast.warning("Please select a class and section first.");
        return;
      }

      // Updated API URL with dynamic class_id and section_id
      const response = await axios.get(
        `${API_URL}/api/get_subjectfortimetable?class_id=${classIdForSearch}&section_id=${sectionIdForSearch}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Subjects Response:", response.data); // Debug log

      if (response.data && response.data.data) {
        setSubjects(response.data.data); // Set subjects from API response
      } else {
        setSubjects([]); // Empty array if no subjects are returned
        toast.warning("No subjects available.");
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to fetch subjects. Please try again later.");
    } finally {
      setLoadingSubjects(false); // Ensure the loader state is updated
    }
  };

  const handleSubjectSelect = (dayIndex, lectureIndex, selectedOption) => {
    setSelectedSubjects((prev) => {
      // Ensure the dayIndex exists
      const updatedDay = prev[dayIndex] || { lectures: [] };

      // Ensure the lectureIndex exists in lectures
      const updatedLectures = [...(updatedDay.lectures || [])];
      updatedLectures[lectureIndex] = {
        subject: { sm_id: selectedOption },
      };

      return {
        ...prev,
        [dayIndex]: { ...updatedDay, lectures: updatedLectures },
      };
    });
  };

  useEffect(() => {
    fetchClasses();

    if (classIdForSearch && sectionIdForSearch) {
      fetchSubjects(); // No need to pass parameters, it uses state variables
    }
  }, [classIdForSearch, sectionIdForSearch]); // Runs when classIdForSearch OR sectionIdForSearch changes

  // Fetch Classes Data
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

  // Fetch Divisions Data
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

  const handleClassSelect = (selectedOption) => {
    setSelectedClass(selectedOption);
    setClassError("");
    setSelectedDivision(null); // Reset division dropdown
    setDivisionForForm([]); // Clear division options
    setClassIdForSearch(selectedOption?.value);

    if (selectedOption) {
      fetchDivisions(selectedOption.value); // Fetch divisions for the selected class
    }
  };

  const handleDivisionSelect = (selectedOption) => {
    setSelectedDivision(selectedOption); // Ensure correct value is set
    setSectionIdForSearch(selectedOption?.value);
  };

  const classOptions = useMemo(
    () =>
      classesforForm.map((cls) => ({
        value: cls.class_id,
        label: cls.name,
      })),
    [classesforForm]
  );

  const divisionOptions = useMemo(() => {
    if (!Array.isArray(divisionforForm)) return [];
    return divisionforForm.map((div) => ({
      value: div.section_id, // Using 'section_id' as the value
      label: div.name, // Using 'name' as the label
    }));
  }, [divisionforForm]);

  // Generate Lectures Options
  const generateLectureOptions = (count) => {
    let options = [];
    for (let i = 1; i <= count; i++) {
      options.push({ value: `Lecture ${i}`, label: `Lecture ${i}` });
    }
    return options;
  };

  // generate for mon-fri lectures
  const handleMonFriSelect = (selectedOption) => {
    setSelectedMonFri(selectedOption);
    const numLectures = parseInt(selectedOption.value, 10);
    setMonFriLectures(
      Array.from({ length: numLectures }, (_, index) => index + 1)
    );
  };

  // generate for sat lectures
  const handleSatSelect = (selectedOption) => {
    setSelectedSat(selectedOption);
    const numLectures = parseInt(selectedOption.value, 10);
    setSatLectures(
      Array.from({ length: numLectures }, (_, index) => index + 1)
    );
  };

  const handleTimeChange = (lecIndex, field, value) => {
    // Update state with selected time values
    console.log(`Lecture ${lecIndex + 1}, ${field}: ${value}`);
  };

  const generateTimeSlots = (startHour = 8, endHour = 14.3, interval = 30) => {
    const slots = [];
    const startTime = startHour * 60;
    const endTime = endHour * 60;
    for (let time = startTime; time < endTime; time += interval) {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHour = hours > 12 ? hours - 12 : hours;
      const formattedMinutes = minutes === 0 ? "00" : minutes;
      slots.push(`${formattedHour}:${formattedMinutes} ${ampm}`);
    }
    return slots;
  };

  const getFilteredEndTimeOptions = (rowIndex) => {
    const startTime = timetable[rowIndex]?.startTime;
    if (startTime) {
      const startMinutes = convertToMinutes(startTime);
      return timeOptions.filter(
        (time) => convertToMinutes(time) > startMinutes
      );
    }
    return timeOptions;
  };

  const getFilteredSatEndTimeOptions = (rowIndex) => {
    const startTime = timetable[rowIndex]?.satStartTime;
    if (startTime) {
      const startMinutes = convertToMinutes(startTime);
      return satTimeOptions.filter(
        (time) => convertToMinutes(time) > startMinutes
      );
    }
    return satTimeOptions;
  };

  const timeOptions = generateTimeSlots();
  const satTimeOptions = generateTimeSlots(8, 11.5);

  const handleAdd = async () => {
    if (!selectedClass) {
      toast.error("Please select Class");
      return;
    }
    if (!selectedDivision) {
      toast.error("Please select Division");
      return;
    }
    if (!selectedMonFri || !selectedSat) {
      toast.error("Please select both Mon-Fri and Sat lecture counts.");
      return;
    }

    const monFriLectureCount =
      parseInt(selectedMonFri.value.split(" ")[1]) || 0;
    const satLectureCount = parseInt(selectedSat.value.split(" ")[1]) || 0;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Authorization token is missing. Please log in again.");
        return;
      }

      const params = {
        lectures_per_week: monFriLectureCount,
        saturday_lectures: satLectureCount,
        class_id: selectedClass.value,
        section_id: selectedDivision.value,
      };

      console.log("Sending API request with params:", params);

      const response = await axios.get(
        `${API_URL}/api/get_fieldsfortimetable`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      console.log("API Response--->:", response.data.data);

      const timetableData = response.data.data || {}; // ✅ Prevent `undefined/null`

      if (response.data.success && timetableData) {
        setShowTimeTable(true);
        const formattedTimetable = Object.entries(timetableData || {}).map(
          ([day, lectures]) => ({
            day,
            lectures: Array.isArray(lectures) ? lectures : [],
          })
        );
        setTimetable(formattedTimetable);
        console.log("Final Timetable:", formattedTimetable);
        console.log("setTimeTable is--->", timetable);
        // ✅ Check if there are subjects
        const hasSubjects = formattedTimetable.some((entry) =>
          entry.lectures.some(
            (lecture) =>
              Array.isArray(lecture.subject) && lecture.subject.length > 0
          )
        );
        console.log("HasSubject--->", hasSubjects);
        if (!hasSubjects) {
          toast.warning("No subjects found. Please fill in the timetable.");
        } else {
          toast.success("Timetable loaded successfully!");
        }
      } else {
        setTimetable([]); // ✅ Ensure it's always an array
        toast.error("Invalid timetable data from API.");
      }
    } catch (error) {
      console.error("Error fetching timetable fields:", error);
      toast.error("Failed to fetch timetable fields. Please try again later.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="w-full mx-auto md:mt-4">
        {/* Outer Box */}
        <div className="bg-white shadow-xl rounded-lg border border-pink-500 p-4 lg:w-5/6 mb-0 mx-auto">
          {/* Header */}
          <div className="p-2 px-3 bg-gray-100 flex justify-between items-center rounded-t-lg">
            <h3 className="text-gray-700 mt-1 text-[1.2em] lg:text-xl">
              Create Time Table
            </h3>
            <RxCross1
              className="float-end relative right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
              onClick={() => {
                // setErrors({});
                navigate("/timeTable");
              }}
            />
          </div>
          {/* Divider */}
          <div
            className="relative w-full h-1 mb-3 mx-auto"
            style={{ backgroundColor: "#C03078" }}
          ></div>
          {/* Form Box */}
          <div className="w-full mx-auto pt-3 pb-3">
            <div className="w-[95%] mx-auto">
              {/* Form Group Box */}
              <div className="border border-pink-500 p-3 rounded-lg shadow-md">
                {/* Class and Division Row */}
                <div className="flex items-center">
                  <div className="w-[25%] p-3">
                    <label
                      htmlFor="classSelect"
                      className="block text-gray-700"
                    >
                      Class <span className="text-red-500">*</span>
                    </label>
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
                  <div className="w-[25%] p-3">
                    <label
                      htmlFor="divisionSelect"
                      className="block text-gray-700"
                    >
                      Division <span className="text-red-500">*</span>
                    </label>
                    <Select
                      id="divisionSelect"
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      value={selectedDivision}
                      onChange={handleDivisionSelect}
                      options={divisionOptions}
                      placeholder={
                        loadingDivision ? "Loading divisions..." : "Select"
                      }
                      isSearchable
                      isClearable
                      isDisabled={loadingDivision}
                      className="text-sm"
                    />
                    {divisionError && (
                      <div className="text-red-500 text-xs mt-1">
                        {divisionError}
                      </div>
                    )}
                  </div>
                  {/* </div> */}
                  {/* Mon-Fri and Sat Row */}
                  {/* <div className="w-full flex justify-between items-center mb-4"> */}
                  {/* Mon-Fri Dropdown */}
                  <div className="w-[25%] p-3">
                    <label
                      htmlFor="monFriSelect"
                      className="block text-gray-700"
                    >
                      Mon-Fri <span className="text-red-500">*</span>
                    </label>
                    <Select
                      id="monFriSelect"
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      value={selectedMonFri}
                      onChange={handleMonFriSelect}
                      options={generateLectureOptions(lectureCount)} // Use the function here
                      placeholder="Select Lecture"
                      isSearchable
                      isClearable
                      className="text-sm"
                    />
                  </div>
                  {/* Sat Dropdown */}
                  <div className="w-[25%] p-3">
                    <label htmlFor="satSelect" className="block text-gray-700">
                      Sat <span className="text-red-500">*</span>
                    </label>
                    <Select
                      id="satSelect"
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      value={selectedSat}
                      onChange={handleSatSelect}
                      options={generateLectureOptions(satLectureCount)} // Use the function here
                      placeholder="Select Lecture"
                      isSearchable
                      isClearable
                      className="text-sm"
                    />
                  </div>
                  {/* </div> */}
                  {/* Submit Button */}
                  {/* <div className="flex justify-end mt-4"> */}
                  <button
                    type="search"
                    onClick={handleAdd}
                    style={{ backgroundColor: "#2196F3" }}
                    className={`mt-4 my-1 md:my-4 btn h-10 w-18 md:w-auto btn-primary text-white font-bold py-1 border-1 border-blue-500 px-4 rounded ${
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
                      "Add"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-[95%] bg-white shadow-xl rounded-lg border border-pink-500 mx-auto mt-3">
        <div className="overflow-x-auto p-4">
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2 font-semibold text-center">Sr No.</th>
                {timetable.map((day, index) => (
                  <th
                    key={index}
                    className="border p-2 font-semibold text-center"
                  >
                    {day.day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-50">
              {timetable.length > 0 &&
                [
                  ...Array(
                    Math.max(...timetable.map((day) => day.lectures.length))
                  ),
                ].map((_, lectureIndex) => (
                  <tr key={lectureIndex}>
                    <td className="border p-1 text-center">
                      {lectureIndex + 1}
                    </td>

                    {timetable.map((day, dayIndex) => (
                      <td key={dayIndex} className="border border-gray-300 p-2">
                        {/*Ensure lecture exists for this day */}
                        {console.log(
                          "day.lectures[lectureIndex]--->Start",
                          day.lectures[lectureIndex]?.["Time In"]
                        )}
                        {console.log(
                          "Lecture Data:",
                          day.lectures[lectureIndex]
                        )}
                        {console.log(
                          "Time In--->:",
                          day.lectures[lectureIndex]?.["Time In"]
                        )}
                        {console.log(
                          "Time Out--->:",
                          day.lectures[lectureIndex]?.["Time Out"]
                        )}
                        {console.log(
                          "Sat Time In--->:",
                          day.lectures[lectureIndex]?.["Sat Time In"]
                        )}
                        {console.log(
                          "Sat Time Out--->:",
                          day.lectures[lectureIndex]?.["Sat Time Out"]
                        )}
                        {day.lectures[lectureIndex] ? (
                          <>
                            {day.lectures[lectureIndex] &&
                            (day.lectures[lectureIndex]?.["Time In"] == "" ||
                              day.lectures[lectureIndex]?.["Time Out"] == "" ||
                              day.lectures[lectureIndex]?.["Sat Time In"] ==
                                " " ||
                              day.lectures[lectureIndex]?.["Sat Time Out"] ==
                                " ") ? (
                              <>
                                {/* Mon-Fri Time Dropdowns */}
                                {dayIndex < 5 ? (
                                  <>
                                    <select
                                      className="w-full px-1 py-1 border border-gray-300"
                                      value={
                                        day.lectures[lectureIndex]?.[
                                          "Time In"
                                        ] || ""
                                      }
                                      onChange={(e) =>
                                        handleStartSelect(
                                          dayIndex,
                                          lectureIndex,
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="">Select Time-In</option>
                                      {timeOptions.map((time, i) => (
                                        <option key={i} value={time}>
                                          {time}
                                        </option>
                                      ))}
                                    </select>

                                    <select
                                      className="w-full px-1 py-1 border border-gray-300 mt-1"
                                      value={
                                        day.lectures[lectureIndex]?.[
                                          "Time Out"
                                        ] || ""
                                      }
                                      onChange={(e) =>
                                        handleEndSelect(
                                          dayIndex,
                                          lectureIndex,
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="">Select Time-Out</option>
                                      {getFilteredEndTimeOptions(
                                        dayIndex,
                                        lectureIndex
                                      ).map((time, i) => (
                                        <option key={i} value={time}>
                                          {time}
                                        </option>
                                      ))}
                                    </select>
                                  </>
                                ) : (
                                  // Saturday Time Dropdowns
                                  <>
                                    <select
                                      className="w-full px-1 py-1 border border-gray-300"
                                      value={
                                        day.lectures[lectureIndex]?.[
                                          "Sat Time In"
                                        ] || ""
                                      }
                                      onChange={(e) =>
                                        handleSatStartSelect(
                                          dayIndex,
                                          lectureIndex,
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="">Select Time-In</option>
                                      {satTimeOptions.map((time, i) => (
                                        <option key={i} value={time}>
                                          {time}
                                        </option>
                                      ))}
                                    </select>
                                    <select
                                      className="w-full px-1 py-1 border border-gray-300 mt-1"
                                      value={
                                        day.lectures[lectureIndex]?.[
                                          "Sat Time Out"
                                        ] || ""
                                      }
                                      onChange={(e) =>
                                        handleSatEndSelect(
                                          dayIndex,
                                          lectureIndex,
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="">Select Time-Out</option>
                                      {getFilteredSatEndTimeOptions(
                                        dayIndex,
                                        lectureIndex
                                      ).map((time, i) => (
                                        <option key={i} value={time}>
                                          {time}
                                        </option>
                                      ))}
                                    </select>
                                  </>
                                )}
                              </>
                            ) : (
                              // Only show Subject Dropdown when there is a lecture and no time fields exist
                              day.lectures[lectureIndex]?.subject && (
                                <select
                                  className="w-full px-1 py-1 border border-gray-300 mt-1"
                                  value={
                                    selectedSubjects[dayIndex]?.lectures[
                                      lectureIndex
                                    ]?.subject?.sm_id || ""
                                  }
                                  onChange={(e) =>
                                    handleSubjectSelect(
                                      dayIndex,
                                      lectureIndex,
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">Select Subject</option>
                                  {subjects.map((subject, i) => (
                                    <option key={i} value={subject.sm_id}>
                                      {subject.name}
                                    </option>
                                  ))}
                                </select>
                              )
                            )}
                          </>
                        ) : (
                          "" // Hide empty cells
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CreateTimeTable;
